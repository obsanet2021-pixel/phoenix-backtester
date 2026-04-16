const rateLimit = require('express-rate-limit');

const udfLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: { error: 'Too many requests, please try again later.' },
  headers: true
});

module.exports = { udfLimiter };
