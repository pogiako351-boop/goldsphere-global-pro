import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  highlight?: boolean;
  goldBorder?: boolean;
  titaniumBorder?: boolean;
  vaultStyle?: boolean;
}

export default function GlassmorphicCard({
  children,
  style,
  highlight,
  goldBorder,
  titaniumBorder,
  vaultStyle,
}: GlassmorphicCardProps) {
  const hasBorder = highlight || goldBorder;
  const isTitanium = titaniumBorder;
  const isVault = vaultStyle;

  return (
    <View
      style={[
        styles.container,
        hasBorder && styles.highlightBorder,
        isTitanium && styles.titaniumBorder,
        isVault && styles.vaultBorder,
        style,
      ]}
    >
      {/* Inner glow border */}
      {hasBorder && <View style={styles.innerGlow} />}
      {isTitanium && <View style={styles.titaniumInnerGlow} />}
      {isVault && <View style={styles.vaultInnerGlow} />}
      <LinearGradient
        colors={
          isVault
            ? ['rgba(201, 169, 78, 0.12)', 'rgba(15, 15, 20, 0.95)']
            : highlight
            ? ['rgba(212, 175, 55, 0.1)', 'rgba(15, 15, 20, 0.6)']
            : isTitanium
            ? ['rgba(138, 138, 154, 0.08)', 'rgba(15, 15, 20, 0.6)']
            : ['rgba(255, 255, 255, 0.06)', 'rgba(15, 15, 20, 0.4)']
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
    backgroundColor: Colors.obsidian,
    // Enhanced shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  highlightBorder: {
    borderColor: 'rgba(212, 175, 55, 0.3)',
    shadowColor: 'rgba(212, 175, 55, 0.15)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  titaniumBorder: {
    borderColor: Colors.titaniumBorder,
    shadowColor: 'rgba(138, 138, 154, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  vaultBorder: {
    borderColor: Colors.vaultBorder,
    borderWidth: 1.5,
    shadowColor: 'rgba(201, 169, 78, 0.2)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    zIndex: 1,
  },
  titaniumInnerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(138, 138, 154, 0.3)',
    zIndex: 1,
  },
  vaultInnerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(201, 169, 78, 0.35)',
    zIndex: 1,
  },
  gradient: {
    padding: Spacing.lg,
  },
});
