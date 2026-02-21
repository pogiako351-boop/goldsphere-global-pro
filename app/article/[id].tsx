import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { articles } from '@/constants/goldData';

export default function ArticleDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={['#000000', '#0A0A0A', '#111111']}
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

      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
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
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Knowledge Hub</Text>
          <View style={styles.backBtnPlaceholder} />
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
                <GlassmorphicCard style={styles.relatedCard}>
                  <Text style={styles.relatedTitle}>{related.title}</Text>
                  <Text style={styles.relatedMeta}>
                    {related.category} · {related.readTime}
                  </Text>
                </GlassmorphicCard>
              </TouchableOpacity>
            ))}
        </View>
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
    color: Colors.black,
    fontWeight: '700',
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
  headerLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    fontWeight: '600',
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
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: 6,
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
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
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
    color: Colors.goldLight,
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
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
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
