/**
 * ChangePasswordScreen — Phase 7
 *
 * Allows authenticated users to change their password.
 * In Phase 9 this calls the API; for now it validates locally.
 *
 * Features:
 * - Current password field
 * - New password field
 * - Confirm new password field
 * - Password strength indicator
 * - Show/hide password toggles
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
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { CustomButton } from '../../components';
import { validatePassword } from '../../utils/validators';

const ChangePasswordScreen = ({ navigation }) => {
  const C = useThemeColors();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: C.textMuted };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: '#EA4335' };
    if (score === 2) return { level: 2, label: 'Fair', color: '#FBBC04' };
    if (score === 3) return { level: 3, label: 'Good', color: '#34A853' };
    return { level: 4, label: 'Strong', color: '#1A73E8' };
  };

  const strength = getStrength(newPassword);

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password.');
      return;
    }

    const pwdError = validatePassword(newPassword);
    if (pwdError) {
      Alert.alert('Invalid Password', pwdError);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New password and confirm password do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Same Password', 'New password must be different from the current one.');
      return;
    }

    setIsLoading(true);
    // Simulate API call — in Phase 9 this calls authApi.changePassword()
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);

    Alert.alert(
      'Password Changed',
      'Your password has been updated successfully.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
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
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Info Banner ───────────────────────────── */}
        <View style={[styles.infoBanner, { backgroundColor: C.primaryLight }]}>
          <Text style={styles.infoEmoji}>🔐</Text>
          <Text style={[styles.infoText, { color: C.primaryDark }]}>
            Choose a strong password that you haven't used before.
          </Text>
        </View>

        {/* ── Form Card ─────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>

          {/* Current Password */}
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            visible={showCurrent}
            onToggle={() => setShowCurrent(!showCurrent)}
            placeholder="Enter current password"
            C={C}
          />

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: C.border }]} />

          {/* New Password */}
          <PasswordField
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            visible={showNew}
            onToggle={() => setShowNew(!showNew)}
            placeholder="Enter new password"
            C={C}
          />

          {/* Strength indicator */}
          {newPassword.length > 0 && (
            <View style={styles.strengthWrapper}>
              <View style={styles.strengthBars}>
                {[1, 2, 3, 4].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.strengthBar,
                      {
                        backgroundColor:
                          level <= strength.level ? strength.color : C.border,
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.strengthLabel, { color: strength.color }]}>
                {strength.label}
              </Text>
            </View>
          )}

          {/* Confirm Password */}
          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            visible={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
            placeholder="Re-enter new password"
            C={C}
          />

          {confirmPassword.length > 0 && newPassword !== confirmPassword && (
            <Text style={styles.matchError}>⚠️ Passwords do not match</Text>
          )}
        </View>

        {/* ── Requirements Card ─────────────────────── */}
        <View style={[styles.requirementsCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[styles.requireTitle, { color: C.textPrimary }]}>
            Password Requirements
          </Text>
          {[
            { rule: 'At least 8 characters', met: newPassword.length >= 8 },
            { rule: 'One uppercase letter (A–Z)', met: /[A-Z]/.test(newPassword) },
            { rule: 'One number (0–9)', met: /[0-9]/.test(newPassword) },
            { rule: 'One special character (!@#$…)', met: /[^A-Za-z0-9]/.test(newPassword) },
          ].map((req, i) => (
            <View key={i} style={styles.requireRow}>
              <Text style={{ color: req.met ? '#34A853' : C.textMuted, fontSize: 14 }}>
                {req.met ? '✅' : '○'}
              </Text>
              <Text style={[styles.requireText, { color: req.met ? '#34A853' : C.textSecondary }]}>
                {req.rule}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Submit ─────────────────────────────────── */}
        <View style={styles.submitWrapper}>
          <CustomButton
            title={isLoading ? 'Updating…' : 'Change Password'}
            onPress={handleChangePassword}
            loading={isLoading}
            disabled={isLoading}
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

// ── Reusable password field ──────────────────────────────────────
const PasswordField = ({ label, value, onChangeText, visible, onToggle, placeholder, C }) => (
  <View style={styles.fieldWrapper}>
    <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{label}</Text>
    <View style={[styles.fieldRow, { backgroundColor: C.inputBg, borderColor: C.border }]}>
      <TextInput
        style={[styles.fieldInput, { color: C.textPrimary }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textMuted}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
        <Text style={styles.eyeIcon}>{visible ? '🙈' : '👁️'}</Text>
      </TouchableOpacity>
    </View>
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
  backIcon: { fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' },
  headerTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: '#FFFFFF',
  },

  scrollContent: { padding: Theme.spacing.md },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  infoEmoji: { fontSize: 28 },
  infoText: { flex: 1, fontSize: Theme.fontSize.sm, lineHeight: 20 },

  card: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },

  fieldWrapper: { marginBottom: Theme.spacing.md },
  fieldLabel: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semiBold,
    marginBottom: 6,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Theme.spacing.md,
  },
  fieldInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: Theme.fontSize.md,
  },
  eyeBtn: { padding: 8 },
  eyeIcon: { fontSize: 18 },

  divider: { height: 1, marginVertical: Theme.spacing.sm },

  strengthWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: -Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  strengthBars: { flexDirection: 'row', gap: 4, flex: 1 },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: Theme.fontSize.xs,
    fontWeight: Theme.fontWeight.bold,
    width: 50,
    textAlign: 'right',
  },

  matchError: {
    color: '#EA4335',
    fontSize: Theme.fontSize.xs,
    marginTop: -Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },

  requirementsCard: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  requireTitle: {
    fontSize: Theme.fontSize.base,
    fontWeight: Theme.fontWeight.bold,
    marginBottom: Theme.spacing.sm,
  },
  requireRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  requireText: { fontSize: Theme.fontSize.sm },

  submitWrapper: { marginTop: Theme.spacing.sm },
});

export default ChangePasswordScreen;
