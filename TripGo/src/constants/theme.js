/**
 * TripGo Theme
 *
 * Defines consistent spacing, font sizes, border radius,
 * and shadow styles used throughout the app.
 * Import from here instead of hardcoding values in components.
 */

import { Dimensions } from 'react-native';

// Get screen dimensions — useful for responsive sizing
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

export const Theme = {
  // ─── Spacing ───────────────────────────────────────────────────
  // Use multiples of 4 for consistent spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // ─── Font Sizes ────────────────────────────────────────────────
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 28,
    hero: 36,
  },

  // ─── Font Weights ──────────────────────────────────────────────
  fontWeight: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },

  // ─── Border Radius ─────────────────────────────────────────────
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999, // Fully rounded (pills, circles)
  },

  // ─── Shadow (Android uses elevation) ───────────────────────────
  shadow: {
    sm: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    md: {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
    lg: {
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
  },

  // ─── Screen Dimensions ─────────────────────────────────────────
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
};

export default Theme;
