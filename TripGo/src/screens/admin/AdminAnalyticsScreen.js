/**
 * AdminAnalyticsScreen — Phase 12
 *
 * Revenue and booking analytics for admins.
 * - Revenue summary cards (total, monthly, avg per booking)
 * - Booking status distribution (visual bar chart)
 * - Top packages by bookings
 * - Monthly booking trend (text-based sparkline)
 * - Revenue by payment method breakdown
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Colors, Theme } from '../../constants';
import { formatPrice } from '../../utils/helpers';

const AdminAnalyticsScreen = ({ navigation }) => {
  const bookings = useSelector((s) => s.admin.bookings);
  const packages = useSelector((s) => s.admin.packages);
  const users = useSelector((s) => s.admin.users);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState('all'); // 'all' | 'month' | 'week'

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // ── Revenue metrics ──────────────────────────────────────────
  const paidBookings = bookings.filter((b) => b.paymentStatus === 'paid');
  const totalRevenue = paidBookings.reduce((s, b) => s + b.finalAmount, 0);
  const avgRevenue = paidBookings.length > 0 ? Math.round(totalRevenue / paidBookings.length) : 0;

  const now = new Date();
  const thisMonth = paidBookings.filter((b) => {
    const d = new Date(b.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthRevenue = thisMonth.reduce((s, b) => s + b.finalAmount, 0);

  // ── Booking status counts ───────────────────────────────────
  const statusCounts = bookings.reduce((acc, b) => {
    acc[b.bookingStatus] = (acc[b.bookingStatus] || 0) + 1;
    return acc;
  }, {});
  const totalBookings = bookings.length;

  const statusConfig = [
    { key: 'confirmed', label: 'Confirmed', color: Colors.primary, emoji: '✅' },
    { key: 'completed', label: 'Completed', color: Colors.success, emoji: '🏁' },
    { key: 'pending', label: 'Pending', color: Colors.warning, emoji: '⏳' },
    { key: 'cancelled', label: 'Cancelled', color: Colors.error, emoji: '❌' },
  ];

  // ── Top packages ─────────────────────────────────────────────
  const packageBookingCount = bookings.reduce((acc, b) => {
    const name = b.package?.name || 'Unknown';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const topPackages = Object.entries(packageBookingCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxPkgCount = topPackages[0]?.[1] || 1;

  // ── Payment method breakdown ─────────────────────────────────
  const paymentCounts = paidBookings.reduce((acc, b) => {
    const m = b.paymentMethod || 'other';
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});
  const paymentLabels = {
    card: { label: 'Card', emoji: '💳', color: Colors.primary },
    upi: { label: 'UPI', emoji: '📱', color: Colors.secondary },
    net_banking: { label: 'Net Banking', emoji: '🏦', color: Colors.success },
    wallet: { label: 'Wallet', emoji: '👛', color: '#9C27B0' },
  };

  // ── User growth ──────────────────────────────────────────────
  const activeUsers = users.filter((u) => u.isActive).length;
  const newUsersThisMonth = users.filter((u) => {
    const d = new Date(u.joinedAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primaryDark} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Revenue Cards ─────────────────────────── */}
        <Text style={styles.sectionTitle}>Revenue Overview</Text>
        <View style={styles.revenueRow}>
          <RevenueCard
            emoji="💰"
            label="Total Revenue"
            value={formatPrice(totalRevenue)}
            color={Colors.primary}
          />
          <RevenueCard
            emoji="📅"
            label="This Month"
            value={formatPrice(monthRevenue)}
            color={Colors.secondary}
          />
        </View>
        <View style={styles.revenueRow}>
          <RevenueCard
            emoji="📊"
            label="Avg per Booking"
            value={formatPrice(avgRevenue)}
            color={Colors.success}
          />
          <RevenueCard
            emoji="🎒"
            label="Total Bookings"
            value={bookings.length.toString()}
            color="#9C27B0"
          />
        </View>

        {/* ── Booking Status Distribution ───────────── */}
        <Text style={styles.sectionTitle}>Booking Status Breakdown</Text>
        <View style={styles.card}>
          {statusConfig.map((s) => {
            const count = statusCounts[s.key] || 0;
            const pct = totalBookings > 0 ? (count / totalBookings) * 100 : 0;
            return (
              <View key={s.key} style={styles.barRow}>
                <Text style={styles.barEmoji}>{s.emoji}</Text>
                <Text style={[styles.barLabel, { color: Colors.textSecondary }]}>
                  {s.label}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[styles.barFill, { width: `${pct}%`, backgroundColor: s.color }]}
                  />
                </View>
                <Text style={[styles.barCount, { color: s.color }]}>
                  {count} ({Math.round(pct)}%)
                </Text>
              </View>
            );
          })}
        </View>

        {/* ── Top Packages ──────────────────────────── */}
        <Text style={styles.sectionTitle}>Top Packages by Bookings</Text>
        <View style={styles.card}>
          {topPackages.map(([name, count], idx) => (
            <View key={idx} style={styles.topPkgRow}>
              <View style={[styles.rankBadge, { backgroundColor: idx === 0 ? Colors.star + '30' : Colors.primaryLight }]}>
                <Text style={[styles.rankText, { color: idx === 0 ? Colors.star : Colors.primary }]}>
                  #{idx + 1}
                </Text>
              </View>
              <Text style={[styles.pkgName, { color: Colors.textPrimary }]} numberOfLines={1}>
                {name}
              </Text>
              <View style={styles.pkgBarTrack}>
                <View
                  style={[
                    styles.pkgBarFill,
                    {
                      width: `${(count / maxPkgCount) * 100}%`,
                      backgroundColor: Colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.pkgCount, { color: Colors.primary }]}>{count}</Text>
            </View>
          ))}
        </View>

        {/* ── Payment Method Breakdown ──────────────── */}
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        <View style={[styles.card, styles.paymentGrid]}>
          {Object.entries(paymentCounts).map(([method, count]) => {
            const config = paymentLabels[method] || { label: method, emoji: '💵', color: Colors.textMuted };
            const pct = paidBookings.length > 0 ? Math.round((count / paidBookings.length) * 100) : 0;
            return (
              <View key={method} style={styles.paymentCard}>
                <Text style={styles.paymentEmoji}>{config.emoji}</Text>
                <Text style={[styles.paymentPct, { color: config.color }]}>{pct}%</Text>
                <Text style={[styles.paymentLabel, { color: Colors.textSecondary }]}>{config.label}</Text>
                <Text style={[styles.paymentCount, { color: Colors.textMuted }]}>{count} bookings</Text>
              </View>
            );
          })}
        </View>

        {/* ── User Metrics ──────────────────────────── */}
        <Text style={styles.sectionTitle}>User Metrics</Text>
        <View style={styles.card}>
          <View style={styles.userMetricRow}>
            <MetricItem emoji="👥" label="Total Users" value={users.length} color={Colors.primary} />
            <MetricItem emoji="✅" label="Active Users" value={activeUsers} color={Colors.success} />
            <MetricItem emoji="🆕" label="New This Month" value={newUsersThisMonth} color={Colors.secondary} />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const RevenueCard = ({ emoji, label, value, color }) => (
  <View style={[styles.revenueCard, { borderLeftColor: color }]}>
    <Text style={styles.revenueEmoji}>{emoji}</Text>
    <Text style={[styles.revenueValue, { color }]}>{value}</Text>
    <Text style={styles.revenueLabel}>{label}</Text>
  </View>
);

const MetricItem = ({ emoji, label, value, color }) => (
  <View style={styles.metricItem}>
    <Text style={styles.metricEmoji}>{emoji}</Text>
    <Text style={[styles.metricValue, { color }]}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  headerTitle: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: '#fff' },

  scroll: { padding: Theme.spacing.md },
  sectionTitle: {
    fontSize: Theme.fontSize.base,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
  },

  revenueRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  revenueCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    borderLeftWidth: 4,
    ...Theme.shadow.sm,
  },
  revenueEmoji: { fontSize: 24, marginBottom: 6 },
  revenueValue: { fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.extraBold },
  revenueLabel: { fontSize: Theme.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },

  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  barEmoji: { fontSize: 16, width: 22 },
  barLabel: { fontSize: Theme.fontSize.sm, width: 80 },
  barTrack: { flex: 1, height: 10, backgroundColor: Colors.border, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  barCount: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.bold, width: 70, textAlign: 'right' },

  topPkgRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  rankBadge: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  rankText: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.extraBold },
  pkgName: { flex: 1, fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.medium },
  pkgBarTrack: { width: 80, height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  pkgBarFill: { height: '100%', borderRadius: 4 },
  pkgCount: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.bold, width: 24, textAlign: 'right' },

  paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  paymentCard: {
    width: '47%',
    backgroundColor: Colors.inputBg,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
  },
  paymentEmoji: { fontSize: 28, marginBottom: 4 },
  paymentPct: { fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.extraBold },
  paymentLabel: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.medium, marginTop: 2 },
  paymentCount: { fontSize: Theme.fontSize.xs, marginTop: 2 },

  userMetricRow: { flexDirection: 'row', justifyContent: 'space-around' },
  metricItem: { alignItems: 'center' },
  metricEmoji: { fontSize: 28, marginBottom: 6 },
  metricValue: { fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.extraBold },
  metricLabel: { fontSize: Theme.fontSize.xs, color: Colors.textSecondary, marginTop: 2, textAlign: 'center' },
});

export default AdminAnalyticsScreen;
