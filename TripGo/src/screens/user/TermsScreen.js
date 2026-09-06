/**
 * TermsScreen — Phase 12
 *
 * Terms of Service and Privacy Policy screen.
 * Tab-based: Terms | Privacy | Cancellation Policy
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';

const TERMS_CONTENT = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using TripGo, you agree to be bound by these Terms of Service. If you do not agree to all the terms, do not use our service.',
  },
  {
    title: '2. Use of Service',
    body: 'TripGo provides a platform to browse, book, and manage travel packages. You must be at least 18 years old to make a booking. You are responsible for maintaining the confidentiality of your account credentials.',
  },
  {
    title: '3. Bookings and Payments',
    body: 'All bookings are subject to availability and confirmation. Prices are displayed in Indian Rupees (INR) and include applicable taxes unless stated otherwise. Payment is processed securely via our payment gateway partners.',
  },
  {
    title: '4. Intellectual Property',
    body: 'All content on TripGo including text, graphics, logos, and images is the property of TripGo or its content suppliers and is protected by applicable intellectual property laws.',
  },
  {
    title: '5. Limitation of Liability',
    body: 'TripGo shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use the service, or for any travel-related incidents that occur during the trip.',
  },
  {
    title: '6. Changes to Terms',
    body: 'We reserve the right to modify these terms at any time. Changes take effect immediately upon posting. Continued use of TripGo after changes constitutes acceptance of the new terms.',
  },
];

const PRIVACY_CONTENT = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide directly (name, email, phone, payment info), information about your device and usage patterns, and location data when you grant permission.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use your data to process bookings, provide customer support, send trip reminders and promotional offers (with your consent), improve our services, and comply with legal obligations.',
  },
  {
    title: '3. Data Sharing',
    body: 'We do not sell your personal data. We share information only with: tour operators and hotels to fulfill your bookings, payment processors to complete transactions, and analytics providers to improve our app.',
  },
  {
    title: '4. Data Security',
    body: 'We use industry-standard encryption (SSL/TLS) to protect data in transit. Sensitive payment information is handled directly by our PCI-DSS compliant payment partners.',
  },
  {
    title: '5. Your Rights',
    body: 'You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@tripgo.in. We will respond within 30 days.',
  },
  {
    title: '6. Cookies',
    body: 'Our app uses similar tracking technologies to remember your preferences and improve performance. You can opt out via device settings, though some features may not function correctly.',
  },
];

const CANCELLATION_CONTENT = [
  {
    title: 'Standard Cancellation Policy',
    body: '• Cancelled 30+ days before travel: Full refund\n• Cancelled 15–29 days before travel: 75% refund\n• Cancelled 7–14 days before travel: 50% refund\n• Cancelled within 7 days: No refund\n• No-show: No refund',
  },
  {
    title: 'How to Cancel',
    body: 'Log in to TripGo → My Bookings → Booking Details → Cancel Booking. You will receive a cancellation confirmation via email within 24 hours.',
  },
  {
    title: 'Refund Processing',
    body: 'Refunds are processed within 5–7 business days. The amount is credited back to the original payment method. Processing time may vary depending on your bank.',
  },
  {
    title: 'Force Majeure',
    body: 'In case of natural disasters, government orders, or other force majeure events, TripGo will offer a full travel credit valid for 12 months, or a refund at our discretion.',
  },
  {
    title: 'Package Modifications',
    body: 'You may request to change your travel date or traveler count up to 7 days before departure, subject to availability and a modification fee of ₹500 per booking.',
  },
];

const TAB_DATA = {
  Terms: TERMS_CONTENT,
  Privacy: PRIVACY_CONTENT,
  Cancellation: CANCELLATION_CONTENT,
};

const TermsScreen = ({ navigation }) => {
  const C = useThemeColors();
  const [activeTab, setActiveTab] = useState('Terms');

  const content = TAB_DATA[activeTab];

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Privacy</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: C.surface, borderColor: C.border }]}>
        {['Terms', 'Privacy', 'Cancellation'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabBtn,
              activeTab === tab && { borderBottomColor: C.primary, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabLabel, { color: activeTab === tab ? C.primary : C.textMuted }]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Last updated */}
        <Text style={[styles.lastUpdated, { color: C.textMuted }]}>
          Last updated: January 2026
        </Text>

        {content.map((section, idx) => (
          <View key={idx} style={[styles.section, { backgroundColor: C.surface, borderColor: C.border }]}>
            <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>
              {section.title}
            </Text>
            <Text style={[styles.sectionBody, { color: C.textSecondary }]}>
              {section.body}
            </Text>
          </View>
        ))}

        {/* Contact */}
        <View style={[styles.contactCard, { backgroundColor: C.primaryLight }]}>
          <Text style={[styles.contactTitle, { color: C.primary }]}>Questions?</Text>
          <Text style={[styles.contactText, { color: C.primaryDark }]}>
            Email us at{' '}
            <Text style={{ fontWeight: Theme.fontWeight.bold }}>legal@tripgo.in</Text>
            {'\n'}or call{' '}
            <Text style={{ fontWeight: Theme.fontWeight.bold }}>+91 800 800 8000</Text>
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
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

  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.semiBold },

  scroll: { padding: Theme.spacing.md },
  lastUpdated: { fontSize: Theme.fontSize.xs, marginBottom: Theme.spacing.md },

  section: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.base,
    fontWeight: Theme.fontWeight.bold,
    marginBottom: Theme.spacing.sm,
  },
  sectionBody: {
    fontSize: Theme.fontSize.sm,
    lineHeight: 22,
  },

  contactCard: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  contactTitle: {
    fontSize: Theme.fontSize.base,
    fontWeight: Theme.fontWeight.bold,
    marginBottom: 6,
  },
  contactText: { fontSize: Theme.fontSize.sm, lineHeight: 22 },
});

export default TermsScreen;
