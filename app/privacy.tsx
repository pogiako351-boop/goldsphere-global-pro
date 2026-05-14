import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import { Colors, FontSizes, Spacing, Gradients } from '@/constants/theme';

export default function PrivacyPolicyScreen() {
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
          <Text style={styles.headerLabel}>Privacy Policy</Text>
          <View style={styles.backBtnPlaceholder} />
        </View>

        <GlassmorphicCard highlight style={styles.card}>
          <Text style={styles.lastUpdated}>Last updated: March 25, 2026</Text>
        </GlassmorphicCard>

        <View style={styles.body}>
          <Text style={styles.heading}>{'Introduction'}</Text>
          <Text style={styles.paragraph}>
            {'GoldSphere Global Pro is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information when you use our web application. By using the Service, you agree to the collection and use of information in accordance with this policy.'}
          </Text>

          <Text style={styles.heading}>{'Information We Collect'}</Text>
          <Text style={styles.paragraph}>
            {'GoldSphere Global Pro is a local-first application. We minimize data collection to provide a privacy-respecting experience:'}
          </Text>
          <Text style={styles.bullet}>{'- Local Storage Data: Your price alerts, settings, and preferences are stored locally on your device using browser local storage. This data never leaves your device.'}</Text>
          <Text style={styles.bullet}>{'- Usage Analytics: We may collect anonymous, aggregated usage statistics to improve the Service. This data cannot be used to identify individual users.'}</Text>
          <Text style={styles.bullet}>{'- Advertising Data: We use Google AdSense to display advertisements. Google may use cookies and web beacons to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting Google\'s Ad Settings.'}</Text>

          <Text style={styles.heading}>{'How We Use Information'}</Text>
          <Text style={styles.paragraph}>
            {'We use the information we collect to:'}
          </Text>
          <Text style={styles.bullet}>{'- Provide and maintain the Service'}</Text>
          <Text style={styles.bullet}>{'- Display relevant advertisements through Google AdSense'}</Text>
          <Text style={styles.bullet}>{'- Improve and optimize the user experience'}</Text>
          <Text style={styles.bullet}>{'- Analyze usage patterns in aggregate'}</Text>

          <Text style={styles.heading}>{'Cookies and Tracking'}</Text>
          <Text style={styles.paragraph}>
            {'Our Service uses cookies for the following purposes: essential functionality (storing your local preferences), advertising (Google AdSense uses cookies for ad personalization), and analytics (anonymous usage tracking). You can control cookies through your browser settings. Disabling cookies may affect some features of the Service.'}
          </Text>

          <Text style={styles.heading}>{'Third-Party Services'}</Text>
          <Text style={styles.paragraph}>
            {'We use the following third-party services:'}
          </Text>
          <Text style={styles.bullet}>{'- Google AdSense: For displaying advertisements. Google\'s privacy policy applies to data collected through ads.'}</Text>
          <Text style={styles.bullet}>{'- Gold Price APIs: We fetch live market data from third-party APIs. No personal information is shared with these services.'}</Text>

          <Text style={styles.heading}>{'Personalized Advertising'}</Text>
          <Text style={styles.paragraph}>
            {'We partner with premium advertising networks, including Google AdSense, to deliver personalized advertisements tailored to your interests. These networks may collect and use data including: device identifiers and technical information, browsing patterns and interaction data within the Service, approximate geographic location based on IP address, and content preferences inferred from your usage patterns. This data enables the delivery of relevant, high-quality advertisements that align with your financial interests. You may opt out of personalized advertising through your device settings or by visiting the Digital Advertising Alliance\'s opt-out page.'}
          </Text>

          <Text style={styles.heading}>{'Data Retention for Advertising'}</Text>
          <Text style={styles.paragraph}>
            {'Advertising-related data is retained for up to 13 months in accordance with industry standards. Anonymized aggregate data may be retained indefinitely for analytics purposes. You may request deletion of your advertising profile by contacting us.'}
          </Text>

          <Text style={styles.heading}>{'Your Advertising Choices'}</Text>
          <Text style={styles.paragraph}>
            {'You have control over personalized advertising: adjust ad personalization in your device settings, opt out via Google Ad Settings (adssettings.google.com), use the DAA opt-out tool (optout.aboutads.info), or contact us to request removal from advertising profiles. Note that opting out of personalized ads does not reduce the number of ads you see; it only means ads may be less relevant to your interests.'}
          </Text>

          <Text style={styles.heading}>{'Data Security'}</Text>
          <Text style={styles.paragraph}>
            {'Since GoldSphere Global Pro stores data locally on your device, your data security is primarily dependent on your device\'s security measures. We do not transmit or store personal data on external servers. We recommend keeping your browser and device updated for optimal security.'}
          </Text>

          <Text style={styles.heading}>{'Children\'s Privacy'}</Text>
          <Text style={styles.paragraph}>
            {'Our Service is not directed to children under 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.'}
          </Text>

          <Text style={styles.heading}>{'Changes to This Policy'}</Text>
          <Text style={styles.paragraph}>
            {'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the last updated date. You are advised to review this Privacy Policy periodically for any changes.'}
          </Text>

          <Text style={styles.heading}>{'Contact Us'}</Text>
          <Text style={styles.paragraph}>
            {'If you have any questions about this Privacy Policy, please contact us through the app\'s support feature or visit our website.'}
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
  bullet: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    lineHeight: 24,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.md,
  },
});
