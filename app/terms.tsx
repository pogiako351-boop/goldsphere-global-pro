import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import { Colors, FontSizes, Spacing, Gradients } from '@/constants/theme';

export default function TermsOfServiceScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Gradients.carbonDepth}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Terms of Service</Text>
          <View style={styles.backBtnPlaceholder} />
        </View>

        <GlassmorphicCard highlight style={styles.card}>
          <Text style={styles.lastUpdated}>Last updated: March 25, 2026</Text>
        </GlassmorphicCard>

        <View style={styles.body}>
          <Text style={styles.heading}>{'1. Acceptance of Terms'}</Text>
          <Text style={styles.paragraph}>
            {'By accessing and using GoldSphere Global Pro (the Service), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. These terms apply to all visitors, users, and others who access or use the Service.'}
          </Text>

          <Text style={styles.heading}>{'2. Description of Service'}</Text>
          <Text style={styles.paragraph}>
            {'GoldSphere Global Pro is a free web application that provides gold and silver price tracking, a price calculator, historical price charts, educational articles, and AI-generated market insights. The Service is provided for informational and educational purposes only and is not intended as financial, investment, or trading advice.'}
          </Text>

          <Text style={styles.heading}>{'3. No Financial Advice'}</Text>
          <Text style={styles.paragraph}>
            {'The content provided through the Service, including but not limited to price data, market analysis, AI-generated insights, and educational articles, is for informational purposes only. It does not constitute financial advice, investment advice, trading advice, or any other sort of advice. You should not treat any of the Service\'s content as such. We do not recommend that any financial instrument should be bought, sold, or held by you. Do conduct your own due diligence and consult your financial advisor before making any investment decisions.'}
          </Text>

          <Text style={styles.heading}>{'4. Accuracy of Information'}</Text>
          <Text style={styles.paragraph}>
            {'While we strive to provide accurate and up-to-date gold and silver price information, we make no warranties or representations regarding the accuracy, completeness, or timeliness of any data displayed on the Service. Price data may be delayed, and market conditions can change rapidly. Users should verify all critical financial information from official market sources before making any decisions.'}
          </Text>

          <Text style={styles.heading}>{'5. User Conduct'}</Text>
          <Text style={styles.paragraph}>
            {'You agree to use the Service only for lawful purposes and in a way that does not infringe upon the rights of others. You shall not attempt to gain unauthorized access to any part of the Service, interfere with the proper functioning of the Service, or use automated systems to access the Service in a manner that exceeds reasonable usage.'}
          </Text>

          <Text style={styles.heading}>{'6. Advertisements'}</Text>
          <Text style={styles.paragraph}>
            {'The Service displays advertisements provided by Google AdSense and other premium advertising networks. These advertisements are an integral part of the Service and fund the free provision of all features. By using the Service, you acknowledge and agree that: advertisements are part of the core experience and support the free availability of all features; you will not use ad-blocking software, browser extensions, or any other tools that interfere with the proper display and function of advertisements; clicking on advertisements is entirely voluntary, and the 24-pixel buffer zone between ads and interactive elements is designed to prevent accidental interactions; the presence of advertisements does not constitute endorsement of advertised products or services; sponsored content is clearly labeled and separated from editorial content; and advertising data collection is governed by our Privacy Policy. Interference with advertisement display may result in restricted access to the Service.'}
          </Text>

          <Text style={styles.heading}>{'7. Intellectual Property'}</Text>
          <Text style={styles.paragraph}>
            {'All content on the Service, including text, graphics, logos, icons, images, audio clips, data compilations, and software, is the property of GoldSphere Global Pro or its content suppliers and is protected by international copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.'}
          </Text>

          <Text style={styles.heading}>{'8. Limitation of Liability'}</Text>
          <Text style={styles.paragraph}>
            {'In no event shall GoldSphere Global Pro, its operators, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your access to or use of the Service, any financial decisions made based on information from the Service, or any unauthorized access to or use of our servers.'}
          </Text>

          <Text style={styles.heading}>{'9. Changes to Terms'}</Text>
          <Text style={styles.paragraph}>
            {'We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days\' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.'}
          </Text>

          <Text style={styles.heading}>{'10. Governing Law'}</Text>
          <Text style={styles.paragraph}>
            {'These Terms shall be governed by and construed in accordance with applicable international laws and regulations. Any disputes arising from these Terms or your use of the Service shall be resolved through appropriate legal channels.'}
          </Text>

          <Text style={styles.heading}>{'Contact'}</Text>
          <Text style={styles.paragraph}>
            {'If you have any questions about these Terms of Service, please contact us through the app\'s support feature.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPlaceholder: {
    width: 40,
  },
  headerLabel: {
    color: Colors.gold,
    fontSize: FontSizes.xxl,
    fontWeight: '300',
    letterSpacing: 1,
  },
  card: {
    marginBottom: Spacing.xl,
  },
  lastUpdated: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
  body: {
    marginBottom: Spacing.xxxl,
  },
  heading: {
    color: Colors.goldLight,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  paragraph: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
});
