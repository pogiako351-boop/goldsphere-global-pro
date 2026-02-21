import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PriceCard from '@/components/PriceCard';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import AdBanner from '@/components/AdBanner';
import GoldShimmer from '@/components/GoldShimmer';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { goldPrices, silverPrice } from '@/constants/goldData';
import { getCurrentTimestamp } from '@/utils/formatters';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(getCurrentTimestamp());

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(getCurrentTimestamp());
      setRefreshing(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#0A0A0A', '#111111']}
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
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>GoldSphere</Text>
            <Text style={styles.headerSubtitle}>Global Pro</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => router.push('/alerts')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.gold} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => router.push('/premium')}
              activeOpacity={0.7}
            >
              <Ionicons name="diamond-outline" size={22} color={Colors.gold} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Market Status */}
        <GlassmorphicCard style={styles.marketStatusCard}>
          <View style={styles.marketStatusRow}>
            <View style={styles.marketDot} />
            <Text style={styles.marketStatusText}>Markets Open</Text>
            <View style={styles.flex} />
            <Text style={styles.lastUpdatedText}>Last updated: {lastUpdated}</Text>
          </View>
        </GlassmorphicCard>

        {/* Shimmer decoration */}
        <View style={styles.shimmerContainer}>
          <GoldShimmer width={340} height={3} />
        </View>

        {/* Gold Prices Section */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>GOLD PRICES</Text>
          <View style={styles.sectionLine} />
        </View>

        {goldPrices.map((item) => (
          <PriceCard
            key={item.karat}
            label={item.label}
            karat={item.karat.toUpperCase()}
            pricePerGram={item.pricePerGram}
            change24h={item.change24h}
            changePercent={item.changePercent}
          />
        ))}

        {/* Silver Price */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.silver} />
          <Text style={[styles.sectionTitle, { color: Colors.silver }]}>SILVER</Text>
          <View style={[styles.sectionLine, { backgroundColor: 'rgba(192, 192, 192, 0.2)' }]} />
        </View>

        <PriceCard
          label={silverPrice.label}
          karat="AG"
          pricePerGram={silverPrice.pricePerGram}
          change24h={silverPrice.change24h}
          changePercent={silverPrice.changePercent}
          isSilver
        />

        {/* Ad Banner */}
        <AdBanner onUpgrade={() => router.push('/premium')} />

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

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/history')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.12)', 'rgba(212, 175, 55, 0.04)']}
              style={styles.actionGradient}
            >
              <Ionicons name="time" size={28} color={Colors.gold} />
              <Text style={styles.actionLabel}>History</Text>
              <Text style={styles.actionSubLabel}>Past prices</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/ai-insights')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.12)', 'rgba(212, 175, 55, 0.04)']}
              style={styles.actionGradient}
            >
              <Ionicons name="sparkles" size={28} color={Colors.gold} />
              <Text style={styles.actionLabel}>AI Insights</Text>
              <Text style={styles.actionSubLabel}>Smart analysis</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
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
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
  marketStatusText: {
    color: Colors.green,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  lastUpdatedText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
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
    borderColor: Colors.glassBorder,
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
