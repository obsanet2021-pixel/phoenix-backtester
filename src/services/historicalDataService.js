// Historical Forex Data Service
// Generates realistic historical forex data for backtesting (2-5 years)

class HistoricalDataService {
  constructor() {
    this.pairs = {
      'EURUSD': { base: 1.0850, volatility: 0.008, trend: 0.0001 },
      'GBPUSD': { base: 1.2750, volatility: 0.010, trend: -0.00005 },
      'USDJPY': { base: 149.50, volatility: 0.012, trend: 0.0002 },
      'AUDUSD': { base: 0.6650, volatility: 0.009, trend: -0.00008 },
      'USDCAD': { base: 1.3650, volatility: 0.007, trend: 0.00003 },
      'USDCHF': { base: 0.8750, volatility: 0.006, trend: -0.00002 },
      'EURGBP': { base: 0.8500, volatility: 0.005, trend: 0.00004 },
      'EURJPY': { base: 162.00, volatility: 0.011, trend: 0.00015 },
      'GBPJPY': { base: 190.50, volatility: 0.013, trend: 0.00018 },
      'NZDUSD': { base: 0.6150, volatility: 0.009, trend: -0.00006 }
    }
  }

  // Generate historical data for a specific pair and timeframe
  generateHistoricalData(pair, startDate, endDate, timeframe = '1h') {
    const pairConfig = this.pairs[pair] || this.pairs['EURUSD']
    const data = []
    let currentPrice = pairConfig.base
    let currentTime = new Date(startDate)

    // Calculate intervals based on timeframe
    const intervalMs = this.getTimeframeInterval(timeframe)

    while (currentTime <= endDate) {
      // Generate OHLC data with realistic price movements
      const ohlc = this.generateOHLC(currentPrice, pairConfig)
      
      data.push({
        time: currentTime.getTime(),
        open: ohlc.open,
        high: ohlc.high,
        low: ohlc.low,
        close: ohlc.close,
        volume: Math.floor(Math.random() * 1000000) + 500000
      })

      currentPrice = ohlc.close
      currentTime = new Date(currentTime.getTime() + intervalMs)
    }

    return data
  }

  // Generate realistic OHLC data
  generateOHLC(currentPrice, config) {
    const volatility = config.volatility
    const trend = config.trend
    
    // Generate price movement with trend and volatility
    const priceChange = (Math.random() - 0.5) * volatility + trend
    
    let open = currentPrice
    let close = open * (1 + priceChange)
    
    // Generate high and low within the range
    const range = Math.abs(close - open) * (0.5 + Math.random() * 0.5)
    const high = Math.max(open, close) + Math.random() * range
    const low = Math.min(open, close) - Math.random() * range
    
    return {
      open: this.roundPrice(open),
      high: this.roundPrice(high),
      low: this.roundPrice(low),
      close: this.roundPrice(close)
    }
  }

  // Round price to appropriate decimal places
  roundPrice(price) {
    if (price > 100) return Math.round(price * 100) / 100
    if (price > 10) return Math.round(price * 1000) / 1000
    return Math.round(price * 10000) / 10000
  }

  // Get timeframe interval in milliseconds
  getTimeframeInterval(timeframe) {
    const intervals = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '30m': 30 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1D': 24 * 60 * 60 * 1000
    }
    return intervals[timeframe] || intervals['1h']
  }

  // Get date range for backtesting (2-5 years)
  getDateRange(years = 3) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setFullYear(endDate.getFullYear() - years)
    return { startDate, endDate }
  }

  // Get available pairs
  getAvailablePairs() {
    return Object.keys(this.pairs)
  }

  // Get data for specific date range
  getDataForDateRange(pair, years = 3, timeframe = '1h') {
    const { startDate, endDate } = this.getDateRange(years)
    return this.generateHistoricalData(pair, startDate, endDate, timeframe)
  }
}

export default new HistoricalDataService()
