import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

interface AdBannerProps {
  onUpgrade?: () => void;
}

export default function AdBanner({ onUpgrade }: AdBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.adContent}>
        <View style={styles.adLabel}>
          <Text style={styles.adLabelText}>AD</Text>
        </View>
        <View style={styles.adBody}>
          <Ionicons name="sparkles" size={20} color={Colors.gold} />
          <View style={styles.adTextContainer}>
            <Text style={styles.adTitle}>Upgrade to Premium</Text>
            <Text style={styles.adSubtitle}>Remove ads & unlock AI insights</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.upgradeBtn} onPress={onUpgrade} activeOpacity={0.7}>
          <Text style={styles.upgradeBtnText}>Upgrade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    overflow: 'hidden',
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  adBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  adTextContainer: {
    flex: 1,
  },
  adTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  adSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: 1,
  },
  upgradeBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  upgradeBtnText: {
    color: Colors.black,
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
});
