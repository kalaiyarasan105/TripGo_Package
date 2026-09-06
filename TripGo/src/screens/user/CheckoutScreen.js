/**
 * CheckoutScreen
 *
 * Step 2 of the booking flow.
 * - Shows full order summary
 * - Allows coupon code entry
 * - Lets user choose payment method
 * - Simulates payment processing
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  applyCoupon,
  removeCoupon,
  setPaymentMethod,
  confirmBooking,
} from '../../redux/bookingSlice';
import { Colors, Theme } from '../../constants';
import { CustomButton, CouponCard } from '../../components';
import { MOCK_COUPONS, MOCK_PACKAGES } from '../../constants/mockData';
import {
  formatPrice,
  formatDate,
  calculateCouponDiscount,
  generateBookingId,
} from '../../utils/helpers';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI / Google Pay', icon: '📱' },
  { id: 'net_banking', label: 'Net Banking', icon: '🏦' },
  { id: 'wallet', label: 'Wallet', icon: '👛' },
];

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // Get booking state from Redux
  const {
    packageId,
    packageName,
    packagePrice,
    travelDate,
    adults,
    children,
    subtotal,
    couponCode,
    couponDiscount,
    finalAmount,
    paymentMethod,
  } = useSelector((state) => state.booking.currentBooking);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // ── Coupon Logic ─────────────────────────────────────────────

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const found = MOCK_COUPONS.find(
      (c) => c.code === code && c.status === 'active'
    );

    if (!found) {
      setCouponError('Invalid or expired coupon code');
      return;
    }

    if (subtotal < found.minimumAmount) {
      setCouponError(
        `Minimum booking amount is ${formatPrice(found.minimumAmount)}`
      );
      return;
    }

    const discount = calculateCouponDiscount(found, subtotal);
    dispatch(applyCoupon({ code, discount }));
    setCouponError('');
    setCouponInput('');
    setShowCouponModal(false);
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponInput('');
    setCouponError('');
  };

  // ── Payment Simulation ───────────────────────────────────────

  const handlePay = () => {
    Alert.alert(
      'Confirm Payment',
      `Pay ${formatPrice(finalAmount)} via ${
        PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label
      }?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: processPayment,
        },
      ]
    );
  };

  const processPayment = () => {
    setProcessingPayment(true);

    // Look up full package details so BookingDetail has destination, duration, images
    const fullPkg = MOCK_PACKAGES.find((p) => p._id === packageId);

    setTimeout(() => {
      setProcessingPayment(false);

      const newBooking = {
        _id: Date.now().toString(),
        bookingId: generateBookingId(),
        bookingStatus: 'confirmed',
        travelDate,
        adults,
        children,
        subtotal,
        couponCode,
        couponDiscount,
        finalAmount,
        paymentMethod,
        paymentStatus: 'paid',
        package: {
          _id: packageId,
          name: packageName,
          destination: fullPkg?.destination || '',
          duration: fullPkg?.duration || 0,
          price: packagePrice,
          images: fullPkg?.images || [],
        },
        createdAt: new Date().toISOString(),
      };

      dispatch(confirmBooking(newBooking));
      navigation.replace('BookingConfirmation', { booking: newBooking });
    }, 2000);
  };

  const childPrice = Math.round(packagePrice * 0.7);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Trip Summary ─────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trip Summary</Text>

          <InfoRow label="Package" value={packageName} bold />
          <InfoRow label="Travel Date" value={formatDate(travelDate)} />
          <InfoRow
            label="Travelers"
            value={`${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? ` + ${children} Child` : ''}`}
          />
        </View>

        {/* ── Price Breakdown ──────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price Breakdown</Text>

          <PriceRow
            label={`Adults (${adults} × ${formatPrice(packagePrice)})`}
            value={formatPrice(adults * packagePrice)}
          />
          {children > 0 && (
            <PriceRow
              label={`Children (${children} × ${formatPrice(childPrice)})`}
              value={formatPrice(children * childPrice)}
            />
          )}
          <View style={styles.divider} />
          <PriceRow label="Subtotal" value={formatPrice(subtotal)} bold />

          {couponDiscount > 0 && (
            <PriceRow
              label={`Coupon (${couponCode})`}
              value={`− ${formatPrice(couponDiscount)}`}
              color={Colors.success}
            />
          )}

          <View style={styles.divider} />
          <PriceRow
            label="Total Amount"
            value={formatPrice(finalAmount)}
            bold
            large
            color={Colors.primary}
          />
        </View>

        {/* ── Coupon Section ───────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Apply Coupon</Text>

          {couponCode ? (
            // Coupon already applied
            <View style={styles.appliedCouponRow}>
              <View style={styles.appliedCouponInfo}>
                <Text style={styles.appliedCode}>🏷️ {couponCode}</Text>
                <Text style={styles.appliedSaving}>
                  You save {formatPrice(couponDiscount)}
                </Text>
              </View>
              <TouchableOpacity onPress={handleRemoveCoupon}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Coupon input row
            <View>
              <View style={styles.couponInputRow}>
                <TextInput
                  style={styles.couponInput}
                  value={couponInput}
                  onChangeText={(t) => {
                    setCouponInput(t.toUpperCase());
                    setCouponError('');
                  }}
                  placeholder="Enter coupon code"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={() => handleApplyCoupon()}
                >
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {couponError ? (
                <Text style={styles.couponError}>{couponError}</Text>
              ) : null}

              {/* View available coupons */}
              <TouchableOpacity
                style={styles.viewCouponsBtn}
                onPress={() => setShowCouponModal(true)}
              >
                <Text style={styles.viewCouponsText}>
                  🎁 View Available Coupons
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── Payment Method ───────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>

          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                paymentMethod === method.id && styles.paymentOptionSelected,
              ]}
              onPress={() => dispatch(setPaymentMethod(method.id))}
            >
              <Text style={styles.paymentIcon}>{method.icon}</Text>
              <Text
                style={[
                  styles.paymentLabel,
                  paymentMethod === method.id && styles.paymentLabelSelected,
                ]}
              >
                {method.label}
              </Text>
              <View
                style={[
                  styles.radioOuter,
                  paymentMethod === method.id && styles.radioOuterSelected,
                ]}
              >
                {paymentMethod === method.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}

          <Text style={styles.simulatedNote}>
            ⚠️ This is a simulated payment — no real transaction will occur.
          </Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── Bottom Pay Button ────────────────────────── */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.payLabel}>Amount to Pay</Text>
          <Text style={styles.payAmount}>{formatPrice(finalAmount)}</Text>
        </View>
        <CustomButton
          title={processingPayment ? 'Processing...' : '💳 Pay Now'}
          onPress={handlePay}
          loading={processingPayment}
          style={styles.payBtn}
        />
      </View>

      {/* ── Available Coupons Modal ──────────────────── */}
      <Modal visible={showCouponModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalDismissArea}
            onPress={() => setShowCouponModal(false)}
            activeOpacity={1}
          />
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Available Coupons</Text>
              <TouchableOpacity
                onPress={() => setShowCouponModal(false)}
                style={styles.sheetCloseBtn}
              >
                <Text style={styles.sheetCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            {/* Coupon hint */}
            <Text style={styles.sheetHint}>
              Tap Apply on any coupon to use it
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MOCK_COUPONS.map((coupon) => (
                <CouponCard
                  key={coupon._id}
                  coupon={coupon}
                  onApply={() => handleApplyCoupon(coupon.code)}
                  isApplied={couponCode === coupon.code}
                />
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ── Small helper components ──────────────────────────────────────

const InfoRow = ({ label, value, bold }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, bold && { fontWeight: '700' }]}>
      {value}
    </Text>
  </View>
);

const PriceRow = ({ label, value, bold, large, color }) => (
  <View style={styles.priceRow}>
    <Text style={[styles.priceLabel, bold && styles.priceLabelBold]}>
      {label}
    </Text>
    <Text
      style={[
        styles.priceValue,
        bold && styles.priceValueBold,
        large && styles.priceValueLarge,
        color && { color },
      ]}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 22, color: Colors.white, fontWeight: 'bold' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.white,
  },

  scroll: { padding: Theme.spacing.md },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  cardTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Theme.spacing.md,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: { fontSize: Theme.fontSize.sm, color: Colors.textMuted },
  infoValue: { fontSize: Theme.fontSize.sm, color: Colors.textPrimary },

  // Price rows
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  priceLabel: { fontSize: Theme.fontSize.md, color: Colors.textSecondary },
  priceLabelBold: { fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary },
  priceValue: { fontSize: Theme.fontSize.md, color: Colors.textPrimary },
  priceValueBold: { fontWeight: Theme.fontWeight.bold },
  priceValueLarge: { fontSize: Theme.fontSize.xl },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },

  // Coupon
  couponInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 10,
    fontSize: Theme.fontSize.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    letterSpacing: 1.5,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    justifyContent: 'center',
  },
  applyBtnText: {
    color: Colors.white,
    fontWeight: Theme.fontWeight.bold,
    fontSize: Theme.fontSize.sm,
  },
  couponError: {
    fontSize: Theme.fontSize.xs,
    color: Colors.error,
    marginTop: 6,
  },
  viewCouponsBtn: { marginTop: Theme.spacing.sm },
  viewCouponsText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.primary,
    fontWeight: Theme.fontWeight.medium,
  },
  appliedCouponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  appliedCouponInfo: {},
  appliedCode: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.success,
    letterSpacing: 1,
  },
  appliedSaving: { fontSize: Theme.fontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  removeText: { fontSize: Theme.fontSize.sm, color: Colors.error, fontWeight: Theme.fontWeight.semiBold },

  // Payment methods
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  paymentOptionSelected: { backgroundColor: Colors.primaryLight, borderRadius: Theme.borderRadius.md, paddingHorizontal: 8 },
  paymentIcon: { fontSize: 22 },
  paymentLabel: { flex: 1, fontSize: Theme.fontSize.md, color: Colors.textSecondary },
  paymentLabelSelected: { color: Colors.primary, fontWeight: Theme.fontWeight.semiBold },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: { borderColor: Colors.primary },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  simulatedNote: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
    marginTop: Theme.spacing.md,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Theme.shadow.lg,
  },
  payLabel: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  payAmount: { fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.bold, color: Colors.primary },
  payBtn: { width: 160 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalDismissArea: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Theme.spacing.lg,
    maxHeight: '75%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sheetTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textPrimary,
  },
  sheetCloseBtn: {
    padding: 4,
    backgroundColor: Colors.inputBg,
    borderRadius: Theme.borderRadius.full,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetCloseText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: Theme.fontWeight.bold,
  },
  sheetHint: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
    marginBottom: Theme.spacing.md,
  },
});

export default CheckoutScreen;
