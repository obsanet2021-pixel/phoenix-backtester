import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import NewsPanel from './NewsPanel';
import TradePanel from './TradePanel';
import './PhoenixBacktesterNew.css';

const PhoenixBacktesterNew = () => {
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
  
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  // Initialize TradingView chart
  useEffect(() => {
    if (typeof TradingView !== 'undefined' && chartContainerRef.current && !chartRef.current) {
      const chart = new TradingView.widget({
        container_id: "tradingview-widget",
        width: "100%",
        height: 460,
        symbol: "FX_IDC:GBPUSD",
        interval: "1",
        timezone: "Europe/London",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#0f172a",
        enable_publishing: false,
        allow_symbol_change: true,
        hide_top_toolbar: false,
        save_image: false,
        studies: ["MASimple@tv-basicstudies"],
        show_popup_button: true,
        popup_width: "1000",
        popup_height: "650"
      });
      
      chartRef.current = chart;
    } else if (chartContainerRef.current) {
      chartContainerRef.current.innerHTML = '<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#ff6b00;">Loading TradingView Chart...</div>';
    }
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

  const exportData = () => {
    const data = {
      balance,
      equity,
      unrealizedPnL,
      activeTradeType,
      activeOrderType,
      entryPrice,
      takeProfit,
      stopLoss,
      riskPercent,
      riskAmount,
      partials,
      timestamp: new Date().toISOString()
    };
    console.log("Export Data", data);
    alert("Export data simulated. Check console for JSON export.");
  };

  const exitSession = () => {
    if (confirm("Exit session? All unsaved order data will be lost.")) {
      alert("Session ended. Page will reload (demo).");
      window.location.reload();
    }
  };

  const saveOrder = () => {
    alert(`✅ Order Saved!\nType: ${activeTradeType} ${activeOrderType}\nEntry: ${activeOrderType === 'Market' ? 'MARKET ~4483.415' : entryPrice}\nTake Profit: ${takeProfit || 'None'}\nStop Loss: ${stopLoss || 'None'}\nRisk: ${riskPercent}% ($${riskAmount.toFixed(2)})\nPartials: ${partials.length} levels.`);
  };

  const cancelOrder = () => {
    setTakeProfit(0);
    setStopLoss(0);
    setPartials([]);
    setRiskPercent(1);
    alert("Order ticket cleared.");
  };

  return (
    <div className="dashboard">
      {/* LEFT SIDE: CHART + NEWS SECTION */}
      <div className="left-panel">
        {/* TradingView Chart Card */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><i className="fas fa-chart-line" style={{marginRight: '6px'}}></i> TradingView · FX: GBP/USD</h3>
            <div className="timeframe-badge">1m · Real-time</div>
          </div>
          <div id="tradingview-widget" ref={chartContainerRef}></div>
        </div>

        {/* News & Impact + Holiday + Currencies */}
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
            <span className="currency-pill">AUD</span> <span className="currency-pill">CAD</span> <span className="currency-pill">CHF</span> <span className="currency-pill">CNY</span> <span className="currency-pill">EUR</span> <span className="currency-pill">GBP</span> <span className="currency-pill">JPY</span> <span className="currency-pill">NZD</span> <span className="currency-pill">USD</span>
            <span className="holidays-badge"><i className="fas fa-calendar-alt"></i> Holiday: US Thanksgiving (Observed)</span>
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
            <span><i className="fas fa-robot"></i> Phoenix Backtester v2</span>
            <div>
              <button onClick={exportData} className="export-btn">Export Data</button>
              <button onClick={exitSession} className="exit-btn">Exit Session</button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: OPEN POSITION CARD */}
      <div className="trade-panel">
        <div className="panel-header">
          <h2><i className="fas fa-exchange-alt"></i> Place a Trade:</h2>
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
            value={activeOrderType === 'Market' ? '4483.415' : entryPrice}
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

        {/* Initial / Current Balance row */}
        <div className="balance-row">
          <span>Initial Balance: <strong>$10000.00</strong></span>
          <span>Current Balance: <strong>${balance.toFixed(2)}</strong></span>
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
          <div className="small-text" style={{marginTop: '6px'}}>*based on 1% of current balance</div>
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

        {/* Go To Sessions: London, New York, Tokyo, Custom Time */}
        <div className="session-buttons">
          <button className="session-btn" onClick={() => alert('🕒 Session switched to London (simulated). Timezone focus would adjust chart.')}>🇬🇧 London</button>
          <button className="session-btn" onClick={() => alert('🕒 Session switched to New York (simulated). Timezone focus would adjust chart.')}>🇺🇸 New York</button>
          <button className="session-btn" onClick={() => alert('🕒 Session switched to Tokyo (simulated). Timezone focus would adjust chart.')}>🇯🇵 Tokyo</button>
          <button className="session-btn custom" onClick={() => alert('⏱ Custom Time session selected')}>⏱ Custom Time</button>
          <button className="session-btn" onClick={() => alert('Customise Layout: Coming soon! (theme, notifications, layouts)')}>⚙ Customise</button>
        </div>

        {/* Cancel & Save buttons */}
        <div className="action-buttons">
          <button className="cancel-btn" onClick={cancelOrder}>Cancel</button>
          <button className="save-btn" onClick={saveOrder}>Save Order</button>
        </div>
        <div className="small-text" style={{paddingBottom: '16px'}}>*simulated environment | leverage & margin not applied</div>
      </div>
    </div>
  );
};

export default PhoenixBacktesterNew;
