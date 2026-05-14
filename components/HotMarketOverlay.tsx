import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTextGeneration } from '@fastshot/ai';
import { Colors, FontSizes, Spacing, BorderRadius, Gradients } from '@/constants/theme';

interface HotMarketOverlayProps {
  visible: boolean;
  priceVelocity: number; // percentage change
  currentPrice: number;
  onDismiss: () => void;
}

export default function HotMarketOverlay({
  visible,
  priceVelocity,
  currentPrice,
  onDismiss,
}: HotMarketOverlayProps) {
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const { generateText, isLoading } = useTextGeneration();

  useEffect(() => {
    if (visible) {
      // Slide in from top
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }).start();

      // Pulse the glow
      const glowLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
          Animated.timing(glowAnim, { toValue: 0.3, duration: 1500, useNativeDriver: false }),
        ])
      );
      glowLoop.start();

      // Pulse CTA
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.02, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      pulseLoop.start();

      // Generate AI summary
      fetchAISummary();

      return () => {
        glowLoop.stop();
        pulseLoop.stop();
      };
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const fetchAISummary = async () => {
    const direction = priceVelocity > 0 ? 'surging upward' : 'dropping sharply';
    const prompt = `You are an elite gold market analyst. Gold price is ${direction} with a velocity of ${Math.abs(priceVelocity).toFixed(2)}% in the last hour. Current price: $${currentPrice.toFixed(2)}/gram.

Provide a 2-sentence ultra-concise "Alpha Signal" brief explaining the likely cause and whether this represents a buying or hedging opportunity. Use confident, professional language suitable for high-net-worth investors.`;

    const result = await generateText(prompt);
    if (result) {
      setAiSummary(result);
    }
  };

  const borderGlow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 215, 0, 0.3)', 'rgba(255, 215, 0, 0.7)'],
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Animated.View style={[styles.borderGlow, { borderColor: borderGlow }]}>
        <LinearGradient
          colors={Gradients.hotMarket}
          style={styles.gradient}
        >
          {/* Hot Market Badge */}
          <View style={styles.badgeRow}>
            <View style={styles.hotBadge}>
              <Ionicons name="flame" size={14} color="#FF6B00" />
              <Text style={styles.hotBadgeText}>ALPHA SIGNAL</Text>
            </View>
            <TouchableOpacity onPress={onDismiss} style={styles.dismissBtn}>
              <Ionicons name="close" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Velocity Indicator */}
          <View style={styles.velocityRow}>
            <Ionicons
              name={priceVelocity > 0 ? 'rocket' : 'arrow-down-circle'}
              size={24}
              color={priceVelocity > 0 ? Colors.green : Colors.red}
            />
            <View style={styles.velocityInfo}>
              <Text style={styles.velocityTitle}>
                {priceVelocity > 0 ? 'Price Surge Detected' : 'Sharp Decline Detected'}
              </Text>
              <Text style={[styles.velocityValue, { color: priceVelocity > 0 ? Colors.green : Colors.red }]}>
                {priceVelocity > 0 ? '+' : ''}{priceVelocity.toFixed(2)}% velocity
              </Text>
            </View>
          </View>

          {/* AI Summary */}
          <View style={styles.aiSection}>
            {isLoading ? (
              <View style={styles.aiLoading}>
                <Ionicons name="sparkles" size={14} color={Colors.gold} />
                <Text style={styles.aiLoadingText}>Analyzing market signal...</Text>
              </View>
            ) : aiSummary ? (
              <View style={styles.aiContent}>
                <View style={styles.aiHeader}>
                  <Ionicons name="sparkles" size={12} color={Colors.gold} />
                  <Text style={styles.aiLabel}>AI SIGNAL BRIEF</Text>
                </View>
                <Text style={styles.aiText}>{aiSummary}</Text>
              </View>
            ) : null}
          </View>

          {/* CTA to Vault */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={styles.vaultCta}
              onPress={() => {
                onDismiss();
                router.push('/digital-vault');
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(212,175,55,0.3)', 'rgba(212,175,55,0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.vaultCtaGradient}
              >
                <Ionicons name="shield-checkmark" size={18} color={Colors.gold} />
                <Text style={styles.vaultCtaText}>Secure in Digital Vault</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.gold} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  borderGlow: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  gradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  hotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 107, 0, 0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.3)',
  },
  hotBadgeText: {
    color: '#FF6B00',
    fontSize: FontSizes.xs,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  dismissBtn: {
    padding: 4,
  },
  velocityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  velocityInfo: {
    flex: 1,
  },
  velocityTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  velocityValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginTop: 2,
  },
  aiSection: {
    marginBottom: Spacing.md,
  },
  aiLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: 'rgba(212,175,55,0.06)',
    borderRadius: BorderRadius.sm,
  },
  aiLoadingText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontStyle: 'italic',
  },
  aiContent: {
    padding: Spacing.md,
    backgroundColor: 'rgba(212,175,55,0.06)',
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.gold,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  aiLabel: {
    color: Colors.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  aiText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  vaultCta: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
    overflow: 'hidden',
  },
  vaultCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  vaultCtaText: {
    color: Colors.champagneGold,
    fontSize: FontSizes.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
