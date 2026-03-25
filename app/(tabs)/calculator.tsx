import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import AdBanner from '@/components/AdBanner';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { goldPrices, currencyRates, currencySymbols } from '@/constants/goldData';

const PURITIES = ['24k', '22k', '18k', '14k'];

interface CalculationResult {
  currency: string;
  symbol: string;
  value: number;
}

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  const [weight, setWeight] = useState('');
  const [selectedPurity, setSelectedPurity] = useState('24k');
  const [results, setResults] = useState<CalculationResult[] | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    Keyboard.dismiss();
    setError('');

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setError('Please enter a valid weight in grams');
      setResults(null);
      return;
    }

    const goldPrice = goldPrices.find((p) => p.karat === selectedPurity);
    if (!goldPrice) return;

    const baseValueUSD = weightNum * goldPrice.pricePerGram;

    const calculatedResults: CalculationResult[] = [
      { currency: 'USD', symbol: currencySymbols.USD, value: baseValueUSD * currencyRates.USD },
      { currency: 'EUR', symbol: currencySymbols.EUR, value: baseValueUSD * currencyRates.EUR },
      { currency: 'GBP', symbol: currencySymbols.GBP, value: baseValueUSD * currencyRates.GBP },
      { currency: 'AED', symbol: currencySymbols.AED, value: baseValueUSD * currencyRates.AED },
      { currency: 'INR', symbol: currencySymbols.INR, value: baseValueUSD * currencyRates.INR },
    ];

    setResults(calculatedResults);
  };

  const handleClear = () => {
    setWeight('');
    setSelectedPurity('24k');
    setResults(null);
    setError('');
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
        </View>

        {/* Weight Input */}
        <GlassmorphicCard highlight style={styles.inputCard}>
          <Text style={styles.inputLabel}>WEIGHT (GRAMS)</Text>
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
            <Text style={styles.inputUnit}>g</Text>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </GlassmorphicCard>

        {/* Purity Selection */}
        <View style={styles.puritySection}>
          <Text style={styles.purityLabel}>SELECT PURITY</Text>
          <View style={styles.purityGrid}>
            {PURITIES.map((purity) => {
              const isSelected = selectedPurity === purity;
              const priceData = goldPrices.find((p) => p.karat === purity);
              return (
                <TouchableOpacity
                  key={purity}
                  style={[styles.purityCard, isSelected && styles.purityCardSelected]}
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
                {weight}g of {selectedPurity.toUpperCase()} gold
              </Text>
            </View>

            {results.map((result) => (
              <GlassmorphicCard
                key={result.currency}
                highlight={result.currency === 'USD'}
                style={styles.resultCard}
              >
                <View style={styles.resultRow}>
                  <View style={styles.resultCurrency}>
                    <Text style={styles.resultFlag}>
                      {result.currency === 'USD'
                        ? '🇺🇸'
                        : result.currency === 'EUR'
                        ? '🇪🇺'
                        : result.currency === 'GBP'
                        ? '🇬🇧'
                        : result.currency === 'AED'
                        ? '🇦🇪'
                        : '🇮🇳'}
                    </Text>
                    <Text style={styles.resultCurrencyText}>{result.currency}</Text>
                  </View>
                  <Text
                    style={[
                      styles.resultValue,
                      result.currency === 'USD' && styles.resultValueHighlight,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
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
  purityGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: 4,
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
    gap: Spacing.md,
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
  resultValue: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },
  resultValueHighlight: {
    color: Colors.goldLight,
  },
});
