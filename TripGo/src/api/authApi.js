/**
 * authApi.js — Phase 8
 *
 * Authentication API calls.
 * All functions return a promise that resolves to the API response data.
 */

import apiClient from './client';

const authApi = {
  /**
   * Login with email and password.
   * @returns {{ user, token }}
   */
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  /**
   * Register a new user.
   * @returns {{ user, token }}
   */
  register: (name, email, phone, password) =>
    apiClient.post('/auth/register', { name, email, phone, password }),

  /**
   * Refresh the JWT access token using a stored refresh token.
   * @returns {{ token }}
   */
  refreshToken: (refreshToken) =>
    apiClient.post('/auth/refresh', { refreshToken }),

  /**
   * Logout — invalidates the server-side session.
   */
  logout: () => apiClient.post('/auth/logout'),

  /**
   * Send password reset email.
   */
  forgotPassword: (email) =>
    apiClient.post('/auth/forgot-password', { email }),

  /**
   * Reset password using token from email link.
   */
  resetPassword: (token, newPassword) =>
    apiClient.post('/auth/reset-password', { token, newPassword }),

  /**
   * Change password for authenticated user.
   */
  changePassword: (currentPassword, newPassword) =>
    apiClient.post('/auth/change-password', { currentPassword, newPassword }),

  /**
   * Get current authenticated user profile.
   * @returns {{ user }}
   */
  getProfile: () => apiClient.get('/auth/me'),

  /**
   * Update the current user's profile fields.
   * @returns {{ user }}
   */
  updateProfile: (profileData) =>
    apiClient.put('/auth/me', profileData),
};

export default authApi;
