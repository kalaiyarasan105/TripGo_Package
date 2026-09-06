/**
 * BookingsScreen — My Bookings
 *
 * Shows all user bookings in 3 tabs:
 * - Upcoming (confirmed / pending)
 * - Completed
 * - Cancelled
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { cancelBooking } from '../../redux/bookingSlice';
import { Colors, Theme } from '../../constants';
import { BookingCard, EmptyState, LoadingSpinner } from '../../components';

const TABS = ['Upcoming', 'Completed', 'Cancelled'];

const BookingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.booking.bookings);

  const [activeTab, setActiveTab] = useState('Upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'Upcoming') {
      return b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending';
    }
    if (activeTab === 'Completed') return b.bookingStatus === 'completed';
    if (activeTab === 'Cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  // Cancel booking with confirmation dialog
  const handleCancel = (bookingId, bookingRef) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel booking #${bookingRef}? This action cannot be undone.`,
      [
        { text: 'No, Keep It', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => dispatch(cancelBooking(bookingId)),
        },
      ]
    );
  };

  const emptyMessages = {
    Upcoming: {
      emoji: '🗓️',
      title: 'No Upcoming Trips',
      message: 'Your confirmed and upcoming bookings will appear here.',
      action: 'Browse Packages',
    },
    Completed: {
      emoji: '✅',
      title: 'No Completed Trips',
      message: 'Your past completed trips will show up here.',
      action: null,
    },
    Cancelled: {
      emoji: '❌',
      title: 'No Cancelled Bookings',
      message: "You haven't cancelled any bookings.",
      action: null,
    },
  };

  const emptyInfo = emptyMessages[activeTab];

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>
          {bookings.length} total booking{bookings.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          // Show count badge on each tab
          const count = bookings.filter((b) => {
            if (tab === 'Upcoming') return b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending';
            if (tab === 'Completed') return b.bookingStatus === 'completed';
            if (tab === 'Cancelled') return b.bookingStatus === 'cancelled';
            return false;
          }).length;

          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
              >
                {tab}
              </Text>
              {count > 0 && (
                <View
                  style={[
                    styles.tabBadge,
                    activeTab === tab && styles.tabBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      activeTab === tab && styles.tabBadgeTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() =>
              navigation.navigate('BookingDetail', { bookingId: item._id })
            }
            onCancel={
              item.bookingStatus === 'confirmed' || item.bookingStatus === 'pending'
                ? () => handleCancel(item._id, item.bookingId)
                : null
            }
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            emoji={emptyInfo.emoji}
            title={emptyInfo.title}
            message={emptyInfo.message}
            actionText={emptyInfo.action}
            onAction={
              emptyInfo.action
                ? () => navigation.navigate('ExploreTab')
                : undefined
            }
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.lg,
    borderBottomLeftRadius: 0,
  },
  headerTitle: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.extraBold,
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: Theme.fontSize.sm, color: Colors.textMuted },
  tabTextActive: { color: Colors.primary, fontWeight: Theme.fontWeight.bold },
  tabBadge: {
    backgroundColor: Colors.border,
    borderRadius: Theme.borderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeActive: { backgroundColor: Colors.primary },
  tabBadgeText: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  tabBadgeTextActive: { color: Colors.white, fontWeight: Theme.fontWeight.bold },

  list: { padding: Theme.spacing.md, paddingBottom: 24 },
});

export default BookingsScreen;
