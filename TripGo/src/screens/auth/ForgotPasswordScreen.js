/**
 * ForgotPasswordScreen — Phase 10
 *
 * Two-step forgot password flow:
 * Step 1: User enters registered email → receive OTP
 * Step 2: User enters OTP + new password → reset complete
 *
 * In Phase 9+, Step 1 calls authApi.forgotPassword() and
 * Step 2 calls authApi.resetPassword().
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Colors, Theme } from '../../constants';
import { CustomButton } from '../../components';
import { validateEmail, validatePassword } from '../../utils/validators';

const STEP_EMAIL = 'email';
const STEP_OTP = 'otp';
const STEP_DONE = 'done';

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Refs for OTP fields — auto-advance on input
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // ── Step 1: Send OTP ─────────────────────────────────────────
  const handleSendOTP = async () => {
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    setEmailError('');
    setIsLoading(true);
    try {
      // TODO Phase 9: await authApi.forgotPassword(email);
      await new Promise((r) => setTimeout(r, 1000));
      setStep(STEP_OTP);
      startResendTimer();
    } finally {
      setIsLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  // ── Step 2: Verify OTP + reset password ─────────────────────
  const handleVerifyAndReset = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      Alert.alert('Incomplete OTP', 'Please enter the complete 6-digit OTP.');
      return;
    }
    const pwdErr = validatePassword(newPassword);
    if (pwdErr) { Alert.alert('Invalid Password', pwdErr); return; }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.'); return;
    }
    setIsLoading(true);
    try {
      // TODO Phase 9: await authApi.resetPassword(otpValue, newPassword);
      await new Promise((r) => setTimeout(r, 1200));
      setStep(STEP_DONE);
    } finally {
      setIsLoading(false);
    }
  };

  // OTP digit input handler
  const handleOtpChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs[index + 1].current?.focus();
    if (!digit && index > 0) otpRefs[index - 1].current?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: Colors.primary }]}>
        {step !== STEP_DONE && (
          <TouchableOpacity style={styles.backBtn} onPress={() => {
            if (step === STEP_OTP) setStep(STEP_EMAIL);
            else navigation.goBack();
          }}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Forgot Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Step indicator ─────────────────────────── */}
        {step !== STEP_DONE && (
          <View style={styles.stepRow}>
            {[STEP_EMAIL, STEP_OTP].map((s, i) => (
              <React.Fragment key={s}>
                <View style={[styles.stepDot, (step === s || (step === STEP_DONE)) && styles.stepDotActive]}>
                  <Text style={styles.stepDotText}>{i + 1}</Text>
                </View>
                {i === 0 && (
                  <View style={[styles.stepLine, step === STEP_OTP && styles.stepLineActive]} />
                )}
              </React.Fragment>
            ))}
          </View>
        )}

        {/* ── STEP 1: Email input ───────────────────── */}
        {step === STEP_EMAIL && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Enter Your Email</Text>
            <Text style={styles.stepDesc}>
              We'll send a 6-digit OTP to your registered email address.
            </Text>

            <View style={[styles.card, { backgroundColor: Colors.surface }]}>
              <Text style={[styles.label, { color: Colors.textSecondary }]}>Email Address</Text>
              <TextInput
                style={[styles.input, emailError && styles.inputError]}
                value={email}
                onChangeText={(t) => { setEmail(t); setEmailError(''); }}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <CustomButton
              title={isLoading ? 'Sending OTP…' : 'Send OTP'}
              onPress={handleSendOTP}
              loading={isLoading}
              disabled={isLoading}
            />
            <View style={{ height: 12 }} />
            <CustomButton
              title="Back to Login"
              variant="outline"
              onPress={() => navigation.goBack()}
            />
          </View>
        )}

        {/* ── STEP 2: OTP + new password ────────────── */}
        {step === STEP_OTP && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Verify OTP</Text>
            <Text style={styles.stepDesc}>
              Enter the 6-digit code sent to{'\n'}
              <Text style={{ color: Colors.primary, fontWeight: '600' }}>{email}</Text>
            </Text>

            {/* OTP Boxes */}
            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={otpRefs[i]}
                  style={[styles.otpBox, digit && styles.otpBoxFilled]}
                  value={digit}
                  onChangeText={(t) => handleOtpChange(t, i)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  returnKeyType="next"
                />
              ))}
            </View>

            {/* Resend */}
            <TouchableOpacity
              disabled={resendTimer > 0}
              onPress={() => { setOtp(['', '', '', '', '', '']); handleSendOTP(); }}
              style={styles.resendBtn}
            >
              <Text style={[styles.resendText, resendTimer > 0 && { color: Colors.textMuted }]}>
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>

            {/* New Password */}
            <View style={[styles.card, { backgroundColor: Colors.surface }]}>
              <Text style={[styles.label, { color: Colors.textSecondary }]}>New Password</Text>
              <View style={[styles.pwdRow, { backgroundColor: Colors.inputBg, borderColor: Colors.border }]}>
                <TextInput
                  style={[styles.pwdInput, { color: Colors.textPrimary }]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showNewPwd}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowNewPwd(!showNewPwd)} style={styles.eyeBtn}>
                  <Text>{showNewPwd ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { color: Colors.textSecondary, marginTop: Theme.spacing.md }]}>
                Confirm Password
              </Text>
              <TextInput
                style={[styles.input, { marginTop: 4 }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter new password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
                autoCapitalize="none"
              />
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <Text style={styles.errorText}>⚠️ Passwords do not match</Text>
              )}
            </View>

            <CustomButton
              title={isLoading ? 'Verifying…' : 'Reset Password'}
              onPress={handleVerifyAndReset}
              loading={isLoading}
              disabled={isLoading}
            />
          </View>
        )}

        {/* ── STEP 3: Done ──────────────────────────── */}
        {step === STEP_DONE && (
          <View style={styles.doneContent}>
            <Text style={styles.doneEmoji}>🎉</Text>
            <Text style={styles.doneTitle}>Password Reset!</Text>
            <Text style={styles.doneDesc}>
              Your password has been updated successfully.{'\n'}
              You can now sign in with your new password.
            </Text>
            <CustomButton
              title="Back to Login"
              onPress={() => navigation.replace('Login')}
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.xl,
    marginTop: Theme.spacing.md,
  },
  stepDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },
  stepDotActive: { backgroundColor: Colors.primary },
  stepDotText: { color: '#fff', fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.bold },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginHorizontal: 8 },
  stepLineActive: { backgroundColor: Colors.primary },

  stepContent: {},
  stepTitle: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.extraBold,
    color: Colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },
  stepDesc: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Theme.spacing.lg,
  },

  card: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  label: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semiBold,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 13,
    fontSize: Theme.fontSize.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: { borderColor: Colors.error },
  errorText: { color: Colors.error, fontSize: Theme.fontSize.xs, marginTop: 4 },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: Theme.spacing.md,
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBg,
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  otpBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },

  resendBtn: { alignItems: 'center', marginBottom: Theme.spacing.lg },
  resendText: { fontSize: Theme.fontSize.sm, color: Colors.primary, fontWeight: Theme.fontWeight.semiBold },

  pwdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Theme.spacing.md,
  },
  pwdInput: { flex: 1, paddingVertical: 13, fontSize: Theme.fontSize.md },
  eyeBtn: { padding: 8 },

  doneContent: {
    alignItems: 'center',
    paddingTop: Theme.spacing.xl,
  },
  doneEmoji: { fontSize: 72, marginBottom: Theme.spacing.lg },
  doneTitle: {
    fontSize: Theme.fontSize.title,
    fontWeight: Theme.fontWeight.extraBold,
    color: Colors.success,
    marginBottom: Theme.spacing.md,
  },
  doneDesc: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Theme.spacing.xl,
  },
});

export default ForgotPasswordScreen;
