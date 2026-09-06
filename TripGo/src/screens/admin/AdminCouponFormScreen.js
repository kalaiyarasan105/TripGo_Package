/**
 * AdminCouponFormScreen
 * Add or Edit a coupon.
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  StatusBar, TouchableOpacity, Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addCoupon, updateCoupon } from '../../redux/adminSlice';
import { Colors, Theme } from '../../constants';
import { CustomButton } from '../../components';

const AdminCouponFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { mode, coupon: existing } = route.params || {};
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    code: existing?.code || '',
    discountType: existing?.discountType || 'percentage',
    discountValue: existing?.discountValue?.toString() || '',
    minimumAmount: existing?.minimumAmount?.toString() || '',
    maximumDiscount: existing?.maximumDiscount?.toString() || '',
    usageLimit: existing?.usageLimit?.toString() || '',
    expiryDate: existing?.expiryDate?.slice(0, 10) || '',
    status: existing?.status || 'active',
  });
  const [errors, setErrors] = useState({});

  const update = (key, val) => setForm({ ...form, [key]: val });

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'Coupon code is required';
    if (!form.discountValue || isNaN(form.discountValue)) e.discountValue = 'Valid discount value required';
    if (form.discountType === 'percentage' && (Number(form.discountValue) < 1 || Number(form.discountValue) > 100)) {
      e.discountValue = 'Percentage must be between 1-100';
    }
    if (!form.expiryDate) e.expiryDate = 'Expiry date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const data = {
      ...form,
      code: form.code.toUpperCase().trim(),
      discountValue: Number(form.discountValue),
      minimumAmount: Number(form.minimumAmount) || 0,
      maximumDiscount: Number(form.maximumDiscount) || 0,
      usageLimit: Number(form.usageLimit) || 0,
    };
    if (isEdit) {
      dispatch(updateCoupon({ ...existing, ...data }));
      Alert.alert('Success', 'Coupon updated!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } else {
      dispatch(addCoupon(data));
      Alert.alert('Success', 'Coupon added!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    }
  };

  const Field = ({ label, fieldKey, props = {} }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[fieldKey] && styles.inputError]}
        value={form[fieldKey]}
        onChangeText={(v) => { update(fieldKey, v); setErrors({ ...errors, [fieldKey]: '' }); }}
        placeholderTextColor={Colors.textMuted}
        {...props}
      />
      {errors[fieldKey] ? <Text style={styles.errorText}>{errors[fieldKey]}</Text> : null}
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primaryDark} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Coupon' : 'Add Coupon'}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Field label="Coupon Code *" fieldKey="code" props={{ placeholder: 'TRIP20', autoCapitalize: 'characters' }} />

          {/* Discount Type */}
          <Text style={styles.label}>Discount Type</Text>
          <View style={styles.chipRow}>
            {['percentage', 'fixed'].map((t) => (
              <TouchableOpacity key={t} style={[styles.chip, form.discountType === t && styles.chipActive]} onPress={() => update('discountType', t)}>
                <Text style={[styles.chipText, form.discountType === t && styles.chipTextActive]}>
                  {t === 'percentage' ? '% Percentage' : '₹ Fixed Amount'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Field
            label={`Discount Value * ${form.discountType === 'percentage' ? '(%)' : '(₹)'}`}
            fieldKey="discountValue"
            props={{ placeholder: form.discountType === 'percentage' ? '20' : '500', keyboardType: 'numeric' }}
          />
          <Field label="Minimum Booking Amount (₹)" fieldKey="minimumAmount" props={{ placeholder: '10000', keyboardType: 'numeric' }} />
          <Field label="Maximum Discount (₹)" fieldKey="maximumDiscount" props={{ placeholder: '5000', keyboardType: 'numeric' }} />
          <Field label="Usage Limit (0 = unlimited)" fieldKey="usageLimit" props={{ placeholder: '100', keyboardType: 'numeric' }} />
          <Field label="Expiry Date (YYYY-MM-DD) *" fieldKey="expiryDate" props={{ placeholder: '2026-12-31' }} />

          {/* Status */}
          <Text style={styles.label}>Status</Text>
          <View style={styles.chipRow}>
            {['active', 'inactive'].map((s) => (
              <TouchableOpacity key={s} style={[styles.chip, form.status === s && styles.chipActive]} onPress={() => update('status', s)}>
                <Text style={[styles.chipText, form.status === s && styles.chipTextActive]}>
                  {s === 'active' ? '✅ Active' : '⛔ Inactive'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomButton title={isEdit ? 'Update Coupon' : 'Add Coupon'} onPress={handleSubmit} style={{ marginTop: Theme.spacing.lg }} />
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
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
  scroll: { padding: Theme.spacing.md },
  card: { backgroundColor: Colors.surface, borderRadius: Theme.borderRadius.lg, padding: Theme.spacing.md, ...Theme.shadow.sm },
  field: { marginBottom: Theme.spacing.md },
  label: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.semiBold, color: Colors.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md, paddingVertical: 12,
    fontSize: Theme.fontSize.md, color: Colors.textPrimary,
    borderWidth: 1, borderColor: Colors.border,
  },
  inputError: { borderColor: Colors.error },
  errorText: { fontSize: Theme.fontSize.xs, color: Colors.error, marginTop: 4 },
  chipRow: { flexDirection: 'row', gap: 10, marginBottom: Theme.spacing.md },
  chip: {
    flex: 1, borderRadius: Theme.borderRadius.md, paddingVertical: 10,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.inputBg,
  },
  chipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  chipText: { fontSize: Theme.fontSize.sm, color: Colors.textMuted },
  chipTextActive: { color: Colors.primary, fontWeight: Theme.fontWeight.bold },
});

export default AdminCouponFormScreen;
