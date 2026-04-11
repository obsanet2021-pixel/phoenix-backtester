import React, { useState, useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

const PhoenixReports = () => {
  const [activeTab, setActiveTab] = useState('performance')
  const [dateRange, setDateRange] = useState('month')
  const [reportData, setReportData] = useState({
    totalTrades: 0,
    totalPnL: 0,
    winRate: 0,
    avgTrade: 0,
    bestMonth: { month: 'N/A', pnl: 0 },
    worstMonth: { month: 'N/A', pnl: 0 }
  })

  // Load report data from localStorage
  useEffect(() => {
    const loadReportData = () => {
      const allTrades = JSON.parse(localStorage.getItem('phoenixTrades') || '[]');
      
      const closedTrades = allTrades.filter(t => t.status === 'closed');
      const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const wins = closedTrades.filter(t => (t.pnl || 0) > 0);
      const winRate = closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0;
      const avgTrade = closedTrades.length > 0 ? totalPnL / closedTrades.length : 0;

      setReportData({
        totalTrades: allTrades.length,
        totalPnL,
        winRate,
        avgTrade,
        bestMonth: { month: 'Current', pnl: totalPnL },
        worstMonth: { month: 'N/A', pnl: 0 }
      });
    };

    loadReportData();
    const interval = setInterval(loadReportData, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartRefs = {
    performanceChart: useRef(null),
    winRateChart: useRef(null),
    profitChart: useRef(null),
    drawdownChart: useRef(null),
    monthlyChart: useRef(null),
    pairChart: useRef(null),
    sessionChart: useRef(null)
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
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Performance',
            data: [10000, 10500, 11200, 10196],
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
          ...baseOpts(v => '$' + v.toLocaleString()),
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ' Balance: $' + ctx.parsed.y.toLocaleString()
              }
            }
          }
        }
      })
    }

    // Win Rate Chart
    if (chartRefs.winRateChart.current && !chartInstances.current.winRateChart) {
      chartInstances.current.winRateChart = new Chart(chartRefs.winRateChart.current, {
        type: 'bar',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            data: [65, 58, 72, 62],
            backgroundColor: (ctx) => ctx.parsed.y >= 60 ? GREEN : RED,
            borderRadius: 4
          }]
        },
        options: {
          ...baseOpts(v => v + '%'),
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ' Win Rate: ' + ctx.parsed.y + '%'
              }
            }
          }
        }
      })
    }

    // Profit Chart
    if (chartRefs.profitChart.current && !chartInstances.current.profitChart) {
      chartInstances.current.profitChart = new Chart(chartRefs.profitChart.current, {
        type: 'bar',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            data: [500, 700, -1000, -1004],
            backgroundColor: (ctx) => ctx.parsed.y >= 0 ? GREEN : RED,
            borderRadius: 4
          }]
        },
        options: {
          ...baseOpts(v => '$' + v.toLocaleString()),
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ' P&L: $' + ctx.parsed.y.toLocaleString()
              }
            }
          }
        }
      })
    }

    // Monthly Performance
    if (chartRefs.monthlyChart.current && !chartInstances.current.monthlyChart) {
      chartInstances.current.monthlyChart = new Chart(chartRefs.monthlyChart.current, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [{
            label: 'Profit',
            data: [596, 826, 477, 875],
            backgroundColor: GREEN,
            borderRadius: 4
          }, {
            label: 'Loss',
            data: [0, 0, 0, 0],
            backgroundColor: RED,
            borderRadius: 4
          }]
        },
        options: {
          ...baseOpts(v => '$' + v.toLocaleString()),
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { color: '#fff', font: { size: 11 } }
            }
          }
        }
      })
    }

    // Pair Performance
    if (chartRefs.pairChart.current && !chartInstances.current.pairChart) {
      chartInstances.current.pairChart = new Chart(chartRefs.pairChart.current, {
        type: 'doughnut',
        data: {
          labels: ['XAU/USD', 'EUR/USD', 'GBP/USD', 'USD/JPY'],
          datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: [ORANGE, TEAL, GREEN, RED],
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

    // Session Performance
    if (chartRefs.sessionChart.current && !chartInstances.current.sessionChart) {
      chartInstances.current.sessionChart = new Chart(chartRefs.sessionChart.current, {
        type: 'radar',
        data: {
          labels: ['London', 'New York', 'Asian', 'Sydney'],
          datasets: [{
            label: 'Profit',
            data: [85, 60, 30, 15],
            backgroundColor: 'rgba(255,107,0,0.2)',
            borderColor: ORANGE,
            borderWidth: 2,
            pointBackgroundColor: ORANGE,
            pointRadius: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            r: {
              grid: { color: GRID },
              ticks: { display: false },
              angleLines: { color: '#2a2a2a' },
              pointLabels: { color: '#666', font: { size: 10 } }
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

  const performanceData = [
    { metric: 'Total Return', value: '+1.96%', status: 'positive' },
    { metric: 'Win Rate', value: '62.2%', status: 'positive' },
    { metric: 'Profit Factor', value: '1.85', status: 'positive' },
    { metric: 'Max Drawdown', value: '-8.4%', status: 'negative' },
    { metric: 'Sharpe Ratio', value: '1.24', status: 'positive' },
    { metric: 'Avg Trade', value: '$44.21', status: 'positive' }
  ]

  const tradeData = [
    { date: '2025-01-08', pair: 'XAU/USD', type: 'BUY', entry: 2025.50, exit: 2026.72, pnl: '+$126.00', duration: '1h 26m' },
    { date: '2025-01-05', pair: 'XAU/USD', type: 'SELL', entry: 2030.25, exit: 2029.75, pnl: '-$50.00', duration: '34m' },
    { date: '2025-01-05', pair: 'XAU/USD', type: 'BUY', entry: 2024.10, exit: 2025.70, pnl: '+$160.92', duration: '2h 15m' },
    { date: '2025-01-02', pair: 'XAU/USD', type: 'BUY', entry: 2028.90, exit: 2027.50, pnl: '-$40.00', duration: '45m' },
    { date: '2025-01-02', pair: 'XAU/USD', type: 'SELL', entry: 2035.00, exit: 2033.50, pnl: '+$75.00', duration: '1h 10m' }
  ]

  const renderTab = () => {
    switch (activeTab) {
      case 'performance':
        return (
          <div>
            <div className="overview-grid">
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Performance Summary</div>
                  <div className="ov-badge neutral">Last 30 Days</div>
                </div>
                {performanceData.map((item, index) => (
                  <div key={index} className="ov-row">
                    <div className="ov-key">{item.metric}</div>
                    <div className={`ov-val ${item.status === 'positive' ? 'green' : 'red'}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Trading Statistics</div>
                  <div className="ov-badge win">Active</div>
                </div>
                <div className="ov-row"><div className="ov-key">Total Trades</div><div className="ov-val">258</div></div>
                <div className="ov-row"><div className="ov-key">Winning Trades</div><div className="ov-val green">156</div></div>
                <div className="ov-row"><div className="ov-key">Losing Trades</div><div className="ov-val red">102</div></div>
                <div className="ov-row"><div className="ov-key">Average Win</div><div className="ov-val green">$127.30</div></div>
                <div className="ov-row"><div className="ov-key">Average Loss</div><div className="ov-val red">$57.00</div></div>
                <div className="ov-row"><div className="ov-key">Largest Win</div><div className="ov-val green">$500.00</div></div>
                <div className="ov-row"><div className="ov-key">Largest Loss</div><div className="ov-val red">$150.00</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Risk Metrics</div>
                  <div className="ov-badge lose">Monitor</div>
                </div>
                <div className="ov-row"><div className="ov-key">Max Drawdown</div><div className="ov-val red">8.4%</div></div>
                <div className="ov-row"><div className="ov-key">Avg Drawdown</div><div className="ov-val">2.1%</div></div>
                <div className="ov-row"><div className="ov-key">Recovery Time</div><div className="ov-val">3.2 days</div></div>
                <div className="ov-row"><div className="ov-key">Daily VaR (95%)</div><div className="ov-val">$320</div></div>
                <div className="ov-row"><div className="ov-key">Position Size</div><div className="ov-val">2.0%</div></div>
                <div className="ov-row"><div className="ov-key">Leverage</div><div className="ov-val">10:1</div></div>
                <div className="ov-row"><div className="ov-key">Risk/Reward</div><div className="ov-val green">1:1.8</div></div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Performance Trend</div>
                  <div className="chart-tabs">
                    <div className="ctab">Daily</div>
                    <div className="ctab active">Weekly</div>
                    <div className="ctab">Monthly</div>
                  </div>
                </div>
                <div style={{ position: 'relative', height: '200px' }}>
                  <canvas ref={chartRefs.performanceChart}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Win Rate Analysis</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>Target: 60%</div>
                </div>
                <div style={{ position: 'relative', height: '200px' }}>
                  <canvas ref={chartRefs.winRateChart}></canvas>
                </div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Weekly P&L</div>
                  <div style={{ fontSize: '11px', color: GREEN }}>Total: +$196</div>
                </div>
                <div style={{ position: 'relative', height: '180px' }}>
                  <canvas ref={chartRefs.profitChart}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Monthly Performance</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>YTD: +48.68%</div>
                </div>
                <div style={{ position: 'relative', height: '180px' }}>
                  <canvas ref={chartRefs.monthlyChart}></canvas>
                </div>
              </div>
            </div>
          </div>
        )

      case 'trades':
        return (
          <div>
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">Recent Trades</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                    style={{ 
                      background: '#0a0a0a', 
                      border: '1px solid #2a2a2a', 
                      color: '#fff', 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '11px' 
                    }}
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                  </select>
                  <button className="btn-outline">Export CSV</button>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th style={{ color: '#444', textAlign: 'left', padding: '8px', borderBottom: '1px solid #1a1a1a' }}>Date</th>
                      <th style={{ color: '#444', textAlign: 'left', padding: '8px', borderBottom: '1px solid #1a1a1a' }}>Pair</th>
                      <th style={{ color: '#444', textAlign: 'left', padding: '8px', borderBottom: '1px solid #1a1a1a' }}>Type</th>
                      <th style={{ color: '#444', textAlign: 'right', padding: '8px', borderBottom: '1px solid #1a1a1a' }}>Entry</th>
                      <th style={{ color: '#444', textAlign: 'right', padding: '8px', borderBottom: '1px solid #1a1a1a' }}>Exit</th>
                      <th style={{ color: '#444', textAlign: 'right', padding: '8px', borderBottom: '1px solid #1a1a1a' }}>P&L</th>
                      <th style={{ color: '#444', textAlign: 'right', padding: '8px', borderBottom: '1px solid #1a1a1a' }}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeData.map((trade, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #141414' }}>
                        <td style={{ padding: '8px', color: '#aaa' }}>{trade.date}</td>
                        <td style={{ padding: '8px', color: '#ddd' }}>{trade.pair}</td>
                        <td style={{ padding: '8px' }}>
                          <span className={`badge ${trade.type.toLowerCase()}`}>
                            {trade.type}
                          </span>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', color: '#ddd' }}>{trade.entry}</td>
                        <td style={{ padding: '8px', textAlign: 'right', color: '#ddd' }}>{trade.exit}</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: '600', color: trade.pnl.startsWith('+') ? GREEN : RED }}>
                          {trade.pnl}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', color: '#666' }}>{trade.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="chart-row" style={{ marginTop: '20px' }}>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Trade Distribution by Pair</div>
                </div>
                <div style={{ position: 'relative', height: '250px' }}>
                  <canvas ref={chartRefs.pairChart}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Session Performance</div>
                </div>
                <div style={{ position: 'relative', height: '250px' }}>
                  <canvas ref={chartRefs.sessionChart}></canvas>
                </div>
              </div>
            </div>
          </div>
        )

      case 'analysis':
        return (
          <div>
            <div className="overview-grid">
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Trading Patterns</div>
                  <div className="ov-badge neutral">AI Analysis</div>
                </div>
                <div className="ov-row"><div className="ov-key">Best Day</div><div className="ov-val green">Wednesday</div></div>
                <div className="ov-row"><div className="ov-key">Best Hour</div><div className="ov-val green">16:00</div></div>
                <div className="ov-row"><div className="ov-key">Avg Trade Duration</div><div className="ov-val">1h 6m</div></div>
                <div className="ov-row"><div className="ov-key">Most Active Pair</div><div className="ov-val">XAU/USD</div></div>
                <div className="ov-row"><div className="ov-key">Peak Trading Time</div><div className="ov-val">14:00-16:00</div></div>
                <div className="ov-row"><div className="ov-key">Consecutive Wins</div><div className="ov-val green">13</div></div>
                <div className="ov-row"><div className="ov-key">Consecutive Losses</div><div className="ov-val red">6</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Psychological Factors</div>
                  <div className="ov-badge win">Healthy</div>
                </div>
                <div className="ov-row"><div className="ov-key">Revenge Trading</div><div className="ov-val green">Low</div></div>
                <div className="ov-row"><div className="ov-key">Overtrading</div><div className="ov-val green">Controlled</div></div>
                <div className="ov-row"><div className="ov-key">Risk Management</div><div className="ov-val green">Excellent</div></div>
                <div className="ov-row"><div className="ov-key">Patience Score</div><div className="ov-val">8.2/10</div></div>
                <div className="ov-row"><div className="ov-key">Discipline</div><div className="ov-val green">High</div></div>
                <div className="ov-row"><div className="ov-key">Emotional Control</div><div className="ov-val green">Stable</div></div>
                <div className="ov-row"><div className="ov-key">Confidence Level</div><div className="ov-val">7.8/10</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Improvement Areas</div>
                  <div className="ov-badge lose">Action Needed</div>
                </div>
                <div className="ov-row"><div className="ov-key">Early Exits</div><div className="ov-val red">23%</div></div>
                <div className="ov-row"><div className="ov-key">Missed Opportunities</div><div className="ov-val red">17</div></div>
                <div className="ov-row"><div className="ov-key">Risk Per Trade</div><div className="ov-val red">2.8%</div></div>
                <div className="ov-row"><div className="ov-key">Weekend Gaps</div><div className="ov-val red">4 losses</div></div>
                <div className="ov-row"><div className="ov-key">News Trading</div><div className="ov-val">Avoid</div></div>
                <div className="ov-row"><div className="ov-key">Session End</div><div className="ov-val red">Weak</div></div>
                <div className="ov-row"><div className="ov-key">Friday Performance</div><div className="ov-val red">-2.1%</div></div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">AI Recommendations</div>
                <div style={{ fontSize: '11px', color: '#555' }}>Based on last 30 days</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '10px', border: '1px solid #2a2a2a' }}>
                  <h4 style={{ color: GREEN, marginBottom: '8px', fontSize: '14px' }}>Strengths</h4>
                  <ul style={{ color: '#aaa', fontSize: '12px', paddingLeft: '16px', margin: 0 }}>
                    <li>Excellent risk management</li>
                    <li>Consistent win rate above 60%</li>
                    <li>Strong session performance</li>
                    <li>Good emotional control</li>
                  </ul>
                </div>
                <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '10px', border: '1px solid #2a2a2a' }}>
                  <h4 style={{ color: RED, marginBottom: '8px', fontSize: '14px' }}>Areas to Improve</h4>
                  <ul style={{ color: '#aaa', fontSize: '12px', paddingLeft: '16px', margin: 0 }}>
                    <li>Reduce risk per trade to 2%</li>
                    <li>Avoid trading during news events</li>
                    <li>Improve Friday performance</li>
                    <li>Let winning trades run longer</li>
                  </ul>
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
          <div className="page-title">Reports</div>
          <div className="page-sub">Phoenix Challenge · Performance Analysis</div>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">{'\ud83d\udcc8'} Live Data</div>
          <button className="btn-outline">Generate PDF</button>
          <button className="btn-outline">Share Report</button>
        </div>
      </div>

      <div className="tab-bar">
        {['performance', 'trades', 'analysis'].map(tab => (
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
    </div>
  )
}

export default PhoenixReports
