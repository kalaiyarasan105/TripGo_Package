/**
 * TripGo — App Entry Point (Phase 9)
 *
 * Phase 9 additions:
 * - Session restore from device storage on startup
 * - Push notification permission request
 * - Background notification handler registration
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { restoreSession } from './src/redux/authSlice';
import pushNotifications from './src/services/pushNotifications';
import analyticsService from './src/services/analytics';

// Register background notification handler (must be outside any component)
pushNotifications.setBackgroundHandler();

// Error boundary catches silent JS crashes and shows the error on screen
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>❌ App Error</Text>
          <Text style={styles.errorText}>
            {this.state.error?.toString()}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Inner component that can use Redux hooks
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore persisted auth session on every app launch
    dispatch(restoreSession());

    // Request push notification permission
    pushNotifications.requestPermission().then((granted) => {
      if (granted) {
        pushNotifications.getToken().then((token) => {
          if (__DEV__) {
            console.log('[App] FCM Token:', token);
          }
          // TODO Phase 9: send token to backend
          // pushNotifications.registerToken(userId, token);
        });
      }
    });

    // Subscribe to foreground push messages
    const unsubscribe = pushNotifications.onForegroundMessage((message) => {
      if (__DEV__) {
        console.log('[App] Foreground message:', message);
      }
      // TODO: dispatch addNotification with the message payload
    });

    analyticsService.trackEvent('app_launched');

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return <AppNavigator />;
};

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
});