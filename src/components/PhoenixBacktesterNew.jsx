import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const PhoenixBacktesterNew = () => {
  const navigate = useNavigate()
  const chartRef = useRef(null)
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [showGotoDropdown, setShowGotoDropdown] = useState(false)
  const [tradeType, setTradeType] = useState('Buy')
  const [orderType, setOrderType] = useState('Market')
  const [balanceTab, setBalanceTab] = useState('Initial Balance')
  const [sidebarTab, setSidebarTab] = useState('News')
  const [activeCurrency, setActiveCurrency] = useState('USD')
  const [selectedImpact, setSelectedImpact] = useState([])
  const [notes, setNotes] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [newsEvents, setNewsEvents] = useState([])
  const [showMessageCard, setShowMessageCard] = useState(false)
  const [messageCard, setMessageCard] = useState({
    title: 'Phoenix Backtester · System Message',
    subtitle: 'secure | low latency | execution core',
    message: '✨ Phoenix Core ready. All systems operational. Use journal to store notes.',
    type: 'info',
    showAction: false,
    actionText: 'View Logs',
    onAction: null
  })

  // Replay state
  const [isReplaying, setIsReplaying] = useState(false)
  const [replaySpeed, setReplaySpeed] = useState(1)
  const [replayPosition, setReplayPosition] = useState({ x: 20, y: 80 })
  const [isDraggingReplay, setIsDraggingReplay] = useState(false)
  const replayRef = useRef(null)
  
  const [tradeData, setTradeData] = useState({
    entryPrice: '4483.415',
    takeProfit: 0,
    stopLoss: 0,
    riskPercent: 1,
    riskAmount: 49.94
  })

  const [balance, setBalance] = useState({
    balance: 10000.00,
    equity: 10000.00,
    unrealizedPnL: 0.00
  })

  // Load TradingView script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.TradingView && chartRef.current) {
        new window.TradingView.widget({
          "width": "100%",
          "height": "100%",
          "symbol": "XAUUSD",
          "interval": "60",
          "timezone": "Europe/London",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#1e222d",
          "enable_publishing": false,
          "hide_top_toolbar": false,
          "save_image": false,
          "container_id": "tradingview_chart",
          "backgroundColor": "#1e222d",
          "gridColor": "#2a2e39",
          "studies": [],
          "show_popup_button": true,
          "popup_width": "1000",
          "popup_height": "650"
        })
      }
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('phoenixBacktesterNotes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  // Save notes to localStorage and journal
  useEffect(() => {
    localStorage.setItem('phoenixBacktesterNotes', notes);
    
    // Also save to journal
    const journalEntries = JSON.parse(localStorage.getItem('phoenixTrades') || '[]');
    const backtesterNote = {
      id: 'backtester-note',
      type: 'note',
      content: notes,
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'note'
    };
    
    // Update or add the backtester note
    const existingIndex = journalEntries.findIndex(e => e.id === 'backtester-note');
    if (existingIndex >= 0) {
      journalEntries[existingIndex] = backtesterNote;
    } else {
      journalEntries.push(backtesterNote);
    }
    
    localStorage.setItem('phoenixTrades', JSON.stringify(journalEntries));
  }, [notes]);

  // Sample economic calendar data (simulating Forex Factory data)
  const sampleEconomicEvents = [
    { id: 1, event: 'Non-Farm Payrolls', currency: 'USD', date: '2024-01-05', time: '13:30', impact: 'High', actual: '216K', forecast: '170K', previous: '216K' },
    { id: 2, event: 'CPI m/m', currency: 'USD', date: '2024-01-11', time: '13:30', impact: 'High', actual: '0.3%', forecast: '0.2%', previous: '0.1%' },
    { id: 3, event: 'Retail Sales m/m', currency: 'USD', date: '2024-01-17', time: '13:30', impact: 'High', actual: '0.4%', forecast: '0.2%', previous: '0.3%' },
    { id: 4, event: 'FOMC Meeting Minutes', currency: 'USD', date: '2024-01-03', time: '19:00', impact: 'High', actual: '-', forecast: '-', previous: '-' },
    { id: 5, event: 'GDP q/q', currency: 'USD', date: '2024-01-25', time: '13:30', impact: 'High', actual: '3.3%', forecast: '2.0%', previous: '4.9%' },
    { id: 6, event: 'Unemployment Rate', currency: 'USD', date: '2024-02-02', time: '13:30', impact: 'High', actual: '3.7%', forecast: '3.8%', previous: '3.7%' },
    { id: 7, event: 'CPI y/y', currency: 'EUR', date: '2024-02-01', time: '10:00', impact: 'High', actual: '2.8%', forecast: '2.7%', previous: '2.9%' },
    { id: 8, event: 'Interest Rate Decision', currency: 'GBP', date: '2024-02-01', time: '12:00', impact: 'High', actual: '5.25%', forecast: '5.25%', previous: '5.25%' },
    { id: 9, event: 'Trade Balance', currency: 'USD', date: '2024-02-07', time: '13:30', impact: 'Medium', actual: '-$62.2B', forecast: '-$61.5B', previous: '-$61.5B' },
    { id: 10, event: 'Consumer Confidence', currency: 'USD', date: '2024-02-27', time: '10:00', impact: 'Medium', actual: '106.7', forecast: '115.0', previous: '114.8' },
    { id: 11, event: 'PPI m/m', currency: 'USD', date: '2024-02-14', time: '13:30', impact: 'Medium', actual: '0.3%', forecast: '0.1%', previous: '-0.2%' },
    { id: 12, event: 'Manufacturing PMI', currency: 'USD', date: '2024-02-01', time: '09:45', impact: 'Medium', actual: '50.3', forecast: '50.9', previous: '50.7' },
    { id: 13, event: 'Building Permits m/m', currency: 'USD', date: '2024-02-16', time: '13:30', impact: 'Low', actual: '1.5M', forecast: '1.48M', previous: '1.49M' },
    { id: 14, event: 'Initial Jobless Claims', currency: 'USD', date: '2024-02-08', time: '13:30', impact: 'Medium', actual: '218K', forecast: '220K', previous: '227K' },
    { id: 15, event: 'CB Consumer Confidence', currency: 'EUR', date: '2024-02-27', time: '10:00', impact: 'Low', actual: '-15.5', forecast: '-14.5', previous: '-15.1' },
  ]

  // Filter news events based on current date and selected filters
  const getFilteredNewsEvents = () => {
    const dateStr = currentDate.toISOString().split('T')[0] // YYYY-MM-DD format
    return sampleEconomicEvents.filter(event => {
      // Filter by date (show events within 7 days of current date)
      const eventDate = new Date(event.date)
      const daysDiff = Math.abs((eventDate - currentDate) / (1000 * 60 * 60 * 24))
      const dateMatch = daysDiff <= 7

      // Filter by currency
      const currencyMatch = activeCurrency === 'USD' || event.currency === activeCurrency

      // Filter by impact
      const impactMatch = selectedImpact.length === 0 || selectedImpact.includes(event.impact)

      return dateMatch && currencyMatch && impactMatch
    })
  }

  // Update news events when filters change
  useEffect(() => {
    setNewsEvents(getFilteredNewsEvents())
  }, [currentDate, activeCurrency, selectedImpact])

  // Drag handlers for replay bar
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingReplay) return
      setReplayPosition({
        x: e.clientX - 20,
        y: e.clientY - 24
      })
    }

    const handleMouseUp = () => {
      setIsDraggingReplay(false)
    }

    if (isDraggingReplay) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDraggingReplay])

  // Helper function to show Phoenix message card
  const showPhoenixMessage = (message, type = 'info', title = 'Phoenix Backtester · System Message', subtitle = 'secure | low latency | execution core') => {
    setMessageCard({
      title,
      subtitle,
      message,
      type,
      showAction: false,
      actionText: 'View Logs',
      onAction: null
    })
    setShowMessageCard(true)
  }

  const handleExport = () => {
    const trades = JSON.parse(localStorage.getItem('phoenixTrades') || '[]')
    const dataStr = JSON.stringify(trades, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'backtest-export.json'
    link.click()
  }

  const handleExit = () => {
    navigate('/')
  }

  const handleSaveTrade = () => {
    const newTrade = {
      id: Date.now(),
      type: tradeType,
      orderType: orderType,
      entry: tradeData.entryPrice,
      takeProfit: tradeData.takeProfit,
      stopLoss: tradeData.stopLoss,
      riskPercent: tradeData.riskPercent,
      riskAmount: tradeData.riskAmount,
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'open',
      pnl: 0
    }

    const trades = JSON.parse(localStorage.getItem('phoenixTrades') || '[]')
    localStorage.setItem('phoenixTrades', JSON.stringify([...trades, newTrade]))
    setShowTradeModal(false)
  }

  const toggleImpact = (impact) => {
    setSelectedImpact(prev => 
      prev.includes(impact) 
        ? prev.filter(i => i !== impact)
        : [...prev, impact]
    )
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      background: '#131722',
      color: '#d1d4dc'
    }}>
      {/* Main Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* TradingView Chart with buttons */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: '#1e222d',
          height: '100%'
        }}>
          {/* Chart Header with buttons */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            gap: '10px',
            zIndex: 100
          }}>
            {/* Open Position Button */}
            <button
              style={{
                padding: '10px 20px',
                background: '#ff6b00',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 107, 0, 0.4)',
                transition: 'all 0.2s'
              }}
              onClick={() => setShowTradeModal(true)}
              onMouseEnter={(e) => {
                e.target.style.background = '#e55f00'
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 0, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ff6b00'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.4)'
              }}
            >
              Open Position Card
            </button>

            {/* Go To Button */}
            <div style={{ position: 'relative' }}>
              <button
                style={{
                  padding: '10px 20px',
                  background: '#2a2e39',
                  color: '#d1d4dc',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onClick={() => setShowGotoDropdown(!showGotoDropdown)}
              >
                Go To ▼
              </button>

              {/* Go To Dropdown */}
              {showGotoDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '45px',
                  right: '0',
                  background: '#1e222d',
                  border: '1px solid #2a2e39',
                  borderRadius: '4px',
                  padding: '10px 0',
                  zIndex: 101,
                  minWidth: '150px'
                }}>
                  {['London', 'New York', 'Tokyo', 'Custom Time', 'Customise'].map(item => (
                    <div
                      key={item}
                      style={{
                        padding: '10px 20px',
                        color: '#d1d4dc',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      onClick={() => {
                        console.log('Changing timezone to:', item)
                        setShowGotoDropdown(false)
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TradingView Chart */}
          <div
            id="tradingview_chart"
            ref={chartRef}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '500px'
            }}
          />

          {/* Professional Replay Bar */}
          <div
            ref={replayRef}
            style={{
              position: 'absolute',
              left: `${replayPosition.x}px`,
              top: `${replayPosition.y}px`,
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: isDraggingReplay ? 'grabbing' : 'grab',
              zIndex: 1000,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '48px'
            }}
            onMouseDown={(e) => {
              setIsDraggingReplay(true)
              setReplayPosition({ x: e.clientX - 20, y: e.clientY - 24 })
            }}
          >
            {/* Drag Handle */}
            <div style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'grab',
              color: '#888',
              fontSize: '12px'
            }}>
              ⋮⋮
            </div>

            {/* Replay Button */}
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}
              title="Reset replay"
            >
              ↺
            </button>

            {/* Skip Back */}
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}
              title="Step back"
            >
              ⏮
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsReplaying(!isReplaying)}
              style={{
                background: isReplaying ? '#ef4444' : '#22c55e',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                minWidth: '60px'
              }}
              title={isReplaying ? 'Pause' : 'Play'}
            >
              {isReplaying ? '⏸' : '▶'}
            </button>

            {/* Skip Forward */}
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}
              title="Step forward"
            >
              ⏭
            </button>

            {/* Speed Slider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '120px'
            }}>
              <input
                type="range"
                min="1"
                max="16"
                step="0.5"
                value={replaySpeed}
                onChange={(e) => setReplaySpeed(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  cursor: 'pointer'
                }}
                title={`Speed: ${replaySpeed}x`}
              />
              <span style={{
                color: '#888',
                fontSize: '10px',
                minWidth: '40px',
                textAlign: 'center'
              }}>
                {replaySpeed}x
              </span>
            </div>

            {/* Timeframe Selector */}
            <select
              style={{
                background: '#333',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                minWidth: '60px'
              }}
            >
              <option value="1">1m</option>
              <option value="5">5m</option>
              <option value="15" selected>15m</option>
              <option value="60">1h</option>
              <option value="240">4h</option>
              <option value="D">1D</option>
            </select>

            {/* Auto-play Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '11px',
                color: '#888'
              }}>
                <input
                  type="checkbox"
                  checked={isReplaying}
                  onChange={() => setIsReplaying(!isReplaying)}
                  style={{
                    width: '36px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
                Auto
              </label>
            </div>

            {/* Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginLeft: '8px',
              paddingLeft: '8px',
              borderLeft: '1px solid #333'
            }}>
              <span style={{
                color: isReplaying ? '#22c55e' : '#888',
                fontSize: '10px'
              }}>
                {isReplaying ? '● Playing' : '○ Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          background: '#131722',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #2a2e39'
        }}>
          <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#787b86', marginBottom: '4px' }}>Balance</span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#d1d4dc' }}>
                {balance.balance.toFixed(2)}$
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#787b86', marginBottom: '4px' }}>Equity</span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#26a69a' }}>
                {balance.equity.toFixed(2)}$
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#787b86', marginBottom: '4px' }}>Unrealized PnL</span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#d1d4dc' }}>
                {balance.unrealizedPnL.toFixed(2)}$
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src="/phoenix-logo.png" 
              alt="Phoenix Logo" 
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '32px', fontWeight: '700', color: '#ff6b00' }}>
              Phoenix Backtester
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                background: '#ff6b00',
                color: 'white'
              }}
              onClick={handleExport}
            >
              Export Data
            </button>
            <button
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                background: '#ff6b00',
                color: 'white'
              }}
              onClick={handleExit}
            >
              Exit Session
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{
        width: '380px',
        background: '#1e222d',
        borderLeft: '1px solid #2a2e39',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex',
          background: '#131722',
          borderBottom: '1px solid #2a2e39'
        }}>
          {['News', 'Notes'].map(tab => (
            <button
              key={tab}
              style={{
                flex: 1,
                padding: '15px',
                textAlign: 'center',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                background: sidebarTab === tab ? '#ff6b00' : 'transparent',
                color: sidebarTab === tab ? 'white' : '#787b86',
                transition: 'all 0.2s'
              }}
              onClick={() => setSidebarTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {sidebarTab === 'News' ? (
            <>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '18px', fontWeight: '700', marginBottom: '5px', display: 'block' }}>
                  Economic Calendar
                </span>
                <div style={{ fontSize: '12px', color: '#787b86', marginBottom: '10px' }}>
                  Current Date: {currentDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
                    style={{
                      padding: '6px 12px',
                      background: '#2a2e39',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#d1d4dc',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    ← Prev Week
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    style={{
                      padding: '6px 12px',
                      background: '#ff6b00',
                      border: 'none',
                      borderRadius: '4px',
                      color: 'white',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
                    style={{
                      padding: '6px 12px',
                      background: '#2a2e39',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#d1d4dc',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Next Week →
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>
                  IMPACT
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['High', 'Medium', 'Low', 'Holiday'].map(impact => (
                    <span
                      key={impact}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: selectedImpact.includes(impact) ? '#ff6b00' : 'transparent',
                        color: selectedImpact.includes(impact) ? 'white' : '#ff6b00',
                        border: selectedImpact.includes(impact) ? 'none' : '1px solid #ff6b00',
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleImpact(impact)}
                    >
                      {impact}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>
                  CURRENCIES
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {['AUD', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'JPY', 'NZD', 'USD'].map(currency => (
                    <button
                      key={currency}
                      style={{
                        padding: '8px',
                        background: activeCurrency === currency ? '#ff6b00' : '#2a2e39',
                        border: 'none',
                        borderRadius: '4px',
                        color: activeCurrency === currency ? 'white' : '#d1d4dc',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => setActiveCurrency(currency)}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>
                  EVENTS ({newsEvents.length})
                </div>
                {newsEvents.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#787b86', fontSize: '13px' }}>
                    No events for this period with current filters.
                  </div>
                ) : (
                  newsEvents.map(event => (
                    <div
                      key={event.id}
                      style={{
                        padding: '12px',
                        background: '#2a2e39',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        cursor: 'pointer',
                        borderLeft: event.impact === 'High' ? '3px solid #ff4444' : 
                                   event.impact === 'Medium' ? '3px solid #ffaa00' : 
                                   event.impact === 'Low' ? '3px solid #44ff44' : '3px solid #888'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#d1d4dc' }}>
                          {event.event}
                        </span>
                        <span style={{ 
                          fontSize: '10px', 
                          fontWeight: '600', 
                          padding: '2px 6px', 
                          borderRadius: '3px',
                          background: event.impact === 'High' ? 'rgba(255, 68, 68, 0.2)' : 
                                     event.impact === 'Medium' ? 'rgba(255, 170, 0, 0.2)' : 
                                     event.impact === 'Low' ? 'rgba(68, 255, 68, 0.2)' : 'rgba(136, 136, 136, 0.2)',
                          color: event.impact === 'High' ? '#ff4444' : 
                                 event.impact === 'Medium' ? '#ffaa00' : 
                                 event.impact === 'Low' ? '#44ff44' : '#888'
                        }}>
                          {event.impact}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#787b86', marginBottom: '4px' }}>
                        {event.currency} · {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} · {event.time}
                      </div>
                      <div style={{ fontSize: '11px', color: '#d1d4dc' }}>
                        <span style={{ color: '#787b86' }}>Actual:</span> {event.actual} · 
                        <span style={{ color: '#787b86' }}>Forecast:</span> {event.forecast} · 
                        <span style={{ color: '#787b86' }}>Previous:</span> {event.previous}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '18px', fontWeight: '700', marginBottom: '5px', display: 'block' }}>
                    Backtester Notes
                  </span>
                  <div style={{ fontSize: '12px', color: '#787b86' }}>
                    Add your notes here
                  </div>
                </div>
                <button
                  onClick={() => {
                    const journalEntries = JSON.parse(localStorage.getItem('phoenixTrades') || '[]');
                    const backtesterNote = {
                      id: 'backtester-note-' + Date.now(),
                      type: 'note',
                      content: notes,
                      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                      status: 'note'
                    };
                    journalEntries.push(backtesterNote);
                    localStorage.setItem('phoenixTrades', JSON.stringify(journalEntries));
                    showPhoenixMessage(`📓 Notes saved to journal! "${notes.substring(0, 60)}${notes.length > 60 ? '…' : ''}"`, 'success');
                  }}
                  style={{
                    padding: '8px 16px',
                    background: '#ff6b00',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e55f00';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ff6b00';
                  }}
                >
                  Save to Journal
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your notes here..."
                style={{
                  flex: 1,
                  minHeight: '300px',
                  padding: '15px',
                  background: '#2a2e39',
                  border: '1px solid #363a45',
                  borderRadius: '8px',
                  color: '#d1d4dc',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'none'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Phoenix Message Card */}
      {showMessageCard && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: '#0f1625',
            borderRadius: '24px',
            border: '1px solid rgba(245, 160, 35, 0.3)',
            boxShadow: '0 12px 28px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(245, 166, 35, 0.1) inset',
            backdropFilter: 'blur(2px)',
            transition: 'all 0.2s ease',
            overflow: 'hidden',
            minWidth: '320px',
            maxWidth: '420px'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #0f1727, #0b1120)',
              padding: '14px 18px',
              borderBottom: '1px solid #2a3a48',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                background: '#f5a62320',
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#f5b042',
                border: '1px solid #f5a62340'
              }}>
                🐦‍🔥
              </div>
              <div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#eef4ff',
                  letterSpacing: '-0.2px'
                }}>
                  {messageCard.title}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#8aa0bc'
                }}>
                  {messageCard.subtitle}
                </div>
              </div>
            </div>
            <div style={{
              padding: '18px',
              background: '#0a101c'
            }}>
              <div style={{
                background: '#080e18',
                padding: '16px',
                borderRadius: '18px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: '#ccdeee',
                borderLeft: `3px solid ${messageCard.type === 'success' ? '#7ae9b3' : messageCard.type === 'warning' ? '#f5a623' : '#f5b042'}`,
                wordBreak: 'break-word',
                lineHeight: '1.4'
              }}>
                {messageCard.message}
              </div>
            </div>
            <div style={{
              padding: '12px 18px 16px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              background: '#0b111e',
              borderTop: '1px solid #1f2c38'
            }}>
              <button
                onClick={() => setShowMessageCard(false)}
                style={{
                  background: '#1e2a3a',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '40px',
                  fontWeight: '500',
                  fontSize: '0.75rem',
                  color: '#dce6f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  border: '0.5px solid #31485e'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#2a3b4e';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#1e2a3a';
                }}
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setShowMessageCard(false);
                  if (messageCard.onAction) messageCard.onAction();
                }}
                style={{
                  background: '#f5a623',
                  color: '#0a0f18',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '40px',
                  fontWeight: '500',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  boxShadow: '0 2px 6px rgba(245,166,35,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e0920f';
                  e.target.style.transform = 'scale(0.97)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f5a623';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {messageCard.actionText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trade Modal */}
      {showTradeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={(e) => {
          if (e.target === e.currentTarget) setShowTradeModal(false)
        }}>
          <div style={{
            background: '#1e222d',
            borderRadius: '8px',
            width: '600px',
            maxWidth: '90%',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#ff6b00',
              padding: '20px',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '20px', fontWeight: '600' }}>Place a Trade:</span>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8
                }}
                onClick={() => setShowTradeModal(false)}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '25px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                {['Buy', 'Sell', 'Limit', 'Market', 'Stop'].map(type => (
                  <button
                    key={type}
                    style={{
                      padding: '8px 20px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: (type === 'Buy' || type === 'Sell') 
                        ? (tradeType === type ? '#ff6b00' : '#2a2e39')
                        : (orderType === type ? '#ff6b00' : '#2a2e39'),
                      color: (type === 'Buy' || type === 'Sell')
                        ? (tradeType === type ? 'white' : '#787b86')
                        : (orderType === type ? 'white' : '#787b86')
                    }}
                    onClick={() => {
                      if (type === 'Buy' || type === 'Sell') {
                        setTradeType(type)
                      } else {
                        setOrderType(type)
                      }
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#d1d4dc' }}>
                  Entry Price
                </label>
                <input
                  type="text"
                  value={tradeData.entryPrice}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#2a2e39',
                    border: '1px solid #363a45',
                    borderRadius: '4px',
                    color: '#d1d4dc',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#d1d4dc' }}>
                    Take Profit
                  </label>
                  <input
                    type="number"
                    value={tradeData.takeProfit}
                    onChange={(e) => setTradeData({...tradeData, takeProfit: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2a2e39',
                      border: '1px solid #363a45',
                      borderRadius: '4px',
                      color: '#d1d4dc',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#d1d4dc' }}>
                    Stop Loss
                  </label>
                  <input
                    type="number"
                    value={tradeData.stopLoss}
                    onChange={(e) => setTradeData({...tradeData, stopLoss: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2a2e39',
                      border: '1px solid #363a45',
                      borderRadius: '4px',
                      color: '#d1d4dc',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                {['Initial Balance', 'Current Balance'].map(tab => (
                  <button
                    key={tab}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: balanceTab === tab ? '#ff6b00' : '#2a2e39',
                      color: balanceTab === tab ? 'white' : '#787b86'
                    }}
                    onClick={() => setBalanceTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#d1d4dc' }}>
                    Risk Percent (%)
                  </label>
                  <input
                    type="number"
                    value={tradeData.riskPercent}
                    onChange={(e) => setTradeData({...tradeData, riskPercent: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2a2e39',
                      border: '1px solid #363a45',
                      borderRadius: '4px',
                      color: '#d1d4dc',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#d1d4dc' }}>
                    Risk Amount ($)
                  </label>
                  <input
                    type="text"
                    value={tradeData.riskAmount}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2a2e39',
                      border: '1px solid #363a45',
                      borderRadius: '4px',
                      color: '#d1d4dc',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#d1d4dc' }}>
                  Partials
                </label>
                <button style={{
                  padding: '10px',
                  background: '#2a2e39',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#787b86',
                  fontSize: '13px',
                  cursor: 'pointer',
                  width: '100%'
                }}>
                  Add Partial
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                <button
                  style={{
                    padding: '10px 24px',
                    background: '#2a2e39',
                    color: '#d1d4dc',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowTradeModal(false)}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: '10px 24px',
                    background: '#26a69a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onClick={handleSaveTrade}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhoenixBacktesterNew
