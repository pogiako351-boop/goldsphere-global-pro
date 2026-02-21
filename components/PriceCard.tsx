import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassmorphicCard from './GlassmorphicCard';
import { Colors, FontSizes, Spacing } from '@/constants/theme';
import { formatCurrency, formatChange, formatPercent, getTimeAgo } from '@/utils/formatters';

interface PriceCardProps {
  label: string;
  karat?: string;
  pricePerGram: number;
  change24h: number;
  changePercent: number;
  isSilver?: boolean;
}

export default function PriceCard({
  label,
  karat,
  pricePerGram,
  change24h,
  changePercent,
  isSilver,
}: PriceCardProps) {
  const isUp = change24h >= 0;
  const trendColor = isUp ? Colors.green : Colors.red;
  const trendIcon = isUp ? 'trending-up' : 'trending-down';

  return (
    <GlassmorphicCard highlight={!isSilver} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.labelRow}>
          {karat && (
            <View style={[styles.karatBadge, isSilver && styles.silverBadge]}>
              <Text style={[styles.karatText, isSilver && styles.silverText]}>{karat}</Text>
            </View>
          )}
          <Text style={styles.label} numberOfLines={1}>{label}</Text>
        </View>
        <View style={[styles.trendBadge, { backgroundColor: `${trendColor}15` }]}>
          <Ionicons name={trendIcon as 'trending-up' | 'trending-down'} size={14} color={trendColor} />
          <Text style={[styles.trendText, { color: trendColor }]}>
            {formatPercent(changePercent)}
          </Text>
        </View>
      </View>

      <View style={styles.priceRow}>
        <Text style={[styles.price, isSilver && styles.silverPrice]}>
          {formatCurrency(pricePerGram, 'USD')}
        </Text>
        <Text style={styles.unit}>/gram</Text>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.changeAmount, { color: trendColor }]}>
          {formatChange(change24h)} USD
        </Text>
        <Text style={styles.updated}>Updated {getTimeAgo()}</Text>
      </View>
    </GlassmorphicCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  karatBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  silverBadge: {
    backgroundColor: 'rgba(192, 192, 192, 0.2)',
  },
  karatText: {
    color: Colors.gold,
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  silverText: {
    color: Colors.silver,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    flex: 1,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  trendText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  price: {
    color: Colors.goldLight,
    fontSize: FontSizes.xxxl,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  silverPrice: {
    color: Colors.silverLight,
  },
  unit: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
    marginLeft: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeAmount: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  updated: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
});
