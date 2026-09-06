/**
 * AdminBookingDetailScreen
 * Full detail view of a booking for admin.
 */

import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  StatusBar, TouchableOpacity, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateBookingStatus } from '../../redux/adminSlice';
import { Colors, Theme } from '../../constants';
import { CustomButton } from '../../components';
import { formatPrice, formatDate, getBookingStatusInfo } from '../../utils/helpers';

const AdminBookingDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { bookingId } = route.params;
  const booking = useSelector((s) => s.admin.bookings.find((b) => b._id === bookingId));

  if (!booking) return (
    <View style={styles.center}>
      <Text>Booking not found.</Text>
    </View>
  );

  const statusInfo = getBookingStatusInfo(booking.bookingStatus);

  const handleAction = (newStatus, label) => {
    Alert.alert(`${label} Booking`, `${label} booking #${booking.bookingId}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => { dispatch(updateBookingStatus({ bookingId: booking._id, status: newStatus })); navigation.goBack(); } },
    ]);
  };

  const Row = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primaryDark} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Detail</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Status */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>● {statusInfo.label}</Text>
          </View>
          <Text style={styles.bookingIdText}>#{booking.bookingId}</Text>
        </View>

        {/* Customer Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer</Text>
          <Row label="Name" value={booking.user?.name} />
          <Row label="Email" value={booking.user?.email} />
        </View>

        {/* Trip Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trip Details</Text>
          <Row label="Package" value={booking.package?.name} />
          <Row label="Travel Date" value={formatDate(booking.travelDate)} />
          <Row label="Adults" value={booking.adults} />
          <Row label="Children" value={booking.children || 0} />
        </View>

        {/* Payment */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment</Text>
          <Row label="Total Amount" value={formatPrice(booking.finalAmount)} />
          <Row label="Payment Status" value={booking.paymentStatus} />
          <Row label="Booked On" value={formatDate(booking.createdAt)} />
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          {booking.bookingStatus === 'pending' && (
            <>
              <CustomButton title="✓ Confirm Booking" onPress={() => handleAction('confirmed', 'Confirm')} style={{ marginBottom: 10 }} />
              <CustomButton title="✕ Cancel Booking" variant="danger" onPress={() => handleAction('cancelled', 'Cancel')} />
            </>
          )}
          {booking.bookingStatus === 'confirmed' && (
            <>
              <CustomButton title="✓ Mark as Completed" onPress={() => handleAction('completed', 'Complete')} style={{ marginBottom: 10 }} />
              <CustomButton title="✕ Cancel Booking" variant="danger" onPress={() => handleAction('cancelled', 'Cancel')} />
            </>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: Colors.primaryDark, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Theme.spacing.md, paddingVertical: Theme.spacing.md, paddingTop: Theme.spacing.lg,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 22, color: Colors.white, fontWeight: 'bold' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.white },
  scroll: { padding: Theme.spacing.md },
  statusCard: { backgroundColor: Colors.surface, borderRadius: Theme.borderRadius.lg, padding: Theme.spacing.md, alignItems: 'center', marginBottom: Theme.spacing.md, ...Theme.shadow.sm },
  statusBadge: { borderRadius: Theme.borderRadius.full, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 8 },
  statusText: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.bold },
  bookingIdText: { fontSize: Theme.fontSize.xxl, fontWeight: Theme.fontWeight.extraBold, color: Colors.textPrimary, letterSpacing: 1 },
  card: { backgroundColor: Colors.surface, borderRadius: Theme.borderRadius.lg, padding: Theme.spacing.md, marginBottom: Theme.spacing.md, ...Theme.shadow.sm },
  cardTitle: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary, marginBottom: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLabel: { fontSize: Theme.fontSize.sm, color: Colors.textMuted },
  rowValue: { fontSize: Theme.fontSize.sm, color: Colors.textPrimary, fontWeight: Theme.fontWeight.medium },
  actionsCard: { marginBottom: Theme.spacing.md },
});

export default AdminBookingDetailScreen;
