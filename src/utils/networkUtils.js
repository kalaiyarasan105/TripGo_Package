/**
 * networkUtils.js — Phase 9
 *
 * Network connectivity helpers.
 * Uses React Native's built-in NetInfo when available.
 *
 * Install for full functionality:
 *   npm install @react-native-community/netinfo
 */

let NetInfo = null;
try {
  NetInfo = require('@react-native-community/netinfo').default;
} catch (_) {
  // Not installed — all checks assume connected
}

/**
 * Check if the device currently has a network connection.
 * Returns true if connected, false if offline.
 */
export const isConnected = async () => {
  if (!NetInfo) return true; // assume connected if NetInfo not available
  try {
    const state = await NetInfo.fetch();
    return state.isConnected === true;
  } catch {
    return true;
  }
};

/**
 * Subscribe to network state changes.
 * Returns an unsubscribe function.
 *
 * @param {(isOnline: boolean) => void} handler
 */
export const onNetworkChange = (handler) => {
  if (!NetInfo) return () => {};
  const unsubscribe = NetInfo.addEventListener((state) => {
    handler(state.isConnected === true);
  });
  return unsubscribe;
};

/**
 * Execute a function, returning a fallback value if offline.
 * Useful for screens that should show cached data when offline.
 *
 * @param {() => Promise<T>} fn - the async function to run
 * @param {T} fallback - value to return if offline
 */
export const withConnectivity = async (fn, fallback = null) => {
  const online = await isConnected();
  if (!online) {
    console.warn('[Network] Offline — using fallback data');
    return fallback;
  }
  return fn();
};
