/**
 * DestinationCard Component
 *
 * Displays a destination in a compact square card with
 * an image background and overlay text.
 * Used in the horizontal "Popular Destinations" scroll on Home screen.
 *
 * Usage:
 *   <DestinationCard
 *     destination={item}
 *     onPress={() => navigation.navigate('Packages', { destination: item.name })}
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

const DestinationCard = ({ destination, onPress }) => {
  if (!destination) return null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Background Image */}
      <Image
        source={
          destination.image
            ? { uri: destination.image }
            : { uri: 'https://via.placeholder.com/300x200?text=Destination' }
        }
        style={styles.image}
        resizeMode="cover"
      />

      {/* Dark gradient overlay — gives text contrast over the image */}
      <View style={styles.overlay} />

      {/* Text content sits on top of the overlay */}
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {destination.name}
        </Text>
        <Text style={styles.country} numberOfLines={1}>
          {destination.country}
        </Text>
        {destination.packageCount !== undefined && (
          <Text style={styles.packageCount}>
            {destination.packageCount} Packages
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 130,
    height: 160,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    marginRight: Theme.spacing.md,
    ...Theme.shadow.md,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  // Semi-transparent black overlay to make text readable
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Theme.spacing.sm,
  },
  name: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.white,
  },
  country: {
    fontSize: Theme.fontSize.xs,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  packageCount: {
    fontSize: Theme.fontSize.xs,
    color: Colors.primaryLight,
    marginTop: 2,
  },
});

export default DestinationCard;
