import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Chart } from 'chart.js/auto'
import { useTrades } from '../context/TradesContext'

export default function PhoenixDashboard() {
  const { trades } = useTrades()
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)
  const [chartTimeframe, setChartTimeframe] = useState('1W')

  const metrics = useMemo(() => {
    const closedTrades = trades.filter((trade) => trade.status === 'closed')
    const totalPnL = closedTrades.reduce((sum, trade) => sum + Number(trade.pnl || 0), 0)
    const wins = closedTrades.filter((trade) => Number(trade.pnl || 0) > 0)
    const losses = closedTrades.filter((trade) => Number(trade.pnl || 0) < 0)
    const winRate = closedTrades.length ? (wins.length / closedTrades.length) * 100 : 0
    const avgWin = wins.length ? wins.reduce((sum, trade) => sum + Number(trade.pnl || 0), 0) / wins.length : 0
    const avgLoss = losses.length
      ? Math.abs(losses.reduce((sum, trade) => sum + Number(trade.pnl || 0), 0) / losses.length)
      : 0

    let peak = 10000
    let equity = 10000
    let maxDrawdown = 0

    closedTrades.forEach((trade) => {
      equity += Number(trade.pnl || 0)
      peak = Math.max(peak, equity)
      maxDrawdown = Math.max(maxDrawdown, ((peak - equity) / peak) * 100)
    })

    return {
      totalTrades: trades.length,
      closedTrades,
      totalPnL,
      winRate,
      balance: 10000 + totalPnL,
      avgWin,
      avgLoss,
      drawdown: maxDrawdown,
    }
  }, [trades])

  useEffect(() => {
    if (!chartRef.current) {
      return
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const sortedTrades = [...metrics.closedTrades].sort(
      (left, right) => new Date(left.timestamp) - new Date(right.timestamp),
    )

    let equity = 10000
    const equityData = [equity]
    const labels = ['Start']

    sortedTrades.forEach((trade, index) => {
      equity += Number(trade.pnl || 0)
      equityData.push(equity)
      labels.push(`Trade ${index + 1}`)
    })

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data: equityData,
            borderColor: '#ff6b00',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: '#ff6b00',
            fill: true,
            backgroundColor: (context) => {
              const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 200)
              gradient.addColorStop(0, 'rgba(255,107,0,0.2)')
              gradient.addColorStop(1, 'rgba(255,107,0,0)')
              return gradient
            },
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` $${context.parsed.y.toLocaleString()}`,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [metrics.closedTrades])

  const recentTrades = trades.slice(0, 4)

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">$10k Phoenix Challenge | Evaluation Phase</div>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">Open {trades.filter((trade) => trade.status === 'open').length}</div>
        </div>
      </div>

      <div className="content">
        <div className="challenge-banner">
          <div>
            <div className="challenge-label">Phoenix Challenge</div>
            <div className="challenge-title">$10,000 Evaluation Account</div>
          </div>
          <div className="challenge-right">
            <div className="chal-stat">
              <div className="chal-stat-val" style={{ color: '#22c55e' }}>
                ${metrics.balance.toFixed(2)}
              </div>
              <div className="chal-stat-label">Current Balance</div>
            </div>
            <div className="chal-stat">
              <div className="chal-stat-val" style={{ color: '#fff' }}>
                {metrics.winRate.toFixed(1)}%
              </div>
              <div className="chal-stat-label">Win Rate</div>
            </div>
            <div className="chal-stat">
              <div className="chal-stat-val" style={{ color: '#ef4444' }}>
                {metrics.drawdown.toFixed(2)}%
              </div>
              <div className="chal-stat-label">Drawdown</div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card positive">
            <div className="stat-label">Total PnL</div>
            <div className="stat-value white">${metrics.totalPnL.toFixed(2)}</div>
            <div className="stat-change up">{metrics.totalTrades} total trades</div>
          </div>
          <div className="stat-card positive">
            <div className="stat-label">Average Win</div>
            <div className="stat-value green">${metrics.avgWin.toFixed(2)}</div>
            <div className="stat-change up">Closed trades only</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-label">Average Loss</div>
            <div className="stat-value white">${metrics.avgLoss.toFixed(2)}</div>
            <div className="stat-change neutral">Risk control baseline</div>
          </div>
          <div className="stat-card info">
            <div className="stat-label">Open Trades</div>
            <div className="stat-value white">{trades.filter((trade) => trade.status === 'open').length}</div>
            <div className="stat-change up">Shared provider state</div>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title">Equity Curve</div>
              <div className="chart-tabs">
                {['1D', '1W', '1M', 'All'].map((timeframe) => (
                  <div
                    key={timeframe}
                    className={`chart-tab ${chartTimeframe === timeframe ? 'active' : ''}`}
                    onClick={() => setChartTimeframe(timeframe)}
                  >
                    {timeframe}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', height: '220px' }}>
              <canvas ref={chartRef} />
            </div>
          </div>
          <div className="rules-card">
            <div className="rules-title">Rules Monitor</div>
            <div className="rule-item">
              <div className="rule-top">
                <div className="rule-name">Daily Loss Limit</div>
                <div className="rule-val" style={{ color: '#22c55e' }}>
                  ${metrics.avgLoss.toFixed(2)} avg loss
                </div>
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-top">
                <div className="rule-name">Max Drawdown</div>
                <div className="rule-val" style={{ color: '#ff8c00' }}>
                  {metrics.drawdown.toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-top">
                <div className="rule-name">Profit Progress</div>
                <div className="rule-val" style={{ color: '#22c55e' }}>
                  ${metrics.totalPnL.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="trades-card">
            <div className="chart-header">
              <div className="chart-title">Recent Trades</div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>PnL</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade) => (
                    <tr key={trade.id}>
                      <td>{trade.pair}</td>
                      <td>{trade.type}</td>
                      <td style={{ color: '#555' }}>{trade.date}</td>
                      <td className={Number(trade.pnl) >= 0 ? 'pnl-pos' : 'pnl-neg'}>
                        {Number(trade.pnl).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {!recentTrades.length && (
                    <tr>
                      <td colSpan="4" style={{ color: '#777' }}>
                        No trades saved yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
