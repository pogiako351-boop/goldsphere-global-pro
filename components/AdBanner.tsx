import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

// ─── Constants ───────────────────────────────────────────────────────────────

const ADSENSE_PUB_ID = 'ca-pub-7498656720223965';
const AD_CONTAINER_VERTICAL_PADDING = 32;

// ─── Types ────────────────────────────────────────────────────────────────────

type AdVariant = 'in-feed';

interface AdBannerProps {
  variant?: AdVariant;
  /** Legacy placement prop for backward compatibility */
  placement?: string;
  /** Custom ad content label for testing/placeholder */
  contentLabel?: string;
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
      <Text style={styles.sponsoredLabelText}>Sponsored</Text>
      <AdInfoIcon />
    </View>
  );
}

// ─── Ad Loading Placeholder ──────────────────────────────────────────────────

function AdLoadingPlaceholder() {
  return (
    <View style={styles.loadingPlaceholder}>
      <SponsoredLabel />
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

function WebAdSenseContainer() {
  return (
    <View nativeID="adsense-ad-slot" style={styles.webAdSenseSlot}>
      <Text style={styles.webAdSenseText}>
        Ad Unit ({ADSENSE_PUB_ID})
      </Text>
    </View>
  );
}

// ─── Main AdBanner Component ──────────────────────────────────────────────────

export default function AdBanner({
  variant,
  placement,
  contentLabel,
}: AdBannerProps) {
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
      <View style={styles.container} nativeID="adsense-in-feed">
        <View style={styles.borderWrapper}>
          {!isLoaded ? (
            <AdLoadingPlaceholder />
          ) : (
            <>
              <SponsoredLabel />
              <WebAdSenseContainer />
            </>
          )}
        </View>
      </View>
    );
  }

  // Native platform - standard in-feed placement
  return (
    <View style={styles.container}>
      <View style={styles.borderWrapper}>
        {!isNearViewport || !isLoaded ? (
          <AdLoadingPlaceholder />
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
    paddingVertical: AD_CONTAINER_VERTICAL_PADDING,
    marginHorizontal: Spacing.md,
  },
  borderWrapper: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingPlaceholder: {
    backgroundColor: '#1A1A1A',
    minHeight: 90,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
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
    fontWeight: '500',
    letterSpacing: 0.8,
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
