/**
 * PackageCard Component
 *
 * Displays a travel package in a card format.
 * Used on the Home screen, Explore screen, and Search results.
 *
 * Usage:
 *   <PackageCard
 *     package={item}
 *     onPress={() => navigation.navigate('PackageDetails', { id: item._id })}
 *     onWishlist={() => toggleWishlist(item._id)}
 *     isWishlisted={wishlist.includes(item._id)}
 *   />
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors, Theme } from '../constants';

const PackageCard = ({
  package: pkg,
  onPress,
  onWishlist,
  isWishlisted = false,
  horizontal = false, // If true, renders a wider landscape card
}) => {
  if (!pkg) return null;

  // Format price with comma separators — e.g. 12500 → ₹12,500
  const formatPrice = (price) => {
    return '₹' + price?.toLocaleString('en-IN');
  };

  // Show stars based on rating number
  const renderStars = (rating) => {
    const stars = Math.round(rating || 0);
    return '⭐'.repeat(stars);
  };

  if (horizontal) {
    // ── Horizontal / Landscape Card (used in featured sections) ──
    return (
      <TouchableOpacity
        style={styles.horizontalCard}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {/* Package Image */}
        <Image
          source={
            pkg.images && pkg.images[0]
              ? { uri: pkg.images[0] }
              : { uri: 'https://via.placeholder.com/400x300?text=TripGo' }
          }
          style={styles.horizontalImage}
          resizeMode="cover"
        />

        {/* Card Body */}
        <View style={styles.horizontalBody}>
          <Text style={styles.packageName} numberOfLines={1}>
            {pkg.name}
          </Text>
          <Text style={styles.destination} numberOfLines={1}>
            📍 {pkg.destination}
          </Text>
          <Text style={styles.duration}>🕐 {pkg.duration} Days</Text>

          <View style={styles.footer}>
            <Text style={styles.price}>{formatPrice(pkg.price)}</Text>
            <Text style={styles.perPerson}>/ person</Text>
          </View>
        </View>

        {/* Wishlist heart button */}
        {onWishlist && (
          <TouchableOpacity style={styles.wishlistBtn} onPress={onWishlist}>
            <Text style={styles.wishlistIcon}>
              {isWishlisted ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  // ── Vertical / Portrait Card (default — used in grid/list views) ──
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Package Image */}
      <View style={styles.imageContainer}>
        <Image
          source={
            pkg.images && pkg.images[0]
              ? { uri: pkg.images[0] }
              : { uri: 'https://via.placeholder.com/400x300?text=TripGo' }
          }
          style={styles.image}
          resizeMode="cover"
        />

        {/* Duration badge on top of image */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationBadgeText}>{pkg.duration}D</Text>
        </View>

        {/* Wishlist button on image */}
        {onWishlist && (
          <TouchableOpacity style={styles.wishlistBtn} onPress={onWishlist}>
            <Text style={styles.wishlistIcon}>
              {isWishlisted ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Card Content */}
      <View style={styles.content}>
        {/* Package Name */}
        <Text style={styles.packageName} numberOfLines={1}>
          {pkg.name}
        </Text>

        {/* Destination */}
        <Text style={styles.destination} numberOfLines={1}>
          📍 {pkg.destination}
        </Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.stars}>{renderStars(pkg.rating)}</Text>
          <Text style={styles.ratingText}>
            {pkg.rating?.toFixed(1)} ({pkg.reviewCount || 0})
          </Text>
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(pkg.price)}</Text>
          <Text style={styles.perPerson}> / person</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // ── Vertical Card ──────────────────────────────────────────────
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.md,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  durationBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.primary,
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  durationBadgeText: {
    color: Colors.white,
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.bold,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: Theme.borderRadius.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistIcon: {
    fontSize: 16,
  },
  content: {
    padding: Theme.spacing.md,
  },
  packageName: {
    fontSize: Theme.fontSize.base,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  destination: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stars: {
    fontSize: 12,
    marginRight: 4,
  },
  ratingText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary,
  },
  perPerson: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textMuted,
  },

  // ── Horizontal Card ────────────────────────────────────────────
  horizontalCard: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.md,
  },
  horizontalImage: {
    width: 110,
    height: 110,
  },
  horizontalBody: {
    flex: 1,
    padding: Theme.spacing.md,
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  duration: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
});

export default PackageCard;
