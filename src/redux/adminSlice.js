/**
 * adminSlice
 * Manages all admin-side data:
 * - packages, coupons, bookings, users, reviews
 * In Phase 9 these will be replaced by real API calls.
 */

import { createSlice } from '@reduxjs/toolkit';
import { MOCK_PACKAGES, MOCK_COUPONS } from '../constants/mockData';

const MOCK_USERS = [
  { _id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', isActive: true, bookingsCount: 3, joinedAt: '2025-01-15T00:00:00Z' },
  { _id: 'u2', name: 'Priya Singh', email: 'priya@example.com', phone: '9812345678', isActive: true, bookingsCount: 5, joinedAt: '2025-02-20T00:00:00Z' },
  { _id: 'u3', name: 'Amit Kumar', email: 'amit@example.com', phone: '9898989898', isActive: false, bookingsCount: 1, joinedAt: '2025-03-10T00:00:00Z' },
  { _id: 'u4', name: 'Sneha Patel', email: 'sneha@example.com', phone: '9765432109', isActive: true, bookingsCount: 7, joinedAt: '2025-04-05T00:00:00Z' },
  { _id: 'u5', name: 'Vikram Mehta', email: 'vikram@example.com', phone: '9654321098', isActive: true, bookingsCount: 2, joinedAt: '2025-05-12T00:00:00Z' },
];

const MOCK_REVIEWS = [
  { _id: 'r1', user: { name: 'Priya Sharma' }, package: { name: 'Goa Beach Paradise' }, rating: 5, comment: 'Absolutely amazing trip! Everything was well-organized.', isApproved: true, createdAt: '2025-10-15T00:00:00Z' },
  { _id: 'r2', user: { name: 'Rahul Verma' }, package: { name: 'Manali Snow Adventure' }, rating: 4, comment: 'Great experience overall. Hotels were comfortable.', isApproved: true, createdAt: '2025-09-22T00:00:00Z' },
  { _id: 'r3', user: { name: 'Anita Patel' }, package: { name: 'Kerala Backwaters Bliss' }, rating: 5, comment: 'Best vacation of my life!', isApproved: false, createdAt: '2025-11-01T00:00:00Z' },
  { _id: 'r4', user: { name: 'Suresh Nair' }, package: { name: 'Goa Beach Paradise' }, rating: 3, comment: 'Decent trip but food could be better.', isApproved: false, createdAt: '2025-11-10T00:00:00Z' },
];

const MOCK_ADMIN_BOOKINGS = [
  { _id: 'b1', bookingId: 'TG20261001', bookingStatus: 'confirmed', travelDate: '2026-10-05', adults: 2, children: 1, finalAmount: 55500, paymentStatus: 'paid', user: { name: 'Rahul Sharma', email: 'rahul@example.com' }, package: { name: 'Goa Beach Paradise' }, createdAt: '2026-08-01T10:00:00Z' },
  { _id: 'b2', bookingId: 'TG20261002', bookingStatus: 'confirmed', travelDate: '2026-09-20', adults: 2, children: 0, finalAmount: 43000, paymentStatus: 'paid', user: { name: 'Priya Singh', email: 'priya@example.com' }, package: { name: 'Manali Snow Adventure' }, createdAt: '2026-07-15T09:30:00Z' },
  { _id: 'b3', bookingId: 'TG20261003', bookingStatus: 'cancelled', travelDate: '2026-09-25', adults: 1, children: 0, finalAmount: 22000, paymentStatus: 'refunded', user: { name: 'Amit Kumar', email: 'amit@example.com' }, package: { name: 'Kerala Backwaters Bliss' }, createdAt: '2026-08-01T14:00:00Z' },
  { _id: 'b4', bookingId: 'TG20261004', bookingStatus: 'pending', travelDate: '2026-10-25', adults: 3, children: 2, finalAmount: 98500, paymentStatus: 'paid', user: { name: 'Sneha Patel', email: 'sneha@example.com' }, package: { name: 'Rajasthan Royal Tour' }, createdAt: '2026-08-20T11:00:00Z' },
  { _id: 'b5', bookingId: 'TG20261005', bookingStatus: 'confirmed', travelDate: '2026-11-01', adults: 2, children: 0, finalAmount: 57000, paymentStatus: 'paid', user: { name: 'Vikram Mehta', email: 'vikram@example.com' }, package: { name: 'Andaman Island Escape' }, createdAt: '2026-08-25T08:00:00Z' },
];

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    packages: MOCK_PACKAGES.map((p) => ({ ...p })),
    coupons: MOCK_COUPONS.map((c) => ({ ...c })),
    bookings: MOCK_ADMIN_BOOKINGS,
    users: MOCK_USERS,
    reviews: MOCK_REVIEWS,
  },
  reducers: {
    // ── Package Management ──────────────────────────────────────
    addPackage(state, action) {
      state.packages.unshift({ ...action.payload, _id: Date.now().toString(), createdAt: new Date().toISOString() });
    },
    updatePackage(state, action) {
      const idx = state.packages.findIndex((p) => p._id === action.payload._id);
      if (idx !== -1) state.packages[idx] = { ...state.packages[idx], ...action.payload };
    },
    deletePackage(state, action) {
      state.packages = state.packages.filter((p) => p._id !== action.payload);
    },
    togglePackageStatus(state, action) {
      const pkg = state.packages.find((p) => p._id === action.payload);
      if (pkg) pkg.status = pkg.status === 'active' ? 'inactive' : 'active';
    },

    // ── Coupon Management ───────────────────────────────────────
    addCoupon(state, action) {
      state.coupons.unshift({ ...action.payload, _id: Date.now().toString(), usedCount: 0 });
    },
    updateCoupon(state, action) {
      const idx = state.coupons.findIndex((c) => c._id === action.payload._id);
      if (idx !== -1) state.coupons[idx] = { ...state.coupons[idx], ...action.payload };
    },
    deleteCoupon(state, action) {
      state.coupons = state.coupons.filter((c) => c._id !== action.payload);
    },
    toggleCouponStatus(state, action) {
      const coupon = state.coupons.find((c) => c._id === action.payload);
      if (coupon) coupon.status = coupon.status === 'active' ? 'inactive' : 'active';
    },

    // ── Booking Management ──────────────────────────────────────
    updateBookingStatus(state, action) {
      const { bookingId, status } = action.payload;
      const booking = state.bookings.find((b) => b._id === bookingId);
      if (booking) booking.bookingStatus = status;
    },

    // ── User Management ─────────────────────────────────────────
    toggleUserStatus(state, action) {
      const user = state.users.find((u) => u._id === action.payload);
      if (user) user.isActive = !user.isActive;
    },

    // ── Review Management ───────────────────────────────────────
    approveReview(state, action) {
      const review = state.reviews.find((r) => r._id === action.payload);
      if (review) review.isApproved = true;
    },
    deleteReview(state, action) {
      state.reviews = state.reviews.filter((r) => r._id !== action.payload);
    },
  },
});

export const {
  addPackage, updatePackage, deletePackage, togglePackageStatus,
  addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus,
  updateBookingStatus,
  toggleUserStatus,
  approveReview, deleteReview,
} = adminSlice.actions;

export default adminSlice.reducer;
