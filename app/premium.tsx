import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import GoldShimmer from '@/components/GoldShimmer';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

interface PlanOption {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
}

const plans: PlanOption[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$4.99',
    period: '/month',
  },
  {
    id: 'yearly',
    name: 'Annual',
    price: '$29.99',
    period: '/year',
    savings: 'Save 50%',
    popular: true,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$79.99',
    period: 'one-time',
  },
];

const features = [
  {
    icon: 'sparkles',
    title: 'AI-Driven Market Insights',
    desc: 'Get intelligent predictions and trend analysis powered by advanced AI',
  },
  {
    icon: 'globe-outline',
    title: 'Multi-Currency Live Rates',
    desc: 'Real-time gold prices in 50+ currencies worldwide',
  },
  {
    icon: 'download-outline',
    title: 'Data Export',
    desc: 'Export historical price data in CSV, Excel, and PDF formats',
  },
  {
    icon: 'notifications-outline',
    title: 'Advanced Custom Alerts',
    desc: 'Unlimited price alerts with custom conditions and schedules',
  },
  {
    icon: 'ban-outline',
    title: 'Ad-Free Experience',
    desc: 'Enjoy a clean, premium interface without any advertisements',
  },
  {
    icon: 'analytics-outline',
    title: 'Extended Charts',
    desc: 'Access 5-year and 10-year historical charts with advanced indicators',
  },
];

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const handleSubscribe = () => {
    const plan = plans.find((p) => p.id === selectedPlan);
    Alert.alert(
      'Subscription',
      `You selected the ${plan?.name} plan (${plan?.price}${plan?.period !== 'one-time' ? plan?.period : ' ' + plan?.period}). In-app purchase integration via RevenueCat will handle the payment.`,
      [{ text: 'OK' }]
    );
  };

  const handleRestore = () => {
    Alert.alert('Restore Purchases', 'Checking for previous purchases...', [
      { text: 'OK' },
    ]);
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
            style={styles.closeBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.diamondContainer}>
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold, Colors.goldDark]}
              style={styles.diamondGradient}
            >
              <Ionicons name="diamond" size={48} color={Colors.black} />
            </LinearGradient>
          </View>
          <GoldShimmer width={200} height={3} style={{ marginVertical: 16 }} />
          <Text style={styles.heroTitle}>GoldSphere Pro</Text>
          <Text style={styles.heroSubtitle}>UNLOCK PREMIUM FEATURES</Text>
          <Text style={styles.heroDesc}>
            Elevate your gold tracking with AI-powered insights, advanced analytics,
            and a premium ad-free experience.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>PREMIUM FEATURES</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <GlassmorphicCard key={index} highlight style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={24} color={Colors.gold} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </GlassmorphicCard>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>CHOOSE YOUR PLAN</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, isSelected && styles.planCardSelected]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={
                    isSelected
                      ? ['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.04)']
                      : ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)']
                  }
                  style={styles.planGradient}
                >
                  {plan.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                    </View>
                  )}
                  {plan.savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsBadgeText}>{plan.savings}</Text>
                    </View>
                  )}
                  <Text
                    style={[styles.planName, isSelected && styles.planNameSelected]}
                  >
                    {plan.name}
                  </Text>
                  <Text
                    style={[styles.planPrice, isSelected && styles.planPriceSelected]}
                  >
                    {plan.price}
                  </Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark-circle" size={24} color={Colors.gold} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={styles.subscribeBtn}
          onPress={handleSubscribe}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[Colors.goldLight, Colors.gold, Colors.goldDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.subscribeGradient}
          >
            <Ionicons name="diamond" size={20} color={Colors.black} />
            <Text style={styles.subscribeBtnText}>Subscribe Now</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Restore */}
        <TouchableOpacity
          style={styles.restoreBtn}
          onPress={handleRestore}
          activeOpacity={0.7}
        >
          <Text style={styles.restoreBtnText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Subscription automatically renews unless auto-renewal is turned off at least
          24 hours before the end of the current period. Your account will be charged
          for renewal within 24 hours prior to the end of the current period.
        </Text>
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
    justifyContent: 'flex-end',
    marginBottom: Spacing.lg,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  diamondContainer: {
    marginBottom: Spacing.sm,
  },
  diamondGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  heroTitle: {
    fontSize: FontSizes.display,
    fontWeight: '300',
    color: Colors.gold,
    letterSpacing: 3,
  },
  heroSubtitle: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 5,
    marginTop: 4,
  },
  heroDesc: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
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
  featuresGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  featureCard: {
    // No extra margin needed
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  featureTitle: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDesc: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  plansContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  planCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: Colors.gold,
    borderWidth: 2,
  },
  planGradient: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.gold,
    paddingVertical: 4,
    alignItems: 'center',
  },
  popularBadgeText: {
    color: Colors.black,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  savingsBadge: {
    backgroundColor: 'rgba(0, 200, 83, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: Spacing.sm,
  },
  savingsBadgeText: {
    color: Colors.green,
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  planName: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  planNameSelected: {
    color: Colors.goldLight,
  },
  planPrice: {
    color: Colors.white,
    fontSize: FontSizes.xxl,
    fontWeight: '700',
  },
  planPriceSelected: {
    color: Colors.goldLight,
  },
  planPeriod: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  subscribeBtn: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  subscribeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  subscribeBtnText: {
    color: Colors.black,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    letterSpacing: 1,
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  restoreBtnText: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
    textDecorationLine: 'underline',
  },
  disclaimer: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
});
