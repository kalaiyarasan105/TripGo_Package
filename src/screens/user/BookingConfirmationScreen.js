/**
 * BookingConfirmationScreen
 *
 * Success screen shown after payment is processed.
 * Displays booking ID, trip details, and navigation options.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Colors, Theme } from '../../constants';
import { CustomButton } from '../../components';
import { formatPrice, formatDate } from '../../utils/helpers';

const BookingConfirmationScreen = ({ navigation, route }) => {
  const { booking } = route.params;

  // Bounce animation for the success checkmark
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'UserRoot' }],
    });
  };

  const handleViewBookings = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'UserRoot',
          state: {
            routes: [{ name: 'BookingsTab' }],
            index: 3,
          },
        },
      ],
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.success} barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Success Animation ────────────────────────── */}
        <View style={styles.successHeader}>
          <Animated.View
            style={[
              styles.checkCircle,
              {
                transform: [{ scale: bounceAnim }],
              },
            ]}
          >
            <Text style={styles.checkEmoji}>✅</Text>
          </Animated.View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your adventure is officially booked 🎉
          </Text>
        </View>

        {/* ── Booking ID Card ──────────────────────────── */}
        <Animated.View style={[styles.bookingIdCard, { opacity: fadeAnim }]}>
          <Text style={styles.bookingIdLabel}>Booking ID</Text>
          <Text style={styles.bookingId}>#{booking.bookingId}</Text>
          <Text style={styles.bookingIdNote}>
            Save this ID for future reference
          </Text>
        </Animated.View>

        {/* ── Trip Details ─────────────────────────────── */}
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>Trip Details</Text>

          <DetailRow emoji="📦" label="Package" value={booking.package?.name} />
          <DetailRow emoji="🗓️" label="Travel Date" value={formatDate(booking.travelDate)} />
          <DetailRow
            emoji="👥"
            label="Travelers"
            value={`${booking.adults} Adult${booking.adults > 1 ? 's' : ''}${
              booking.children > 0 ? ` + ${booking.children} Child` : ''
            }`}
          />
          <DetailRow emoji="📍" label="Destination" value={booking.package?.destination || '—'} />
        </Animated.View>

        {/* ── Payment Summary ──────────────────────────── */}
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>Payment Summary</Text>

          <DetailRow
            emoji="💰"
            label="Subtotal"
            value={formatPrice(booking.subtotal)}
          />
          {booking.couponDiscount > 0 && (
            <DetailRow
              emoji="🏷️"
              label={`Coupon (${booking.couponCode})`}
              value={`− ${formatPrice(booking.couponDiscount)}`}
              valueColor={Colors.success}
            />
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>{formatPrice(booking.finalAmount)}</Text>
          </View>

          <View style={styles.paymentBadge}>
            <Text style={styles.paymentBadgeText}>
              ✓ Payment Successful via{' '}
              {booking.paymentMethod === 'card'
                ? 'Credit/Debit Card'
                : booking.paymentMethod === 'upi'
                ? 'UPI'
                : booking.paymentMethod === 'net_banking'
                ? 'Net Banking'
                : 'Wallet'}
            </Text>
          </View>
        </Animated.View>

        {/* ── Next Steps ───────────────────────────────── */}
        <Animated.View style={[styles.nextStepsCard, { opacity: fadeAnim }]}>
          <Text style={styles.nextStepsTitle}>What's Next?</Text>
          {[
            { emoji: '📧', text: 'A confirmation will be sent to your email' },
            { emoji: '📞', text: 'Our team will contact you 48 hrs before the trip' },
            { emoji: '🧳', text: 'Check our packing guide in your booking details' },
          ].map((step, idx) => (
            <View key={idx} style={styles.nextStep}>
              <Text style={styles.nextStepEmoji}>{step.emoji}</Text>
              <Text style={styles.nextStepText}>{step.text}</Text>
            </View>
          ))}
        </Animated.View>

        {/* ── Action Buttons ───────────────────────────── */}
        <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
          <CustomButton
            title="View My Bookings"
            onPress={handleViewBookings}
          />
          <View style={{ height: 12 }} />
          <CustomButton
            title="Back to Home"
            variant="outline"
            onPress={handleGoHome}
          />
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

// ── Small helper component ───────────────────────────────────────
const DetailRow = ({ emoji, label, value, valueColor }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailEmoji}>{emoji}</Text>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, valueColor && { color: valueColor }]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Theme.spacing.md },

  // Success header
  successHeader: {
    alignItems: 'center',
    backgroundColor: Colors.success,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  checkEmoji: { fontSize: 44 },
  successTitle: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.extraBold,
    color: Colors.white,
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: Theme.fontSize.md,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },

  // Booking ID
  bookingIdCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  bookingIdLabel: {
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bookingId: {
    fontSize: Theme.fontSize.title,
    fontWeight: Theme.fontWeight.extraBold,
    color: Colors.white,
    letterSpacing: 2,
  },
  bookingIdNote: {
    fontSize: Theme.fontSize.xs,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
  },

  // Cards
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

  // Detail rows
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailEmoji: { fontSize: 16, marginRight: 10, width: 24 },
  detailLabel: { flex: 1, fontSize: Theme.fontSize.sm, color: Colors.textSecondary },
  detailValue: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.semiBold, color: Colors.textPrimary },

  // Total row
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary },
  totalValue: { fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.extraBold, color: Colors.primary },

  // Payment badge
  paymentBadge: {
    backgroundColor: Colors.successLight,
    borderRadius: Theme.borderRadius.md,
    padding: 10,
    marginTop: Theme.spacing.md,
    alignItems: 'center',
  },
  paymentBadgeText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.success,
    fontWeight: Theme.fontWeight.semiBold,
  },

  // Next steps
  nextStepsCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  nextStepsTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Theme.spacing.md,
  },
  nextStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  nextStepEmoji: { fontSize: 18, marginRight: 10, marginTop: 1 },
  nextStepText: { flex: 1, fontSize: Theme.fontSize.sm, color: Colors.textSecondary, lineHeight: 20 },

  // Buttons
  actions: { marginTop: Theme.spacing.sm },
});

export default BookingConfirmationScreen;
