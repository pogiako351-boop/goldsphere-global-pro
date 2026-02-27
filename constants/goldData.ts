export interface GoldPrice {
  karat: string;
  label: string;
  pricePerGram: number;
  change24h: number;
  changePercent: number;
}

export interface CurrencyRates {
  PHP: number;
  USD: number;
  EUR: number;
  GBP: number;
}

// Simulated live gold prices (per gram in USD)
export const goldPrices: GoldPrice[] = [
  {
    karat: '24k',
    label: '24 Karat (99.9%)',
    pricePerGram: 77.82,
    change24h: 1.23,
    changePercent: 1.61,
  },
  {
    karat: '22k',
    label: '22 Karat (91.7%)',
    pricePerGram: 71.32,
    change24h: 0.89,
    changePercent: 1.26,
  },
  {
    karat: '18k',
    label: '18 Karat (75.0%)',
    pricePerGram: 58.37,
    change24h: -0.45,
    changePercent: -0.77,
  },
  {
    karat: '14k',
    label: '14 Karat (58.3%)',
    pricePerGram: 45.39,
    change24h: 0.32,
    changePercent: 0.71,
  },
];

export const silverPrice = {
  label: 'Silver (99.9%)',
  pricePerGram: 0.93,
  change24h: -0.02,
  changePercent: -2.11,
};

// Currency conversion rates from USD
export const currencyRates: CurrencyRates = {
  PHP: 56.42,
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
};

export const currencySymbols: Record<string, string> = {
  PHP: '₱',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

// Generate mock historical data
export function generateHistoricalData(days: number): { date: string; price: number }[] {
  const data: { date: string; price: number }[] = [];
  const basePrice = 77.82;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const variation = (Math.random() - 0.48) * 3;
    const trendFactor = (days - i) * 0.02;
    const price = basePrice + variation + trendFactor;
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
    });
  }

  return data;
}

// Daily price history for table
export interface DailyPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
}

export function generateDailyPrices(count: number): DailyPrice[] {
  const prices: DailyPrice[] = [];
  let lastClose = 77.82;
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const variation = (Math.random() - 0.48) * 2.5;
    const open = lastClose;
    const close = open + variation;
    const high = Math.max(open, close) + Math.random() * 1.2;
    const low = Math.min(open, close) - Math.random() * 1.2;
    const change = close - open;

    prices.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      change: Math.round(change * 100) / 100,
    });

    lastClose = close;
  }

  return prices.reverse();
}

// Knowledge Hub articles
export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  readTime: string;
  icon: string;
  content: string;
}

export const articles: Article[] = [
  {
    id: '1',
    title: 'Understanding Gold Purity & Karats',
    category: 'Education',
    summary: 'Learn about the difference between 24k, 22k, 18k, and 14k gold and what purity means for your investment.',
    readTime: '5 min read',
    icon: 'diamond-outline',
    content: `Gold purity is measured in karats (k), with 24 karat being the purest form at 99.9% gold content. Here's what each karat level means:\n\n**24 Karat Gold (99.9% pure)**\nThe purest form of gold available. It has a rich, warm yellow color and is very soft. Because of its softness, 24k gold is rarely used in jewelry that gets daily wear but is ideal for investment coins and bars.\n\n**22 Karat Gold (91.7% pure)**\nContains 91.7% gold mixed with 8.3% other metals like copper or silver for added strength. Popular in Indian and Middle Eastern jewelry, it maintains a rich golden color while being slightly more durable.\n\n**18 Karat Gold (75% pure)**\nA popular choice for fine jewelry worldwide. The 25% alloy content provides excellent durability while maintaining a beautiful gold appearance. Available in yellow, white, and rose gold varieties.\n\n**14 Karat Gold (58.3% pure)**\nThe most popular karat in the United States for everyday jewelry. It offers an excellent balance of durability, affordability, and beauty. The higher alloy content makes it more resistant to scratches and dents.\n\n**How to Verify Purity**\nLook for hallmark stamps on gold items. These stamps indicate the karat rating (e.g., 750 for 18k, 916 for 22k). Professional assayers can also test gold purity using acid tests or electronic testers.`,
  },
  {
    id: '2',
    title: 'Hallmarks & Authentication Guide',
    category: 'Guide',
    summary: 'A comprehensive guide to reading and verifying gold hallmarks from around the world.',
    readTime: '7 min read',
    icon: 'shield-checkmark-outline',
    content: `Gold hallmarks are official marks stamped on precious metals to certify their purity. Understanding these marks is crucial for any gold buyer.\n\n**Common Purity Stamps:**\n• 999 or 999.9 - 24 karat (99.9% pure)\n• 916 - 22 karat (91.6% pure)\n• 750 - 18 karat (75% pure)\n• 585 - 14 karat (58.5% pure)\n• 375 - 9 karat (37.5% pure)\n\n**Country-Specific Hallmarks:**\n\n*United Kingdom:* Features the lion passant (walking lion) symbol for sterling silver and a crown for gold. Each assay office has its own mark.\n\n*India:* The BIS (Bureau of Indian Standards) hallmark includes a BIS logo, purity grade, assaying center's logo, and jeweler's identification mark.\n\n*Switzerland:* Uses the cat's head symbol for 18k gold and dog's head for lower purities.\n\n**Tips for Verification:**\n1. Use a jeweler's loupe (10x magnification) to read hallmarks\n2. Check for consistency in the stamps\n3. Verify with an acid test kit for additional confirmation\n4. Purchase from reputable dealers who provide certificates`,
  },
  {
    id: '3',
    title: 'Smart Gold Buying Strategies',
    category: 'Investment',
    summary: 'Expert tips on when and how to buy gold for maximum returns on your investment.',
    readTime: '6 min read',
    icon: 'trending-up-outline',
    content: `Gold has been a reliable store of value for thousands of years. Here are proven strategies for smart gold buying.\n\n**Dollar-Cost Averaging (DCA)**\nInstead of trying to time the market, invest a fixed amount in gold at regular intervals. This strategy smooths out price volatility and reduces the risk of buying at peak prices.\n\n**Buy During Dips**\nMonitor gold prices regularly and look for temporary price drops caused by market events. These dips often present excellent buying opportunities.\n\n**Physical vs. Paper Gold**\n• Physical Gold: Bars, coins, and jewelry. Provides tangible ownership but requires secure storage.\n• Paper Gold: ETFs, futures, and digital gold. Easier to trade but doesn't give physical possession.\n\n**Best Times to Buy:**\n1. During economic uncertainty (gold is a safe haven)\n2. When interest rates are expected to decrease\n3. When the US dollar weakens\n4. During seasonal dips (typically March-April)\n\n**Important Considerations:**\n• Always compare premiums over spot price\n• Factor in storage and insurance costs for physical gold\n• Diversify your gold holdings across different forms\n• Keep gold as 5-15% of your total portfolio`,
  },
  {
    id: '4',
    title: 'Selling Gold: Maximize Your Returns',
    category: 'Guide',
    summary: 'Learn when and where to sell your gold to get the best possible price.',
    readTime: '5 min read',
    icon: 'cash-outline',
    content: `Knowing when and where to sell gold is just as important as knowing when to buy. Follow these guidelines to maximize returns.\n\n**When to Sell:**\n• When prices reach your target profit level\n• During geopolitical crises that spike prices temporarily\n• When you need to rebalance your portfolio\n• During high-demand seasons (festivals, wedding seasons)\n\n**Where to Sell:**\n1. Reputable gold dealers and refiners\n2. Jewelry stores (may offer less than spot price)\n3. Online platforms and exchanges\n4. Auction houses (for rare or collectible pieces)\n\n**Maximizing Your Price:**\n• Always get multiple quotes before selling\n• Know the current spot price before negotiating\n• Sell higher-purity gold separately (don't mix karats)\n• Keep original certificates and packaging\n• Consider the timing - avoid selling during price dips\n\n**Tax Implications:**\nGold sales may be subject to capital gains tax. Keep records of your purchase price and date. Consult a tax professional for guidance on your specific situation.`,
  },
  {
    id: '5',
    title: 'Gold as an Inflation Hedge',
    category: 'Investment',
    summary: 'How gold protects your wealth against inflation and currency devaluation.',
    readTime: '4 min read',
    icon: 'shield-outline',
    content: `Gold has historically been one of the most effective hedges against inflation. Here's why and how to use it.\n\n**Why Gold Fights Inflation:**\nAs the purchasing power of currencies decreases due to inflation, gold tends to maintain or increase its value. This is because gold's supply is limited and cannot be printed like fiat money.\n\n**Historical Performance:**\nDuring periods of high inflation, gold has consistently outperformed most other asset classes. In the 1970s, when US inflation peaked at over 14%, gold prices rose from $35 to over $800 per ounce.\n\n**Current Relevance:**\nWith central banks around the world printing unprecedented amounts of money, many investors are turning to gold as a store of value.\n\n**How to Use Gold for Inflation Protection:**\n1. Allocate 5-15% of your portfolio to gold\n2. Use physical gold for long-term holdings\n3. Consider gold ETFs for easier trading\n4. Rebalance annually based on market conditions`,
  },
  {
    id: '6',
    title: 'Global Gold Markets Explained',
    category: 'Education',
    summary: 'Understanding how gold is traded across major markets in London, New York, Shanghai, and Mumbai.',
    readTime: '8 min read',
    icon: 'globe-outline',
    content: `Gold is traded 24 hours a day across multiple global markets. Understanding these markets helps you make better buying and selling decisions.\n\n**London Bullion Market (LBMA)**\nThe world's largest over-the-counter gold market. Sets the benchmark gold price twice daily through the LBMA Gold Price auction.\n\n**COMEX (New York)**\nPart of CME Group, COMEX is the world's largest gold futures exchange. Most trading is in paper contracts rather than physical gold.\n\n**Shanghai Gold Exchange (SGE)**\nChina's primary gold exchange, increasingly influential in global price discovery. Trades physical gold and gold contracts in Chinese yuan.\n\n**Multi Commodity Exchange (MCX) - Mumbai**\nIndia's premier commodity exchange for gold trading. India is one of the world's largest gold consumers.\n\n**Key Trading Hours (UTC):**\n• Asian session: 00:00 - 08:00\n• European session: 07:00 - 16:00\n• American session: 13:00 - 22:00\n\n**What Moves Gold Prices:**\n1. US Dollar strength/weakness\n2. Central bank policies and interest rates\n3. Geopolitical tensions and economic uncertainty\n4. Supply and demand from mining and jewelry industries\n5. Inflation expectations and real yields`,
  },
];
