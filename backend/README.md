# Phoenix Backtester UDF Server API Documentation

## Overview

This is a UDF (Universal Data Feed) compatible server for TradingView charts, providing real-time and historical forex data via the Twelve Data API.

**Base URL:** `http://localhost:3001` (development) or `https://phoenix-backtester.onrender.com` (production)

---

## Endpoints

### 1. GET `/config`

Returns configuration information about supported features, exchanges, and symbol types.

**Response:**
```json
{
  "supports_search": true,
  "supports_group_request": false,
  "supports_marks": false,
  "supports_timescale_marks": false,
  "supports_time": true,
  "exchanges": [
    {
      "value": "FX",
      "name": "Forex",
      "desc": "Forex Market"
    },
    {
      "value": "INDEX",
      "name": "Indices",
      "desc": "Stock Indices"
    }
  ],
  "symbols_types": [
    {
      "name": "Forex",
      "value": "forex"
    },
    {
      "name": "Index",
      "value": "index"
    }
  ]
}
```

**Usage:** Called by TradingView widget on initialization to determine supported features.

---

### 2. GET `/symbols`

Returns metadata for a specific trading symbol.

**Query Parameters:**
- `symbol` (required): Symbol name (e.g., "EUR/USD", "GBP/USD")

**Response:**
```json
{
  "symbol": "EUR/USD",
  "full_name": "EUR/USD",
  "description": "EUR/USD Forex Pair",
  "exchange": "FX",
  "type": "forex",
  "minmov": 1,
  "minmove2": 0,
  "pointvalue": 1,
  "fractional": true,
  "pricescale": 100000,
  "has_intraday": true,
  "has_no_volume": true,
  "supported_resolutions": ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
  "session": "24x7",
  "timezone": "Etc/UTC"
}
```

**Error Response (400):**
```json
{
  "error": "Symbol parameter required"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch symbol data"
}
```

**Usage:** Called by TradingView widget when a symbol is selected.

**Caching:** Symbol metadata is cached in memory for performance.

---

### 3. GET `/history`

Returns historical OHLCV (Open, High, Low, Close, Volume) data for a symbol.

**Query Parameters:**
- `symbol` (required): Symbol name (e.g., "EUR/USD", "GBP/USD")
- `from` (required): Unix timestamp for start date
- `to` (required): Unix timestamp for end date
- `resolution` (required): Timeframe - "1", "5", "15", "30", "60", "1D", "1W", "1M"

**Response:**
```json
{
  "s": "ok",
  "t": [1641024000, 1641027600, 1641031200],
  "o": [1.1345, 1.1350, 1.1348],
  "h": [1.1360, 1.1355, 1.1362],
  "l": [1.1340, 1.1348, 1.1345],
  "c": [1.1352, 1.1351, 1.1358],
  "v": [1200, 1500, 1800]
}
```

**Response Fields:**
- `s`: Status - "ok" or "no_data"
- `t`: Array of timestamps (Unix time)
- `o`: Array of open prices
- `h`: Array of high prices
- `l`: Array of low prices
- `c`: Array of close prices
- `v`: Array of volumes

**Error Response (400):**
```json
{
  "error": "Missing required parameters"
}
```

**Error Response (400):**
```json
{
  "error": "Resolution X not supported"
}
```

**Error Response (429):**
```json
{
  "error": "Rate limit exceeded. Try again later."
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch historical data"
}
```

**Usage:** Called by TradingView widget to load historical chart data.

**Limitations:**
- Maximum 5000 data points per request (Twelve Data free tier limit)
- Data is fetched from Twelve Data API
- Rate limited to 100 requests per 15 minutes per IP

---

### 4. GET `/search`

Searches for symbols matching a query.

**Query Parameters:**
- `query` (required): Search term (e.g., "EUR", "USD", "GBP")
- `type` (optional): Filter by type (e.g., "forex")
- `exchange` (optional): Filter by exchange (e.g., "FX")

**Response:**
```json
[
  {
    "symbol": "EUR/USD",
    "full_name": "EUR/USD",
    "description": "EUR/USD Forex Pair",
    "exchange": "FX",
    "type": "forex"
  },
  {
    "symbol": "GBP/USD",
    "full_name": "GBP/USD",
    "description": "GBP/USD Forex Pair",
    "exchange": "FX",
    "type": "forex"
  }
]
```

**Error Response (400):**
```json
{
  "error": "Query required"
}
```

**Usage:** Called by TradingView widget's symbol search feature.

---

### 5. GET `/health`

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-04-16T07:00:00.000Z"
}
```

**Usage:** For monitoring and load balancer health checks.

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Window:** 15 minutes (900,000ms)
- **Max Requests:** 100 per window per IP
- **Response on limit exceeded:** HTTP 429 with error message

Configure via environment variables:
- `RATE_LIMIT_WINDOW_MS`: Time window in milliseconds (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: 100)

---

## CORS Configuration

The server allows CORS from configured origins:

- Default: `http://localhost:5173,http://localhost:3000`
- Configure via `ALLOWED_ORIGINS` environment variable (comma-separated)

---

## Environment Variables

Required variables (see `.env.example`):

```env
TWELVE_DATA_API_KEY=your_twelve_data_api_key
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Supported Symbols

### Forex (FX)
- EUR/USD (Euro/US Dollar)
- GBP/USD (British Pound/US Dollar)
- USD/JPY (US Dollar/Japanese Yen)
- AUD/USD (Australian Dollar/US Dollar)
- USDCAD (US Dollar/Canadian Dollar)

### Indices
- SPX (S&P 500)
- NAS100 (NASDAQ 100)
- DAX30 (DAX 30)
- FTSE100 (FTSE 100)

---

## Supported Timeframes

- `1` - 1 Minute
- `5` - 5 Minutes
- `15` - 15 Minutes
- `30` - 30 Minutes
- `60` - 1 Hour
- `1D` - 1 Day
- `1W` - 1 Week
- `1M` - 1 Month

---

## Error Handling

All endpoints return JSON error responses with the following structure:

```json
{
  "error": "Error message description"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Data Source

Historical data is provided by [Twelve Data API](https://twelvedata.com/).

**Free Tier Limitations:**
- 800 API credits per day
- Maximum 5000 data points per request
- Forex and Crypto data only

---

## Development

### Running Locally

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm start
```

Server will run on `http://localhost:3001`

### Running in Development Mode

```bash
npm run dev
```

Uses nodemon for auto-reload on file changes.

---

## Deployment

### Render Deployment

The server is deployed on Render: `https://phoenix-backtester.onrender.com`

Deployment configuration is in `render.yaml`.

---

## Testing Endpoints

### Using curl

```bash
# Config
curl http://localhost:3001/config

# Symbol info
curl "http://localhost:3001/symbols?symbol=EUR/USD"

# Historical data
curl "http://localhost:3001/history?symbol=EUR/USD&from=1641024000&to=1641638400&resolution=15"

# Search
curl "http://localhost:3001/search?query=EUR"

# Health check
curl http://localhost:3001/health
```

---

## Troubleshooting

### Rate Limit Errors
If you receive 429 errors, wait 15 minutes before making more requests.

### Empty Data Responses
- Check that the symbol is supported
- Verify the date range is valid
- Ensure your Twelve Data API key has sufficient credits

### CORS Errors
- Add your frontend URL to `ALLOWED_ORIGINS` environment variable
- Check that the frontend is using the correct backend URL

---

## License

Part of the Phoenix Backtester project.
