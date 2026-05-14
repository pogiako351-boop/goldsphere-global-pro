import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
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

// Conflict-event overlay data points
interface ConflictEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  impact: 'bullish' | 'bearish' | 'neutral';
  icon: string;
}

const CONFLICT_EVENTS: ConflictEvent[] = [
  {
    id: 'ce1',
    date: '2025-10-15',
    title: 'Middle East Escalation',
    description:
      'Renewed military tensions in the Middle East drove safe-haven demand sharply higher. Gold surged as investors sought protection from geopolitical risk.',
    impact: 'bullish',
    icon: '⚡',
  },
  {
    id: 'ce2',
    date: '2025-11-02',
    title: 'Fed Rate Decision',
    description:
      'The US Federal Reserve held rates steady, citing persistent inflation. Dollar weakness followed, providing a tailwind for gold prices.',
    impact: 'bullish',
    icon: '🏦',
  },
  {
    id: 'ce3',
    date: '2025-12-20',
    title: 'Ceasefire Agreement',
    description:
      'A surprise ceasefire in Eastern Europe reduced geopolitical risk premium. Gold retreated as risk appetite improved globally.',
    impact: 'bearish',
    icon: '🕊️',
  },
  {
    id: 'ce4',
    date: '2026-01-10',
    title: 'Central Bank Gold Buying',
    description:
      'Multiple central banks announced significant gold purchases totaling over 200 tonnes, underscoring institutional confidence in gold.',
    impact: 'bullish',
    icon: '🏛️',
  },
  {
    id: 'ce5',
    date: '2026-02-28',
    title: 'Sanctions Expansion',
    description:
      'Expanded sanctions on major oil producers accelerated de-dollarization trends, pushing global gold demand to multi-year highs.',
    impact: 'bullish',
    icon: '🌍',
  },
  {
    id: 'ce6',
    date: '2026-03-15',
    title: 'Inflation Report',
    description:
      'Better-than-expected US inflation data sparked a risk-on rally. Gold temporarily dipped as real yields rose on rate expectations.',
    impact: 'bearish',
    icon: '📊',
  },
];

export default function ChartsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedRange, setSelectedRange] = useState(0);
  const [selectedMetal, setSelectedMetal] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<ConflictEvent | null>(null);
  const [showEvents, setShowEvents] = useState(true);
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

  // Filter events relevant to the current time range
  const visibleEvents = useMemo(() => {
    if (!showEvents) return [];
    const days = TIME_RANGES[selectedRange].days;
    const now = new Date();
    const rangeStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return CONFLICT_EVENTS.filter((e) => {
      const eventDate = new Date(e.date);
      return eventDate >= rangeStart && eventDate <= now;
    });
  }, [selectedRange, showEvents]);

  const firstPrice = chartData[0]?.price || 0;
  const lastPrice = chartData[chartData.length - 1]?.price || 0;
  const periodChange = lastPrice - firstPrice;
  const periodChangePercent = firstPrice > 0 ? (periodChange / firstPrice) * 100 : 0;
  const highPrice = Math.max(...chartData.map((d) => d.price));
  const lowPrice = Math.min(...chartData.map((d) => d.price));

  const handleEventPress = useCallback((event: ConflictEvent) => {
    setSelectedEvent(event);
  }, []);

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
            <View style={[
              styles.changeBadge,
              { backgroundColor: periodChange >= 0 ? 'rgba(0, 200, 83, 0.15)' : 'rgba(255, 23, 68, 0.15)' },
            ]}>
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
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>
              {METALS[selectedMetal].label} Gold — {TIME_RANGES[selectedRange].label} Trend
            </Text>
            <TouchableOpacity
              onPress={() => setShowEvents((v) => !v)}
              style={[styles.eventToggle, showEvents && styles.eventToggleActive]}
              activeOpacity={0.7}
            >
              <Ionicons name="flag" size={12} color={showEvents ? Colors.gold : Colors.textMuted} />
              <Text style={[styles.eventToggleText, showEvents && styles.eventToggleTextActive]}>
                Events
              </Text>
            </TouchableOpacity>
          </View>
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

          {/* Glowing line caption */}
          <View style={styles.glowCaption}>
            <View style={[styles.glowDot, { backgroundColor: periodChange >= 0 ? Colors.green : Colors.red }]} />
            <Text style={styles.glowCaptionText}>
              {periodChange >= 0 ? '↑ Uptrend' : '↓ Downtrend'} over {TIME_RANGES[selectedRange].label}
            </Text>
          </View>
        </GlassmorphicCard>

        {/* Conflict-Event Overlays */}
        {visibleEvents.length > 0 && showEvents && (
          <View style={styles.eventsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.eventsDot} />
              <Text style={styles.sectionTitle}>GLOBAL EVENTS IMPACT</Text>
              <View style={styles.sectionLine} />
            </View>
            <Text style={styles.eventsSubtitle}>
              Tap any event to understand its market impact
            </Text>
            {visibleEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => handleEventPress(event)}
                activeOpacity={0.7}
              >
                <GlassmorphicCard
                  style={styles.eventCard}
                  highlight={event.impact === 'bullish'}
                >
                  <View style={styles.eventRow}>
                    <View style={[
                      styles.eventIconContainer,
                      {
                        backgroundColor: event.impact === 'bullish'
                          ? 'rgba(0,200,83,0.12)'
                          : event.impact === 'bearish'
                          ? 'rgba(255,23,68,0.12)'
                          : 'rgba(212,175,55,0.12)',
                      },
                    ]}>
                      <Text style={styles.eventIconText}>{event.icon}</Text>
                    </View>
                    <View style={styles.eventContent}>
                      <View style={styles.eventMeta}>
                        <Text style={styles.eventDate}>{event.date}</Text>
                        <View style={[
                          styles.impactBadge,
                          {
                            backgroundColor: event.impact === 'bullish'
                              ? 'rgba(0,200,83,0.15)'
                              : event.impact === 'bearish'
                              ? 'rgba(255,23,68,0.15)'
                              : 'rgba(212,175,55,0.15)',
                          },
                        ]}>
                          <Text style={[
                            styles.impactText,
                            {
                              color: event.impact === 'bullish'
                                ? Colors.green
                                : event.impact === 'bearish'
                                ? Colors.red
                                : Colors.gold,
                            },
                          ]}>
                            {event.impact.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                    </View>
                    <Ionicons name="information-circle-outline" size={18} color={Colors.textMuted} />
                  </View>
                </GlassmorphicCard>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Ad Banner */}
        <AdBanner placement="mid" />

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Event Detail Modal */}
      <Modal
        visible={selectedEvent !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedEvent(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedEvent(null)}
        >
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['rgba(26,26,26,0.98)', 'rgba(10,10,10,0.99)']}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                styles.modalBorder,
                {
                  borderColor: selectedEvent?.impact === 'bullish'
                    ? 'rgba(0,200,83,0.4)'
                    : selectedEvent?.impact === 'bearish'
                    ? 'rgba(255,23,68,0.4)'
                    : 'rgba(212,175,55,0.4)',
                },
              ]}
            />
            {selectedEvent && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalIcon}>{selectedEvent.icon}</Text>
                  <View style={styles.modalHeaderText}>
                    <Text style={styles.modalDate}>{selectedEvent.date}</Text>
                    <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedEvent(null)}
                    style={styles.modalClose}
                  >
                    <Ionicons name="close" size={20} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalDivider} />
                <Text style={styles.modalDescription}>{selectedEvent.description}</Text>
                <View style={[
                  styles.modalImpactRow,
                  {
                    backgroundColor: selectedEvent.impact === 'bullish'
                      ? 'rgba(0,200,83,0.08)'
                      : 'rgba(255,23,68,0.08)',
                  },
                ]}>
                  <Ionicons
                    name={selectedEvent.impact === 'bullish' ? 'trending-up' : 'trending-down'}
                    size={18}
                    color={selectedEvent.impact === 'bullish' ? Colors.green : Colors.red}
                  />
                  <Text style={[
                    styles.modalImpactText,
                    { color: selectedEvent.impact === 'bullish' ? Colors.green : Colors.red },
                  ]}>
                    {selectedEvent.impact === 'bullish'
                      ? 'Bullish impact on gold prices'
                      : selectedEvent.impact === 'bearish'
                      ? 'Bearish impact on gold prices'
                      : 'Neutral market impact'}
                  </Text>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  chartTitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    flex: 1,
  },
  eventToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  eventToggleActive: {
    borderColor: 'rgba(212,175,55,0.4)',
    backgroundColor: 'rgba(212,175,55,0.08)',
  },
  eventToggleText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  eventToggleTextActive: {
    color: Colors.gold,
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
  glowCaption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  glowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  glowCaptionText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  eventsSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  eventsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
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
  eventsSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginBottom: Spacing.md,
    letterSpacing: 0.3,
  },
  eventCard: {
    marginBottom: Spacing.sm,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventIconText: {
    fontSize: 18,
  },
  eventContent: {
    flex: 1,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  eventDate: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
  impactBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  impactText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  eventTitle: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  modalBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalIcon: {
    fontSize: 28,
  },
  modalHeaderText: {
    flex: 1,
  },
  modalDate: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginBottom: 4,
  },
  modalTitle: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: '600',
    lineHeight: 24,
  },
  modalClose: {
    padding: 4,
  },
  modalDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: Spacing.lg,
  },
  modalDescription: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  modalImpactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  modalImpactText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
