/**
 * pushNotifications.js — Phase 9
 *
 * Push notification service.
 * Currently provides a stub implementation.
 *
 * In production, integrate with Firebase Cloud Messaging:
 *   npm install @react-native-firebase/app @react-native-firebase/messaging
 * Then replace the stubs below with real FCM calls.
 *
 * Usage:
 *   import pushNotifications from '../services/pushNotifications';
 *   await pushNotifications.requestPermission();
 *   const token = await pushNotifications.getToken();
 */

import { Platform } from 'react-native';

const pushNotifications = {
  /**
   * Request push notification permission from the user.
   * Returns true if granted, false otherwise.
   */
  requestPermission: async () => {
    if (__DEV__) {
      console.log('[PushNotifications] requestPermission called');
    }
    // TODO production:
    // const messaging = require('@react-native-firebase/messaging').default;
    // const authStatus = await messaging().requestPermission();
    // return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    return true; // stub — assume granted
  },

  /**
   * Get the device's FCM token for sending targeted notifications.
   */
  getToken: async () => {
    if (__DEV__) {
      console.log('[PushNotifications] getToken called');
    }
    // TODO production:
    // const messaging = require('@react-native-firebase/messaging').default;
    // return await messaging().getToken();
    return `dev-fcm-token-${Platform.OS}-${Date.now()}`;
  },

  /**
   * Register a foreground message handler.
   * Call once during app startup (e.g. in App.js useEffect).
   * Returns an unsubscribe function.
   */
  onForegroundMessage: (handler) => {
    if (__DEV__) {
      console.log('[PushNotifications] onForegroundMessage registered');
    }
    // TODO production:
    // const messaging = require('@react-native-firebase/messaging').default;
    // return messaging().onMessage(handler);
    return () => {}; // noop unsubscribe
  },

  /**
   * Register a background/quit message handler.
   * Must be called outside of any component (e.g. at the top of index.js).
   */
  setBackgroundHandler: () => {
    if (__DEV__) {
      console.log('[PushNotifications] setBackgroundHandler registered');
    }
    // TODO production:
    // const messaging = require('@react-native-firebase/messaging').default;
    // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //   console.log('Background message:', remoteMessage);
    // });
  },

  /**
   * Send the device token to the backend so the server can target this user.
   */
  registerToken: async (userId, token) => {
    if (__DEV__) {
      console.log('[PushNotifications] registerToken', { userId, token });
    }
    // TODO production:
    // await apiClient.post('/users/push-token', { userId, token, platform: Platform.OS });
  },

  /**
   * Display a local notification on the device.
   * Useful for in-app notifications when app is in foreground.
   */
  showLocalNotification: ({ title, body, data = {} }) => {
    if (__DEV__) {
      console.log('[PushNotifications] showLocalNotification', { title, body, data });
    }
    // TODO production:
    // Use @notifee/react-native for rich local notifications:
    // const notifee = require('@notifee/react-native').default;
    // const channelId = await notifee.createChannel({ id: 'default', name: 'Default' });
    // await notifee.displayNotification({ title, body, data, android: { channelId } });
  },
};

export default pushNotifications;
