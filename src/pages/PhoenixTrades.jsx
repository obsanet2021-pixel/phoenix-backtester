import React, { useMemo, useState } from 'react'
import { useTrades } from '../context/TradesContext'
import { getTradeMetrics } from '../lib/tradeMetrics'
import PageLoader from '../components/ui/PageLoader'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'

function exportJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
}

export default function PhoenixTrades() {
  const { trades, loading, error, createTrade, updateTrade, deleteTrade } = useTrades()
  const [activeTab, setActiveTab] = useState('open')
  const [showNewTrade, setShowNewTrade] = useState(false)
  const [selectedTrade, setSelectedTrade] = useState(null)
  const [formData, setFormData] = useState({
    pair: 'XAU/USD',
    type: 'BUY',
    entry: '2025.50',
    sl: '2020.00',
    tp: '2035.00',
    size: '0.5',
    timeframe: 'M15',
    notes: '',
  })

  const metrics = useMemo(() => getTradeMetrics(trades), [trades])
  const openTrades = useMemo(() => trades.filter((trade) => trade.status === 'open'), [trades])
  const closedTrades = useMemo(() => trades.filter((trade) => trade.status === 'closed'), [trades])

  function openCreateModal() {
    setSelectedTrade(null)
    setFormData({
      pair: 'XAU/USD',
      type: 'BUY',
      entry: '2025.50',
      sl: '2020.00',
      tp: '2035.00',
      size: '0.5',
      timeframe: 'M15',
      notes: '',
    })
    setShowNewTrade(true)
  }

  function openEditModal(trade) {
    setSelectedTrade(trade)
    setFormData({
      pair: trade.pair,
      type: trade.type,
      entry: String(trade.entry ?? ''),
      sl: String(trade.sl ?? ''),
      tp: String(trade.tp ?? ''),
      size: String(trade.size ?? ''),
      timeframe: trade.timeframe || 'M15',
      notes: trade.notes || '',
    })
    setShowNewTrade(true)
  }

  async function handleSaveTrade() {
    if (selectedTrade) {
      await updateTrade(selectedTrade.id, {
        ...selectedTrade,
        ...formData,
      })
    } else {
      await createTrade({
        ...formData,
        status: 'open',
        pnl: 0,
        duration: '--',
      })
    }

    setShowNewTrade(false)
    setSelectedTrade(null)
  }

  async function handleCloseTrade(trade) {
    const exit = Number(trade.entry) + (trade.type === 'BUY' ? 1.25 : -1.25)
    const pnl = (exit - Number(trade.entry)) * Number(trade.size) * (trade.type === 'BUY' ? 1 : -1)

    await updateTrade(trade.id, {
      ...trade,
      exit,
      pnl,
      status: 'closed',
      duration: trade.duration || '1h 10m',
    })
  }

  if (loading) {
    return <PageLoader title="Loading trades..." />
  }

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <div className="page-title">Trades</div>
          <div className="page-sub">Phoenix Challenge | Position Management</div>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">{openTrades.length} open</div>
          <button className="btn-new" onClick={openCreateModal}>
            + New Trade
          </button>
        </div>
      </div>

      {error && (
        <div className="content">
          <div className="empty-state">
            <h3>Trade data unavailable</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="tab-bar">
        {['open', 'closed', 'analytics'].map((tab) => (
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
        {activeTab === 'analytics' ? (
          <div className="overview-grid">
            <div className="ov-panel">
              <div className="ov-header"><div className="ov-title">Trade Statistics</div></div>
              <div className="ov-row"><div className="ov-key">Total Trades</div><div className="ov-val">{metrics.totalTrades}</div></div>
              <div className="ov-row"><div className="ov-key">Open Positions</div><div className="ov-val">{openTrades.length}</div></div>
              <div className="ov-row"><div className="ov-key">Closed Trades</div><div className="ov-val">{closedTrades.length}</div></div>
              <div className="ov-row"><div className="ov-key">Win Rate</div><div className="ov-val green">{metrics.winRate.toFixed(1)}%</div></div>
            </div>
            <div className="ov-panel">
              <div className="ov-header"><div className="ov-title">Performance</div></div>
              <div className="ov-row"><div className="ov-key">Total PnL</div><div className="ov-val green">${metrics.totalPnL.toFixed(2)}</div></div>
              <div className="ov-row"><div className="ov-key">Average Win</div><div className="ov-val green">${metrics.avgWin.toFixed(2)}</div></div>
              <div className="ov-row"><div className="ov-key">Average Loss</div><div className="ov-val red">${metrics.avgLoss.toFixed(2)}</div></div>
              <div className="ov-row"><div className="ov-key">Profit Factor</div><div className="ov-val">{metrics.profitFactor.toFixed(2)}</div></div>
            </div>
            <div className="ov-panel">
              <div className="ov-header"><div className="ov-title">Actions</div></div>
              <button className="btn-outline" onClick={() => exportJson('trades-export.json', trades)}>
                Export trades
              </button>
            </div>
          </div>
        ) : (
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title">
                {activeTab === 'open' ? `Open Positions (${openTrades.length})` : `Closed Trades (${closedTrades.length})`}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-outline" onClick={() => exportJson('trades-export.json', activeTab === 'open' ? openTrades : closedTrades)}>
                  Export
                </button>
                <button className="btn-new" onClick={openCreateModal}>
                  + New Trade
                </button>
              </div>
            </div>
            {loading ? (
              <LoadingSkeleton rows={6} />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      {['Date', 'Pair', 'Type', 'Entry', 'Exit', 'PnL', 'Status', 'Actions'].map((header) => (
                        <th key={header} style={{ color: '#444', textAlign: 'left', padding: '8px', borderBottom: '1px solid #1a1a1a' }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(activeTab === 'open' ? openTrades : closedTrades).map((trade) => (
                      <tr key={trade.id} style={{ borderBottom: '1px solid #141414' }}>
                        <td style={{ padding: '8px', color: '#aaa' }}>{trade.date}</td>
                        <td style={{ padding: '8px', color: '#ddd' }}>{trade.pair}</td>
                        <td style={{ padding: '8px', color: trade.type === 'BUY' ? '#22c55e' : '#ef4444' }}>{trade.type}</td>
                        <td style={{ padding: '8px' }}>{trade.entry}</td>
                        <td style={{ padding: '8px' }}>{trade.exit ?? 'Open'}</td>
                        <td style={{ padding: '8px', color: Number(trade.pnl) >= 0 ? '#22c55e' : '#ef4444' }}>{Number(trade.pnl || 0).toFixed(2)}</td>
                        <td style={{ padding: '8px' }}>{trade.status}</td>
                        <td style={{ padding: '8px', display: 'flex', gap: 8 }}>
                          {trade.status === 'open' && (
                            <button className="btn-outline" onClick={() => handleCloseTrade(trade)}>Close</button>
                          )}
                          <button className="btn-outline" onClick={() => openEditModal(trade)}>Edit</button>
                          <button className="btn-outline" onClick={() => deleteTrade(trade.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showNewTrade && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedTrade ? 'Edit Trade' : 'New Trade'}</h3>
              <button className="modal-close" onClick={() => setShowNewTrade(false)}>{'\u2715'}</button>
            </div>
            <div className="modal-body">
              {['pair', 'entry', 'sl', 'tp', 'size', 'timeframe', 'notes'].map((field) => (
                <div className="form-group" key={field}>
                  <label>{field.toUpperCase()}</label>
                  <input
                    type="text"
                    value={formData[field]}
                    onChange={(event) => setFormData((current) => ({ ...current, [field]: event.target.value }))}
                  />
                </div>
              ))}
              <div className="form-group">
                <label>TYPE</label>
                <select value={formData.type} onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value }))}>
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowNewTrade(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveTrade}>Save Trade</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
