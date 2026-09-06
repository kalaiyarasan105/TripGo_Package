/**
 * HomeScreen — Phase 12
 * Dark-mode aware. Wishlist connected to Redux.
 * Greeting personalised with user name + time of day.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../redux/wishlistSlice';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { SearchBar, PackageCard, DestinationCard } from '../../components';
import { MOCK_DESTINATIONS, MOCK_PACKAGES } from '../../constants/mockData';

const HomeScreen = ({ navigation }) => {
  const C = useThemeColors();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((s) => s.wishlist.items);
  const user = useSelector((s) => s.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const isWishlisted = (id) => wishlistItems.some((p) => p._id === id);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning ☀️';
    if (h < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  })();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[C.primary]} />
        }
      >
        {/* ── Header ──────────────────────────────────── */}
        <View style={[styles.headerBg, { backgroundColor: C.primary }]}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.userName}>
                {user?.name ? `Hey, ${user.name.split(' ')[0]}!` : 'Where to next?'}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.navigate('Search')}
              >
                <Text style={styles.headerIcon}>🔍</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Text style={styles.headerIcon}>🔔</Text>
              </TouchableOpacity>
            </View>
          </View>

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search destinations, packages..."
            onClear={() => setSearchQuery('')}
            onSubmit={() => navigation.navigate('Search')}
            style={styles.searchBar}
          />
        </View>

        {/* ── Promo Banner ────────────────────────────── */}
        <View style={styles.promoBanner}>
          <View style={styles.promoTextSide}>
            <Text style={styles.promoTag}>LIMITED OFFER</Text>
            <Text style={styles.promoTitle}>Get 20% off</Text>
            <Text style={styles.promoSubtitle}>on your first booking</Text>
            <TouchableOpacity
              style={styles.promoBtn}
              onPress={() => navigation.navigate('Offers')}
            >
              <Text style={styles.promoBtnText}>View Offers →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.promoEmoji}>🏝️</Text>
        </View>

        {/* ── Popular Destinations ────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>
              Popular Destinations
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ExploreTab', { screen: 'Destinations' })
              }
            >
              <Text style={[styles.seeAll, { color: C.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {MOCK_DESTINATIONS.map((dest) => (
              <DestinationCard
                key={dest._id}
                destination={dest}
                onPress={() =>
                  navigation.navigate('ExploreTab', {
                    screen: 'PackageList',
                    params: { destination: dest.name },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Recommended Packages ────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>
              Recommended Packages
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('ExploreTab')}>
              <Text style={[styles.seeAll, { color: C.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {MOCK_PACKAGES.slice(0, 4).map((pkg) => (
            <PackageCard
              key={pkg._id}
              package={pkg}
              onPress={() =>
                navigation.navigate('ExploreTab', {
                  screen: 'PackageDetails',
                  params: { packageId: pkg._id },
                })
              }
              onWishlist={() => dispatch(toggleWishlist(pkg))}
              isWishlisted={isWishlisted(pkg._id)}
            />
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },

  headerBg: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xxl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  greeting: { fontSize: Theme.fontSize.md, color: 'rgba(255,255,255,0.85)' },
  userName: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.extraBold,
    color: '#FFFFFF',
  },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: { fontSize: 20 },
  searchBar: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },

  promoBanner: {
    margin: Theme.spacing.md,
    marginTop: -Theme.spacing.lg,
    backgroundColor: '#FF6B35',
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Theme.shadow.md,
  },
  promoTextSide: { flex: 1 },
  promoTag: {
    fontSize: Theme.fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: Theme.fontWeight.bold,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  promoTitle: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.extraBold,
    color: '#FFFFFF',
  },
  promoSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: Theme.spacing.md,
  },
  promoBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: '#FF6B35',
    fontWeight: Theme.fontWeight.bold,
    fontSize: Theme.fontSize.sm,
  },
  promoEmoji: { fontSize: 64 },

  section: { paddingHorizontal: Theme.spacing.md, marginTop: Theme.spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold },
  seeAll: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.semiBold },
  horizontalList: { paddingRight: Theme.spacing.md },
});

export default HomeScreen;
