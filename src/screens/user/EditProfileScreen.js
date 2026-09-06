/**
 * EditProfileScreen — Phase 11
 *
 * Dedicated full-screen profile editor.
 * Replaces the bottom-sheet modal in ProfileScreen.
 *
 * Features:
 * - Avatar display with initials
 * - Editable: name, email, phone
 * - Field-level validation via validators.js
 * - Dispatches updateProfile to Redux on save
 * - Dark-mode aware
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../redux/authSlice';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { CustomButton } from '../../components';
import { validateName, validateEmail, validatePhone } from '../../utils/validators';

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const C = useThemeColors();
  const user = useSelector((s) => s.auth.user);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const initials = form.name
    .trim()
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    const nameErr = validateName(form.name);
    if (nameErr) e.name = nameErr;
    const emailErr = validateEmail(form.email);
    if (emailErr) e.email = emailErr;
    // Phone is optional, but validate format if provided
    if (form.phone.trim()) {
      const phoneErr = validatePhone(form.phone);
      if (phoneErr) e.phone = phoneErr;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    // Simulate API delay — Phase 9: await authApi.updateProfile(form)
    await new Promise((r) => setTimeout(r, 800));
    dispatch(
      updateProfile({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
      })
    );
    setIsSaving(false);
    Alert.alert('Saved', 'Your profile has been updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        {/* Avatar */}
        <View style={[styles.avatarSection, { backgroundColor: C.primary }]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Text style={styles.avatarHint}>Avatar uses your initials</Text>
        </View>

        {/* Form */}
        <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>

          {/* Full Name */}
          <Field
            label="Full Name"
            value={form.name}
            onChangeText={(v) => update('name', v)}
            placeholder="Your full name"
            error={errors.name}
            autoCapitalize="words"
            C={C}
          />

          {/* Email */}
          <Field
            label="Email Address"
            value={form.email}
            onChangeText={(v) => update('email', v)}
            placeholder="you@example.com"
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            C={C}
          />

          {/* Phone */}
          <Field
            label="Phone Number"
            value={form.phone}
            onChangeText={(v) => update('phone', v)}
            placeholder="10-digit mobile number"
            error={errors.phone}
            keyboardType="phone-pad"
            C={C}
            isLast
          />
        </View>

        {/* Info note */}
        <View style={[styles.noteCard, { backgroundColor: C.primaryLight }]}>
          <Text style={[styles.noteText, { color: C.primaryDark }]}>
            ℹ️ Your email is used for booking confirmations and account recovery. Keep it up to date.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.btnGroup}>
          <CustomButton
            title={isSaving ? 'Saving…' : 'Save Changes'}
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
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

// ── Reusable form field ──────────────────────────────────────────
const Field = ({ label, value, onChangeText, placeholder, error, isLast, C, ...rest }) => (
  <View style={[styles.fieldGroup, !isLast && { borderBottomWidth: 1, borderBottomColor: C.border }]}>
    <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{label}</Text>
    <TextInput
      style={[
        styles.fieldInput,
        { color: C.textPrimary, backgroundColor: C.inputBg, borderColor: error ? '#EA4335' : C.border },
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={C.textMuted}
      autoCorrect={false}
      {...rest}
    />
    {error ? <Text style={styles.fieldError}>{error}</Text> : null}
  </View>
);

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
  backIcon: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  headerTitle: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: '#fff' },

  scroll: { padding: Theme.spacing.md },

  avatarSection: {
    alignItems: 'center',
    borderRadius: Theme.borderRadius.xl,
    paddingVertical: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: Theme.spacing.sm,
  },
  avatarInitials: {
    fontSize: Theme.fontSize.title,
    fontWeight: Theme.fontWeight.extraBold,
    color: '#fff',
  },
  avatarHint: {
    fontSize: Theme.fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
  },

  card: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    ...Theme.shadow.sm,
  },
  fieldGroup: {
    padding: Theme.spacing.md,
  },
  fieldLabel: {
    fontSize: Theme.fontSize.xs,
    fontWeight: Theme.fontWeight.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  fieldInput: {
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 12,
    fontSize: Theme.fontSize.md,
    borderWidth: 1,
  },
  fieldError: {
    fontSize: Theme.fontSize.xs,
    color: '#EA4335',
    marginTop: 4,
  },

  noteCard: {
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  noteText: { fontSize: Theme.fontSize.sm, lineHeight: 20 },

  btnGroup: { marginTop: Theme.spacing.sm },
});

export default EditProfileScreen;
