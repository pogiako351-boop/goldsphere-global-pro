import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import AdBanner from '@/components/AdBanner';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { articles } from '@/constants/goldData';

const CATEGORIES = ['All', 'Education', 'Guide', 'Investment'];

export default function KnowledgeHubScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArticles =
    selectedCategory === 'All'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

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
          <Ionicons name="book" size={28} color={Colors.gold} />
          <View>
            <Text style={styles.headerTitle}>Knowledge Hub</Text>
            <Text style={styles.headerSubtitle}>GOLD EDUCATION & INSIGHTS</Text>
          </View>
        </View>

        {/* Featured Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/article/1')}
        >
          <GlassmorphicCard highlight style={styles.featuredCard}>
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.02)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredBadge}>
                <Ionicons name="star" size={12} color={Colors.gold} />
                <Text style={styles.featuredBadgeText}>FEATURED</Text>
              </View>
              <Text style={styles.featuredTitle}>Understanding Gold Purity & Karats</Text>
              <Text style={styles.featuredDesc}>
                Learn about the difference between 24k, 22k, 18k, and 14k gold and what purity
                means for your investment.
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

        {filteredArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            activeOpacity={0.7}
            onPress={() => router.push(`/article/${article.id}`)}
          >
            <GlassmorphicCard style={styles.articleCard}>
              <View style={styles.articleRow}>
                <View style={styles.articleIcon}>
                  <Ionicons
                    name={article.icon as any}
                    size={24}
                    color={Colors.gold}
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
            </GlassmorphicCard>
          </TouchableOpacity>
        ))}

        {/* Ad Banner */}
        <AdBanner onUpgrade={() => router.push('/premium')} />

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
  featuredCard: {
    marginBottom: Spacing.xl,
    borderColor: 'rgba(212, 175, 55, 0.3)',
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
    color: Colors.gold,
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
    borderColor: Colors.glassBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  categoryBtnSelected: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  categoryBtnText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  categoryBtnTextSelected: {
    color: Colors.gold,
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
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
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
