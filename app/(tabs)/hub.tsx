import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTextGeneration } from '@fastshot/ai';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import PremiumReferralSlot from '@/components/PremiumReferralSlot';
import MultiplexRevenueUnit from '@/components/MultiplexRevenueUnit';
import { Colors, FontSizes, Spacing, BorderRadius, Gradients } from '@/constants/theme';
import { articles } from '@/constants/goldData';
import { useLivePrices } from '@/hooks/useLivePrices';

const CATEGORIES = ['All', 'Investment', 'Education', 'Guide'];

// Keywords that trigger live price widget in articles
const PRICE_TRIGGER_KEYWORDS = ['inflation', 'central bank', 'safe haven', 'reserve', 'monetary policy'];

interface SentimentResult {
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  score: number;
  summary: string;
  generatedAt: string;
}

function parseSentiment(text: string): SentimentResult {
  const lower = text.toLowerCase();
  let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
  let score = 50;

  if (lower.includes('bullish') || lower.includes('upward') || lower.includes('positive')) {
    sentiment = 'Bullish';
    score = 65 + Math.floor(Math.random() * 20);
  } else if (lower.includes('bearish') || lower.includes('downward') || lower.includes('negative')) {
    sentiment = 'Bearish';
    score = 20 + Math.floor(Math.random() * 25);
  } else {
    sentiment = 'Neutral';
    score = 45 + Math.floor(Math.random() * 10);
  }

  const sentences = text.split('.').filter((s) => s.trim().length > 10);
  const summary = sentences.slice(0, 2).join('.') + (sentences.length > 2 ? '.' : '');

  return {
    sentiment,
    score,
    summary: summary.trim(),
    generatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

function SentimentGauge({ score, sentiment }: { score: number; sentiment: 'Bullish' | 'Bearish' | 'Neutral' }) {
  const fillPercent = score;
  const sentimentColor =
    sentiment === 'Bullish' ? Colors.green : sentiment === 'Bearish' ? Colors.red : Colors.gold;

  const pointerAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.spring(pointerAnim, {
      toValue: fillPercent,
      tension: 40,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [fillPercent, pointerAnim]);

  const pointerLeft = pointerAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={gaugeStyles.container}>
      <View style={gaugeStyles.track}>
        <LinearGradient
          colors={['#FF1744', '#FFA500', '#D4AF37', '#00E676']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={gaugeStyles.gradient}
        />
        <Animated.View style={[gaugeStyles.pointer, { left: pointerLeft }]}>
          <View style={[gaugeStyles.pointerLine, { backgroundColor: sentimentColor }]} />
          <View style={[gaugeStyles.pointerDot, { backgroundColor: sentimentColor }]} />
        </Animated.View>
      </View>
      <View style={gaugeStyles.labels}>
        <Text style={[gaugeStyles.label, { color: Colors.red }]}>Bearish</Text>
        <Text style={[gaugeStyles.label, { color: Colors.gold }]}>Neutral</Text>
        <Text style={[gaugeStyles.label, { color: Colors.green }]}>Bullish</Text>
      </View>
      <View style={gaugeStyles.scoreRow}>
        <Text style={[gaugeStyles.scoreText, { color: sentimentColor }]}>
          {sentiment}
        </Text>
        <Text style={gaugeStyles.scoreValue}>{score}/100</Text>
      </View>
    </View>
  );
}

const gaugeStyles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: 'visible',
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  gradient: {
    height: 10,
    borderRadius: 5,
  },
  pointer: {
    position: 'absolute',
    top: -6,
    marginLeft: -1,
    alignItems: 'center',
  },
  pointerLine: {
    width: 2,
    height: 22,
    borderRadius: 1,
  },
  pointerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: -4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  scoreText: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    letterSpacing: 1,
  },
  scoreValue: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});

/** Live price widget shown when article mentions relevant keywords */
function LivePriceWidget({ goldPrice, changePercent }: { goldPrice: number; changePercent: number }) {
  const isUp = changePercent >= 0;
  return (
    <View style={widgetStyles.container}>
      <LinearGradient
        colors={['rgba(212,175,55,0.1)', 'rgba(15,15,20,0.8)']}
        style={widgetStyles.gradient}
      >
        <View style={widgetStyles.row}>
          <View style={widgetStyles.dot} />
          <Text style={widgetStyles.label}>LIVE GOLD</Text>
          <Text style={widgetStyles.price}>${goldPrice.toFixed(2)}/g</Text>
          <Text style={[widgetStyles.change, { color: isUp ? Colors.green : Colors.red }]}>
            {isUp ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const widgetStyles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
    overflow: 'hidden',
    marginVertical: Spacing.sm,
  },
  gradient: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.green,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  price: {
    color: Colors.champagneGold,
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  change: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
});

function hasRelevantKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return PRICE_TRIGGER_KEYWORDS.some((kw) => lower.includes(kw));
}

export default function KnowledgeHubScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const { generateText, isLoading: isSentimentLoading } = useTextGeneration();
  const { prices } = useLivePrices();

  const filteredArticles =
    selectedCategory === 'All'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const fetchSentiment = useCallback(async () => {
    const prompt = `You are an elite gold market analyst serving billionaire-tier clients. Based on current gold price data:
- 24K gold price: $${prices.goldPricePerGram.toFixed(2)} per gram
- 24h change: ${prices.goldChangePercent >= 0 ? '+' : ''}${prices.goldChangePercent.toFixed(2)}%
- Silver: $${prices.silverPricePerGram.toFixed(2)}/g, ${prices.silverChangePercent >= 0 ? '+' : ''}${prices.silverChangePercent.toFixed(2)}%

Analyze today's gold market sentiment in 2-3 sentences. Clearly state whether market sentiment is Bullish, Bearish, or Neutral. Include key factors driving the current sentiment. Use language appropriate for sophisticated investors.`;

    const result = await generateText(prompt);
    if (result) {
      setSentiment(parseSentiment(result));
    }
  }, [generateText, prices]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Gradients.carbonDepth}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconWrap}>
            <Ionicons name="library" size={22} color={Colors.champagneGold} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Intelligence Hub</Text>
            <Text style={styles.headerSubtitle}>CONTEXTUAL MARKET INTELLIGENCE</Text>
          </View>
        </View>

        {/* Market Sentiment Gauge */}
        <GlassmorphicCard highlight style={styles.sentimentCard}>
          <View style={styles.sentimentHeader}>
            <View style={styles.sentimentTitleRow}>
              <Ionicons name="pulse" size={18} color={Colors.champagneGold} />
              <Text style={styles.sentimentTitle}>Market Sentiment</Text>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={10} color={Colors.gold} />
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.refreshBtn, isSentimentLoading && styles.refreshBtnLoading]}
              onPress={fetchSentiment}
              disabled={isSentimentLoading}
              activeOpacity={0.7}
            >
              {isSentimentLoading ? (
                <ActivityIndicator size="small" color={Colors.gold} />
              ) : (
                <>
                  <Ionicons name="refresh" size={14} color={Colors.gold} />
                  <Text style={styles.refreshBtnText}>Analyze</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {sentiment ? (
            <>
              <SentimentGauge score={sentiment.score} sentiment={sentiment.sentiment} />
              <View style={styles.sentimentSummaryBox}>
                <Text style={styles.sentimentSummaryText}>{sentiment.summary}</Text>
              </View>
              <Text style={styles.sentimentTime}>
                Generated at {sentiment.generatedAt} • Not financial advice
              </Text>
            </>
          ) : (
            <View style={styles.sentimentPlaceholder}>
              {isSentimentLoading ? (
                <>
                  <ActivityIndicator size="large" color={Colors.gold} />
                  <Text style={styles.sentimentLoadingText}>Analyzing market data...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="analytics-outline" size={36} color={Colors.textMuted} />
                  <Text style={styles.sentimentPlaceholderText}>
                    Tap Analyze to get today&apos;s market sentiment
                  </Text>
                  <TouchableOpacity
                    style={styles.analyzeBtn}
                    onPress={fetchSentiment}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={[Colors.champagneGold, Colors.gold]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.analyzeBtnGradient}
                    >
                      <Ionicons name="sparkles" size={16} color={Colors.carbonBlack} />
                      <Text style={styles.analyzeBtnText}>Run AI Analysis</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </GlassmorphicCard>

        {/* Featured Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/article/1')}
        >
          <GlassmorphicCard highlight style={styles.featuredCard}>
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.12)', 'rgba(15, 15, 20, 0.8)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredBadge}>
                <Ionicons name="star" size={12} color={Colors.champagneGold} />
                <Text style={styles.featuredBadgeText}>FEATURED</Text>
              </View>
              <Text style={styles.featuredTitle}>The 2026 Conflict Economy</Text>
              <Text style={styles.featuredDesc}>
                How wars, sanctions, and geopolitical tensions are reshaping gold demand
                and driving unprecedented investment in precious metals.
              </Text>
              <View style={styles.featuredFooter}>
                <Text style={styles.featuredReadTime}>5 min read</Text>
                <View style={styles.readMoreBtn}>
                  <Text style={styles.readMoreText}>Read More</Text>
                  <Ionicons name="arrow-forward" size={14} color={Colors.gold} />
                </View>
              </View>
            </LinearGradient>
          </GlassmorphicCard>
        </TouchableOpacity>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryBtn, isSelected && styles.categoryBtnSelected]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryBtnText,
                    isSelected && styles.categoryBtnTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Articles List */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>ARTICLES</Text>
          <View style={styles.sectionLine} />
        </View>

        {filteredArticles.map((article) => {
          const showPriceWidget = hasRelevantKeywords(article.title + ' ' + article.summary);
          return (
            <TouchableOpacity
              key={article.id}
              activeOpacity={0.7}
              onPress={() => router.push(`/article/${article.id}`)}
            >
              <GlassmorphicCard titaniumBorder style={styles.articleCard}>
                <View style={styles.articleRow}>
                  <View style={styles.articleIcon}>
                    <Ionicons
                      name={article.icon as any}
                      size={24}
                      color={Colors.champagneGold}
                    />
                  </View>
                  <View style={styles.articleContent}>
                    <View style={styles.articleMeta}>
                      <Text style={styles.articleCategory}>{article.category}</Text>
                      <Text style={styles.articleDot}>•</Text>
                      <Text style={styles.articleReadTime}>{article.readTime}</Text>
                    </View>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <Text style={styles.articleSummary} numberOfLines={2}>
                      {article.summary}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                </View>
                {/* Contextual Live Price Widget */}
                {showPriceWidget && (
                  <LivePriceWidget
                    goldPrice={prices.goldPricePerGram}
                    changePercent={prices.goldChangePercent}
                  />
                )}
              </GlassmorphicCard>
            </TouchableOpacity>
          );
        })}

        {/* Multiplex Revenue Unit - Grid-style recommendations */}
        <MultiplexRevenueUnit
          articles={filteredArticles.slice(0, 4).map((a) => ({
            id: a.id,
            title: a.title,
            category: a.category,
            readTime: a.readTime,
          }))}
          onArticlePress={(id) => router.push(`/article/${id}`)}
        />

        {/* Premium Referral */}
        <PremiumReferralSlot placement="mid" />

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.carbonBlack,
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
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '200',
    color: Colors.champagneGold,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  sentimentCard: {
    marginBottom: Spacing.xl,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  sentimentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sentimentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sentimentTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)',
  },
  aiBadgeText: {
    color: Colors.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)',
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  refreshBtnLoading: {
    opacity: 0.7,
  },
  refreshBtnText: {
    color: Colors.gold,
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  sentimentPlaceholder: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  sentimentLoadingText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  sentimentPlaceholderText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  analyzeBtn: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  analyzeBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  analyzeBtnText: {
    color: Colors.carbonBlack,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  sentimentSummaryBox: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.gold,
  },
  sentimentSummaryText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  sentimentTime: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: Spacing.sm,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  featuredCard: {
    marginBottom: Spacing.xl,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  featuredGradient: {
    margin: -Spacing.lg,
    padding: Spacing.xl,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  featuredBadgeText: {
    color: Colors.champagneGold,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 2,
  },
  featuredTitle: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    lineHeight: 26,
  },
  featuredDesc: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredReadTime: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readMoreText: {
    color: Colors.gold,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  categoryScroll: {
    marginBottom: Spacing.xl,
  },
  categoryContainer: {
    gap: Spacing.sm,
  },
  categoryBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.titaniumBorder,
    backgroundColor: 'rgba(138, 138, 154, 0.04)',
  },
  categoryBtnSelected: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  categoryBtnText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  categoryBtnTextSelected: {
    color: Colors.champagneGold,
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
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  articleCard: {
    marginBottom: Spacing.md,
  },
  articleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  articleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleContent: {
    flex: 1,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  articleCategory: {
    color: Colors.gold,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  articleDot: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
  articleReadTime: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
  articleTitle: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  articleSummary: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    lineHeight: 18,
  },
});
