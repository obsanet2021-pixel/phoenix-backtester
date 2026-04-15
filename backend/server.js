// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;

app.use(cors());
app.use(express.json());

// TradingView UDF-compatible endpoints

// 1. Config endpoint - tells TradingView what features we support
app.get('/config', (req, res) => {
  res.json({
    supports_search: true,
    supports_group_request: false,
    supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
    supports_marks: false,
    supports_timescale_marks: false,
    exchanges: [
      { value: 'FX', name: 'Forex', desc: 'Forex Exchange' }
    ]
  });
});

// 2. Symbols endpoint - provides symbol metadata
app.get('/symbols', async (req, res) => {
  const { symbol } = req.query;
  
  if (!symbol) {
    return res.status(400).json({ error: 'Symbol required' });
  }

  try {
    // Format: EUR/USD -> EURUSD for Twelve Data
    const formattedSymbol = symbol.replace('/', '');
    
    // Get symbol info from Twelve Data
    const response = await axios.get(
      `https://api.twelvedata.com/quote?symbol=${formattedSymbol}&apikey=${TWELVE_DATA_API_KEY}` 
    );
    
    const data = response.data;
    
    res.json({
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
    });
  } catch (error) {
    console.error('Error fetching symbol info:', error.message);
    res.status(500).json({ error: 'Failed to fetch symbol data' });
  }
});

// 3. History endpoint - provides OHLCV bars
app.get('/history', async (req, res) => {
  const { symbol, from, to, resolution } = req.query;
  
  if (!symbol || !from || !to || !resolution) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const formattedSymbol = symbol.replace('/', '');
    
    // Convert TradingView resolution to Twelve Data interval
    const intervalMap = {
      '1': '1min',
      '5': '5min',
      '15': '15min',
      '30': '30min',
      '60': '1h',
      '1D': '1day',
      '1W': '1week',
      '1M': '1month'
    };
    
    const interval = intervalMap[resolution];
    if (!interval) {
      return res.status(400).json({ error: `Resolution ${resolution} not supported` });
    }
    
    // Calculate outputsize (max 5000 for free tier)
    const startDate = new Date(parseInt(from) * 1000);
    const endDate = new Date(parseInt(to) * 1000);
    const daysDiff = (endDate - startDate) / (1000 * 60 * 60 * 24);
    let outputsize = Math.min(Math.ceil(daysDiff * 24 * 60 / parseInt(resolution)), 5000);
    outputsize = Math.min(outputsize, 5000);
    
    // Fetch from Twelve Data
    const response = await axios.get(
      `https://api.twelvedata.com/time_series?symbol=${formattedSymbol}&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVE_DATA_API_KEY}&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}` 
    );
    
    const data = response.data;
    
    if (data.code === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    }
    
    if (data.status === 'error') {
      return res.status(400).json({ error: data.message });
    }
    
    // Transform to TradingView format
    const values = data.values || [];
    const bars = {
      t: [],
      c: [],
      o: [],
      h: [],
      l: [],
      v: [],
      s: values.length > 0 ? 'ok' : 'no_data'
    };
    
    values.forEach(bar => {
      bars.t.push(new Date(bar.datetime).getTime() / 1000);
      bars.o.push(parseFloat(bar.open));
      bars.h.push(parseFloat(bar.high));
      bars.l.push(parseFloat(bar.low));
      bars.c.push(parseFloat(bar.close));
      bars.v.push(bar.volume ? parseFloat(bar.volume) : 0);
    });
    
    // Reverse if needed (TradingView expects oldest to newest)
    if (bars.t.length > 1 && bars.t[0] > bars.t[1]) {
      bars.t.reverse();
      bars.o.reverse();
      bars.h.reverse();
      bars.l.reverse();
      bars.c.reverse();
      bars.v.reverse();
    }
    
    res.json(bars);
  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Helper function to format date for Twelve Data API
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Search endpoint (optional but recommended)
app.get('/search', async (req, res) => {
  const { query, type, exchange } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query required' });
  }
  
  try {
    const response = await axios.get(
      `https://api.twelvedata.com/symbol_search?symbol=${query}&apikey=${TWELVE_DATA_API_KEY}` 
    );
    
    const symbols = response.data.data || [];
    const forexSymbols = symbols
      .filter(s => s.currency_base && s.currency_quote)
      .map(s => ({
        symbol: `${s.currency_base}/${s.currency_quote}`,
        full_name: `${s.currency_base}/${s.currency_quote}`,
        description: `${s.currency_base}/${s.currency_quote} Forex Pair`,
        exchange: 'FX',
        type: 'forex'
      }));
    
    res.json(forexSymbols);
  } catch (error) {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`TradingView datafeed server running on port ${PORT}`);
});
