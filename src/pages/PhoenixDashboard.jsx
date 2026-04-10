import React, { useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

const PhoenixDashboard = () => {
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  useEffect(() => {
    if (chartRef.current && !chartInstanceRef.current) {
      const equity = [10000, 9980, 9960, 9990, 10050, 10120, 10080, 10150, 10200, 10175, 10196]
      const labels = ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7', 'Jan 8', 'Jan 9', 'Jan 10', 'Jan 11']

      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            data: equity,
            borderColor: '#ff6b00',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: '#ff6b00',
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
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1a1a',
              borderColor: '#2a2a2a',
              borderWidth: 1,
              titleColor: '#888',
              bodyColor: '#fff',
              callbacks: { label: ctx => ' $' + ctx.parsed.y.toLocaleString() }
            }
          },
          scales: {
            x: { grid: { color: '#141414' }, ticks: { color: '#444', font: { size: 10 } } },
            y: {
              grid: { color: '#141414' },
              ticks: { color: '#444', font: { size: 10 }, callback: v => '$' + v.toLocaleString() },
              min: 9800
            }
          }
        }
      })
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      const progressFill = document.querySelector('.progress-fill')
      const targetFill = document.querySelector('.target-fill')
      if (progressFill) progressFill.style.width = '20%'
      if (targetFill) targetFill.style.width = '20%'
    }, 300)
  }, [])

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">$10k Phoenix Challenge · Evaluation Phase</div>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">{'\ud83d\udd25'} 3 day streak</div>
          <button className="btn-outline">Export Report</button>
          <button className="btn-primary">+ New Trade</button>
        </div>
      </div>

      <div className="content">
        {/* Challenge Banner */}
        <div className="challenge-banner">
          <div>
            <div className="challenge-label">Phoenix Challenge</div>
            <div className="challenge-title">$10,000 Evaluation Account</div>
          </div>
          <div className="progress-wrap">
            <div className="progress-label">
              <span>Progress to target</span>
              <span style={{ color: '#ff8c3a' }}>20%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '20%' }}></div>
            </div>
          </div>
          <div className="challenge-right">
            <div className="chal-stat">
              <div className="chal-stat-val" style={{ color: '#22c55e' }}>$10,196</div>
              <div className="chal-stat-label">Current Balance</div>
            </div>
            <div className="chal-stat">
              <div className="chal-stat-val" style={{ color: '#fff' }}>$20,000</div>
              <div className="chal-stat-label">Profit Target</div>
            </div>
            <div className="chal-stat">
              <div className="chal-stat-val" style={{ color: '#ef4444' }}>$9,200</div>
              <div className="chal-stat-label">Drawdown Floor</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card positive">
            <div className="stat-icon green">{'\ud83d\udcb0'}</div>
            <div className="stat-label">Account Balance</div>
            <div className="stat-value white">$10,196</div>
            <div className="stat-change up">{'\u2191'} +$196 today</div>
          </div>
          <div className="stat-card positive">
            <div className="stat-icon green">{'\ud83d\udcc8'}</div>
            <div className="stat-label">Win Rate</div>
            <div className="stat-value green">60.00%</div>
            <div className="stat-change up">6W · 4L · 0BE</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon orange">{'\u26a1'}</div>
            <div className="stat-label">Max Drawdown</div>
            <div className="stat-value white">2.1%</div>
            <div className="stat-change neutral">Floor: $9,200</div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon blue">{'\u2696\ufe0f'}</div>
            <div className="stat-label">Profit Factor</div>
            <div className="stat-value white">1.80</div>
            <div className="stat-change up">Avg $200 / trade</div>
          </div>
        </div>

        {/* Chart + Rules */}
        <div className="chart-section">
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title">Equity Curve</div>
              <div className="chart-tabs">
                <div className="chart-tab">1D</div>
                <div className="chart-tab active">1W</div>
                <div className="chart-tab">1M</div>
                <div className="chart-tab">All</div>
              </div>
            </div>
            <div style={{ position: 'relative', height: '200px' }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
          <div className="rules-card">
            <div className="rules-title">
              Rules Monitor
              <span className="rules-badge">LIVE</span>
            </div>
            <div className="rule-item">
              <div className="rule-top">
                <div className="rule-name">Daily Loss Limit</div>
                <div className="rule-val" style={{ color: '#22c55e' }}>-$34 / $500</div>
              </div>
              <div className="rule-bar">
                <div className="rule-fill safe" style={{ width: '6.8%' }}></div>
              </div>
              <div className="rule-status">6.8% used · Safe zone</div>
            </div>
            <div className="rule-item">
              <div className="rule-top">
                <div className="rule-name">Max Drawdown</div>
                <div className="rule-val" style={{ color: '#ff8c00' }}>-$210 / $800</div>
              </div>
              <div className="rule-bar">
                <div className="rule-fill warn" style={{ width: '26%' }}></div>
              </div>
              <div className="rule-status">26% used · Monitor closely</div>
            </div>
            <div className="rule-item">
              <div className="rule-top">
                <div className="rule-name">Consecutive Losses</div>
                <div className="rule-val" style={{ color: '#22c55e' }}>2 / 5 max</div>
              </div>
              <div className="rule-bar">
                <div className="rule-fill safe" style={{ width: '40%' }}></div>
              </div>
              <div className="rule-status">40% used · Under control</div>
            </div>
            <div className="target-box">
              <div className="target-label">{'\ud83c\udfaf'} Profit Target</div>
              <div className="target-bar">
                <div className="target-fill" style={{ width: '20%' }}></div>
              </div>
              <div className="target-row">
                <div className="target-current">$10,196 current</div>
                <div className="target-goal">$20,000 goal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="bottom-grid">
          <div className="trades-card">
            <div className="chart-header">
              <div className="chart-title">Recent Trades</div>
              <div style={{ fontSize: '11px', color: '#ff8c3a', cursor: 'pointer' }}>View all {'\u2192'}</div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>P&amp;L</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XAU/USD</td>
                    <td><span className="badge buy">BUY</span></td>
                    <td style={{ color: '#555' }}>Jan 2</td>
                    <td className="pnl-pos">+$126.00</td>
                  </tr>
                  <tr>
                    <td>XAU/USD</td>
                    <td><span className="badge sell">SELL</span></td>
                    <td style={{ color: '#555' }}>Jan 5</td>
                    <td className="pnl-neg">-$50.00</td>
                  </tr>
                  <tr>
                    <td>XAU/USD</td>
                    <td><span className="badge buy">BUY</span></td>
                    <td style={{ color: '#555' }}>Jan 5</td>
                    <td className="pnl-pos">+$160.92</td>
                  </tr>
                  <tr>
                    <td>XAU/USD</td>
                    <td><span className="badge buy">BUY</span></td>
                    <td style={{ color: '#555' }}>Jan 2</td>
                    <td className="pnl-neg">-$40.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="session-card">
            <div className="chart-header">
              <div className="chart-title">Trade Heatmap</div>
              <div style={{ fontSize: '11px', color: '#555' }}>Jan 2026</div>
            </div>
            <div className="session-labels">
              <div className="session-col-label">M</div>
              <div className="session-col-label">T</div>
              <div className="session-col-label">W</div>
              <div className="session-col-label">T</div>
              <div className="session-col-label">F</div>
              <div className="session-col-label">S</div>
              <div className="session-col-label">S</div>
            </div>
            <div className="session-grid">
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell" style={{ background: '#0f0f0f', borderRadius: '5px' }}></div>
              <div className="day-cell" style={{ background: '#0f0f0f', borderRadius: '5px' }}></div>
              <div className="day-cell day-win" style={{ background: 'rgba(34, 197, 94, 0.18)', border: '1px solid rgba(34, 197, 94, 0.25)' }}>+$126</div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell" style={{ background: '#0f0f0f', borderRadius: '5px' }}></div>
              <div className="day-cell" style={{ background: '#0f0f0f', borderRadius: '5px' }}></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell" style={{ background: '#0f0f0f', borderRadius: '5px' }}></div>
              <div className="day-cell" style={{ background: '#0f0f0f', borderRadius: '5px' }}></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell" style={{ background: '#0f0f0f', borderRadius: '5px' }}></div>
              <div className="day-cell" style={{ background: '#0f0f0f', borderRadius: '5px' }}></div>
              <div className="day-cell day-loss" style={{ background: 'rgba(239, 68, 68, 0.18)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>-$90</div>
              <div className="day-cell day-win" style={{ background: 'rgba(34, 197, 94, 0.18)', border: '1px solid rgba(34, 197, 94, 0.25)' }}>+$160</div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell" style={{ background: '#0f0f0f', borderRadius: '5px' }}></div>
              <div className="day-cell" style={{ background: '#0f0f0f', borderRadius: '5px' }}></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell day-empty"></div>
              <div className="day-cell" style={{ background: '#0f0f0f', borderRadius: '5px' }}></div>
              <div className="day-cell" style={{ background: '#0f0f0f', borderRadius: '5px' }}></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', fontSize: '10px', color: '#555' }}>
              <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(34,197,94,0.3)', marginRight: '4px' }}></span>Win</span>
              <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(239,68,68,0.3)', marginRight: '4px' }}></span>Loss</span>
              <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', background: '#161616', marginRight: '4px' }}></span>No trade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhoenixDashboard
