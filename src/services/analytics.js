/**
 * analytics.js — Phase 9
 *
 * Centralised analytics tracking service.
 * Currently logs to console in development.
 *
 * In production, integrate with Firebase Analytics:
 *   npm install @react-native-firebase/app @react-native-firebase/analytics
 * Then replace the _track() implementation below.
 *
 * Usage:
 *   import analytics from '../services/analytics';
 *   analytics.trackScreen('HomeScreen');
 *   analytics.trackEvent('booking_started', { packageId: 'p1' });
 */

const IS_DEV = __DEV__;

// ── Internal dispatcher ─────────────────────────────────────────
const _track = (type, name, params = {}) => {
  if (IS_DEV) {
    console.log(`[Analytics] ${type}: ${name}`, params);
  }
  // TODO Phase 9 production:
  // import analytics from '@react-native-firebase/analytics';
  // await analytics().logEvent(name, params);
};

// ── Public API ──────────────────────────────────────────────────
const analyticsService = {
  /**
   * Track a screen view.
   * Call at the top of each screen's useEffect/useFocusEffect.
   */
  trackScreen: (screenName, params = {}) => {
    _track('SCREEN', screenName, params);
  },

  /**
   * Track a custom event with optional properties.
   */
  trackEvent: (eventName, params = {}) => {
    _track('EVENT', eventName, params);
  },

  // ── Predefined events ─────────────────────────────────────────

  trackLogin: (method = 'email') =>
    _track('EVENT', 'user_login', { method }),

  trackRegister: (method = 'email') =>
    _track('EVENT', 'user_register', { method }),

  trackLogout: () =>
    _track('EVENT', 'user_logout'),

  trackSearch: (query, resultsCount = 0) =>
    _track('EVENT', 'search', { query, resultsCount }),

  trackPackageView: (packageId, packageName, destination) =>
    _track('EVENT', 'package_view', { packageId, packageName, destination }),

  trackAddToWishlist: (packageId, packageName) =>
    _track('EVENT', 'add_to_wishlist', { packageId, packageName }),

  trackRemoveFromWishlist: (packageId) =>
    _track('EVENT', 'remove_from_wishlist', { packageId }),

  trackBookingStarted: (packageId, packageName, price) =>
    _track('EVENT', 'booking_started', { packageId, packageName, price }),

  trackCouponApplied: (couponCode, discount) =>
    _track('EVENT', 'coupon_applied', { couponCode, discount }),

  trackBookingCompleted: (bookingId, packageName, finalAmount, paymentMethod) =>
    _track('EVENT', 'booking_completed', {
      bookingId,
      packageName,
      finalAmount,
      paymentMethod,
    }),

  trackBookingCancelled: (bookingId) =>
    _track('EVENT', 'booking_cancelled', { bookingId }),

  trackReviewSubmitted: (packageId, rating) =>
    _track('EVENT', 'review_submitted', { packageId, rating }),

  trackNotificationRead: (notificationId, type) =>
    _track('EVENT', 'notification_read', { notificationId, type }),

  trackError: (screen, errorMessage) =>
    _track('EVENT', 'app_error', { screen, errorMessage }),
};

export default analyticsService;
