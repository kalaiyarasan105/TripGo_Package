/**
 * usersApi.js — Phase 8
 *
 * User management API calls (admin side).
 */

import apiClient from './client';

const usersApi = {
  // ── Admin endpoints ──────────────────────────────────────────

  /**
   * Get all users (admin only).
   * @returns {{ users: [], total }}
   */
  getAllUsers: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit || 20);
    const qs = query.toString();
    return apiClient.get(`/admin/users${qs ? '?' + qs : ''}`);
  },

  /**
   * Get a single user's details (admin only).
   */
  getUserById: (id) => apiClient.get(`/admin/users/${id}`),

  /**
   * Toggle a user's active status (admin only).
   */
  toggleUserStatus: (id) => apiClient.patch(`/admin/users/${id}/toggle-status`),

  /**
   * Get admin dashboard stats.
   * @returns {{ totalPackages, totalBookings, totalUsers, totalRevenue, recentBookings }}
   */
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
};

export default usersApi;
