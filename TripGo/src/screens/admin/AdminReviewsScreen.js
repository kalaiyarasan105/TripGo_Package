/**
 * AdminReviewsScreen
 * View, approve, and delete user reviews.
 */

import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, StatusBar,
  TouchableOpacity, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { approveReview, deleteReview } from '../../redux/adminSlice';
import { Colors, Theme } from '../../constants';
import { EmptyState } from '../../components';
import { formatDate } from '../../utils/helpers';

const TABS = ['All', 'Pending', 'Approved'];

const AdminReviewsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((s) => s.admin.reviews);
  const [activeTab, setActiveTab] = useState('All');

  const filtered = reviews.filter((r) => {
    if (activeTab === 'Pending') return !r.isApproved;
    if (activeTab === 'Approved') return r.isApproved;
    return true;
  });

  const handleApprove = (review) => {
    dispatch(approveReview(review._id));
  };

  const handleDelete = (review) => {
    Alert.alert('Delete Review', `Delete review by "${review.user?.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteReview(review._id)) },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.user?.name?.charAt(0) || '?'}</Text>
          </View>
          <View>
            <Text style={styles.reviewerName}>{item.user?.name}</Text>
            <Text style={styles.packageName}>{item.package?.name}</Text>
          </View>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.isApproved ? Colors.successLight : Colors.warningLight }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.isApproved ? Colors.success : Colors.warning }
          ]}>
            {item.isApproved ? '✓ Approved' : '⏳ Pending'}
          </Text>
        </View>
      </View>

      {/* Star rating */}
      <Text style={styles.stars}>{'⭐'.repeat(item.rating)}</Text>

      {/* Comment */}
      <Text style={styles.comment}>{item.comment}</Text>
      <Text style={styles.date}>{formatDate(item.createdAt)}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        {!item.isApproved && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.successLight }]}
            onPress={() => handleApprove(item)}
          >
            <Text style={[styles.actionBtnText, { color: Colors.success }]}>✓ Approve</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: Colors.errorLight }]}
          onPress={() => handleDelete(item)}
        >
          <Text style={[styles.actionBtnText, { color: Colors.error }]}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primaryDark} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews ({reviews.length})</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState emoji="⭐" title={`No ${activeTab} Reviews`} message="No reviews in this category." />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primaryDark, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Theme.spacing.md, paddingVertical: Theme.spacing.md, paddingTop: Theme.spacing.lg,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 22, color: Colors.white, fontWeight: 'bold' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.white },
  tabBar: { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: Theme.fontSize.sm, color: Colors.textMuted },
  tabTextActive: { color: Colors.primary, fontWeight: Theme.fontWeight.bold },
  list: { padding: Theme.spacing.md, paddingBottom: 24 },
  card: { backgroundColor: Colors.surface, borderRadius: Theme.borderRadius.lg, padding: Theme.spacing.md, marginBottom: Theme.spacing.md, ...Theme.shadow.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: Colors.white, fontWeight: Theme.fontWeight.bold },
  reviewerName: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.semiBold, color: Colors.textPrimary },
  packageName: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  statusBadge: { borderRadius: Theme.borderRadius.full, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.semiBold },
  stars: { fontSize: 14, marginBottom: 4 },
  comment: { fontSize: Theme.fontSize.md, color: Colors.textSecondary, lineHeight: 20, marginBottom: 4 },
  date: { fontSize: Theme.fontSize.xs, color: Colors.textMuted, marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, borderRadius: Theme.borderRadius.sm, paddingVertical: 7, alignItems: 'center' },
  actionBtnText: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.semiBold },
});

export default AdminReviewsScreen;
