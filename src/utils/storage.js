/**
 * storage.js — Phase 8
 *
 * AsyncStorage wrapper with JSON serialisation.
 * Provides a safe, consistent API for persisting data on the device.
 *
 * Note: AsyncStorage must be installed separately:
 *   npm install @react-native-async-storage/async-storage
 *
 * Until then, all operations resolve successfully but data is not persisted
 * (in-memory only via the fallback store below).
 */

// ── In-memory fallback (used until AsyncStorage is installed) ───────────────
const _memStore = {};

let AsyncStorage;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (_) {
  // Not installed — use in-memory fallback
  AsyncStorage = null;
}

// ── Storage keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@tripgo/auth_token',
  AUTH_USER: '@tripgo/auth_user',
  THEME: '@tripgo/theme',
  WISHLIST: '@tripgo/wishlist',
  BOOKINGS_CACHE: '@tripgo/bookings_cache',
  NOTIFICATIONS_CACHE: '@tripgo/notifications_cache',
  ONBOARDING_DONE: '@tripgo/onboarding_done',
  LAST_SEARCH: '@tripgo/last_search',
};

// ── Core helpers ─────────────────────────────────────────────────────────────

/**
 * Save a value to storage (serialises objects/arrays to JSON).
 */
export const saveItem = async (key, value) => {
  try {
    const serialised = typeof value === 'string' ? value : JSON.stringify(value);
    if (AsyncStorage) {
      await AsyncStorage.setItem(key, serialised);
    } else {
      _memStore[key] = serialised;
    }
    return true;
  } catch (error) {
    console.warn(`[Storage] Failed to save "${key}":`, error);
    return false;
  }
};

/**
 * Retrieve a value from storage and deserialise JSON automatically.
 * Returns null if the key doesn't exist or on error.
 */
export const getItem = async (key) => {
  try {
    const raw = AsyncStorage
      ? await AsyncStorage.getItem(key)
      : _memStore[key] ?? null;
    if (raw === null || raw === undefined) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw; // plain string
    }
  } catch (error) {
    console.warn(`[Storage] Failed to get "${key}":`, error);
    return null;
  }
};

/**
 * Remove a specific key from storage.
 */
export const removeItem = async (key) => {
  try {
    if (AsyncStorage) {
      await AsyncStorage.removeItem(key);
    } else {
      delete _memStore[key];
    }
    return true;
  } catch (error) {
    console.warn(`[Storage] Failed to remove "${key}":`, error);
    return false;
  }
};

/**
 * Remove all TripGo-owned keys (does not affect other apps' storage).
 */
export const clearAll = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    if (AsyncStorage) {
      await AsyncStorage.multiRemove(keys);
    } else {
      keys.forEach((k) => delete _memStore[k]);
    }
    return true;
  } catch (error) {
    console.warn('[Storage] Failed to clear all:', error);
    return false;
  }
};

// ── Convenience helpers ──────────────────────────────────────────────────────

/** Persist auth session */
export const saveAuthSession = (token, user) =>
  Promise.all([
    saveItem(STORAGE_KEYS.AUTH_TOKEN, token),
    saveItem(STORAGE_KEYS.AUTH_USER, user),
  ]);

/** Retrieve auth session */
export const getAuthSession = async () => {
  const [token, user] = await Promise.all([
    getItem(STORAGE_KEYS.AUTH_TOKEN),
    getItem(STORAGE_KEYS.AUTH_USER),
  ]);
  return { token, user };
};

/** Clear auth session (on logout) */
export const clearAuthSession = () =>
  Promise.all([
    removeItem(STORAGE_KEYS.AUTH_TOKEN),
    removeItem(STORAGE_KEYS.AUTH_USER),
  ]);

/** Save dark mode preference */
export const saveTheme = (isDark) =>
  saveItem(STORAGE_KEYS.THEME, { isDark });

/** Retrieve theme preference */
export const getTheme = () => getItem(STORAGE_KEYS.THEME);

/** Save wishlist */
export const saveWishlist = (items) =>
  saveItem(STORAGE_KEYS.WISHLIST, items);

/** Retrieve wishlist */
export const getWishlist = () => getItem(STORAGE_KEYS.WISHLIST);

/** Mark onboarding as completed */
export const markOnboardingDone = () =>
  saveItem(STORAGE_KEYS.ONBOARDING_DONE, true);

/** Check if onboarding was completed */
export const isOnboardingDone = () => getItem(STORAGE_KEYS.ONBOARDING_DONE);
