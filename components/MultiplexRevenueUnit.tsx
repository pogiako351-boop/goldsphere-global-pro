import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Gradients } from '@/constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticleItem {
  id: string;
  title: string;
  category: string;
  readTime: string;
}

interface SponsoredItem {
  id: string;
  title: string;
  description: string;
  isSponsored: true;
}

type GridItem = (ArticleItem & { isSponsored?: false }) | SponsoredItem;

interface MultiplexRevenueUnitProps {
  articles?: ArticleItem[];
  /** Number of columns in the grid (default: 2) */
  columns?: 2;
  onArticlePress?: (id: string) => void;
}

// ─── Mock Sponsored Content ───────────────────────────────────────────────────

const MOCK_SPONSORED: SponsoredItem[] = [
  {
    id: 'sponsored-1',
    title: 'Gold-Backed Portfolio Insurance',
    description: 'Protect your wealth with physical gold allocation strategies.',
    isSponsored: true,
  },
  {
    id: 'sponsored-2',
    title: 'Private Bullion Vaulting',
    description: 'Secure offshore storage with 24/7 audit transparency.',
    isSponsored: true,
  },
  {
    id: 'sponsored-3',
    title: 'Sovereign Wealth Advisory',
    description: 'Exclusive access to ultra-high-net-worth strategies.',
    isSponsored: true,
  },
];

// ─── Shimmer Skeleton Card ────────────────────────────────────────────────────

function ShimmerSkeletonCard({ index }: { index: number }) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = (screenWidth - Spacing.xxl * 3) / 2;
  const translateX = useSharedValue(-cardWidth);

  useEffect(() => {
    translateX.value = withDelay(
      index * 200,
      withRepeat(
        withTiming(cardWidth * 2, {
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        false
      )
    );
  }, [cardWidth, index, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.cardSkeleton, { width: cardWidth }]}>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['rgba(15, 15, 20, 0.9)', 'rgba(20, 20, 28, 0.95)']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={Gradients.goldShimmer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: cardWidth * 0.5, height: '100%' }}
        />
      </Animated.View>
      <View style={styles.skeletonContent}>
        <View style={[styles.skeletonLine, { width: '50%' }]} />
        <View style={[styles.skeletonLine, { width: '80%', marginTop: 8 }]} />
        <View style={[styles.skeletonLine, { width: '60%', marginTop: 8 }]} />
      </View>
    </View>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────

function ArticleCard({
  item,
  cardWidth,
  onPress,
}: {
  item: ArticleItem;
  cardWidth: number;
  onPress?: (id: string) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress?.(item.id)}
      style={({ pressed }) => [
        styles.card,
        { width: cardWidth, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <LinearGradient
        colors={['rgba(138, 138, 154, 0.08)', 'rgba(15, 15, 20, 0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.cardFooter}>
          <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.readTimeText}>{item.readTime}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

// ─── Sponsored Card ───────────────────────────────────────────────────────────

function SponsoredCard({ item, cardWidth }: { item: SponsoredItem; cardWidth: number }) {
  return (
    <View style={[styles.card, styles.sponsoredCard, { width: cardWidth }]}>
      <LinearGradient
        colors={['rgba(212, 175, 55, 0.08)', 'rgba(15, 15, 20, 0.7)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.sponsoredBadge}>
          <Text style={styles.sponsoredBadgeText}>SPONSORED</Text>
          <Ionicons name="information-circle-outline" size={11} color={Colors.textMuted} />
        </View>
        <Text style={styles.sponsoredTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.sponsoredDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </LinearGradient>
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MultiplexRevenueUnit({
  articles = [],
  columns = 2,
  onArticlePress,
}: MultiplexRevenueUnitProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = (screenWidth - Spacing.xxl * (columns + 1)) / columns;

  // Simulate lazy loading with shimmer skeleton (1.5s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Mix articles with sponsored content
  const buildGridItems = (): GridItem[] => {
    const items: GridItem[] = [];
    const sponsoredPool = [...MOCK_SPONSORED];
    let sponsoredIndex = 0;

    for (let i = 0; i < Math.max(articles.length, 4); i++) {
      // Insert a sponsored item every 3rd position
      if (i > 0 && i % 3 === 0 && sponsoredIndex < sponsoredPool.length) {
        items.push(sponsoredPool[sponsoredIndex]);
        sponsoredIndex++;
      }
      if (i < articles.length) {
        items.push({ ...articles[i], isSponsored: false });
      }
    }

    // Ensure at least one sponsored item if we have articles
    if (items.length > 0 && !items.some((item) => 'isSponsored' in item && item.isSponsored)) {
      items.push(sponsoredPool[0]);
    }

    // Cap at 6 items (2x3 grid max)
    return items.slice(0, 6);
  };

  const gridItems = buildGridItems();
  const totalSkeletons = Math.min(gridItems.length || 4, 6);

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <Ionicons name="grid-outline" size={16} color={Colors.gold} />
          <Text style={styles.sectionTitle}>Recommended For You</Text>
        </View>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {!isLoaded
          ? Array.from({ length: totalSkeletons }).map((_, index) => (
              <ShimmerSkeletonCard key={`skeleton-${index}`} index={index} />
            ))
          : gridItems.map((item) => (
              <Animated.View
                key={item.id}
                entering={FadeIn.duration(400)}
              >
                {'isSponsored' in item && item.isSponsored ? (
                  <SponsoredCard item={item} cardWidth={cardWidth} />
                ) : (
                  <ArticleCard
                    item={item as ArticleItem}
                    cardWidth={cardWidth}
                    onPress={onArticlePress}
                  />
                )}
              </Animated.View>
            ))}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    margin: Spacing.xxl, // 24px buffer
    paddingVertical: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.titaniumBorder,
    backgroundColor: Colors.obsidian,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  sponsoredCard: {
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  cardGradient: {
    padding: Spacing.md,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(138, 138, 154, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  categoryBadgeText: {
    color: Colors.titaniumLight,
    fontSize: FontSizes.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.md,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: Spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  readTimeText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
  sponsoredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sponsoredBadgeText: {
    color: Colors.champagneGold,
    fontSize: FontSizes.xs - 1,
    fontWeight: '700',
    letterSpacing: 1,
  },
  sponsoredTitle: {
    color: Colors.champagneGold,
    fontSize: FontSizes.md,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: Spacing.sm,
  },
  sponsoredDescription: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    lineHeight: 16,
    marginTop: Spacing.xs,
  },
  cardSkeleton: {
    height: 120,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.titaniumBorder,
    backgroundColor: Colors.obsidian,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    position: 'relative',
    justifyContent: 'center',
  },
  skeletonContent: {
    paddingHorizontal: Spacing.md,
  },
  skeletonLine: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(247, 231, 206, 0.06)',
  },
});
