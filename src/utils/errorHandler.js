/**
 * errorHandler.js — Phase 9
 *
 * Centralised error handling utilities.
 * Translates network/API errors into user-friendly messages.
 */

import { Alert } from 'react-native';
import analyticsService from '../services/analytics';

/**
 * Extract a readable message from any error object.
 * Handles axios errors, fetch errors, and plain Error instances.
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';

  // Server responded with an error body
  if (error.data?.message) return error.data.message;
  if (error.response?.data?.message) return error.response.data.message;

  // Network timeout or abort
  if (error.name === 'AbortError') return 'Request timed out. Please check your connection.';

  // HTTP status codes
  if (error.status === 400) return 'Invalid request. Please check your input.';
  if (error.status === 401) return 'Session expired. Please log in again.';
  if (error.status === 403) return 'You do not have permission to perform this action.';
  if (error.status === 404) return 'The requested resource was not found.';
  if (error.status === 409) return 'A conflict occurred. Please refresh and try again.';
  if (error.status === 422) return 'Validation error. Please check your input.';
  if (error.status >= 500) return 'Server error. Please try again later.';

  // Plain error message
  if (error.message) return error.message;

  return 'Something went wrong. Please try again.';
};

/**
 * Show an alert dialog for an error.
 * Optionally logs to analytics.
 */
export const showError = (error, screenName = '') => {
  const message = getErrorMessage(error);

  if (screenName) {
    analyticsService.trackError(screenName, message);
  }

  Alert.alert('Error', message, [{ text: 'OK' }]);
};

/**
 * Show an alert for a network error specifically.
 */
export const showNetworkError = () => {
  Alert.alert(
    'No Connection',
    'You appear to be offline. Please check your internet connection and try again.',
    [{ text: 'OK' }]
  );
};

/**
 * Higher-order async function that wraps an async operation with
 * error handling, showing an alert on failure.
 *
 * Usage:
 *   const result = await safeAsync(() => apiClient.get('/packages'), 'HomeScreen');
 */
export const safeAsync = async (fn, screenName = '') => {
  try {
    return await fn();
  } catch (error) {
    showError(error, screenName);
    return null;
  }
};
