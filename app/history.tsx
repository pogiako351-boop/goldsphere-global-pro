import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import SimpleLineChart from '@/components/SimpleLineChart';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { generateDailyPrices, generateHistoricalData } from '@/constants/goldData';

const VIEW_MODES = ['Daily', 'Weekly', 'Monthly'];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState(0);
  const [showChart, setShowChart] = useState(true);
  const screenWidth = Dimensions.get('window').width;

  const dataCount = viewMode === 0 ? 14 : 12;

  const tableData = useMemo(() => generateDailyPrices(dataCount), [dataCount]);
  const chartData = useMemo(() => {
    const days = viewMode === 0 ? 14 : viewMode === 1 ? 84 : 365;
    return generateHistoricalData(days);
  }, [viewMode]);

  const handleExport = () => {
    Alert.alert(
      'Premium Feature',
      'Export data to CSV is available for Premium subscribers.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => router.push('/premium') },
      ]
    );
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
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Price History</Text>
            <Text style={styles.headerSubtitle}>24K GOLD / USD PER GRAM</Text>
          </View>
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={handleExport}
            activeOpacity={0.7}
          >
            <Ionicons name="download-outline" size={20} color={Colors.gold} />
          </TouchableOpacity>
        </View>

        {/* View Mode Selector */}
        <View style={styles.viewModeRow}>
          {VIEW_MODES.map((mode, index) => {
            const isSelected = viewMode === index;
            return (
              <TouchableOpacity
                key={mode}
                style={[styles.viewModeBtn, isSelected && styles.viewModeBtnSelected]}
                onPress={() => setViewMode(index)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.viewModeBtnText,
                    isSelected && styles.viewModeBtnTextSelected,
                  ]}
                >
                  {mode}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Toggle Chart/Table */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, showChart && styles.toggleBtnSelected]}
            onPress={() => setShowChart(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="analytics-outline"
              size={18}
              color={showChart ? Colors.gold : Colors.textMuted}
            />
            <Text
              style={[styles.toggleBtnText, showChart && styles.toggleBtnTextSelected]}
            >
              Chart
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !showChart && styles.toggleBtnSelected]}
            onPress={() => setShowChart(false)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="list-outline"
              size={18}
              color={!showChart ? Colors.gold : Colors.textMuted}
            />
            <Text
              style={[styles.toggleBtnText, !showChart && styles.toggleBtnTextSelected]}
            >
              Table
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chart View */}
        {showChart && (
          <GlassmorphicCard style={styles.chartCard}>
            <Text style={styles.chartTitle}>
              {VIEW_MODES[viewMode]} Price Trend
            </Text>
            <SimpleLineChart
              data={chartData}
              width={screenWidth - 72}
              height={240}
              accentColor={Colors.gold}
            />
          </GlassmorphicCard>
        )}

        {/* Table View */}
        {!showChart && (
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.dateCell]}>Date</Text>
              <Text style={styles.tableHeaderCell}>Open</Text>
              <Text style={styles.tableHeaderCell}>High</Text>
              <Text style={styles.tableHeaderCell}>Low</Text>
              <Text style={styles.tableHeaderCell}>Close</Text>
              <Text style={[styles.tableHeaderCell, styles.changeCell]}>Chg</Text>
            </View>

            {/* Table Rows */}
            {tableData.map((row, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 0 && styles.tableRowEven,
                ]}
              >
                <Text style={[styles.tableCell, styles.dateCell, styles.dateCellText]}>
                  {row.date}
                </Text>
                <Text style={styles.tableCell}>${row.open.toFixed(2)}</Text>
                <Text style={[styles.tableCell, { color: Colors.green }]}>
                  ${row.high.toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, { color: Colors.red }]}>
                  ${row.low.toFixed(2)}
                </Text>
                <Text style={styles.tableCell}>${row.close.toFixed(2)}</Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.changeCell,
                    { color: row.change >= 0 ? Colors.green : Colors.red },
                  ]}
                >
                  {row.change >= 0 ? '+' : ''}{row.change.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Export Premium Button */}
        <TouchableOpacity
          style={styles.premiumExportBtn}
          onPress={handleExport}
          activeOpacity={0.7}
        >
          <GlassmorphicCard highlight>
            <View style={styles.premiumExportRow}>
              <Ionicons name="diamond" size={22} color={Colors.gold} />
              <View style={styles.premiumExportContent}>
                <Text style={styles.premiumExportTitle}>Export Data (Premium)</Text>
                <Text style={styles.premiumExportDesc}>
                  Download historical data as CSV
                </Text>
              </View>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PRO</Text>
              </View>
            </View>
          </GlassmorphicCard>
        </TouchableOpacity>
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
  headerCenter: {
    alignItems: 'center',
    flex: 1,
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
  exportBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewModeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  viewModeBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  viewModeBtnSelected: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  viewModeBtnText: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  viewModeBtnTextSelected: {
    color: Colors.gold,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  toggleBtn: {
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
  toggleBtnSelected: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  toggleBtnText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  toggleBtnTextSelected: {
    color: Colors.gold,
  },
  chartCard: {
    marginBottom: Spacing.xl,
  },
  chartTitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  tableContainer: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  tableHeaderCell: {
    flex: 1,
    color: Colors.gold,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  tableRowEven: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  tableCell: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    textAlign: 'center',
  },
  dateCell: {
    flex: 1.5,
  },
  dateCellText: {
    color: Colors.textPrimary,
    fontWeight: '500',
    textAlign: 'left',
  },
  changeCell: {
    flex: 0.8,
  },
  premiumExportBtn: {
    marginBottom: Spacing.lg,
  },
  premiumExportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  premiumExportContent: {
    flex: 1,
  },
  premiumExportTitle: {
    color: Colors.goldLight,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  premiumExportDesc: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  premiumBadge: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  premiumBadgeText: {
    color: Colors.black,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
