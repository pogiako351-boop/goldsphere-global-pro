import React, { useState, useCallback } from 'react';
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
import { useLivePrices } from '@/hooks/useLivePrices';

interface InsightSection {
  id: string;
  title: string;
  icon: string;
  color: string;
  prompt: (goldPrice: number, silverPrice: number, changePercent: number) => string;
}

const INSIGHT_SECTIONS: InsightSection[] = [
  {
    id: '24h_prediction',
    title: '24-Hour Price Prediction',
    icon: 'trending-up',
    color: Colors.green,
    prompt: (goldPrice, _, changePercent) =>
      `You are a gold market expert. Current 24K gold: $${goldPrice.toFixed(2)}/gram, 24h change: ${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%.

Provide a concise 24-hour gold price prediction with:
1. Expected price range (low to high) per gram
2. Key factors driving the prediction
3. Confidence level (Low/Medium/High)
4. One-sentence recommendation

Keep your response under 150 words. Be specific with price numbers.`,
  },
  {
    id: 'risk_assessment',
    title: 'Risk Assessment',
    icon: 'shield-outline',
    color: '#FF6B35',
    prompt: (goldPrice, silverPrice, changePercent) =>
      `Gold market risk analyst. Current data: Gold $${goldPrice.toFixed(2)}/g (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%), Silver $${silverPrice.toFixed(2)}/g.

Provide a brief risk assessment:
1. Current risk level: Low/Medium/High/Extreme
2. Top 2 downside risks
3. Top 2 upside catalysts
4. Volatility outlook for next 24 hours

Keep response under 120 words.`,
  },
  {
    id: 'central_bank',
    title: 'Central Bank Activity',
    icon: 'business-outline',
    color: '#6C63FF',
    prompt: (goldPrice) =>
      `Gold analyst. 24K gold at $${goldPrice.toFixed(2)}/gram.

Summarize in 100 words:
1. Current central bank gold buying trends in 2026
2. Which countries are the biggest buyers
3. How CB demand is affecting current price
4. Expected CB activity impact over next 30 days`,
  },
  {
    id: 'geopolitical',
    title: 'Geopolitical Impact',
    icon: 'earth-outline',
    color: Colors.gold,
    prompt: (goldPrice, _, changePercent) =>
      `Geopolitical gold analyst. Gold: $${goldPrice.toFixed(2)}/g (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}% today).

In under 120 words, explain:
1. Top 2 active geopolitical events driving gold demand in 2026
2. Safe-haven premium currently priced in (estimate)
3. Scenario: what happens to gold if tensions escalate vs de-escalate
4. Your 1-week directional bias`,
  },
];

interface GeneratedInsight {
  id: string;
  content: string;
  generatedAt: string;
}

export default function ProInsightsScreen() {
  const insets = useSafeAreaInsets();
  const { prices } = useLivePrices();
  const { generateText } = useTextGeneration();
  const [generatedInsights, setGeneratedInsights] = useState<Record<string, GeneratedInsight>>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loadingSection, setLoadingSection] = useState<string | null>(null);

  const handleGenerate = useCallback(
    async (section: InsightSection) => {
      // If already generated, just show it
      if (generatedInsights[section.id]) {
        setActiveSection(section.id);
        return;
      }

      setLoadingSection(section.id);
      setActiveSection(section.id);

      const prompt = section.prompt(
        prices.goldPricePerGram,
        prices.silverPricePerGram,
        prices.goldChangePercent
      );

      const result = await generateText(prompt);
      if (result) {
        setGeneratedInsights((prev) => ({
          ...prev,
          [section.id]: {
            id: section.id,
            content: result,
            generatedAt: new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        }));
      }
      setLoadingSection(null);
    },
    [generateText, generatedInsights, prices]
  );

  const handleGenerateAll = useCallback(async () => {
    for (const section of INSIGHT_SECTIONS) {
      if (!generatedInsights[section.id]) {
        setLoadingSection(section.id);
        setActiveSection(section.id);

        const prompt = section.prompt(
          prices.goldPricePerGram,
          prices.silverPricePerGram,
          prices.goldChangePercent
        );

        const result = await generateText(prompt);
        if (result) {
          setGeneratedInsights((prev) => ({
            ...prev,
            [section.id]: {
              id: section.id,
              content: result,
              generatedAt: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          }));
        }
        setLoadingSection(null);
      }
    }
  }, [generateText, generatedInsights, prices]);

  const isAnyLoading = loadingSection !== null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#0A0A0A', '#111111']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Pro Insights</Text>
            <Text style={styles.headerSubtitle}>AI MARKET INTELLIGENCE</Text>
          </View>
          <View style={styles.backPlaceholder} />
        </View>

        {/* Hero Card */}
        <GlassmorphicCard highlight style={styles.heroCard}>
          <LinearGradient
            colors={['rgba(212,175,55,0.15)', 'rgba(108,99,255,0.08)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroRow}>
              <View style={styles.heroIconContainer}>
                <Ionicons name="sparkles" size={28} color={Colors.gold} />
              </View>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>Newell AI Intelligence</Text>
                <Text style={styles.heroSubtitle}>
                  24-hour predictions, risk analysis & geopolitical impact
                </Text>
              </View>
            </View>
            <GoldShimmer width={280} height={2} style={{ marginTop: Spacing.md, alignSelf: 'center' }} />
            <View style={styles.priceRow}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>24K Gold</Text>
                <Text style={styles.priceValue}>${prices.goldPricePerGram.toFixed(2)}/g</Text>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>24h Change</Text>
                <Text style={[
                  styles.priceValue,
                  { color: prices.goldChangePercent >= 0 ? Colors.green : Colors.red },
                ]}>
                  {prices.goldChangePercent >= 0 ? '+' : ''}
                  {prices.goldChangePercent.toFixed(2)}%
                </Text>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Silver</Text>
                <Text style={styles.priceValue}>${prices.silverPricePerGram.toFixed(2)}/g</Text>
              </View>
            </View>
          </LinearGradient>
        </GlassmorphicCard>

        {/* Generate All button */}
        <TouchableOpacity
          style={[styles.generateAllBtn, isAnyLoading && styles.generateAllBtnDisabled]}
          onPress={handleGenerateAll}
          disabled={isAnyLoading}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={isAnyLoading
              ? ['rgba(212,175,55,0.2)', 'rgba(212,175,55,0.1)']
              : [Colors.goldLight, Colors.gold, Colors.goldDark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.generateAllGradient}
          >
            {isAnyLoading ? (
              <>
                <ActivityIndicator size="small" color={Colors.gold} />
                <Text style={[styles.generateAllText, { color: Colors.gold }]}>
                  Generating insights...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="sparkles" size={18} color={Colors.black} />
                <Text style={styles.generateAllText}>Generate All Insights</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionDot} />
          <Text style={styles.sectionTitle}>SELECT ANALYSIS</Text>
          <View style={styles.sectionLine} />
        </View>

        {/* Insight Cards */}
        {INSIGHT_SECTIONS.map((section) => {
          const insight = generatedInsights[section.id];
          const isThisLoading = loadingSection === section.id;
          const isActive = activeSection === section.id;

          return (
            <View key={section.id}>
              {/* Section button */}
              <TouchableOpacity
                style={[styles.sectionBtn, isActive && styles.sectionBtnActive]}
                onPress={() => handleGenerate(section)}
                disabled={isThisLoading}
                activeOpacity={0.7}
              >
                <View style={[styles.sectionBtnIcon, { backgroundColor: `${section.color}18` }]}>
                  <Ionicons name={section.icon as any} size={22} color={section.color} />
                </View>
                <Text style={[styles.sectionBtnTitle, isActive && { color: Colors.goldLight }]}>
                  {section.title}
                </Text>
                <View style={styles.sectionBtnRight}>
                  {insight && !isThisLoading && (
                    <Ionicons name="checkmark-circle" size={16} color={Colors.green} />
                  )}
                  {isThisLoading && (
                    <ActivityIndicator size="small" color={Colors.gold} />
                  )}
                  {!insight && !isThisLoading && (
                    <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                  )}
                </View>
              </TouchableOpacity>

              {/* Loading state for this section */}
              {isThisLoading && (
                <GlassmorphicCard style={styles.loadingCard}>
                  <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color={section.color} />
                    <Text style={[styles.loadingTitle, { color: section.color }]}>
                      Analyzing market data...
                    </Text>
                    <Text style={styles.loadingSubtitle}>
                      Newell AI is processing {section.title.toLowerCase()}
                    </Text>
                    <GoldShimmer width={160} height={2} style={{ marginTop: Spacing.sm }} />
                  </View>
                </GlassmorphicCard>
              )}

              {/* Generated insight content */}
              {insight && isActive && !isThisLoading && (
                <GlassmorphicCard highlight style={styles.insightCard}>
                  <View style={styles.insightHeader}>
                    <View style={[styles.insightIcon, { backgroundColor: `${section.color}18` }]}>
                      <Ionicons name={section.icon as any} size={18} color={section.color} />
                    </View>
                    <Text style={[styles.insightTitle, { color: section.color }]}>
                      {section.title}
                    </Text>
                  </View>
                  <View style={styles.insightDivider} />
                  <Text style={styles.insightContent}>{insight.content}</Text>
                  <View style={styles.insightFooter}>
                    <Ionicons name="shield-checkmark-outline" size={12} color={Colors.textMuted} />
                    <Text style={styles.insightDisclaimer}>
                      AI analysis at {insight.generatedAt} • Not financial advice
                    </Text>
                  </View>
                </GlassmorphicCard>
              )}
            </View>
          );
        })}

        {/* Disclaimer */}
        <GlassmorphicCard style={styles.disclaimerCard}>
          <View style={styles.disclaimerRow}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.textMuted} />
            <Text style={styles.disclaimerText}>
              Pro Insights are generated by Newell AI based on live market data. These analyses are for
              informational purposes only and do not constitute financial advice. Always consult with a
              qualified financial professional before making investment decisions.
            </Text>
          </View>
        </GlassmorphicCard>
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
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlaceholder: {
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
    marginBottom: Spacing.xl,
    borderColor: 'rgba(212,175,55,0.35)',
  },
  heroGradient: {
    margin: -Spacing.lg,
    padding: Spacing.xl,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  heroIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    color: Colors.goldLight,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  priceDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  priceLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    letterSpacing: 0.5,
  },
  priceValue: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  generateAllBtn: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  generateAllBtnDisabled: {
    opacity: 0.8,
  },
  generateAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  generateAllText: {
    color: Colors.black,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
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
    backgroundColor: 'rgba(212,175,55,0.15)',
  },
  sectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: Spacing.sm,
  },
  sectionBtnActive: {
    borderColor: 'rgba(212,175,55,0.4)',
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  sectionBtnIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionBtnTitle: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  sectionBtnRight: {
    width: 24,
    alignItems: 'center',
  },
  loadingCard: {
    marginBottom: Spacing.sm,
  },
  loadingContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  loadingTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  loadingSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  insightCard: {
    marginBottom: Spacing.md,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  insightDivider: {
    height: 1,
    backgroundColor: 'rgba(212,175,55,0.15)',
    marginBottom: Spacing.md,
  },
  insightContent: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    lineHeight: 24,
  },
  insightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  insightDisclaimer: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontStyle: 'italic',
  },
  disclaimerCard: {
    marginTop: Spacing.md,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  disclaimerText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    lineHeight: 18,
    flex: 1,
  },
});
