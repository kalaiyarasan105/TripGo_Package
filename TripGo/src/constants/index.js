/**
 * Constants barrel export
 * Import everything from one place:
 *   import { Colors, Theme, APP_NAME } from '../constants';
 */

export { Colors, default as ColorsDefault } from './colors';
export { Theme, SCREEN_WIDTH, SCREEN_HEIGHT } from './theme';

// ─── App-wide Constants ──────────────────────────────────────────
export const APP_NAME = 'TripGo';
export const APP_VERSION = '1.0.0';

// ─── API (will be used in Phase 9) ───────────────────────────────
export const API_BASE_URL = 'http://10.0.2.2:5000/api';
// 10.0.2.2 is the Android Emulator's alias for localhost on your PC

// ─── AsyncStorage Keys ───────────────────────────────────────────
export const STORAGE_KEYS = {
  USER_TOKEN: '@tripgo_user_token',
  USER_DATA: '@tripgo_user_data',
  DARK_MODE: '@tripgo_dark_mode',
  WISHLIST: '@tripgo_wishlist',
};

// ─── Booking Status Labels ───────────────────────────────────────
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// ─── Payment Methods ─────────────────────────────────────────────
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
  WALLET: 'wallet',
};
