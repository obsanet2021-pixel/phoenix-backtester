import React, { useMemo, useState } from 'react'
import AnalyticsChart from '../components/charts/AnalyticsChart'
import PageLoader from '../components/ui/PageLoader'
import { useTrades } from '../context/TradesContext'
import { formatCurrency, formatDecimal, formatPercent } from '../lib/formatters'
import {
  getPairPerformance,
  getTradeFrequencySeries,
  getTradeMetrics,
  getTradeTimeline,
} from '../lib/tradeMetrics'

function exportJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
}

function buildChartOptions({ yFormatter, legend = false }) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: legend,
        labels: {
          color: '#cbd5e1',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#1e293b',
        borderWidth: 1,
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        callbacks: yFormatter
          ? {
              label: (context) => yFormatter(context.parsed.y ?? context.parsed),
            }
          : undefined,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.08)' },
        ticks: { color: '#64748b' },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.08)' },
        ticks: {
          color: '#64748b',
          callback: yFormatter ? (value) => yFormatter(value) : undefined,
        },
      },
    },
  }
}

export default function PhoenixAnalytics() {
  const { trades, loading, error } = useTrades()
  const [activeTab, setActiveTab] = useState('overview')

  const metrics = useMemo(() => getTradeMetrics(trades), [trades])
  const timeline = useMemo(() => getTradeTimeline(trades), [trades])
  const frequencySeries = useMemo(() => getTradeFrequencySeries(trades), [trades])
  const pairPerformance = useMemo(() => getPairPerformance(trades), [trades])

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
          pointHoverRadius: 4,
        },
      ],
    }),
    [timeline],
  )

  const winLossChartData = useMemo(
    () => ({
      labels: ['Wins', 'Losses', 'Breakeven'],
      datasets: [
        {
          data: [
            metrics.winLossDistribution.wins,
            metrics.winLossDistribution.losses,
            metrics.winLossDistribution.breakeven,
          ],
          backgroundColor: ['#22c55e', '#ef4444', '#94a3b8'],
          borderWidth: 0,
        },
      ],
    }),
    [metrics],
  )

  const frequencyChartData = useMemo(
    () => ({
      labels: frequencySeries.map((item) => item.label),
      datasets: [
        {
          label: 'Trade Count',
          data: frequencySeries.map((item) => item.count),
          backgroundColor: '#38bdf8',
          borderRadius: 6,
        },
      ],
    }),
    [frequencySeries],
  )

  const drawdownChartData = useMemo(
    () => ({
      labels: timeline.labels,
      datasets: [
        {
          label: 'Drawdown',
          data: timeline.drawdownSeries,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    }),
    [timeline],
  )

  if (loading) {
    return <PageLoader title="Loading analytics..." />
  }

  const noClosedTrades = metrics.closedTrades.length === 0

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <div className="page-title">Analytics</div>
          <div className="page-sub">Trader-focused performance insights from live stored trade data</div>
        </div>
        <div className="topbar-right">
          <button
            className="btn-outline"
            onClick={() => exportJson('analytics-export.json', { metrics, timeline, frequencySeries, pairPerformance })}
          >
            Export
          </button>
        </div>
      </div>

      <div className="tab-bar">
        {['overview', 'flow', 'pairs', 'risk'].map((tab) => (
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
            <h3>Analytics unavailable</h3>
            <p>{error}</p>
          </div>
        )}

        {noClosedTrades ? (
          <div className="empty-state">
            <h3>No closed trades yet</h3>
            <p>Close a few trades to unlock win rate, drawdown, equity curve, and pair performance analytics.</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <>
                <div className="overview-grid">
                  <div className="ov-panel">
                    <div className="ov-header"><div className="ov-title">Core Metrics</div></div>
                    <div className="ov-row"><div className="ov-key">Total Trades</div><div className="ov-val">{metrics.totalTrades}</div></div>
                    <div className="ov-row"><div className="ov-key">Win Rate</div><div className="ov-val green">{formatPercent(metrics.winRate)}</div></div>
                    <div className="ov-row"><div className="ov-key">Net P/L</div><div className="ov-val">{formatCurrency(metrics.netPnL)}</div></div>
                    <div className="ov-row"><div className="ov-key">P/L per Trade</div><div className="ov-val">{formatCurrency(metrics.avgPnlPerTrade)}</div></div>
                  </div>
                  <div className="ov-panel">
                    <div className="ov-header"><div className="ov-title">Quality Metrics</div></div>
                    <div className="ov-row"><div className="ov-key">Risk-to-Reward</div><div className="ov-val">{formatDecimal(metrics.averageRiskReward, 2)}R</div></div>
                    <div className="ov-row"><div className="ov-key">Average Win</div><div className="ov-val green">{formatCurrency(metrics.avgWin)}</div></div>
                    <div className="ov-row"><div className="ov-key">Average Loss</div><div className="ov-val red">{formatCurrency(metrics.avgLoss)}</div></div>
                    <div className="ov-row"><div className="ov-key">Profit Factor</div><div className="ov-val">{formatDecimal(metrics.profitFactor, 2)}</div></div>
                  </div>
                  <div className="ov-panel">
                    <div className="ov-header"><div className="ov-title">Risk Metrics</div></div>
                    <div className="ov-row"><div className="ov-key">Maximum Drawdown</div><div className="ov-val red">{formatPercent(metrics.drawdown)}</div></div>
                    <div className="ov-row"><div className="ov-key">Best Trade</div><div className="ov-val green">{formatCurrency(metrics.bestTrade)}</div></div>
                    <div className="ov-row"><div className="ov-key">Worst Trade</div><div className="ov-val red">{formatCurrency(metrics.worstTrade)}</div></div>
                    <div className="ov-row"><div className="ov-key">Current Balance</div><div className="ov-val">{formatCurrency(metrics.balance)}</div></div>
                  </div>
                </div>

                <div className="chart-row">
                  <div className="chart-card">
                    <div className="chart-header">
                      <div className="chart-title">Equity Curve</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Balance progression over closed trades</div>
                    </div>
                    <AnalyticsChart
                      type="line"
                      data={equityChartData}
                      options={buildChartOptions({ yFormatter: formatCurrency })}
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'flow' && (
              <div className="chart-row">
                <div className="chart-card">
                  <div className="chart-header">
                    <div className="chart-title">Win/Loss Distribution</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Outcome count across closed trades</div>
                  </div>
                  <AnalyticsChart
                    type="doughnut"
                    data={winLossChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'bottom',
                          labels: { color: '#cbd5e1' },
                        },
                      },
                    }}
                    height={320}
                  />
                </div>
                <div className="chart-card">
                  <div className="chart-header">
                    <div className="chart-title">Trade Frequency</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Closed trades per day</div>
                  </div>
                  <AnalyticsChart
                    type="bar"
                    data={frequencyChartData}
                    options={buildChartOptions({ yFormatter: (value) => `${value}` })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'pairs' && (
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Performance by Pair</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Net P/L, win rate, and risk-to-reward by instrument</div>
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
            )}

            {activeTab === 'risk' && (
              <div className="chart-row">
                <div className="chart-card">
                  <div className="chart-header">
                    <div className="chart-title">Drawdown Curve</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Peak-to-trough pressure over time</div>
                  </div>
                  <AnalyticsChart
                    type="line"
                    data={drawdownChartData}
                    options={buildChartOptions({ yFormatter: formatPercent })}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
