/**
 * ReviewSubmitScreen — Phase 7
 *
 * Allows users to submit a review for a completed booking.
 * Accessible from BookingDetailScreen for completed trips.
 *
 * Features:
 * - Star rating selector (1–5)
 * - Text comment input
 * - Package info header
 * - Submit review action (dispatches to reviewSlice)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { submitReview } from '../../redux/reviewSlice';
import { addNotification } from '../../redux/notificationSlice';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { CustomButton } from '../../components';

const ReviewSubmitScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const C = useThemeColors();

  // Package and booking info passed from BookingDetailScreen
  const { bookingId, packageName, packageId, destination } =
    route.params || {};

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.');
      return;
    }
    if (comment.trim().length < 10) {
      Alert.alert('Comment Too Short', 'Please write at least 10 characters to help others.');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewPayload = {
        _id: Date.now().toString(),
        bookingId,
        packageId,
        packageName,
        rating,
        comment: comment.trim(),
        isApproved: false,  // pending admin approval
        createdAt: new Date().toISOString(),
      };

      dispatch(submitReview(reviewPayload));
      dispatch(
        addNotification({
          _id: Date.now().toString(),
          title: 'Review Submitted ⭐',
          message: `Your review for "${packageName}" has been submitted and is pending approval.`,
          type: 'review',
          isRead: false,
          createdAt: new Date().toISOString(),
        })
      );

      Alert.alert(
        'Thank You!',
        'Your review has been submitted and is pending approval.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      {/* ── Header ───────────────────────────────────── */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write a Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Package Info Card ─────────────────────── */}
        <View style={[styles.packageCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={styles.packageEmoji}>🏖️</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.packageName, { color: C.textPrimary }]}>
              {packageName || 'Package Name'}
            </Text>
            <Text style={[styles.packageDest, { color: C.textSecondary }]}>
              📍 {destination || 'Destination'}
            </Text>
            {bookingId && (
              <Text style={[styles.bookingRef, { color: C.textMuted }]}>
                Booking #{bookingId}
              </Text>
            )}
          </View>
        </View>

        {/* ── Rating Selector ───────────────────────── */}
        <View style={[styles.section, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>
            Overall Rating
          </Text>
          <Text style={[styles.sectionSubtitle, { color: C.textSecondary }]}>
            How was your overall experience?
          </Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starBtn}
                activeOpacity={0.7}
              >
                <Text style={[styles.starIcon, { opacity: star <= rating ? 1 : 0.3 }]}>
                  ⭐
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {rating > 0 && (
            <Text style={[styles.ratingLabel, { color: C.primary }]}>
              {ratingLabels[rating]}
            </Text>
          )}
        </View>

        {/* ── Comment Input ─────────────────────────── */}
        <View style={[styles.section, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>
            Your Review
          </Text>
          <Text style={[styles.sectionSubtitle, { color: C.textSecondary }]}>
            Share details about your experience to help other travelers
          </Text>

          <TextInput
            style={[
              styles.commentInput,
              {
                backgroundColor: C.inputBg,
                color: C.textPrimary,
                borderColor: C.border,
              },
            ]}
            placeholder="Tell us about the trip — hotels, food, activities, guide, etc."
            placeholderTextColor={C.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={[styles.charCount, { color: C.textMuted }]}>
            {comment.length}/500
          </Text>
        </View>

        {/* ── Tips Card ─────────────────────────────── */}
        <View style={[styles.tipsCard, { backgroundColor: C.primaryLight }]}>
          <Text style={[styles.tipsTitle, { color: C.primary }]}>
            💡 Review Tips
          </Text>
          {[
            'Be specific about what you liked or disliked',
            'Mention accommodations, food, and activities',
            'Share tips for future travelers',
            'Keep it respectful and honest',
          ].map((tip, i) => (
            <Text key={i} style={[styles.tipItem, { color: C.primaryDark }]}>
              • {tip}
            </Text>
          ))}
        </View>

        {/* ── Submit Button ─────────────────────────── */}
        <View style={styles.submitWrapper}>
          <CustomButton
            title={isSubmitting ? 'Submitting…' : 'Submit Review'}
            onPress={handleSubmit}
            disabled={isSubmitting || rating === 0}
            loading={isSubmitting}
          />
          <View style={{ height: 10 }} />
          <CustomButton
            title="Cancel"
            variant="outline"
            onPress={() => navigation.goBack()}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' },
  headerTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: '#FFFFFF',
  },

  scrollContent: {
    padding: Theme.spacing.md,
  },

  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  packageEmoji: { fontSize: 40 },
  packageName: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    marginBottom: 4,
  },
  packageDest: { fontSize: Theme.fontSize.sm, marginBottom: 2 },
  bookingRef: { fontSize: Theme.fontSize.xs },

  section: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.base,
    fontWeight: Theme.fontWeight.bold,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: Theme.fontSize.sm,
    marginBottom: Theme.spacing.md,
  },

  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Theme.spacing.sm,
  },
  starBtn: { padding: 4 },
  starIcon: { fontSize: 42 },
  ratingLabel: {
    textAlign: 'center',
    fontSize: Theme.fontSize.base,
    fontWeight: Theme.fontWeight.bold,
    marginTop: 4,
  },

  commentInput: {
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
    borderWidth: 1,
    minHeight: 130,
    lineHeight: 22,
  },
  charCount: {
    fontSize: Theme.fontSize.xs,
    textAlign: 'right',
    marginTop: 6,
  },

  tipsCard: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  tipsTitle: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.bold,
    marginBottom: Theme.spacing.sm,
  },
  tipItem: {
    fontSize: Theme.fontSize.sm,
    lineHeight: 22,
  },

  submitWrapper: {
    marginTop: Theme.spacing.sm,
  },
});

export default ReviewSubmitScreen;
