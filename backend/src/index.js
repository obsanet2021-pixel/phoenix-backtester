require('dotenv').config();
const express = require('express');
const cors = require('cors');
const configRoutes = require('./routes/udf/config');
const symbolsRoutes = require('./routes/udf/symbols');
const historyRoutes = require('./routes/udf/history');
const searchRoutes = require('./routes/udf/search');
const { udfLimiter } = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173']
}));
app.use(express.json());
app.use(udfLimiter);

// Routes
app.use('/config', configRoutes);
app.use('/symbols', symbolsRoutes);
app.use('/history', historyRoutes);
app.use('/search', searchRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Phoenix Backtester UDF Server running on port ${PORT}`);
});
