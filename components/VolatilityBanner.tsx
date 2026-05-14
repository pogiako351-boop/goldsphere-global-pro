import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { VolatilityAlert } from '@/hooks/useVolatilityAlerts';

interface VolatilityBannerProps {
  alert: VolatilityAlert;
  onDismiss: (id: string) => void;
}

export default function VolatilityBanner({ alert, onDismiss }: VolatilityBannerProps) {
  const slideAnim = useRef(new Animated.Value(-80)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, opacityAnim]);

  const isUp = alert.direction === 'up';
  const color = isUp ? Colors.green : Colors.red;
  const bgStart = isUp ? 'rgba(0,200,83,0.2)' : 'rgba(255,23,68,0.2)';
  const bgEnd = isUp ? 'rgba(0,200,83,0.05)' : 'rgba(255,23,68,0.05)';

  const magnitudeLabel = {
    moderate: '⚡ VOLATILITY ALERT',
    high: '🔥 HIGH VOLATILITY',
    extreme: '🚨 EXTREME MOVEMENT',
  }[alert.magnitude];

  const metalName = alert.metal === 'gold' ? 'Gold' : 'Silver';
  const absPercent = Math.abs(alert.changePercent);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <LinearGradient
        colors={[bgStart, bgEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.banner, { borderColor: `${color}40` }]}
      >
        <View style={[styles.accentBar, { backgroundColor: color }]} />
        <View style={styles.content}>
          <Text style={[styles.label, { color }]}>{magnitudeLabel}</Text>
          <Text style={styles.message}>
            {metalName} has moved {isUp ? '↑' : '↓'} {absPercent.toFixed(2)}% in 24h
          </Text>
        </View>
        <TouchableOpacity
          style={styles.dismissBtn}
          onPress={() => onDismiss(alert.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    gap: Spacing.sm,
  },
  accentBar: {
    width: 3,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    paddingVertical: Spacing.sm,
    gap: 2,
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  message: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  dismissBtn: {
    padding: Spacing.md,
    paddingLeft: 0,
  },
});
