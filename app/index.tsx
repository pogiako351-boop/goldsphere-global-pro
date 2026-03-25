import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const globeRotation = useSharedValue(0);
  const globeScale = useSharedValue(0.3);
  const globeOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.8);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    // Globe entrance animation
    globeOpacity.value = withTiming(1, { duration: 800 });
    globeScale.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.back(1.2)),
    });

    // Continuous globe rotation
    globeRotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );

    // Ring animation
    ringOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    ringScale.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // Title animation
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    titleTranslateY.value = withDelay(
      600,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) })
    );

    // Tagline animation
    taglineOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }));

    // Navigate to main app after splash
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const globeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: globeOpacity.value,
    transform: [
      { scale: globeScale.value },
      { rotateY: `${globeRotation.value}deg` },
    ],
  }));

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#000000', '#0A0A0A', '#111111', '#0A0A0A', '#000000']}
      style={styles.container}
    >
      {/* Decorative background elements */}
      <View style={styles.bgDecorations}>
        <View style={[styles.bgCircle, styles.bgCircle1]} />
        <View style={[styles.bgCircle, styles.bgCircle2]} />
        <View style={[styles.bgCircle, styles.bgCircle3]} />
      </View>

      {/* Globe section */}
      <View style={styles.globeContainer}>
        {/* Outer ring */}
        <Animated.View style={[styles.outerRing, ringAnimatedStyle]}>
          <LinearGradient
            colors={['rgba(212, 175, 55, 0.4)', 'rgba(212, 175, 55, 0.05)', 'rgba(212, 175, 55, 0.4)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.outerRingGradient}
          />
        </Animated.View>

        {/* Globe */}
        <Animated.View style={[styles.globe, globeAnimatedStyle]}>
          <LinearGradient
            colors={[Colors.goldLight, Colors.gold, Colors.goldDark, '#8B6914']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.globeGradient}
          >
            {/* Globe grid lines */}
            <View style={styles.globeLines}>
              <View style={[styles.meridian, styles.meridian1]} />
              <View style={[styles.meridian, styles.meridian2]} />
              <View style={[styles.meridian, styles.meridian3]} />
              <View style={[styles.equator, styles.equator1]} />
              <View style={[styles.equator, styles.equator2]} />
              <View style={[styles.equator, styles.equator3]} />
            </View>
            {/* Globe shine */}
            <LinearGradient
              colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'transparent']}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={styles.globeShine}
            />
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Title */}
      <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
        <Text style={styles.titleGold}>GoldSphere</Text>
        <Text style={styles.titleWhite}>Global Pro</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineContainer, taglineAnimatedStyle]}>
        <View style={styles.taglineLine} />
        <Text style={styles.tagline}>Track Live Gold Prices Worldwide</Text>
        <View style={styles.taglineLine} />
      </Animated.View>

      {/* Bottom decoration */}
      <Animated.View style={[styles.bottomDeco, taglineAnimatedStyle]}>
        <Text style={styles.poweredBy}>FREE MARKET DATA</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const GLOBE_SIZE = 140;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgDecorations: {
    ...StyleSheet.absoluteFillObject,
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.06)',
  },
  bgCircle1: {
    width: width * 1.5,
    height: width * 1.5,
    top: -width * 0.3,
    left: -width * 0.25,
  },
  bgCircle2: {
    width: width * 0.8,
    height: width * 0.8,
    bottom: -width * 0.2,
    right: -width * 0.2,
  },
  bgCircle3: {
    width: width * 0.5,
    height: width * 0.5,
    top: height * 0.15,
    right: -width * 0.1,
  },
  globeContainer: {
    width: GLOBE_SIZE + 40,
    height: GLOBE_SIZE + 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  outerRing: {
    position: 'absolute',
    width: GLOBE_SIZE + 36,
    height: GLOBE_SIZE + 36,
    borderRadius: (GLOBE_SIZE + 36) / 2,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  outerRingGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: (GLOBE_SIZE + 36) / 2,
    opacity: 0.15,
  },
  globe: {
    width: GLOBE_SIZE,
    height: GLOBE_SIZE,
    borderRadius: GLOBE_SIZE / 2,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  globeGradient: {
    flex: 1,
    borderRadius: GLOBE_SIZE / 2,
  },
  globeLines: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meridian: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: GLOBE_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(139, 105, 20, 0.35)',
  },
  meridian1: {
    transform: [{ scaleX: 0.3 }],
  },
  meridian2: {
    transform: [{ scaleX: 0.6 }],
  },
  meridian3: {
    transform: [{ scaleX: 0.85 }],
  },
  equator: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(139, 105, 20, 0.35)',
  },
  equator1: {
    top: '30%',
  },
  equator2: {
    top: '50%',
  },
  equator3: {
    top: '70%',
  },
  globeShine: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: GLOBE_SIZE / 2,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titleGold: {
    fontSize: 42,
    fontWeight: '300',
    color: Colors.gold,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  titleWhite: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 12,
    textTransform: 'uppercase',
    marginTop: -2,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  taglineLine: {
    width: 30,
    height: 1,
    backgroundColor: Colors.goldMuted,
    opacity: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  bottomDeco: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  poweredBy: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 4,
  },
});
