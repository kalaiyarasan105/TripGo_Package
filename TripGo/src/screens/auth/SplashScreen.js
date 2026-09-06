/**
 * SplashScreen
 * First screen shown when the app launches.
 * Phase 9: Checks for persisted auth session.
 * Phase 11: Checks if onboarding was completed.
 * - First launch → Onboarding
 * - Logged in → UserRoot / AdminRoot
 * - Not logged in → Login
 */

import React, { useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { Colors, Theme } from '../../constants';
import { isOnboardingDone } from '../../utils/storage';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const sessionRestored = useSelector((state) => state.auth.sessionRestored);

  useEffect(() => {
    // Fade + scale in the logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    const navigate = async () => {
      if (isLoggedIn && sessionRestored) {
        if (user?.role === 'admin') {
          navigation.replace('AdminRoot');
        } else {
          navigation.replace('UserRoot');
        }
        return;
      }
      // Check if onboarding has been shown before
      const onboardingDone = await isOnboardingDone();
      if (!onboardingDone) {
        navigation.replace('Onboarding');
      } else {
        navigation.replace('Login');
      }
    };

    const timer = setTimeout(navigate, 2500);
    return () => clearTimeout(timer);
  }, [sessionRestored, isLoggedIn]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      <Animated.View
        style={[
          styles.logoWrapper,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* App icon circle */}
        <View style={styles.iconCircle}>
          <Text style={styles.emoji}>✈️</Text>
        </View>

        {/* App name */}
        <Text style={styles.appName}>TripGo</Text>
        <Text style={styles.tagline}>Your Ultimate Travel Companion</Text>
      </Animated.View>

      {/* Bottom tagline */}
      <Text style={styles.footer}>Discover · Book · Explore</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  emoji: {
    fontSize: 56,
  },
  appName: {
    fontSize: 42,
    fontWeight: Theme.fontWeight.extraBold,
    color: Colors.white,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: Theme.fontSize.md,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 3,
  },
});

export default SplashScreen;
