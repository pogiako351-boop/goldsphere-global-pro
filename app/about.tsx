import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import GoldShimmer from '@/components/GoldShimmer';
import AdBanner from '@/components/AdBanner';
import { Colors, FontSizes, Spacing } from '@/constants/theme';
import CONFIG from '@/config';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#0A0A0A', '#111111']}
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
          <Text style={styles.headerLabel}>About</Text>
          <View style={styles.backBtnPlaceholder} />
        </View>

        {/* App Info Card */}
        <GlassmorphicCard highlight style={styles.appCard}>
          <LinearGradient
            colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.02)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.appGradient}
          >
            <View style={styles.appIcon}>
              <LinearGradient
                colors={[Colors.goldLight, Colors.gold, Colors.goldDark]}
                style={styles.appIconGradient}
              >
                <Ionicons name="globe" size={36} color={Colors.black} />
              </LinearGradient>
            </View>
            <GoldShimmer width={200} height={2} style={{ marginVertical: 12 }} />
            <Text style={styles.appName}>GoldSphere Global Pro</Text>
            <Text style={styles.appVersion}>Version {CONFIG.APP_VERSION}</Text>
            <Text style={styles.appDesc}>
              Your free, comprehensive gold and silver price tracking platform.
              Track live prices, analyze trends, calculate values, and stay informed
              with expert market insights.
            </Text>
          </LinearGradient>
        </GlassmorphicCard>

        {/* Features */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>FEATURES</Text>
          <View style={styles.sectionLine} />
        </View>

        {[
          { icon: 'speedometer', title: 'Live Dashboard', desc: 'Real-time gold and silver prices updated continuously' },
          { icon: 'analytics', title: 'Interactive Charts', desc: 'Historical price charts with touch-enabled data exploration' },
          { icon: 'calculator', title: 'Price Calculator', desc: 'Convert gold weight to value in multiple currencies' },
          { icon: 'sparkles', title: 'AI Insights', desc: 'Smart market analysis and price predictions - free for everyone' },
          { icon: 'notifications', title: 'Price Alerts', desc: 'Custom alerts when prices reach your target levels' },
          { icon: 'download', title: 'CSV Export', desc: 'Download historical price data for your own analysis' },
          { icon: 'book', title: 'Knowledge Hub', desc: 'In-depth articles on gold investing and market dynamics' },
        ].map((feature, index) => (
          <GlassmorphicCard key={index} style={styles.featureCard}>
            <View style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={20} color={Colors.gold} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          </GlassmorphicCard>
        ))}

        {/* Ad Banner */}
        <AdBanner placement="mid" />

        {/* Mission */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>OUR MISSION</Text>
          <View style={styles.sectionLine} />
        </View>

        <GlassmorphicCard highlight style={styles.missionCard}>
          <Text style={styles.missionText}>
            GoldSphere Global Pro was created to democratize access to gold market information.
            We believe that everyone, regardless of their investment experience or budget,
            should have access to quality market data, educational resources, and analytical tools.
            All features are completely free and will always remain so.
          </Text>
        </GlassmorphicCard>

        {/* Disclaimer */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>DISCLAIMER</Text>
          <View style={styles.sectionLine} />
        </View>

        <GlassmorphicCard style={styles.disclaimerCard}>
          <Ionicons name="warning-outline" size={22} color={Colors.textMuted} />
          <Text style={styles.disclaimerText}>
            GoldSphere Global Pro provides information for educational and informational purposes only.
            Nothing on this platform constitutes financial, investment, legal, or tax advice.
            Gold and silver prices are volatile and past performance does not guarantee future results.
            Always consult a qualified financial advisor before making investment decisions.
            We are not responsible for any financial losses incurred based on information from this platform.
          </Text>
        </GlassmorphicCard>

        {/* Legal Links */}
        <View style={styles.legalLinks}>
          <TouchableOpacity onPress={() => router.push('/privacy')} activeOpacity={0.7}>
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.legalDivider}>|</Text>
          <TouchableOpacity onPress={() => router.push('/terms')} activeOpacity={0.7}>
            <Text style={styles.legalLink}>Terms of Service</Text>
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <View style={styles.copyright}>
          <Text style={styles.copyrightText}>
            2026 GoldSphere Global Pro. All rights reserved.
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
  appCard: {
    marginBottom: Spacing.xxl,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  appGradient: {
    margin: -Spacing.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  appIcon: {
    marginBottom: Spacing.sm,
  },
  appIconGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    color: Colors.goldLight,
    fontSize: FontSizes.xxl,
    fontWeight: '300',
    letterSpacing: 2,
  },
  appVersion: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    marginTop: 4,
    letterSpacing: 2,
  },
  appDesc: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.gold,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 3,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  featureCard: {
    marginBottom: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  featureDesc: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  missionCard: {
    marginBottom: Spacing.xxl,
  },
  missionText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    lineHeight: 24,
  },
  disclaimerCard: {
    marginBottom: Spacing.xl,
  },
  disclaimerText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    lineHeight: 22,
    marginTop: Spacing.md,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  legalLink: {
    color: Colors.gold,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  legalDivider: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
  copyright: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  copyrightText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    letterSpacing: 1,
  },
});
