/**
 * themeSlice — Dark Mode
 * Stores the current theme mode (light/dark).
 * Persisted to AsyncStorage in Phase 9.
 */

import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDark: false,
  },
  reducers: {
    toggleTheme(state) {
      state.isDark = !state.isDark;
    },
    setTheme(state, action) {
      state.isDark = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
