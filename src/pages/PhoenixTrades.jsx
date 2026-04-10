import React, { useState, useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'

const PhoenixTrades = () => {
  const [activeTab, setActiveTab] = useState('open')
  const [trades, setTrades] = useState([
    { id: 1, date: '2025-01-08', time: '14:32', pair: 'XAU/USD', type: 'BUY', entry: 2025.50, exit: null, sl: 2020.00, tp: 2030.00, size: 0.1, pnl: '+$126.00', status: 'open', duration: '1h 26m' },
    { id: 2, date: '2025-01-08', time: '11:15', pair: 'EUR/USD', type: 'SELL', entry: 1.0850, exit: 1.0845, sl: 1.0870, tp: 1.0820, size: 0.2, pnl: '+$10.00', status: 'closed', duration: '45m' },
    { id: 3, date: '2025-01-07', time: '16:45', pair: 'GBP/USD', type: 'BUY', entry: 1.2750, exit: 1.2730, sl: 1.2720, tp: 1.2800, size: 0.15, pnl: '-$30.00', status: 'closed', duration: '2h 15m' },
    { id: 4, date: '2025-01-07', time: '09:30', pair: 'USD/JPY', type: 'SELL', entry: 148.50, exit: 148.45, sl: 148.70, tp: 148.20, size: 0.1, pnl: '+$5.00', status: 'closed', duration: '1h 10m' },
    { id: 5, date: '2025-01-06', time: '13:20', pair: 'AUD/USD', type: 'BUY', entry: 0.6750, exit: null, sl: 0.6720, tp: 0.6800, size: 0.25, pnl: '0.00', status: 'open', duration: '3h 45m' }
  ])

  const [showNewTrade, setShowNewTrade] = useState(false)
  const [selectedTrade, setSelectedTrade] = useState(null)

  const chartRefs = {
    performanceChart: useRef(null),
    distributionChart: useRef(null),
    pairChart: useRef(null),
    timeChart: useRef(null)
  }

  const chartInstances = useRef({})

  const ORANGE = '#ff6b00'
  const TEAL = '#00c4b4'
  const GREEN = '#22c55e'
  const RED = '#ef4444'
  const GRID = '#161616'
  const TICK = '#444'

  const baseOpts = (yFmt) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2a2a2a',
        borderWidth: 1,
        titleColor: '#888',
        bodyColor: '#fff'
      }
    },
    scales: {
      x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
      y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 }, callback: yFmt } }
    }
  })

  useEffect(() => {
    // Performance Chart
    if (chartRefs.performanceChart.current && !chartInstances.current.performanceChart) {
      chartInstances.current.performanceChart = new Chart(chartRefs.performanceChart.current, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [{
            label: 'Daily P&L',
            data: [150, -50, 200, 75, 126],
            borderColor: ORANGE,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: ORANGE,
            fill: true,
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200)
              g.addColorStop(0, 'rgba(255,107,0,0.2)')
              g.addColorStop(1, 'rgba(255,107,0,0)')
              return g
            },
            tension: 0.4
          }]
        },
        options: {
          ...baseOpts(v => '$' + v),
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ' P&L: $' + ctx.parsed.y
              }
            }
          }
        }
      })
    }

    // Distribution Chart
    if (chartRefs.distributionChart.current && !chartInstances.current.distributionChart) {
      chartInstances.current.distributionChart = new Chart(chartRefs.distributionChart.current, {
        type: 'bar',
        data: {
          labels: ['0-10', '10-25', '25-50', '50-100', '100+'],
          datasets: [{
            label: 'Trade Distribution',
            data: [2, 8, 12, 6, 2],
            backgroundColor: [RED, TEAL, GREEN, GREEN, ORANGE],
            borderRadius: 4
          }]
        },
        options: {
          ...baseOpts(v => v + ' trades'),
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ' Trades: ' + ctx.parsed.y
              }
            }
          }
        }
      })
    }

    // Pair Chart
    if (chartRefs.pairChart.current && !chartInstances.current.pairChart) {
      chartInstances.current.pairChart = new Chart(chartRefs.pairChart.current, {
        type: 'doughnut',
        data: {
          labels: ['XAU/USD', 'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'],
          datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: [ORANGE, TEAL, GREEN, RED, '#ff6b0080'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: '#fff', font: { size: 11 } }
            },
            tooltip: {
              callbacks: {
                label: ctx => ctx.label + ': ' + ctx.parsed + '%'
              }
            }
          }
        }
      })
    }

    // Time Chart
    if (chartRefs.timeChart.current && !chartInstances.current.timeChart) {
      chartInstances.current.timeChart = new Chart(chartRefs.timeChart.current, {
        type: 'bar',
        data: {
          labels: ['00-04', '04-08', '08-12', '12-16', '16-20', '20-24'],
          datasets: [{
            label: 'Trading Hours',
            data: [2, 5, 8, 15, 10, 3],
            backgroundColor: (ctx) => {
              const colors = [TEAL, TEAL, RED, GREEN, GREEN, TEAL]
              return colors[ctx.dataIndex]
            },
            borderRadius: 4
          }]
        },
        options: {
          ...baseOpts(v => v + ' trades'),
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ' Trades: ' + ctx.parsed.y
              }
            }
          }
        }
      })
    }

    return () => {
      Object.values(chartInstances.current).forEach(chart => {
        if (chart) chart.destroy()
      })
      chartInstances.current = {}
    }
  }, [])

  const handleDeleteTrade = (tradeId) => {
    setTrades(trades.filter(t => t.id !== tradeId))
  }

  const handleEditTrade = (trade) => {
    setSelectedTrade(trade)
    setShowNewTrade(true)
  }

  const handleCloseTrade = (tradeId) => {
    setTrades(trades.map(t => 
      t.id === tradeId 
        ? { ...t, status: 'closed', exit: t.entry + (t.type === 'BUY' ? 0.0025 : -0.0025) }
        : t
    ))
  }

  const TradesTable = ({ trades }) => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date/Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Pair</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead>Exit</TableHead>
            <TableHead>SL</TableHead>
            <TableHead>TP</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>P&L</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell>
                <div className="trade-date">{trade.date}</div>
                <div className="trade-time">{trade.time}</div>
              </TableCell>
              <TableCell>
                <span className={trade.type === 'BUY' ? 'text-green-500' : 'text-red-500'}>
                  {trade.type}
                </span>
              </TableCell>
              <TableCell>{trade.pair}</TableCell>
              <TableCell>{trade.entry}</TableCell>
              <TableCell>
                {trade.exit || <span className="text-gray-500">Open</span>}
              </TableCell>
              <TableCell>{trade.sl}</TableCell>
              <TableCell>{trade.tp}</TableCell>
              <TableCell>{trade.size}</TableCell>
              <TableCell className={trade.pnl.startsWith('+') ? 'text-green-500' : trade.pnl.startsWith('-') ? 'text-red-500' : ''}>
                {trade.pnl}
              </TableCell>
              <TableCell>
                <span className={trade.status === 'open' ? 'text-yellow-500' : 'text-gray-500'}>
                  {trade.status === 'open' ? 'Open' : 'Closed'}
                </span>
              </TableCell>
              <TableCell>{trade.duration}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {trade.status === 'open' && (
                    <button 
                      className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => handleCloseTrade(trade.id)}
                      title="Close"
                    >
                      ✓
                    </button>
                  )}
                  <button 
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => handleEditTrade(trade)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDeleteTrade(trade.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  const NewTradeModal = () => {
    if (!showNewTrade) return null

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{selectedTrade ? 'Edit Trade' : 'New Trade'}</h3>
            <button 
              className="modal-close" 
              onClick={() => {
                setShowNewTrade(false)
                setSelectedTrade(null)
              }}
            >
              {'\u2715'}
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Date & Time</label>
              <input 
                type="datetime-local" 
                defaultValue={selectedTrade ? `${selectedTrade.date}T${selectedTrade.time}` : new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="form-group">
              <label>Currency Pair</label>
              <select defaultValue={selectedTrade?.pair || 'XAUUSD'}>
                <option value="XAUUSD">XAU/USD</option>
                <option value="EURUSD">EUR/USD</option>
                <option value="GBPUSD">GBP/USD</option>
                <option value="USDJPY">USD/JPY</option>
                <option value="AUDUSD">AUD/USD</option>
              </select>
            </div>
            <div className="form-group">
              <label>Trade Type</label>
              <select defaultValue={selectedTrade?.type || 'BUY'}>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </div>
            <div className="form-group">
              <label>Entry Price</label>
              <input 
                type="number" 
                step="0.0001"
                defaultValue={selectedTrade?.entry || ''}
                placeholder="1.0850"
              />
            </div>
            <div className="form-group">
              <label>Stop Loss</label>
              <input 
                type="number" 
                step="0.0001"
                defaultValue={selectedTrade?.sl || ''}
                placeholder="1.0820"
              />
            </div>
            <div className="form-group">
              <label>Take Profit</label>
              <input 
                type="number" 
                step="0.0001"
                defaultValue={selectedTrade?.tp || ''}
                placeholder="1.0880"
              />
            </div>
            <div className="form-group">
              <label>Position Size</label>
              <input 
                type="number" 
                step="0.01"
                defaultValue={selectedTrade?.size || '0.1'}
                placeholder="0.1"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="btn-cancel" 
              onClick={() => {
                setShowNewTrade(false)
                setSelectedTrade(null)
              }}
            >
              Cancel
            </button>
            <button 
              className="btn-primary"
              onClick={() => {
                // Handle save logic here
                setShowNewTrade(false)
                setSelectedTrade(null)
              }}
            >
              {selectedTrade ? 'Update' : 'Create'} Trade
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderTab = () => {
    const openTrades = trades.filter(t => t.status === 'open')
    const closedTrades = trades.filter(t => t.status === 'closed')

    switch (activeTab) {
      case 'open':
        return (
          <div>
            <div className="trades-header">
              <h3>Open Positions ({openTrades.length})</h3>
              <div className="trades-actions">
                <button className="btn-outline">Close All</button>
                <button 
                  className="btn-new"
                  onClick={() => setShowNewTrade(true)}
                >
                  + New Trade
                </button>
              </div>
            </div>

            <div className="trades-table-container">
              <TradesTable trades={openTrades} />
            </div>

            {openTrades.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">{'\ud83d\udcc8'}</div>
                <h3>No Open Positions</h3>
                <p>You currently have no open trades</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowNewTrade(true)}
                >
                  Open First Trade
                </button>
              </div>
            )}
          </div>
        )

      case 'closed':
        return (
          <div>
            <div className="trades-header">
              <h3>Closed Trades ({closedTrades.length})</h3>
              <div className="trades-actions">
                <select className="filter-select">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <button className="btn-outline">Export CSV</button>
              </div>
            </div>

            <div className="trades-table-container">
              <TradesTable trades={closedTrades} />
            </div>

            {closedTrades.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">{'\ud83d\udcca'}</div>
                <h3>No Closed Trades</h3>
                <p>Your trade history will appear here</p>
              </div>
            )}
          </div>
        )

      case 'analytics':
        return (
          <div>
            <div className="overview-grid">
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Trade Statistics</div>
                  <div className="ov-badge win">Active</div>
                </div>
                <div className="ov-row"><div className="ov-key">Total Trades</div><div className="ov-val">{trades.length}</div></div>
                <div className="ov-row"><div className="ov-key">Open Positions</div><div className="ov-val">{openTrades.length}</div></div>
                <div className="ov-row"><div className="ov-key">Closed Trades</div><div className="ov-val">{closedTrades.length}</div></div>
                <div className="ov-row"><div className="ov-key">Win Rate</div><div className="ov-val green">66.7%</div></div>
                <div className="ov-row"><div className="ov-key">Avg Win</div><div className="ov-val green">$47.00</div></div>
                <div className="ov-row"><div className="ov-key">Avg Loss</div><div className="ov-val red">$30.00</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Performance Metrics</div>
                  <div className="ov-badge neutral">Analysis</div>
                </div>
                <div className="ov-row"><div className="ov-key">Total P&L</div><div className="ov-val green">+$61.00</div></div>
                <div className="ov-row"><div className="ov-key">Profit Factor</div><div className="ov-val green">2.03</div></div>
                <div className="ov-row"><div className="ov-key">Max Drawdown</div><div className="ov-val red">$30.00</div></div>
                <div className="ov-row"><div className="ov-key">Sharpe Ratio</div><div className="ov-val">1.45</div></div>
                <div className="ov-row"><div className="ov-key">Avg Duration</div><div className="ov-val">1h 32m</div></div>
                <div className="ov-row"><div className="ov-key">Best Trade</div><div className="ov-val green">+$126.00</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Risk Management</div>
                  <div className="ov-badge lose">Monitor</div>
                </div>
                <div className="ov-row"><div className="ov-key">Risk/Reward</div><div className="ov-val green">1:1.8</div></div>
                <div className="ov-row"><div className="ov-key">Position Size</div><div className="ov-val">1.5%</div></div>
                <div className="ov-row"><div className="ov-key">Leverage Used</div><div className="ov-val">10:1</div></div>
                <div className="ov-row"><div className="ov-key">Stop Hit Rate</div><div className="ov-val red">20%</div></div>
                <div className="ov-row"><div className="ov-key">TP Hit Rate</div><div className="ov-val green">40%</div></div>
                <div className="ov-row"><div className="ov-key">Risk Exposure</div><div className="ov-val green">$250</div></div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Daily Performance</div>
                  <div style={{ fontSize: '11px', color: GREEN }}>Total: +$501</div>
                </div>
                <div style={{ position: 'relative', height: '200px' }}>
                  <canvas ref={chartRefs.performanceChart}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">P&L Distribution</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>30 trades</div>
                </div>
                <div style={{ position: 'relative', height: '200px' }}>
                  <canvas ref={chartRefs.distributionChart}></canvas>
                </div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Pair Distribution</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>5 pairs</div>
                </div>
                <div style={{ position: 'relative', height: '250px' }}>
                  <canvas ref={chartRefs.pairChart}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Trading Hours</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>Peak: 12-16</div>
                </div>
                <div style={{ position: 'relative', height: '250px' }}>
                  <canvas ref={chartRefs.timeChart}></canvas>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <div className="page-title">Trades</div>
          <div className="page-sub">Phoenix Challenge · Position Management</div>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">{'\ud83d\udcc8'} {trades.filter(t => t.status === 'open').length} open</div>
          <button 
            className="btn-new" 
            onClick={() => setShowNewTrade(true)}
          >
            + New Trade
          </button>
        </div>
      </div>

      <div className="tab-bar">
        {['open', 'closed', 'analytics'].map(tab => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      <div className="content">
        {renderTab()}
      </div>

      <NewTradeModal />
    </div>
  )
}

export default PhoenixTrades
