/**
 * packagesApi.js — Phase 8
 *
 * Package and destination API calls.
 */

import apiClient from './client';

const packagesApi = {
  /**
   * Get all active destinations.
   * @returns {{ destinations: [] }}
   */
  getDestinations: () => apiClient.get('/destinations'),

  /**
   * Get packages filtered by destination, search query, or pagination.
   * @param {{ destination, search, page, limit }} params
   * @returns {{ packages: [], total, page, pages }}
   */
  getPackages: (params = {}) => {
    const query = new URLSearchParams();
    if (params.destination) query.set('destination', params.destination);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit || 20);
    const qs = query.toString();
    return apiClient.get(`/packages${qs ? '?' + qs : ''}`);
  },

  /**
   * Get a single package by ID.
   * @returns {{ package }}
   */
  getPackageById: (id) => apiClient.get(`/packages/${id}`),

  /**
   * Get featured / recommended packages for Home screen.
   * @returns {{ packages: [] }}
   */
  getFeaturedPackages: () => apiClient.get('/packages/featured'),

  // ── Admin endpoints ──────────────────────────────────────────

  /**
   * Create a new package (admin only).
   */
  createPackage: (data) => apiClient.post('/packages', data),

  /**
   * Update an existing package (admin only).
   */
  updatePackage: (id, data) => apiClient.put(`/packages/${id}`, data),

  /**
   * Delete a package (admin only).
   */
  deletePackage: (id) => apiClient.delete(`/packages/${id}`),

  /**
   * Toggle a package active/inactive (admin only).
   */
  togglePackageStatus: (id) => apiClient.patch(`/packages/${id}/toggle-status`),
};

export default packagesApi;
