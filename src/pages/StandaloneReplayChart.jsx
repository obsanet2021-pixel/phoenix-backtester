import React from 'react'
import { useNavigate } from 'react-router-dom'
import ReplayChart from '../components/charts/ReplayChart'

const StandaloneReplayChart = () => {
  const navigate = useNavigate()

  const handleExitSession = () => {
    navigate('/backtest')
  }

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <div className="page-title">Backtest Session</div>
          <div className="page-sub">Historical Replay Chart · EURUSD 1H</div>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">{'\ud83d\udcca'} Live Session</div>
          <button className="btn-outline">Export Data</button>
          <button 
            onClick={handleExitSession}
            className="btn-primary"
          >
            Exit Session
          </button>
        </div>
      </div>

      <div className="content">
        {/* Session Info Banner */}
        <div className="challenge-banner">
          <div>
            <div className="challenge-label">Replay Session</div>
            <div className="challenge-title">EUR/USD Historical Data</div>
          </div>
          <div className="progress-wrap">
            <div className="progress-label">
              <span>Session Progress</span>
              <span style={{ color: '#ff8c3a' }}>0%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '0%' }}></div>
            </div>
          </div>
          <div className="challenge-right">
            <div className="chal-stat">
              <div className="chal-stat-val" style={{ color: '#22c55e' }}>3 Years</div>
              <div className="chal-stat-label">Data Range</div>
            </div>
            <div className="chal-stat">
              <div className="chal-stat-val" style={{ color: '#fff' }}>1H</div>
              <div className="chal-stat-label">Timeframe</div>
            </div>
            <div className="chal-stat">
              <div className="chal-stat-val" style={{ color: '#ef4444' }}>0 Trades</div>
              <div className="chal-stat-label">Executed</div>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="chart-section">
          <div className="chart-card" style={{ height: '500px' }}>
            <div className="chart-header">
              <div className="chart-title">Historical Replay Chart</div>
              <div className="chart-tabs">
                <div className="chart-tab active">1H</div>
                <div className="chart-tab">4H</div>
                <div className="chart-tab">1D</div>
              </div>
            </div>
            <div style={{ position: 'relative', height: '400px' }}>
              <ReplayChart pair="EURUSD" timeframe="1h" years={3} />
            </div>
          </div>
        </div>

        {/* Session Controls Info */}
        <div className="stats-grid">
          <div className="stat-card positive">
            <div className="stat-icon green">{'\u25b6\ufe0f'}</div>
            <div className="stat-label">Playback Status</div>
            <div className="stat-value white">Ready</div>
            <div className="stat-change neutral">Use controls below chart</div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon blue">{'\ud83d\udcc8'}</div>
            <div className="stat-label">Data Points</div>
            <div className="stat-value white">~26,000</div>
            <div className="stat-change neutral">3 years of 1H data</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon orange">{'\u2699\ufe0f'}</div>
            <div className="stat-label">Speed Control</div>
            <div className="stat-value white">1x</div>
            <div className="stat-change neutral">Adjustable 1x-10x</div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon blue">{'\ud83c\udfaf'}</div>
            <div className="stat-label">Trading Mode</div>
            <div className="stat-value white">Simulation</div>
            <div className="stat-change neutral">Practice trades</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StandaloneReplayChart
