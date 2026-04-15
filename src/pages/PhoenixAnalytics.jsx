import React, { useState, useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

const PhoenixAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [chartTimeframe, setChartTimeframe] = useState('30 Min')
  const [dayChartMode, setDayChartMode] = useState('Total')
  const [monthChartMode, setMonthChartMode] = useState('All')
  const [analyticsData, setAnalyticsData] = useState({
    totalTrades: 0,
    winRate: 0,
    totalPnL: 0,
    avgWin: 0,
    avgLoss: 0,
    bestTrade: 0,
    worstTrade: 0,
    profitFactor: 0
  })

  // Load analytics data from localStorage
  useEffect(() => {
    const loadAnalytics = () => {
      const allTrades = JSON.parse(localStorage.getItem('phoenixTrades') || '[]');
      
      const closedTrades = allTrades.filter(t => t.status === 'closed');
      const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const wins = closedTrades.filter(t => (t.pnl || 0) > 0);
      const losses = closedTrades.filter(t => (t.pnl || 0) < 0);
      
      const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0;
      const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0)) / losses.length : 0;
      const bestTrade = closedTrades.length > 0 ? Math.max(...closedTrades.map(t => t.pnl || 0)) : 0;
      const worstTrade = closedTrades.length > 0 ? Math.min(...closedTrades.map(t => t.pnl || 0)) : 0;
      const profitFactor = avgLoss > 0 ? (avgWin * wins.length) / (avgLoss * losses.length) : 0;
      
      setAnalyticsData({
        totalTrades: allTrades.length,
        winRate: closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0,
        totalPnL,
        avgWin,
        avgLoss,
        bestTrade,
        worstTrade,
        profitFactor
      });
    };

    loadAnalytics();
    const interval = setInterval(loadAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartRefs = {
    plTime: useRef(null),
    plDay: useRef(null),
    scatter: useRef(null),
    distDay: useRef(null),
    sess1: useRef(null),
    sess2: useRef(null),
    sess3: useRef(null),
    sess4: useRef(null),
    ddSpark1: useRef(null),
    ddSpark2: useRef(null),
    ddSpark3: useRef(null),
    bestTime: useRef(null),
    mcChart: useRef(null),
    ddChart: useRef(null),
    ddDistChart: useRef(null),
    recoveryChart: useRef(null)
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
    // P&L by Time
    if (chartRefs.plTime.current && !chartInstances.current.plTime) {
      chartInstances.current.plTime = new Chart(chartRefs.plTime.current, {
        type: 'bar',
        data: {
          labels: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
          datasets: [{
            data: [9204, 393, 17347, 17259, 19977, 19298, 9324, 7313, 19999, 20288],
            backgroundColor: ORANGE,
            borderRadius: 4
          }]
        },
        options: {
          ...baseOpts(v => '$' + (v/1000).toFixed(0) + 'k'),
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ' $' + ctx.parsed.y.toLocaleString()
              }
            }
          }
        }
      })
    }

    // P&L by Day
    if (chartRefs.plDay.current && !chartInstances.current.plDay) {
      chartInstances.current.plDay = new Chart(chartRefs.plDay.current, {
        type: 'bar',
        data: {
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          datasets: [{
            data: [0, 36000, 27000, 18000, 25000, 33000, 0],
            backgroundColor: [GRID, GREEN, GREEN, GREEN, GREEN, GREEN, GRID],
            borderRadius: 4
          }]
        },
        options: {
          ...baseOpts(v => '$' + (v/1000).toFixed(0) + 'k'),
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ' $' + ctx.parsed.y.toLocaleString()
              }
            }
          }
        }
      })
    }

    // Scatter Chart
    if (chartRefs.scatter.current && !chartInstances.current.scatter) {
      const scatterData = []
      for (let i = 0; i < 160; i++) scatterData.push({ x: Math.random() * 160, y: Math.random() * 2800 + 50 })
      for (let i = 0; i < 100; i++) scatterData.push({ x: Math.random() * 90, y: -(Math.random() * 1400 + 50) })
      
      chartInstances.current.scatter = new Chart(chartRefs.scatter.current, {
        type: 'scatter',
        data: {
          datasets: [
            { data: scatterData.filter(d => d.y > 0), backgroundColor: 'rgba(34,197,94,0.5)', pointRadius: 3 },
            { data: scatterData.filter(d => d.y < 0), backgroundColor: 'rgba(239,68,68,0.5)', pointRadius: 3 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 }, callback: v => v + 'm' } },
            y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 }, callback: v => '$' + v } }
          }
        }
      })
    }

    // Distribution by Day
    if (chartRefs.distDay.current && !chartInstances.current.distDay) {
      chartInstances.current.distDay = new Chart(chartRefs.distDay.current, {
        type: 'bar',
        data: {
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          datasets: [{
            data: [0, 55, 48, 50, 52, 45, 0],
            backgroundColor: TEAL,
            borderRadius: 4
          }]
        },
        options: {
          ...baseOpts(v => v),
          plugins: { legend: { display: false } }
        }
      })
    }

    // Session Radars
    const makeRadar = (id, data, color) => {
      if (chartRefs[id].current && !chartInstances.current[id]) {
        chartInstances.current[id] = new Chart(chartRefs[id].current, {
          type: 'radar',
          data: {
            labels: ['Ldn', 'Ny', 'Other'],
            datasets: [{
              data,
              backgroundColor: color + '22',
              borderColor: color,
              borderWidth: 2,
              pointBackgroundColor: color,
              pointRadius: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
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
    }

    makeRadar('sess1', [85, 60, 30], ORANGE)
    makeRadar('sess2', [72, 55, 40], TEAL)
    makeRadar('sess3', [90, 70, 35], GREEN)
    makeRadar('sess4', [80, 65, 45], '#3b82f6')

    // Sparklines
    const makeSpark = (id, color) => {
      if (chartRefs[id].current && !chartInstances.current[id]) {
        const d = Array.from({length: 40}, () => Math.random() * 80 + 10)
        chartInstances.current[id] = new Chart(chartRefs[id].current, {
          type: 'line',
          data: {
            labels: d.map((_, i) => i),
            datasets: [{
              data: d,
              borderColor: color,
              borderWidth: 1.5,
              pointRadius: 0,
              fill: true,
              backgroundColor: color + '15',
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }
            },
            scales: {
              x: { display: false },
              y: { display: false }
            },
            animation: false
          }
        })
      }
    }

    makeSpark('ddSpark1', TEAL)
    makeSpark('ddSpark2', TEAL)
    makeSpark('ddSpark3', TEAL)

    // Best time chart
    if (chartRefs.bestTime.current && !chartInstances.current.bestTime) {
      chartInstances.current.bestTime = new Chart(chartRefs.bestTime.current, {
        type: 'bar',
        data: {
          labels: ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16'],
          datasets: [{
            data: [9204, 393, 17347, 17259, 19977, 19298, 9324, 7313, 19999, 20288],
            backgroundColor: (ctx) => ctx.parsed.y === 20288 ? ORANGE : '#1e3a2f',
            borderRadius: 4
          }]
        },
        options: {
          ...baseOpts(v => '$' + (v/1000).toFixed(0) + 'k'),
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ' $' + ctx.parsed.y.toLocaleString()
              }
            }
          }
        }
      })
    }

    // Drawdown charts
    if (chartRefs.ddChart.current && !chartInstances.current.ddChart) {
      const ddLabels = Array.from({length: 50}, (_, i) => 'T' + i)
      const ddVals = [0,-0.5,-1.2,-0.8,-2.1,-3.4,-2.8,-1.9,-4.2,-5.1,-4.8,-3.2,-2.1,-1.4,-2.8,-4.1,-5.8,-6.2,-5.9,-4.4,-3.1,-2.0,-1.2,-2.4,-3.8,-5.2,-6.8,-7.1,-6.4,-5.8,-4.2,-3.1,-2.4,-3.8,-5.1,-6.4,-7.8,-8.0,-7.2,-6.1,-5.0,-3.8,-2.4,-1.8,-2.1,-3.4,-2.8,-1.9,-1.2,-0.5]
      
      chartInstances.current.ddChart = new Chart(chartRefs.ddChart.current, {
        type: 'line',
        data: {
          labels: ddLabels,
          datasets: [{
            data: ddVals,
            borderColor: RED,
            borderWidth: 2,
            fill: true,
            backgroundColor: 'rgba(239,68,68,0.1)',
            pointRadius: 0,
            tension: 0.4
          }]
        },
        options: {
          ...baseOpts(v => v + '%'),
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
            y: {
              grid: { color: GRID },
              ticks: { color: TICK, font: { size: 10 }, callback: v => v + '%' },
              max: 1
            }
          }
        }
      })
    }

    if (chartRefs.ddDistChart.current && !chartInstances.current.ddDistChart) {
      chartInstances.current.ddDistChart = new Chart(chartRefs.ddDistChart.current, {
        type: 'bar',
        data: {
          labels: ['0-1%', '1-2%', '2-3%', '3-4%', '4-5%', '5-6%', '6-7%', '7-8%', '8%+'],
          datasets: [{
            data: [12, 18, 15, 22, 19, 14, 8, 6, 4],
            backgroundColor: RED + '88',
            borderRadius: 4
          }]
        },
        options: {
          ...baseOpts(v => v),
          plugins: { legend: { display: false } }
        }
      })
    }

    if (chartRefs.recoveryChart.current && !chartInstances.current.recoveryChart) {
      chartInstances.current.recoveryChart = new Chart(chartRefs.recoveryChart.current, {
        type: 'bar',
        data: {
          labels: ['<1 day', '1-3 days', '3-7 days', '1-2 wks', '2-4 wks', '1+ mo'],
          datasets: [{
            data: [18, 24, 20, 16, 12, 8],
            backgroundColor: ORANGE + '88',
            borderRadius: 4
          }]
        },
        options: {
          ...baseOpts(v => v + ' trades'),
          plugins: { legend: { display: false } }
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

  const timeData = [
    ['07:00', 24, '$9,204', '58%', '14W-10L'],
    ['08:00', 25, '$393', '40%', '10W-15L'],
    ['09:00', 30, '$17,347', '67%', '20W-10L'],
    ['10:00', 24, '$17,259', '63%', '15W-9L'],
    ['11:00', 29, '$19,977', '59%', '17W-12L'],
    ['12:00', 24, '$19,298', '67%', '16W-8L'],
    ['13:00', 21, '$9,324', '52%', '11W-10L'],
    ['14:00', 21, '$7,313', '71%', '15W-6L'],
    ['15:00', 35, '$19,999', '63%', '22W-13L'],
    ['16:00', 25, '$20,288', '64%', '16W-9L']
  ]

  const calData2024 = ['2024', '6.12%', '4.49%', '8.79%', '14.57%', '2.26%', '2.49%', '14.41%', '5.32%', '7.08%', '5.77%', '7.93%', '12.49%', '91.72%']
  const calData2025 = ['2025', '5.96%', '8.26%', '4.77%', '8.75%', '8.00%', '11.73%', '1.22%', '---', '---', '---', '---', '---', '48.68%']

  // Get real trade data from localStorage for calendar
  const [tradeDataByDay, setTradeDataByDay] = useState({})

  useEffect(() => {
    const allTrades = JSON.parse(localStorage.getItem('phoenixTrades') || '[]');
    const closedTrades = allTrades.filter(t => t.status === 'closed');
    
    // Group trades by date
    const dataByDay = {};
    closedTrades.forEach(trade => {
      if (trade.date) {
        const date = new Date(trade.date);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const key = `${month}-${day}`;
        
        if (!dataByDay[key]) {
          dataByDay[key] = 0;
        }
        dataByDay[key] += (trade.pnl || 0);
      }
    });
    
    setTradeDataByDay(dataByDay);
  }, []);

  const miniMonths = [
    { name: 'Jan 2025', days: 31, offset: 2 },
    { name: 'Feb 2025', days: 28, offset: 5 },
    { name: 'Mar 2025', days: 31, offset: 5 },
    { name: 'Apr 2025', days: 30, offset: 1 }
  ]

  const renderMiniCalendar = (month, mi) => {
    const days = []
    
    // Offset days
    for (let i = 0; i < month.offset; i++) {
      days.push(<div key={`empty-${i}`} style={{ height: '36px' }}></div>)
    }
    
    // Actual days
    for (let d = 1; d <= month.days; d++) {
      const key = (mi + 1) + '-' + d
      const v = tradeDataByDay[key]
      
      days.push(
        <div
          key={key}
          style={{
            height: '36px',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8px',
            fontWeight: '700',
            cursor: 'pointer',
            background: v !== undefined ? (v > 0 ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)') : '#141414',
            border: v !== undefined ? (v > 0 ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(239,68,68,0.25)') : 'none'
          }}
        >
          <div style={{ fontSize: '8px', color: '#444', marginBottom: '1px', fontWeight: '400' }}>{d}</div>
          {v !== undefined && (
            <div style={{ color: v > 0 ? GREEN : RED }}>
              {(v > 0 ? '+' : '') + v}
            </div>
          )}
        </div>
      )
    }
    
    return days
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <div className="overview-grid">
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Overview</div>
                </div>
                <div className="ov-row"><div className="ov-key">Total Trades</div><div className="ov-val">{analyticsData.totalTrades}</div></div>
                <div className="ov-row"><div className="ov-key">Win Rate</div><div className="ov-val">{analyticsData.winRate.toFixed(1)}%</div></div>
                <div className="ov-row"><div className="ov-key">Total P&L</div><div className="ov-val">${analyticsData.totalPnL.toFixed(2)}</div></div>
                <div className="ov-row"><div className="ov-key">Profit Factor</div><div className="ov-val">{analyticsData.profitFactor.toFixed(2)}</div></div>
                <div className="ov-row"><div className="ov-key">Average Win</div><div className="ov-val green">${analyticsData.avgWin.toFixed(2)}</div></div>
                <div className="ov-row"><div className="ov-key">Average Loss</div><div className="ov-val red">${analyticsData.avgLoss.toFixed(2)}</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Best/Worst Trades</div>
                </div>
                <div className="ov-row"><div className="ov-key">Best Trade</div><div className="ov-val green">${analyticsData.bestTrade.toFixed(2)}</div></div>
                <div className="ov-row"><div className="ov-key">Worst Trade</div><div className="ov-val red">${analyticsData.worstTrade.toFixed(2)}</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Trade Statistics</div>
                </div>
                <div className="ov-row"><div className="ov-key">Total Losers</div><div className="ov-val red">{analyticsData.totalTrades - Math.round(analyticsData.totalTrades * (analyticsData.winRate / 100))}</div></div>
                <div className="ov-row"><div className="ov-key">Avg Trade Duration</div><div className="ov-val">--</div></div>
                <div className="ov-row"><div className="ov-key">Avg Loss Streak</div><div className="ov-val">--</div></div>
                <div className="ov-row"><div className="ov-key">Max Loss Streak</div><div className="ov-val red">--</div></div>
                <div className="ov-row"><div className="ov-key">Average Loss</div><div className="ov-val red">{analyticsData.avgLoss.toFixed(2)}%</div></div>
                <div className="ov-row"><div className="ov-key">Worst Loss</div><div className="ov-val red">{analyticsData.worstTrade.toFixed(2)}%</div></div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">P&amp;L by Time</div>
                  <div className="chart-tabs">
                    {['30 Min', '1 Hour'].map(timeframe => (
                      <div
                        key={timeframe}
                        className={`ctab ${chartTimeframe === timeframe ? 'active' : ''}`}
                        onClick={() => setChartTimeframe(timeframe)}
                      >
                        {timeframe}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ position: 'relative', height: '180px' }}>
                  <canvas ref={chartRefs.plTime}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">P&amp;L by Day</div>
                  <div className="chart-tabs">
                    {['Separate', 'Total'].map(mode => (
                      <div
                        key={mode}
                        className={`ctab ${dayChartMode === mode ? 'active' : ''}`}
                        onClick={() => setDayChartMode(mode)}
                      >
                        {mode}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ position: 'relative', height: '180px' }}>
                  <canvas ref={chartRefs.plDay}></canvas>
                </div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Profit by Time Held</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>Green = win · Red = loss</div>
                </div>
                <div style={{ position: 'relative', height: '180px' }}>
                  <canvas ref={chartRefs.scatter}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Trade Distribution by Day</div>
                </div>
                <div style={{ position: 'relative', height: '180px' }}>
                  <canvas ref={chartRefs.distDay}></canvas>
                </div>
              </div>
            </div>

            <div className="session-row">
              <div className="session-card">
                <div className="session-label">Profit by Session</div>
                <div style={{ position: 'relative', height: '140px' }}>
                  <canvas ref={chartRefs.sess1}></canvas>
                </div>
              </div>
              <div className="session-card">
                <div className="session-label">Win Rate by Session</div>
                <div style={{ position: 'relative', height: '140px' }}>
                  <canvas ref={chartRefs.sess2}></canvas>
                </div>
              </div>
              <div className="session-card">
                <div className="session-label">Trades by Session</div>
                <div style={{ position: 'relative', height: '140px' }}>
                  <canvas ref={chartRefs.sess3}></canvas>
                </div>
              </div>
              <div className="session-card">
                <div className="session-label">Avg Profitable RR</div>
                <div style={{ position: 'relative', height: '140px' }}>
                  <canvas ref={chartRefs.sess4}></canvas>
                </div>
              </div>
            </div>
          </div>
        )

      case 'time':
        return (
          <div>
            <div className="drawdown-row">
              <div className="dd-box">
                <div className="dd-label">Drawdown Stats</div>
                <div className="dd-avg">Average: <span>0.3%</span></div>
                <div className="dd-bar-wrap"><div className="dd-range" style={{ left: '20%', width: '40%', background: TEAL }}></div></div>
                <div style={{ position: 'relative', height: '60px' }}>
                  <canvas ref={chartRefs.ddSpark1}></canvas>
                </div>
              </div>
              <div className="dd-box">
                <div className="dd-label">Max Potential Profit Stats</div>
                <div className="dd-avg">Average: <span>3.04%</span></div>
                <div className="dd-bar-wrap"><div className="dd-range" style={{ left: '30%', width: '35%', background: TEAL }}></div></div>
                <div style={{ position: 'relative', height: '60px' }}>
                  <canvas ref={chartRefs.ddSpark2}></canvas>
                </div>
              </div>
              <div className="dd-box">
                <div className="dd-label">Profitable RR Stats</div>
                <div className="dd-avg">Average: <span>1.27</span></div>
                <div className="dd-bar-wrap"><div className="dd-range" style={{ left: '25%', width: '50%', background: TEAL }}></div></div>
                <div style={{ position: 'relative', height: '60px' }}>
                  <canvas ref={chartRefs.ddSpark3}></canvas>
                </div>
              </div>
            </div>
            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Best Time · 16:00</div>
                  <div style={{ fontSize: '12px', color: GREEN, fontWeight: '700' }}>$20,288</div>
                </div>
                <div style={{ position: 'relative', height: '200px' }}>
                  <canvas ref={chartRefs.bestTime}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Time Overview</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>Total · Net Profits · Win Rate</div>
                </div>
                <div style={{ overflowX: 'auto', marginTop: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead>
                      <tr>
                        <th style={{ color: '#444', textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #1a1a1a' }}>Time</th>
                        <th style={{ color: '#444', textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid #1a1a1a' }}>Trades</th>
                        <th style={{ color: '#444', textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid #1a1a1a' }}>Net Profit</th>
                        <th style={{ color: '#444', textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid #1a1a1a' }}>Win Rate</th>
                        <th style={{ color: '#444', textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid #1a1a1a' }}>W-L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeData.map(([time, trades, profit, winRate, wl], index) => {
                        const wr_num = parseInt(winRate)
                        return (
                          <tr key={time} style={{ borderBottom: '1px solid #141414' }}>
                            <td style={{ padding: '8px', color: '#aaa' }}>{time}</td>
                            <td style={{ padding: '8px', textAlign: 'right', color: '#ddd' }}>{trades}</td>
                            <td style={{ padding: '8px', textAlign: 'right', color: GREEN }}>{profit}</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>
                              <span style={{ background: `rgba(34,197,94,${wr_num/100})`, color: GREEN, padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600' }}>
                                {winRate}
                              </span>
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', color: '#666' }}>{wl}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )

      case 'calendar':
        return (
          <div>
            <div className="month-card">
              <div className="chart-header">
                <div className="chart-title">Percentage Profit by Month</div>
                <div className="chart-tabs">
                  {['Percent', 'Profit', 'All'].map(mode => (
                    <div
                      key={mode}
                      className={`ctab ${monthChartMode === mode ? 'active' : ''}`}
                      onClick={() => setMonthChartMode(mode)}
                    >
                      {mode}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', minWidth: '700px' }}>
                  <thead>
                    <tr>
                      {['Year', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'YTD'].map(month => (
                        <th key={month} style={{ padding: '8px', fontSize: '10px', color: '#444', fontWeight: '500', textAlign: 'center', borderBottom: '1px solid #1a1a1a' }}>
                          {month}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[calData2024, calData2025].map((row, rowIndex) => (
                      <tr key={`cal-row-${rowIndex}`}>
                        {row.map((v, i) => {
                          const isPos = v.startsWith('+') || (v.includes('%') && !v.startsWith('---') && parseFloat(v) > 0)
                          const isDash = v === '---'
                          return (
                            <td key={i} style={{ padding: '8px', textAlign: 'center', fontSize: '11px', color: isDash ? '#333' : isPos ? GREEN : RED, fontWeight: i === 0 ? '600' : '500' }}>
                              {v}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="month-card">
              <div className="chart-header">
                <div className="chart-title">2025 Daily P&amp;L Calendar</div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '10px', color: '#555' }}>
                  <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(34,197,94,0.35)', marginRight: '4px' }}></span>Win</span>
                  <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(239,68,68,0.35)', marginRight: '4px' }}></span>Loss</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {miniMonths.map((month, mi) => (
                  <div key={mi}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>{month.name}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} style={{ fontSize: '9px', color: '#444', textAlign: 'center' }}>{day}</div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                      {renderMiniCalendar(month, mi)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'drawdown':
        return (
          <div>
            <div className="chart-row">
              <div className="chart-card full">
                <div className="chart-header">
                  <div className="chart-title">Drawdown Over Time</div>
                  <div style={{ fontSize: '11px', color: RED }}>Max: -8.0% · Avg: -2.1%</div>
                </div>
                <div style={{ position: 'relative', height: '220px' }}>
                  <canvas ref={chartRefs.ddChart}></canvas>
                </div>
              </div>
            </div>
            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Drawdown Distribution</div>
                </div>
                <div style={{ position: 'relative', height: '180px' }}>
                  <canvas ref={chartRefs.ddDistChart}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Recovery Analysis</div>
                </div>
                <div style={{ position: 'relative', height: '180px' }}>
                  <canvas ref={chartRefs.recoveryChart}></canvas>
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
          <div className="page-title">Analytics</div>
          <div className="page-sub">test2 · Casa AI calculating...</div>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">{'\ud83d\udd25'} 3 day streak</div>
          <button className="btn-outline" onClick={() => {
            const trades = JSON.parse(localStorage.getItem('phoenixTrades') || '[]');
            alert(`Filter options:\nTotal Trades: ${trades.length}\nWin Rate: ${analyticsData.winRate.toFixed(2)}%\nTotal P&L: $${analyticsData.totalPnL.toFixed(2)}`);
          }}>Filter</button>
          <button className="btn-outline" onClick={() => {
            const dataStr = JSON.stringify(analyticsData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'analytics-export.json';
            link.click();
          }}>Export</button>
        </div>
      </div>

      <div className="tab-bar">
        {['overview', 'time', 'calendar', 'montecarlo', 'drawdown'].map(tab => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
          </div>
        ))}
      </div>

      <div className="content">
        {renderTab()}
      </div>
    </div>
  )
}

export default PhoenixAnalytics
