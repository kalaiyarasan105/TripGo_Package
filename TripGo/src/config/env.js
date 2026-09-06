/**
 * env.js — Phase 8
 *
 * Centralised environment configuration.
 * Swap API_BASE_URL to point at your real backend server.
 *
 * For production builds, replace these values with environment-specific
 * config loaded from react-native-config or a .env loader.
 */

// Backend API base URL — no trailing slash
export const API_BASE_URL = 'https://api.tripgo.in/v1';

// Request timeout in milliseconds
export const API_TIMEOUT = 15000; // 15 seconds

// App version
export const APP_VERSION = '1.0.0';
export const APP_BUILD = '100';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;

// Feature flags
export const FEATURES = {
  PUSH_NOTIFICATIONS: true,
  ANALYTICS: true,
  DARK_MODE: true,
  REVIEWS: true,
};
