const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const { symbol, from, to, resolution } = req.query;
  const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
  
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

module.exports = router;
