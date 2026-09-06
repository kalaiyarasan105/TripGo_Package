/**
 * AdminCouponsScreen
 * Lists all coupons with enable/disable/delete/edit.
 */

import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, StatusBar,
  TouchableOpacity, Alert, Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCoupon, toggleCouponStatus } from '../../redux/adminSlice';
import { Colors, Theme } from '../../constants';
import { EmptyState } from '../../components';
import { formatDate, formatPrice } from '../../utils/helpers';

const AdminCouponsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const coupons = useSelector((s) => s.admin.coupons);

  const handleDelete = (coupon) => {
    Alert.alert('Delete Coupon', `Delete coupon "${coupon.code}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteCoupon(coupon._id)) },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{item.code}</Text>
        </View>
        <Switch
          value={item.status === 'active'}
          onValueChange={() => dispatch(toggleCouponStatus(item._id))}
          trackColor={{ false: Colors.border, true: Colors.success }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.cardMeta}>
        <Text style={styles.discountText}>
          {item.discountType === 'percentage' ? `${item.discountValue}% OFF` : `₹${item.discountValue} OFF`}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? Colors.successLight : Colors.errorLight }]}>
          <Text style={[styles.statusText, { color: item.status === 'active' ? Colors.success : Colors.error }]}>
            {item.status === 'active' ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Min: {formatPrice(item.minimumAmount)}</Text>
        <Text style={styles.metaText}>Used: {item.usedCount || 0}</Text>
        <Text style={styles.metaText}>Expires: {formatDate(item.expiryDate)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: Colors.primaryLight }]}
          onPress={() => navigation.navigate('AdminCouponForm', { mode: 'edit', coupon: item })}
        >
          <Text style={[styles.actionBtnText, { color: Colors.primary }]}>✏️ Edit</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Coupons ({coupons.length})</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AdminCouponForm', { mode: 'add' })}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={coupons}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState emoji="🏷️" title="No Coupons" message="Add your first coupon." actionText="Add Coupon" onAction={() => navigation.navigate('AdminCouponForm', { mode: 'add' })} />}
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
  addBtn: { backgroundColor: Colors.secondary, borderRadius: Theme.borderRadius.md, paddingHorizontal: 12, paddingVertical: 6 },
  addBtnText: { color: Colors.white, fontWeight: Theme.fontWeight.bold, fontSize: Theme.fontSize.sm },
  list: { padding: Theme.spacing.md, paddingBottom: 24 },
  card: { backgroundColor: Colors.surface, borderRadius: Theme.borderRadius.lg, padding: Theme.spacing.md, marginBottom: Theme.spacing.md, ...Theme.shadow.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  codeBox: { backgroundColor: Colors.primaryLight, borderRadius: Theme.borderRadius.sm, paddingHorizontal: 10, paddingVertical: 4 },
  codeText: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.primary, letterSpacing: 1.5 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  discountText: { fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.extraBold, color: Colors.secondary },
  statusBadge: { borderRadius: Theme.borderRadius.full, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.semiBold },
  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 10, flexWrap: 'wrap' },
  metaText: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, borderRadius: Theme.borderRadius.sm, paddingVertical: 7, alignItems: 'center' },
  actionBtnText: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.semiBold },
});

export default AdminCouponsScreen;
