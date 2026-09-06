/**
 * AdminBookingsScreen
 * View and manage all bookings — confirm, cancel, complete.
 */

import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, StatusBar,
  TouchableOpacity, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateBookingStatus } from '../../redux/adminSlice';
import { Colors, Theme } from '../../constants';
import { EmptyState } from '../../components';
import { formatPrice, formatDate, getBookingStatusInfo } from '../../utils/helpers';

const TABS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

const AdminBookingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const bookings = useSelector((s) => s.admin.bookings);
  const [activeTab, setActiveTab] = useState('All');

  const filtered = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    return b.bookingStatus === activeTab.toLowerCase();
  });

  const handleStatusChange = (booking, newStatus) => {
    const labels = { confirmed: 'Confirm', cancelled: 'Cancel', completed: 'Mark as Completed' };
    Alert.alert(
      `${labels[newStatus]} Booking`,
      `${labels[newStatus]} booking #${booking.bookingId}?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => dispatch(updateBookingStatus({ bookingId: booking._id, status: newStatus })) },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const statusInfo = getBookingStatusInfo(item.bookingStatus);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('AdminBookingDetail', { bookingId: item._id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.bookingId}>#{item.bookingId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
          </View>
        </View>

        <Text style={styles.userName}>{item.user?.name}</Text>
        <Text style={styles.packageName}>{item.package?.name}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>🗓️ {formatDate(item.travelDate)}</Text>
          <Text style={styles.meta}>👥 {item.adults + (item.children || 0)} travelers</Text>
          <Text style={[styles.meta, { color: Colors.primary, fontWeight: 'bold' }]}>{formatPrice(item.finalAmount)}</Text>
        </View>

        {/* Action buttons based on current status */}
        {item.bookingStatus === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.successLight }]} onPress={() => handleStatusChange(item, 'confirmed')}>
              <Text style={[styles.actionBtnText, { color: Colors.success }]}>✓ Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.errorLight }]} onPress={() => handleStatusChange(item, 'cancelled')}>
              <Text style={[styles.actionBtnText, { color: Colors.error }]}>✕ Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        {item.bookingStatus === 'confirmed' && (
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.primaryLight, flex: 1 }]} onPress={() => handleStatusChange(item, 'completed')}>
              <Text style={[styles.actionBtnText, { color: Colors.primary }]}>✓ Mark Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.errorLight }]} onPress={() => handleStatusChange(item, 'cancelled')}>
              <Text style={[styles.actionBtnText, { color: Colors.error }]}>✕ Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primaryDark} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookings ({bookings.length})</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <FlatList
          horizontal
          data={TABS}
          keyExtractor={(t) => t}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: tab }) => (
            <TouchableOpacity
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: Theme.spacing.md }}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState emoji="🎒" title={`No ${activeTab} Bookings`} message="No bookings in this category." />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primaryDark, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Theme.spacing.md, paddingVertical: Theme.spacing.md, paddingTop: Theme.spacing.lg,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 22, color: Colors.white, fontWeight: 'bold' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.white },
  tabBar: { backgroundColor: Colors.surface, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Theme.borderRadius.full, marginRight: 6, backgroundColor: Colors.inputBg },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: Theme.fontSize.sm, color: Colors.textMuted },
  tabTextActive: { color: Colors.white, fontWeight: Theme.fontWeight.bold },
  list: { padding: Theme.spacing.md, paddingBottom: 24 },
  card: { backgroundColor: Colors.surface, borderRadius: Theme.borderRadius.lg, padding: Theme.spacing.md, marginBottom: Theme.spacing.md, ...Theme.shadow.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  bookingId: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  statusBadge: { borderRadius: Theme.borderRadius.full, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.semiBold },
  userName: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary },
  packageName: { fontSize: Theme.fontSize.sm, color: Colors.textSecondary, marginBottom: 6 },
  metaRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 8 },
  meta: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: { flex: 1, borderRadius: Theme.borderRadius.sm, paddingVertical: 7, alignItems: 'center' },
  actionBtnText: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.semiBold },
});

export default AdminBookingsScreen;
