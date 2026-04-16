export const TRADING_SYMBOLS = {
  FOREX: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'],
  INDICES: ['SPX', 'NAS100', 'DAX30', 'FTSE100'],
  CRYPTO: ['BTCUSD', 'ETHUSD']
};

export const TIMEFRAMES = {
  '1m': { seconds: 60, label: '1 Minute' },
  '5m': { seconds: 300, label: '5 Minutes' },
  '15m': { seconds: 900, label: '15 Minutes' },
  '1h': { seconds: 3600, label: '1 Hour' },
  '4h': { seconds: 14400, label: '4 Hours' },
  '1d': { seconds: 86400, label: '1 Day' }
};
