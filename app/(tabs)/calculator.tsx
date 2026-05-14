import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import AdBanner from '@/components/AdBanner';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { goldPrices, currencyRates, currencySymbols } from '@/constants/goldData';
import { useLocalization } from '@/hooks/useLocalization';
import { useLivePrices } from '@/hooks/useLivePrices';

const PURITIES = ['24k', '22k', '18k', '14k'];

interface CalculationResult {
  currency: string;
  symbol: string;
  value: number;
}

const CURRENCY_FLAGS: Record<string, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  AED: '🇦🇪',
  INR: '🇮🇳',
};

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  const [weight, setWeight] = useState('');
  const [selectedPurity, setSelectedPurity] = useState('24k');
  const [results, setResults] = useState<CalculationResult[] | null>(null);
  const [error, setError] = useState('');
  const { config, convertToGrams } = useLocalization();
  const { prices } = useLivePrices();

  // Lock-in price CTA animation
  const lockPulse = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (results) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(lockPulse, { toValue: 1.03, duration: 900, useNativeDriver: true }),
          Animated.timing(lockPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [results, lockPulse]);

  const handleCalculate = () => {
    Keyboard.dismiss();
    setError('');

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setError(`Please enter a valid weight in ${config.weightLabel}`);
      setResults(null);
      return;
    }

    // Convert from local weight unit to grams
    const weightInGrams = convertToGrams(weightNum);

    const goldPrice = goldPrices.find((p) => p.karat === selectedPurity);
    if (!goldPrice) return;

    // Use live price if available, fallback to goldData constant
    const livePerGram = prices.goldPricePerGram;
    const purityFactor = {
      '24k': 0.999,
      '22k': 0.917,
      '18k': 0.75,
      '14k': 0.583,
    }[selectedPurity] || 0.999;

    const baseValueUSD = weightInGrams * livePerGram * purityFactor;

    const calculatedResults: CalculationResult[] = [
      { currency: 'USD', symbol: currencySymbols.USD, value: baseValueUSD * currencyRates.USD },
      { currency: 'EUR', symbol: currencySymbols.EUR, value: baseValueUSD * currencyRates.EUR },
      { currency: 'GBP', symbol: currencySymbols.GBP, value: baseValueUSD * currencyRates.GBP },
      { currency: 'AED', symbol: currencySymbols.AED, value: baseValueUSD * currencyRates.AED },
      { currency: 'INR', symbol: currencySymbols.INR, value: baseValueUSD * currencyRates.INR },
    ];

    // Reorder to put user's preferred currency first
    const preferredCurrency = config.currency;
    calculatedResults.sort((a, b) => {
      if (a.currency === preferredCurrency) return -1;
      if (b.currency === preferredCurrency) return 1;
      return 0;
    });

    setResults(calculatedResults);
  };

  const handleClear = () => {
    setWeight('');
    setSelectedPurity('24k');
    setResults(null);
    setError('');
  };

  const handleLockInPrice = () => {
    router.push('/digital-vault');
  };

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
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="calculator" size={28} color={Colors.gold} />
          <View>
            <Text style={styles.headerTitle}>Gold Calculator</Text>
            <Text style={styles.headerSubtitle}>ESTIMATE YOUR GOLD VALUE</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.localeTag}>
              <Ionicons name="location-outline" size={11} color={Colors.textMuted} />
              <Text style={styles.localeTagText}>{config.weightLabel}</Text>
            </View>
          </View>
        </View>

        {/* Live price indicator */}
        <GlassmorphicCard style={styles.livePriceCard}>
          <View style={styles.livePriceRow}>
            <View style={[styles.liveIndicator, prices.isLive && styles.liveIndicatorActive]} />
            <Text style={styles.livePriceLabel}>
              Live 24K: <Text style={styles.livePriceValue}>${prices.goldPricePerGram.toFixed(2)}/g</Text>
            </Text>
            <View style={styles.flex} />
            <Text style={styles.livePriceHint}>
              {prices.goldChangePercent >= 0 ? '▲' : '▼'} {Math.abs(prices.goldChangePercent).toFixed(2)}%
            </Text>
          </View>
        </GlassmorphicCard>

        {/* Weight Input */}
        <GlassmorphicCard highlight style={styles.inputCard}>
          <Text style={styles.inputLabel}>WEIGHT ({config.weightLabel.toUpperCase()})</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={weight}
              onChangeText={(text) => {
                setWeight(text);
                setError('');
              }}
              placeholder="0.00"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={handleCalculate}
            />
            <Text style={styles.inputUnit}>{config.weightLabel}</Text>
          </View>
          {config.weightUnit !== 'gram' && weight && !isNaN(parseFloat(weight)) && (
            <Text style={styles.gramEquivalent}>
              = {convertToGrams(parseFloat(weight)).toFixed(3)} grams
            </Text>
          )}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </GlassmorphicCard>

        {/* Purity Selection */}
        <View style={styles.puritySection}>
          <Text style={styles.purityLabel}>SELECT PURITY</Text>
          <View style={styles.purityGrid}>
            {PURITIES.map((purity) => {
              const isSelected = selectedPurity === purity;
              const priceData = goldPrices.find((p) => p.karat === purity);
              const isPreferred = purity === config.preferredKarat.toLowerCase();
              return (
                <TouchableOpacity
                  key={purity}
                  style={[
                    styles.purityCard,
                    isSelected && styles.purityCardSelected,
                    isPreferred && styles.purityCardPreferred,
                  ]}
                  onPress={() => setSelectedPurity(purity)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={
                      isSelected
                        ? ['rgba(212, 175, 55, 0.2)', 'rgba(212, 175, 55, 0.08)']
                        : ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)']
                    }
                    style={styles.purityGradient}
                  >
                    {isPreferred && !isSelected && (
                      <View style={styles.preferredTag}>
                        <Text style={styles.preferredTagText}>Regional</Text>
                      </View>
                    )}
                    <Text style={[styles.purityKarat, isSelected && styles.purityKaratSelected]}>
                      {purity.toUpperCase()}
                    </Text>
                    <Text style={styles.purityPrice}>
                      ${priceData?.pricePerGram.toFixed(2)}/g
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Calculate Button */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear} activeOpacity={0.7}>
            <Ionicons name="refresh" size={20} color={Colors.textSecondary} />
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate} activeOpacity={0.7}>
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold, Colors.goldDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.calculateGradient}
            >
              <Ionicons name="calculator" size={20} color={Colors.black} />
              <Text style={styles.calculateBtnText}>Calculate</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {results && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ESTIMATED VALUE</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.resultsInfo}>
              <Text style={styles.resultsSubtext}>
                {weight}{config.weightLabel} of {selectedPurity.toUpperCase()} gold
              </Text>
            </View>

            {results.map((result) => (
              <GlassmorphicCard
                key={result.currency}
                highlight={result.currency === config.currency}
                style={styles.resultCard}
              >
                <View style={styles.resultRow}>
                  <View style={styles.resultCurrency}>
                    <Text style={styles.resultFlag}>
                      {CURRENCY_FLAGS[result.currency] || '💱'}
                    </Text>
                    <Text style={styles.resultCurrencyText}>{result.currency}</Text>
                    {result.currency === config.currency && (
                      <View style={styles.localBadge}>
                        <Text style={styles.localBadgeText}>LOCAL</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.resultValue,
                      result.currency === config.currency && styles.resultValueHighlight,
                    ]}
                  >
                    {result.symbol}
                    {result.value.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              </GlassmorphicCard>
            ))}

            {/* Lock in this Price CTA */}
            <Animated.View style={{ transform: [{ scale: lockPulse }] }}>
              <TouchableOpacity
                style={styles.lockInBtn}
                onPress={handleLockInPrice}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(212,175,55,0.25)', 'rgba(212,175,55,0.08)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.lockInGradient}
                >
                  <View style={styles.lockInLeft}>
                    <View style={styles.lockInIcon}>
                      <Ionicons name="shield-checkmark" size={26} color={Colors.gold} />
                    </View>
                    <View style={styles.lockInText}>
                      <Text style={styles.lockInTitle}>Lock in this Price</Text>
                      <Text style={styles.lockInSubtitle}>
                        Secure ${results[0]?.value.toFixed(0)} in your Digital Gold Vault
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.gold} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.lockInNote}>
              <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.lockInNoteText}>
                Save this calculation to your Digital Gold Vault to track virtual holdings.
              </Text>
            </View>
          </View>
        )}

        {/* Ad Banner */}
        <AdBanner placement="mid" />

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
  flex: {
    flex: 1,
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
  headerRight: {
    marginLeft: 'auto',
  },
  localeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  localeTagText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  livePriceCard: {
    marginBottom: Spacing.lg,
  },
  livePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFA500',
  },
  liveIndicatorActive: {
    backgroundColor: Colors.green,
  },
  livePriceLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  livePriceValue: {
    color: Colors.goldLight,
    fontWeight: '700',
  },
  livePriceHint: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  inputCard: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 42,
    fontWeight: '300',
    color: Colors.white,
    padding: 0,
    letterSpacing: 1,
  },
  inputUnit: {
    fontSize: FontSizes.xxl,
    color: Colors.textMuted,
    fontWeight: '300',
  },
  gramEquivalent: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
  },
  errorText: {
    color: Colors.red,
    fontSize: FontSizes.sm,
    marginTop: Spacing.sm,
  },
  puritySection: {
    marginBottom: Spacing.xl,
  },
  purityLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  purityGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  purityCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
  },
  purityCardSelected: {
    borderColor: Colors.gold,
  },
  purityCardPreferred: {
    borderColor: 'rgba(212,175,55,0.4)',
  },
  purityGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  preferredTag: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(212,175,55,0.2)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  preferredTagText: {
    color: Colors.gold,
    fontSize: 8,
    fontWeight: '800',
  },
  purityKarat: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  purityKaratSelected: {
    color: Colors.gold,
  },
  purityPrice: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  clearBtnText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  calculateBtn: {
    flex: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  calculateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  calculateBtnText: {
    color: Colors.black,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    letterSpacing: 1,
  },
  resultsSection: {
    marginBottom: Spacing.lg,
  },
  resultsDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  dividerText: {
    color: Colors.gold,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 3,
  },
  resultsInfo: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  resultsSubtext: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
  resultCard: {
    marginBottom: Spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultCurrency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  resultFlag: {
    fontSize: 24,
  },
  resultCurrencyText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.lg,
    fontWeight: '600',
    letterSpacing: 1,
  },
  localBadge: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  localBadgeText: {
    color: Colors.gold,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resultValue: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },
  resultValueHighlight: {
    color: Colors.goldLight,
  },
  lockInBtn: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
    overflow: 'hidden',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  lockInGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  lockInLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  lockInIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockInText: {
    flex: 1,
  },
  lockInTitle: {
    color: Colors.goldLight,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  lockInSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  lockInNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: 4,
    marginBottom: Spacing.lg,
  },
  lockInNoteText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    flex: 1,
    lineHeight: 16,
  },
});
