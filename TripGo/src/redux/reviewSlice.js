/**
 * reviewSlice — Phase 7
 *
 * Manages user-submitted reviews.
 * Reviews are submitted locally and stored until Phase 9 API integration.
 */

import { createSlice } from '@reduxjs/toolkit';

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    // User's submitted reviews (pending approval)
    myReviews: [],
    // Loading/error state
    isLoading: false,
    error: null,
  },
  reducers: {
    submitReview(state, action) {
      state.myReviews.unshift(action.payload);
    },
    deleteReview(state, action) {
      state.myReviews = state.myReviews.filter((r) => r._id !== action.payload);
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { submitReview, deleteReview, clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
