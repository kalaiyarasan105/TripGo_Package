/**
 * validators.js — Phase 7
 *
 * Input validation functions used across screens.
 * Each function returns null when valid, or an error string when invalid.
 */

// Email validation
export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return 'Enter a valid email address.';
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
  return null;
};

// Name validation
export const validateName = (name) => {
  if (!name || !name.trim()) return 'Name is required.';
  if (name.trim().length < 2) return 'Name must be at least 2 characters.';
  if (name.trim().length > 60) return 'Name is too long (max 60 characters).';
  return null;
};

// Phone number validation (Indian format)
export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return 'Phone number is required.';
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Enter a valid 10-digit Indian mobile number.';
  }
  return null;
};

// Non-empty field validation
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required.`;
  }
  return null;
};

// Number range validation
export const validateNumberRange = (value, min, max, fieldName = 'Value') => {
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} must be a number.`;
  if (num < min) return `${fieldName} must be at least ${min}.`;
  if (num > max) return `${fieldName} must not exceed ${max}.`;
  return null;
};

// Price validation
export const validatePrice = (price) => {
  const num = Number(price);
  if (isNaN(num) || num <= 0) return 'Please enter a valid price greater than 0.';
  if (num > 10000000) return 'Price seems too high. Please check the value.';
  return null;
};

// Date validation — must be a future date
export const validateFutureDate = (dateStr) => {
  if (!dateStr) return 'Date is required.';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Enter a valid date.';
  if (date <= new Date()) return 'Date must be in the future.';
  return null;
};

// Coupon code format
export const validateCouponCode = (code) => {
  if (!code || !code.trim()) return 'Coupon code is required.';
  const codeRegex = /^[A-Z0-9]{4,15}$/;
  if (!codeRegex.test(code.trim().toUpperCase())) {
    return 'Coupon code must be 4–15 uppercase letters or digits.';
  }
  return null;
};

// Generic text length validation
export const validateTextLength = (text, min = 1, max = 500, fieldName = 'Text') => {
  if (!text || !text.trim()) return `${fieldName} is required.`;
  if (text.trim().length < min) return `${fieldName} must be at least ${min} characters.`;
  if (text.trim().length > max) return `${fieldName} must not exceed ${max} characters.`;
  return null;
};

// Validate that a selection was made (non-null, non-empty)
export const validateSelection = (value, fieldName = 'Selection') => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required.`;
  }
  return null;
};
