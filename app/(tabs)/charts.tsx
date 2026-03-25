import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleLineChart from '@/components/SimpleLineChart';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import AdBanner from '@/components/AdBanner';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { generateHistoricalData, goldPrices } from '@/constants/goldData';

const TIME_RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '1Y', days: 365 },
];

const METALS = [
  { label: '24K', karat: '24k' },
  { label: '22K', karat: '22k' },
  { label: '18K', karat: '18k' },
  { label: '14K', karat: '14k' },
];

export default function ChartsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedRange, setSelectedRange] = useState(0);
  const [selectedMetal, setSelectedMetal] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const chartData = useMemo(() => {
    const days = TIME_RANGES[selectedRange].days;
    const data = generateHistoricalData(days);
    const metalPrice = goldPrices[selectedMetal];
    const factor = metalPrice.pricePerGram / 77.82;

    return data.map((d) => ({
      date: d.date,
      price: Math.round(d.price * factor * 100) / 100,
    }));
  }, [selectedRange, selectedMetal]);

  const firstPrice = chartData[0]?.price || 0;
  const lastPrice = chartData[chartData.length - 1]?.price || 0;
  const periodChange = lastPrice - firstPrice;
  const periodChangePercent = firstPrice > 0 ? (periodChange / firstPrice) * 100 : 0;
  const highPrice = Math.max(...chartData.map((d) => d.price));
  const lowPrice = Math.min(...chartData.map((d) => d.price));

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
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="analytics" size={28} color={Colors.gold} />
          <View>
            <Text style={styles.headerTitle}>Price Charts</Text>
            <Text style={styles.headerSubtitle}>HISTORICAL TRENDS</Text>
          </View>
        </View>

        {/* Metal Selector */}
        <View style={styles.metalSelector}>
          {METALS.map((metal, index) => {
            const isSelected = selectedMetal === index;
            return (
              <TouchableOpacity
                key={metal.karat}
                style={[styles.metalBtn, isSelected && styles.metalBtnSelected]}
                onPress={() => setSelectedMetal(index)}
                activeOpacity={0.7}
              >
                <Text style={[styles.metalBtnText, isSelected && styles.metalBtnTextSelected]}>
                  {metal.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Current Price Summary */}
        <GlassmorphicCard highlight style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryKarat}>
              {METALS[selectedMetal].label} Gold
            </Text>
            <View style={[styles.changeBadge, { backgroundColor: periodChange >= 0 ? 'rgba(0, 200, 83, 0.15)' : 'rgba(255, 23, 68, 0.15)' }]}>
              <Ionicons
                name={periodChange >= 0 ? 'trending-up' : 'trending-down'}
                size={14}
                color={periodChange >= 0 ? Colors.green : Colors.red}
              />
              <Text style={[styles.changeBadgeText, { color: periodChange >= 0 ? Colors.green : Colors.red }]}>
                {periodChange >= 0 ? '+' : ''}{periodChangePercent.toFixed(2)}%
              </Text>
            </View>
          </View>
          <Text style={styles.summaryPrice}>
            ${lastPrice.toFixed(2)} <Text style={styles.summaryUnit}>/gram</Text>
          </Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Period High</Text>
              <Text style={[styles.statValue, { color: Colors.green }]}>${highPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Period Low</Text>
              <Text style={[styles.statValue, { color: Colors.red }]}>${lowPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Change</Text>
              <Text style={[styles.statValue, { color: periodChange >= 0 ? Colors.green : Colors.red }]}>
                {periodChange >= 0 ? '+' : ''}${periodChange.toFixed(2)}
              </Text>
            </View>
          </View>
        </GlassmorphicCard>

        {/* Time Range Selector */}
        <View style={styles.rangeSelector}>
          {TIME_RANGES.map((range, index) => {
            const isSelected = selectedRange === index;
            return (
              <TouchableOpacity
                key={range.label}
                style={[styles.rangeBtn, isSelected && styles.rangeBtnSelected]}
                onPress={() => setSelectedRange(index)}
                activeOpacity={0.7}
              >
                <Text style={[styles.rangeBtnText, isSelected && styles.rangeBtnTextSelected]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Chart */}
        <GlassmorphicCard style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            {METALS[selectedMetal].label} Gold — {TIME_RANGES[selectedRange].label} Trend
          </Text>
          <View style={styles.chartHint}>
            <Ionicons name="finger-print-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.chartHintText}>Touch & drag to see specific prices</Text>
          </View>
          <SimpleLineChart
            data={chartData}
            width={screenWidth - 72}
            height={240}
            accentColor={Colors.gold}
          />
        </GlassmorphicCard>

        {/* Ad Banner */}
        <AdBanner placement="mid" />

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '300',
    color: Colors.gold,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 3,
  },
  metalSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  metalBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  metalBtnSelected: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  metalBtnText: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  metalBtnTextSelected: {
    color: Colors.gold,
  },
  summaryCard: {
    marginBottom: Spacing.xl,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryKarat: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeBadgeText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  summaryPrice: {
    fontSize: FontSizes.display,
    fontWeight: '700',
    color: Colors.goldLight,
    marginBottom: Spacing.lg,
  },
  summaryUnit: {
    fontSize: FontSizes.lg,
    fontWeight: '300',
    color: Colors.textMuted,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
  statValue: {
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  rangeSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  rangeBtnSelected: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  rangeBtnText: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  rangeBtnTextSelected: {
    color: Colors.gold,
  },
  chartCard: {
    marginBottom: Spacing.xl,
  },
  chartTitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  chartHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  chartHintText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
});
