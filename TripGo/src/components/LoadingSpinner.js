/**
 * LoadingSpinner Component
 *
 * Full-screen or inline loading indicator.
 * Use `fullScreen` prop for page-level loading.
 * Use without it for inline/section loading.
 *
 * Usage:
 *   <LoadingSpinner fullScreen />
 *   <LoadingSpinner message="Fetching packages..." />
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, Theme } from '../constants';

const LoadingSpinner = ({
  fullScreen = false,
  message = 'Loading...',
  color = Colors.primary,
  size = 'large',
}) => {
  if (fullScreen) {
    return (
      // Full screen overlay with centered spinner
      <View style={styles.fullScreen}>
        <ActivityIndicator size={size} color={color} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    );
  }

  // Inline spinner — just sits inside whatever container wraps it
  return (
    <View style={styles.inline}>
      <ActivityIndicator size={size} color={color} />
      {message ? <Text style={styles.inlineMessage}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  inline: {
    paddingVertical: Theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
  },
  inlineMessage: {
    marginTop: Theme.spacing.sm,
    fontSize: Theme.fontSize.sm,
    color: Colors.textMuted,
  },
});

export default LoadingSpinner;
