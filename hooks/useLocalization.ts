import { useState, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';

export interface LocalizationConfig {
  region: string;
  currency: string;
  currencySymbol: string;
  weightUnit: 'gram' | 'tola' | 'baht' | 'troy_oz';
  weightLabel: string;
  preferredKarat: '24K' | '22K' | '18K' | '14K';
  preferredKaratFactor: number;
  locale: string;
}

const REGION_CONFIGS: Record<string, LocalizationConfig> = {
  // Asia / South Asia — prefer 22K, tola/gram
  IN: {
    region: 'IN',
    currency: 'INR',
    currencySymbol: '₹',
    weightUnit: 'gram',
    weightLabel: 'gram',
    preferredKarat: '22K',
    preferredKaratFactor: 0.917,
    locale: 'en-IN',
  },
  AE: {
    region: 'AE',
    currency: 'AED',
    currencySymbol: 'AED',
    weightUnit: 'gram',
    weightLabel: 'gram',
    preferredKarat: '22K',
    preferredKaratFactor: 0.917,
    locale: 'ar-AE',
  },
  PK: {
    region: 'PK',
    currency: 'USD',
    currencySymbol: '$',
    weightUnit: 'tola',
    weightLabel: 'tola',
    preferredKarat: '22K',
    preferredKaratFactor: 0.917,
    locale: 'en-PK',
  },
  TH: {
    region: 'TH',
    currency: 'USD',
    currencySymbol: '$',
    weightUnit: 'baht',
    weightLabel: 'baht',
    preferredKarat: '22K',
    preferredKaratFactor: 0.917,
    locale: 'th-TH',
  },
  CN: {
    region: 'CN',
    currency: 'USD',
    currencySymbol: '$',
    weightUnit: 'gram',
    weightLabel: 'gram',
    preferredKarat: '24K',
    preferredKaratFactor: 0.999,
    locale: 'zh-CN',
  },
  // Western markets — prefer 24K, troy oz
  US: {
    region: 'US',
    currency: 'USD',
    currencySymbol: '$',
    weightUnit: 'troy_oz',
    weightLabel: 'troy oz',
    preferredKarat: '24K',
    preferredKaratFactor: 0.999,
    locale: 'en-US',
  },
  GB: {
    region: 'GB',
    currency: 'GBP',
    currencySymbol: '£',
    weightUnit: 'gram',
    weightLabel: 'gram',
    preferredKarat: '24K',
    preferredKaratFactor: 0.999,
    locale: 'en-GB',
  },
  DE: {
    region: 'DE',
    currency: 'EUR',
    currencySymbol: '€',
    weightUnit: 'gram',
    weightLabel: 'gram',
    preferredKarat: '24K',
    preferredKaratFactor: 0.999,
    locale: 'de-DE',
  },
  FR: {
    region: 'FR',
    currency: 'EUR',
    currencySymbol: '€',
    weightUnit: 'gram',
    weightLabel: 'gram',
    preferredKarat: '18K',
    preferredKaratFactor: 0.75,
    locale: 'fr-FR',
  },
};

const DEFAULT_CONFIG: LocalizationConfig = {
  region: 'US',
  currency: 'USD',
  currencySymbol: '$',
  weightUnit: 'gram',
  weightLabel: 'gram',
  preferredKarat: '24K',
  preferredKaratFactor: 0.999,
  locale: 'en-US',
};

// Weight conversion from grams
const WEIGHT_CONVERSIONS: Record<string, number> = {
  gram: 1,
  tola: 11.6638, // 1 tola = 11.6638 grams
  baht: 15.244, // 1 baht (Thai) = 15.244 grams
  troy_oz: 31.1035, // 1 troy oz = 31.1035 grams
};

function detectRegion(): string {
  try {
    if (Platform.OS === 'web') {
      const lang = navigator?.language || 'en-US';
      if (lang.includes('-')) {
        const code = lang.split('-')[1];
        return code.toUpperCase();
      }
    }

    // Use Intl locale detection
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (locale.includes('-')) {
      const parts = locale.split('-');
      const region = parts[parts.length - 1];
      if (region.length === 2) {
        return region.toUpperCase();
      }
    }
  } catch {
    // Fallback
  }
  return 'US';
}

export function useLocalization() {
  const [region, setRegion] = useState<string>('US');
  const [isDetected, setIsDetected] = useState(false);

  useEffect(() => {
    const detected = detectRegion();
    setRegion(detected);
    setIsDetected(true);
  }, []);

  const config = useMemo<LocalizationConfig>(() => {
    return REGION_CONFIGS[region] || DEFAULT_CONFIG;
  }, [region]);

  const convertFromGrams = useMemo(
    () => (grams: number) => {
      const conversionFactor = WEIGHT_CONVERSIONS[config.weightUnit] || 1;
      return grams / conversionFactor;
    },
    [config.weightUnit]
  );

  const convertToGrams = useMemo(
    () => (value: number) => {
      const conversionFactor = WEIGHT_CONVERSIONS[config.weightUnit] || 1;
      return value * conversionFactor;
    },
    [config.weightUnit]
  );

  const formatWeight = useMemo(
    () => (grams: number, decimals = 3) => {
      const converted = convertFromGrams(grams);
      return `${converted.toFixed(decimals)} ${config.weightLabel}`;
    },
    [convertFromGrams, config.weightLabel]
  );

  return {
    region,
    config,
    isDetected,
    convertFromGrams,
    convertToGrams,
    formatWeight,
    setRegion,
  };
}

export { REGION_CONFIGS, DEFAULT_CONFIG, WEIGHT_CONVERSIONS };
