import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

type AdPlacement = 'top' | 'mid' | 'bottom';

interface AdBannerProps {
  placement?: AdPlacement;
}

const AD_LABELS: Record<AdPlacement, string> = {
  top: 'ads-top',
  mid: 'ads-mid',
  bottom: 'ads-bottom',
};

const AD_DESCRIPTIONS: Record<AdPlacement, string> = {
  top: 'Top Banner Ad',
  mid: 'In-Feed / Article Ad',
  bottom: 'Sticky Footer Ad',
};

export default function AdBanner({ placement = 'mid' }: AdBannerProps) {
  const adId = AD_LABELS[placement];
  const adDesc = AD_DESCRIPTIONS[placement];

  // On web, render an AdSense-compatible container
  if (Platform.OS === 'web') {
    return (
      <View
        style={[styles.container, placement === 'bottom' && styles.stickyBottom]}
        nativeID={adId}
        accessibilityLabel={adDesc}
      >
        <View style={styles.adContent}>
          <View style={styles.adLabel}>
            <Text style={styles.adLabelText}>AD</Text>
          </View>
          <Text style={styles.adPlaceholder}>{adDesc}</Text>
        </View>
      </View>
    );
  }

  // On native, render a placeholder
  return (
    <View style={styles.container}>
      <View style={styles.adContent}>
        <View style={styles.adLabel}>
          <Text style={styles.adLabelText}>AD</Text>
        </View>
        <Text style={styles.adPlaceholder}>{adDesc}</Text>
      </View>
    </View>
  );
}

// Sticky footer ad component
export function StickyFooterAd() {
  return (
    <View style={styles.stickyFooterContainer}>
      <AdBanner placement="bottom" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    overflow: 'hidden',
    minHeight: 60,
  },
  stickyBottom: {
    marginVertical: 0,
    borderRadius: 0,
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  adLabel: {
    backgroundColor: Colors.textMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adLabelText: {
    color: Colors.black,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  adPlaceholder: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  stickyFooterContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
