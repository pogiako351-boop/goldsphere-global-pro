import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface GoldShimmerProps {
  width: number;
  height: number;
  style?: ViewStyle;
}

export default function GoldShimmer({ width, height, style }: GoldShimmerProps) {
  const translateX = useSharedValue(-width);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width * 2, {
        duration: 2500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[{ width, height, overflow: 'hidden', borderRadius: 8 }, style]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(212, 175, 55, 0.05)' }]} />
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(212, 175, 55, 0.15)',
            'rgba(255, 215, 0, 0.25)',
            'rgba(212, 175, 55, 0.15)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: width * 0.6, height: '100%' }}
        />
      </Animated.View>
    </View>
  );
}
