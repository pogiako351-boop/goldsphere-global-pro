import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PriceCard from '@/components/PriceCard';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import AdBanner from '@/components/AdBanner';
import GoldShimmer from '@/components/GoldShimmer';
import VolatilityBanner from '@/components/VolatilityBanner';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useLivePrices } from '@/hooks/useLivePrices';
import { useVolatilityAlerts } from '@/hooks/useVolatilityAlerts';
import { useLocalization } from '@/hooks/useLocalization';

const ALL_KARATS = [
  { karat: '24K', label: '24 Karat (99.9%)', factor: 0.999 },
  { karat: '22K', label: '22 Karat (91.7%)', factor: 0.917 },
  { karat: '18K', label: '18 Karat (75.0%)', factor: 0.750 },
  { karat: '14K', label: '14 Karat (58.3%)', factor: 0.583 },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const { prices, refresh } = useLivePrices();
  const { alerts, dismissAlert } = useVolatilityAlerts(prices);
  const { config } = useLocalization();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh().finally(() => setRefreshing(false));
  }, [refresh]);

  // Smart karat ordering based on region
  const karatData = React.useMemo(() => {
    const preferred = config.preferredKarat;
    const sorted = [...ALL_KARATS].sort((a, b) => {
      if (a.karat === preferred) return -1;
      if (b.karat === preferred) return 1;
      return 0;
    });
    return sorted;
  }, [config.preferredKarat]);

  // Header pulse animation
  const headerGlow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(headerGlow, { toValue: 1, duration: 2500, useNativeDriver: false }),
        Animated.timing(headerGlow, { toValue: 0, duration: 2500, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [headerGlow]);

  const headerGlowColor = headerGlow.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(212,175,55,0)', 'rgba(212,175,55,0.08)'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#080808', '#111111']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.gold}
            colors={[Colors.gold]}
          />
        }
      >
        {/* Header */}
        <Animated.View style={[styles.headerContainer, { backgroundColor: headerGlowColor }]}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>GoldSphere</Text>
              <Text style={styles.headerSubtitle}>Global Pro</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.regionBadge}>
                <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
                <Text style={styles.regionText}>{config.region}</Text>
              </View>
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={() => router.push('/alerts')}
                activeOpacity={0.7}
              >
                <Ionicons name="notifications-outline" size={22} color={Colors.gold} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Volatility Alerts */}
        {alerts.length > 0 && (
          <View style={styles.alertsContainer}>
            {alerts.map((alert) => (
              <VolatilityBanner
                key={alert.id}
                alert={alert}
                onDismiss={dismissAlert}
              />
            ))}
          </View>
        )}

        {/* Top Ad Banner */}
        <AdBanner placement="top" />

        {/* Market Status */}
        <GlassmorphicCard style={styles.marketStatusCard}>
          <View style={styles.marketStatusRow}>
            <View style={[styles.marketDot, !prices.isLive && styles.marketDotOffline]} />
            <Text style={[styles.marketStatusText, !prices.isLive && styles.marketStatusTextOffline]}>
              {prices.isLive ? 'Markets Open — Live Data' : 'Using Cached Data'}
            </Text>
            <View style={styles.flex} />
            <TouchableOpacity
              onPress={() => router.push('/digital-vault')}
              style={styles.vaultMiniBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="shield-checkmark" size={13} color={Colors.gold} />
              <Text style={styles.vaultMiniText}>Vault</Text>
            </TouchableOpacity>
          </View>
        </GlassmorphicCard>

        {/* Shimmer decoration */}
        <View style={styles.shimmerContainer}>
          <GoldShimmer width={340} height={2} />
        </View>

        {/* Region-aware karat section header */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>GOLD PRICES (USD)</Text>
          <View style={styles.regionHint}>
            <Text style={styles.regionHintText}>
              {config.preferredKarat} featured for {config.region}
            </Text>
          </View>
          <View style={styles.sectionLine} />
        </View>

        {karatData.map((item, index) => (
          <PriceCard
            key={item.karat}
            label={item.label}
            karat={item.karat}
            pricePerGram={Math.round(prices.goldPricePerGram * item.factor * 100) / 100}
            change24h={Math.round(prices.goldChange24h * item.factor * 100) / 100}
            changePercent={prices.goldChangePercent}
            isHighlighted={index === 0}
          />
        ))}

        {/* Silver Price */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.silver} />
          <Text style={[styles.sectionTitle, { color: Colors.silver }]}>SILVER</Text>
          <View style={[styles.sectionLine, { backgroundColor: 'rgba(192, 192, 192, 0.2)' }]} />
        </View>

        <PriceCard
          label="Silver (99.9%)"
          karat="AG"
          pricePerGram={prices.silverPricePerGram}
          change24h={prices.silverChange24h}
          changePercent={prices.silverChangePercent}
          isSilver
        />

        {/* Mid Ad Banner */}
        <AdBanner placement="mid" />

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/calculator')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.12)', 'rgba(212, 175, 55, 0.04)']}
              style={styles.actionGradient}
            >
              <Ionicons name="calculator" size={28} color={Colors.gold} />
              <Text style={styles.actionLabel}>Calculator</Text>
              <Text style={styles.actionSubLabel}>Convert gold value</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/digital-vault')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.06)']}
              style={styles.actionGradient}
            >
              <Ionicons name="shield-checkmark" size={28} color={Colors.gold} />
              <Text style={styles.actionLabel}>Digital Vault</Text>
              <Text style={styles.actionSubLabel}>Track your gold</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/pro-insights')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.12)', 'rgba(212, 175, 55, 0.04)']}
              style={styles.actionGradient}
            >
              <Ionicons name="sparkles" size={28} color={Colors.gold} />
              <Text style={styles.actionLabel}>Pro Insights</Text>
              <Text style={styles.actionSubLabel}>AI predictions</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/alerts')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.12)', 'rgba(212, 175, 55, 0.04)']}
              style={styles.actionGradient}
            >
              <Ionicons name="notifications" size={28} color={Colors.gold} />
              <Text style={styles.actionLabel}>Alerts</Text>
              <Text style={styles.actionSubLabel}>Set price alerts</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  flex: {
    flex: 1,
  },
  headerContainer: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: '300',
    color: Colors.gold,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 6,
    textTransform: 'uppercase',
    marginTop: -2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  regionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  regionText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertsContainer: {
    marginBottom: Spacing.md,
  },
  marketStatusCard: {
    marginBottom: Spacing.lg,
  },
  marketStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  marketDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
  },
  marketDotOffline: {
    backgroundColor: '#FFA500',
  },
  marketStatusText: {
    color: Colors.green,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  marketStatusTextOffline: {
    color: '#FFA500',
  },
  vaultMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
  },
  vaultMiniText: {
    color: Colors.gold,
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  shimmerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    color: Colors.gold,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 3,
  },
  regionHint: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(212,175,55,0.08)',
  },
  regionHintText: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  actionCard: {
    width: '48%',
    flexGrow: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
    overflow: 'hidden',
  },
  actionGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 110,
    justifyContent: 'center',
  },
  actionLabel: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  actionSubLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
});
