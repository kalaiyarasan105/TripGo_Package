/**
 * AdminLoginScreen
 * Completely separate admin login.
 * Normal users cannot access this screen.
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, StatusBar,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/authSlice';
import { Colors, Theme } from '../../constants';
import { CustomButton } from '../../components';

const AdminLoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    if (!password.trim()) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Only admin credentials work here
      if (email === 'admin@tripgo.com' && password === 'admin123') {
        dispatch(loginSuccess({
          user: { _id: 'admin1', name: 'Admin User', email, role: 'admin' },
          token: 'mock-admin-token',
        }));
        navigation.replace('AdminRoot');
      } else {
        Alert.alert(
          'Access Denied',
          'Invalid admin credentials. This portal is for administrators only.',
          [{ text: 'OK' }]
        );
      }
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar backgroundColor={Colors.primaryDark} barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.shieldCircle}>
            <Text style={styles.shieldEmoji}>🛡️</Text>
          </View>
          <Text style={styles.title}>Admin Portal</Text>
          <Text style={styles.subtitle}>TripGo Administration</Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Admin Sign In</Text>

          <Text style={styles.label}>Admin Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={(v) => { setEmail(v); setErrors({ ...errors, email: '' }); }}
            placeholder="admin@tripgo.com"
            placeholderTextColor={Colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <Text style={[styles.label, { marginTop: Theme.spacing.md }]}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.passwordInput, errors.password && styles.inputError]}
              value={password}
              onChangeText={(v) => { setPassword(v); setErrors({ ...errors, password: '' }); }}
              placeholder="Admin password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
              <Text>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <CustomButton
            title="Sign In as Admin"
            onPress={handleLogin}
            loading={loading}
            style={[styles.loginBtn, { backgroundColor: Colors.primaryDark }]}
          />
        </View>

        {/* Hint */}
        <View style={styles.hintBox}>
          <Text style={styles.hintTitle}>🔑 Admin Credentials</Text>
          <Text style={styles.hintText}>Email: admin@tripgo.com</Text>
          <Text style={styles.hintText}>Password: admin123</Text>
        </View>

        {/* Back to user app */}
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backLinkText}>← Back to User Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Theme.spacing.md, paddingBottom: Theme.spacing.xxl },

  header: { alignItems: 'center', paddingVertical: Theme.spacing.xl },
  shieldCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  shieldEmoji: { fontSize: 44 },
  title: {
    fontSize: Theme.fontSize.title,
    fontWeight: Theme.fontWeight.extraBold,
    color: Colors.primaryDark,
  },
  subtitle: { fontSize: Theme.fontSize.md, color: Colors.textSecondary, marginTop: 4 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    ...Theme.shadow.lg,
  },
  cardTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Theme.spacing.lg,
  },
  label: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.semiBold, color: Colors.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 12,
    fontSize: Theme.fontSize.md,
    color: Colors.textPrimary,
    borderWidth: 1, borderColor: Colors.border,
  },
  inputError: { borderColor: Colors.error },
  passwordRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  passwordInput: {
    flex: 1, paddingHorizontal: Theme.spacing.md,
    paddingVertical: 12, fontSize: Theme.fontSize.md, color: Colors.textPrimary,
  },
  eyeBtn: { padding: 12 },
  errorText: { fontSize: Theme.fontSize.xs, color: Colors.error, marginTop: 4 },
  loginBtn: { marginTop: Theme.spacing.lg },

  hintBox: {
    marginTop: Theme.spacing.lg,
    backgroundColor: Colors.primaryLight,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderLeftWidth: 4, borderLeftColor: Colors.primaryDark,
  },
  hintTitle: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.bold, color: Colors.primaryDark, marginBottom: 4 },
  hintText: { fontSize: Theme.fontSize.xs, color: Colors.textSecondary, marginBottom: 2 },

  backLink: { alignItems: 'center', marginTop: Theme.spacing.lg },
  backLinkText: { fontSize: Theme.fontSize.md, color: Colors.primary, fontWeight: Theme.fontWeight.medium },
});

export default AdminLoginScreen;
