import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import AdBanner from '@/components/AdBanner';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useLocalStorage, STORAGE_KEYS } from '@/hooks/useLocalStorage';

interface PriceAlert {
  id: string;
  metal: string;
  condition: 'above' | 'below';
  price: number;
  enabled: boolean;
}

const defaultAlerts: PriceAlert[] = [
  { id: '1', metal: '24K Gold', condition: 'above', price: 80.0, enabled: true },
  { id: '2', metal: '24K Gold', condition: 'below', price: 75.0, enabled: true },
  { id: '3', metal: '22K Gold', condition: 'above', price: 74.0, enabled: false },
];

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const { value: storedAlerts, setValue: saveAlerts, isLoaded } = useLocalStorage<PriceAlert[]>(
    STORAGE_KEYS.ALERTS,
    defaultAlerts
  );
  const [alerts, setAlerts] = useState<PriceAlert[]>(defaultAlerts);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMetal, setNewMetal] = useState('24K Gold');
  const [newCondition, setNewCondition] = useState<'above' | 'below'>('above');
  const [newPrice, setNewPrice] = useState('');

  // Load alerts from storage
  useEffect(() => {
    if (isLoaded) {
      setAlerts(storedAlerts);
    }
  }, [isLoaded, storedAlerts]);

  // Save alerts to storage whenever they change
  const updateAlerts = (newAlerts: PriceAlert[]) => {
    setAlerts(newAlerts);
    saveAlerts(newAlerts);
  };

  const toggleAlert = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
    updateAlerts(updated);
  };

  const deleteAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    updateAlerts(updated);
  };

  const addAlert = () => {
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price amount.');
      return;
    }

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      metal: newMetal,
      condition: newCondition,
      price: priceNum,
      enabled: true,
    };

    updateAlerts([...alerts, newAlert]);
    setNewPrice('');
    setShowAddForm(false);
  };

  const metals = ['24K Gold', '22K Gold', '18K Gold', '14K Gold', 'Silver'];

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
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Alerts</Text>
            <Text style={styles.headerSubtitle}>PRICE NOTIFICATIONS</Text>
          </View>
          <View style={styles.closeBtnPlaceholder} />
        </View>

        {/* Push Notifications Toggle */}
        <GlassmorphicCard highlight style={styles.pushCard}>
          <View style={styles.pushRow}>
            <View style={styles.pushIcon}>
              <Ionicons name="notifications" size={22} color={Colors.gold} />
            </View>
            <View style={styles.pushContent}>
              <Text style={styles.pushLabel}>Push Notifications</Text>
              <Text style={styles.pushSubtext}>
                {pushEnabled ? 'Enabled - you will receive price alerts' : 'Disabled'}
              </Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#333', true: 'rgba(212, 175, 55, 0.4)' }}
              thumbColor={pushEnabled ? Colors.gold : '#888'}
            />
          </View>
        </GlassmorphicCard>

        {/* Alerts List */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ellipse" size={8} color={Colors.gold} />
          <Text style={styles.sectionTitle}>YOUR ALERTS</Text>
          <View style={styles.sectionLine} />
          <Text style={styles.alertCount}>{alerts.length}</Text>
        </View>

        {alerts.length === 0 ? (
          <GlassmorphicCard style={styles.emptyCard}>
            <View style={styles.emptyContent}>
              <Ionicons name="notifications-off-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Alerts Set</Text>
              <Text style={styles.emptySubtext}>
                Tap the button below to create your first price alert
              </Text>
            </View>
          </GlassmorphicCard>
        ) : (
          alerts.map((alert) => (
            <GlassmorphicCard key={alert.id} style={styles.alertCard}>
              <View style={styles.alertRow}>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertMetal}>{alert.metal}</Text>
                  <View style={styles.alertConditionRow}>
                    <Ionicons
                      name={alert.condition === 'above' ? 'arrow-up-circle' : 'arrow-down-circle'}
                      size={16}
                      color={alert.condition === 'above' ? Colors.green : Colors.red}
                    />
                    <Text style={styles.alertConditionText}>
                      {alert.condition === 'above' ? 'Goes above' : 'Goes below'}{' '}
                      <Text style={styles.alertPrice}>${alert.price.toFixed(2)}</Text>/g
                    </Text>
                  </View>
                </View>
                <View style={styles.alertActions}>
                  <Switch
                    value={alert.enabled}
                    onValueChange={() => toggleAlert(alert.id)}
                    trackColor={{ false: '#333', true: 'rgba(212, 175, 55, 0.4)' }}
                    thumbColor={alert.enabled ? Colors.gold : '#888'}
                  />
                  <TouchableOpacity
                    onPress={() => deleteAlert(alert.id)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="trash-outline" size={18} color={Colors.red} />
                  </TouchableOpacity>
                </View>
              </View>
            </GlassmorphicCard>
          ))
        )}

        {/* Add Alert Form */}
        {showAddForm && (
          <GlassmorphicCard highlight style={styles.addFormCard}>
            <Text style={styles.addFormTitle}>New Price Alert</Text>

            <Text style={styles.formLabel}>METAL</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.metalScroll}
              contentContainerStyle={styles.metalScrollContent}
            >
              {metals.map((metal) => (
                <TouchableOpacity
                  key={metal}
                  style={[
                    styles.metalOption,
                    newMetal === metal && styles.metalOptionSelected,
                  ]}
                  onPress={() => setNewMetal(metal)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.metalOptionText,
                      newMetal === metal && styles.metalOptionTextSelected,
                    ]}
                  >
                    {metal}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.formLabel}>CONDITION</Text>
            <View style={styles.conditionRow}>
              <TouchableOpacity
                style={[
                  styles.conditionBtn,
                  newCondition === 'above' && styles.conditionBtnSelectedUp,
                ]}
                onPress={() => setNewCondition('above')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="arrow-up-circle"
                  size={18}
                  color={newCondition === 'above' ? Colors.green : Colors.textMuted}
                />
                <Text
                  style={[
                    styles.conditionBtnText,
                    newCondition === 'above' && { color: Colors.green },
                  ]}
                >
                  Goes Above
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.conditionBtn,
                  newCondition === 'below' && styles.conditionBtnSelectedDown,
                ]}
                onPress={() => setNewCondition('below')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="arrow-down-circle"
                  size={18}
                  color={newCondition === 'below' ? Colors.red : Colors.textMuted}
                />
                <Text
                  style={[
                    styles.conditionBtnText,
                    newCondition === 'below' && { color: Colors.red },
                  ]}
                >
                  Goes Below
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.formLabel}>PRICE (USD/GRAM)</Text>
            <View style={styles.priceInputRow}>
              <Text style={styles.priceSymbol}>$</Text>
              <TextInput
                style={styles.priceInput}
                value={newPrice}
                onChangeText={setNewPrice}
                placeholder="0.00"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowAddForm(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={addAlert} activeOpacity={0.7}>
                <LinearGradient
                  colors={[Colors.goldLight, Colors.gold]}
                  style={styles.saveBtnGradient}
                >
                  <Text style={styles.saveBtnText}>Save Alert</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </GlassmorphicCard>
        )}

        {/* Add Alert Button */}
        {!showAddForm && (
          <TouchableOpacity
            style={styles.addAlertBtn}
            onPress={() => setShowAddForm(true)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold, Colors.goldDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addAlertGradient}
            >
              <Ionicons name="add-circle" size={22} color={Colors.black} />
              <Text style={styles.addAlertText}>Add New Alert</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Ad Banner */}
        <AdBanner placement="mid" />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPlaceholder: {
    width: 40,
  },
  headerCenter: {
    alignItems: 'center',
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
  pushCard: {
    marginBottom: Spacing.xxl,
  },
  pushRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  pushIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pushContent: {
    flex: 1,
  },
  pushLabel: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  pushSubtext: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    marginTop: 2,
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
  alertCount: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  emptyCard: {
    marginBottom: Spacing.xl,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  emptySubtext: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  alertCard: {
    marginBottom: Spacing.sm,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertInfo: {
    flex: 1,
    gap: 4,
  },
  alertMetal: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  alertConditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertConditionText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  alertPrice: {
    color: Colors.goldLight,
    fontWeight: '700',
  },
  alertActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  addFormCard: {
    marginBottom: Spacing.xl,
  },
  addFormTitle: {
    color: Colors.gold,
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  formLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  metalScroll: {
    marginBottom: Spacing.sm,
  },
  metalScrollContent: {
    gap: Spacing.sm,
  },
  metalOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  metalOptionSelected: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  metalOptionText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  metalOptionTextSelected: {
    color: Colors.gold,
  },
  conditionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  conditionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  conditionBtnSelectedUp: {
    borderColor: Colors.green,
    backgroundColor: 'rgba(0, 200, 83, 0.08)',
  },
  conditionBtnSelectedDown: {
    borderColor: Colors.red,
    backgroundColor: 'rgba(255, 23, 68, 0.08)',
  },
  conditionBtnText: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  priceSymbol: {
    color: Colors.gold,
    fontSize: FontSizes.xxl,
    fontWeight: '600',
  },
  priceInput: {
    flex: 1,
    color: Colors.white,
    fontSize: FontSizes.xxl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  formButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  saveBtnGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  saveBtnText: {
    color: Colors.black,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  addAlertBtn: {
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  addAlertGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  addAlertText: {
    color: Colors.black,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
