/**
 * API barrel export — Phase 8
 *
 * Import all API modules from one place:
 *   import { authApi, packagesApi, bookingsApi } from '../api';
 */

export { default as authApi } from './authApi';
export { default as packagesApi } from './packagesApi';
export { default as bookingsApi } from './bookingsApi';
export { default as couponsApi } from './couponsApi';
export { default as reviewsApi } from './reviewsApi';
export { default as usersApi } from './usersApi';
export { default as apiClient } from './client';
