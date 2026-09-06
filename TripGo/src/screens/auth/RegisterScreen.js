/**
 * RegisterScreen
 * New user registration form.
 * Phase 9: dispatches loginSuccess so the session is stored in Redux.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/authSlice';
import { Colors, Theme } from '../../constants';
import { CustomButton } from '../../components';
import { validateEmail, validatePhone, validatePassword, validateName } from '../../utils/validators';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: '' });
  };

  const validate = () => {
    const e = {};
    const nameErr = validateName(form.name);
    if (nameErr) e.name = nameErr;
    const emailErr = validateEmail(form.email);
    if (emailErr) e.email = emailErr;
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) e.phone = phoneErr;
    const pwdErr = validatePassword(form.password);
    if (pwdErr) e.password = pwdErr;
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;
    setLoading(true);
    // Simulated registration — Phase 9 replaces with real API call
    setTimeout(() => {
      setLoading(false);
      const newUser = {
        _id: `u_${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        role: 'user',
      };
      dispatch(loginSuccess({ user: newUser, token: `mock-token-${Date.now()}` }));
      navigation.replace('UserRoot');
    }, 1200);
  };

  // Helper to render each input field cleanly
  const renderField = (label, key, props = {}) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[key] && styles.inputError]}
        value={form[key]}
        onChangeText={(v) => updateField(key, v)}
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
        {...props}
      />
      {errors[key] ? <Text style={styles.errorText}>{errors[key]}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🧳</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join TripGo and start exploring</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {renderField('Full Name', 'name', {
            placeholder: 'Rahul Sharma',
            autoCapitalize: 'words',
          })}

          {renderField('Email Address', 'email', {
            placeholder: 'you@example.com',
            keyboardType: 'email-address',
          })}

          {renderField('Phone Number', 'phone', {
            placeholder: '9876543210',
            keyboardType: 'phone-pad',
          })}

          {/* Password with show/hide */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.passwordInput, errors.password && styles.inputError]}
                value={form.password}
                onChangeText={(v) => updateField('password', v)}
                placeholder="Min. 6 characters"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          {renderField('Confirm Password', 'confirmPassword', {
            placeholder: 'Re-enter password',
            secureTextEntry: !showPassword,
          })}

          <CustomButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: Theme.spacing.md }}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Theme.spacing.md, paddingBottom: Theme.spacing.xxl },

  header: { alignItems: 'center', paddingVertical: Theme.spacing.xl },
  emoji: { fontSize: 48, marginBottom: 8 },
  title: {
    fontSize: Theme.fontSize.title,
    fontWeight: Theme.fontWeight.extraBold,
    color: Colors.primary,
  },
  subtitle: { fontSize: Theme.fontSize.md, color: Colors.textSecondary, marginTop: 4 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    ...Theme.shadow.lg,
  },

  fieldGroup: { marginBottom: Theme.spacing.md },
  label: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semiBold,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 12,
    fontSize: Theme.fontSize.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: { borderColor: Colors.error },
  errorText: { fontSize: Theme.fontSize.xs, color: Colors.error, marginTop: 4 },

  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 12,
    fontSize: Theme.fontSize.md,
    color: Colors.textPrimary,
  },
  eyeBtn: { padding: 12 },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.lg,
  },
  loginPrompt: { fontSize: Theme.fontSize.md, color: Colors.textSecondary },
  loginLink: {
    fontSize: Theme.fontSize.md,
    color: Colors.primary,
    fontWeight: Theme.fontWeight.bold,
  },
});

export default RegisterScreen;
