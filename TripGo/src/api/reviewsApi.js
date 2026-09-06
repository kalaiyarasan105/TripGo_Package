/**
 * reviewsApi.js — Phase 8
 *
 * Reviews API calls.
 */

import apiClient from './client';

const reviewsApi = {
  /**
   * Get approved reviews for a specific package.
   * @returns {{ reviews: [], average, total }}
   */
  getPackageReviews: (packageId, params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit || 10);
    const qs = query.toString();
    return apiClient.get(`/packages/${packageId}/reviews${qs ? '?' + qs : ''}`);
  },

  /**
   * Submit a new review for a completed booking.
   * @param {{ packageId, bookingId, rating, comment }} data
   * @returns {{ review }}
   */
  submitReview: (data) => apiClient.post('/reviews', data),

  /**
   * Get all reviews submitted by the current user.
   * @returns {{ reviews: [] }}
   */
  getMyReviews: () => apiClient.get('/reviews/my'),

  /**
   * Delete the user's own review.
   */
  deleteMyReview: (id) => apiClient.delete(`/reviews/${id}`),

  // ── Admin endpoints ──────────────────────────────────────────

  /**
   * Get all reviews (admin only), optionally filtered by approval status.
   */
  getAllReviews: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    const qs = query.toString();
    return apiClient.get(`/admin/reviews${qs ? '?' + qs : ''}`);
  },

  /**
   * Approve a review (admin only).
   */
  approveReview: (id) => apiClient.patch(`/admin/reviews/${id}/approve`),

  /**
   * Reject/delete a review (admin only).
   */
  deleteReview: (id) => apiClient.delete(`/admin/reviews/${id}`),
};

export default reviewsApi;
