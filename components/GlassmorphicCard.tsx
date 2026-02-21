import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  highlight?: boolean;
}

export default function GlassmorphicCard({ children, style, highlight }: GlassmorphicCardProps) {
  return (
    <View style={[styles.container, highlight && styles.highlightBorder, style]}>
      <LinearGradient
        colors={
          highlight
            ? ['rgba(212, 175, 55, 0.12)', 'rgba(212, 175, 55, 0.04)']
            : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
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
  },
  highlightBorder: {
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  gradient: {
    padding: Spacing.lg,
  },
});
