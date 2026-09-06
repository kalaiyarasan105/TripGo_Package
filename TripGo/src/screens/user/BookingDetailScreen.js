/**
 * BookingDetailScreen
 * Full detail view of a single booking.
 * Phase 12: Added "Write a Review" button for completed trips.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { cancelBooking } from '../../redux/bookingSlice';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { CustomButton } from '../../components';
import { formatPrice, formatDate, getBookingStatusInfo } from '../../utils/helpers';

const BookingDetailScreen = ({ navigation, route }) => {
  const { bookingId } = route.params;
  const dispatch = useDispatch();
  const C = useThemeColors();
  const booking = useSelector((state) =>
    state.booking.bookings.find((b) => b._id === bookingId)
  );

  if (!booking) {
    return (
      <View style={[styles.center, { backgroundColor: C.background }]}>
        <Text style={[styles.notFound, { color: C.textSecondary }]}>Booking not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.goBack, { color: C.primary }]}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = getBookingStatusInfo(booking.bookingStatus);
  const canCancel =
    booking.bookingStatus === 'confirmed' ||
    booking.bookingStatus === 'pending';
  const canReview = booking.bookingStatus === 'completed';

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel #${booking.bookingId}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            dispatch(cancelBooking(booking._id));
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Package Image */}
        {booking.package?.images?.[0] ? (
          <Image
            source={{ uri: booking.package.images[0] }}
            style={styles.packageImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.packageImage, styles.imagePlaceholder, { backgroundColor: C.primaryLight }]}>
            <Text style={{ fontSize: 48 }}>🏝️</Text>
          </View>
        )}

        {/* Status + Booking ID */}
        <View style={[styles.statusCard, { backgroundColor: C.surface }]}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              ● {statusInfo.label}
            </Text>
          </View>
          <Text style={[styles.bookingIdText, { color: C.textPrimary }]}>#{booking.bookingId}</Text>
          <Text style={[styles.bookedOn, { color: C.textMuted }]}>
            Booked on {formatDate(booking.createdAt)}
          </Text>
        </View>

        {/* Trip Info */}
        <View style={[styles.card, { backgroundColor: C.surface }]}>
          <Text style={[styles.cardTitle, { color: C.textPrimary, borderBottomColor: C.border }]}>Trip Information</Text>
          <DetailRow label="Package" value={booking.package?.name} C={C} />
          <DetailRow label="Destination" value={booking.package?.destination || '—'} C={C} />
          <DetailRow label="Travel Date" value={formatDate(booking.travelDate)} C={C} />
          <DetailRow label="Duration" value={`${booking.package?.duration || '—'} Days`} C={C} />
          <DetailRow
            label="Travelers"
            value={`${booking.adults} Adult${booking.adults > 1 ? 's' : ''}${
              booking.children > 0 ? ` + ${booking.children} Child` : ''
            }`}
            C={C}
          />
        </View>

        {/* Payment Info */}
        <View style={[styles.card, { backgroundColor: C.surface }]}>
          <Text style={[styles.cardTitle, { color: C.textPrimary, borderBottomColor: C.border }]}>Payment Information</Text>
          <DetailRow label="Subtotal" value={formatPrice(booking.subtotal)} C={C} />
          {booking.couponDiscount > 0 && (
            <DetailRow
              label={`Coupon (${booking.couponCode})`}
              value={`− ${formatPrice(booking.couponDiscount)}`}
              valueColor={C.success}
              C={C}
            />
          )}
          <View style={[styles.totalDivider, { backgroundColor: C.border }]} />
          <DetailRow label="Total Paid" value={formatPrice(booking.finalAmount)} bold C={C} />
          <DetailRow
            label="Payment Status"
            value={booking.paymentStatus === 'paid' ? '✓ Paid' : booking.paymentStatus}
            valueColor={booking.paymentStatus === 'paid' ? C.success : C.warning}
            C={C}
          />
          <DetailRow
            label="Payment Method"
            value={
              booking.paymentMethod === 'card' ? 'Credit/Debit Card'
              : booking.paymentMethod === 'upi' ? 'UPI'
              : booking.paymentMethod === 'net_banking' ? 'Net Banking'
              : 'Wallet'
            }
            C={C}
          />
        </View>

        {/* Write a Review — only for completed bookings */}
        {canReview && (
          <View style={[styles.reviewCard, { backgroundColor: C.primaryLight }]}>
            <Text style={[styles.reviewTitle, { color: C.primary }]}>⭐ How was your trip?</Text>
            <Text style={[styles.reviewDesc, { color: C.primaryDark }]}>
              Share your experience and help fellow travellers.
            </Text>
            <CustomButton
              title="Write a Review"
              onPress={() =>
                navigation.navigate('ReviewSubmit', {
                  bookingId: booking.bookingId,
                  packageId: booking.package?._id,
                  packageName: booking.package?.name,
                  destination: booking.package?.destination,
                })
              }
            />
          </View>
        )}

        {/* Cancel Button */}
        {canCancel && (
          <View style={styles.cancelWrapper}>
            <CustomButton
              title="Cancel Booking"
              variant="danger"
              onPress={handleCancel}
            />
            <Text style={[styles.cancelNote, { color: C.textMuted }]}>
              Cancellation policy: Full refund if cancelled 7+ days before travel date.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const DetailRow = ({ label, value, bold, valueColor, C }) => (
  <View style={[styles.detailRow, { borderBottomColor: C.border }]}>
    <Text style={[styles.detailLabel, { color: C.textMuted }]}>{label}</Text>
    <Text
      style={[
        styles.detailValue,
        { color: C.textPrimary },
        bold && [styles.detailValueBold, { color: C.primary }],
        valueColor && { color: valueColor },
      ]}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.lg },
  notFound: { fontSize: Theme.fontSize.md, marginBottom: 12 },
  goBack: { fontSize: Theme.fontSize.md },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 22, color: '#FFFFFF', fontWeight: 'bold' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: '#FFFFFF',
  },

  scroll: { padding: Theme.spacing.md },

  packageImage: {
    width: '100%',
    height: 200,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusCard: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    alignItems: 'center',
    ...Theme.shadow.sm,
  },
  statusBadge: {
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 8,
  },
  statusText: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.bold },
  bookingIdText: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.extraBold,
    letterSpacing: 1,
  },
  bookedOn: { fontSize: Theme.fontSize.xs, marginTop: 4 },

  card: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  cardTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    marginBottom: Theme.spacing.sm,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  detailLabel: { fontSize: Theme.fontSize.sm },
  detailValue: { fontSize: Theme.fontSize.sm, textAlign: 'right', maxWidth: '60%' },
  detailValueBold: { fontWeight: Theme.fontWeight.bold, fontSize: Theme.fontSize.md },
  totalDivider: { height: 1, marginVertical: 4 },

  reviewCard: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
  },
  reviewTitle: {
    fontSize: Theme.fontSize.base,
    fontWeight: Theme.fontWeight.bold,
    marginBottom: 4,
  },
  reviewDesc: {
    fontSize: Theme.fontSize.sm,
    lineHeight: 20,
    marginBottom: Theme.spacing.md,
  },

  cancelWrapper: { marginTop: Theme.spacing.sm },
  cancelNote: {
    fontSize: Theme.fontSize.xs,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    paddingHorizontal: Theme.spacing.md,
  },
});

export default BookingDetailScreen;
