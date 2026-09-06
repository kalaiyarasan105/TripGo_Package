/**
 * EmptyState Component
 *
 * Shown when a list or section has no data to display.
 * Provides a friendly message with an optional action button.
 *
 * Usage:
 *   <EmptyState
 *     emoji="📦"
 *     title="No Packages Found"
 *     message="Try adjusting your search or filters."
 *     actionText="Clear Filters"
 *     onAction={clearFilters}
 *   />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Theme } from '../constants';
import CustomButton from './CustomButton';

const EmptyState = ({
  emoji = '🔍',
  title = 'Nothing Here',
  message = 'No data to display right now.',
  actionText,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      {/* Large emoji as a visual icon */}
      <Text style={styles.emoji}>{emoji}</Text>

      {/* Main title */}
      <Text style={styles.title}>{title}</Text>

      {/* Supporting message */}
      <Text style={styles.message}>{message}</Text>

      {/* Optional action button */}
      {actionText && onAction && (
        <View style={styles.buttonWrapper}>
          <CustomButton
            title={actionText}
            onPress={onAction}
            variant="outline"
            size="sm"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.xxl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonWrapper: {
    marginTop: Theme.spacing.lg,
    width: 160,
  },
});

export default EmptyState;
