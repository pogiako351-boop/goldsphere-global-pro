import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle, Line, Text as SvgText } from 'react-native-svg';
import { Colors, FontSizes, Spacing } from '@/constants/theme';

interface DataPoint {
  date: string;
  price: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  accentColor?: string;
}

export default function SimpleLineChart({
  data,
  width: propWidth,
  height = 220,
  showGrid = true,
  accentColor = Colors.gold,
}: SimpleLineChartProps) {
  const screenWidth = Dimensions.get('window').width;
  const width = propWidth || screenWidth - 64;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const padding = useMemo(() => ({ top: 20, right: 16, bottom: 30, left: 50 }), []);
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const handleTouch = useCallback(
    (touchX: number) => {
      if (data.length === 0) return;
      const relativeX = touchX - padding.left;
      const index = Math.round((relativeX / chartWidth) * (data.length - 1));
      if (index >= 0 && index < data.length) {
        setSelectedIndex(index);
      }
    },
    [data.length, chartWidth, padding.left]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          handleTouch(evt.nativeEvent.locationX);
        },
        onPanResponderMove: (evt: GestureResponderEvent) => {
          handleTouch(evt.nativeEvent.locationX);
        },
        onPanResponderRelease: () => {
          setSelectedIndex(null);
        },
      }),
    [handleTouch]
  );

  if (data.length === 0) return null;

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (price: number) =>
    padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;

  // Build path
  let pathD = '';
  let areaD = '';
  data.forEach((point, i) => {
    const x = getX(i);
    const y = getY(point.price);
    if (i === 0) {
      pathD += `M ${x} ${y}`;
      areaD += `M ${x} ${padding.top + chartHeight} L ${x} ${y}`;
    } else {
      pathD += ` L ${x} ${y}`;
      areaD += ` L ${x} ${y}`;
    }
  });
  areaD += ` L ${getX(data.length - 1)} ${padding.top + chartHeight} Z`;

  // Grid lines
  const gridLines = 4;
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) =>
    minPrice + (priceRange / gridLines) * i
  );

  const selected = selectedIndex !== null ? data[selectedIndex] : null;

  return (
    <View style={styles.container}>
      {selected && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipDate}>{selected.date}</Text>
          <Text style={[styles.tooltipPrice, { color: accentColor }]}>
            ${selected.price.toFixed(2)}
          </Text>
        </View>
      )}
      <View {...panResponder.panHandlers}>
        <Svg width={width} height={height}>
          <Defs>
            <SvgLinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={accentColor} stopOpacity="0.3" />
              <Stop offset="1" stopColor={accentColor} stopOpacity="0" />
            </SvgLinearGradient>
          </Defs>

          {/* Grid */}
          {showGrid &&
            gridValues.map((val, i) => {
              const y = getY(val);
              return (
                <React.Fragment key={i}>
                  <Line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={1}
                  />
                  <SvgText
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize={10}
                    fill={Colors.textMuted}
                  >
                    ${val.toFixed(1)}
                  </SvgText>
                </React.Fragment>
              );
            })}

          {/* Area fill */}
          <Path d={areaD} fill="url(#areaGrad)" />

          {/* Line */}
          <Path d={pathD} stroke={accentColor} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Selected indicator */}
          {selectedIndex !== null && (
            <>
              <Line
                x1={getX(selectedIndex)}
                y1={padding.top}
                x2={getX(selectedIndex)}
                y2={padding.top + chartHeight}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <Circle
                cx={getX(selectedIndex)}
                cy={getY(data[selectedIndex].price)}
                r={6}
                fill={accentColor}
                stroke={Colors.white}
                strokeWidth={2}
              />
            </>
          )}

          {/* X-axis labels */}
          {data.length <= 10
            ? data.map((point, i) => (
                <SvgText
                  key={i}
                  x={getX(i)}
                  y={height - 5}
                  textAnchor="middle"
                  fontSize={9}
                  fill={Colors.textMuted}
                >
                  {point.date.slice(5)}
                </SvgText>
              ))
            : [0, Math.floor(data.length / 4), Math.floor(data.length / 2), Math.floor((3 * data.length) / 4), data.length - 1].map(
                (i) => (
                  <SvgText
                    key={i}
                    x={getX(i)}
                    y={height - 5}
                    textAnchor="middle"
                    fontSize={9}
                    fill={Colors.textMuted}
                  >
                    {data[i].date.slice(5)}
                  </SvgText>
                )
              )}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  tooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    alignSelf: 'center',
  },
  tooltipDate: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  tooltipPrice: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
});
