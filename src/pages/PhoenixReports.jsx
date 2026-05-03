import React, { useMemo } from 'react'
import AnalyticsChart from '../components/charts/AnalyticsChart'
import PageLoader from '../components/ui/PageLoader'
import { useTrades } from '../context/TradesContext'
import { formatCurrency, formatDecimal, formatPercent } from '../lib/formatters'
import { getPairPerformance, getTradeMetrics, getTradeTimeline } from '../lib/tradeMetrics'

function exportJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
}

export default function PhoenixReports() {
  const { trades, loading, error } = useTrades()
  const metrics = useMemo(() => getTradeMetrics(trades), [trades])
  const timeline = useMemo(() => getTradeTimeline(trades), [trades])
  const pairPerformance = useMemo(() => getPairPerformance(trades), [trades])

  const pairChartData = useMemo(
    () => ({
      labels: pairPerformance.map((pair) => pair.pair),
      datasets: [
        {
          label: 'Net P/L by Pair',
          data: pairPerformance.map((pair) => pair.netPnL),
          backgroundColor: pairPerformance.map((pair) => (pair.netPnL >= 0 ? '#22c55e' : '#ef4444')),
          borderRadius: 6,
        },
      ],
    }),
    [pairPerformance],
  )

  const equityChartData = useMemo(
    () => ({
      labels: timeline.labels,
      datasets: [
        {
          label: 'Equity Curve',
          data: timeline.equitySeries,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 2,
        },
      ],
    }),
    [timeline],
  )

  if (loading) {
    return <PageLoader title="Loading reports..." />
  }

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <div className="page-title">Reports</div>
          <div className="page-sub">Production-grade trading performance summary</div>
        </div>
        <div className="topbar-right">
          <button
            className="btn-outline"
            onClick={() => exportJson('report-export.json', { metrics, timeline, pairPerformance })}
          >
            Export Report
          </button>
        </div>
      </div>

      <div className="content">
        {error && (
          <div className="empty-state">
            <h3>Reports unavailable</h3>
            <p>{error}</p>
          </div>
        )}

        {metrics.closedTrades.length === 0 ? (
          <div className="empty-state">
            <h3>No reportable trades yet</h3>
            <p>Close trades first to generate a real equity curve, pair breakdown, and risk summary.</p>
          </div>
        ) : (
          <>
            <div className="overview-grid">
              <div className="ov-panel">
                <div className="ov-header"><div className="ov-title">Summary</div></div>
                <div className="ov-row"><div className="ov-key">Net P/L</div><div className="ov-val">{formatCurrency(metrics.netPnL)}</div></div>
                <div className="ov-row"><div className="ov-key">Total Trades</div><div className="ov-val">{metrics.totalTrades}</div></div>
                <div className="ov-row"><div className="ov-key">Win Rate</div><div className="ov-val green">{formatPercent(metrics.winRate)}</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header"><div className="ov-title">Execution Quality</div></div>
                <div className="ov-row"><div className="ov-key">Average Win</div><div className="ov-val green">{formatCurrency(metrics.avgWin)}</div></div>
                <div className="ov-row"><div className="ov-key">Average Loss</div><div className="ov-val red">{formatCurrency(metrics.avgLoss)}</div></div>
                <div className="ov-row"><div className="ov-key">Risk-to-Reward</div><div className="ov-val">{formatDecimal(metrics.averageRiskReward, 2)}R</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header"><div className="ov-title">Risk</div></div>
                <div className="ov-row"><div className="ov-key">Maximum Drawdown</div><div className="ov-val red">{formatPercent(metrics.drawdown)}</div></div>
                <div className="ov-row"><div className="ov-key">Best Trade</div><div className="ov-val green">{formatCurrency(metrics.bestTrade)}</div></div>
                <div className="ov-row"><div className="ov-key">Worst Trade</div><div className="ov-val red">{formatCurrency(metrics.worstTrade)}</div></div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Equity Curve</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Balance over time</div>
                </div>
                <AnalyticsChart
                  type="line"
                  data={equityChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => formatCurrency(context.parsed.y),
                        },
                      },
                    },
                    scales: {
                      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,0.08)' } },
                      y: {
                        ticks: {
                          color: '#64748b',
                          callback: (value) => formatCurrency(value),
                        },
                        grid: { color: 'rgba(148,163,184,0.08)' },
                      },
                    },
                  }}
                />
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Performance by Pair</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Net P/L contribution</div>
                </div>
                <AnalyticsChart
                  type="bar"
                  data={pairChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => formatCurrency(context.parsed.y),
                        },
                      },
                    },
                    scales: {
                      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,0.08)' } },
                      y: {
                        ticks: {
                          color: '#64748b',
                          callback: (value) => formatCurrency(value),
                        },
                        grid: { color: 'rgba(148,163,184,0.08)' },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">Pair Breakdown</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Where your edge is strongest</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      {['Pair', 'Trades', 'Win Rate', 'Net P/L', 'Avg P/L', 'Avg Win', 'Avg Loss', 'Avg R:R'].map((header) => (
                        <th key={header} style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #1a1a1a', color: '#64748b' }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pairPerformance.map((pair) => (
                      <tr key={pair.pair} style={{ borderBottom: '1px solid #141414' }}>
                        <td style={{ padding: 8, color: '#e2e8f0' }}>{pair.pair}</td>
                        <td style={{ padding: 8 }}>{pair.totalTrades}</td>
                        <td style={{ padding: 8 }}>{formatPercent(pair.winRate)}</td>
                        <td style={{ padding: 8, color: pair.netPnL >= 0 ? '#22c55e' : '#ef4444' }}>{formatCurrency(pair.netPnL)}</td>
                        <td style={{ padding: 8 }}>{formatCurrency(pair.avgPnlPerTrade)}</td>
                        <td style={{ padding: 8, color: '#22c55e' }}>{formatCurrency(pair.avgWin)}</td>
                        <td style={{ padding: 8, color: '#ef4444' }}>{formatCurrency(pair.avgLoss)}</td>
                        <td style={{ padding: 8 }}>{formatDecimal(pair.averageRiskReward, 2)}R</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
