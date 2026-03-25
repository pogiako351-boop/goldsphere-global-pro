import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import AdBanner from '@/components/AdBanner';
import { Colors, FontSizes, Spacing } from '@/constants/theme';
import CONFIG from '@/config';

interface MenuItemProps {
  icon: string;
  label: string;
  subtitle: string;
  onPress: () => void;
  badge?: string;
  highlight?: boolean;
}

function MenuItem({ icon, label, subtitle, onPress, badge, highlight }: MenuItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <GlassmorphicCard highlight={highlight} style={styles.menuItem}>
        <View style={styles.menuRow}>
          <View style={[styles.menuIcon, highlight && styles.menuIconHighlight]}>
            <Ionicons name={icon as any} size={22} color={highlight ? Colors.gold : Colors.textSecondary} />
          </View>
          <View style={styles.menuContent}>
            <View style={styles.menuLabelRow}>
              <Text style={[styles.menuLabel, highlight && styles.menuLabelHighlight]}>{label}</Text>
              {badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.menuSubtitle}>{subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </View>
      </GlassmorphicCard>
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#0A0A0A', '#111111']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>More</Text>
          <Text style={styles.headerSubtitle}>SETTINGS & TOOLS</Text>
        </View>

        {/* Top Ad */}
        <AdBanner placement="top" />

        {/* Menu Items */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>FEATURES</Text>
          <View style={styles.sectionLine} />
        </View>

        <MenuItem
          icon="notifications-outline"
          label="Alerts & Notifications"
          subtitle="Set custom price alerts"
          onPress={() => router.push('/alerts')}
        />

        <MenuItem
          icon="time-outline"
          label="Price History"
          subtitle="View past prices & export CSV"
          onPress={() => router.push('/history')}
        />

        <MenuItem
          icon="sparkles-outline"
          label="AI Market Insights"
          subtitle="AI-powered predictions & analysis"
          onPress={() => router.push('/ai-insights')}
          badge="FREE"
          highlight
        />

        <MenuItem
          icon="download-outline"
          label="Export Data (CSV)"
          subtitle="Download price data for free"
          onPress={() => router.push('/history')}
          badge="FREE"
          highlight
        />

        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>LEGAL & INFO</Text>
          <View style={styles.sectionLine} />
        </View>

        <MenuItem
          icon="information-circle-outline"
          label="About GoldSphere"
          subtitle={`Version ${CONFIG.APP_VERSION}`}
          onPress={() => router.push('/about')}
        />

        <MenuItem
          icon="lock-closed-outline"
          label="Privacy Policy"
          subtitle="How we handle your data"
          onPress={() => router.push('/privacy')}
        />

        <MenuItem
          icon="document-text-outline"
          label="Terms of Service"
          subtitle="Usage terms and conditions"
          onPress={() => router.push('/terms')}
        />

        {/* Ad Banner */}
        <AdBanner placement="mid" />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>GoldSphere Global Pro v{CONFIG.APP_VERSION}</Text>
          <Text style={styles.footerSubText}>Free Market Data for Everyone</Text>
        </View>

        <View style={{ height: 30 }} />
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
    paddingBottom: Spacing.xxxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: '300',
    color: Colors.gold,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
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
  menuItem: {
    marginBottom: Spacing.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconHighlight: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
  },
  menuContent: {
    flex: 1,
  },
  menuLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  menuLabel: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  menuLabelHighlight: {
    color: Colors.goldLight,
  },
  menuSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.green,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.lg,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  footerSubText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: 4,
    letterSpacing: 2,
  },
});
