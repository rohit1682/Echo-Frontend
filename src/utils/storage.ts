import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Tiny key/value store. Uses Expo SecureStore on native (encrypted keychain /
 * keystore) and localStorage on web. All calls are safe — they never throw, so
 * a missing/blocked store simply reads back null.
 */
const isWeb = Platform.OS === 'web';

async function getItem(key: string): Promise<string | null> {
  try {
    if (isWeb) return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function setItem(key: string, value: string): Promise<void> {
  try {
    if (isWeb) {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch {
    /* ignore */
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    if (isWeb) {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch {
    /* ignore */
  }
}

export default { getItem, setItem, removeItem };
