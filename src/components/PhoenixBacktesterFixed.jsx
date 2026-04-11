import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import './PhoenixBacktesterFixed.css';

const PhoenixBacktesterFixed = () => {
  const [balance, setBalance] = useState(10000.00);
  const [equity, setEquity] = useState(10000.00);
  const [unrealizedPnL, setUnrealizedPnL] = useState(0.00);
  const [activeTradeType, setActiveTradeType] = useState('Buy');
  const [activeOrderType, setActiveOrderType] = useState('Market');
  const [entryPrice, setEntryPrice] = useState(4483.415);
  const [takeProfit, setTakeProfit] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [riskPercent, setRiskPercent] = useState(1);
  const [riskAmount, setRiskAmount] = useState(49.94);
  const [partials, setPartials] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(4483.415);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  // Generate sample candlestick data
  const generateCandlestickData = () => {
    const data = [];
    const basePrice = 4483.415;
    const now = Date.now();
    
    for (let i = 1000; i >= 0; i--) {
      const time = now - i * 60000; // 1-minute intervals
      const variation = (Math.random() - 0.5) * 10;
      const open = basePrice + variation;
      const close = basePrice + variation + (Math.random() - 0.5) * 5;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      
      data.push({
        time,
        open,
        high,
        low,
        close
      });
    }
    return data;
  };

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 460,
      layout: {
        background: { type: ColorType.Solid, color: '#131a2c' },
        textColor: '#eef2ff',
      },
      grid: {
        vertLines: { color: '#2d3748' },
        horzLines: { color: '#2d3748' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#ff6b00' },
        horzLine: { color: '#ff6b00' },
      },
      timeScale: {
        borderColor: '#2d3748',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#2d3748',
        textColor: '#eef2ff',
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    });

    const data = generateCandlestickData();
    candlestickSeries.setData(data);

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Update current price periodically
    const updatePrice = () => {
      const lastCandle = data[data.length - 1];
      if (lastCandle) {
        setCurrentPrice(lastCandle.close);
      }
    };

    updatePrice();
    const interval = setInterval(updatePrice, 1000);

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update risk amount when percent changes
  useEffect(() => {
    const amount = (balance * riskPercent) / 100;
    setRiskAmount(amount);
  }, [riskPercent, balance]);

  // Update entry price when current price changes
  useEffect(() => {
    if (activeOrderType === 'Market') {
      setEntryPrice(currentPrice);
    }
  }, [currentPrice, activeOrderType]);

  // Calculate P&L for positions
  useEffect(() => {
    let totalUnrealized = 0;
    positions.forEach(pos => {
      const pnl = (currentPrice - pos.entryPrice) * pos.size * (pos.type === 'Buy' ? 1 : -1);
      totalUnrealized += pnl;
    });
    setUnrealizedPnL(totalUnrealized);
    setEquity(balance + totalUnrealized);
  }, [positions, currentPrice, balance]);

  const handleTradeType = (type) => {
    setActiveTradeType(type);
  };

  const handleOrderType = (type) => {
    setActiveOrderType(type);
    if (type === 'Market') {
      setEntryPrice(currentPrice);
    }
  };

  const addPartial = () => {
    const price = prompt("Enter partial take-profit price (e.g., 4490.25):", "4485.00");
    const percent = prompt("Enter percentage of position to close at this level (0-100):", "25");
    if (price && percent) {
      setPartials([...partials, { price: parseFloat(price), percent: parseFloat(percent) }]);
    }
  };

  const removePartial = (index) => {
    setPartials(partials.filter((_, i) => i !== index));
  };

  const placeOrder = () => {
    const order = {
      id: Date.now(),
      type: activeTradeType,
      orderType: activeOrderType,
      entryPrice: activeOrderType === 'Market' ? currentPrice : entryPrice,
      takeProfit,
      stopLoss,
      size: (riskAmount / 100) * balance / 100, // Simple position sizing
      timestamp: new Date().toISOString()
    };

    // Calculate risk
    const risk = Math.abs(takeProfit - entryPrice) || Math.abs(stopLoss - entryPrice) || 50;
    
    if (riskAmount > balance * 0.05) {
      alert('Risk amount exceeds 5% of balance!');
      return;
    }

    setPositions([...positions, order]);
    setBalance(balance - riskAmount);
    
    alert(`Order placed: ${activeTradeType} ${activeOrderType} at ${activeOrderType === 'Market' ? currentPrice.toFixed(3) : entryPrice}`);
  };

  const closePosition = (positionId) => {
    const position = positions.find(p => p.id === positionId);
    if (!position) return;

    const pnl = (currentPrice - position.entryPrice) * position.size * (position.type === 'Buy' ? 1 : -1);
    setBalance(balance + pnl);
    setPositions(positions.filter(p => p.id !== positionId));
    setTrades([...trades, { ...position, closePrice: currentPrice, pnl, closeTime: new Date().toISOString() }]);
  };

  const exportData = () => {
    const data = {
      balance,
      equity,
      unrealizedPnL,
      positions,
      trades,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phoenix-backtester-data.json';
    a.click();
  };

  const exitSession = () => {
    if (confirm("Exit session? All unsaved data will be lost.")) {
      window.location.href = '/';
    }
  };

  const cancelOrder = () => {
    setTakeProfit(0);
    setStopLoss(0);
    setPartials([]);
    setRiskPercent(1);
    alert("Order ticket cleared.");
  };

  const saveOrder = () => {
    placeOrder();
  };

  return (
    <div className="dashboard">
      {/* LEFT SIDE: CHART + NEWS SECTION */}
      <div className="left-panel">
        {/* Chart Card */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>🔥 Phoenix Chart · FX: GBP/USD</h3>
            <div className="timeframe-badge">1m · Real-time</div>
          </div>
          <div id="tradingview-widget" ref={chartContainerRef}></div>
        </div>

        {/* News & Info Card */}
        <div className="info-card">
          <div className="section-title">
            <span>📰 News <span style={{color: '#aaa'}}>(+/- 7 days)</span> <span style={{fontSize: '0.65rem'}}>Times shown in Europe/London</span></span>
            <div className="impact-tags">
              <span className="impact-high">● High</span>
              <span className="impact-medium">● Medium</span>
              <span className="impact-low">● Low</span>
            </div>
          </div>
          <div className="currency-strip">
            <span style={{color: '#ff6b00', fontSize: '0.7rem'}}>CURRENCIES:</span>
            <span className="currency-pill">AUD</span> <span className="currency-pill">CAD</span> <span className="currency-pill">CHF</span>
            <span className="currency-pill">CNY</span> <span className="currency-pill">EUR</span> <span className="currency-pill">GBP</span>
            <span className="currency-pill">JPY</span> <span className="currency-pill">NZD</span> <span className="currency-pill">USD</span>
            <span className="holidays-badge">📅 Holiday: US Thanksgiving (Observed)</span>
          </div>
          <div className="news-row">
            <div className="news-week">Today</div>
            <div className="news-desc no-events">No events for this period.</div>
          </div>
          <div className="news-row">
            <div className="news-week">Next week</div>
            <div className="news-desc">🇺🇸 FOMC Minutes (High) · 🇪🇺 ECB Lagarde Speech (Medium)</div>
          </div>
          <div className="news-row">
            <div className="news-week">Last week</div>
            <div className="news-desc">🇬🇧 UK CPI (High) 3.2% vs forecast 3.0% · 🇨🇦 Retail Sales (Medium)</div>
          </div>
          
          {/* Balance & Equity row */}
          <div className="balance-footer">
            <span>Balance: <strong style={{color: '#ff6b00'}}>${balance.toFixed(2)}</strong></span>
            <span>Equity: <strong>${equity.toFixed(2)}</strong></span>
            <span>Unrealized PnL: <strong style={{color: unrealizedPnL >= 0 ? '#22c55e' : '#ef4444'}}>${unrealizedPnL.toFixed(2)}</strong></span>
          </div>
          <div className="backtester-row">
            <span>🤖 Phoenix Backtester v2</span>
            <div>
              <button onClick={exportData} className="export-btn">Export Data</button>
              <button onClick={exitSession} className="exit-btn">Exit Session</button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: TRADE PANEL */}
      <div className="trade-panel">
        <div className="panel-header">
          <h2>💱 Place a Trade:</h2>
        </div>
        
        {/* Buy / Sell toggle */}
        <div className="trade-type-buttons">
          <button 
            className={`trade-btn buy ${activeTradeType === 'Buy' ? 'active' : ''}`}
            onClick={() => handleTradeType('Buy')}
          >
            Buy
          </button>
          <button 
            className={`trade-btn sell ${activeTradeType === 'Sell' ? 'active' : ''}`}
            onClick={() => handleTradeType('Sell')}
          >
            Sell
          </button>
        </div>
        
        {/* Order Type: Limit, Market, Stop */}
        <div className="order-type">
          <span 
            className={activeOrderType === 'Limit' ? 'active-order' : ''}
            onClick={() => handleOrderType('Limit')}
          >
            Limit
          </span>
          <span 
            className={activeOrderType === 'Market' ? 'active-order' : ''}
            onClick={() => handleOrderType('Market')}
          >
            Market
          </span>
          <span 
            className={activeOrderType === 'Stop' ? 'active-order' : ''}
            onClick={() => handleOrderType('Stop')}
          >
            Stop
          </span>
        </div>
        
        {/* Entry Price */}
        <div className="input-group">
          <div className="input-label">Entry Price <span style={{color: '#ff6b00'}}>(current ask)</span></div>
          <input 
            type="text" 
            className="input-field" 
            value={activeOrderType === 'Market' ? currentPrice.toFixed(3) : entryPrice}
            readOnly={activeOrderType === 'Market'}
            style={{background: activeOrderType === 'Market' ? '#1a2538' : '#0a0f1c', cursor: activeOrderType === 'Market' ? 'not-allowed' : 'text'}}
            onChange={(e) => setEntryPrice(parseFloat(e.target.value))}
          />
        </div>
        
        {/* Take Profit & Stop Loss */}
        <div className="input-group">
          <div className="input-label">Take Profit</div>
          <input 
            type="number" 
            className="input-field" 
            value={takeProfit} 
            onChange={(e) => setTakeProfit(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-group">
          <div className="input-label">Stop Loss</div>
          <input 
            type="number" 
            className="input-field" 
            value={stopLoss} 
            onChange={(e) => setStopLoss(parseFloat(e.target.value))}
          />
        </div>

        {/* Current Balance row */}
        <div className="balance-row">
          <span>Current Balance: <strong>${balance.toFixed(2)}</strong></span>
          <span>Risk Amount: <strong style={{color: '#ff6b00'}}>${riskAmount.toFixed(2)}</strong></span>
        </div>

        {/* Risk Percent and Amount */}
        <div className="risk-control">
          <div className="risk-percent">
            <span>Risk Percent (%)</span>
            <span>
              <input 
                type="number" 
                value={riskPercent} 
                onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
                style={{width: '60px', background: '#0f172a', border: '1px solid #2d3748', color: 'white', borderRadius: '20px', padding: '4px 8px'}}
              /> %
            </span>
          </div>
          <div className="risk-percent">
            <span>Risk Amount ($)</span>
            <span>${riskAmount.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            className="risk-slider" 
            min="0" 
            max="5" 
            step="0.1" 
            value={riskPercent}
            onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
          />
          <div className="small-text" style={{marginTop: '6px'}}>*based on {riskPercent}% of current balance</div>
        </div>

        {/* Partials */}
        <div className="partials">
          <span>Partials</span>
          <button className="add-partial" onClick={addPartial}>+ Add Partial</button>
        </div>
        <div style={{margin: '0 20px 10px 20px', fontSize: '0.7rem', color: '#9aa9c1'}}>
          {partials.length === 0 ? (
            <span style={{opacity: '0.6'}}>No partials set. Click "Add Partial" to define take-profit levels.</span>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
              {partials.map((p, idx) => (
                <div key={idx} style={{display: 'flex', justifyContent: 'space-between', background: '#0f172a', padding: '5px 8px', borderRadius: '12px'}}>
                  <span>📊 {p.percent}% at ${p.price}</span>
                  <button 
                    className="remove-partial" 
                    onClick={() => removePartial(idx)}
                    style={{background: 'none', border: 'none', color: '#ff6b00', cursor: 'pointer'}}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Positions */}
        {positions.length > 0 && (
          <div style={{margin: '20px'}}>
            <h3 style={{fontSize: '0.9rem', marginBottom: '10px', color: '#ff6b00'}}>Active Positions</h3>
            {positions.map(pos => (
              <div key={pos.id} style={{background: '#0f172a', padding: '8px', borderRadius: '8px', marginBottom: '8px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}>
                  <span>{pos.type} {pos.size.toFixed(2)} @ {pos.entryPrice.toFixed(3)}</span>
                  <button 
                    onClick={() => closePosition(pos.id)}
                    style={{background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer'}}
                  >
                    Close
                  </button>
                </div>
                <div style={{fontSize: '0.7rem', color: '#9aa9c1', marginTop: '4px'}}>
                  P&L: <span style={{color: ((currentPrice - pos.entryPrice) * pos.size * (pos.type === 'Buy' ? 1 : -1)) >= 0 ? '#22c55e' : '#ef4444'}}>
                    ${((currentPrice - pos.entryPrice) * pos.size * (pos.type === 'Buy' ? 1 : -1)).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Session buttons */}
        <div className="session-buttons">
          <button className="session-btn" onClick={() => alert('🕒 Session switched to London (simulated).')}>🇬🇧 London</button>
          <button className="session-btn" onClick={() => alert('🕒 Session switched to New York (simulated).')}>🇺🇸 New York</button>
          <button className="session-btn" onClick={() => alert('🕒 Session switched to Tokyo (simulated).')}>🇯🇵 Tokyo</button>
          <button className="session-btn custom" onClick={() => alert('⏱ Custom Time session selected')}>⏱ Custom Time</button>
        </div>

        {/* Cancel & Save buttons */}
        <div className="action-buttons">
          <button className="cancel-btn" onClick={cancelOrder}>Cancel</button>
          <button className="save-btn" onClick={saveOrder}>Place Order</button>
        </div>
        <div className="small-text" style={{paddingBottom: '16px'}}>*simulated environment | leverage & margin not applied</div>
      </div>
    </div>
  );
};

export default PhoenixBacktesterFixed;
