export interface GoldPrice {
  karat: string;
  label: string;
  pricePerGram: number;
  pricePerOz: number;
  change24h: number;
  changePercent: number;
}

export interface CurrencyRates {
  USD: number;
  EUR: number;
  GBP: number;
  AED: number;
  INR: number;
}

// Default gold prices (per gram in USD) - updated by live API
export const goldPrices: GoldPrice[] = [
  {
    karat: '24k',
    label: '24 Karat (99.9%)',
    pricePerGram: 77.82,
    pricePerOz: 2420.50,
    change24h: 1.23,
    changePercent: 1.61,
  },
  {
    karat: '22k',
    label: '22 Karat (91.7%)',
    pricePerGram: 71.32,
    pricePerOz: 2219.40,
    change24h: 0.89,
    changePercent: 1.26,
  },
  {
    karat: '18k',
    label: '18 Karat (75.0%)',
    pricePerGram: 58.37,
    pricePerOz: 1815.38,
    change24h: -0.45,
    changePercent: -0.77,
  },
  {
    karat: '14k',
    label: '14 Karat (58.3%)',
    pricePerGram: 45.39,
    pricePerOz: 1411.15,
    change24h: 0.32,
    changePercent: 0.71,
  },
];

export const silverPrice = {
  label: 'Silver (99.9%)',
  pricePerGram: 0.93,
  pricePerOz: 28.75,
  change24h: -0.02,
  changePercent: -2.11,
};

// Currency conversion rates from USD
export const currencyRates: CurrencyRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  INR: 83.45,
};

export const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '\u20AC',
  GBP: '\u00A3',
  AED: 'AED ',
  INR: '\u20B9',
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

// CSV Export utility
export function exportToCSV(data: DailyPrice[]): string {
  const header = 'Date,Open,High,Low,Close,Change\n';
  const rows = data
    .map(
      (row) =>
        `${row.date},${row.open.toFixed(2)},${row.high.toFixed(2)},${row.low.toFixed(2)},${row.close.toFixed(2)},${row.change.toFixed(2)}`
    )
    .join('\n');
  return header + rows;
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// Knowledge Hub articles - 5 in-depth articles (300+ words each)
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
    title: 'The 2026 Conflict Economy: How Wars and Sanctions Are Reshaping Gold Demand',
    category: 'Investment',
    summary: 'An in-depth analysis of how geopolitical conflicts, trade wars, and economic sanctions are driving unprecedented demand for gold in 2026.',
    readTime: '7 min read',
    icon: 'globe-outline',
    content: `The global economic landscape of 2026 is defined by an era of heightened geopolitical instability. From prolonged conflicts in Eastern Europe and the Middle East to escalating trade tensions between major economic blocs, the so-called "conflict economy" has become one of the most significant drivers of gold demand in modern history. Understanding these dynamics is essential for anyone holding or considering precious metals.

**The Rise of the Conflict Economy**

A conflict economy refers to the systemic economic shifts that occur when nations are engaged in or affected by war, sanctions, and diplomatic standoffs. In 2026, several overlapping crises have converged to create this environment. The ongoing Russia-Ukraine war continues to disrupt energy supply chains and European economic stability. Meanwhile, tensions in the South China Sea and the Taiwan Strait keep markets on edge with the constant threat of supply chain disruptions for critical semiconductors and manufactured goods.

**Central Bank Gold Buying Spree**

One of the most telling indicators of the conflict economy's impact on gold is the behavior of central banks. In 2025, global central banks purchased over 1,100 tonnes of gold, a trend that has accelerated in 2026. Countries like China, India, Turkey, and several Middle Eastern nations have been aggressively diversifying their reserves away from the US dollar. This de-dollarization movement, partly driven by the weaponization of the SWIFT financial system through sanctions, has made gold an indispensable reserve asset for sovereign wealth management.

**Sanctions and the Flight to Hard Assets**

The expansion of Western sanctions regimes has created a two-tiered global financial system. Nations facing sanctions, or fearing future ones, have turned to gold as a sanctions-proof store of value. Physical gold can be transported, stored, and traded outside of digital financial networks that can be monitored or frozen by sanctioning nations. This has led to a robust parallel gold market, particularly in Asia and the Middle East.

**Impact on Retail Investors**

For individual investors, the conflict economy has created both opportunity and urgency. Gold prices have surged past $2,400 per ounce, driven by institutional demand and retail fear. In regions directly affected by conflict, gold serves as portable wealth that can be carried across borders. Even in stable Western economies, inflation concerns linked to military spending and supply chain disruptions have made gold an attractive hedge.

**Looking Ahead**

Analysts predict that as long as geopolitical tensions remain elevated, gold will continue to benefit from its status as the ultimate safe-haven asset. The conflict economy of 2026 has reminded the world of a timeless truth: in times of uncertainty, gold endures. Whether you are a central banker managing trillions or an individual protecting your savings, the message is clear: the strategic importance of gold has never been greater.`,
  },
  {
    id: '2',
    title: 'Gold Hallmarks and Purity: The Complete Guide to Authenticating Precious Metals',
    category: 'Education',
    summary: 'Learn how to read gold hallmarks, understand purity ratings from 9K to 24K, and protect yourself from counterfeits with this comprehensive guide.',
    readTime: '8 min read',
    icon: 'shield-checkmark-outline',
    content: `Gold purity and authentication are foundational knowledge for anyone buying, selling, or investing in precious metals. Whether you are purchasing a gold ring from a local jeweler, bidding on a rare coin at auction, or acquiring bullion bars for investment, understanding hallmarks and purity standards is your first line of defense against fraud.

**Understanding Karats and Fineness**

The karat system measures the proportion of pure gold in an alloy. Pure gold is 24 karats, meaning 24 out of 24 parts are gold. Common purities include:

- 24K (999 fineness) - 99.9% pure gold, the standard for investment bars and coins
- 22K (916 fineness) - 91.6% pure, popular in Indian and Middle Eastern jewelry
- 18K (750 fineness) - 75% pure, the global standard for fine jewelry
- 14K (585 fineness) - 58.5% pure, popular in the United States for everyday wear
- 9K (375 fineness) - 37.5% pure, the minimum to be called gold in the UK

The remaining percentage in lower-karat gold consists of alloy metals like copper, silver, zinc, or palladium, which add strength and can change the color to white, rose, or green gold.

**Reading Hallmarks Around the World**

Hallmarks are official stamps applied by assay offices to certify metal purity. Each country has its own system:

*United Kingdom:* The UK has one of the world's oldest hallmarking systems, dating back to 1300. A full UK hallmark includes the sponsor's mark (maker), the standard mark (purity), the assay office mark (city), and sometimes a date letter. The crown symbol appears on gold items above 9K.

*India:* India's Bureau of Indian Standards (BIS) introduced mandatory hallmarking in 2021. The BIS hallmark includes a triangular BIS logo, a purity grade (like 916 for 22K), and a six-digit alphanumeric HUID number for traceability.

*Switzerland:* Swiss hallmarks use animal heads: a St. Bernard dog head for items below 18K and a cat head for 18K and above. Swiss assay offices are among the most trusted in the world.

*United States:* The US does not have a government hallmarking system. Instead, the Federal Trade Commission requires that karat markings be accurate and accompanied by a registered trademark of the manufacturer.

**Spotting Counterfeits**

Counterfeit gold is a growing problem globally. Here are practical steps to protect yourself:

1. Use a jeweler's loupe at 10x magnification to inspect hallmarks for clarity and consistency
2. Perform a specific gravity test, as gold has a distinctive density of 19.3 grams per cubic centimeter
3. Use an electronic gold tester or XRF analyzer for non-destructive testing
4. Purchase from reputable dealers who provide assay certificates
5. Be wary of prices significantly below market value, as they often indicate counterfeit material

**Modern Authentication Technology**

In 2026, new technologies are making authentication more accessible. Blockchain-based provenance tracking, laser-engraved micro-hallmarks, and smartphone-compatible XRF sensors are revolutionizing how gold is verified. Some mints now embed NFC chips in their bars that link to digital certificates of authenticity.

**Why Purity Matters for Investment**

For investment purposes, higher purity generally means higher value per gram. However, 22K coins and jewelry from recognized mints can carry numismatic or cultural premiums. Always factor in the buyback spread: 24K bullion typically has the narrowest spread between buy and sell prices, making it the most liquid form of gold investment.`,
  },
  {
    id: '3',
    title: 'Gold as a Safe Haven: Middle East Tensions and the Flight to Precious Metals',
    category: 'Investment',
    summary: 'How ongoing Middle East tensions continue to drive investors toward gold as the ultimate safe haven asset, with analysis of regional and global market impacts.',
    readTime: '7 min read',
    icon: 'shield-outline',
    content: `The Middle East has long been one of the most geopolitically sensitive regions in the world, and in 2026, escalating tensions continue to send shockwaves through global financial markets. For gold investors, understanding the relationship between Middle Eastern conflicts and precious metal prices is critical for making informed decisions.

**The Safe Haven Effect**

Gold's reputation as a safe-haven asset is rooted in thousands of years of human history. Unlike stocks, bonds, or currencies, gold has no counterparty risk. It cannot be printed, devalued by central bank policy, or rendered worthless by a company's bankruptcy. When geopolitical risk rises, institutional and retail investors alike flock to gold as a store of value that transcends national borders and political systems.

**Current Middle East Dynamics**

The region faces multiple overlapping crises in 2026. The Israeli-Palestinian conflict has expanded its diplomatic and economic footprint, affecting trade routes and energy markets. Tensions between Iran and Gulf Cooperation Council nations continue to threaten the Strait of Hormuz, through which approximately 20% of the world's oil passes. Yemen's ongoing civil conflict and its impact on Red Sea shipping lanes has disrupted global trade flows, increasing costs and uncertainty.

**Oil-Gold Correlation**

The Middle East is central to global energy supply, and disruptions in oil production or transport directly affect gold prices through multiple channels. When oil prices spike due to regional tensions, inflation expectations rise, which supports gold as an inflation hedge. Additionally, oil-producing nations in the Gulf often invest their petrodollars in gold, creating direct demand. The historical correlation between oil price spikes and gold rallies is well-documented, and this dynamic remains highly relevant in 2026.

**Regional Gold Markets**

The Middle East is home to some of the world's most active gold markets. Dubai's Gold Souk, the Istanbul Grand Bazaar, and the gold souks of Riyadh and Doha are major physical gold trading centers. In times of regional tension, demand in these markets surges as local populations and businesses seek to protect their wealth. Gold purchases in the UAE alone exceeded $75 billion in 2025, a significant portion driven by safe-haven demand.

**Impact on Global Prices**

Middle East tensions affect gold prices globally through several mechanisms. First, they increase risk premiums across all financial markets, driving capital toward safe havens. Second, they can disrupt supply chains for other commodities, creating broader inflationary pressures that support gold. Third, they trigger central bank responses including interest rate adjustments and reserve diversification that often favor gold accumulation.

**Investor Strategy**

For investors looking to hedge against Middle East-related risks, a diversified gold position is essential. Consider a mix of physical gold for direct ownership, gold ETFs for liquidity, and gold mining stocks for leveraged exposure to price increases. Most financial advisors recommend allocating 5 to 15 percent of a portfolio to gold, with the higher end appropriate during periods of elevated geopolitical risk.

**The Bigger Picture**

The Middle East tensions of 2026 are part of a broader global pattern of increasing geopolitical fragmentation. As the world moves toward a more multipolar order, the traditional safe-haven role of gold is being reinforced rather than diminished. For investors, the lesson is clear: gold's value proposition is strongest precisely when the world is most uncertain.`,
  },
  {
    id: '4',
    title: 'Oil vs Gold Volatility: Comparing Two of the World\'s Most Watched Commodities',
    category: 'Education',
    summary: 'A detailed comparison of oil and gold price volatility, correlation patterns, and what they mean for diversified commodity investors in 2026.',
    readTime: '8 min read',
    icon: 'analytics-outline',
    content: `Oil and gold are arguably the two most closely watched commodities in global finance. Both serve as economic barometers, inflation indicators, and geopolitical thermometers. Yet they behave very differently in terms of volatility, and understanding these differences is crucial for anyone building a diversified investment portfolio.

**Understanding Volatility**

Volatility measures the degree of variation in a trading price over time. High volatility means prices can change dramatically in a short period, while low volatility indicates steadier, more predictable price movements. For investors, volatility represents both risk and opportunity. Oil has historically exhibited significantly higher volatility than gold, with annual standard deviations often two to three times greater than those of gold prices.

**Why Oil Is More Volatile**

Several structural factors make oil prices inherently more volatile than gold. First, oil is a consumable commodity with a relatively inelastic short-term demand curve. When supply is disrupted by a pipeline explosion, OPEC production cut, or natural disaster, prices can spike 10 to 20 percent in days. Second, oil storage capacity is limited compared to demand, meaning surplus supply cannot be easily absorbed. Third, oil markets are heavily influenced by OPEC decisions, which can be unpredictable and politically motivated. Fourth, the transition to renewable energy adds a layer of long-term uncertainty that creates speculative volatility.

**Why Gold Is Less Volatile**

Gold's relative stability stems from its unique market structure. Unlike oil, gold is not consumed in significant quantities. Nearly all gold ever mined still exists in some form, creating an enormous above-ground stockpile estimated at over 200,000 tonnes. This large existing supply means that changes in annual mining production have a relatively small impact on overall availability. Additionally, gold serves multiple demand functions including jewelry, investment, central bank reserves, and industrial use, which helps diversify and stabilize its price drivers.

**Historical Correlation Patterns**

The correlation between oil and gold prices is complex and changes over time. During inflationary periods, both commodities tend to rise together, as they both serve as inflation hedges. However, during deflationary shocks or demand-driven oil price crashes, gold often rises while oil falls, as investors flee to safe havens. In 2020, when oil prices briefly went negative, gold surged to then-record highs above $2,000 per ounce, perfectly illustrating this divergence.

**The Gold-to-Oil Ratio**

The gold-to-oil ratio measures how many barrels of oil one ounce of gold can buy. This ratio has historically averaged around 15 to 20 barrels per ounce. When the ratio is significantly higher, it suggests oil is relatively cheap compared to gold, and vice versa. In 2026, with gold near $2,420 per ounce and oil fluctuating between $75 and $95 per barrel, the ratio sits around 27, indicating that gold is relatively expensive compared to oil by historical standards.

**Portfolio Implications**

For investors, the different volatility profiles of oil and gold offer diversification benefits. Oil provides exposure to global economic growth and energy demand, with higher risk and potential reward. Gold provides a defensive hedge against inflation, currency devaluation, and geopolitical risk, with lower volatility. A balanced portfolio might include both, with gold overweighted during periods of uncertainty and oil overweighted during periods of economic expansion.

**The 2026 Outlook**

In the current environment of geopolitical tension, energy transition uncertainty, and persistent inflation, both commodities remain relevant portfolio components. However, gold's lower volatility and safe-haven characteristics make it particularly attractive for risk-averse investors seeking to preserve purchasing power. Oil, while potentially offering higher returns during economic upswings, carries significantly more downside risk from demand destruction, policy changes, and the accelerating shift to renewable energy.`,
  },
  {
    id: '5',
    title: 'Digital Gold vs Physical Bullion: Making the Right Choice for Your Portfolio',
    category: 'Guide',
    summary: 'A comprehensive comparison of digital gold platforms, gold ETFs, and physical bullion, helping you choose the best gold investment vehicle for your needs.',
    readTime: '8 min read',
    icon: 'swap-horizontal-outline',
    content: `The gold market has evolved dramatically in the digital age. Where investors once had to choose between jewelry, coins, and bars, they now have access to a wide array of digital gold products including ETFs, tokenized gold, and digital gold platforms. Understanding the advantages and disadvantages of each format is essential for building an effective gold allocation in your portfolio.

**Physical Bullion: The Traditional Choice**

Physical gold in the form of bars and coins remains the most straightforward way to own gold. When you buy a gold bar from a reputable mint, you own a tangible asset that exists independently of any financial system, digital platform, or counterparty. This is the purest form of gold ownership and has been trusted for millennia.

Advantages of physical gold include complete ownership with no counterparty risk, privacy of holding, portability for smaller amounts, and the emotional satisfaction of holding real gold. However, physical gold comes with challenges: secure storage requires a safe or vault rental, insurance adds ongoing costs, and there is typically a wider bid-ask spread when buying and selling compared to digital alternatives. Liquidity can also be an issue, as selling physical gold requires finding a buyer willing to pay near spot price.

**Gold ETFs: The Mainstream Option**

Gold exchange-traded funds like SPDR Gold Shares (GLD) and iShares Gold Trust (IAU) allow investors to gain gold exposure through their regular brokerage accounts. These funds hold physical gold in secure vaults and issue shares that track the gold price. Each share typically represents a fraction of an ounce of gold.

ETFs offer excellent liquidity, as shares can be bought and sold during market hours with tight spreads. Management fees are relatively low, typically 0.25 to 0.40 percent annually. There is no need for personal storage or insurance. However, ETF investors do not own physical gold directly. They own shares in a trust, introducing counterparty risk. ETFs also cannot be redeemed for physical gold by retail investors, and they are subject to capital gains tax on every sale.

**Tokenized and Digital Gold**

The newest frontier in gold investing is tokenized gold on blockchain platforms. Products like PAX Gold (PAXG) and Tether Gold (XAUT) represent ownership of specific physical gold bars stored in professional vaults. Each token corresponds to one troy ounce of London Good Delivery gold.

Tokenized gold combines some benefits of both physical and ETF gold. Tokens can be transferred 24 hours a day, seven days a week, without the limitations of stock market hours. They can be purchased in fractional amounts, making gold accessible to investors with smaller budgets. Ownership is recorded on a transparent blockchain, and in some cases, tokens can be redeemed for physical gold.

However, digital gold platforms carry technological risks including smart contract vulnerabilities, platform insolvency, and regulatory uncertainty. The crypto-adjacent nature of some platforms may also deter conservative investors.

**Making the Right Choice**

The best gold investment vehicle depends on your specific circumstances:

1. If you prioritize absolute security and sovereignty over your wealth, physical bullion stored in a personal safe or allocated vault is the best choice
2. If you want convenient, liquid exposure to gold prices with minimal hassle, a major gold ETF is ideal
3. If you value 24/7 trading, fractional ownership, and blockchain transparency, tokenized gold may be appropriate
4. Many sophisticated investors use a combination of all three, with physical gold as a core holding, ETFs for tactical trading, and small tokenized positions for flexibility

**Cost Comparison**

When comparing costs, consider the total cost of ownership over your intended holding period. Physical gold has higher upfront premiums of 3 to 8 percent over spot but no ongoing fees if self-stored. ETFs have low premiums but charge annual management fees that compound over time. Tokenized gold falls somewhere in between, with moderate premiums and small transaction fees.

**The Bottom Line**

There is no single best way to own gold. Each format serves a different purpose, and the optimal choice depends on your investment goals, time horizon, risk tolerance, and practical considerations. In the evolving landscape of 2026, having options is a luxury that gold investors should take full advantage of.`,
  },
];
