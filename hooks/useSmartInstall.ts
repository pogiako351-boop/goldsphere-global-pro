import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@goldsphere_calc_count';
const DISMISSED_KEY = '@goldsphere_install_dismissed';
const CALCULATION_THRESHOLD = 2;

/**
 * Smart Install hook that tracks calculation usage in the Liquidity Portal.
 * The install prompt triggers only after the user completes their 2nd calculation,
 * ensuring we only prompt highly engaged users.
 */
export function useSmartInstall() {
  const [calculationCount, setCalculationCount] = useState(0);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted state
  useEffect(() => {
    const loadState = async () => {
      try {
        const [countStr, dismissedStr] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(DISMISSED_KEY),
        ]);

        if (countStr !== null) {
          setCalculationCount(parseInt(countStr, 10));
        }
        if (dismissedStr !== null) {
          setIsDismissed(JSON.parse(dismissedStr));
        }
      } catch (error) {
        console.error('Error loading smart install state:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadState();
  }, []);

  // Check if we're in a PWA standalone mode already
  const isStandalone = Platform.OS === 'web' && typeof window !== 'undefined' && (
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    (window.navigator as any).standalone === true
  );

  /**
   * Increment the calculation counter. Call this after each successful calculation.
   * Will trigger the install banner once the threshold is reached.
   */
  const incrementCalculation = useCallback(async () => {
    if (Platform.OS !== 'web' || isStandalone || isDismissed) return;

    const newCount = calculationCount + 1;
    setCalculationCount(newCount);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, newCount.toString());
    } catch (error) {
      console.error('Error saving calculation count:', error);
    }

    // Trigger banner exactly when threshold is reached
    if (newCount === CALCULATION_THRESHOLD && !isDismissed) {
      // Small delay to let calculation results render first
      setTimeout(() => {
        setShowInstallBanner(true);
      }, 1500);
    }
  }, [calculationCount, isDismissed, isStandalone]);

  /**
   * Dismiss the install banner and persist the dismissal.
   */
  const dismissBanner = useCallback(async () => {
    setShowInstallBanner(false);
    setIsDismissed(true);

    try {
      await AsyncStorage.setItem(DISMISSED_KEY, 'true');
    } catch (error) {
      console.error('Error saving dismiss state:', error);
    }
  }, []);

  return {
    calculationCount,
    showInstallBanner,
    dismissBanner,
    incrementCalculation,
    isLoaded,
    isStandalone,
  };
}
