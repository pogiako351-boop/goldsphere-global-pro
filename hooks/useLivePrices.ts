import { useState, useEffect, useCallback } from 'react';
import CONFIG from '@/config';

interface LivePriceData {
  goldPricePerOz: number;
  silverPricePerOz: number;
  goldPricePerGram: number;
  silverPricePerGram: number;
  goldChange24h: number;
  goldChangePercent: number;
  silverChange24h: number;
  silverChangePercent: number;
  lastUpdated: string;
  isLive: boolean;
  isStale?: boolean; // Added to track drift
}

/** * HIGH-PRECISION CONSTANT: 
 * Professional dollar-region standard is 31.1034768g per Troy Ounce.
 */
const TROY_OUNCE_GRAMS = 31.1034768;

const PURITY = {
  '24k': 0.999,
  '22k': 0.917,
  '18k': 0.750,
  '14k': 0.583,
};

/**
 * Updated Fallbacks for March 25, 2026 Volatility
 */
function getDefaultPrices(): LivePriceData {
  const goldPerGram = 4557.67 / TROY_OUNCE_GRAMS;
  const silverPerGram = 73.25 / TROY_OUNCE_GRAMS;
  return {
    goldPricePerOz: 4557.67,
    silverPricePerOz: 73.25,
    goldPricePerGram: Math.round(goldPerGram * 100) / 100,
    silverPricePerGram: Math.round(silverPerGram * 100) / 100,
    goldChange24h: 89.20,
    goldChangePercent: 2.00,
    silverChange24h: 1.45,
    silverChangePercent: 2.07,
    lastUpdated: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }),
    isLive: false,
    isStale: false,
  };
}

export function useLivePrices() {
  const [prices, setPrices] = useState<LivePriceData>(getDefaultPrices());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // ZERO-CACHE: Appending timestamp to bypass Netlify/Browser edge caching
      const cacheBuster = `?t=${Date.now()}`;
      
      const [goldRes, silverRes] = await Promise.all([
        fetch(`${CONFIG.GOLD_API_BASE_URL}/XAU/USD${cacheBuster}`, {
          headers: {
            'x-access-token': CONFIG.GOLD_API_KEY,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
        }),
        fetch(`${CONFIG.GOLD_API_BASE_URL}/XAG/USD${cacheBuster}`, {
          headers: {
            'x-access-token': CONFIG.GOLD_API_KEY,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
        }),
      ]);

      if (!goldRes.ok || !silverRes.ok) throw new Error('API Sync Failed');

      const goldData = await goldRes.json();
      const silverData = await silverRes.json();

      // DRIFT CHECK: Check if the data is older than 2 minutes
      const now = Math.floor(Date.now() / 1000);
      const isStale = (now - (goldData.timestamp || now)) > 120;

      // PRECISION MAPPING: Prioritize 'ask' price for dollar-region buyers
      const gPrice = goldData.ask || goldData.price;
      const sPrice = silverData.ask || silverData.price;

      const goldPerGram = gPrice / TROY_OUNCE_GRAMS;
      const silverPerGram = sPrice / TROY_OUNCE_GRAMS;

      setPrices({
        goldPricePerOz: gPrice,
        silverPricePerOz: sPrice,
        goldPricePerGram: Math.round(goldPerGram * 100) / 100,
        silverPricePerGram: Math.round(silverPerGram * 100) / 100,
        goldChange24h: Math.round((goldData.ch || 0) / TROY_OUNCE_GRAMS * 100) / 100,
        goldChangePercent: Math.round((goldData.chp || 0) * 100) / 100,
        silverChange24h: Math.round((silverData.ch || 0) / TROY_OUNCE_GRAMS * 100) / 100,
        silverChangePercent: Math.round((silverData.chp || 0) * 100) / 100,
        lastUpdated: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        isLive: true,
        isStale
      });
    } catch (err) {
      console.error('Precision Fetch Error:', err);
      setError('Live sync unavailable');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync Logic: Refresh every 30s + immediate fetch on window focus
  useEffect(() => {
    fetchPrices();
    
    const handleFocus = () => fetchPrices();
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(fetchPrices, 30000); // 30s High-Frequency
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchPrices]);

  const getKaratPrice = useCallback(
    (karat: keyof typeof PURITY) => {
      const purity = PURITY[karat];
      return Math.round(prices.goldPricePerGram * purity * 100) / 100;
    },
    [prices.goldPricePerGram]
  );

  const getKaratPriceOz = useCallback(
    (karat: keyof typeof PURITY) => {
      const purity = PURITY[karat];
      return Math.round(prices.goldPricePerOz * purity * 100) / 100;
    },
    [prices.goldPricePerOz]
  );

  return {
    prices,
    isLoading,
    error,
    refresh: fetchPrices,
    getKaratPrice,
    getKaratPriceOz,
  };
}

export { PURITY, TROY_OUNCE_GRAMS as GRAMS_PER_OUNCE };
export type { LivePriceData };
    
