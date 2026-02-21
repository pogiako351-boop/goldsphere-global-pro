import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTextGeneration } from '@fastshot/ai';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import GoldShimmer from '@/components/GoldShimmer';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { goldPrices, silverPrice } from '@/constants/goldData';

interface InsightItem {
  id: string;
  title: string;
  prompt: string;
  icon: string;
  color: string;
}

const insightPrompts: InsightItem[] = [
  {
    id: 'market',
    title: 'Market Analysis',
    prompt: `As a gold market analyst, provide a brief market analysis for gold prices today. Current prices: 24K gold at $${goldPrices[0].pricePerGram}/g (${goldPrices[0].changePercent > 0 ? '+' : ''}${goldPrices[0].changePercent}% change), 22K at $${goldPrices[1].pricePerGram}/g, Silver at $${silverPrice.pricePerGram}/g. Include: 1) Current market sentiment 2) Key factors affecting prices 3) Short-term outlook. Keep it concise and professional (3-4 paragraphs).`,
    icon: 'analytics',
    color: Colors.gold,
  },
  {
    id: 'prediction',
    title: 'Price Prediction',
    prompt: `As a gold market expert, provide a price prediction outlook for gold in the next week and month. Current 24K gold price is $${goldPrices[0].pricePerGram}/g with a recent ${goldPrices[0].changePercent > 0 ? 'upward' : 'downward'} trend. Consider: global economic conditions, inflation data, central bank policies, and geopolitical factors. Provide specific price range predictions. Keep it concise (3-4 paragraphs).`,
    icon: 'trending-up',
    color: Colors.green,
  },
  {
    id: 'investment',
    title: 'Investment Advice',
    prompt: `As a gold investment advisor, provide actionable investment advice for gold investors today. Current 24K gold is at $${goldPrices[0].pricePerGram}/g. Address: 1) Is now a good time to buy? 2) Recommended allocation strategy 3) Physical vs paper gold considerations 4) Risk factors to watch. Keep it practical and concise (3-4 paragraphs).`,
    icon: 'wallet',
    color: '#6C63FF',
  },
  {
    id: 'comparison',
    title: 'Gold vs Silver',
    prompt: `As a precious metals analyst, compare gold and silver as investments right now. Current prices: Gold (24K) at $${goldPrices[0].pricePerGram}/g, Silver at $${silverPrice.pricePerGram}/g. The gold-to-silver ratio is approximately ${Math.round(goldPrices[0].pricePerGram / silverPrice.pricePerGram)}:1. Discuss: 1) Which offers better value currently? 2) Historical context of the ratio 3) Recommendation. Keep concise (3-4 paragraphs).`,
    icon: 'swap-horizontal',
    color: Colors.silver,
  },
];

export default function AIInsightsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});
  const scrollRef = useRef<ScrollView>(null);

  const { generateText, isLoading, error, reset } = useTextGeneration({
    onSuccess: (response: string) => {
      if (selectedInsight) {
        setResults((prev) => ({ ...prev, [selectedInsight]: response }));
      }
    },
    onError: (err: Error) => {
      console.error('AI generation error:', err.message);
    },
  });

  const handleGenerateInsight = async (item: InsightItem) => {
    setSelectedInsight(item.id);
    reset();
    await generateText(item.prompt);
  };

  const activeResult = selectedInsight ? results[selectedInsight] : null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#0A0A0A', '#111111']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>AI Insights</Text>
            <Text style={styles.headerSubtitle}>POWERED BY NEWELL AI</Text>
          </View>
          <View style={styles.backBtnPlaceholder} />
        </View>

        {/* Hero */}
        <GlassmorphicCard highlight style={styles.heroCard}>
          <LinearGradient
            colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.02)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroIcon}>
              <Ionicons name="sparkles" size={32} color={Colors.gold} />
            </View>
            <Text style={styles.heroTitle}>AI-Powered Gold Analysis</Text>
            <Text style={styles.heroDesc}>
              Get instant market insights, price predictions, and investment advice
              powered by artificial intelligence.
            </Text>
            <GoldShimmer width={250} height={2} style={{ marginTop: 12, alignSelf: 'center' }} />
          </LinearGradient>
        </GlassmorphicCard>

        {/* Insight Options */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>SELECT ANALYSIS TYPE</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.insightsGrid}>
          {insightPrompts.map((item) => {
            const isActive = selectedInsight === item.id;
            const hasResult = Boolean(results[item.id]);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.insightBtn, isActive && styles.insightBtnActive]}
                onPress={() => handleGenerateInsight(item)}
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={
                    isActive
                      ? ['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.05)']
                      : ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)']
                  }
                  style={styles.insightBtnGradient}
                >
                  <View style={[styles.insightIcon, { backgroundColor: `${item.color}20` }]}>
                    <Ionicons name={item.icon as any} size={22} color={item.color} />
                  </View>
                  <Text style={[styles.insightBtnTitle, isActive && { color: Colors.goldLight }]}>
                    {item.title}
                  </Text>
                  {hasResult && !isActive && (
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={Colors.green} />
                    </View>
                  )}
                  {isActive && isLoading && (
                    <ActivityIndicator size="small" color={Colors.gold} />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Loading State */}
        {isLoading && selectedInsight && (
          <GlassmorphicCard style={styles.loadingCard}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color={Colors.gold} />
              <Text style={styles.loadingTitle}>Generating Analysis...</Text>
              <Text style={styles.loadingDesc}>
                Our AI is analyzing current market conditions and trends
              </Text>
              <GoldShimmer width={200} height={3} style={{ marginTop: 16 }} />
            </View>
          </GlassmorphicCard>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <GlassmorphicCard style={styles.errorCard}>
            <View style={styles.errorContent}>
              <Ionicons name="warning-outline" size={32} color={Colors.red} />
              <Text style={styles.errorTitle}>Analysis Failed</Text>
              <Text style={styles.errorDesc}>{error.message}</Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => {
                  if (selectedInsight) {
                    const item = insightPrompts.find((i) => i.id === selectedInsight);
                    if (item) handleGenerateInsight(item);
                  }
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh" size={18} color={Colors.gold} />
                <Text style={styles.retryBtnText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </GlassmorphicCard>
        )}

        {/* Result */}
        {activeResult && !isLoading && (
          <View style={styles.resultSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="ellipse" size={8} color={Colors.gold} />
              <Text style={styles.sectionTitle}>AI ANALYSIS</Text>
              <View style={styles.sectionLine} />
            </View>

            <GlassmorphicCard highlight style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="sparkles" size={18} color={Colors.gold} />
                <Text style={styles.resultHeaderText}>
                  {insightPrompts.find((i) => i.id === selectedInsight)?.title}
                </Text>
              </View>
              <View style={styles.resultDivider} />
              <Text style={styles.resultText}>{activeResult}</Text>
              <View style={styles.resultFooter}>
                <Ionicons name="shield-checkmark-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.resultDisclaimer}>
                  AI-generated analysis. Not financial advice.
                </Text>
              </View>
            </GlassmorphicCard>
          </View>
        )}

        {/* Premium Upsell */}
        {!selectedInsight && (
          <GlassmorphicCard style={styles.tipCard}>
            <View style={styles.tipRow}>
              <Ionicons name="bulb-outline" size={22} color={Colors.gold} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Pro Tip</Text>
                <Text style={styles.tipDesc}>
                  Premium subscribers get unlimited AI analyses with more detailed
                  insights and real-time data integration.
                </Text>
              </View>
            </View>
          </GlassmorphicCard>
        )}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPlaceholder: {
    width: 40,
  },
  headerCenter: {
    alignItems: 'center',
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
  heroCard: {
    marginBottom: Spacing.xxl,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  heroGradient: {
    margin: -Spacing.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    color: Colors.goldLight,
    fontSize: FontSizes.xl,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  heroDesc: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
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
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  insightBtn: {
    width: '48%',
    flexGrow: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
  },
  insightBtnActive: {
    borderColor: Colors.gold,
  },
  insightBtnGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 110,
    justifyContent: 'center',
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBtnTitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  completedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  loadingCard: {
    marginBottom: Spacing.xl,
  },
  loadingContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  loadingTitle: {
    color: Colors.goldLight,
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  loadingDesc: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  errorCard: {
    marginBottom: Spacing.xl,
    borderColor: 'rgba(255, 23, 68, 0.2)',
  },
  errorContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  errorTitle: {
    color: Colors.red,
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  errorDesc: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.gold,
    marginTop: Spacing.sm,
  },
  retryBtnText: {
    color: Colors.gold,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  resultSection: {
    marginBottom: Spacing.lg,
  },
  resultCard: {
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  resultHeaderText: {
    color: Colors.goldLight,
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  resultDivider: {
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    marginBottom: Spacing.lg,
  },
  resultText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    lineHeight: 24,
  },
  resultFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  resultDisclaimer: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontStyle: 'italic',
  },
  tipCard: {
    marginBottom: Spacing.lg,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: Colors.goldLight,
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipDesc: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
});
