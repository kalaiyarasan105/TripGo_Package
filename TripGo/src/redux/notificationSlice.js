/**
 * notificationSlice
 * Manages in-app notifications list.
 */

import { createSlice } from '@reduxjs/toolkit';

const MOCK_NOTIFICATIONS = [
  {
    _id: 'n1',
    title: 'Booking Confirmed! 🎉',
    message: 'Your Goa Beach Paradise booking #TG20251001 has been confirmed.',
    type: 'booking',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'n2',
    title: 'Special Offer 🏷️',
    message: 'Use code TRIP20 and get 20% off on bookings above ₹15,000. Valid till Dec 31.',
    type: 'offer',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'n3',
    title: 'Trip Reminder 🧳',
    message: 'Your Manali Snow Adventure trip is in 3 days. Check your packing list!',
    type: 'reminder',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'n4',
    title: 'New Package Added ✨',
    message: 'Explore our new Andaman Island Escape package starting at ₹28,500.',
    type: 'info',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'n5',
    title: 'Review Request ⭐',
    message: 'How was your Kerala Backwaters trip? Share your experience!',
    type: 'review',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: MOCK_NOTIFICATIONS,
  },
  reducers: {
    markAsRead(state, action) {
      const idx = state.items.findIndex((n) => n._id === action.payload);
      if (idx !== -1) state.items[idx].isRead = true;
    },
    markAllAsRead(state) {
      state.items.forEach((n) => (n.isRead = true));
    },
    deleteNotification(state, action) {
      state.items = state.items.filter((n) => n._id !== action.payload);
    },
    addNotification(state, action) {
      state.items.unshift(action.payload);
    },
  },
});

export const {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  addNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
