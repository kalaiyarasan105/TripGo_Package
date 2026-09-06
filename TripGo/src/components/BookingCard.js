/**
 * BookingCard Component
 *
 * Displays a single booking summary in "My Bookings" screen.
 * Shows status badge with color coding.
 *
 * Usage:
 *   <BookingCard
 *     booking={item}
 *     onPress={() => navigation.navigate('BookingDetails', { id: item._id })}
 *     onCancel={() => handleCancel(item._id)}
 *   />
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors, Theme, BOOKING_STATUS } from '../constants';

const BookingCard = ({ booking, onPress, onCancel }) => {
  if (!booking) return null;

  // Returns color and label for each booking status
  const getStatusStyle = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
        return { bg: Colors.successLight, text: Colors.success, label: 'Confirmed' };
      case BOOKING_STATUS.COMPLETED:
        return { bg: Colors.primaryLight, text: Colors.primary, label: 'Completed' };
      case BOOKING_STATUS.CANCELLED:
        return { bg: Colors.errorLight, text: Colors.error, label: 'Cancelled' };
      default: // pending
        return { bg: Colors.warningLight, text: Colors.warning, label: 'Pending' };
    }
  };

  const statusStyle = getStatusStyle(booking.bookingStatus);

  // Format date to readable string — e.g. "25 Aug 2025"
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (amount) => {
    return '₹' + amount?.toLocaleString('en-IN');
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Package image + status badge */}
      <View style={styles.imageSection}>
        <Image
          source={
            booking.package?.images?.[0]
              ? { uri: booking.package.images[0] }
              : { uri: 'https://via.placeholder.com/300x200?text=Booking' }
          }
          style={styles.image}
          resizeMode="cover"
        />
        {/* Status badge overlaid on the image */}
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {statusStyle.label}
          </Text>
        </View>
      </View>

      {/* Booking details */}
      <View style={styles.details}>
        <Text style={styles.packageName} numberOfLines={1}>
          {booking.package?.name || 'Package'}
        </Text>

        <Text style={styles.bookingId}>
          ID: #{booking.bookingId || booking._id?.slice(-6).toUpperCase()}
        </Text>

        <Text style={styles.travelDate}>
          🗓️ {formatDate(booking.travelDate)}
        </Text>

        <Text style={styles.travelers}>
          👥 {booking.adults} Adult{booking.adults > 1 ? 's' : ''}
          {booking.children > 0 ? ` + ${booking.children} Child` : ''}
        </Text>

        {/* Footer: price + cancel button */}
        <View style={styles.footer}>
          <Text style={styles.amount}>{formatPrice(booking.finalAmount)}</Text>

          {/* Only show cancel if booking is pending or confirmed */}
          {onCancel &&
            (booking.bookingStatus === BOOKING_STATUS.PENDING ||
              booking.bookingStatus === BOOKING_STATUS.CONFIRMED) && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={(e) => {
                  e.stopPropagation(); // Prevent triggering card onPress
                  onCancel();
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.md,
  },
  imageSection: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: '100%',
    minHeight: 110,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  statusText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: Theme.fontWeight.semiBold,
  },
  details: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  packageName: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  bookingId: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  travelDate: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  travelers: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: Theme.fontSize.base,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary,
  },
  cancelBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelText: {
    fontSize: Theme.fontSize.xs,
    color: Colors.error,
    fontWeight: Theme.fontWeight.medium,
  },
});

export default BookingCard;
