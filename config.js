// ===================================================
// GoldSphere Global Pro - Configuration
// ===================================================
// Update the API key below to enable live price data.
// Get a free API key from: https://www.goldapi.io/
// ===================================================

const CONFIG = {
  // Gold API Key - Replace with your own key from goldapi.io
  GOLD_API_KEY: 'goldapi-demo-key',

  // Base URL for the Gold API
  GOLD_API_BASE_URL: 'https://www.goldapi.io/api',

  // Fallback prices (used when API is unavailable)
  FALLBACK_GOLD_PRICE_OZ: 2420.50,
  FALLBACK_SILVER_PRICE_OZ: 28.75,

  // Refresh interval in milliseconds (5 minutes)
  PRICE_REFRESH_INTERVAL: 300000,

  // AdSense Publisher ID - Replace with your own
  ADSENSE_PUB_ID: 'ca-pub-XXXXXXXXXXXXXXXX',

  // App version
  APP_VERSION: '2.0.0',
};

export default CONFIG;
