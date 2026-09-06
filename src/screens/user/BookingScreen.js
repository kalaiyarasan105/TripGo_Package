/**
 * BookingScreen
 *
 * Step 1 of the booking flow.
 * User selects:
 *  - Travel date (from package's available dates)
 *  - Number of adults (min 1)
 *  - Number of children (min 0, 70% price)
 * Price updates live as selections change.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import {
  initBooking,
  setTravelDate,
  setAdults,
  setChildren,
} from '../../redux/bookingSlice';
import { Colors, Theme } from '../../constants';
import { CustomButton } from '../../components';
import { MOCK_PACKAGES } from '../../constants/mockData';
import { formatPrice, formatDate } from '../../utils/helpers';

const BookingScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { packageId } = route.params || {};
  const pkg = MOCK_PACKAGES.find((p) => p._id === packageId);

  // Local state — mirrors what will go into Redux
  const [selectedDate, setSelectedDateLocal] = useState(null);
  const [adults, setAdultsLocal] = useState(1);
  const [children, setChildrenLocal] = useState(0);

  // Price calculations — done locally for instant UI feedback
  const childPrice = pkg ? Math.round(pkg.price * 0.7) : 0;
  const subtotal = pkg ? adults * pkg.price + children * childPrice : 0;

  // On mount, initialise the booking in Redux
  useEffect(() => {
    if (pkg) {
      dispatch(initBooking({
        packageId: pkg._id,
        packageName: pkg.name,
        packagePrice: pkg.price,
      }));
    }
  }, [pkg]);

  // ── Handlers ──────────────────────────────────────────────────

  const handleDateSelect = (date) => {
    setSelectedDateLocal(date);
    dispatch(setTravelDate(date));
  };

  const handleAdultsChange = (delta) => {
    const next = Math.max(1, adults + delta);
    setAdultsLocal(next);
    dispatch(setAdults(next));
  };

  const handleChildrenChange = (delta) => {
    const next = Math.max(0, children + delta);
    setChildrenLocal(next);
    dispatch(setChildren(next));
  };

  const handleProceed = () => {
    if (!selectedDate) {
      Alert.alert('Select a Date', 'Please choose a travel date to continue.');
      return;
    }
    navigation.navigate('Checkout');
  };

  if (!pkg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Package not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* ── Header ─────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Package</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Package Summary Card ─────────────────────── */}
        <View style={styles.packageCard}>
          <Text style={styles.packageName}>{pkg.name}</Text>
          <View style={styles.packageMeta}>
            <Text style={styles.metaText}>📍 {pkg.destination}</Text>
            <Text style={styles.metaText}>🕐 {pkg.duration} Days</Text>
          </View>
          <Text style={styles.packagePrice}>
            {formatPrice(pkg.price)}
            <Text style={styles.perPerson}> / person</Text>
          </Text>
        </View>

        {/* ── Step 1: Select Travel Date ───────────────── */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNum}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Select Travel Date</Text>
          </View>

          <Text style={styles.stepHint}>
            Choose from available departure dates
          </Text>

          <View style={styles.datesGrid}>
            {pkg.availableDates.map((date, idx) => {
              const isSelected = selectedDate === date;
              const isPast = new Date(date) < new Date();
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.dateChip,
                    isSelected && styles.dateChipSelected,
                    isPast && styles.dateChipDisabled,
                  ]}
                  onPress={() => !isPast && handleDateSelect(date)}
                  disabled={isPast}
                >
                  <Text
                    style={[
                      styles.dateChipText,
                      isSelected && styles.dateChipTextSelected,
                      isPast && styles.dateChipTextDisabled,
                    ]}
                  >
                    {formatDate(date)}
                  </Text>
                  {isPast && (
                    <Text style={styles.unavailableLabel}>Unavailable</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Step 2: Select Travelers ─────────────────── */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Select Travelers</Text>
          </View>

          {/* Adults row */}
          <View style={styles.travelerRow}>
            <View>
              <Text style={styles.travelerType}>Adults</Text>
              <Text style={styles.travelerPrice}>
                {formatPrice(pkg.price)} each
              </Text>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity
                style={[styles.counterBtn, adults <= 1 && styles.counterBtnDisabled]}
                onPress={() => handleAdultsChange(-1)}
                disabled={adults <= 1}
              >
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{adults}</Text>
              <TouchableOpacity
                style={[styles.counterBtn, adults >= pkg.maxTravelers && styles.counterBtnDisabled]}
                onPress={() => handleAdultsChange(1)}
                disabled={adults >= pkg.maxTravelers}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Children row */}
          <View style={[styles.travelerRow, { borderBottomWidth: 0 }]}>
            <View>
              <Text style={styles.travelerType}>Children</Text>
              <Text style={styles.travelerPrice}>
                {formatPrice(childPrice)} each (70% of adult)
              </Text>
              <Text style={styles.ageNote}>Age 2–12 years</Text>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity
                style={[styles.counterBtn, children === 0 && styles.counterBtnDisabled]}
                onPress={() => handleChildrenChange(-1)}
                disabled={children === 0}
              >
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{children}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => handleChildrenChange(1)}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Price Breakdown ──────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Adults ({adults} × {formatPrice(pkg.price)})
            </Text>
            <Text style={styles.priceValue}>
              {formatPrice(adults * pkg.price)}
            </Text>
          </View>

          {children > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Children ({children} × {formatPrice(childPrice)})
              </Text>
              <Text style={styles.priceValue}>
                {formatPrice(children * childPrice)}
              </Text>
            </View>
          )}

          <View style={styles.dividerLine} />

          <View style={styles.priceRow}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>{formatPrice(subtotal)}</Text>
          </View>

          <Text style={styles.couponNote}>
            🏷️ Coupons & discounts can be applied in the next step
          </Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── Bottom Bar ───────────────────────────────── */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatPrice(subtotal)}</Text>
          <Text style={styles.totalNote}>
            {adults} Adult{adults > 1 ? 's' : ''}
            {children > 0 ? ` + ${children} Child` : ''}
          </Text>
        </View>
        <CustomButton
          title="Proceed to Checkout →"
          onPress={handleProceed}
          style={styles.proceedBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Colors.error, fontSize: Theme.fontSize.md },

  // Header
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 22, color: Colors.white, fontWeight: 'bold' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.white,
  },

  scroll: { padding: Theme.spacing.md },

  // Package summary
  packageCard: {
    backgroundColor: Colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  packageName: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  packageMeta: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  metaText: { fontSize: Theme.fontSize.sm, color: 'rgba(255,255,255,0.85)' },
  packagePrice: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.extraBold,
    color: Colors.white,
  },
  perPerson: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.regular,
    color: 'rgba(255,255,255,0.7)',
  },

  // Sections
  section: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Theme.spacing.md,
  },

  // Step header
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNum: {
    color: Colors.white,
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.bold,
  },
  stepTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textPrimary,
  },
  stepHint: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
    marginBottom: Theme.spacing.md,
    marginLeft: 38,
  },

  // Date chips
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dateChip: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
  },
  dateChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  dateChipDisabled: {
    opacity: 0.4,
  },
  dateChipText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Theme.fontWeight.medium,
  },
  dateChipTextSelected: {
    color: Colors.primary,
    fontWeight: Theme.fontWeight.bold,
  },
  dateChipTextDisabled: {
    color: Colors.textMuted,
  },
  unavailableLabel: {
    fontSize: Theme.fontSize.xs,
    color: Colors.error,
    marginTop: 2,
  },

  // Traveler rows
  travelerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  travelerType: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  travelerPrice: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ageNote: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // +/- counter
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  counterBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  counterBtnDisabled: {
    backgroundColor: Colors.inputBg,
    borderColor: Colors.border,
    opacity: 0.5,
  },
  counterBtnText: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: Theme.fontWeight.bold,
    lineHeight: 22,
  },
  counterValue: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textPrimary,
    minWidth: 32,
    textAlign: 'center',
  },

  // Price breakdown
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  priceLabel: { fontSize: Theme.fontSize.md, color: Colors.textSecondary },
  priceValue: { fontSize: Theme.fontSize.md, color: Colors.textPrimary, fontWeight: Theme.fontWeight.medium },
  dividerLine: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },
  subtotalLabel: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary },
  subtotalValue: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.primary },
  couponNote: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
    marginTop: Theme.spacing.sm,
    fontStyle: 'italic',
  },

  // Bottom bar
  bottomBar: {
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
  totalLabel: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  totalAmount: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary,
  },
  totalNote: { fontSize: Theme.fontSize.xs, color: Colors.textSecondary },
  proceedBtn: { width: 200 },
});

export default BookingScreen;
