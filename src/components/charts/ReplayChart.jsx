import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createChart, CandlestickSeries } from 'lightweight-charts'
import historicalDataService from '../../services/historicalDataService'

const ReplayChart = ({ pair = 'EURUSD', timeframe = '1h', years = 3 }) => {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef(null)

  const [historicalData, setHistoricalData] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [trades, setTrades] = useState([])
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [totalPnL, setTotalPnL] = useState(0)
  const [unrealizedPnL, setUnrealizedPnL] = useState(0)
  const [controlsPosition, setControlsPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [sidebarWidth, setSidebarWidth] = useState(300)
  const [isResizing, setIsResizing] = useState(false)
  const [activeTab, setActiveTab] = useState('notes')
  const [notes, setNotes] = useState('')
  const controlsRef = useRef(null)
  const sidebarRef = useRef(null)

  // Load data
  useEffect(() => {
    const data = historicalDataService.getDataForDateRange(pair, years, timeframe)
    setHistoricalData(data || [])
    setCurrentIndex(0)
    if (data?.length > 0) {
      setCurrentPrice(data[0].close)
    }
  }, [pair, timeframe, years])

  // Create chart ONCE
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#0a0a0a' },
        textColor: '#888',
      },
      grid: {
        vertLines: { color: '#1a1a1a' },
        horzLines: { color: '#1a1a1a' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#ff6b00' },
        horzLine: { color: '#ff6b00' },
      },
      timeScale: {
        borderColor: '#2a2a2a',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#2a2a2a',
      },
    })

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    })

    chartRef.current = chart
    seriesRef.current = series

    return () => chart.remove()
  }, [])

  // Update chart data
  useEffect(() => {
    if (!seriesRef.current || historicalData.length === 0) return

    const visibleData = historicalData.slice(0, currentIndex + 1)
    seriesRef.current.setData(visibleData)
  }, [historicalData, currentIndex])

  // Update markers (trades) - Note: Markers API changed in v5, temporarily disabled
  useEffect(() => {
    if (!seriesRef.current) return

    // Markers API has changed in lightweight-charts v5
    // For now, we'll skip markers to avoid errors
    // TODO: Implement new markers API when available
    console.log('Trade markers:', trades)
  }, [trades])

  // Playback logic
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= historicalData.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return Math.min(prev + playbackSpeed, historicalData.length - 1)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, historicalData.length])

  // Update current price and calculate real-time PnL
  useEffect(() => {
    if (historicalData[currentIndex]) {
      const price = historicalData[currentIndex].close
      setCurrentPrice(price)
      
      // Calculate real-time PnL for all open trades
      updateRealTimePnL(price)
    }
  }, [currentIndex, historicalData])

  // Real-time PnL calculation function
  const updateRealTimePnL = useCallback((price) => {
    let totalUnrealized = 0
    let totalClosed = 0
    
    const updatedTrades = trades.map(trade => {
      if (trade.status === 'open') {
        const pnl = trade.type === 'buy' 
          ? (price - trade.entryPrice) * trade.size
          : (trade.entryPrice - price) * trade.size
        
        totalUnrealized += pnl
        
        // Check SL/TP
        let shouldClose = false
        let closeReason = ''
        
        if (trade.stopLoss && price <= trade.stopLoss) {
          shouldClose = true
          closeReason = 'Stop Loss'
        } else if (trade.takeProfit && price >= trade.takeProfit) {
          shouldClose = true
          closeReason = 'Take Profit'
        }
        
        if (shouldClose) {
          totalClosed += pnl
          return {
            ...trade,
            status: 'closed',
            exitPrice: price,
            exitTime: historicalData[currentIndex]?.time,
            pnl,
            closeReason
          }
        }
        
        return { ...trade, currentPnL: pnl }
      } else {
        totalClosed += trade.pnl || 0
        return trade
      }
    })
    
    setTrades(updatedTrades)
    setUnrealizedPnL(totalUnrealized)
    setTotalPnL(totalClosed + totalUnrealized)
  }, [trades, currentIndex, historicalData])

  // Resize handling
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Controls
  const handlePlayPause = () => setIsPlaying(prev => !prev)

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentIndex(0)
  }

  const handleStepForward = () => {
    setCurrentIndex(prev => Math.min(prev + 1, historicalData.length - 1))
  }

  const handleStepBackward = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  const handleSeek = (value) => {
    setCurrentIndex(value)
    setIsPlaying(false)
  }

  const executeTrade = (type, size, stopLoss, takeProfit) => {
    const currentData = historicalData[currentIndex]
    if (!currentData) return

    const newTrade = {
      id: Date.now(),
      type,
      size,
      entryPrice: currentPrice,
      entryTime: currentData.time,
      stopLoss,
      takeProfit,
      status: 'open',
      pnl: 0,
      currentPnL: 0,
    }

    setTrades(prev => [...prev, newTrade])
    setShowTradeModal(false)
    
    // Recalculate PnL immediately after trade
    updateRealTimePnL(currentPrice)
  }

  const closeTrade = (tradeId) => {
    const currentData = historicalData[currentIndex]
    if (!currentData) return

    setTrades(prev =>
      prev.map(trade => {
        if (trade.id === tradeId) {
          const pnl =
            trade.type === 'buy'
              ? (currentPrice - trade.entryPrice) * trade.size
              : (trade.entryPrice - currentPrice) * trade.size

          return {
            ...trade,
            status: 'closed',
            exitPrice: currentPrice,
            exitTime: currentData.time,
            pnl,
          }
        }
        return trade
      })
    )
  }

  const progress =
    historicalData.length > 0
      ? (currentIndex / (historicalData.length - 1)) * 100
      : 0

  const currentDate = historicalData[currentIndex]
    ? new Date(historicalData[currentIndex].time).toLocaleDateString()
    : ''

  // Draggable controls handlers
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - controlsPosition.x,
      y: e.clientY - controlsPosition.y
    })
  }

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    
    // Keep controls within viewport bounds
    const maxX = window.innerWidth - 400
    const maxY = window.innerHeight - 100
    
    setControlsPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Sidebar resize handlers
  const handleResizeStart = (e) => {
    setIsResizing(true)
    e.preventDefault()
  }

  const handleResizeMove = useCallback((e) => {
    if (!isResizing) return
    
    const newWidth = window.innerWidth - e.clientX
    const minWidth = 200
    const maxWidth = 500
    
    setSidebarWidth(Math.max(minWidth, Math.min(newWidth, maxWidth)))
  }, [isResizing])

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Add global mouse event listeners for sidebar resize
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

  // Calculate account balance
  const accountBalance = 10000 + totalPnL
  const accountEquity = accountBalance + unrealizedPnL

  return (
    <div className="replay-chart-container" style={{ 
      position: 'relative', 
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0a0a'
    }}>
      {/* Main Content Area */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Chart Area */}
        <div style={{ 
          flex: 1, 
          position: 'relative',
          marginRight: `${sidebarWidth}px`
        }}>
          {/* Professional Replay Bar */}
          <div
            ref={controlsRef}
            className="replay-controls"
            style={{
              position: 'absolute',
              left: `${controlsPosition.x}px`,
              top: `${controlsPosition.y}px`,
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: isDragging ? 'grabbing' : 'grab',
              zIndex: 1000,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '48px'
            }}
            onMouseDown={handleMouseDown}
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
              onClick={handleReset}
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
              title="Reset to start"
            >
              ↺
            </button>

            {/* Skip Back */}
            <button
              onClick={handleStepBackward}
              disabled={currentIndex === 0}
              style={{
                background: currentIndex === 0 ? '#333' : 'transparent',
                border: 'none',
                color: currentIndex === 0 ? '#555' : '#888',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
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
              onClick={handlePlayPause}
              style={{
                background: isPlaying ? '#ef4444' : '#22c55e',
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
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            {/* Skip Forward */}
            <button
              onClick={handleStepForward}
              disabled={currentIndex >= historicalData.length - 1}
              style={{
                background: currentIndex >= historicalData.length - 1 ? '#333' : 'transparent',
                border: 'none',
                color: currentIndex >= historicalData.length - 1 ? '#555' : '#888',
                cursor: currentIndex >= historicalData.length - 1 ? 'not-allowed' : 'pointer',
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
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  cursor: 'pointer'
                }}
                title={`Speed: ${playbackSpeed}x`}
              />
              <span style={{
                color: '#888',
                fontSize: '10px',
                minWidth: '40px',
                textAlign: 'center'
              }}>
                {playbackSpeed}x
              </span>
            </div>

            {/* Timeframe Dropdown */}
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
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
              <option value="1m">1m</option>
              <option value="5m">5m</option>
              <option value="15m">15m</option>
              <option value="1h">1h</option>
              <option value="4h">4h</option>
              <option value="1D">1D</option>
            </select>

            {/* Toggle for Auto-play */}
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
                  checked={isPlaying}
                  onChange={handlePlayPause}
                  style={{
                    width: '36px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
                Auto
              </label>
            </div>

            {/* Progress Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginLeft: '8px',
              paddingLeft: '8px',
              borderLeft: '1px solid #333'
            }}>
              <div style={{
                color: '#888',
                fontSize: '10px',
                minWidth: '80px'
              }}>
                {currentIndex + 1} / {historicalData.length}
              </div>
              <div style={{
                color: '#888',
                fontSize: '10px'
              }}>
                {currentDate}
              </div>
            </div>
          </div>

          {/* Price Display */}
          <div style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px',
            background: 'rgba(20, 20, 20, 0.9)',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '12px 16px',
            zIndex: 999
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff6b00', marginBottom: '4px' }}>
              {pair}
            </div>
            <div style={{ fontSize: '20px', color: '#fff', fontFamily: 'monospace' }}>
              {currentPrice ? currentPrice.toFixed(5) : '0.00000'}
            </div>
          </div>

          {/* Trading Panel */}
          <div style={{ 
            position: 'absolute', 
            bottom: '80px', 
            left: '20px',
            background: 'rgba(20, 20, 20, 0.95)',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '12px',
            zIndex: 999,
            minWidth: '200px'
          }}>
            <div style={{ 
              fontSize: '12px', 
              color: '#ff6b00', 
              fontWeight: 'bold', 
              marginBottom: '8px' 
            }}>
              {'📈'} Trading Panel
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button
                onClick={() => setShowTradeModal('buy')}
                style={{
                  background: '#22c55e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  flex: 1
                }}
              >
                Buy
              </button>
              <button
                onClick={() => setShowTradeModal('sell')}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  flex: 1
                }}
              >
                Sell
              </button>
            </div>

            {/* Open Positions */}
            <div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                Open Positions ({trades.filter(t => t.status === 'open').length})
              </div>
              {trades.filter(t => t.status === 'open').map(trade => (
                <div 
                  key={trade.id} 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    padding: '6px',
                    marginBottom: '4px',
                    fontSize: '11px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ color: trade.type === 'buy' ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                      {trade.type.toUpperCase()}
                    </span>
                    <span style={{ color: trade.currentPnL >= 0 ? '#22c55e' : '#ef4444' }}>
                      ${trade.currentPnL?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                    <span>@{trade.entryPrice.toFixed(5)}</span>
                    <button 
                      onClick={() => closeTrade(trade.id)}
                      style={{
                        background: '#6b7280',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '2px',
                        padding: '1px 6px',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Container */}
          <div ref={chartContainerRef} style={{ 
            height: 'calc(100% - 80px)',
            width: '100%'
          }} />
        </div>

        {/* Adjustable Right Sidebar */}
        <div 
          ref={sidebarRef}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: `${sidebarWidth}px`,
            height: 'calc(100% - 80px)',
            background: 'rgba(20, 20, 20, 0.95)',
            border: '1px solid #333',
            borderLeft: '2px solid #ff6b00',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Resize Handle */}
          <div
            onMouseDown={handleResizeStart}
            style={{
              position: 'absolute',
              left: '-4px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '8px',
              height: '60px',
              background: '#ff6b00',
              borderRadius: '4px 0 0 4px',
              cursor: 'ew-resize',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: '#fff'
            }}
          >
            ⋮⋮
          </div>

          {/* Sidebar Header */}
          <div style={{
            padding: '12px',
            borderBottom: '1px solid #333',
            background: 'rgba(255, 107, 0, 0.1)'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#ff6b00',
              marginBottom: '8px'
            }}>
              {'📝'} Notes & News
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setActiveTab('notes')}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: activeTab === 'notes' ? '#ff6b00' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTab('news')}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: activeTab === 'news' ? '#ff6b00' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                News
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div style={{ flex: 1, padding: '12px', overflow: 'auto' }}>
            {activeTab === 'notes' ? (
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your trading notes here..."
                  style={{
                    width: '100%',
                    height: '200px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    padding: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    resize: 'vertical'
                  }}
                />
                <div style={{ marginTop: '12px', fontSize: '11px', color: '#888' }}>
                  <div>📅 {currentDate}</div>
                  <div>💰 Current P&L: ${totalPnL.toFixed(2)}</div>
                  <div>📈 Open Positions: {trades.filter(t => t.status === 'open').length}</div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                  Latest Market News
                </div>
                {[
                  { title: 'Fed Announces Rate Decision', time: '2 hours ago', impact: 'High' },
                  { title: 'EUR/USD Technical Analysis', time: '4 hours ago', impact: 'Medium' },
                  { title: 'Oil Prices Surge Amid Supply Concerns', time: '6 hours ago', impact: 'High' },
                  { title: 'Asian Markets Open Mixed', time: '8 hours ago', impact: 'Low' }
                ].map((news, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '4px',
                      padding: '8px',
                      marginBottom: '8px'
                    }}
                  >
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#fff',
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}>
                      {news.title}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888' }}>
                      <span>{news.time}</span>
                      <span style={{
                        color: news.impact === 'High' ? '#ef4444' : 
                               news.impact === 'Medium' ? '#f59e0b' : '#22c55e'
                      }}>
                        {news.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Balance Bar at Bottom */}
      <div style={{
        height: '80px',
        background: 'rgba(20, 20, 20, 0.95)',
        borderTop: '2px solid #ff6b00',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'relative',
        zIndex: 100
      }}>
        {/* Account Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>Balance</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', fontFamily: 'monospace' }}>
              ${accountBalance.toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>Equity</div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: accountEquity >= 10000 ? '#22c55e' : '#ef4444',
              fontFamily: 'monospace'
            }}>
              ${accountEquity.toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>Unrealized P&L</div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: unrealizedPnL >= 0 ? '#22c55e' : '#ef4444',
              fontFamily: 'monospace'
            }}>
              {unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnL.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            padding: '6px 12px',
            background: 'rgba(255, 107, 0, 0.1)',
            border: '1px solid #ff6b00',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#ff6b00',
            fontWeight: 'bold'
          }}>
            {'🔥'} Phoenix Challenge
          </div>
          <div style={{
            padding: '6px 12px',
            background: accountEquity >= 9200 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: accountEquity >= 9200 ? '1px solid #22c55e' : '1px solid #ef4444',
            borderRadius: '4px',
            fontSize: '11px',
            color: accountEquity >= 9200 ? '#22c55e' : '#ef4444',
            fontWeight: 'bold'
          }}>
            {accountEquity >= 9200 ? '✅ Active' : '⚠️ At Risk'}
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #ff6b00',
            borderRadius: '8px',
            padding: '20px',
            minWidth: '300px'
          }}>
            <h3 style={{ color: '#ff6b00', marginBottom: '16px' }}>
              Execute {showTradeModal.toUpperCase()} Order
            </h3>
            <div style={{ marginBottom: '12px', fontSize: '14px', color: '#888' }}>
              {pair} @ {currentPrice.toFixed(5)}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => executeTrade(showTradeModal, 1, currentPrice * 0.99, currentPrice * 1.02)}
                style={{
                  background: '#22c55e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Execute
              </button>
              <button
                onClick={() => setShowTradeModal(false)}
                style={{
                  background: '#6b7280',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReplayChart