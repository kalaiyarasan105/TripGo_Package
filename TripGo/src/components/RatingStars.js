/**
 * RatingStars Component
 *
 * Displays a row of star icons for a given rating value.
 * Supports read-only display and interactive (tappable) mode.
 *
 * Usage (read-only):
 *   <RatingStars rating={4.5} />
 *
 * Usage (interactive):
 *   <RatingStars rating={selectedRating} interactive onRate={(r) => setRating(r)} />
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Theme } from '../constants';

const RatingStars = ({
  rating = 0,
  maxStars = 5,
  size = 'md',       // 'sm' | 'md' | 'lg'
  interactive = false,
  onRate,
  showLabel = false, // show numeric value beside stars
  color = Colors.star,
}) => {
  const sizes = {
    sm: { star: 14, label: Theme.fontSize.xs },
    md: { star: 20, label: Theme.fontSize.sm },
    lg: { star: 30, label: Theme.fontSize.md },
  };
  const fontSize = sizes[size]?.star ?? 20;
  const labelSize = sizes[size]?.label ?? Theme.fontSize.sm;

  const renderStar = (index) => {
    const filled = index < Math.floor(rating);
    const half = !filled && index < rating;

    const icon = filled ? '★' : half ? '⯨' : '☆';
    const starColor = filled || half ? color : Colors.border;

    if (interactive) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => onRate && onRate(index + 1)}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          <Text style={[styles.star, { fontSize, color: index < rating ? color : Colors.border }]}>
            ★
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <Text key={index} style={[styles.star, { fontSize, color: starColor }]}>
        {icon}
      </Text>
    );
  };

  return (
    <View style={styles.row}>
      {Array.from({ length: maxStars }, (_, i) => renderStar(i))}
      {showLabel && (
        <Text style={[styles.label, { fontSize: labelSize, color: Colors.textSecondary }]}>
          {' '}{Number(rating).toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 1,
  },
  label: {
    marginLeft: 4,
    fontWeight: Theme.fontWeight.medium,
  },
});

export default RatingStars;
