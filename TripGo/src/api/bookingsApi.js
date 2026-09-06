/**
 * bookingsApi.js — Phase 8
 *
 * Booking lifecycle API calls.
 */

import apiClient from './client';

const bookingsApi = {
  /**
   * Create a new booking.
   * @param {{ packageId, travelDate, adults, children, couponCode, paymentMethod }} data
   * @returns {{ booking }}
   */
  createBooking: (data) => apiClient.post('/bookings', data),

  /**
   * Get all bookings for the current user, optionally filtered by status.
   * @param {{ status, page, limit }} params
   * @returns {{ bookings: [], total }}
   */
  getUserBookings: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit || 20);
    const qs = query.toString();
    return apiClient.get(`/bookings/my${qs ? '?' + qs : ''}`);
  },

  /**
   * Get full details of a single booking.
   * @returns {{ booking }}
   */
  getBookingById: (id) => apiClient.get(`/bookings/${id}`),

  /**
   * Cancel a booking.
   * @returns {{ booking }}
   */
  cancelBooking: (id) => apiClient.patch(`/bookings/${id}/cancel`),

  /**
   * Validate a coupon code against a package and subtotal.
   * @returns {{ valid, discount, coupon }}
   */
  validateCoupon: (code, packageId, subtotal) =>
    apiClient.post('/coupons/validate', { code, packageId, subtotal }),

  // ── Admin endpoints ──────────────────────────────────────────

  /**
   * Get all bookings (admin only), with optional filters.
   * @param {{ status, page, limit }} params
   */
  getAllBookings: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit || 20);
    const qs = query.toString();
    return apiClient.get(`/admin/bookings${qs ? '?' + qs : ''}`);
  },

  /**
   * Update booking status (admin only).
   */
  updateBookingStatus: (id, status) =>
    apiClient.patch(`/admin/bookings/${id}/status`, { status }),
};

export default bookingsApi;
