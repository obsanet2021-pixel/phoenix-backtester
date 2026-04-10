import React, { useState } from 'react'
import ReplayChart from '../components/charts/ReplayChart'

const PhoenixChart = () => {
  const [symbol, setSymbol] = useState('EURUSD')
  const [timeframe, setTimeframe] = useState('1h')
  const [years, setYears] = useState(3)

  const forexPairs = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF',
    'EURGBP', 'EURJPY', 'GBPJPY', 'AUDJPY', 'NZDUSD', 'EURCHF'
  ]

  const timeframes = [
    { label: '1m', value: '1m' },
    { label: '5m', value: '5m' },
    { label: '15m', value: '15m' },
    { label: '1h', value: '1h' },
    { label: '4h', value: '4h' },
    { label: '1D', value: '1D' }
  ]

  const yearOptions = [
    { label: '2 Years', value: 2 },
    { label: '3 Years', value: 3 },
    { label: '5 Years', value: 5 }
  ]

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <div className="page-title">Backtest Chart</div>
          <div className="page-sub">Phoenix Backtester · Historical Data Replay</div>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">{'\ud83d\udcca'} Historical Replay</div>
          <button className="btn-new">Full Screen</button>
        </div>
      </div>

      <div className="chart-controls">
        <div className="control-group">
          <label>Currency Pair</label>
          <select 
            value={symbol} 
            onChange={(e) => setSymbol(e.target.value)}
            className="control-select"
          >
            {forexPairs.map(pair => (
              <option key={pair} value={pair}>{pair}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Timeframe</label>
          <div className="timeframe-buttons">
            {timeframes.map(tf => (
              <button
                key={tf.value}
                className={`timeframe-btn ${timeframe === tf.value ? 'active' : ''}`}
                onClick={() => setTimeframe(tf.value)}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Historical Period</label>
          <div className="timeframe-buttons">
            {yearOptions.map(year => (
              <button
                key={year.value}
                className={`timeframe-btn ${years === year.value ? 'active' : ''}`}
                onClick={() => setYears(year.value)}
              >
                {year.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="content">
        <div className="chart-wrapper">
          <ReplayChart 
            pair={symbol} 
            timeframe={timeframe} 
            years={years}
          />
        </div>

        <div className="chart-sidebar">
          <div className="sidebar-section">
            <h3>Backtest Settings</h3>
            <div className="market-stats">
              <div className="stat-item">
                <span className="stat-label">Currency Pair</span>
                <span className="stat-value">{symbol}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Timeframe</span>
                <span className="stat-value">{timeframe}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Data Period</span>
                <span className="stat-value">{years} Years</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Candles</span>
                <span className="stat-value">~{years * 252 * 24}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Strategy Info</h3>
            <div className="signal-list">
              <div className="signal-item buy">
                <div className="signal-type">BUY</div>
                <div className="signal-pair">Entry Signal</div>
                <div className="signal-price">RSI Oversold</div>
              </div>
              <div className="signal-item sell">
                <div className="signal-type">SELL</div>
                <div className="signal-pair">Exit Signal</div>
                <div className="signal-price">Take Profit</div>
              </div>
              <div className="signal-item hold">
                <div className="signal-type">HOLD</div>
                <div className="signal-pair">Risk Management</div>
                <div className="signal-price">Stop Loss</div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Backtest Actions</h3>
            <div className="action-buttons">
              <button className="action-btn primary">Start Replay</button>
              <button className="action-btn secondary">Reset Strategy</button>
              <button className="action-btn secondary">Export Results</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhoenixChart
