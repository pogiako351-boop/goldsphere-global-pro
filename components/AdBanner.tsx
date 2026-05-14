import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Gradients } from '@/constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type AdVariant = 'in-feed';

interface AdBannerProps {
  variant?: AdVariant;
  /** Legacy placement prop for backward compatibility */
  placement?: string;
  /** Custom ad content label for testing/placeholder */
  contentLabel?: string;
}

// ─── Shimmer Skeleton Loader ──────────────────────────────────────────────────

function ChampagneShimmerSkeleton({ height }: { height: number }) {
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
    <View style={[styles.shimmerContainer, { height }]}>
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
      {/* Skeleton lines */}
      <View style={styles.skeletonLines}>
        <View style={[styles.skeletonLine, { width: '60%' }]} />
        <View style={[styles.skeletonLine, { width: '40%', marginTop: 8 }]} />
      </View>
    </View>
  );
}

// ─── Ad Info Disclosure Icon ──────────────────────────────────────────────────

function AdInfoIcon() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View style={styles.infoIconWrapper}>
      <Pressable
        onPress={() => setShowTooltip(!showTooltip)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
      </Pressable>
      {showTooltip && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            This is a sponsored placement. Content is provided by advertisers.
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Sponsored Label ──────────────────────────────────────────────────────────

function SponsoredLabel() {
  return (
    <View style={styles.sponsoredLabelContainer}>
      <Text style={styles.sponsoredLabelText}>SPONSORED</Text>
      <AdInfoIcon />
    </View>
  );
}

// ─── Ad Content Placeholder ───────────────────────────────────────────────────

function AdContentPlaceholder({ label }: { label: string }) {
  return (
    <View style={styles.adContentInner}>
      <SponsoredLabel />
      <View style={styles.adBodyContainer}>
        <LinearGradient
          colors={['rgba(212, 175, 55, 0.08)', 'rgba(15, 15, 20, 0.6)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.adBodyGradient}
        >
          <Ionicons name="diamond-outline" size={20} color={Colors.gold} />
          <Text style={styles.adBodyText}>{label}</Text>
        </LinearGradient>
      </View>
    </View>
  );
}

// ─── Web AdSense Container ────────────────────────────────────────────────────

function WebAdSenseContainer({ variant, nativeID }: { variant: AdVariant; nativeID: string }) {
  return (
    <View nativeID={nativeID} style={styles.webAdSenseSlot}>
      <Text style={styles.webAdSenseText}>AdSense Slot: {nativeID}</Text>
    </View>
  );
}

// ─── Main AdBanner Component ──────────────────────────────────────────────────

export default function AdBanner({
  variant,
  placement,
  contentLabel,
}: AdBannerProps) {
  // All variants now resolve to in-feed (non-overlay)
  const resolvedVariant: AdVariant = 'in-feed';

  const [isLoaded, setIsLoaded] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);

  // Lazy loading simulation - initialize when "near viewport"
  useEffect(() => {
    const nearViewportTimer = setTimeout(() => {
      setIsNearViewport(true);
    }, 300);
    return () => clearTimeout(nearViewportTimer);
  }, []);

  // Shimmer skeleton loader - show for 1.5s before revealing ad content (Anti-CLS)
  useEffect(() => {
    if (!isNearViewport) return;
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);
    return () => clearTimeout(loadTimer);
  }, [isNearViewport]);

  const getLabel = (): string => {
    if (contentLabel) return contentLabel;
    return 'In-Feed Sponsored Content';
  };

  // Web platform renders AdSense div containers
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, styles.bufferMargin]} nativeID="adsense-in-feed">
        <View style={styles.borderWrapper}>
          <SponsoredLabel />
          <WebAdSenseContainer variant={resolvedVariant} nativeID="ad-slot-in-feed" />
        </View>
      </View>
    );
  }

  // Native platform - standard in-feed placement
  return (
    <View style={[styles.container, styles.bufferMargin]}>
      <View style={styles.borderWrapper}>
        {!isNearViewport || !isLoaded ? (
          <ChampagneShimmerSkeleton height={90} />
        ) : (
          <AdContentPlaceholder label={getLabel()} />
        )}
      </View>
    </View>
  );
}


// ─── Standard In-Feed Ad Export ───────────────────────────────────────────────

export function InFeedAd({ contentLabel }: { contentLabel?: string }) {
  return <AdBanner variant="in-feed" contentLabel={contentLabel} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  bufferMargin: {
    marginVertical: Spacing.lg,
    marginHorizontal: Spacing.md,
  },
  borderWrapper: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    backgroundColor: Colors.obsidian,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shimmerContainer: {
    overflow: 'hidden',
    borderRadius: BorderRadius.md,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonLines: {
    paddingHorizontal: Spacing.lg,
    width: '100%',
  },
  skeletonLine: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(247, 231, 206, 0.08)',
  },
  sponsoredLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.xs,
  },
  sponsoredLabelText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  infoIconWrapper: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    top: 20,
    left: -60,
    width: 180,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.titaniumBorder,
    padding: Spacing.sm,
    zIndex: 200,
  },
  tooltipText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    lineHeight: 14,
  },
  adContentInner: {
    paddingBottom: Spacing.md,
  },
  adBodyContainer: {
    marginTop: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  adBodyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  adBodyText: {
    color: Colors.champagneGold,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  webAdSenseSlot: {
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  webAdSenseText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
});
