import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '@/constants/theme';

interface GoldShimmerProps {
  width: number;
  height: number;
  style?: ViewStyle;
  /** Periodic shimmer that fires every interval (ms). Default continuous. */
  periodic?: boolean;
  /** Delay before shimmer starts in ms */
  delay?: number;
}

export default function GoldShimmer({ width, height, style, periodic, delay = 0 }: GoldShimmerProps) {
  const translateX = useSharedValue(-width);

  useEffect(() => {
    if (periodic) {
      // Periodic shimmer: sweep then pause
      translateX.value = withDelay(
        delay,
        withRepeat(
          withTiming(width * 2, {
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          false
        )
      );
    } else {
      translateX.value = withDelay(
        delay,
        withRepeat(
          withTiming(width * 2, {
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          false
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, periodic]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[{ width, height, overflow: 'hidden', borderRadius: 8 }, style]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(212, 175, 55, 0.04)' }]} />
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={Gradients.goldShimmer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: width * 0.6, height: '100%' }}
        />
      </Animated.View>
    </View>
  );
}

/** Full-width CTA shimmer overlay that periodically passes over a button */
export function CTAShimmerOverlay({ width, height }: { width: number; height: number }) {
  const translateX = useSharedValue(-width);

  useEffect(() => {
    // Start with delay, then repeat every 4 seconds
    translateX.value = withDelay(
      2000,
      withRepeat(
        withTiming(width * 2, {
          duration: 1200,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: 12 }]} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(247, 231, 206, 0.15)',
            'rgba(255, 215, 0, 0.3)',
            'rgba(247, 231, 206, 0.15)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: width * 0.4, height: '100%' }}
        />
      </Animated.View>
    </View>
  );
}
