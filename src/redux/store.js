/**
 * Redux Store — Phase 7
 */

import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './bookingSlice';
import wishlistReducer from './wishlistSlice';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import notificationReducer from './notificationSlice';
import adminReducer from './adminSlice';
import reviewReducer from './reviewSlice';

const store = configureStore({
  reducer: {
    booking: bookingReducer,
    wishlist: wishlistReducer,
    theme: themeReducer,
    auth: authReducer,
    notifications: notificationReducer,
    admin: adminReducer,
    reviews: reviewReducer,
  },
});

export default store;
