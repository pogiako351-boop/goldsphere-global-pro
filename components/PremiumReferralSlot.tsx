import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

type ReferralTier = 'bullion-storage' | 'wealth-management' | 'secure-vault' | 'private-banking';

interface PremiumReferralSlotProps {
  /** Contextual trigger: high weight calculations show premium vault ads */
  calculatedValue?: number;
  placement: 'top' | 'mid' | 'bottom';
}

const REFERRAL_DATA: Record<ReferralTier, { title: string; subtitle: string; icon: string; gradient: [string, string] }> = {
  'bullion-storage': {
    title: 'High-Security Bullion Storage',
    subtitle: 'Swiss vault-grade protection for physical gold holdings',
    icon: 'lock-closed',
    gradient: ['rgba(201, 169, 78, 0.15)', 'rgba(138, 138, 154, 0.05)'],
  },
  'wealth-management': {
    title: 'Private Wealth Advisory',
    subtitle: 'Dedicated gold portfolio strategist for HNW investors',
    icon: 'diamond',
    gradient: ['rgba(138, 138, 154, 0.12)', 'rgba(212, 175, 55, 0.05)'],
  },
  'secure-vault': {
    title: 'Allocated Vault Service',
    subtitle: 'Your gold, your vault, your serial numbers. Fully allocated.',
    icon: 'shield-checkmark',
    gradient: ['rgba(212, 175, 55, 0.12)', 'rgba(0, 0, 0, 0.3)'],
  },
  'private-banking': {
    title: 'Gold-Backed Credit Lines',
    subtitle: 'Leverage your bullion without selling. Ultra-low rates.',
    icon: 'card',
    gradient: ['rgba(247, 231, 206, 0.1)', 'rgba(138, 138, 154, 0.05)'],
  },
};

function selectReferral(calculatedValue?: number, placement?: string): ReferralTier {
  if (calculatedValue && calculatedValue > 50000) return 'wealth-management';
  if (calculatedValue && calculatedValue > 10000) return 'bullion-storage';
  if (placement === 'top') return 'secure-vault';
  if (placement === 'bottom') return 'private-banking';
  // Rotate based on time
  const tiers: ReferralTier[] = ['bullion-storage', 'wealth-management', 'secure-vault', 'private-banking'];
  const index = Math.floor(Date.now() / 30000) % tiers.length;
  return tiers[index];
}

export default function PremiumReferralSlot({ calculatedValue, placement }: PremiumReferralSlotProps) {
  const tier = selectReferral(calculatedValue, placement);
  const data = REFERRAL_DATA[tier];

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <LinearGradient
        colors={data.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Titanium top accent */}
        <View style={styles.topAccent} />

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name={data.icon as any} size={22} color={Colors.champagneGold} />
          </View>
          <View style={styles.textContent}>
            <View style={styles.tierBadge}>
              <Text style={styles.tierText}>ELITE TIER</Text>
            </View>
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.subtitle}>{data.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.titanium} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.titaniumBorder,
    overflow: 'hidden',
    marginVertical: Spacing.md,
  },
  gradient: {
    position: 'relative',
  },
  topAccent: {
    height: 1,
    backgroundColor: 'rgba(138, 138, 154, 0.3)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(201, 169, 78, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 78, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(138, 138, 154, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    marginBottom: 4,
  },
  tierText: {
    color: Colors.titaniumLight,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    color: Colors.champagneGold,
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    lineHeight: 16,
  },
});
