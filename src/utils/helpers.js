/**
 * Helper Utilities
 * Shared pure functions used across multiple screens.
 */

// Format number to Indian Rupee string — e.g. 18500 → "₹18,500"
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
};

// Format ISO date string to readable — e.g. "2025-12-25" → "25 Dec 2025"
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Format ISO date to short form — e.g. "25 Dec"
export const formatDateShort = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

// Generate a random booking ID like "TG20251234"
export const generateBookingId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TG${year}${random}`;
};

// Calculate coupon discount amount based on type and value
export const calculateCouponDiscount = (coupon, subtotal) => {
  if (!coupon || !coupon.status || coupon.status !== 'active') return 0;
  if (subtotal < coupon.minimumAmount) return 0;

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    // Cap at maximumDiscount
    if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
      discount = coupon.maximumDiscount;
    }
  } else {
    // Fixed discount
    discount = coupon.discountValue;
  }

  return Math.min(discount, subtotal); // can't discount more than subtotal
};

// Validate if a date string is in the future
export const isFutureDate = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) > new Date();
};

// Get status color and label for a booking status
export const getBookingStatusInfo = (status) => {
  switch (status) {
    case 'confirmed':
      return { color: '#34A853', bg: '#E6F4EA', label: 'Confirmed' };
    case 'completed':
      return { color: '#1A73E8', bg: '#E8F0FE', label: 'Completed' };
    case 'cancelled':
      return { color: '#EA4335', bg: '#FCE8E6', label: 'Cancelled' };
    default:
      return { color: '#FBBC04', bg: '#FEF7E0', label: 'Pending' };
  }
};
