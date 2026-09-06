/**
 * themeUtils
 * Returns the correct color set based on dark/light mode.
 * Use this in every screen: const C = useThemeColors();
 */

import { useSelector } from 'react-redux';
import { Colors } from '../constants';

export const useThemeColors = () => {
  const isDark = useSelector((state) => state.theme.isDark);

  if (isDark) {
    return {
      ...Colors,
      background: Colors.dark.background,
      surface: Colors.dark.surface,
      border: Colors.dark.border,
      textPrimary: Colors.dark.textPrimary,
      textSecondary: Colors.dark.textSecondary,
      inputBg: Colors.dark.inputBg,
      isDark: true,
    };
  }

  return { ...Colors, isDark: false };
};
