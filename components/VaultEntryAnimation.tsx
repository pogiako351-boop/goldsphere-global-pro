import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VaultEntryAnimationProps {
  visible: boolean;
  grams: number;
  karat: string;
  onComplete: () => void;
}

export default function VaultEntryAnimation({
  visible,
  grams,
  karat,
  onComplete,
}: VaultEntryAnimationProps) {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const coinScale = useRef(new Animated.Value(0.3)).current;
  const coinTranslateY = useRef(new Animated.Value(-100)).current;
  const coinOpacity = useRef(new Animated.Value(0)).current;
  const vaultScale = useRef(new Animated.Value(0.8)).current;
  const vaultGlow = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const shieldRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Phase 1: Show overlay + vault door opens
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(vaultScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Phase 2: Gold coin drops into vault
        Animated.parallel([
          Animated.timing(coinOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.spring(coinScale, {
            toValue: 1,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(coinTranslateY, {
            toValue: 40,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Phase 3: Vault glow + secure confirmation
          Animated.parallel([
            Animated.timing(vaultGlow, { toValue: 1, duration: 400, useNativeDriver: false }),
            Animated.timing(coinOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.spring(checkScale, {
              toValue: 1,
              tension: 100,
              friction: 5,
              delay: 200,
              useNativeDriver: true,
            }),
            Animated.timing(shieldRotate, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Phase 4: Auto dismiss
            setTimeout(() => {
              Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }).start(() => {
                // Reset all values
                coinScale.setValue(0.3);
                coinTranslateY.setValue(-100);
                coinOpacity.setValue(0);
                vaultScale.setValue(0.8);
                vaultGlow.setValue(0);
                checkScale.setValue(0);
                shieldRotate.setValue(0);
                onComplete();
              });
            }, 1200);
          });
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const glowColor = vaultGlow.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(212,175,55,0)', 'rgba(212,175,55,0.3)'],
  });

  const rotateZ = shieldRotate.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '-5deg', '0deg'],
  });

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
      <LinearGradient
        colors={['rgba(0,0,0,0.9)', 'rgba(15,15,20,0.95)', 'rgba(0,0,0,0.9)']}
        style={StyleSheet.absoluteFill}
      />

      {/* Vault Container */}
      <Animated.View
        style={[
          styles.vaultContainer,
          { transform: [{ scale: vaultScale }] },
        ]}
      >
        {/* Gold Glow */}
        <Animated.View style={[styles.vaultGlow, { backgroundColor: glowColor }]} />

        {/* Vault Icon / Door */}
        <Animated.View style={[styles.vaultIcon, { transform: [{ rotateZ }] }]}>
          <LinearGradient
            colors={['rgba(212,175,55,0.2)', 'rgba(201,169,78,0.08)']}
            style={styles.vaultIconGradient}
          >
            <Ionicons name="shield-checkmark" size={56} color={Colors.gold} />
          </LinearGradient>
        </Animated.View>

        {/* Falling Gold Coin */}
        <Animated.View
          style={[
            styles.goldCoin,
            {
              opacity: coinOpacity,
              transform: [
                { scale: coinScale },
                { translateY: coinTranslateY },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#FFD700', '#D4AF37', '#B8860B']}
            style={styles.coinGradient}
          >
            <Text style={styles.coinText}>{karat.toUpperCase()}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Success Checkmark */}
        <Animated.View
          style={[
            styles.checkContainer,
            { transform: [{ scale: checkScale }] },
          ]}
        >
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={32} color={Colors.carbonBlack} />
          </View>
        </Animated.View>
      </Animated.View>

      {/* Deposit Info */}
      <Animated.View style={[styles.depositInfo, { opacity: coinOpacity }]}>
        <Text style={styles.depositTitle}>Securing Deposit</Text>
        <Text style={styles.depositDetails}>
          {grams.toFixed(3)}g {karat.toUpperCase()} Gold
        </Text>
      </Animated.View>

      {/* Success Message */}
      <Animated.View style={[styles.successInfo, { transform: [{ scale: checkScale }] }]}>
        <Text style={styles.successTitle}>Vault Entry Confirmed</Text>
        <Text style={styles.successDetails}>
          {grams.toFixed(3)}g secured in your Digital Vault
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaultContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  vaultGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  vaultIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(212,175,55,0.4)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaultIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldCoin: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  coinGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  coinText: {
    color: Colors.carbonBlack,
    fontSize: FontSizes.sm,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  checkContainer: {
    position: 'absolute',
  },
  checkCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositInfo: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  depositTitle: {
    color: Colors.champagneGold,
    fontSize: FontSizes.lg,
    fontWeight: '600',
    letterSpacing: 1,
  },
  depositDetails: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
    marginTop: 4,
  },
  successInfo: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.3,
    alignItems: 'center',
  },
  successTitle: {
    color: Colors.green,
    fontSize: FontSizes.xl,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  successDetails: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    marginTop: 4,
  },
});
