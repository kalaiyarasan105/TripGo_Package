/**
 * AdminDashboardScreen
 * Main admin overview with stats and recent bookings.
 */

import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  StatusBar, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { Colors, Theme } from '../../constants';
import { formatPrice, formatDate, getBookingStatusInfo } from '../../utils/helpers';

const AdminDashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const packages = useSelector((s) => s.admin.packages);
  const bookings = useSelector((s) => s.admin.bookings);
  const users = useSelector((s) => s.admin.users);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };

  // Revenue = sum of all paid bookings
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.finalAmount, 0);

  const pendingBookings = bookings.filter((b) => b.bookingStatus === 'pending').length;
  const activePackages = packages.filter((p) => p.status === 'active').length;
  const activeUsers = users.filter((u) => u.isActive).length;

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primaryDark} barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreeting}>Admin Panel 🛡️</Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => { dispatch(logout()); navigation.replace('Splash'); }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard emoji="📦" label="Packages" value={activePackages} total={packages.length} color={Colors.primary} onPress={() => navigation.navigate('AdminPackages')} />
          <StatCard emoji="🎒" label="Bookings" value={bookings.length} badge={pendingBookings > 0 ? `${pendingBookings} pending` : null} color={Colors.secondary} onPress={() => navigation.navigate('AdminBookings')} />
          <StatCard emoji="👥" label="Users" value={activeUsers} total={users.length} color={Colors.success} onPress={() => navigation.navigate('AdminUsers')} />
          <StatCard emoji="💰" label="Revenue" value={formatPrice(totalRevenue)} color="#9C27B0" onPress={() => {}} />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {[
              { emoji: '➕', label: 'Add Package', onPress: () => navigation.navigate('AdminPackages') },
              { emoji: '🏷️', label: 'Coupons', onPress: () => navigation.navigate('AdminCoupons') },
              { emoji: '📋', label: 'All Bookings', onPress: () => navigation.navigate('AdminBookings') },
              { emoji: '⭐', label: 'Reviews', onPress: () => navigation.navigate('AdminReviews') },
              { emoji: '📊', label: 'Analytics', onPress: () => navigation.navigate('AdminAnalytics') },
              { emoji: '👥', label: 'Users', onPress: () => navigation.navigate('AdminUsers') },
            ].map((action, idx) => (
              <TouchableOpacity key={idx} style={styles.actionBtn} onPress={action.onPress}>
                <Text style={styles.actionEmoji}>{action.emoji}</Text>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminBookings')}>
              <Text style={styles.seeAll}>View All →</Text>
            </TouchableOpacity>
          </View>

          {recentBookings.map((booking) => {
            const statusInfo = getBookingStatusInfo(booking.bookingStatus);
            return (
              <TouchableOpacity
                key={booking._id}
                style={styles.bookingRow}
                onPress={() => navigation.navigate('AdminBookingDetail', { bookingId: booking._id })}
              >
                <View style={styles.bookingLeft}>
                  <Text style={styles.bookingId}>#{booking.bookingId}</Text>
                  <Text style={styles.bookingUser}>{booking.user?.name}</Text>
                  <Text style={styles.bookingPackage}>{booking.package?.name}</Text>
                </View>
                <View style={styles.bookingRight}>
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>
                      {statusInfo.label}
                    </Text>
                  </View>
                  <Text style={styles.bookingAmount}>{formatPrice(booking.finalAmount)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const StatCard = ({ emoji, label, value, total, badge, color, onPress }) => (
  <TouchableOpacity style={[styles.statCard, { borderTopColor: color }]} onPress={onPress}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    {total !== undefined && <Text style={styles.statTotal}>of {total}</Text>}
    {badge && <Text style={[styles.statBadge, { color }]}>{badge}</Text>}
    <Text style={styles.statLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.primaryDark,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg, paddingBottom: Theme.spacing.xl,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerGreeting: { fontSize: Theme.fontSize.sm, color: 'rgba(255,255,255,0.8)' },
  headerTitle: { fontSize: Theme.fontSize.xxl, fontWeight: Theme.fontWeight.extraBold, color: Colors.white },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Theme.borderRadius.full, paddingHorizontal: 14, paddingVertical: 6,
  },
  logoutText: { color: Colors.white, fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.semiBold },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', padding: Theme.spacing.md,
    gap: 10, marginTop: -Theme.spacing.sm,
  },
  statCard: {
    width: '47%', backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg, padding: Theme.spacing.md,
    alignItems: 'center', borderTopWidth: 4, ...Theme.shadow.md,
  },
  statEmoji: { fontSize: 28, marginBottom: 6 },
  statValue: { fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.extraBold },
  statTotal: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  statBadge: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.semiBold, marginTop: 2 },
  statLabel: { fontSize: Theme.fontSize.sm, color: Colors.textSecondary, marginTop: 4 },

  section: { paddingHorizontal: Theme.spacing.md, marginTop: Theme.spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.spacing.md },
  sectionTitle: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary, marginBottom: Theme.spacing.sm },
  seeAll: { fontSize: Theme.fontSize.sm, color: Colors.primary, fontWeight: Theme.fontWeight.semiBold },

  actionsGrid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  actionBtn: {
    width: '47%', backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg, padding: Theme.spacing.md,
    alignItems: 'center', ...Theme.shadow.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  actionEmoji: { fontSize: 28, marginBottom: 6 },
  actionLabel: { fontSize: Theme.fontSize.sm, color: Colors.textPrimary, fontWeight: Theme.fontWeight.medium, textAlign: 'center' },

  bookingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md, marginBottom: Theme.spacing.sm, ...Theme.shadow.sm,
  },
  bookingLeft: { flex: 1 },
  bookingId: { fontSize: Theme.fontSize.xs, color: Colors.textMuted, marginBottom: 2 },
  bookingUser: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.semiBold, color: Colors.textPrimary },
  bookingPackage: { fontSize: Theme.fontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  bookingRight: { alignItems: 'flex-end' },
  statusBadge: { borderRadius: Theme.borderRadius.full, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 4 },
  statusText: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.semiBold },
  bookingAmount: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold, color: Colors.primary },
});

export default AdminDashboardScreen;
