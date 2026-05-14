import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

interface PWASplashScreenProps {
  onFinish: () => void;
}

/**
 * Custom web splash screen that shows the gold sphere logo
 * centered on an obsidian field for a seamless transition into the dashboard.
 * Only renders on web in standalone (PWA) mode.
 */
export default function PWASplashScreen({ onFinish }: PWASplashScreenProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate logo in
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Hold for a moment, then fade out
      setTimeout(() => {
        Animated.timing(fadeOutAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }, 1200);
    });
  }, [scaleAnim, opacityAnim, fadeOutAnim, onFinish]);

  if (Platform.OS !== 'web') return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeOutAnim }]}>
      <LinearGradient
        colors={['#0B0B0F', '#0F0F14', '#0B0B0F']}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle radial glow behind logo */}
      <View style={styles.glowOuter} />
      <View style={styles.glowInner} />

      {/* Gold sphere logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Image
          source={require('../assets/images/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Subtle gold accent line */}
      <Animated.View style={[styles.accentLine, { opacity: opacityAnim }]}>
        <LinearGradient
          colors={['transparent', 'rgba(212,175,55,0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentGradient}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.carbonBlack,
  },
  glowOuter: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(212, 175, 55, 0.03)',
  },
  glowInner: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  logoContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  accentLine: {
    position: 'absolute',
    bottom: '30%',
    width: '60%',
    height: 1,
  },
  accentGradient: {
    flex: 1,
  },
});
