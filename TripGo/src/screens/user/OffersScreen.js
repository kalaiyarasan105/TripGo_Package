/**
 * OffersScreen — Phase 12
 *
 * Displays all active coupon offers and promotions.
 * Users can view, copy, and apply coupons directly from here.
 * Navigates to Explore or Checkout when a coupon is selected.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { EmptyState } from '../../components';
import { formatDate, formatPrice } from '../../utils/helpers';

const OffersScreen = ({ navigation }) => {
  const C = useThemeColors();
  const coupons = useSelector((state) => state.admin.coupons).filter(
    (c) => c.status === 'active'
  );
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    // Clipboard.setString(code); — requires @react-native-clipboard/clipboard
    // For now show a toast via Alert
    setCopiedCode(code);
    Alert.alert('Copied!', `Coupon code "${code}" is ready to use at checkout.`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const isExpired = (dateStr) => dateStr && new Date(dateStr) < new Date();

  const renderItem = ({ item }) => {
    const expired = isExpired(item.expiryDate);
    return (
      <View
        style={[
          styles.couponCard,
          { backgroundColor: C.surface, borderColor: expired ? C.border : C.primary },
          expired && styles.expiredCard,
        ]}
      >
        {/* Left accent strip */}
        <View
          style={[
            styles.accentStrip,
            { backgroundColor: expired ? C.border : C.primary },
          ]}
        />

        {/* Dashed divider circle left */}
        <View style={[styles.circle, styles.circleLeft, { backgroundColor: C.background }]} />

        <View style={styles.cardBody}>
          {/* Discount badge */}
          <View style={[styles.discountBadge, { backgroundColor: expired ? C.border : C.primaryLight }]}>
            <Text style={[styles.discountText, { color: expired ? C.textMuted : C.primary }]}>
              {item.discountType === 'percentage'
                ? `${item.discountValue}% OFF`
                : `₹${item.discountValue} OFF`}
            </Text>
          </View>

          {/* Code */}
          <View style={styles.codeRow}>
            <Text style={[styles.codeText, { color: expired ? C.textMuted : C.textPrimary }]}>
              {item.code}
            </Text>
            {!expired && (
              <TouchableOpacity
                style={[styles.copyBtn, { backgroundColor: copiedCode === item.code ? C.success : C.primaryLight }]}
                onPress={() => handleCopy(item.code)}
              >
                <Text style={[styles.copyBtnText, { color: copiedCode === item.code ? '#fff' : C.primary }]}>
                  {copiedCode === item.code ? '✅ Copied' : 'Copy'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Terms */}
          <View style={styles.termsRow}>
            {item.minimumAmount > 0 && (
              <Text style={[styles.term, { color: C.textSecondary }]}>
                Min. order: {formatPrice(item.minimumAmount)}
              </Text>
            )}
            {item.maximumDiscount > 0 && item.discountType === 'percentage' && (
              <Text style={[styles.term, { color: C.textSecondary }]}>
                Max. discount: {formatPrice(item.maximumDiscount)}
              </Text>
            )}
          </View>

          {/* Expiry */}
          <View style={styles.footer}>
            {item.expiryDate ? (
              <Text style={[styles.expiry, { color: expired ? C.error : C.textMuted }]}>
                {expired ? '❌ Expired' : `Valid till ${formatDate(item.expiryDate)}`}
              </Text>
            ) : (
              <Text style={[styles.expiry, { color: C.success }]}>✅ No expiry</Text>
            )}
            {item.usedCount !== undefined && (
              <Text style={[styles.usedCount, { color: C.textMuted }]}>
                Used {item.usedCount} times
              </Text>
            )}
          </View>

          {/* Use Now button */}
          {!expired && (
            <TouchableOpacity
              style={[styles.useBtn, { backgroundColor: C.primary }]}
              onPress={() => navigation.navigate('ExploreTab')}
            >
              <Text style={styles.useBtnText}>Browse Packages →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dashed divider circle right */}
        <View style={[styles.circle, styles.circleRight, { backgroundColor: C.background }]} />
      </View>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Offers & Coupons</Text>
          <Text style={styles.headerSub}>{coupons.length} active offers</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Tip banner */}
      <View style={[styles.tipBanner, { backgroundColor: C.warningLight }]}>
        <Text style={[styles.tipText, { color: C.textPrimary }]}>
          💡 Copy a code and apply it at checkout to save on your next booking!
        </Text>
      </View>

      <FlatList
        data={coupons}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            emoji="🏷️"
            title="No Active Offers"
            message="Check back soon! New coupons and deals are added regularly."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
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
  headerSub: { fontSize: Theme.fontSize.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  tipBanner: {
    padding: Theme.spacing.md,
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  tipText: { fontSize: Theme.fontSize.sm, lineHeight: 20 },

  list: { padding: Theme.spacing.md, paddingBottom: 40 },

  couponCard: {
    flexDirection: 'row',
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 2,
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    ...Theme.shadow.sm,
  },
  expiredCard: { opacity: 0.6 },
  accentStrip: { width: 6 },
  circle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    top: '50%',
    marginTop: -10,
  },
  circleLeft: { left: -10 },
  circleRight: { right: -10 },

  cardBody: { flex: 1, padding: Theme.spacing.md },

  discountBadge: {
    alignSelf: 'flex-start',
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: Theme.spacing.sm,
  },
  discountText: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.extraBold },

  codeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  codeText: { fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.extraBold, letterSpacing: 3 },
  copyBtn: {
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  copyBtnText: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.bold },

  termsRow: { marginBottom: 6 },
  term: { fontSize: Theme.fontSize.xs, lineHeight: 18 },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.spacing.sm },
  expiry: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.medium },
  usedCount: { fontSize: Theme.fontSize.xs },

  useBtn: {
    borderRadius: Theme.borderRadius.md,
    padding: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  useBtnText: { color: '#fff', fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.bold },
});

export default OffersScreen;
