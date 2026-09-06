/**
 * ProfileScreen — Professional, no emojis
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/themeSlice';
import { logout } from '../../redux/authSlice';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { CustomButton } from '../../components';

// Clean Unicode symbols — no color emojis
const MENU_ITEMS_CONFIG = [
  { symbol: '•', label: 'Notifications',       route: 'Notifications'  },
  { symbol: '•', label: 'My Bookings',          route: 'BookingsTab'    },
  { symbol: '•', label: 'My Wishlist',          route: 'WishlistTab'    },
  { symbol: '•', label: 'My Reviews',           route: 'MyReviews'      },
  { symbol: '•', label: 'Offers & Coupons',     route: 'Offers'         },
  { symbol: '•', label: 'Change Password',      route: 'ChangePassword' },
  { symbol: '•', label: 'Help & Support',       route: 'HelpSupport'    },
  { symbol: '•', label: 'Terms & Privacy',      route: 'Terms'          },
];

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const C = useThemeColors();
  const isDark = useSelector((s) => s.theme.isDark);
  const user = useSelector((s) => s.auth.user);
  const bookings = useSelector((s) => s.booking.bookings);
  const wishlistCount = useSelector((s) => s.wishlist.items.length);
  const myReviews = useSelector((s) => s.reviews.myReviews.length);
  const unreadCount = useSelector(
    (s) => s.notifications.items.filter((n) => !n.isRead).length
  );

  const displayUser = {
    name: user?.name || 'Traveller',
    email: user?.email || '',
    phone: user?.phone || '',
    initials: (user?.name || 'T')
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
  };

  const completedBookings = bookings.filter(
    (b) => b.bookingStatus === 'completed'
  ).length;

  const getBadge = (label) => {
    if (label === 'Notifications') return unreadCount > 0 ? unreadCount : null;
    if (label === 'My Wishlist') return wishlistCount > 0 ? wishlistCount : null;
    if (label === 'My Reviews') return myReviews > 0 ? myReviews : null;
    return null;
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => { dispatch(logout()); navigation.replace('Splash'); },
      },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ───────────────────────────────── */}
        <View style={[styles.headerBg, { backgroundColor: C.primary }]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{displayUser.initials}</Text>
          </View>
          <Text style={styles.userName}>{displayUser.name}</Text>
          {displayUser.email ? (
            <Text style={styles.userEmail}>{displayUser.email}</Text>
          ) : null}
          {displayUser.phone ? (
            <Text style={styles.userPhone}>{displayUser.phone}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats ────────────────────────────────── */}
        <View style={styles.statsRow}>
          <StatBox value={bookings.length} label="Total Trips" C={C} />
          <StatBox value={completedBookings} label="Completed" C={C} />
          <StatBox value={wishlistCount} label="Wishlist" C={C} />
        </View>

        {/* ── Dark Mode ────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={styles.darkModeRow}>
            <View style={styles.darkModeLeft}>
              <View style={[styles.iconDot, { backgroundColor: C.primary }]} />
              <View>
                <Text style={[styles.darkModeLabel, { color: C.textPrimary }]}>
                  Dark Mode
                </Text>
                <Text style={[styles.darkModeSubLabel, { color: C.textSecondary }]}>
                  {isDark ? 'Currently dark theme' : 'Currently light theme'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => dispatch(toggleTheme())}
              trackColor={{ false: C.border, true: C.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ── Menu ─────────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
          {MENU_ITEMS_CONFIG.map((item, idx) => {
            const badge = getBadge(item.label);
            return (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  { borderBottomColor: C.border },
                  idx === MENU_ITEMS_CONFIG.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => navigation.navigate(item.route)}
                activeOpacity={0.7}
              >
                <Text style={[styles.menuLabel, { color: C.textPrimary }]}>
                  {item.label}
                </Text>
                {badge != null && (
                  <View style={[styles.badge, { backgroundColor: C.primary }]}>
                    <Text style={styles.badgeText}>{badge}</Text>
                  </View>
                )}
                <Text style={[styles.chevron, { color: C.textMuted }]}>›</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Logout ───────────────────────────────── */}
        <View style={styles.logoutWrapper}>
          <CustomButton title="Sign Out" variant="danger" onPress={handleLogout} />
        </View>

        <Text style={[styles.version, { color: C.textMuted }]}>TripGo v1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const StatBox = ({ value, label, C }) => (
  <View style={[styles.statBox, { backgroundColor: C.surface }]}>
    <Text style={[styles.statValue, { color: C.primary }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: C.textSecondary }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1 },

  headerBg: {
    alignItems: 'center',
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xxl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  userEmail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 3,
  },
  userPhone: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: Theme.spacing.md,
  },
  editBtn: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.md,
    marginTop: -Theme.spacing.lg,
    gap: 10,
    marginBottom: Theme.spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.lg,
    paddingVertical: 16,
    paddingHorizontal: 8,
    ...Theme.shadow.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  card: {
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    ...Theme.shadow.sm,
  },

  darkModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  darkModeLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  darkModeLabel: { fontSize: 15, fontWeight: '600' },
  darkModeSubLabel: { fontSize: 12, marginTop: 2 },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '400', letterSpacing: 0.1 },
  badge: {
    borderRadius: Theme.borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chevron: { fontSize: 20 },

  logoutWrapper: {
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  version: {
    textAlign: 'center',
    fontSize: 11,
    marginBottom: Theme.spacing.sm,
    letterSpacing: 0.5,
  },
});

export default ProfileScreen;
