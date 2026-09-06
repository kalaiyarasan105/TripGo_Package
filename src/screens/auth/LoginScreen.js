/**
 * LoginScreen — Professional, no emojis
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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (!password.trim()) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@tripgo.com' && password === 'admin123') {
        dispatch(loginSuccess({
          user: { _id: 'admin1', name: 'Admin User', email, role: 'admin' },
          token: 'mock-admin-token',
        }));
        navigation.replace('AdminRoot');
        return;
      }
      dispatch(loginSuccess({
        user: {
          _id: 'user1',
          name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'User',
          email,
          phone: '',
          role: 'user',
        },
        token: 'mock-user-token',
      }));
      navigation.replace('UserRoot');
    }, 1200);
  };

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
        {/* ── Brand header ──────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Text style={styles.logoLetter}>T</Text>
          </View>
          <Text style={styles.appName}>TripGo</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {/* ── Form card ─────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>

          {/* Email */}
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors({ ...errors, email: '' }); }}
            placeholder="you@example.com"
            placeholderTextColor={Colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          {/* Password */}
          <Text style={[styles.label, { marginTop: Theme.spacing.md }]}>Password</Text>
          <View style={[styles.passwordWrapper, errors.password && styles.inputError]}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors({ ...errors, password: '' }); }}
              placeholder="Enter your password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={[styles.eyeText, { color: Colors.textMuted }]}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          {/* Forgot */}
          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Test credentials (dev only) ───────────── */}
        <View style={styles.hintBox}>
          <Text style={styles.hintTitle}>Test Credentials</Text>
          <Text style={styles.hintText}>Admin: admin@tripgo.com / admin123</Text>
          <Text style={styles.hintText}>User: any email / any password (6+ chars)</Text>
        </View>

        {/* ── Admin portal link ─────────────────────── */}
        <TouchableOpacity
          style={styles.adminLink}
          onPress={() => navigation.navigate('AdminLogin')}
        >
          <Text style={styles.adminLinkText}>Admin Portal</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Theme.spacing.md, paddingBottom: Theme.spacing.xxl },

  header: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  logoMark: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoLetter: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    ...Theme.shadow.lg,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Theme.spacing.lg,
    letterSpacing: -0.3,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: { borderColor: Colors.error },
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
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  eyeBtn: { paddingHorizontal: 14, paddingVertical: 13 },
  eyeText: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },

  forgotBtn: { alignSelf: 'flex-end', marginTop: 10, marginBottom: Theme.spacing.lg },
  forgotText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },

  loginBtn: { marginTop: Theme.spacing.sm },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Theme.spacing.lg,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: {
    marginHorizontal: 12,
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerPrompt: { fontSize: 14, color: Colors.textSecondary },
  registerLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
  },

  hintBox: {
    marginTop: Theme.spacing.lg,
    backgroundColor: Colors.warningLight,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  hintTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },

  adminLink: {
    alignItems: 'center',
    marginTop: Theme.spacing.lg,
    paddingVertical: 10,
  },
  adminLinkText: {
    fontSize: 13,
    color: Colors.primaryDark,
    fontWeight: '600',
    letterSpacing: 0.3,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
