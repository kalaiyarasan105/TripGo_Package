/**
 * bookingSlice — Phase 9
 *
 * Manages the in-progress booking state as the user moves through:
 * PackageDetails → Booking → Checkout → Confirmation
 *
 * Phase 9: async thunks added for API-backed booking creation,
 * user bookings fetch, and cancellation.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  // The booking currently being created
  currentBooking: {
    packageId: null,
    packageName: '',
    packagePrice: 0,         // price per person
    travelDate: null,        // selected ISO date string
    adults: 1,
    children: 0,
    couponCode: '',
    couponDiscount: 0,       // amount discounted in ₹
    paymentMethod: 'card',
    subtotal: 0,             // adults*price + children*price*0.7
    finalAmount: 0,          // subtotal - couponDiscount
  },
  // List of all bookings for the user — starts empty.
  // Real entries are added when the user completes checkout.
  bookings: [],
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // Called when user taps "Book Now" on package details
    initBooking(state, action) {
      const { packageId, packageName, packagePrice } = action.payload;
      state.currentBooking = {
        ...initialState.currentBooking,
        packageId,
        packageName,
        packagePrice,
        subtotal: packagePrice,   // default: 1 adult
        finalAmount: packagePrice,
      };
    },

    // Update travel date
    setTravelDate(state, action) {
      state.currentBooking.travelDate = action.payload;
    },

    // Update adults count and recalculate price
    setAdults(state, action) {
      const adults = Math.max(1, action.payload); // minimum 1 adult
      state.currentBooking.adults = adults;
      bookingSlice.caseReducers.recalculate(state);
    },

    // Update children count and recalculate
    setChildren(state, action) {
      const children = Math.max(0, action.payload);
      state.currentBooking.children = children;
      bookingSlice.caseReducers.recalculate(state);
    },

    // Apply coupon discount
    applyCoupon(state, action) {
      const { code, discount } = action.payload;
      state.currentBooking.couponCode = code;
      state.currentBooking.couponDiscount = discount;
      state.currentBooking.finalAmount =
        state.currentBooking.subtotal - discount;
    },

    // Remove applied coupon
    removeCoupon(state) {
      state.currentBooking.couponCode = '';
      state.currentBooking.couponDiscount = 0;
      state.currentBooking.finalAmount = state.currentBooking.subtotal;
    },

    // Set payment method
    setPaymentMethod(state, action) {
      state.currentBooking.paymentMethod = action.payload;
    },

    // Internal: recalculate subtotal and final
    // children pay 70% of adult price
    recalculate(state) {
      const { packagePrice, adults, children, couponDiscount } = state.currentBooking;
      const subtotal =
        adults * packagePrice + children * Math.round(packagePrice * 0.7);
      state.currentBooking.subtotal = subtotal;
      state.currentBooking.finalAmount = Math.max(0, subtotal - couponDiscount);
    },

    // Called after payment confirmation — adds booking to list
    confirmBooking(state, action) {
      state.bookings.unshift(action.payload); // add to front of list
      // Reset current booking
      state.currentBooking = initialState.currentBooking;
    },

    // Cancel a booking
    cancelBooking(state, action) {
      const bookingId = action.payload;
      const idx = state.bookings.findIndex((b) => b._id === bookingId);
      if (idx !== -1) {
        state.bookings[idx].bookingStatus = 'cancelled';
      }
    },
  },
});

export const {
  initBooking,
  setTravelDate,
  setAdults,
  setChildren,
  applyCoupon,
  removeCoupon,
  setPaymentMethod,
  confirmBooking,
  cancelBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;

// ── Phase 9 Async Thunks ─────────────────────────────────────────

/**
 * Create a booking via API.
 * On success, adds it to the bookings list.
 */
export const createBookingAsync = createAsyncThunk(
  'booking/createBookingAsync',
  async (bookingData, { rejectWithValue }) => {
    try {
      // TODO Phase 9: const { bookingsApi } = require('../api');
      // const data = await bookingsApi.createBooking(bookingData);
      // return data.booking;
      // Stub — return the booking data as-is
      return { ...bookingData, _id: Date.now().toString(), paymentStatus: 'paid' };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create booking');
    }
  }
);

/**
 * Fetch the current user's bookings from the API.
 */
export const fetchUserBookingsAsync = createAsyncThunk(
  'booking/fetchUserBookingsAsync',
  async (params = {}, { rejectWithValue }) => {
    try {
      // TODO Phase 9: const { bookingsApi } = require('../api');
      // const data = await bookingsApi.getUserBookings(params);
      // return data.bookings;
      return null; // stub — don't overwrite mock data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch bookings');
    }
  }
);

/**
 * Cancel a booking via API.
 */
export const cancelBookingAsync = createAsyncThunk(
  'booking/cancelBookingAsync',
  async (bookingId, { rejectWithValue }) => {
    try {
      // TODO Phase 9: const { bookingsApi } = require('../api');
      // await bookingsApi.cancelBooking(bookingId);
      return bookingId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to cancel booking');
    }
  }
);
