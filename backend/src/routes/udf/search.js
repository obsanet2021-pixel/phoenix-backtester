const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const { query, type, exchange } = req.query;
  const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
  
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

module.exports = router;
