import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTextGeneration } from '@fastshot/ai';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import MultiplexRevenueUnit from '@/components/MultiplexRevenueUnit';
import { Colors, FontSizes, Spacing, BorderRadius, Gradients } from '@/constants/theme';
import { articles } from '@/constants/goldData';
import { useLivePrices } from '@/hooks/useLivePrices';

export default function ArticleDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = articles.find((a) => a.id === id);
  const { prices } = useLivePrices();
  const { generateText, isLoading: isInsightLoading } = useTextGeneration();
  const [proInsight, setProInsight] = useState<string | null>(null);

  const fetchProInsight = useCallback(async () => {
    if (!article) return;

    const prompt = `You are an elite gold market strategist serving ultra-high-net-worth clients. Based on the following article content and current market data:

Article: "${article.title}"
Summary: "${article.summary}"
Current gold price: $${prices.goldPricePerGram.toFixed(2)}/gram (${prices.goldChangePercent >= 0 ? '+' : ''}${prices.goldChangePercent.toFixed(2)}% today)

Provide a "Pro Insight" prediction for the 24-hour gold outlook based on the themes in this article. Be specific about direction (up/down/sideways), give a projected range, and explain key catalysts. 3 sentences max. Professional tone.`;

    const result = await generateText(prompt);
    if (result) {
      setProInsight(result);
    }
  }, [article, generateText, prices]);

  if (!article) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={Gradients.carbonDepth}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="document-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.errorText}>Article not found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.errorBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.errorBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Parse content into sections
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <View key={index} style={{ height: 12 }} />;

      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return (
          <Text key={index} style={styles.contentHeading}>
            {trimmed.replace(/\*\*/g, '')}
          </Text>
        );
      }

      if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**')) {
        return (
          <Text key={index} style={styles.contentItalic}>
            {trimmed.replace(/\*/g, '')}
          </Text>
        );
      }

      if (trimmed.startsWith('-')) {
        return (
          <View key={index} style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.contentText}>
              {trimmed.replace(/^[•\-]\s*/, '')}
            </Text>
          </View>
        );
      }

      if (/^\d+\./.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\.\s*(.*)/);
        if (match) {
          return (
            <View key={index} style={styles.numberedRow}>
              <Text style={styles.numberLabel}>{match[1]}.</Text>
              <Text style={styles.contentText}>{match[2]}</Text>
            </View>
          );
        }
      }

      return (
        <Text key={index} style={styles.contentText}>
          {trimmed}
        </Text>
      );
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Gradients.carbonDepth}
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
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Intelligence Hub</Text>
          <View style={styles.backBtnPlaceholder} />
        </View>

        {/* Live Price Context */}
        <View style={styles.livePriceStrip}>
          <LinearGradient
            colors={['rgba(212,175,55,0.08)', 'rgba(15,15,20,0.6)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.livePriceGradient}
          >
            <View style={styles.liveDot} />
            <Text style={styles.livePriceText}>
              Gold: ${prices.goldPricePerGram.toFixed(2)}/g
            </Text>
            <Text style={[styles.livePriceChange, { color: prices.goldChangePercent >= 0 ? Colors.green : Colors.red }]}>
              {prices.goldChangePercent >= 0 ? '+' : ''}{prices.goldChangePercent.toFixed(2)}%
            </Text>
          </LinearGradient>
        </View>

        {/* Article Header */}
        <GlassmorphicCard highlight style={styles.articleHeader}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{article.category}</Text>
            </View>
            <Text style={styles.readTime}>{article.readTime}</Text>
          </View>
          <Text style={styles.articleTitle}>{article.title}</Text>
          <Text style={styles.articleSummary}>{article.summary}</Text>
        </GlassmorphicCard>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Ionicons name="ellipse" size={6} color={Colors.gold} />
          <View style={styles.dividerLine} />
        </View>

        {/* Article Content */}
        <View style={styles.articleBody}>{renderContent(article.content)}</View>

        {/* Pro Insight Section - AI Generated */}
        <GlassmorphicCard vaultStyle style={styles.proInsightCard}>
          <View style={styles.proInsightHeader}>
            <View style={styles.proInsightBadge}>
              <Ionicons name="sparkles" size={14} color={Colors.champagneGold} />
              <Text style={styles.proInsightBadgeText}>PRO INSIGHT</Text>
            </View>
            <Text style={styles.proInsightSubtitle}>24-Hour Gold Outlook</Text>
          </View>

          {proInsight ? (
            <View style={styles.proInsightContent}>
              <Text style={styles.proInsightText}>{proInsight}</Text>
              <Text style={styles.proInsightDisclaimer}>
                AI-generated analysis • Not financial advice
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.generateInsightBtn}
              onPress={fetchProInsight}
              disabled={isInsightLoading}
              activeOpacity={0.7}
            >
              {isInsightLoading ? (
                <View style={styles.insightLoading}>
                  <ActivityIndicator size="small" color={Colors.gold} />
                  <Text style={styles.insightLoadingText}>Generating pro insight...</Text>
                </View>
              ) : (
                <LinearGradient
                  colors={['rgba(201,169,78,0.15)', 'rgba(212,175,55,0.05)']}
                  style={styles.generateBtnGradient}
                >
                  <Ionicons name="sparkles" size={18} color={Colors.champagneGold} />
                  <Text style={styles.generateBtnText}>Generate 24h Outlook</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>
          )}
        </GlassmorphicCard>

        {/* Related Articles */}
        <View style={styles.relatedSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="ellipse" size={8} color={Colors.gold} />
            <Text style={styles.sectionTitle}>RELATED ARTICLES</Text>
            <View style={styles.sectionLine} />
          </View>

          {articles
            .filter((a) => a.id !== article.id && a.category === article.category)
            .slice(0, 2)
            .map((related) => (
              <TouchableOpacity
                key={related.id}
                activeOpacity={0.7}
                onPress={() => router.push(`/article/${related.id}`)}
              >
                <GlassmorphicCard titaniumBorder style={styles.relatedCard}>
                  <Text style={styles.relatedTitle}>{related.title}</Text>
                  <Text style={styles.relatedMeta}>
                    {related.category} · {related.readTime}
                  </Text>
                </GlassmorphicCard>
              </TouchableOpacity>
            ))}
        </View>

        {/* Multiplex Revenue Unit - sponsored + internal recommendations grid */}
        <MultiplexRevenueUnit
          articles={articles
            .filter((a) => a.id !== article.id)
            .slice(0, 4)
            .map((a) => ({
              id: a.id,
              title: a.title,
              category: a.category,
              readTime: a.readTime,
            }))}
          onArticlePress={(articleId) => router.push(`/article/${articleId}`)}
        />
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
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  errorText: {
    color: Colors.textMuted,
    fontSize: FontSizes.lg,
  },
  errorBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gold,
  },
  errorBtnText: {
    color: Colors.carbonBlack,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(138, 138, 154, 0.1)',
    borderWidth: 1,
    borderColor: Colors.titaniumBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPlaceholder: {
    width: 40,
  },
  headerLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  livePriceStrip: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.15)',
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  livePriceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.green,
  },
  livePriceText: {
    color: Colors.champagneGold,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  livePriceChange: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  articleHeader: {
    marginBottom: Spacing.lg,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  categoryBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
  },
  categoryText: {
    color: Colors.gold,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  readTime: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
  articleTitle: {
    color: Colors.white,
    fontSize: FontSizes.xxl,
    fontWeight: '600',
    lineHeight: 30,
    marginBottom: Spacing.md,
  },
  articleSummary: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  articleBody: {
    marginBottom: Spacing.xxl,
  },
  contentText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    lineHeight: 24,
    marginBottom: 6,
  },
  contentHeading: {
    color: Colors.champagneGold,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  contentItalic: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: 6,
    paddingLeft: Spacing.sm,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.gold,
    marginTop: 9,
  },
  numberedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: 6,
    paddingLeft: Spacing.sm,
  },
  numberLabel: {
    color: Colors.gold,
    fontSize: FontSizes.md,
    fontWeight: '700',
    minWidth: 20,
  },
  // Pro Insight Section
  proInsightCard: {
    marginBottom: Spacing.xl,
  },
  proInsightHeader: {
    marginBottom: Spacing.md,
  },
  proInsightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  proInsightBadgeText: {
    color: Colors.champagneGold,
    fontSize: FontSizes.xs,
    fontWeight: '800',
    letterSpacing: 2,
  },
  proInsightSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
  proInsightContent: {
    padding: Spacing.md,
    backgroundColor: 'rgba(201,169,78,0.06)',
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.champagneGold,
  },
  proInsightText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  proInsightDisclaimer: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  generateInsightBtn: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  insightLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    justifyContent: 'center',
  },
  insightLoadingText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontStyle: 'italic',
  },
  generateBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  generateBtnText: {
    color: Colors.champagneGold,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  // Related
  relatedSection: {
    marginBottom: Spacing.lg,
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
  relatedCard: {
    marginBottom: Spacing.sm,
  },
  relatedTitle: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  relatedMeta: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
});
