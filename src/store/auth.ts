import { create } from 'zustand';
import storage from '../utils/storage';
import { AuthResult, User } from '../types';
import { authLog } from '../utils/logger';

const ACCESS_KEY = 'echo.accessToken';
const REFRESH_KEY = 'echo.refreshToken';
const USER_KEY = 'echo.user';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  hydrated: boolean;

  hydrate: () => Promise<void>;
  setSession: (result: AuthResult) => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  hydrated: false,

  async hydrate() {
    const [accessToken, refreshToken, userRaw] = await Promise.all([
      storage.getItem(ACCESS_KEY),
      storage.getItem(REFRESH_KEY),
      storage.getItem(USER_KEY),
    ]);
    let user: User | null = null;
    if (userRaw) {
      try {
        user = JSON.parse(userRaw) as User;
      } catch {
        user = null;
      }
    }
    set({ accessToken, refreshToken, user, hydrated: true });
  },

  async setSession(result) {
    authLog.info(`Session established for ${result.user.email ?? result.user.phone ?? result.user._id}`);
    set({ accessToken: result.accessToken, refreshToken: result.refreshToken, user: result.user });
    await Promise.all([
      storage.setItem(ACCESS_KEY, result.accessToken),
      storage.setItem(REFRESH_KEY, result.refreshToken),
      storage.setItem(USER_KEY, JSON.stringify(result.user)),
    ]);
  },

  async setTokens(accessToken, refreshToken) {
    set({ accessToken, refreshToken });
    await Promise.all([
      storage.setItem(ACCESS_KEY, accessToken),
      storage.setItem(REFRESH_KEY, refreshToken),
    ]);
  },

  async setUser(user) {
    set({ user });
    await storage.setItem(USER_KEY, JSON.stringify(user));
  },

  async logout() {
    authLog.info('Logging out — clearing session');
    set({ accessToken: null, refreshToken: null, user: null });
    await Promise.all([
      storage.removeItem(ACCESS_KEY),
      storage.removeItem(REFRESH_KEY),
      storage.removeItem(USER_KEY),
    ]);
  },
}));

/** Non-hook accessors for use inside the axios interceptors. */
export const authAccessor = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  setTokens: (a: string, r: string) => useAuthStore.getState().setTokens(a, r),
  logout: () => useAuthStore.getState().logout(),
};
