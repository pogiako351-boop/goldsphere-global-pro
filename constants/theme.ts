export const Colors = {
  // Billionaire-Tier Primary Palette
  gold: '#D4AF37',
  goldLight: '#F5D76E',
  goldDark: '#B8860B',
  goldShimmer: '#FFD700',
  goldMuted: '#C9A94E',
  champagneGold: '#F7E7CE',
  champagneGoldDark: '#D4A845',

  // Carbon Black & Obsidian Depth
  black: '#000000',
  carbonBlack: '#0B0B0F',
  obsidian: '#0F0F14',
  darkBg: '#0A0A0E',
  cardBg: '#141418',
  cardBgLight: '#1C1C22',
  surfaceBg: '#101014',

  // Brushed Titanium
  titanium: '#8A8A9A',
  titaniumLight: '#A8A8B8',
  titaniumBorder: 'rgba(138, 138, 154, 0.3)',

  // Text
  white: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#B8B8C8',
  textMuted: '#6A6A7A',
  textGold: '#D4AF37',

  // Accents
  green: '#00E676',
  greenDark: '#00C853',
  red: '#FF1744',
  redDark: '#D50000',
  silver: '#C0C0C0',
  silverLight: '#E8E8E8',

  // Glassmorphism - Enhanced
  glassWhite: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(138, 138, 154, 0.2)',
  glassHighlight: 'rgba(212, 175, 55, 0.12)',
  glassObsidian: 'rgba(15, 15, 20, 0.85)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.75)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
  overlayGold: 'rgba(212, 175, 55, 0.08)',

  // Vault / Security
  vaultGold: '#C9A94E',
  vaultBorder: 'rgba(201, 169, 78, 0.4)',
  secureGreen: '#00E676',
};

export const Gradients = {
  // Billionaire-tier gradients
  carbonDepth: ['#000000', '#0B0B0F', '#0F0F14'] as [string, string, string],
  obsidianSurface: ['#0F0F14', '#141418', '#1C1C22'] as [string, string, string],
  champagneGold: ['#F7E7CE', '#D4AF37', '#B8860B'] as [string, string, string],
  goldShimmer: ['transparent', 'rgba(247, 231, 206, 0.2)', 'rgba(212, 175, 55, 0.35)', 'rgba(247, 231, 206, 0.2)', 'transparent'] as [string, string, string, string, string],
  vaultEntry: ['rgba(212, 175, 55, 0.25)', 'rgba(201, 169, 78, 0.1)', 'rgba(15, 15, 20, 0.95)'] as [string, string, string],
  titaniumBorder: ['rgba(138, 138, 154, 0.4)', 'rgba(138, 138, 154, 0.1)', 'rgba(138, 138, 154, 0.4)'] as [string, string, string],
  tradeGateBuy: ['rgba(0, 230, 118, 0.15)', 'rgba(0, 200, 83, 0.05)'] as [string, string],
  tradeGateSell: ['rgba(255, 23, 68, 0.15)', 'rgba(213, 0, 0, 0.05)'] as [string, string],
  hotMarket: ['rgba(255, 215, 0, 0.2)', 'rgba(212, 175, 55, 0.08)', 'rgba(0, 0, 0, 0.95)'] as [string, string, string],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  display: 36,
  hero: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};
