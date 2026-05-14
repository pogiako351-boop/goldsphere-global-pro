import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Gradients } from '@/constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContextualAdInjectionProps {
  calculatedValue: number;
  isVisible: boolean;
}

interface AdTier {
  threshold: number;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
}

// ─── Ad Tier Configuration ────────────────────────────────────────────────────

const AD_TIERS: AdTier[] = [
  {
    threshold: 500000,
    title: 'Family Office Services',
    subtitle: 'Ultra-High-Net-Worth Solutions',
    description:
      'Multi-generational wealth structuring with dedicated concierge advisory and global asset coordination.',
    icon: 'shield-checkmark',
    accentColor: Colors.goldShimmer,
  },
  {
    threshold: 100000,
    title: 'Offshore Bullion Custody',
    subtitle: 'Sovereign Jurisdiction Vaulting',
    description:
      'Physical gold custody in tier-1 sovereign vaults with real-time audit access and insurance coverage.',
    icon: 'lock-closed',
    accentColor: Colors.gold,
  },
  {
    threshold: 25000,
    title: 'Private Wealth Advisory',
    subtitle: 'Personalized Portfolio Strategy',
    description:
      'One-on-one sessions with certified wealth advisors specializing in precious metals allocation.',
    icon: 'briefcase',
    accentColor: Colors.champagneGold,
  },
];

// ─── Shimmer Skeleton Loader ──────────────────────────────────────────────────

function ContextualShimmerSkeleton() {
  const { width: screenWidth } = useWindowDimensions();
  const translateX = useSharedValue(-screenWidth);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(screenWidth * 2, {
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );
  }, [screenWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.shimmerContainer}>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['rgba(15, 15, 20, 0.9)', 'rgba(20, 20, 28, 0.95)']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={Gradients.goldShimmer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: screenWidth * 0.5, height: '100%' }}
        />
      </Animated.View>
      <View style={styles.skeletonContent}>
        <View style={[styles.skeletonLine, { width: '35%', height: 10 }]} />
        <View style={[styles.skeletonLine, { width: '70%', height: 14, marginTop: 12 }]} />
        <View style={[styles.skeletonLine, { width: '90%', height: 10, marginTop: 10 }]} />
        <View style={[styles.skeletonLine, { width: '60%', height: 10, marginTop: 6 }]} />
      </View>
    </View>
  );
}

// ─── Contextual Ad Card ───────────────────────────────────────────────────────

function ContextualAdCard({ tier }: { tier: AdTier }) {
  const fadeOpacity = useSharedValue(0);
  const slideY = useSharedValue(20);

  useEffect(() => {
    fadeOpacity.value = withDelay(
      100,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) })
    );
    slideY.value = withDelay(
      100,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) })
    );
  }, [fadeOpacity, slideY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
    transform: [{ translateY: slideY.value }],
  }));

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <LinearGradient
        colors={['rgba(212, 175, 55, 0.06)', 'rgba(138, 138, 154, 0.04)', 'rgba(15, 15, 20, 0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        {/* Sponsored Label */}
        <View style={styles.sponsoredRow}>
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredText}>SPONSORED</Text>
          </View>
          <Ionicons name="information-circle-outline" size={13} color={Colors.textMuted} />
        </View>

        {/* Card Content */}
        <View style={styles.contentRow}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.2)', 'rgba(212, 175, 55, 0.05)']}
              style={styles.iconGradient}
            >
              <Ionicons name={tier.icon} size={22} color={tier.accentColor} />
            </LinearGradient>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.adSubtitle}>{tier.subtitle}</Text>
            <Text style={styles.adTitle}>{tier.title}</Text>
            <Text style={styles.adDescription} numberOfLines={2}>
              {tier.description}
            </Text>
          </View>
        </View>

        {/* CTA Area */}
        <View style={styles.ctaRow}>
          <View style={styles.ctaButton}>
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Learn More</Text>
              <Ionicons name="arrow-forward" size={12} color={Colors.gold} />
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContextualAdInjection({
  calculatedValue,
  isVisible,
}: ContextualAdInjectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTier, setActiveTier] = useState<AdTier | null>(null);

  // Determine the appropriate ad tier based on calculated value
  useEffect(() => {
    if (!isVisible || calculatedValue <= 0) {
      setActiveTier(null);
      setIsLoaded(false);
      return;
    }

    // Find highest matching tier
    const matchedTier = AD_TIERS.find((tier) => calculatedValue >= tier.threshold) || null;
    setActiveTier(matchedTier);
    setIsLoaded(false);

    if (matchedTier) {
      // Show shimmer skeleton for 1.5s before revealing ad content
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [calculatedValue, isVisible]);

  // Don't render if no tier matched or not visible
  if (!isVisible || !activeTier) {
    return null;
  }

  return (
    <View style={styles.container}>
      {!isLoaded ? <ContextualShimmerSkeleton /> : <ContextualAdCard tier={activeTier} />}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    margin: Spacing.xxl, // 24px separation from surrounding interactive elements
  },
  shimmerContainer: {
    height: 140,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.titaniumBorder,
    backgroundColor: Colors.obsidian,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  skeletonContent: {
    paddingHorizontal: Spacing.lg,
  },
  skeletonLine: {
    borderRadius: 4,
    backgroundColor: 'rgba(247, 231, 206, 0.06)',
  },
  cardContainer: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.titaniumBorder,
    backgroundColor: Colors.obsidian,
    overflow: 'hidden',
    // Glassmorphic shadow
    shadowColor: 'rgba(212, 175, 55, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  cardGradient: {
    padding: Spacing.lg,
  },
  sponsoredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  sponsoredBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sponsoredText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  contentRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconContainer: {
    alignSelf: 'flex-start',
  },
  iconGradient: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  adSubtitle: {
    color: Colors.gold,
    fontSize: FontSizes.xs,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  adTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  adDescription: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    lineHeight: 18,
  },
  ctaRow: {
    marginTop: Spacing.lg,
    alignItems: 'flex-start',
  },
  ctaButton: {
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  ctaText: {
    color: Colors.gold,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});
