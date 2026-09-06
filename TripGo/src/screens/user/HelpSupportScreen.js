/**
 * HelpSupportScreen — Phase 7
 *
 * Help & Support center with:
 * - FAQ accordion sections
 * - Contact options (email, phone, chat)
 * - Report a problem form
 * - App version info
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  Linking,
} from 'react-native';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { CustomButton } from '../../components';

const FAQ_DATA = [
  {
    category: 'Bookings',
    emoji: '🎒',
    items: [
      {
        question: 'How do I make a booking?',
        answer:
          'Browse packages on the Explore tab, select a package you like, choose a travel date and number of travelers, then proceed to checkout. Once payment is confirmed, your booking is created.',
      },
      {
        question: 'Can I cancel my booking?',
        answer:
          'Yes, you can cancel a confirmed booking from My Bookings → Booking Details. Cancellations made more than 7 days before travel receive a full refund. Within 7 days, a cancellation fee may apply.',
      },
      {
        question: 'How do I view my booking confirmation?',
        answer:
          'Go to My Bookings from the bottom navigation. Tap any booking to see full details including your booking reference number.',
      },
    ],
  },
  {
    category: 'Payments',
    emoji: '💳',
    items: [
      {
        question: 'What payment methods are accepted?',
        answer:
          'We accept Credit/Debit Cards, UPI, Net Banking, and select digital wallets. All payments are secured with 256-bit SSL encryption.',
      },
      {
        question: 'When will I receive my refund?',
        answer:
          'Refunds are processed within 5–7 business days to your original payment method. You will receive an email notification once the refund is initiated.',
      },
      {
        question: 'How do coupon codes work?',
        answer:
          'Enter your coupon code on the Checkout screen before completing payment. The discount will be applied automatically. Each coupon has its own terms including minimum booking value.',
      },
    ],
  },
  {
    category: 'Account',
    emoji: '👤',
    items: [
      {
        question: 'How do I update my profile?',
        answer:
          'Go to Profile tab and tap "Edit Profile". You can update your name, email, and phone number. Changes are saved immediately.',
      },
      {
        question: 'I forgot my password. What should I do?',
        answer:
          'On the Login screen, tap "Forgot Password?" and enter your registered email address. You will receive a reset link within a few minutes.',
      },
      {
        question: 'How do I delete my account?',
        answer:
          'To request account deletion, please contact our support team at support@tripgo.in. Account deletion requests are processed within 14 business days.',
      },
    ],
  },
  {
    category: 'Packages',
    emoji: '🗺️',
    items: [
      {
        question: 'Are flights included in the package?',
        answer:
          'Most packages do not include flights unless specifically mentioned. Check the "Excluded" section on the package details page.',
      },
      {
        question: 'Can I customize a package?',
        answer:
          'Currently we offer fixed packages. For custom itineraries, please contact our travel experts via the Support chat.',
      },
    ],
  },
];

const HelpSupportScreen = ({ navigation }) => {
  const C = useThemeColors();

  const [openCategory, setOpenCategory] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [reportText, setReportText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('faq'); // 'faq' | 'contact' | 'report'

  const handleContact = (type) => {
    if (type === 'email') {
      Linking.openURL('mailto:support@tripgo.in?subject=TripGo Support Request');
    } else if (type === 'phone') {
      Linking.openURL('tel:+918008008000');
    } else if (type === 'whatsapp') {
      Linking.openURL('https://wa.me/918008008000?text=Hello%20TripGo%20Support');
    }
  };

  const handleSendReport = async () => {
    if (reportText.trim().length < 20) {
      Alert.alert('Too Short', 'Please describe the issue in at least 20 characters.');
      return;
    }
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSending(false);
    setReportText('');
    Alert.alert(
      'Report Sent',
      'Thank you! Our team will review your report and get back to you within 24 hours.',
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      {/* ── Header ───────────────────────────────────── */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Tab Bar ──────────────────────────────────── */}
      <View style={[styles.tabBar, { backgroundColor: C.surface, borderColor: C.border }]}>
        {[
          { key: 'faq', label: '❓ FAQ' },
          { key: 'contact', label: '📞 Contact' },
          { key: 'report', label: '🐛 Report' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabBtn,
              activeTab === tab.key && { borderBottomColor: C.primary, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === tab.key ? C.primary : C.textMuted },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Theme.spacing.md }}>

        {/* ── FAQ Tab ──────────────────────────────────── */}
        {activeTab === 'faq' && (
          <>
            <Text style={[styles.sectionHeader, { color: C.textPrimary }]}>
              Frequently Asked Questions
            </Text>

            {FAQ_DATA.map((category, catIdx) => (
              <View key={catIdx} style={[styles.categoryCard, { backgroundColor: C.surface, borderColor: C.border }]}>
                {/* Category Header */}
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() =>
                    setOpenCategory(openCategory === catIdx ? null : catIdx)
                  }
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={[styles.categoryLabel, { color: C.textPrimary }]}>
                    {category.category}
                  </Text>
                  <Text style={[styles.chevron, { color: C.textMuted }]}>
                    {openCategory === catIdx ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {/* FAQ Items */}
                {openCategory === catIdx &&
                  category.items.map((item, itemIdx) => {
                    const key = `${catIdx}-${itemIdx}`;
                    return (
                      <View key={itemIdx}>
                        <View style={[styles.faqDivider, { backgroundColor: C.border }]} />
                        <TouchableOpacity
                          style={styles.questionRow}
                          onPress={() =>
                            setOpenQuestion(openQuestion === key ? null : key)
                          }
                        >
                          <Text style={[styles.questionText, { color: C.textPrimary }]}>
                            {item.question}
                          </Text>
                          <Text style={[styles.chevron, { color: C.textMuted }]}>
                            {openQuestion === key ? '−' : '+'}
                          </Text>
                        </TouchableOpacity>
                        {openQuestion === key && (
                          <Text style={[styles.answerText, { color: C.textSecondary }]}>
                            {item.answer}
                          </Text>
                        )}
                      </View>
                    );
                  })}
              </View>
            ))}
          </>
        )}

        {/* ── Contact Tab ──────────────────────────────── */}
        {activeTab === 'contact' && (
          <>
            <Text style={[styles.sectionHeader, { color: C.textPrimary }]}>
              Get in Touch
            </Text>

            {[
              {
                emoji: '📧',
                title: 'Email Support',
                subtitle: 'support@tripgo.in',
                note: 'Typically responds within 24 hours',
                type: 'email',
                color: '#EA4335',
              },
              {
                emoji: '📞',
                title: 'Phone Support',
                subtitle: '+91 800 800 8000',
                note: 'Mon–Sat, 9 AM – 8 PM',
                type: 'phone',
                color: '#34A853',
              },
              {
                emoji: '💬',
                title: 'WhatsApp Chat',
                subtitle: '+91 800 800 8000',
                note: 'Quick replies during business hours',
                type: 'whatsapp',
                color: '#25D366',
              },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.contactCard, { backgroundColor: C.surface, borderColor: C.border }]}
                onPress={() => handleContact(item.type)}
              >
                <View style={[styles.contactIconBg, { backgroundColor: item.color + '20' }]}>
                  <Text style={styles.contactEmoji}>{item.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.contactTitle, { color: C.textPrimary }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.contactSub, { color: item.color }]}>
                    {item.subtitle}
                  </Text>
                  <Text style={[styles.contactNote, { color: C.textMuted }]}>
                    {item.note}
                  </Text>
                </View>
                <Text style={[styles.chevron, { color: C.textMuted }]}>›</Text>
              </TouchableOpacity>
            ))}

            {/* Business hours */}
            <View style={[styles.hoursCard, { backgroundColor: C.primaryLight }]}>
              <Text style={[styles.hoursTitle, { color: C.primary }]}>🕐 Support Hours</Text>
              <Text style={[styles.hoursText, { color: C.primaryDark }]}>
                Monday – Saturday: 9:00 AM – 8:00 PM IST{'\n'}
                Sunday: 10:00 AM – 5:00 PM IST{'\n'}
                Public Holidays: 11:00 AM – 3:00 PM IST
              </Text>
            </View>
          </>
        )}

        {/* ── Report Tab ───────────────────────────────── */}
        {activeTab === 'report' && (
          <>
            <Text style={[styles.sectionHeader, { color: C.textPrimary }]}>
              Report a Problem
            </Text>

            <View style={[styles.reportCard, { backgroundColor: C.surface, borderColor: C.border }]}>
              <Text style={[styles.reportLabel, { color: C.textSecondary }]}>
                Describe the issue you are experiencing
              </Text>
              <TextInput
                style={[
                  styles.reportInput,
                  { backgroundColor: C.inputBg, color: C.textPrimary, borderColor: C.border },
                ]}
                placeholder="E.g. App crashes when I open the booking screen, or payment failed but amount was deducted..."
                placeholderTextColor={C.textMuted}
                value={reportText}
                onChangeText={setReportText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={1000}
              />
              <Text style={[styles.charCount, { color: C.textMuted }]}>
                {reportText.length}/1000
              </Text>

              <CustomButton
                title={isSending ? 'Sending…' : 'Send Report'}
                onPress={handleSendReport}
                loading={isSending}
                disabled={isSending || reportText.trim().length < 20}
              />
            </View>

            <View style={[styles.privacyNote, { backgroundColor: C.surface, borderColor: C.border }]}>
              <Text style={[styles.privacyText, { color: C.textSecondary }]}>
                🔒 Your report is private. We may follow up via your registered email.
                No personal data is shared with third parties.
              </Text>
            </View>
          </>
        )}

        {/* App version footer */}
        <Text style={[styles.version, { color: C.textMuted }]}>TripGo v1.0.0 • Build 100</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
  backIcon: { fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' },
  headerTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: '#FFFFFF',
  },

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
  tabLabel: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semiBold,
  },

  sectionHeader: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    marginBottom: Theme.spacing.md,
  },

  // FAQ
  categoryCard: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    ...Theme.shadow.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    gap: 10,
  },
  categoryEmoji: { fontSize: 22 },
  categoryLabel: { flex: 1, fontSize: Theme.fontSize.base, fontWeight: Theme.fontWeight.bold },
  chevron: { fontSize: 16 },
  faqDivider: { height: 1, marginHorizontal: Theme.spacing.md },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Theme.spacing.md,
    gap: 10,
  },
  questionText: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semiBold,
    lineHeight: 22,
  },
  answerText: {
    fontSize: Theme.fontSize.sm,
    lineHeight: 22,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.md,
  },

  // Contact
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    gap: 12,
    ...Theme.shadow.sm,
  },
  contactIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactEmoji: { fontSize: 26 },
  contactTitle: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold, marginBottom: 2 },
  contactSub: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.semiBold, marginBottom: 2 },
  contactNote: { fontSize: Theme.fontSize.xs },

  hoursCard: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  hoursTitle: {
    fontSize: Theme.fontSize.base,
    fontWeight: Theme.fontWeight.bold,
    marginBottom: Theme.spacing.sm,
  },
  hoursText: { fontSize: Theme.fontSize.sm, lineHeight: 24 },

  // Report
  reportCard: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  reportLabel: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semiBold,
    marginBottom: Theme.spacing.sm,
  },
  reportInput: {
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
    borderWidth: 1,
    minHeight: 140,
    lineHeight: 22,
    marginBottom: 6,
  },
  charCount: {
    fontSize: Theme.fontSize.xs,
    textAlign: 'right',
    marginBottom: Theme.spacing.md,
  },
  privacyNote: {
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  privacyText: { fontSize: Theme.fontSize.xs, lineHeight: 20 },

  version: {
    textAlign: 'center',
    fontSize: Theme.fontSize.xs,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
});

export default HelpSupportScreen;
