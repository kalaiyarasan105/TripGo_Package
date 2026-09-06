/**
 * CustomButton Component
 *
 * A reusable button used throughout the app.
 * Supports: primary, secondary, outline, and danger variants.
 * Shows a loading spinner when `loading` prop is true.
 *
 * Usage:
 *   <CustomButton title="Book Now" onPress={handleBooking} />
 *   <CustomButton title="Cancel" variant="outline" onPress={handleCancel} />
 *   <CustomButton title="Submitting..." loading={true} />
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors, Theme } from '../constants';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
  size = 'md',         // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,                // Optional icon component to show before text
}) => {
  // Determine background and text color based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: { backgroundColor: Colors.secondary },
          text: { color: Colors.white },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: Colors.primary,
          },
          text: { color: Colors.primary },
        };
      case 'danger':
        return {
          container: { backgroundColor: Colors.error },
          text: { color: Colors.white },
        };
      default: // primary
        return {
          container: { backgroundColor: Colors.primary },
          text: { color: Colors.white },
        };
    }
  };

  // Determine height/padding based on size
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { container: { paddingVertical: 8 }, text: { fontSize: 13 } };
      case 'lg':
        return { container: { paddingVertical: 16 }, text: { fontSize: 17 } };
      default: // md
        return { container: { paddingVertical: 13 }, text: { fontSize: 15 } };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        // Show spinner when loading
        <ActivityIndicator
          color={variant === 'outline' ? Colors.primary : Colors.white}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {/* Optional icon before the title */}
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[styles.text, variantStyles.text, sizeStyles.text, textStyle]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontWeight: Theme.fontWeight.semiBold,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CustomButton;
