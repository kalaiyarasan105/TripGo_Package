/**
 * OnboardingScreen — Professional Redesign
 *
 * - Single solid brand color throughout (#1A73E8)
 * - No emoji icons — clean illustrated placeholders with letters/shapes
 * - Minimal, professional typography
 * - Smooth dot indicator
 * - Persists completion via storage
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { markOnboardingDone } from '../../utils/storage';

const { width: W } = Dimensions.get('window');

const PRIMARY = '#1A73E8';
const PRIMARY_DARK = '#1558B0';

const SLIDES = [
  {
    illustration: 'EXPLORE',
    tag: '01 / 04',
    title: 'Discover India\nLike Never Before',
    description:
      'Curated travel packages to the most breathtaking destinations across India — mountains, beaches, heritage cities and more.',
  },
  {
    illustration: 'PACKAGE',
    tag: '02 / 04',
    title: 'All-Inclusive\nPackages',
    description:
      'Hotels, meals, transfers and guided tours — all covered in one price. Just show up, we handle everything else.',
  },
  {
    illustration: 'BOOK',
    tag: '03 / 04',
    title: 'Book in Minutes,\nPay Securely',
    description:
      'Simple 3-step checkout with multiple payment options. Instant booking confirmation delivered to you.',
  },
  {
    illustration: 'SUPPORT',
    tag: '04 / 04',
    title: 'We Are With You\nEvery Step',
    description:
      '24/7 customer support, real-time trip reminders and a dedicated travel guide for every journey.',
  },
];

// Professional illustration box — clean, no emoji
const IllustrationBox = ({ type }) => {
  const content = {
    EXPLORE: { symbol: '✦', label: 'DESTINATIONS' },
    PACKAGE: { symbol: '◈', label: 'PACKAGES' },
    BOOK:    { symbol: '◎', label: 'BOOKING' },
    SUPPORT: { symbol: '◉', label: 'SUPPORT' },
  }[type];

  return (
    <View style={ill.wrapper}>
      <View style={ill.outerRing}>
        <View style={ill.innerCircle}>
          <Text style={ill.symbol}>{content.symbol}</Text>
        </View>
      </View>
      <Text style={ill.label}>{content.label}</Text>
    </View>
  );
};

const ill = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: 48,
  },
  outerRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  innerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 4,
    fontWeight: '600',
  },
});

export default function OnboardingScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleNext = async () => {
    if (activeIndex < SLIDES.length - 1) {
      const next = activeIndex + 1;
      scrollRef.current?.scrollTo({ x: next * W, animated: true });
      setActiveIndex(next);
    } else {
      await markOnboardingDone();
      navigation.replace('Login');
    }
  };

  const handleSkip = async () => {
    await markOnboardingDone();
    navigation.replace('Login');
  };

  const onScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    setActiveIndex(idx);
  };

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={PRIMARY} barStyle="light-content" />

      {/* Skip */}
      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDES.map((slide, idx) => (
          <View key={idx} style={[styles.slide, { width: W }]}>
            <IllustrationBox type={slide.illustration} />

            <Text style={styles.tag}>{slide.tag}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Next / Get Started button */}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>
            {isLast ? 'Get Started' : 'Next'}
          </Text>
          <Text style={styles.nextArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PRIMARY,
  },

  skipBtn: {
    position: 'absolute',
    top: 52,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingTop: 80,
  },

  tag: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 3,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 20,
    letterSpacing: -0.5,
  },

  description: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },

  bottomBar: {
    paddingHorizontal: 28,
    paddingBottom: 44,
    paddingTop: 24,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 28,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 28,
    backgroundColor: '#FFFFFF',
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY,
    letterSpacing: 0.2,
  },
  nextArrow: {
    fontSize: 16,
    color: PRIMARY,
    fontWeight: '600',
  },
});
