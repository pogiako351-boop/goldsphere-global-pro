import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

interface LockInCountdownProps {
  active: boolean;
  lockedPrice: number;
  onExpire: () => void;
  duration?: number; // in seconds, default 60
}

export default function LockInCountdown({
  active,
  lockedPrice,
  onExpire,
  duration = 60,
}: LockInCountdownProps) {
  const [seconds, setSeconds] = useState(duration);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const urgencyAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      setSeconds(duration);
      progressAnim.setValue(1);
      return;
    }

    setSeconds(duration);

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: duration * 1000,
      useNativeDriver: false,
    }).start();

    // Countdown
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, duration]);

  // Urgency pulse when under 15 seconds
  useEffect(() => {
    if (active && seconds <= 15 && seconds > 0) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.02, duration: 300, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ])
      );
      loop.start();

      Animated.timing(urgencyAnim, { toValue: 1, duration: 500, useNativeDriver: false }).start();

      return () => loop.stop();
    }
  }, [active, seconds, pulseAnim, urgencyAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const urgencyColor = urgencyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(212,175,55,0.3)', 'rgba(255,23,68,0.4)'],
  });

  const barColor = seconds <= 15 ? Colors.red : seconds <= 30 ? '#FFA500' : Colors.gold;

  if (!active) return null;

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
      <Animated.View style={[styles.borderHighlight, { borderColor: urgencyColor }]}>
        <LinearGradient
          colors={['rgba(212,175,55,0.12)', 'rgba(15,15,20,0.95)']}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={12} color={Colors.gold} />
              <Text style={styles.lockBadgeText}>PRICE LOCKED</Text>
            </View>
            <View style={styles.timerBadge}>
              <Ionicons name="time" size={12} color={seconds <= 15 ? Colors.red : Colors.gold} />
              <Text style={[styles.timerText, seconds <= 15 && { color: Colors.red }]}>
                {minutes}:{secs.toString().padStart(2, '0')}
              </Text>
            </View>
          </View>

          {/* Locked Price */}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Locked at</Text>
            <Text style={styles.priceValue}>${lockedPrice.toFixed(2)}<Text style={styles.priceUnit}>/g</Text></Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth, backgroundColor: barColor }]} />
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            {seconds <= 15
              ? 'Hurry! Price lock expiring soon'
              : 'Complete your vault entry before timer expires'}
          </Text>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  borderHighlight: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  gradient: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212,175,55,0.12)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)',
  },
  lockBadgeText: {
    color: Colors.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
  },
  timerText: {
    color: Colors.gold,
    fontSize: FontSizes.lg,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  priceLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
  priceValue: {
    color: Colors.champagneGold,
    fontSize: FontSizes.xxl,
    fontWeight: '700',
  },
  priceUnit: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
    fontWeight: '400',
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  footer: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    textAlign: 'center',
  },
});
