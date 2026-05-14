import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { CTAShimmerOverlay } from '@/components/GoldShimmer';

interface SmartInstallBannerProps {
  visible: boolean;
  onDismiss: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SmartInstallBanner({ visible, onDismiss }: SmartInstallBannerProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Capture the beforeinstallprompt event
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Animate in/out
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsVisible(false);
      });
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Use the native install prompt if available
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
    onDismiss();
  };

  const handleDismiss = () => {
    onDismiss();
  };

  if (!isVisible || Platform.OS !== 'web') return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        { opacity: fadeAnim },
      ]}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleDismiss}
      />
      <Animated.View
        style={[
          styles.panel,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Glassmorphic background */}
        <View style={styles.glassContainer}>
          {Platform.OS === 'web' ? (
            <View style={styles.glassBackground} />
          ) : (
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          )}

          {/* Top drag indicator */}
          <View style={styles.dragIndicator} />

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['rgba(212,175,55,0.25)', 'rgba(184,134,11,0.15)']}
              style={styles.iconGradient}
            >
              <Ionicons name="download-outline" size={32} color={Colors.champagneGold} />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.title}>Instant Market Access</Text>
          <Text style={styles.subtitle}>
            Install GoldSphere for a seamless full-screen experience with instant launch from your home screen.
          </Text>

          {/* Benefits */}
          <View style={styles.benefitsRow}>
            <View style={styles.benefitItem}>
              <Ionicons name="flash" size={14} color={Colors.gold} />
              <Text style={styles.benefitText}>Instant Launch</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="notifications" size={14} color={Colors.gold} />
              <Text style={styles.benefitText}>Price Alerts</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="cloud-offline" size={14} color={Colors.gold} />
              <Text style={styles.benefitText}>Offline Mode</Text>
            </View>
          </View>

          {/* Champagne Gold shimmer install button */}
          <TouchableOpacity
            style={styles.installBtn}
            onPress={handleInstall}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#F7E7CE', '#D4AF37', '#C9A94E', '#B8860B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.installGradient}
            >
              <Ionicons name="add-circle" size={22} color={Colors.carbonBlack} />
              <Text style={styles.installBtnText}>
                Add to Home Screen for Instant Market Access
              </Text>
              <CTAShimmerOverlay width={SCREEN_WIDTH - 64} height={60} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Dismiss link */}
          <TouchableOpacity onPress={handleDismiss} style={styles.dismissLink}>
            <Text style={styles.dismissText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  panel: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  glassContainer: {
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
    position: 'relative',
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 15, 20, 0.92)',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }
      : {}),
  } as any,
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(138, 138, 154, 0.4)',
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
  closeBtn: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(138, 138, 154, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.champagneGold,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },
  benefitsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  benefitText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  installBtn: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  installGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    position: 'relative',
  },
  installBtnText: {
    color: Colors.carbonBlack,
    fontSize: FontSizes.md,
    fontWeight: '800',
    letterSpacing: 0.3,
    textAlign: 'center',
    flex: 1,
  },
  dismissLink: {
    alignSelf: 'center',
    paddingVertical: Spacing.sm,
  },
  dismissText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
});
