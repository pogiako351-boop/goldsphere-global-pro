import { useState, useEffect, useRef, useCallback } from 'react';

export interface VolatilityAlert {
  id: string;
  metal: 'gold' | 'silver';
  changePercent: number;
  direction: 'up' | 'down';
  magnitude: 'moderate' | 'high' | 'extreme';
  timestamp: number;
  dismissed: boolean;
}

interface PriceData {
  goldChangePercent: number;
  silverChangePercent: number;
}

const THRESHOLD_MODERATE = 0.5;
const THRESHOLD_HIGH = 1.5;
const THRESHOLD_EXTREME = 3.0;

function getMagnitude(absPercent: number): 'moderate' | 'high' | 'extreme' {
  if (absPercent >= THRESHOLD_EXTREME) return 'extreme';
  if (absPercent >= THRESHOLD_HIGH) return 'high';
  return 'moderate';
}

export function useVolatilityAlerts(prices: PriceData | null) {
  const [alerts, setAlerts] = useState<VolatilityAlert[]>([]);
  const prevPricesRef = useRef<PriceData | null>(null);
  const alertCooldownRef = useRef<Record<string, number>>({});

  const checkVolatility = useCallback((current: PriceData) => {
    const now = Date.now();
    const newAlerts: VolatilityAlert[] = [];

    const metals: Array<{ key: 'gold' | 'silver'; percent: number }> = [
      { key: 'gold', percent: current.goldChangePercent },
      { key: 'silver', percent: current.silverChangePercent },
    ];

    for (const { key, percent } of metals) {
      const absPercent = Math.abs(percent);

      if (absPercent >= THRESHOLD_MODERATE) {
        // Check cooldown (don't re-alert within 5 minutes for same metal)
        const lastAlert = alertCooldownRef.current[key] || 0;
        if (now - lastAlert < 5 * 60 * 1000) continue;

        alertCooldownRef.current[key] = now;

        newAlerts.push({
          id: `${key}-${now}`,
          metal: key,
          changePercent: percent,
          direction: percent >= 0 ? 'up' : 'down',
          magnitude: getMagnitude(absPercent),
          timestamp: now,
          dismissed: false,
        });
      }
    }

    if (newAlerts.length > 0) {
      setAlerts((prev) => [...newAlerts, ...prev.slice(0, 4)]); // Keep max 5 alerts
    }
  }, []);

  useEffect(() => {
    if (!prices) return;

    // On initial load, trigger if there's significant movement
    if (!prevPricesRef.current) {
      prevPricesRef.current = prices;
      checkVolatility(prices);
      return;
    }

    // Check for change from previous data
    const goldChanged = Math.abs(prices.goldChangePercent - prevPricesRef.current.goldChangePercent) > 0.1;
    const silverChanged = Math.abs(prices.silverChangePercent - prevPricesRef.current.silverChangePercent) > 0.1;

    if (goldChanged || silverChanged) {
      checkVolatility(prices);
    }

    prevPricesRef.current = prices;
  }, [prices, checkVolatility]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, dismissed: true } : a))
    );
    // Remove after animation
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 300);
  }, []);

  const dismissAll = useCallback(() => {
    setAlerts([]);
  }, []);

  const activeAlerts = alerts.filter((a) => !a.dismissed);

  return { alerts: activeAlerts, dismissAlert, dismissAll };
}
