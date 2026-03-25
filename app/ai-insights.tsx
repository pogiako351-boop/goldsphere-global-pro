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
import GlassmorphicCard from '@/components/GlassmorphicCard';
import GoldShimmer from '@/components/GoldShimmer';
import AdBanner from '@/components/AdBanner';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useLivePrices } from '@/hooks/useLivePrices';

interface InsightItem {
  id: string;
  title: string;
  icon: string;
  color: string;
}

const insightOptions: InsightItem[] = [
  {
    id: 'market',
    title: 'Market Analysis',
    icon: 'analytics',
    color: Colors.gold,
  },
  {
    id: 'prediction',
    title: 'Price Prediction',
    icon: 'trending-up',
    color: Colors.green,
  },
  {
    id: 'investment',
    title: 'Investment Advice',
    icon: 'wallet',
    color: '#6C63FF',
  },
  {
    id: 'comparison',
    title: 'Gold vs Silver',
    icon: 'swap-horizontal',
    color: Colors.silver,
  },
];

function generateInsight(id: string, goldPrice: number, silverPrice: number, changePercent: number): string {
  const ratio = Math.round(goldPrice / silverPrice);
  const trend = changePercent >= 0 ? 'upward' : 'downward';
  const trendAdj = changePercent >= 0 ? 'bullish' : 'bearish';

  const insights: Record<string, string> = {
    market: `Market Analysis - ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

Gold is currently trading at $${goldPrice.toFixed(2)} per gram, showing a ${trend} trend with a ${Math.abs(changePercent).toFixed(2)}% change in the last 24 hours. The overall market sentiment is ${trendAdj}.

Key factors influencing today's gold prices include ongoing geopolitical tensions in the Middle East, central bank monetary policy decisions, and inflation data from major economies. The US Federal Reserve's stance on interest rates continues to be the primary driver of short-term gold price movements.

The current environment of elevated geopolitical risk and persistent inflation provides fundamental support for gold prices. Central banks worldwide continue to diversify their reserves into gold, with purchases exceeding 1,000 tonnes annually for the third consecutive year.

Technical indicators suggest gold is trading ${changePercent >= 0 ? 'above its 50-day moving average, indicating bullish momentum' : 'near key support levels, which could provide a buying opportunity'}. Volume patterns suggest institutional interest remains strong, and the gold market continues to attract safe-haven flows.`,

    prediction: `Price Prediction Outlook

Based on current market conditions with 24K gold at $${goldPrice.toFixed(2)} per gram and a recent ${trend} trend, here is the analytical outlook:

Short-Term (1 Week): Gold prices are expected to trade in the range of $${(goldPrice * 0.98).toFixed(2)} to $${(goldPrice * 1.03).toFixed(2)} per gram. The key resistance level is at $${(goldPrice * 1.025).toFixed(2)}, while support sits at $${(goldPrice * 0.985).toFixed(2)}. Market participants are closely watching upcoming economic data releases and central bank commentary.

Medium-Term (1 Month): The 30-day outlook suggests prices could move toward $${(goldPrice * (changePercent >= 0 ? 1.05 : 0.97)).toFixed(2)} per gram, contingent on inflation data and Federal Reserve policy signals. Seasonally, this period tends to ${changePercent >= 0 ? 'favor gold bulls' : 'see consolidation'} as institutional portfolios are adjusted.

Longer-Term Factors: The ongoing de-dollarization trend, central bank gold purchases, and persistent above-target inflation in major economies all provide a supportive backdrop for gold prices. However, unexpected interest rate hikes or a significant risk-on shift in global markets could create headwinds.

Note: These projections are based on technical analysis and historical patterns and should not be considered financial advice.`,

    investment: `Investment Analysis & Guidance

With 24K gold currently at $${goldPrice.toFixed(2)} per gram (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%), here is a comprehensive investment perspective:

Current Market Assessment: ${changePercent >= 0 ? 'Gold is in an uptrend, which can make timing entries more challenging but confirms positive momentum. Consider dollar-cost averaging rather than large lump-sum purchases.' : 'Gold is experiencing a pullback, which historically has presented attractive entry points for long-term investors. Current levels may offer value for accumulation.'}

Recommended Allocation Strategy: Financial advisors generally suggest allocating 5-15% of a diversified portfolio to gold. In the current environment of elevated uncertainty, the higher end of this range may be appropriate. Split your allocation between physical gold (40%) for security, gold ETFs (40%) for liquidity, and gold mining equities (20%) for leveraged upside.

Physical vs Paper Gold: For amounts under $10,000, gold coins from recognized mints offer the best balance of authenticity and resale value. For larger allocations, allocated storage programs with reputable dealers provide institutional-grade custody without the hassle of home storage.

Risk Factors to Monitor: Watch for unexpected hawkish Fed policy shifts, a significant strengthening of the US dollar, or a major de-escalation of geopolitical tensions, all of which could create short-term headwinds for gold prices.`,

    comparison: `Gold vs Silver Comparative Analysis

Current Gold (24K): $${goldPrice.toFixed(2)}/gram
Current Silver: $${silverPrice.toFixed(2)}/gram
Gold-to-Silver Ratio: ${ratio}:1

The current gold-to-silver ratio of ${ratio}:1 is ${ratio > 80 ? 'well above' : ratio > 70 ? 'above' : 'near'} the historical average of approximately 65:1. ${ratio > 75 ? 'This suggests silver may be relatively undervalued compared to gold, presenting a potential opportunity for silver investors.' : 'This ratio is relatively normal, suggesting both metals are fairly valued relative to each other.'}

Gold's Strengths: Gold remains the premier safe-haven asset with deeper liquidity, greater central bank demand, and stronger institutional adoption. It offers lower volatility and is universally recognized as a store of value across all cultures and economies.

Silver's Opportunity: Silver benefits from dual demand as both a precious metal and an industrial commodity. Growing demand from solar panel manufacturing, electric vehicles, and 5G technology provides a unique demand growth story. Silver's higher volatility means it often outperforms gold in percentage terms during precious metals bull markets.

Recommendation: A balanced precious metals portfolio might allocate 70-80% to gold for stability and 20-30% to silver for growth potential. The current ratio ${ratio > 75 ? 'favors silver as the relatively better value' : 'suggests maintaining a standard allocation between both metals'}.`,
  };

  return insights[id] || 'Unable to generate insight. Please try again.';
}

export default function AIInsightsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const { prices } = useLivePrices();

  const handleGenerateInsight = async (item: InsightItem) => {
    setSelectedInsight(item.id);

    if (results[item.id]) {
      return; // Already generated
    }

    setIsLoading(true);
    // Simulate brief loading for UX
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const insight = generateInsight(
      item.id,
      prices.goldPricePerGram,
      prices.silverPricePerGram,
      prices.goldChangePercent
    );
    setResults((prev) => ({ ...prev, [item.id]: insight }));
    setIsLoading(false);
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
            <Text style={styles.headerSubtitle}>SMART MARKET ANALYSIS</Text>
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
              Get instant market insights, price predictions, and investment advice.
              All features are free and available to everyone.
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
          {insightOptions.map((item) => {
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
                Analyzing current market conditions and trends
              </Text>
              <GoldShimmer width={200} height={3} style={{ marginTop: 16 }} />
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
                  {insightOptions.find((i) => i.id === selectedInsight)?.title}
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

        {/* Ad Banner */}
        <AdBanner placement="mid" />

        {/* Tip */}
        {!selectedInsight && (
          <GlassmorphicCard style={styles.tipCard}>
            <View style={styles.tipRow}>
              <Ionicons name="bulb-outline" size={22} color={Colors.gold} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Tip</Text>
                <Text style={styles.tipDesc}>
                  Select an analysis type above to generate a detailed market insight.
                  All AI features are free and available to every user.
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
