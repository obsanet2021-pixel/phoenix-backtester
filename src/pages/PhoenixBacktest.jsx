import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Chart } from 'chart.js/auto'

const PhoenixBacktest = ({ setActivePage }) => {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [showNewSession, setShowNewSession] = useState(false)

  const ORANGE = '#ff6b00'
  const TEAL = '#00c4b4'
  const GREEN = '#22c55e'
  const RED = '#ef4444'

  const handleDeleteSession = (sessionId) => {
    setSessions(sessions.filter(s => s.id !== sessionId))
  }

  const handleEditSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId)
    setSelectedSession(session)
    setShowNewSession(true)
  }

  const handlePlaySession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId)
    // Navigate to Phoenix Backtester page
    navigate('/phoenix-backtester')
  }

  const handleViewDetails = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId)
    setSelectedSession(session)
  }

  const SessionCard = ({ session }) => {
    return (
      <div className="session-card">
        <div className="session-card-row">
          <div className="session-key">Name:</div>
          <div className="session-value">{session.name}</div>
        </div>
        <div className="session-card-row">
          <div className="session-key">Pair:</div>
          <div className="session-value">{session.pair}</div>
        </div>
        <div className="session-card-row">
          <div className="session-key">Balance:</div>
          <div className="session-value">{session.balance}</div>
        </div>
        <div className="session-card-row">
          <div className="session-key">Date:</div>
          <div className="session-value">{session.date}</div>
        </div>
        <div className="session-actions">
          <button 
            className="session-btn" 
            onClick={() => handleDeleteSession(session.id)}
            title="Delete"
          >
            {'\ud83d\uddd1\ufe0f'}
          </button>
          <button 
            className="session-btn" 
            onClick={() => handleEditSession(session.id)}
            title="Edit"
          >
            {'\u270f\ufe0f'}
          </button>
          <button 
            className="session-btn" 
            onClick={() => handleViewDetails(session.id)}
            title="Details"
          >
            {'\u2261'}
          </button>
          <button 
            className="session-btn play" 
            onClick={() => handlePlaySession(session.id)}
            title="Play"
          >
            {'\u25b6'}
          </button>
        </div>
      </div>
    )
  }

  const NewSessionModal = () => {
    if (!showNewSession) return null

    const [formData, setFormData] = useState({
      name: selectedSession?.name || '',
      pair: selectedSession?.pair || 'XAUUSD',
      balance: selectedSession?.balance || '$10,000',
      strategy: 'scalping',
      timeframe: '1h'
    })

    const handleSave = () => {
      const newSession = {
        id: selectedSession?.id || Date.now(),
        name: formData.name || 'New Session',
        pair: formData.pair,
        balance: formData.balance,
        strategy: formData.strategy,
        timeframe: formData.timeframe,
        date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'active'
      }

      if (selectedSession) {
        setSessions(sessions.map(s => s.id === selectedSession.id ? newSession : s))
      } else {
        setSessions([...sessions, newSession])
        // Navigate to backtester after creating new session
        navigate('/phoenix-backtester')
      }

      setShowNewSession(false)
      setSelectedSession(null)
    }

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{selectedSession ? 'Edit Session' : 'New Backtest Session'}</h3>
            <button 
              className="modal-close" 
              onClick={() => {
                setShowNewSession(false)
                setSelectedSession(null)
              }}
            >
              {'\u2715'}
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Session Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter session name"
              />
            </div>
            <div className="form-group">
              <label>Currency Pair</label>
              <select 
                value={formData.pair}
                onChange={(e) => setFormData({...formData, pair: e.target.value})}
              >
                <option value="XAUUSD">XAU/USD</option>
                <option value="EURUSD">EUR/USD</option>
                <option value="GBPUSD">GBP/USD</option>
                <option value="USDJPY">USD/JPY</option>
                <option value="AUDUSD">AUD/USD</option>
                <option value="NZDUSD">NZD/USD</option>
              </select>
            </div>
            <div className="form-group">
              <label>Initial Balance</label>
              <input 
                type="text" 
                value={formData.balance}
                onChange={(e) => setFormData({...formData, balance: e.target.value})}
                placeholder="$10,000"
              />
            </div>
            <div className="form-group">
              <label>Strategy</label>
              <select 
                value={formData.strategy}
                onChange={(e) => setFormData({...formData, strategy: e.target.value})}
              >
                <option value="scalping">Scalping</option>
                <option value="swing">Swing Trading</option>
                <option value="day">Day Trading</option>
                <option value="position">Position Trading</option>
              </select>
            </div>
            <div className="form-group">
              <label>Timeframe</label>
              <select 
                value={formData.timeframe}
                onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
              >
                <option value="1m">1 Minute</option>
                <option value="5m">5 Minutes</option>
                <option value="15m">15 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="4h">4 Hours</option>
                <option value="1d">Daily</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="btn-cancel" 
              onClick={() => {
                setShowNewSession(false)
                setSelectedSession(null)
              }}
            >
              Cancel
            </button>
            <button 
              className="btn-primary"
              onClick={handleSave}
            >
              {selectedSession ? 'Update' : 'Create'} Session
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <div className="page-title">Backtest</div>
          <div className="page-sub">Phoenix Challenge · Strategy Testing</div>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">{'\ud83d\udd25'} 0 day streak</div>
          <button 
            className="btn-new" 
            onClick={() => setShowNewSession(true)}
          >
            + New Session
          </button>
        </div>
      </div>

      <div className="content">
        <div className="sessions-title">Your Sessions</div>
        <div className="sessions-grid">
          {sessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">{'\ud83d\udcca'}</div>
            <h3>No Backtest Sessions</h3>
            <p>Create your first backtest session to start testing your strategies</p>
            <button 
              className="btn-primary"
              onClick={() => setShowNewSession(true)}
            >
              Create First Session
            </button>
          </div>
        )}
      </div>

      <NewSessionModal />
    </div>
  )
}

export default PhoenixBacktest
