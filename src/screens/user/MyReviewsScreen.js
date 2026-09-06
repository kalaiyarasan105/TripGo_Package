/**
 * MyReviewsScreen — Phase 11
 *
 * Shows all reviews the user has submitted.
 * - Pending (awaiting admin approval)
 * - Approved (visible on package pages)
 * - Option to delete a review
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview } from '../../redux/reviewSlice';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { EmptyState } from '../../components';
import { formatDate } from '../../utils/helpers';

const MyReviewsScreen = ({ navigation }) => {
  const C = useThemeColors();
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.myReviews);

  const handleDelete = (review) => {
    Alert.alert(
      'Delete Review',
      `Delete your review for "${review.packageName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteReview(review._id)),
        },
      ]
    );
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Text key={i} style={{ fontSize: 16, opacity: i < rating ? 1 : 0.25 }}>
        ⭐
      </Text>
    ));

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
      {/* Status badge */}
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: item.isApproved ? C.successLight : C.warningLight,
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            { color: item.isApproved ? C.success : C.warning },
          ]}
        >
          {item.isApproved ? '✅ Approved' : '⏳ Pending Approval'}
        </Text>
      </View>

      {/* Package name */}
      <Text style={[styles.packageName, { color: C.textPrimary }]}>
        {item.packageName}
      </Text>

      {/* Stars */}
      <View style={styles.starsRow}>{renderStars(item.rating)}</View>

      {/* Comment */}
      <Text style={[styles.comment, { color: C.textSecondary }]}>{item.comment}</Text>

      {/* Footer: date + delete */}
      <View style={styles.footer}>
        <Text style={[styles.date, { color: C.textMuted }]}>
          Submitted {formatDate(item.createdAt)}
        </Text>
        <TouchableOpacity
          style={[styles.deleteBtn, { borderColor: C.error }]}
          onPress={() => handleDelete(item)}
        >
          <Text style={[styles.deleteBtnText, { color: C.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reviews</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            emoji="⭐"
            title="No Reviews Yet"
            message="Complete a trip and share your experience. Your reviews help fellow travelers!"
            actionText="View My Bookings"
            onAction={() => navigation.navigate('BookingsTab')}
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

  list: { padding: Theme.spacing.md, paddingBottom: 40 },

  card: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: Theme.spacing.sm,
  },
  statusText: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.bold },
  packageName: { fontSize: Theme.fontSize.base, fontWeight: Theme.fontWeight.bold, marginBottom: 6 },
  starsRow: { flexDirection: 'row', marginBottom: Theme.spacing.sm },
  comment: { fontSize: Theme.fontSize.md, lineHeight: 22, marginBottom: Theme.spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: Theme.fontSize.xs },
  deleteBtn: {
    borderWidth: 1,
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  deleteBtnText: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.semiBold },
});

export default MyReviewsScreen;
