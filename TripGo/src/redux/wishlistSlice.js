/**
 * wishlistSlice
 * Manages the user's wishlist of saved packages.
 * Stores full package objects so wishlist works offline.
 */

import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [], // array of package objects
  },
  reducers: {
    // Add a package to wishlist
    addToWishlist(state, action) {
      const exists = state.items.find((p) => p._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },

    // Remove a package from wishlist by ID
    removeFromWishlist(state, action) {
      state.items = state.items.filter((p) => p._id !== action.payload);
    },

    // Toggle — add if not present, remove if present
    toggleWishlist(state, action) {
      const pkg = action.payload;
      const idx = state.items.findIndex((p) => p._id === pkg._id);
      if (idx === -1) {
        state.items.push(pkg);
      } else {
        state.items.splice(idx, 1);
      }
    },

    // Clear entire wishlist
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
