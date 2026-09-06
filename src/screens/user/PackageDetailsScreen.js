/**
 * PackageDetailsScreen
 * Full detail view for a single package.
 * Shows images, description, includes/excludes, day-wise itinerary, and reviews.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../redux/wishlistSlice';
import { useThemeColors } from '../../utils/themeUtils';
import { Colors, Theme } from '../../constants';
import { CustomButton } from '../../components';
import { MOCK_PACKAGES, MOCK_REVIEWS } from '../../constants/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS = ['Overview', 'Itinerary', 'Includes', 'Reviews'];

const PackageDetailsScreen = ({ navigation, route }) => {
  const { packageId } = route.params;
  const pkg = MOCK_PACKAGES.find((p) => p._id === packageId);
  const dispatch = useDispatch();
  const C = useThemeColors();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((p) => p._id === packageId);

  const [activeTab, setActiveTab] = useState('Overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!pkg) {
    return (
      <View style={styles.center}>
        <Text>Package not found.</Text>
      </View>
    );
  }

  const formatPrice = (price) => '₹' + price?.toLocaleString('en-IN');

  // ── Tab Content ─────────────────────────────────────────────

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Quick stats row */}
      <View style={styles.statsRow}>
        <StatBox emoji="🕐" label="Duration" value={`${pkg.duration} Days`} />
        <StatBox emoji="⭐" label="Rating" value={pkg.rating?.toFixed(1)} />
        <StatBox emoji="👥" label="Max Group" value={`${pkg.maxTravelers} pax`} />
        <StatBox emoji="📍" label="Destination" value={pkg.destination} />
      </View>

      {/* Description */}
      <Text style={styles.sectionLabel}>About this Package</Text>
      <Text style={styles.description}>{pkg.description}</Text>

      {/* Available dates */}
      <Text style={styles.sectionLabel}>Available Dates</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {pkg.availableDates.map((date, idx) => (
          <View key={idx} style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>
              {new Date(date).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
              })}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderItinerary = () => (
    <View style={styles.tabContent}>
      {pkg.itinerary.map((day, idx) => (
        <View key={idx} style={styles.itineraryItem}>
          {/* Day badge + vertical line */}
          <View style={styles.dayColumn}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>D{day.day}</Text>
            </View>
            {idx < pkg.itinerary.length - 1 && <View style={styles.dayLine} />}
          </View>
          <View style={styles.dayContent}>
            <Text style={styles.dayTitle}>{day.title}</Text>
            <Text style={styles.dayDescription}>{day.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderIncludes = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionLabel}>✅ What's Included</Text>
      {pkg.includedServices.map((item, idx) => (
        <View key={idx} style={styles.serviceRow}>
          <Text style={styles.serviceIcon}>✅</Text>
          <Text style={styles.serviceText}>{item}</Text>
        </View>
      ))}

      <Text style={[styles.sectionLabel, { marginTop: Theme.spacing.lg }]}>
        ❌ Not Included
      </Text>
      {pkg.excludedServices.map((item, idx) => (
        <View key={idx} style={styles.serviceRow}>
          <Text style={styles.serviceIcon}>❌</Text>
          <Text style={styles.serviceText}>{item}</Text>
        </View>
      ))}
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      {/* Average rating summary */}
      <View style={styles.ratingCard}>
        <Text style={styles.ratingBig}>{pkg.rating?.toFixed(1)}</Text>
        <View>
          <Text style={styles.stars}>{'⭐'.repeat(Math.round(pkg.rating))}</Text>
          <Text style={styles.reviewCountText}>
            Based on {pkg.reviewCount} reviews
          </Text>
        </View>
      </View>

      {/* Individual reviews */}
      {MOCK_REVIEWS.map((review) => (
        <View key={review._id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {review.user.name.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewerName}>{review.user.name}</Text>
              <Text style={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </Text>
            </View>
            <Text style={styles.reviewStars}>
              {'⭐'.repeat(review.rating)}
            </Text>
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
      ))}
    </View>
  );

  const tabContentMap = {
    Overview: renderOverview,
    Itinerary: renderItinerary,
    Includes: renderIncludes,
    Reviews: renderReviews,
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Image Gallery ─────────────────────────── */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentImageIndex(idx);
            }}
            scrollEventThrottle={16}
          >
            {(pkg.images.length > 0 ? pkg.images : ['placeholder']).map((img, idx) => (
              <Image
                key={idx}
                source={img !== 'placeholder' ? { uri: img } : { uri: 'https://via.placeholder.com/600x400?text=TripGo' }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Overlay gradient buttons */}
          <View style={styles.imageOverlay}>
            {/* Back button */}
            <TouchableOpacity
              style={styles.backCircle}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            {/* Wishlist button */}
            <TouchableOpacity
              style={styles.backCircle}
              onPress={() => dispatch(toggleWishlist(pkg))}
            >
              <Text style={{ fontSize: 20 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>

          {/* Image pagination dots */}
          {pkg.images.length > 1 && (
            <View style={styles.dots}>
              {pkg.images.map((_, idx) => (
                <View
                  key={idx}
                  style={[styles.dot, idx === currentImageIndex && styles.dotActive]}
                />
              ))}
            </View>
          )}
        </View>

        {/* ── Package Title Card ─────────────────────── */}
        <View style={styles.titleCard}>
          <Text style={styles.packageName}>{pkg.name}</Text>
          <View style={styles.titleRow}>
            <Text style={styles.destinationText}>📍 {pkg.destination}</Text>
            <Text style={styles.price}>{formatPrice(pkg.price)}<Text style={styles.perPerson}>/person</Text></Text>
          </View>
        </View>

        {/* ── Tabs ──────────────────────────────────── */}
        <View style={styles.tabBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Active Tab Content ─────────────────────── */}
        {tabContentMap[activeTab]()}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Bottom Book Button (fixed) ─────────────── */}
      <View style={styles.bookingBar}>
        <View>
          <Text style={styles.bookingPrice}>{formatPrice(pkg.price)}</Text>
          <Text style={styles.bookingPerPerson}>per person</Text>
        </View>
        <CustomButton
          title="Book Now"
          onPress={() =>
            navigation.navigate('Booking', { packageId: pkg._id })
          }
          style={styles.bookBtn}
        />
      </View>
    </View>
  );
};

// ── Small reusable stat box ─────────────────────────────────────
const StatBox = ({ emoji, label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Images
  imageContainer: { position: 'relative' },
  heroImage: { width: SCREEN_WIDTH, height: 280 },
  imageOverlay: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: { fontSize: 20, color: Colors.white, fontWeight: 'bold' },
  dots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: Colors.white, width: 18 },

  // Title card
  titleCard: {
    backgroundColor: Colors.surface,
    padding: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  packageName: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.extraBold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destinationText: { fontSize: Theme.fontSize.md, color: Colors.textSecondary },
  price: { fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.bold, color: Colors.primary },
  perPerson: { fontSize: Theme.fontSize.sm, color: Colors.textMuted, fontWeight: 'normal' },

  // Tabs
  tabBar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Theme.spacing.md,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: Theme.fontSize.md, color: Colors.textMuted },
  tabTextActive: { color: Colors.primary, fontWeight: Theme.fontWeight.bold },

  // Tab content
  tabContent: { padding: Theme.spacing.md },
  sectionLabel: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
  },
  description: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    borderRadius: Theme.borderRadius.md,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.bold, color: Colors.primary },
  statLabel: { fontSize: Theme.fontSize.xs, color: Colors.textMuted, marginTop: 2 },

  // Dates
  dateBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginTop: 4,
  },
  dateBadgeText: { fontSize: Theme.fontSize.sm, color: Colors.primary, fontWeight: Theme.fontWeight.medium },

  // Itinerary
  itineraryItem: { flexDirection: 'row', marginBottom: Theme.spacing.sm },
  dayColumn: { alignItems: 'center', marginRight: 12 },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBadgeText: { color: Colors.white, fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.bold },
  dayLine: { width: 2, flex: 1, backgroundColor: Colors.primaryLight, marginTop: 4, minHeight: 24 },
  dayContent: {
    flex: 1,
    paddingBottom: Theme.spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: 12,
    marginBottom: 8,
    ...Theme.shadow.sm,
  },
  dayTitle: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  dayDescription: { fontSize: Theme.fontSize.sm, color: Colors.textSecondary, lineHeight: 20 },

  // Includes
  serviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  serviceIcon: { fontSize: 16, marginRight: 10 },
  serviceText: { fontSize: Theme.fontSize.md, color: Colors.textSecondary },

  // Reviews
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    gap: 16,
  },
  ratingBig: { fontSize: 48, fontWeight: Theme.fontWeight.extraBold, color: Colors.primary },
  stars: { fontSize: 20 },
  reviewCountText: { fontSize: Theme.fontSize.sm, color: Colors.textSecondary, marginTop: 4 },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: { color: Colors.white, fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold },
  reviewerName: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.semiBold, color: Colors.textPrimary },
  reviewDate: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  reviewStars: { fontSize: 12 },
  reviewComment: { fontSize: Theme.fontSize.md, color: Colors.textSecondary, lineHeight: 22 },

  // Bottom booking bar
  bookingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Theme.shadow.lg,
  },
  bookingPrice: { fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.bold, color: Colors.primary },
  bookingPerPerson: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  bookBtn: { width: 140 },
});

export default PackageDetailsScreen;
