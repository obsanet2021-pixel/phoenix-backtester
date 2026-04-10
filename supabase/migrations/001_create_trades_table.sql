-- Create trades table for backtesting platform
CREATE TABLE trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Trade identification
    pair TEXT NOT NULL CHECK (pair IN ('EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURGBP', 'EURJPY', 'GBPJPY', 'XAUUSD')),
    type TEXT NOT NULL CHECK (type IN ('Long', 'Short')),
    timeframe TEXT NOT NULL CHECK (timeframe IN ('M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN1')),
    
    -- Price levels
    entry_price NUMERIC(10, 5) NOT NULL,
    exit_price NUMERIC(10, 5),
    stop_loss NUMERIC(10, 5) NOT NULL,
    take_profit NUMERIC(10, 5) NOT NULL,
    
    -- Trade setup information
    setup_type TEXT NOT NULL CHECK (setup_type IN ('Breaker Block', 'Liquidity Sweep', 'Fair Value Gap', 'Order Block', 'Market Structure Shift', 'Smart Money Concept')),
    outcome TEXT CHECK (outcome IN ('Win', 'Loss', 'BE', 'Open')),
    
    -- Performance tracking
    pnl_amount NUMERIC(10, 2), -- Profit/Loss amount in USD
    notes TEXT,
    
    -- Constraints
    CONSTRAINT check_entry_price_positive CHECK (entry_price > 0),
    CONSTRAINT check_stop_loss_positive CHECK (stop_loss > 0),
    CONSTRAINT check_take_profit_positive CHECK (take_profit > 0),
    CONSTRAINT check_exit_price_positive CHECK (exit_price IS NULL OR exit_price > 0),
    CONSTRAINT check_outcome_requires_exit_price CHECK (
        (outcome IS NULL) OR 
        (outcome = 'Open') OR 
        (outcome IN ('Win', 'Loss', 'BE') AND exit_price IS NOT NULL)
    )
);

-- Add indexes for performance
CREATE INDEX idx_trades_pair ON trades(pair);
CREATE INDEX idx_trades_timeframe ON trades(timeframe);
CREATE INDEX idx_trades_setup_type ON trades(setup_type);
CREATE INDEX idx_trades_outcome ON trades(outcome);
CREATE INDEX idx_trades_created_at ON trades(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own trades (assuming you'll add a user_id column later)
-- For now, allow all operations (you'll want to restrict this in production)
CREATE POLICY "Allow all operations on trades" ON trades
    FOR ALL USING (true)
    WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE trades IS 'Stores all trading backtest data for the Phoenix Challenge';
COMMENT ON COLUMN trades.pair IS 'Currency pair being traded';
COMMENT ON COLUMN trades.type IS 'Trade direction: Long or Short';
COMMENT ON COLUMN trades.timeframe IS 'Chart timeframe for the trade setup';
COMMENT ON COLUMN trades.setup_type IS 'Type of ICT setup used for entry';
COMMENT ON COLUMN trades.outcome IS 'Trade result: Win, Loss, BE (Breakeven), or Open';
COMMENT ON COLUMN trades.pnl_amount IS 'Profit/Loss amount in USD for $10k challenge tracking';
