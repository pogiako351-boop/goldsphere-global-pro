import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  highlight?: boolean;
  goldBorder?: boolean;
}

export default function GlassmorphicCard({ children, style, highlight, goldBorder }: GlassmorphicCardProps) {
  const hasBorder = highlight || goldBorder;
  return (
    <View style={[styles.container, hasBorder && styles.highlightBorder, style]}>
      {/* Inner glow border */}
      {hasBorder && <View style={styles.innerGlow} />}
      <LinearGradient
        colors={
          highlight
            ? ['rgba(212, 175, 55, 0.14)', 'rgba(212, 175, 55, 0.03)']
            : ['rgba(255, 255, 255, 0.09)', 'rgba(255, 255, 255, 0.02)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    // Enhanced shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  highlightBorder: {
    borderColor: 'rgba(212, 175, 55, 0.35)',
    shadowColor: 'rgba(212, 175, 55, 0.2)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.25)',
    zIndex: 1,
  },
  gradient: {
    padding: Spacing.lg,
  },
});
