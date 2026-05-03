import React, { useMemo, useState } from 'react'
import { useTrades } from '../context/TradesContext'
import { getTradeMetrics } from '../lib/tradeMetrics'
import PageLoader from '../components/ui/PageLoader'

export default function PhoenixJournal() {
  const { trades, loading, error, updateTrade, deleteTrade } = useTrades()
  const [activeTab, setActiveTab] = useState('entries')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  const metrics = useMemo(() => getTradeMetrics(trades), [trades])
  const filteredTrades = useMemo(
    () =>
      trades.filter((trade) => {
        const matchesFilter = filter === 'all' || trade.status === filter
        const haystack = `${trade.pair} ${trade.type} ${trade.notes || ''}`.toLowerCase()
        const matchesSearch = !searchTerm || haystack.includes(searchTerm.toLowerCase())
        return matchesFilter && matchesSearch
      }),
    [filter, searchTerm, trades],
  )

  if (loading) {
    return <PageLoader title="Loading journal..." />
  }

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <div className="page-title">Journal</div>
          <div className="page-sub">Phoenix Challenge | Trading Psychology</div>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">{metrics.closedTrades.length} reviewed</div>
        </div>
      </div>

      <div className="tab-bar">
        {['entries', 'analytics', 'insights'].map((tab) => (
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
        {error && (
          <div className="empty-state">
            <h3>Journal data unavailable</h3>
            <p>{error}</p>
          </div>
        )}

        {activeTab === 'entries' && (
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title">Trade Notes</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search notes or pairs"
                />
                <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                  <option value="all">All</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="journal-grid">
              {filteredTrades.map((trade) => (
                <div key={trade.id} className="journal-card">
                  <div className="journal-header">
                    <div className="journal-date">{trade.date}</div>
                    <div className="journal-mood" style={{ color: trade.type === 'BUY' ? '#22c55e' : '#ef4444' }}>
                      {trade.type}
                    </div>
                  </div>
                  <div className="journal-title">{trade.pair}</div>
                  <div className="journal-content">{trade.notes || 'No notes recorded for this trade yet.'}</div>
                  <div className="journal-footer">
                    <div className="journal-pair">{trade.status}</div>
                    <div className={`journal-pnl ${Number(trade.pnl) >= 0 ? 'positive' : 'negative'}`}>
                      {Number(trade.pnl).toFixed(2)}
                    </div>
                  </div>
                  <div className="journal-actions">
                    <button className="journal-btn" onClick={() => deleteTrade(trade.id)} title="Delete">
                      {'\ud83d\uddd1\ufe0f'}
                    </button>
                    <button
                      className="journal-btn"
                      onClick={() =>
                        updateTrade(trade.id, {
                          ...trade,
                          notes: `${trade.notes || ''}\nReviewed on ${new Date().toLocaleDateString()}`.trim(),
                        })
                      }
                      title="Append review note"
                    >
                      {'\u270f\ufe0f'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="overview-grid">
            <div className="ov-panel">
              <div className="ov-header"><div className="ov-title">Journal Statistics</div></div>
              <div className="ov-row"><div className="ov-key">Trades with Notes</div><div className="ov-val">{trades.filter((trade) => trade.notes).length}</div></div>
              <div className="ov-row"><div className="ov-key">Closed Trades</div><div className="ov-val">{metrics.closedTrades.length}</div></div>
              <div className="ov-row"><div className="ov-key">Win Rate</div><div className="ov-val green">{metrics.winRate.toFixed(1)}%</div></div>
            </div>
            <div className="ov-panel">
              <div className="ov-header"><div className="ov-title">Reflection Metrics</div></div>
              <div className="ov-row"><div className="ov-key">Average Win</div><div className="ov-val green">${metrics.avgWin.toFixed(2)}</div></div>
              <div className="ov-row"><div className="ov-key">Average Loss</div><div className="ov-val red">${metrics.avgLoss.toFixed(2)}</div></div>
              <div className="ov-row"><div className="ov-key">Total PnL</div><div className="ov-val">${metrics.totalPnL.toFixed(2)}</div></div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="chart-card">
            <div className="chart-header"><div className="chart-title">Operational Insights</div></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <div style={{ background: '#0a0a0a', padding: 16, borderRadius: 10, border: '1px solid #2a2a2a' }}>
                <h4 style={{ color: '#22c55e', marginBottom: 8, fontSize: 14 }}>What is working</h4>
                <ul style={{ color: '#aaa', fontSize: 12, paddingLeft: 16, margin: 0 }}>
                  <li>{metrics.winRate >= 50 ? 'Current win rate is above break-even territory.' : 'You have enough data to isolate weak setups.'}</li>
                  <li>{trades.filter((trade) => trade.notes).length} trades already contain review notes.</li>
                </ul>
              </div>
              <div style={{ background: '#0a0a0a', padding: 16, borderRadius: 10, border: '1px solid #2a2a2a' }}>
                <h4 style={{ color: '#ef4444', marginBottom: 8, fontSize: 14 }}>What to improve</h4>
                <ul style={{ color: '#aaa', fontSize: 12, paddingLeft: 16, margin: 0 }}>
                  <li>Add notes to every closed trade for stronger review loops.</li>
                  <li>Track duration more consistently to unlock session analysis.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
