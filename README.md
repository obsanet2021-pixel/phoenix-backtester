# Phoenix Backtester

Phoenix Backtester is a trading journal and backtesting platform built for strategy testing, performance review, and challenge-account style risk management.

The project is currently transitioning from a prototype into a production-ready application. This repo now includes:

- A React 19 + Vite frontend for the product UI
- An Express backend that exposes a TradingView-compatible UDF datafeed
- Supabase for authentication and trade persistence
- Vitest + Testing Library for frontend testing

## Architecture

### Frontend

- Framework: React 19
- Build tool: Vite
- Routing: React Router
- Charts: Chart.js and TradingView widget integration
- State: React context providers for auth and trades

Key frontend areas:

- `src/context/AuthContext.jsx`: Supabase session management
- `src/context/TradesContext.jsx`: shared trade data store
- `src/features/backtester/`: refactored backtester UI and hooks
- `src/pages/`: route-level screens

### Backend

- Runtime: Node.js + Express
- Purpose: TradingView UDF-compatible market data endpoints
- Location: `backend/src`

Key backend routes:

- `/config`
- `/symbols`
- `/history`
- `/search`
- `/health`

### Data Layer

- Auth: Supabase Auth
- Database: Supabase Postgres
- Schema migrations: `supabase/migrations`

The trade model is being standardized around authenticated ownership, typed trade records, and metadata for UI-specific fields.

## Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project
- A Twelve Data API key for the backend market-data proxy

## Environment Variables

### Frontend `.env`

Create `./.env` from `./.env.example`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_BACKEND_URL=http://localhost:3001
VITE_TRADINGVIEW_DATAFEED_URL=http://localhost:3001
VITE_APP_URL=http://localhost:5173
```

### Backend `backend/.env`

Create `./backend/.env` from `./backend/.env.example`:

```env
TWELVE_DATA_API_KEY=your_twelve_data_api_key
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Installation

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

## Running the App

### Frontend

```bash
npm run dev
```

The frontend runs on [http://localhost:5173](http://localhost:5173).

### Backend

```bash
cd backend
npm run dev
```

The backend runs on [http://localhost:3001](http://localhost:3001).

### Production Build

Frontend:

```bash
npm run build
npm run preview
```

Backend:

```bash
cd backend
npm start
```

## Testing

Run the frontend test suite:

```bash
npm run test
```

Run coverage:

```bash
npm run test:coverage
```

## Supabase Setup

1. Create a Supabase project.
2. Add the frontend environment variables to `./.env`.
3. Run the SQL migrations in `supabase/migrations`.
4. Enable email auth in Supabase Auth.
5. If using OAuth, configure the Google provider and add the callback URL from your Supabase project settings.

## Current Transition Plan

The repository is being upgraded in these areas:

- Removing text-encoding corruption and placeholder docs
- Refactoring large prototype components into feature modules
- Replacing demo auth with Supabase Auth
- Replacing `localStorage`-only trade persistence with Supabase-backed storage
- Tightening environment-variable and secret handling
- Expanding meaningful automated test coverage

## Useful Commands

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run test
```

Backend:

```bash
cd backend
npm run dev
npm start
```
