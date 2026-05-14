import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GlassmorphicCard from './GlassmorphicCard';
import { Colors, FontSizes, Spacing, BorderRadius, Gradients } from '@/constants/theme';
import { formatCurrency, formatChange, formatPercent, getTimeAgo } from '@/utils/formatters';

interface TradeGateProps {
  label: string;
  karat?: string;
  pricePerGram: number;
  change24h: number;
  changePercent: number;
  isSilver?: boolean;
  isHighlighted?: boolean;
  onBuy?: () => void;
  onSell?: () => void;
}

export default function TradeGate({
  label,
  karat,
  pricePerGram,
  change24h,
  changePercent,
  isSilver,
  isHighlighted,
  onBuy,
  onSell,
}: TradeGateProps) {
  const isUp = change24h >= 0;
  const trendColor = isUp ? Colors.green : Colors.red;
  const trendIcon = isUp ? 'trending-up' : 'trending-down';

  // Pulse animation for price movement
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const prevPriceRef = useRef(pricePerGram);

  // Shimmer animation for Trade Gate borders
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Periodic shimmer on highlighted cards
    if (isHighlighted) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
          Animated.timing(shimmerAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
          Animated.delay(3000),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [isHighlighted, shimmerAnim]);

  useEffect(() => {
    if (prevPriceRef.current !== pricePerGram) {
      prevPriceRef.current = pricePerGram;

      // Haptic-style pulse animation
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 120,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    }
  }, [pricePerGram, pulseAnim, glowAnim]);

  // Mount animation
  useEffect(() => {
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 600,
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

  const borderGlow = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(212,175,55,0.3)', 'rgba(247,231,206,0.5)'],
  });

  const handleBuy = useCallback(() => {
    // Haptic feedback simulation via quick scale
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.97, duration: 50, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onBuy?.();
  }, [onBuy, pulseAnim]);

  const handleSell = useCallback(() => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.97, duration: 50, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onSell?.();
  }, [onSell, pulseAnim]);

  return (
    <Animated.View style={[styles.wrapper, isHighlighted && { borderColor: borderGlow }]}>
      <GlassmorphicCard
        highlight={!isSilver || isHighlighted}
        titaniumBorder={isSilver}
        style={styles.card}
      >
        <Animated.View
          style={[styles.glowOverlay, { backgroundColor: glowColor }]}
        />

        {/* Gate Header */}
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

        {/* Price Display */}
        <Animated.View style={[styles.priceRow, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={[styles.price, isSilver && styles.silverPrice]}>
            {formatCurrency(pricePerGram, 'USD')}
          </Text>
          <Text style={styles.unit}>/gram</Text>
        </Animated.View>

        {/* Change Footer */}
        <View style={styles.changeRow}>
          <View style={styles.changeLeft}>
            <Ionicons
              name={isUp ? 'caret-up' : 'caret-down'}
              size={11}
              color={trendColor}
            />
            <Text style={[styles.changeAmount, { color: trendColor }]}>
              {formatChange(change24h)} USD
            </Text>
          </View>
          <Text style={styles.updated}>Updated {getTimeAgo()}</Text>
        </View>

        {/* Trade Gate Buttons */}
        <View style={styles.tradeGateRow}>
          <TouchableOpacity
            style={styles.buyGate}
            onPress={handleBuy}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={Gradients.tradeGateBuy}
              style={styles.gateGradient}
            >
              <Ionicons name="add-circle" size={16} color={Colors.green} />
              <Text style={styles.buyText}>BUY</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.gateDivider} />

          <TouchableOpacity
            style={styles.sellGate}
            onPress={handleSell}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={Gradients.tradeGateSell}
              style={styles.gateGradient}
            >
              <Ionicons name="remove-circle" size={16} color={Colors.red} />
              <Text style={styles.sellText}>SELL</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </GlassmorphicCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 0,
  },
  card: {
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
    paddingVertical: 3,
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
    letterSpacing: 0.5,
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
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  changeLeft: {
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
  tradeGateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(138, 138, 154, 0.15)',
    marginTop: Spacing.xs,
    paddingTop: Spacing.md,
    marginHorizontal: -Spacing.xs,
  },
  buyGate: {
    flex: 1,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  sellGate: {
    flex: 1,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  gateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  gateDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(138, 138, 154, 0.2)',
    marginHorizontal: Spacing.sm,
  },
  buyText: {
    color: Colors.green,
    fontSize: FontSizes.sm,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  sellText: {
    color: Colors.red,
    fontSize: FontSizes.sm,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
