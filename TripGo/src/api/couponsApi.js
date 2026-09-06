/**
 * couponsApi.js — Phase 8
 *
 * Coupon management API calls.
 */

import apiClient from './client';

const couponsApi = {
  /**
   * Get all active/public coupons (for the Coupons/Offers screen).
   * @returns {{ coupons: [] }}
   */
  getActiveCoupons: () => apiClient.get('/coupons?status=active'),

  /**
   * Validate and apply a coupon code.
   * @param {{ code, packageId, subtotal }} data
   * @returns {{ valid, discount, coupon, message }}
   */
  validateCoupon: (data) => apiClient.post('/coupons/validate', data),

  // ── Admin endpoints ──────────────────────────────────────────

  /**
   * Get all coupons (admin only).
   */
  getAllCoupons: () => apiClient.get('/admin/coupons'),

  /**
   * Create a new coupon (admin only).
   */
  createCoupon: (data) => apiClient.post('/admin/coupons', data),

  /**
   * Update a coupon (admin only).
   */
  updateCoupon: (id, data) => apiClient.put(`/admin/coupons/${id}`, data),

  /**
   * Delete a coupon (admin only).
   */
  deleteCoupon: (id) => apiClient.delete(`/admin/coupons/${id}`),

  /**
   * Toggle coupon active/inactive (admin only).
   */
  toggleCouponStatus: (id) =>
    apiClient.patch(`/admin/coupons/${id}/toggle-status`),
};

export default couponsApi;
