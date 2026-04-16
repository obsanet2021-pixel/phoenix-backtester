const express = require('express');
const router = express.Router();
const axios = require('axios');

const symbolCache = new Map();

router.get('/', async (req, res) => {
  const { symbol } = req.query;
  const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
  
  if (!symbol) {
    return res.status(400).json({ error: 'Symbol parameter required' });
  }

  try {
    // Check cache
    if (symbolCache.has(symbol)) {
      return res.json(symbolCache.get(symbol));
    }

    // Format: EUR/USD -> EURUSD for Twelve Data
    const formattedSymbol = symbol.replace('/', '');
    
    // Get symbol info from Twelve Data
    const response = await axios.get(
      `https://api.twelvedata.com/quote?symbol=${formattedSymbol}&apikey=${TWELVE_DATA_API_KEY}` 
    );
    
    const data = response.data;
    
    const symbolInfo = {
      symbol: symbol,
      full_name: symbol,
      description: `${symbol} Forex Pair`,
      exchange: 'FX',
      type: 'forex',
      minmov: 1,
      minmove2: 0,
      pointvalue: 1,
      fractional: true,
      pricescale: 100000,
      has_intraday: true,
      has_no_volume: true,
      supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
      session: '24x7',
      timezone: 'Etc/UTC'
    };

    symbolCache.set(symbol, symbolInfo);
    res.json(symbolInfo);
  } catch (error) {
    console.error('Error fetching symbol info:', error.message);
    res.status(500).json({ error: 'Failed to fetch symbol data' });
  }
});

module.exports = router;
