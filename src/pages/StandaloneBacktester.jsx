import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const StandaloneBacktester = () => {
  const navigate = useNavigate()
  
  // State management
  const totalBars = 26305
  const [currentIndex, setCurrentIndex] = useState(12)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [panelWidth, setPanelWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [controlsPosition, setControlsPosition] = useState({ x: 16, y: 50 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState('notes')
  const [notes, setNotes] = useState('H4 trend intact, waiting for pullback.\nKey level 1.1050')
  
  // Refs
  const canvasRef = useRef(null)
  const panelRef = useRef(null)
  const controlsRef = useRef(null)
  const playIntervalRef = useRef(null)
  
  // Price data simulation
  const [prices, setPrices] = useState([])
  const [currentPrice, setCurrentPrice] = useState(1.10170)
  
  // Generate price data
  useEffect(() => {
    const generatedPrices = []
    let basePrice = 1.10170
    for (let i = 0; i < totalBars; i++) {
      basePrice = basePrice + (Math.random() - 0.5) * 0.0015
      generatedPrices.push(basePrice)
    }
    setPrices(generatedPrices)
  }, [])
  
  // Get price at index
  const getPrice = useCallback((idx) => {
    if (prices.length === 0) return 1.10170
    return prices[Math.min(idx, totalBars - 1)]
  }, [prices])
  
  // Update current price when index changes
  useEffect(() => {
    setCurrentPrice(getPrice(currentIndex))
  }, [currentIndex, getPrice])
  
  // Canvas drawing
  const drawChart = useCallback(() => {
    if (!canvasRef.current || prices.length === 0) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.clientWidth || 800
    const h = canvas.height = 400
    
    ctx.clearRect(0, 0, w, h)
    
    // Draw grid
    ctx.strokeStyle = '#2a2a2a'
    ctx.lineWidth = 0.5
    for (let i = 0; i < w; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, h)
      ctx.strokeStyle = '#1e1e1e'
      ctx.stroke()
    }
    for (let i = 0; i < h; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(w, i)
      ctx.stroke()
    }
    
    // Draw price line (last 200 bars)
    const start = Math.max(0, currentIndex - 200)
    const end = currentIndex
    const len = end - start
    if (len < 2) return
    
    const stepX = w / len
    const priceSlice = prices.slice(start, end + 1)
    const priceRange = [Math.min(...priceSlice), Math.max(...priceSlice)]
    const padding = (priceRange[1] - priceRange[0]) * 0.1 || 0.001
    const minP = priceRange[0] - padding
    const maxP = priceRange[1] + padding
    
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#ff8c3a'
    for (let i = 0; i <= len; i++) {
      const idx = start + i
      const x = i * stepX
      const y = h - ((prices[idx] - minP) / (maxP - minP)) * h
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    
    // Mark current price
    const curY = h - ((prices[currentIndex] - minP) / (maxP - minP)) * h
    ctx.beginPath()
    ctx.arc(w - 10, curY, 4, 0, 2 * Math.PI)
    ctx.fillStyle = '#ff6b00'
    ctx.shadowColor = '#ff6b00'
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.shadowBlur = 0
  }, [prices, currentIndex])
  
  // Update chart when data changes
  useEffect(() => {
    drawChart()
  }, [drawChart])
  
  // Playback control
  const stopPlayback = useCallback(() => {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current)
      playIntervalRef.current = null
    }
    setIsPlaying(false)
  }, [])
  
  const startPlayback = useCallback(() => {
    if (isPlaying) return
    setIsPlaying(true)
    const intervalMs = 200 / speed
    playIntervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= totalBars - 1) {
          stopPlayback()
          return prev
        }
        return prev + 1
      })
    }, intervalMs)
  }, [isPlaying, speed, stopPlayback])
  
  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      startPlayback()
    } else {
      stopPlayback()
    }
    return () => stopPlayback()
  }, [isPlaying, startPlayback, stopPlayback])
  
  // Resize handlers
  const handleResizeStart = useCallback((e) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])
  
  const handleResizeMove = useCallback((e) => {
    if (!isResizing || !panelRef.current) return
    const newWidth = panelRef.current.offsetWidth - (e.clientX - e.clientX)
    if (newWidth > 200 && newWidth < 600) {
      setPanelWidth(newWidth)
    }
  }, [isResizing])
  
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
  }, [])
  
  // Global mouse events for resizing
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove)
      window.addEventListener('mouseup', handleResizeEnd)
      return () => {
        window.removeEventListener('mousemove', handleResizeMove)
        window.removeEventListener('mouseup', handleResizeEnd)
      }
    }
  }, [isResizing, handleResizeMove, handleResizeEnd])
  
  // Drag handlers for controls
  const handleDragStart = useCallback((e) => {
    setIsDragging(true)
    const rect = controlsRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
    e.preventDefault()
  }, [])
  
  const handleDragMove = useCallback((e) => {
    if (!isDragging || !controlsRef.current) return
    const chartArea = document.getElementById('chartArea')
    if (!chartArea) return
    
    const areaRect = chartArea.getBoundingClientRect()
    let newX = e.clientX - areaRect.left - dragOffset.x
    let newY = e.clientY - areaRect.top - dragOffset.y
    
    // Boundary constraints
    newX = Math.max(0, Math.min(newX, areaRect.width - 380))
    newY = Math.max(0, Math.min(newY, areaRect.height - 200))
    
    setControlsPosition({ x: newX, y: newY })
  }, [isDragging, dragOffset])
  
  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])
  
  // Global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
      return () => {
        window.removeEventListener('mousemove', handleDragMove)
        window.removeEventListener('mouseup', handleDragEnd)
      }
    }
  }, [isDragging, handleDragMove, handleDragEnd])
  
  // Calculate date for current index
  const getCurrentDate = useCallback(() => {
    const baseDate = new Date(2023, 3, 10) // April 10 2023
    const date = new Date(baseDate.getTime() + currentIndex * 3600 * 1000)
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
  }, [currentIndex])
  
  const progressPercent = Math.round((currentIndex / totalBars) * 100)
  
  return (
    <div className="app" style={{ height: '100vh', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* LEFT SIDEBAR */}
      <div className="sidebar" style={{
        width: '220px',
        minWidth: '220px',
        background: '#0d0d0d',
        borderRight: '1px solid #1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        padding: '0'
      }}>
        <div className="logo" style={{
          padding: '20px 20px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: '1px solid #1e1e1e'
        }}>
          <div className="logo-icon" style={{
            width: '34px',
            height: '34px',
            background: 'linear-gradient(135deg, #ff6b00, #ff9500)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>{'\ud83d\udd25'}</div>
          <div>
            <div className="logo-text" style={{
              fontSize: '16px',
              fontWeight: '700',
              letterSpacing: '-0.3px'
            }}>Phoenix</div>
            <div className="logo-sub" style={{
              fontSize: '10px',
              color: '#555',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginTop: '1px'
            }}>Backtester</div>
          </div>
        </div>
        <div className="nav" style={{ padding: '12px 10px', flex: 1 }}>
          <div className="nav-section" style={{
            fontSize: '10px',
            color: '#444',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            padding: '8px 10px 6px'
          }}>Main</div>
          <div className="nav-item" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 10px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#666',
            fontSize: '13px',
            transition: 'all 0.15s',
            marginBottom: '2px'
          }} onClick={() => navigate('/dashboard')}>
            {'\ud83d\udcca'} Dashboard
          </div>
          <div className="nav-item active" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 10px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#ff6b00',
            fontSize: '13px',
            transition: 'all 0.15s',
            marginBottom: '2px',
            background: 'rgba(255,107,0,0.12)'
          }}>
            {'\ud83d\udcc8'} Backtest
            <div className="dot" style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: '#ff6b00',
              marginLeft: 'auto'
            }}></div>
          </div>
        </div>
        <div className="sidebar-bottom" style={{
          padding: '16px 10px',
          borderTop: '1px solid #1e1e1e'
        }}>
          <div className="account-badge" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px',
            background: '#141414',
            borderRadius: '10px',
            border: '1px solid #1e1e1e'
          }}>
            <div className="acct-avatar" style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ff6b00, #ff9500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '700'
            }}>P</div>
            <div className="acct-info" style={{ flex: 1, minWidth: 0 }}>
              <div className="acct-name" style={{ fontSize: '12px', fontWeight: '600' }}>Trader Pro</div>
              <div className="acct-status" style={{
                fontSize: '10px',
                color: '#ff6b00',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span className="pulse" style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  animation: 'pulse 2s infinite'
                }}></span> Phoenix Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="topbar" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid #1a1a1a',
          background: '#0a0a0a'
        }}>
          <div>
            <div className="page-title" style={{
              fontSize: '20px',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}>Backtest Session</div>
            <div className="page-sub" style={{
              fontSize: '12px',
              color: '#555',
              marginTop: '1px'
            }}>Historical Replay · EURUSD 1H</div>
          </div>
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="streak-badge" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,107,0,0.1)',
              border: '1px solid rgba(255,107,0,0.25)',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '12px',
              color: '#ff8c3a',
              fontWeight: '600'
            }}>
              {'\ud83d\udcca'} Live Replay
            </div>
            <button className="btn-outline" style={{
              padding: '7px 14px',
              borderRadius: '8px',
              border: '1px solid #2a2a2a',
              background: '#141414',
              color: '#888',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}>Export</button>
            <button className="btn-primary" style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #ff6b00, #ff8c00)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }} onClick={() => navigate('/dashboard')}>Exit</button>
          </div>
        </div>

        <div className="content" style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          background: '#141414'
        }}>
          {/* Banner */}
          <div className="challenge-banner" style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: '14px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div className="challenge-banner::before" style={{
              content: '',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #ff6b00, #ff9500, transparent)'
            }}></div>
            <div>
              <div className="challenge-label" style={{
                fontSize: '10px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#ff8c3a',
                fontWeight: '600',
                marginBottom: '3px'
              }}>Replay Session</div>
              <div className="challenge-title" style={{
                fontSize: '16px',
                fontWeight: '700'
              }}>EUR/USD · 3Y 1H data</div>
            </div>
            <div className="progress-wrap" style={{
              flex: 1,
              maxWidth: '200px'
            }}>
              <div className="progress-label" style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '10px',
                color: '#666',
                marginBottom: '6px'
              }}>
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="progress-bar" style={{
                height: '6px',
                background: '#1e1e1e',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div className="progress-fill" style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #ff6b00, #ff9500)',
                  borderRadius: '3px',
                  width: `${progressPercent}%`,
                  transition: 'width 0.2s'
                }}></div>
              </div>
            </div>
            <div className="challenge-right" style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div className="chal-stat" style={{ textAlign: 'right' }}>
                <div className="chal-stat-val" style={{ fontSize: '18px', fontWeight: '700' }}>3Y</div>
                <div className="chal-stat-label" style={{ fontSize: '10px', color: '#555', marginTop: '1px' }}>Range</div>
              </div>
              <div className="chal-stat" style={{ textAlign: 'right' }}>
                <div className="chal-stat-val" style={{ fontSize: '18px', fontWeight: '700' }}>1H</div>
                <div className="chal-stat-label" style={{ fontSize: '10px', color: '#555', marginTop: '1px' }}>TF</div>
              </div>
              <div className="chal-stat" style={{ textAlign: 'right' }}>
                <div className="chal-stat-val" style={{ fontSize: '18px', fontWeight: '700' }}>0</div>
                <div className="chal-stat-label" style={{ fontSize: '10px', color: '#555', marginTop: '1px' }}>Trades</div>
              </div>
            </div>
          </div>

          {/* CHART + RESIZABLE RIGHT PANEL */}
          <div className="chart-section" style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '20px',
            height: '520px'
          }}>
            <div className="chart-card" style={{
              flex: 1,
              background: '#111',
              border: '1px solid #1a1a1a',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600' }}>{'\ud83d\udcc9'} EURUSD · 1H</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    background: '#ff6b00',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>1H</span>
                  <span style={{ color: '#666' }}>4H</span>
                  <span style={{ color: '#666' }}>1D</span>
                </div>
              </div>
              
              {/* chart area with floating controls and price */}
              <div className="replay-wrapper" style={{
                flex: 1,
                position: 'relative',
                background: '#0a0a0a',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex'
              }}>
                <div className="chart-area" id="chartArea" style={{
                  flex: 1,
                  position: 'relative',
                  minWidth: 0
                }}>
                  {/* Canvas chart */}
                  <div className="chart-placeholder" style={{
                    width: '100%',
                    height: '100%',
                    background: '#0c0c0c',
                    position: 'relative'
                  }}>
                    <canvas
                      ref={canvasRef}
                      id="priceChart"
                      width={800}
                      height={400}
                      style={{ display: 'block', width: '100%', height: '100%', background: '#0c0c0c' }}
                    />
                    <div className="tv-logo" style={{
                      position: 'absolute',
                      left: '10px',
                      bottom: '10px',
                      opacity: '0.5',
                      fontSize: '11px'
                    }}>{'\ud83d\udcca'} TradingView style</div>
                  </div>
                  
                  {/* Price overlay */}
                  <div className="price-header" style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(20,20,20,0.9)',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    zIndex: 30
                  }}>
                    <div className="symbol" style={{ color: '#ff8c3a', fontWeight: '600' }}>EURUSD</div>
                    <div className="current-price" style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      fontFamily: 'monospace'
                    }}>{currentPrice.toFixed(5)}</div>
                  </div>

                  {/* DRAGGABLE REPLAY CONTROLS */}
                  <div
                    ref={controlsRef}
                    className="replay-float"
                    style={{
                      position: 'absolute',
                      left: `${controlsPosition.x}px`,
                      top: `${controlsPosition.y}px`,
                      background: 'rgba(20,20,20,0.95)',
                      border: '1px solid #ff6b00',
                      borderRadius: '10px',
                      padding: '14px 16px',
                      zIndex: 50,
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      minWidth: '380px'
                    }}
                    onMouseDown={handleDragStart}
                  >
                    <div className="drag-handle" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '10px',
                      color: '#ff8c3a',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}>
                      <span>{'\ud83c\udfae'}</span> Replay Controls (drag to move)
                    </div>
                    <div className="replay-buttons" style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '12px'
                    }}>
                      <button
                        className="replay-btn"
                        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                        style={{
                          background: '#2a2a2a',
                          border: 'none',
                          color: '#ccc',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >&lt;&lt;</button>
                      <button
                        className="replay-btn play"
                        onClick={() => setIsPlaying(!isPlaying)}
                        style={{
                          background: isPlaying ? '#ef4444' : '#22c55e',
                          border: 'none',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >{isPlaying ? '\u23f8 Pause' : '\u25b6 Play'}</button>
                      <button
                        className="replay-btn"
                        onClick={() => setCurrentIndex(Math.min(totalBars - 1, currentIndex + 1))}
                        style={{
                          background: '#2a2a2a',
                          border: 'none',
                          color: '#ccc',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >&gt;&gt;</button>
                      <button
                        className="replay-btn reset"
                        onClick={() => { setCurrentIndex(0); setIsPlaying(false) }}
                        style={{
                          background: '#6b7280',
                          border: 'none',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >Reset</button>
                    </div>
                    <div className="slider-row" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <input
                        type="range"
                        min="0"
                        max={totalBars - 1}
                        value={currentIndex}
                        onChange={(e) => { setCurrentIndex(parseInt(e.target.value)); setIsPlaying(false) }}
                        style={{ flex: 1, accentColor: '#ff6b00' }}
                      />
                      <span className="slider-info" style={{
                        color: '#aaa',
                        fontSize: '12px',
                        minWidth: '100px'
                      }}>{currentIndex} / {totalBars}</span>
                    </div>
                    <div className="date-speed" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      color: '#aaa',
                      fontSize: '12px'
                    }}>
                      <span>{getCurrentDate()}</span>
                      <select
                        value={speed}
                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                        style={{
                          background: '#333',
                          color: '#fff',
                          border: '1px solid #555',
                          borderRadius: '4px',
                          padding: '2px 6px'
                        }}
                      >
                        <option value="1">1x</option>
                        <option value="2">2x</option>
                        <option value="5">5x</option>
                        <option value="10">10x</option>
                      </select>
                    </div>
                    <div className="pnl-info" style={{
                      marginTop: '12px',
                      paddingTop: '8px',
                      borderTop: '1px solid #333',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '13px'
                    }}>
                      <span>Total P&amp;L:</span>
                      <span style={{ color: '#22c55e' }}>$0.00</span>
                    </div>
                    <div className="pnl-info" style={{
                      borderTop: 'none',
                      marginTop: '0',
                      paddingTop: '0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '13px'
                    }}>
                      <span>Unrealized:</span>
                      <span style={{ color: '#22c55e' }}>$0.00</span>
                    </div>
                  </div>
                </div>

                {/* RESIZABLE RIGHT PANEL */}
                <div
                  ref={panelRef}
                  className="right-panel"
                  style={{
                    width: `${panelWidth}px`,
                    background: '#0f0f0f',
                    borderLeft: '1px solid #2a2a2a',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                >
                  <div
                    className="resizer"
                    onMouseDown={handleResizeStart}
                    style={{
                      width: '8px',
                      background: 'transparent',
                      cursor: 'ew-resize',
                      position: 'absolute',
                      left: '-4px',
                      top: 0,
                      bottom: 0,
                      zIndex: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{
                      color: '#ff6b00',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      opacity: '0.8'
                    }}>{'\u22ee\u22ee'}</span>
                  </div>
                  <div className="panel-tabs" style={{
                    display: 'flex',
                    padding: '12px 12px 0',
                    borderBottom: '1px solid #1e1e1e'
                  }}>
                    <div
                      className={`panel-tab ${activeTab === 'notes' ? 'active' : ''}`}
                      onClick={() => setActiveTab('notes')}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: activeTab === 'notes' ? '#ff6b00' : '#666',
                        cursor: 'pointer',
                        borderRadius: '6px 6px 0 0',
                        background: activeTab === 'notes' ? 'rgba(255,107,0,0.15)' : 'transparent'
                      }}
                    >{'\ud83d\udcdd'} Notes</div>
                    <div
                      className={`panel-tab ${activeTab === 'news' ? 'active' : ''}`}
                      onClick={() => setActiveTab('news')}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: activeTab === 'news' ? '#ff6b00' : '#666',
                        cursor: 'pointer',
                        borderRadius: '6px 6px 0 0',
                        background: activeTab === 'news' ? 'rgba(255,107,0,0.15)' : 'transparent'
                      }}
                    >{'\ud83d\udcf0'} News</div>
                  </div>
                  <div className="panel-content" style={{
                    flex: 1,
                    padding: '16px',
                    overflowY: 'auto'
                  }}>
                    {activeTab === 'notes' ? (
                      <div>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Write your trading notes, observations..."
                          style={{
                            width: '100%',
                            height: '180px',
                            background: '#1a1a1a',
                            border: '1px solid #2e2e2e',
                            borderRadius: '8px',
                            padding: '12px',
                            color: '#fff',
                            fontSize: '12px',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                          }}
                        />
                        <div style={{
                          marginTop: '16px',
                          color: '#aaa',
                          fontSize: '12px'
                        }}>
                          <div>{'\ud83d\udcc5'} {getCurrentDate()} 14:30</div>
                          <div>{'\ud83d\udcb0'} Balance: $10,000</div>
                          <div>{'\ud83d\udcc9'} Open: 0</div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="news-item" style={{
                          padding: '12px',
                          background: '#141414',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          borderLeft: '3px solid #ff6b00'
                        }}>
                          <div className="news-time" style={{ fontSize: '10px', color: '#888' }}>10:30 GMT</div>
                          <div className="news-title" style={{ fontWeight: '600', margin: '4px 0' }}>{'\ud83c\uddea\ud83c\uddfa'} ECB Lagarde speech</div>
                          <div style={{ color: '#aaa', fontSize: '11px' }}>Hawkish tone expected</div>
                        </div>
                        <div className="news-item" style={{
                          padding: '12px',
                          background: '#141414',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          borderLeft: '3px solid #ff6b00'
                        }}>
                          <div className="news-time" style={{ fontSize: '10px', color: '#888' }}>13:45 GMT</div>
                          <div className="news-title" style={{ fontWeight: '600', margin: '4px 0' }}>{'\ud83c\uddfa\ud83c\uddf8'} US CPI m/m</div>
                          <div style={{ color: '#aaa', fontSize: '11px' }}>Forecast 0.2%</div>
                        </div>
                        <div className="news-item" style={{
                          padding: '12px',
                          background: '#141414',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          borderLeft: '3px solid #ff6b00'
                        }}>
                          <div className="news-time" style={{ fontSize: '10px', color: '#888' }}>Yesterday</div>
                          <div className="news-title" style={{ fontWeight: '600', margin: '4px 0' }}>EURUSD breaks 1.10</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM STATS */}
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginTop: '16px'
          }}>
            <div className="stat-card" style={{
              background: '#111',
              border: '1px solid #1a1a1a',
              borderRadius: '14px',
              padding: '16px',
              borderLeft: '3px solid #22c55e'
            }}>
              <div className="stat-icon" style={{ fontSize: '20px', marginBottom: '8px' }}>{'\u25b6\ufe0f'}</div>
              <div className="stat-label" style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase' }}>Playback</div>
              <div className="stat-value" style={{ fontSize: '22px', fontWeight: '700' }}>
                {isPlaying ? 'Playing' : 'Ready'}
              </div>
            </div>
            <div className="stat-card" style={{
              background: '#111',
              border: '1px solid #1a1a1a',
              borderRadius: '14px',
              padding: '16px',
              borderLeft: '3px solid #22c55e'
            }}>
              <div className="stat-icon" style={{ fontSize: '20px', marginBottom: '8px' }}>{'\ud83d\udcca'}</div>
              <div className="stat-label" style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase' }}>Data points</div>
              <div className="stat-value" style={{ fontSize: '22px', fontWeight: '700' }}>26,305</div>
            </div>
            <div className="stat-card" style={{
              background: '#111',
              border: '1px solid #1a1a1a',
              borderRadius: '14px',
              padding: '16px',
              borderLeft: '3px solid #22c55e'
            }}>
              <div className="stat-icon" style={{ fontSize: '20px', marginBottom: '8px' }}>{'\u26a1'}</div>
              <div className="stat-label" style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase' }}>Speed</div>
              <div className="stat-value" style={{ fontSize: '22px', fontWeight: '700' }}>{speed}x</div>
            </div>
            <div className="stat-card" style={{
              background: '#111',
              border: '1px solid #1a1a1a',
              borderRadius: '14px',
              padding: '16px',
              borderLeft: '3px solid #22c55e'
            }}>
              <div className="stat-icon" style={{ fontSize: '20px', marginBottom: '8px' }}>{'\ud83c\udfaf'}</div>
              <div className="stat-label" style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase' }}>Mode</div>
              <div className="stat-value" style={{ fontSize: '22px', fontWeight: '700' }}>Sim</div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="bottom-bar" style={{
          height: '70px',
          background: '#0d0d0d',
          borderTop: '2px solid #ff6b00',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          marginTop: 'auto'
        }}>
          <div className="balance-group" style={{ display: 'flex', gap: '32px' }}>
            <div className="bal-item" style={{ textAlign: 'center' }}>
              <div className="bal-label" style={{
                fontSize: '11px',
                color: '#888',
                textTransform: 'uppercase'
              }}>Balance</div>
              <div className="bal-value" style={{
                fontSize: '20px',
                fontWeight: '700',
                fontFamily: 'monospace'
              }}>$10,000.00</div>
            </div>
            <div className="bal-item" style={{ textAlign: 'center' }}>
              <div className="bal-label" style={{
                fontSize: '11px',
                color: '#888',
                textTransform: 'uppercase'
              }}>Equity</div>
              <div className="bal-value positive" style={{
                fontSize: '20px',
                fontWeight: '700',
                fontFamily: 'monospace',
                color: '#22c55e'
              }}>$10,000.00</div>
            </div>
            <div className="bal-item" style={{ textAlign: 'center' }}>
              <div className="bal-label" style={{
                fontSize: '11px',
                color: '#888',
                textTransform: 'uppercase'
              }}>Unrealized P&amp;L</div>
              <div className="bal-value positive" style={{
                fontSize: '20px',
                fontWeight: '700',
                fontFamily: 'monospace',
                color: '#22c55e'
              }}>$0.00</div>
            </div>
          </div>
          <div className="badge-group" style={{ display: 'flex', gap: '16px' }}>
            <div className="phoenix-badge" style={{
              padding: '6px 16px',
              background: 'rgba(255,107,0,0.15)',
              border: '1px solid #ff6b00',
              borderRadius: '30px',
              color: '#ff8c3a',
              fontWeight: '600',
              fontSize: '13px'
            }}>{'\ud83d\udd25'} Phoenix Challenge</div>
            <div style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid #22c55e',
              borderRadius: '30px',
              padding: '6px 20px',
              color: '#22c55e'
            }}>{'\u2705'} Active</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StandaloneBacktester
