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
  
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const intervalRef = useRef(null);

  // Generate sample data (replace with real API call)
  useEffect(() => {
    generateHistoricalData();
  }, []);

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
    const newPosition = {
      id: Date.now(),
      side: orderData.side,
      entryPrice: orderData.entryPrice,
      quantity: orderData.riskAmount / orderData.entryPrice,
      stopLoss: orderData.stopLoss,
      takeProfit: orderData.takeProfit,
      entryTime: new Date(),
      unrealizedPnL: 0,
    };
    setActivePositions(prev => [...prev, newPosition]);
  };

  const exportData = () => {
    const data = {
      closedPositions,
      balance,
      totalPnL: closedPositions.reduce((sum, pos) => sum + pos.closedPnL, 0),
      winRate: closedPositions.length > 0 ? (closedPositions.filter(p => p.closedPnL > 0).length / closedPositions.length) * 100 : 0,
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
          <TradePanel 
            onPlaceOrder={placeOrder}
            currentPrice={currentPrice}
            balance={balance}
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
