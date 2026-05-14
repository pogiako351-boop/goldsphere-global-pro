import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
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
  isHighlighted?: boolean;
}

export default function PriceCard({
  label,
  karat,
  pricePerGram,
  change24h,
  changePercent,
  isSilver,
  isHighlighted,
}: PriceCardProps) {
  const isUp = change24h >= 0;
  const trendColor = isUp ? Colors.green : Colors.red;
  const trendIcon = isUp ? 'trending-up' : 'trending-down';

  // Pulse animation for price movement
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const prevPriceRef = useRef(pricePerGram);

  useEffect(() => {
    if (prevPriceRef.current !== pricePerGram) {
      prevPriceRef.current = pricePerGram;

      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    }
  }, [pricePerGram, pulseAnim, glowAnim]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 0.6,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      isUp ? 'rgba(0,230,118,0)' : 'rgba(255,23,68,0)',
      isUp ? 'rgba(0,230,118,0.12)' : 'rgba(255,23,68,0.12)',
    ],
  });

  return (
    <GlassmorphicCard highlight={!isSilver || isHighlighted} titaniumBorder={isSilver} style={styles.card}>
      <Animated.View
        style={[
          styles.glowOverlay,
          { backgroundColor: glowColor },
        ]}
      />
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

      <Animated.View
        style={[styles.priceRow, { transform: [{ scale: pulseAnim }] }]}
      >
        <Text style={[styles.price, isSilver && styles.silverPrice]}>
          {formatCurrency(pricePerGram, 'USD')}
        </Text>
        <Text style={styles.unit}>/gram</Text>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.changeRow}>
          <Ionicons
            name={isUp ? 'caret-up' : 'caret-down'}
            size={12}
            color={trendColor}
          />
          <Text style={[styles.changeAmount, { color: trendColor }]}>
            {formatChange(change24h)} USD
          </Text>
        </View>
        <Text style={styles.updated}>Updated {getTimeAgo()}</Text>
      </View>
    </GlassmorphicCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
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
    backgroundColor: 'rgba(212, 175, 55, 0.18)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  silverBadge: {
    backgroundColor: 'rgba(192, 192, 192, 0.15)',
    borderColor: 'rgba(192, 192, 192, 0.25)',
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
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  price: {
    color: Colors.champagneGold,
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
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
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
