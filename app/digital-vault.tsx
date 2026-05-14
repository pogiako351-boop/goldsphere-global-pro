import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import GoldShimmer from '@/components/GoldShimmer';
import VaultEntryAnimation from '@/components/VaultEntryAnimation';
import { Colors, FontSizes, Spacing, BorderRadius, Gradients } from '@/constants/theme';
import { useLivePrices } from '@/hooks/useLivePrices';
import { supabase } from '@/lib/supabase';

const VAULT_STORAGE_KEY = '@goldsphere_vault_holdings';

interface VaultHolding {
  id: string;
  grams: number;
  karat: string;
  lockedPriceUsd: number | null;
  addedAt: string;
  label: string;
}

const KARAT_OPTIONS = ['24k', '22k', '18k', '14k'];
const KARAT_FACTORS: Record<string, number> = {
  '24k': 0.999,
  '22k': 0.917,
  '18k': 0.75,
  '14k': 0.583,
};

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default function DigitalVaultScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ action?: string; karat?: string; grams?: string; locked?: string }>();
  const { prices } = useLivePrices();

  const [holdings, setHoldings] = useState<VaultHolding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addGrams, setAddGrams] = useState('');
  const [addKarat, setAddKarat] = useState('24k');
  const [addLabel, setAddLabel] = useState('');
  const [lockPrice, setLockPrice] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showVaultAnimation, setShowVaultAnimation] = useState(false);
  const [animGrams, setAnimGrams] = useState(0);
  const [animKarat, setAnimKarat] = useState('24k');

  // Pre-populate from params (from Trade Gates or Liquidity Portal)
  useEffect(() => {
    if (params.action === 'buy' && params.karat) {
      setAddKarat(params.karat);
      if (params.grams) setAddGrams(params.grams);
      if (params.locked) setLockPrice(true);
      setShowAddModal(true);
    }
  }, [params.action, params.karat, params.grams, params.locked]);

  // Load holdings from AsyncStorage + try Supabase sync
  const loadHoldings = useCallback(async () => {
    try {
      // First load from local storage
      const raw = await AsyncStorage.getItem(VAULT_STORAGE_KEY);
      if (raw) {
        setHoldings(JSON.parse(raw));
      }

      // Try to sync from Supabase if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: cloudHoldings, error } = await supabase
          .from('vault_holdings')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && cloudHoldings && cloudHoldings.length > 0) {
          const mapped: VaultHolding[] = cloudHoldings.map((h: any) => ({
            id: h.id,
            grams: h.grams,
            karat: h.karat,
            lockedPriceUsd: h.locked_price_usd,
            addedAt: h.created_at,
            label: h.label,
          }));
          setHoldings(mapped);
          await AsyncStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(mapped));
        }
      }
    } catch (e) {
      console.error('Vault load error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveHoldings = useCallback(async (updated: VaultHolding[]) => {
    try {
      await AsyncStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Vault save error:', e);
    }
  }, []);

  // Sync to Supabase (bank-grade)
  const syncToCloud = useCallback(async (holding: VaultHolding) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('vault_holdings').insert({
          id: holding.id,
          user_id: session.user.id,
          grams: holding.grams,
          karat: holding.karat,
          locked_price_usd: holding.lockedPriceUsd,
          label: holding.label,
        });
      }
    } catch (e) {
      // Silently fail cloud sync - local is source of truth
      console.error('Cloud sync error:', e);
    }
  }, []);

  const deleteFromCloud = useCallback(async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('vault_holdings').delete().eq('id', id);
      }
    } catch (e) {
      console.error('Cloud delete error:', e);
    }
  }, []);

  useEffect(() => {
    loadHoldings();
  }, [loadHoldings]);

  const handleAddHolding = useCallback(async () => {
    Keyboard.dismiss();
    const gramsNum = parseFloat(addGrams);
    if (isNaN(gramsNum) || gramsNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid weight in grams.');
      return;
    }

    setIsSaving(true);

    const purityFactor = KARAT_FACTORS[addKarat] || 0.999;
    const lockedPrice = lockPrice ? prices.goldPricePerGram * purityFactor : null;

    const newHolding: VaultHolding = {
      id: generateId(),
      grams: gramsNum,
      karat: addKarat,
      lockedPriceUsd: lockedPrice,
      addedAt: new Date().toISOString(),
      label: addLabel.trim() || `${addKarat.toUpperCase()} Gold`,
    };

    const updated = [newHolding, ...holdings];
    setHoldings(updated);
    await saveHoldings(updated);
    await syncToCloud(newHolding);

    setIsSaving(false);
    setShowAddModal(false);

    // Trigger Vault Entry Animation
    setAnimGrams(gramsNum);
    setAnimKarat(addKarat);
    setShowVaultAnimation(true);

    // Reset form
    setAddGrams('');
    setAddLabel('');
    setAddKarat('24k');
  }, [addGrams, addKarat, addLabel, lockPrice, holdings, prices, saveHoldings, syncToCloud]);

  const handleRemoveHolding = useCallback(
    (id: string) => {
      Alert.alert(
        'Remove Holding',
        'Are you sure you want to remove this vault entry?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              const updated = holdings.filter((h) => h.id !== id);
              setHoldings(updated);
              await saveHoldings(updated);
              await deleteFromCloud(id);
            },
          },
        ]
      );
    },
    [holdings, saveHoldings, deleteFromCloud]
  );

  // Calculate totals
  const totalGrams = holdings.reduce((sum, h) => sum + h.grams, 0);
  const totalCurrentValueUsd = holdings.reduce((sum, h) => {
    const factor = KARAT_FACTORS[h.karat] || 0.999;
    return sum + h.grams * prices.goldPricePerGram * factor;
  }, 0);
  const totalLockedValueUsd = holdings.reduce((sum, h) => {
    if (h.lockedPriceUsd) return sum + h.grams * h.lockedPriceUsd;
    const factor = KARAT_FACTORS[h.karat] || 0.999;
    return sum + h.grams * prices.goldPricePerGram * factor;
  }, 0);
  const pnlUsd = totalCurrentValueUsd - totalLockedValueUsd;
  const pnlPercent = totalLockedValueUsd > 0 ? (pnlUsd / totalLockedValueUsd) * 100 : 0;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <LinearGradient colors={Gradients.carbonDepth} style={StyleSheet.absoluteFill} />
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={styles.loadingText}>Unlocking vault...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Gradients.carbonDepth}
        style={StyleSheet.absoluteFill}
      />

      {/* Vault Entry Animation */}
      <VaultEntryAnimation
        visible={showVaultAnimation}
        grams={animGrams}
        karat={animKarat}
        onComplete={() => setShowVaultAnimation(false)}
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
            <Text style={styles.headerTitle}>Digital Vault</Text>
            <Text style={styles.headerSubtitle}>BANK-GRADE SECURITY</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={22} color={Colors.champagneGold} />
          </TouchableOpacity>
        </View>

        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <Ionicons name="lock-closed" size={11} color={Colors.secureGreen} />
          <Text style={styles.securityText}>RLS Protected • End-to-End Encrypted</Text>
        </View>

        {/* Vault Hero */}
        <GlassmorphicCard vaultStyle style={styles.vaultHero}>
          <LinearGradient
            colors={['rgba(201,169,78,0.15)', 'rgba(15,15,20,0.9)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroIcon}>
              <Ionicons name="shield-checkmark" size={36} color={Colors.champagneGold} />
            </View>
            <Text style={styles.heroTitle}>Your Gold Portfolio</Text>
            <Text style={styles.heroTotalLabel}>Total Holdings</Text>
            <Text style={styles.heroTotalGrams}>
              {totalGrams.toFixed(3)} <Text style={styles.heroUnit}>grams</Text>
            </Text>
            <GoldShimmer width={200} height={2} style={{ marginVertical: 12, alignSelf: 'center' }} />
            <View style={styles.heroValues}>
              <View style={styles.heroValueItem}>
                <Text style={styles.heroValueLabel}>Current Value</Text>
                <Text style={styles.heroValueAmount}>
                  ${totalCurrentValueUsd.toFixed(2)}
                </Text>
              </View>
              <View style={styles.heroValueDivider} />
              <View style={styles.heroValueItem}>
                <Text style={styles.heroValueLabel}>P&L</Text>
                <Text style={[
                  styles.heroValueAmount,
                  { color: pnlUsd >= 0 ? Colors.green : Colors.red },
                ]}>
                  {pnlUsd >= 0 ? '+' : ''}${pnlUsd.toFixed(2)}
                  {'\n'}
                  <Text style={styles.heroValuePct}>
                    ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                  </Text>
                </Text>
              </View>
            </View>
          </LinearGradient>
        </GlassmorphicCard>

        {/* Holdings */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>VAULT ENTRIES</Text>
          <View style={styles.sectionLine} />
        </View>

        {holdings.length === 0 ? (
          <GlassmorphicCard titaniumBorder style={styles.emptyCard}>
            <View style={styles.emptyContent}>
              <Ionicons name="cube-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Holdings Yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your first gold holding to start tracking your virtual portfolio.
              </Text>
              <TouchableOpacity
                style={styles.emptyAddBtn}
                onPress={() => setShowAddModal(true)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[Colors.champagneGold, Colors.gold]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.emptyAddGradient}
                >
                  <Ionicons name="add" size={18} color={Colors.carbonBlack} />
                  <Text style={styles.emptyAddText}>Add Holding</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </GlassmorphicCard>
        ) : (
          holdings.map((holding) => {
            const factor = KARAT_FACTORS[holding.karat] || 0.999;
            const currentValueUsd = holding.grams * prices.goldPricePerGram * factor;
            const lockedValue = holding.lockedPriceUsd
              ? holding.grams * holding.lockedPriceUsd
              : currentValueUsd;
            const holdingPnl = currentValueUsd - lockedValue;
            const holdingDate = new Date(holding.addedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <GlassmorphicCard key={holding.id} highlight style={styles.holdingCard}>
                <View style={styles.holdingHeader}>
                  <View style={styles.holdingTitleRow}>
                    <View style={styles.karatBadge}>
                      <Text style={styles.karatBadgeText}>{holding.karat.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.holdingLabel}>{holding.label}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveHolding(holding.id)}
                    style={styles.removeBtn}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={16} color={Colors.red} />
                  </TouchableOpacity>
                </View>

                <View style={styles.holdingStats}>
                  <View style={styles.holdingStat}>
                    <Text style={styles.holdingStatLabel}>Weight</Text>
                    <Text style={styles.holdingStatValue}>{holding.grams.toFixed(3)}g</Text>
                  </View>
                  <View style={styles.holdingStatDivider} />
                  <View style={styles.holdingStat}>
                    <Text style={styles.holdingStatLabel}>Current</Text>
                    <Text style={styles.holdingStatValue}>${currentValueUsd.toFixed(2)}</Text>
                  </View>
                  <View style={styles.holdingStatDivider} />
                  <View style={styles.holdingStat}>
                    <Text style={styles.holdingStatLabel}>P&L</Text>
                    <Text style={[
                      styles.holdingStatValue,
                      { color: holdingPnl >= 0 ? Colors.green : Colors.red },
                    ]}>
                      {holdingPnl >= 0 ? '+' : ''}${holdingPnl.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View style={styles.holdingFooter}>
                  {holding.lockedPriceUsd && (
                    <View style={styles.lockedPriceRow}>
                      <Ionicons name="lock-closed" size={11} color={Colors.gold} />
                      <Text style={styles.lockedPrice}>
                        Locked at ${holding.lockedPriceUsd.toFixed(2)}/g
                      </Text>
                    </View>
                  )}
                  <Text style={styles.holdingDate}>Added {holdingDate}</Text>
                </View>
              </GlassmorphicCard>
            );
          })
        )}

        {/* CTA to calculator */}
        <TouchableOpacity
          style={styles.calcCta}
          onPress={() => router.push('/(tabs)/calculator')}
          activeOpacity={0.7}
        >
          <View style={styles.calcCtaContent}>
            <Ionicons name="water-outline" size={20} color={Colors.textMuted} />
            <Text style={styles.calcCtaText}>
              Use the Liquidity Portal to estimate value before adding
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>

      {/* Add Holding Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss();
            setShowAddModal(false);
          }}
        >
          <View
            style={styles.modalSheet}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <LinearGradient
              colors={['rgba(20,20,24,0.99)', 'rgba(11,11,15,1)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.modalBorderTop} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vault Entry</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.modalClose}
              >
                <Ionicons name="close" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Label */}
            <Text style={styles.fieldLabel}>LABEL (OPTIONAL)</Text>
            <TextInput
              style={styles.textInput}
              value={addLabel}
              onChangeText={setAddLabel}
              placeholder="e.g. Investment bar, Heritage jewelry"
              placeholderTextColor={Colors.textMuted}
              returnKeyType="next"
            />

            {/* Grams */}
            <Text style={styles.fieldLabel}>WEIGHT (GRAMS)</Text>
            <TextInput
              style={styles.textInput}
              value={addGrams}
              onChangeText={setAddGrams}
              placeholder="0.000"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />

            {/* Karat */}
            <Text style={styles.fieldLabel}>KARAT</Text>
            <View style={styles.karatRow}>
              {KARAT_OPTIONS.map((k) => (
                <TouchableOpacity
                  key={k}
                  style={[styles.karatOption, addKarat === k && styles.karatOptionSelected]}
                  onPress={() => setAddKarat(k)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.karatOptionText, addKarat === k && styles.karatOptionTextSelected]}>
                    {k.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Lock price toggle */}
            <TouchableOpacity
              style={styles.lockRow}
              onPress={() => setLockPrice((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.lockCheckbox, lockPrice && styles.lockCheckboxChecked]}>
                {lockPrice && <Ionicons name="checkmark" size={14} color={Colors.carbonBlack} />}
              </View>
              <View style={styles.lockTextContainer}>
                <Text style={styles.lockLabel}>Lock in current price</Text>
                <Text style={styles.lockSub}>
                  Current {addKarat.toUpperCase()}: ${(prices.goldPricePerGram * (KARAT_FACTORS[addKarat] || 1)).toFixed(2)}/g
                </Text>
              </View>
            </TouchableOpacity>

            {/* Save button */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleAddHolding}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.champagneGold, Colors.gold, Colors.goldDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveBtnGradient}
              >
                {isSaving ? (
                  <ActivityIndicator color={Colors.carbonBlack} />
                ) : (
                  <>
                    <Ionicons name="shield-checkmark" size={20} color={Colors.carbonBlack} />
                    <Text style={styles.saveBtnText}>Secure in Vault</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.carbonBlack,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
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
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(138,138,154,0.1)',
    borderWidth: 1,
    borderColor: Colors.titaniumBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.xl,
    paddingVertical: 4,
  },
  securityText: {
    color: Colors.secureGreen,
    fontSize: FontSizes.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  vaultHero: {
    marginBottom: Spacing.xl,
  },
  heroGradient: {
    margin: -Spacing.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(201,169,78,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(201,169,78,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  heroTotalLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroTotalGrams: {
    color: Colors.champagneGold,
    fontSize: FontSizes.display,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroUnit: {
    fontSize: FontSizes.lg,
    fontWeight: '300',
    color: Colors.textMuted,
  },
  heroValues: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  heroValueItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  heroValueDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(138,138,154,0.15)',
  },
  heroValueLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroValueAmount: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroValuePct: {
    fontSize: FontSizes.xs,
    fontWeight: '400',
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
    backgroundColor: 'rgba(212,175,55,0.1)',
  },
  emptyCard: {
    marginBottom: Spacing.lg,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyTitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xl,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.xl,
  },
  emptyAddBtn: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  emptyAddGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  emptyAddText: {
    color: Colors.carbonBlack,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  holdingCard: {
    marginBottom: Spacing.md,
  },
  holdingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  holdingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  karatBadge: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)',
  },
  karatBadgeText: {
    color: Colors.gold,
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  holdingLabel: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
    flex: 1,
  },
  removeBtn: {
    padding: 6,
  },
  holdingStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    backgroundColor: 'rgba(138,138,154,0.04)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  holdingStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  holdingStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(138,138,154,0.15)',
  },
  holdingStatLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
  holdingStatValue: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  holdingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lockedPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockedPrice: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
  holdingDate: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
  calcCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(138,138,154,0.04)',
    borderWidth: 1,
    borderColor: Colors.titaniumBorder,
    marginTop: Spacing.md,
  },
  calcCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  calcCtaText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    flex: 1,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    paddingBottom: 40,
    overflow: 'hidden',
    position: 'relative',
  },
  modalBorderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(201,169,78,0.4)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    color: Colors.champagneGold,
    fontSize: FontSizes.xl,
    fontWeight: '200',
    letterSpacing: 1,
  },
  modalClose: {
    padding: 4,
  },
  fieldLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  textInput: {
    backgroundColor: 'rgba(138,138,154,0.06)',
    borderWidth: 1,
    borderColor: Colors.titaniumBorder,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.white,
    fontSize: FontSizes.lg,
    marginBottom: Spacing.lg,
  },
  karatRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  karatOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.titaniumBorder,
    alignItems: 'center',
    backgroundColor: 'rgba(138,138,154,0.04)',
  },
  karatOptionSelected: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(212,175,55,0.1)',
  },
  karatOptionText: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  karatOptionTextSelected: {
    color: Colors.champagneGold,
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: 'rgba(212,175,55,0.04)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.12)',
  },
  lockCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(212,175,55,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockCheckboxChecked: {
    backgroundColor: Colors.champagneGold,
    borderColor: Colors.champagneGold,
  },
  lockTextContainer: {
    flex: 1,
  },
  lockLabel: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  lockSub: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  saveBtn: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  saveBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  saveBtnText: {
    color: Colors.carbonBlack,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
