/**
 * WelcomeScreen
 *
 * Phase 2 placeholder screen.
 * Demonstrates all reusable components working together.
 * Will be replaced by the Splash → Auth flow in Phase 3.
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Colors, Theme } from '../constants';
import {
  CustomButton,
  SearchBar,
  EmptyState,
  LoadingSpinner,
  PackageCard,
  DestinationCard,
  BookingCard,
  CouponCard,
} from '../components';

// ── Sample data to preview components ──────────────────────────
const SAMPLE_PACKAGE = {
  _id: '1',
  name: 'Goa Beach Paradise',
  destination: 'Goa, India',
  duration: 5,
  price: 18500,
  rating: 4.5,
  reviewCount: 128,
  images: [],
};

const SAMPLE_DESTINATION = {
  _id: '1',
  name: 'Manali',
  country: 'India',
  packageCount: 14,
  image: null,
};

const SAMPLE_BOOKING = {
  _id: 'abc123',
  bookingId: 'TG2024001',
  bookingStatus: 'confirmed',
  travelDate: '2025-12-25',
  adults: 2,
  children: 1,
  finalAmount: 55500,
  package: SAMPLE_PACKAGE,
};

const SAMPLE_COUPON = {
  _id: '1',
  code: 'TRIP20',
  discountType: 'percentage',
  discountValue: 20,
  minimumAmount: 10000,
  expiryDate: '2025-12-31',
};

// ───────────────────────────────────────────────────────────────

const WelcomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmpty, setShowEmpty] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  if (showLoading) {
    return <LoadingSpinner fullScreen message="Loading TripGo..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ───────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.appName}>✈️ TripGo</Text>
          <Text style={styles.subtitle}>Phase 2 – Components Preview</Text>
        </View>

        {/* ── Section: Search Bar ──────────────────────── */}
        <SectionTitle title="SearchBar" />
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search packages..."
          onClear={() => setSearchQuery('')}
        />

        {/* ── Section: Buttons ─────────────────────────── */}
        <SectionTitle title="CustomButton Variants" />
        <CustomButton title="Primary Button" onPress={() => {}} />
        <Spacer />
        <CustomButton title="Secondary Button" variant="secondary" onPress={() => {}} />
        <Spacer />
        <CustomButton title="Outline Button" variant="outline" onPress={() => {}} />
        <Spacer />
        <CustomButton title="Danger Button" variant="danger" onPress={() => {}} />
        <Spacer />
        <CustomButton title="Loading State" loading={true} onPress={() => {}} />
        <Spacer />
        <CustomButton title="Disabled State" disabled={true} onPress={() => {}} />

        {/* ── Section: Package Card ────────────────────── */}
        <SectionTitle title="PackageCard" />
        <PackageCard
          package={SAMPLE_PACKAGE}
          onPress={() => {}}
          onWishlist={() => setIsWishlisted(!isWishlisted)}
          isWishlisted={isWishlisted}
        />

        {/* ── Section: Destination Card ────────────────── */}
        <SectionTitle title="DestinationCard" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Manali', 'Kerala', 'Rajasthan', 'Kashmir'].map((name, idx) => (
            <DestinationCard
              key={idx}
              destination={{ name, country: 'India', packageCount: idx + 5 }}
              onPress={() => {}}
            />
          ))}
        </ScrollView>

        {/* ── Section: Booking Card ────────────────────── */}
        <SectionTitle title="BookingCard" />
        <BookingCard
          booking={SAMPLE_BOOKING}
          onPress={() => {}}
          onCancel={() => {}}
        />

        {/* ── Section: Coupon Card ─────────────────────── */}
        <SectionTitle title="CouponCard" />
        <CouponCard
          coupon={SAMPLE_COUPON}
          onApply={() => setCouponApplied(!couponApplied)}
          isApplied={couponApplied}
        />

        {/* ── Section: Empty State ─────────────────────── */}
        <SectionTitle title="EmptyState" />
        <CustomButton
          title={showEmpty ? 'Hide EmptyState' : 'Show EmptyState'}
          variant="outline"
          onPress={() => setShowEmpty(!showEmpty)}
        />
        {showEmpty && (
          <EmptyState
            emoji="🧳"
            title="No Packages Found"
            message="Try adjusting your filters or search with a different keyword."
            actionText="Clear Filters"
            onAction={() => setShowEmpty(false)}
          />
        )}

        {/* ── Section: Loading Spinner ─────────────────── */}
        <SectionTitle title="LoadingSpinner" />
        <CustomButton
          title="Show Full Screen Loader"
          variant="outline"
          onPress={() => {
            setShowLoading(true);
            setTimeout(() => setShowLoading(false), 2000);
          }}
        />
        <View style={styles.inlineSpinner}>
          <LoadingSpinner message="Fetching results..." size="small" />
        </View>

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Small helper components ──────────────────────────────────────

const SectionTitle = ({ title }) => (
  <View style={styles.sectionTitle}>
    <Text style={styles.sectionText}>{title}</Text>
  </View>
);

const Spacer = () => <View style={{ height: 10 }} />;

// ── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  container: {
    padding: Theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Theme.borderRadius.lg,
  },
  appName: {
    fontSize: Theme.fontSize.title,
    fontWeight: Theme.fontWeight.extraBold,
    color: Colors.white,
  },
  subtitle: {
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  sectionTitle: {
    backgroundColor: Colors.primaryLight,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  sectionText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inlineSpinner: {
    marginTop: Theme.spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    ...Theme.shadow.sm,
  },
});

export default WelcomeScreen;
