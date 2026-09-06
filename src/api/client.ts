import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { authAccessor } from '../store/auth';
import { apiLog } from '../utils/logger';

/**
 * Resolves the API base URL. Priority:
 *   1. EXPO_PUBLIC_API_URL (set in .env / eas env)
 *   2. Platform default for local dev (Android emulator needs 10.0.2.2)
 */
function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  // Backend runs on port 4001 (the Expo dev server uses 4000).
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:4001/api`;
}

export const API_BASE_URL = resolveBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the access token to every request and log the call.
api.interceptors.request.use((config) => {
  const token = authAccessor.getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  apiLog.debug(`→ ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Log every successful response.
api.interceptors.response.use((res) => {
  apiLog.info(`← ${res.status} ${res.config.method?.toUpperCase()} ${res.config.url}`);
  return res;
});

// Refresh-once-on-401 with a shared in-flight promise to avoid stampedes.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = authAccessor.getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    const { accessToken, refreshToken: newRefresh } = res.data as {
      accessToken: string;
      refreshToken: string;
    };
    await authAccessor.setTokens(accessToken, newRefresh);
    return accessToken;
  } catch {
    await authAccessor.logout();
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    apiLog.error(
      `✕ ${status ?? 'ERR'} ${original?.method?.toUpperCase() ?? ''} ${original?.url ?? ''} — ${error.message}`,
    );

    if (status === 401 && original && !original._retry) {
      original._retry = true;
      refreshPromise = refreshPromise ?? refreshAccessToken();
      const newToken = await refreshPromise;
      refreshPromise = null;
      if (newToken) {
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);

/** Normalizes an axios error into a readable message for the UI. */
export function apiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (data?.message) return Array.isArray(data.message) ? data.message[0] : data.message;
    if (error.message) return error.message;
  }
  return fallback;
}
