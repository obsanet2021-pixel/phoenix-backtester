import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import NewsPanel from './NewsPanel';
import TradePanel from './TradePanel';
import './PhoenixBacktester.css';

const PhoenixBacktester = () => {
  const [balance, setBalance] = useState(10000);
  const [equity, setEquity] = useState(10000);
  const [unrealizedPnL, setUnrealizedPnL] = useState(0);
  const [activePositions, setActivePositions] = useState([]);
  const [closedPositions, setClosedPositions] = useState([]);
  const [currentCandleIndex, setCurrentCandleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [chartData, setChartData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(4483.415);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trades, setTrades] = useState([]);
  const [riskPercent, setRiskPercent] = useState(1);
  const [riskAmount, setRiskAmount] = useState(100);
  
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const intervalRef = useRef(null);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('phoenixBacktesterData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setBalance(data.balance || 10000);
      setEquity(data.equity || 10000);
      setActivePositions(data.activePositions || []);
      setClosedPositions(data.closedPositions || []);
      setTrades(data.trades || []);
      setRiskPercent(data.riskPercent || 1);
    }
    generateHistoricalData();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    const data = {
      balance,
      equity,
      activePositions,
      closedPositions,
      trades,
      riskPercent,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('phoenixBacktesterData', JSON.stringify(data));
  }, [balance, equity, activePositions, closedPositions, trades, riskPercent]);

  // Calculate P&L for positions
  useEffect(() => {
    let totalUnrealized = 0;
    activePositions.forEach(pos => {
      const pnl = (currentPrice - pos.entryPrice) * pos.quantity * (pos.side === 'Buy' ? 1 : -1);
      totalUnrealized += pnl;
    });
    setUnrealizedPnL(totalUnrealized);
    setEquity(balance + totalUnrealized);
  }, [activePositions, currentPrice, balance]);

  // Update risk amount
  useEffect(() => {
    const amount = (balance * riskPercent) / 100;
    setRiskAmount(amount);
  }, [riskPercent, balance]);

  const generateHistoricalData = () => {
    const data = [];
    let basePrice = 4483.415;
    const now = new Date();
    for (let i = 0; i < 1000; i++) {
      const change = (Math.random() - 0.5) * 20;
      basePrice += change;
      const timestamp = new Date(now.getTime() - (1000 - i) * 60000);
      data.push({
        time: timestamp.toISOString(),
        open: basePrice - 5,
        high: basePrice + 10,
        low: basePrice - 10,
        close: basePrice,
        volume: Math.random() * 1000
      });
    }
    setChartData(data);
    setCurrentPrice(data[0]?.close || 4483.415);
  };

  // Initialize chart
  useEffect(() => {
    if (chartContainerRef.current && chartData.length > 0) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#1a1a1a' },
          textColor: '#d1d5db',
        },
        grid: {
          vertLines: { color: '#2d2d2d' },
          horzLines: { color: '#2d2d2d' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 500,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });

      candlestickSeries.setData(chartData);
      chart.timeScale().fitContent();

      chartRef.current = chart;
      seriesRef.current = candlestickSeries;

      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [chartData]);

  // Update current price when candle index changes
  useEffect(() => {
    if (chartData[currentCandleIndex]) {
      setCurrentPrice(chartData[currentCandleIndex].close);
    }
  }, [currentCandleIndex, chartData]);

  // Replay controls
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      intervalRef.current = setInterval(() => {
        if (currentCandleIndex < chartData.length - 1) {
          setCurrentCandleIndex(prev => prev + 1);
          updateChartData(prev => prev + 1);
        } else {
          setIsPlaying(false);
          clearInterval(intervalRef.current);
        }
      }, 1000 / speed);
    } else {
      clearInterval(intervalRef.current);
    }
  };

  const updateChartData = (index) => {
    if (seriesRef.current && chartData[index]) {
      const currentData = chartData.slice(0, index + 1);
      seriesRef.current.setData(currentData);
      chartRef.current.timeScale().setVisibleRange({
        from: currentData[0]?.time,
        to: currentData[currentData.length - 1]?.time,
      });
    }
  };

  const placeOrder = (orderData) => {
    try {
      setIsLoading(true);
      const positionSize = orderData.riskAmount / orderData.entryPrice;
      
      if (orderData.riskAmount > balance) {
        setError('Insufficient balance for this trade');
        setIsLoading(false);
        return;
      }

      const newPosition = {
        id: Date.now(),
        side: orderData.side,
        entryPrice: orderData.entryPrice,
        quantity: positionSize,
        stopLoss: orderData.stopLoss,
        takeProfit: orderData.takeProfit,
        entryTime: new Date().toISOString(),
        unrealizedPnL: 0,
        status: 'open'
      };

      setActivePositions(prev => [...prev, newPosition]);
      setBalance(prev => prev - orderData.riskAmount);
      
      const trade = {
        id: Date.now(),
        ...newPosition,
        riskAmount: orderData.riskAmount,
        timestamp: new Date().toISOString()
      };
      setTrades(prev => [trade, ...prev]);
      
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError('Failed to place order: ' + err.message);
      setIsLoading(false);
    }
  };

  const closePosition = (positionId) => {
    try {
      const position = activePositions.find(p => p.id === positionId);
      if (!position) return;

      const pnl = (currentPrice - position.entryPrice) * position.quantity * (position.side === 'Buy' ? 1 : -1);
      const closedPosition = {
        ...position,
        exitPrice: currentPrice,
        exitTime: new Date().toISOString(),
        pnl: pnl,
        status: 'closed'
      };

      setBalance(prev => prev + position.quantity * currentPrice + pnl);
      setActivePositions(prev => prev.filter(p => p.id !== positionId));
      setClosedPositions(prev => [closedPosition, ...prev]);
      
      setTrades(prev => prev.map(t => 
        t.id === positionId ? { ...t, ...closedPosition } : t
      ));
    } catch (err) {
      setError('Failed to close position: ' + err.message);
    }
  };

  const exportData = () => {
    const data = {
      balance,
      equity,
      unrealizedPnL,
      activePositions,
      closedPositions,
      trades,
      riskPercent,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phoenix-backtest-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exitSession = () => {
    if (window.confirm('Save session before exiting?')) {
      exportData();
    }
    setActivePositions([]);
    setClosedPositions([]);
    setBalance(10000);
    setEquity(10000);
    setUnrealizedPnL(0);
  };

  return (
    <div className="phoenix-backtester">
      <div className="main-layout">
        {/* Left Panel - News */}
        <div className="left-panel">
          <NewsPanel />
        </div>

        {/* Center - Chart */}
        <div className="center-panel">
          <div className="chart-header">
            <div className="timeframe-selector">
              <button className="timeframe-btn active">1m</button>
              <button className="timeframe-btn">5m</button>
              <button className="timeframe-btn">15m</button>
              <button className="timeframe-btn">1h</button>
              <button className="timeframe-btn">4h</button>
              <button className="timeframe-btn">1d</button>
            </div>
            <div className="replay-controls">
              <button onClick={() => setCurrentCandleIndex(Math.max(0, currentCandleIndex - 1))}>
                {'\u23ee'}
              </button>
              <button onClick={togglePlay}>
                {isPlaying ? '\u23f8' : '\u25b6'}
              </button>
              <button onClick={() => setCurrentCandleIndex(Math.min(chartData.length - 1, currentCandleIndex + 1))}>
                {'\u23ed'}
              </button>
              <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={5}>5x</option>
                <option value={10}>10x</option>
              </select>
            </div>
          </div>
          
          <div ref={chartContainerRef} className="chart-container" />
          
          <div className="account-info">
            <div className="info-item">
              <span className="info-label">Balance</span>
              <span className="info-value">${balance.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Equity</span>
              <span className="info-value">${equity.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Unrealized PnL</span>
              <span className={`info-value ${unrealizedPnL >= 0 ? 'text-green' : 'text-red'}`}>
                ${unrealizedPnL.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel - Trade */}
        <div className="right-panel">
          {error && (
            <div className="error-message" style={{
              background: '#ef4444',
              color: 'white',
              padding: '10px',
              margin: '10px',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          {activePositions.length > 0 && (
            <div className="active-positions" style={{
              background: '#1f2937',
              padding: '15px',
              margin: '10px',
              borderRadius: '8px',
              border: '1px solid #374151'
            }}>
              <h4 style={{color: '#ff6b00', marginBottom: '10px'}}>Active Positions</h4>
              {activePositions.map(position => (
                <div key={position.id} style={{
                  background: '#111827',
                  padding: '10px',
                  margin: '5px 0',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{color: position.side === 'Buy' ? '#22c55e' : '#ef4444', fontWeight: 'bold'}}>
                      {position.side}
                    </span>
                    <span style={{marginLeft: '10px'}}>
                      {position.quantity.toFixed(4)} @ {position.entryPrice.toFixed(5)}
                    </span>
                    <span style={{marginLeft: '10px', color: '#9ca3af'}}>
                      P&L: <span style={{color: ((currentPrice - position.entryPrice) * position.quantity * (position.side === 'Buy' ? 1 : -1)) >= 0 ? '#22c55e' : '#ef4444'}}>
                        ${((currentPrice - position.entryPrice) * position.quantity * (position.side === 'Buy' ? 1 : -1)).toFixed(2)}
                      </span>
                    </span>
                  </div>
                  <button 
                    onClick={() => closePosition(position.id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              ))}
            </div>
          )}
          <TradePanel 
            onPlaceOrder={placeOrder}
            currentPrice={currentPrice}
            balance={balance}
            riskPercent={riskPercent}
            setRiskPercent={setRiskPercent}
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="app-branding">
          <div className="phoenix-icon">{'\ud83d\udd25'}</div>
          <span className="app-title">Phoenix Backtester</span>
        </div>
        <div className="bottom-actions">
          <button onClick={exportData} className="export-btn">Export Data</button>
          <button onClick={exitSession} className="exit-btn">Exit Session</button>
        </div>
      </div>
    </div>
  );
};

export default PhoenixBacktester;
