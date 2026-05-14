import React, { useState, useCallback } from 'react';
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
import PremiumReferralSlot from '@/components/PremiumReferralSlot';
import { CTAShimmerOverlay } from '@/components/GoldShimmer';
import LockInCountdown from '@/components/LockInCountdown';
import ContextualAdInjection from '@/components/ContextualAdInjection';
import { Colors, FontSizes, Spacing, BorderRadius, Gradients } from '@/constants/theme';
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

export default function LiquidityPortalScreen() {
  const insets = useSafeAreaInsets();
  const [weight, setWeight] = useState('');
  const [selectedPurity, setSelectedPurity] = useState('24k');
  const [results, setResults] = useState<CalculationResult[] | null>(null);
  const [error, setError] = useState('');
  const [lockActive, setLockActive] = useState(false);
  const [lockedPrice, setLockedPrice] = useState(0);
  const { config, convertToGrams } = useLocalization();
  const { prices } = useLivePrices();

  // Lock-in price CTA animation
  const lockPulse = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (results && !lockActive) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(lockPulse, { toValue: 1.02, duration: 1000, useNativeDriver: true }),
          Animated.timing(lockPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [results, lockActive, lockPulse]);

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

    const purityFactor = {
      '24k': 0.999,
      '22k': 0.917,
      '18k': 0.75,
      '14k': 0.583,
    }[selectedPurity] || 0.999;

    const baseValueUSD = weightInGrams * prices.goldPricePerGram * purityFactor;

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
    setLockActive(false);
  };

  const handleLockInPrice = useCallback(() => {
    const purityFactor = {
      '24k': 0.999,
      '22k': 0.917,
      '18k': 0.75,
      '14k': 0.583,
    }[selectedPurity] || 0.999;

    const currentPrice = prices.goldPricePerGram * purityFactor;
    setLockedPrice(currentPrice);
    setLockActive(true);
  }, [prices.goldPricePerGram, selectedPurity]);

  const handleLockExpire = useCallback(() => {
    setLockActive(false);
  }, []);

  const handleGoToVault = useCallback(() => {
    router.push(`/digital-vault?action=buy&karat=${selectedPurity}&grams=${weight}&locked=${lockedPrice.toFixed(2)}`);
  }, [selectedPurity, weight, lockedPrice]);

  // Calculate instant cash-out value
  const instantCashOut = React.useMemo(() => {
    if (!weight || isNaN(parseFloat(weight))) return 0;
    const weightInGrams = convertToGrams(parseFloat(weight));
    const purityFactor = {
      '24k': 0.999,
      '22k': 0.917,
      '18k': 0.75,
      '14k': 0.583,
    }[selectedPurity] || 0.999;
    return weightInGrams * prices.goldPricePerGram * purityFactor;
  }, [weight, selectedPurity, prices.goldPricePerGram, convertToGrams]);

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
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconWrap}>
            <Ionicons name="water" size={24} color={Colors.champagneGold} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Liquidity Portal</Text>
            <Text style={styles.headerSubtitle}>INSTANT CASH-OUT CALCULATOR</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.localeTag}>
              <Ionicons name="location-outline" size={11} color={Colors.textMuted} />
              <Text style={styles.localeTagText}>{config.weightLabel}</Text>
            </View>
          </View>
        </View>

        {/* Live price indicator */}
        <GlassmorphicCard titaniumBorder style={styles.livePriceCard}>
          <View style={styles.livePriceRow}>
            <View style={[styles.liveIndicator, prices.isLive && styles.liveIndicatorActive]} />
            <Text style={styles.livePriceLabel}>
              Live 24K: <Text style={styles.livePriceValue}>${prices.goldPricePerGram.toFixed(2)}/g</Text>
            </Text>
            <View style={styles.flex} />
            <Text style={[styles.livePriceHint, { color: prices.goldChangePercent >= 0 ? Colors.green : Colors.red }]}>
              {prices.goldChangePercent >= 0 ? '▲' : '▼'} {Math.abs(prices.goldChangePercent).toFixed(2)}%
            </Text>
          </View>
        </GlassmorphicCard>

        {/* Instant Cash-Out Display */}
        {instantCashOut > 0 && !results && (
          <GlassmorphicCard highlight style={styles.cashOutCard}>
            <View style={styles.cashOutHeader}>
              <Ionicons name="flash" size={16} color={Colors.champagneGold} />
              <Text style={styles.cashOutLabel}>INSTANT CASH-OUT VALUE</Text>
            </View>
            <Text style={styles.cashOutValue}>
              ${instantCashOut.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <Text style={styles.cashOutSubtext}>Based on real-time market data</Text>
          </GlassmorphicCard>
        )}

        {/* Lock-In Countdown */}
        <LockInCountdown
          active={lockActive}
          lockedPrice={lockedPrice}
          onExpire={handleLockExpire}
        />

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
                        ? ['rgba(212, 175, 55, 0.15)', 'rgba(15, 15, 20, 0.6)']
                        : ['rgba(138, 138, 154, 0.06)', 'rgba(15, 15, 20, 0.4)']
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
              colors={[Colors.champagneGold, Colors.gold, Colors.goldDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.calculateGradient}
            >
              <Ionicons name="water" size={20} color={Colors.carbonBlack} />
              <Text style={styles.calculateBtnText}>Liquidate</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {results && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>CASH-OUT VALUE</Text>
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
                titaniumBorder={result.currency !== config.currency}
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

            {/* Lock-In Price CTA */}
            {!lockActive && (
              <Animated.View style={{ transform: [{ scale: lockPulse }] }}>
                <TouchableOpacity
                  style={styles.lockInBtn}
                  onPress={handleLockInPrice}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(212,175,55,0.2)', 'rgba(201,169,78,0.06)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.lockInGradient}
                  >
                    <View style={styles.lockInLeft}>
                      <View style={styles.lockInIcon}>
                        <Ionicons name="lock-closed" size={22} color={Colors.champagneGold} />
                      </View>
                      <View style={styles.lockInText}>
                        <Text style={styles.lockInTitle}>Lock-in Price</Text>
                        <Text style={styles.lockInSubtitle}>
                          60-second guaranteed rate
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.gold} />
                    <CTAShimmerOverlay width={350} height={80} />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Go to Vault CTA when locked */}
            {lockActive && (
              <TouchableOpacity
                style={styles.vaultCtaBtn}
                onPress={handleGoToVault}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.champagneGold, Colors.gold, Colors.goldDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.vaultCtaGradient}
                >
                  <Ionicons name="shield-checkmark" size={20} color={Colors.carbonBlack} />
                  <Text style={styles.vaultCtaText}>Secure in Vault at Locked Price</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <View style={styles.lockInNote}>
              <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.lockInNoteText}>
                Lock-in simulates a professional trading floor hold. Price is guaranteed for 60 seconds.
              </Text>
            </View>
          </View>
        )}

        {/* Contextual Ad Injection - high-ticket referrals near Liquidity Portal */}
        <ContextualAdInjection
          calculatedValue={results?.[0]?.value || 0}
          isVisible={!!results && (results[0]?.value || 0) >= 25000}
        />

        {/* Premium Referral - contextual based on value */}
        <PremiumReferralSlot placement="mid" calculatedValue={results?.[0]?.value} />

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
  flex: {
    flex: 1,
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
    backgroundColor: 'rgba(138,138,154,0.08)',
    borderWidth: 1,
    borderColor: Colors.titaniumBorder,
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
    color: Colors.champagneGold,
    fontWeight: '700',
  },
  livePriceHint: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  cashOutCard: {
    marginBottom: Spacing.lg,
  },
  cashOutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  cashOutLabel: {
    color: Colors.gold,
    fontSize: FontSizes.xs,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  cashOutValue: {
    color: Colors.champagneGold,
    fontSize: FontSizes.display,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cashOutSubtext: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: 4,
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
    fontWeight: '200',
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
    borderColor: 'rgba(212,175,55,0.3)',
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
    backgroundColor: 'rgba(212,175,55,0.15)',
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
    color: Colors.champagneGold,
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
    borderColor: Colors.titaniumBorder,
    backgroundColor: 'rgba(138, 138, 154, 0.05)',
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
    color: Colors.carbonBlack,
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
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
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
    backgroundColor: 'rgba(212,175,55,0.12)',
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
    color: Colors.champagneGold,
  },
  lockInBtn: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    overflow: 'hidden',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  lockInGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    position: 'relative',
  },
  lockInLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  lockInIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockInText: {
    flex: 1,
  },
  lockInTitle: {
    color: Colors.champagneGold,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  lockInSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  vaultCtaBtn: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  vaultCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  vaultCtaText: {
    color: Colors.carbonBlack,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  lockInNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: 4,
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  lockInNoteText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    flex: 1,
    lineHeight: 16,
  },
});
