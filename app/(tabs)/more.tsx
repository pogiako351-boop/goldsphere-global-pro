import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

interface MenuItemProps {
  icon: string;
  label: string;
  subtitle: string;
  onPress: () => void;
  badge?: string;
  premium?: boolean;
}

function MenuItem({ icon, label, subtitle, onPress, badge, premium }: MenuItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <GlassmorphicCard highlight={premium} style={styles.menuItem}>
        <View style={styles.menuRow}>
          <View style={[styles.menuIcon, premium && styles.menuIconPremium]}>
            <Ionicons name={icon as any} size={22} color={premium ? Colors.gold : Colors.textSecondary} />
          </View>
          <View style={styles.menuContent}>
            <View style={styles.menuLabelRow}>
              <Text style={[styles.menuLabel, premium && styles.menuLabelPremium]}>{label}</Text>
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
          <Text style={styles.headerSubtitle}>SETTINGS & PREMIUM</Text>
        </View>

        {/* Premium CTA */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/premium')}>
          <GlassmorphicCard highlight style={styles.premiumCard}>
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.2)', 'rgba(212, 175, 55, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumGradient}
            >
              <View style={styles.premiumContent}>
                <Ionicons name="diamond" size={36} color={Colors.gold} />
                <View style={styles.premiumText}>
                  <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                  <Text style={styles.premiumDesc}>
                    Unlock AI insights, ad-free experience & more
                  </Text>
                </View>
              </View>
              <View style={styles.premiumBtn}>
                <Text style={styles.premiumBtnText}>View Plans</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.black} />
              </View>
            </LinearGradient>
          </GlassmorphicCard>
        </TouchableOpacity>

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
          subtitle="View past prices & trends"
          onPress={() => router.push('/history')}
        />

        <MenuItem
          icon="sparkles-outline"
          label="AI Market Insights"
          subtitle="AI-powered predictions & analysis"
          onPress={() => router.push('/ai-insights')}
          badge="PRO"
          premium
        />

        <MenuItem
          icon="download-outline"
          label="Export Data"
          subtitle="Download price data in CSV"
          onPress={() => router.push('/premium')}
          badge="PRO"
          premium
        />

        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <View style={styles.sectionLine} />
        </View>

        <MenuItem
          icon="information-circle-outline"
          label="About GoldSphere"
          subtitle="Version 1.0.0"
          onPress={() => {}}
        />

        <MenuItem
          icon="star-outline"
          label="Rate this App"
          subtitle="Help us improve"
          onPress={() => {}}
        />

        <MenuItem
          icon="mail-outline"
          label="Contact Support"
          subtitle="Get help from our team"
          onPress={() => {}}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>GoldSphere Global Pro v1.0.0</Text>
          <Text style={styles.footerSubText}>Premium Market Data</Text>
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
  premiumCard: {
    marginBottom: Spacing.xxl,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  premiumGradient: {
    margin: -Spacing.lg,
    padding: Spacing.xl,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    color: Colors.goldLight,
    fontSize: FontSizes.xl,
    fontWeight: '700',
    marginBottom: 4,
  },
  premiumDesc: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  premiumBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  premiumBtnText: {
    color: Colors.black,
    fontSize: FontSizes.md,
    fontWeight: '700',
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
  menuIconPremium: {
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
  menuLabelPremium: {
    color: Colors.goldLight,
  },
  menuSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: Colors.black,
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
