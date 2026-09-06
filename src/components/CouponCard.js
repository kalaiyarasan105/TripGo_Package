/**
 * CouponCard Component
 *
 * Displays a coupon in the checkout screen or coupon list.
 * Shows discount type, value, and expiry.
 * Has an "Apply" button when used in checkout.
 *
 * Usage:
 *   <CouponCard
 *     coupon={item}
 *     onApply={() => applyCoupon(item.code)}
 *     isApplied={appliedCoupon === item.code}
 *   />
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Theme } from '../constants';

const CouponCard = ({ coupon, onApply, isApplied = false }) => {
  if (!coupon) return null;

  // Format the discount label — e.g. "20% OFF" or "₹500 OFF"
  const getDiscountLabel = () => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    }
    return `₹${coupon.discountValue?.toLocaleString('en-IN')} OFF`;
  };

  // Format expiry date
  const formatExpiry = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={[styles.card, isApplied && styles.appliedCard]}>
      {/* Left — discount badge (dashed left border visual) */}
      <View style={styles.discountSection}>
        <Text style={styles.discountValue}>{getDiscountLabel()}</Text>
        <Text style={styles.discountType}>
          {coupon.discountType === 'percentage' ? 'Percentage' : 'Flat discount'}
        </Text>
      </View>

      {/* Dashed divider between sections */}
      <View style={styles.divider}>
        {/* Small circles cut into top and bottom to simulate coupon perforation */}
        <View style={styles.circleCut} />
        <View style={[styles.circleCut, { bottom: -8, top: undefined }]} />
      </View>

      {/* Right — coupon details */}
      <View style={styles.detailsSection}>
        {/* Coupon code in a styled box */}
        <View style={styles.codeBox}>
          <Text style={styles.code}>{coupon.code}</Text>
        </View>

        {/* Min booking requirement */}
        {coupon.minimumAmount > 0 && (
          <Text style={styles.condition}>
            Min. booking ₹{coupon.minimumAmount?.toLocaleString('en-IN')}
          </Text>
        )}

        {/* Expiry */}
        {coupon.expiryDate && (
          <Text style={styles.expiry}>
            Valid till {formatExpiry(coupon.expiryDate)}
          </Text>
        )}

        {/* Apply / Applied button */}
        {onApply && (
          <TouchableOpacity
            style={[styles.applyBtn, isApplied && styles.appliedBtn]}
            onPress={onApply}
            disabled={isApplied}
          >
            <Text style={[styles.applyText, isApplied && styles.appliedText]}>
              {isApplied ? '✓ Applied' : 'Apply'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    ...Theme.shadow.sm,
  },
  appliedCard: {
    borderColor: Colors.success,
    borderStyle: 'solid',
  },
  discountSection: {
    backgroundColor: Colors.primaryLight,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.sm,
  },
  discountValue: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.extraBold,
    color: Colors.primary,
    textAlign: 'center',
  },
  discountType: {
    fontSize: Theme.fontSize.xs,
    color: Colors.primaryDark,
    textAlign: 'center',
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    position: 'relative',
  },
  circleCut: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  detailsSection: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  codeBox: {
    backgroundColor: Colors.inputBg,
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  code: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  condition: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  expiry: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: 16,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  appliedBtn: {
    backgroundColor: Colors.successLight,
  },
  applyText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semiBold,
    color: Colors.white,
  },
  appliedText: {
    color: Colors.success,
  },
});

export default CouponCard;
