/**
 * AdminPackageFormScreen
 * Add or Edit a package.
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  StatusBar, TouchableOpacity, Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addPackage, updatePackage } from '../../redux/adminSlice';
import { Colors, Theme } from '../../constants';
import { CustomButton } from '../../components';

const AdminPackageFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { mode, package: existingPkg } = route.params || {};
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    name: existingPkg?.name || '',
    destination: existingPkg?.destination || '',
    description: existingPkg?.description || '',
    price: existingPkg?.price?.toString() || '',
    duration: existingPkg?.duration?.toString() || '',
    maxTravelers: existingPkg?.maxTravelers?.toString() || '20',
    status: existingPkg?.status || 'active',
  });
  const [errors, setErrors] = useState({});

  const update = (key, val) => setForm({ ...form, [key]: val });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Package name is required';
    if (!form.destination.trim()) e.destination = 'Destination is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required';
    if (!form.duration || isNaN(form.duration) || Number(form.duration) <= 0) e.duration = 'Valid duration required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const data = {
      ...form,
      price: Number(form.price),
      duration: Number(form.duration),
      maxTravelers: Number(form.maxTravelers) || 20,
      rating: existingPkg?.rating || 0,
      reviewCount: existingPkg?.reviewCount || 0,
      images: existingPkg?.images || [],
      includedServices: existingPkg?.includedServices || [],
      excludedServices: existingPkg?.excludedServices || [],
      itinerary: existingPkg?.itinerary || [],
      availableDates: existingPkg?.availableDates || [],
    };

    if (isEdit) {
      dispatch(updatePackage({ ...existingPkg, ...data }));
      Alert.alert('Success', 'Package updated successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } else {
      dispatch(addPackage(data));
      Alert.alert('Success', 'Package added successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
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
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Package' : 'Add Package'}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Field label="Package Name *" fieldKey="name" props={{ placeholder: 'e.g. Goa Beach Paradise' }} />
          <Field label="Destination *" fieldKey="destination" props={{ placeholder: 'e.g. Goa, India' }} />
          <Field label="Description" fieldKey="description" props={{ placeholder: 'Package description...', multiline: true, numberOfLines: 3, style: [styles.input, styles.textarea] }} />
          <Field label="Price per Person (₹) *" fieldKey="price" props={{ placeholder: '18500', keyboardType: 'numeric' }} />
          <Field label="Duration (Days) *" fieldKey="duration" props={{ placeholder: '5', keyboardType: 'numeric' }} />
          <Field label="Max Travelers" fieldKey="maxTravelers" props={{ placeholder: '20', keyboardType: 'numeric' }} />

          {/* Status Toggle */}
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusRow}>
            {['active', 'inactive'].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.statusChip, form.status === s && styles.statusChipActive]}
                onPress={() => update('status', s)}
              >
                <Text style={[styles.statusChipText, form.status === s && styles.statusChipTextActive]}>
                  {s === 'active' ? '✅ Active' : '⛔ Inactive'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomButton
            title={isEdit ? 'Update Package' : 'Add Package'}
            onPress={handleSubmit}
            style={{ marginTop: Theme.spacing.lg }}
          />
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
  textarea: { height: 80, textAlignVertical: 'top' },
  errorText: { fontSize: Theme.fontSize.xs, color: Colors.error, marginTop: 4 },
  statusRow: { flexDirection: 'row', gap: 10, marginBottom: Theme.spacing.md },
  statusChip: {
    flex: 1, borderRadius: Theme.borderRadius.md, paddingVertical: 10,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.inputBg,
  },
  statusChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  statusChipText: { fontSize: Theme.fontSize.sm, color: Colors.textMuted },
  statusChipTextActive: { color: Colors.primary, fontWeight: Theme.fontWeight.bold },
});

export default AdminPackageFormScreen;
