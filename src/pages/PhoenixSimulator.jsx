import React, { useState, useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

const PhoenixSimulator = () => {
  const [activeTab, setActiveTab] = useState('live')
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationData, setSimulationData] = useState({
    balance: 10000,
    equity: 10000,
    trades: 0,
    winRate: 0,
    pnl: 0,
    drawdown: 0
  })

  const [scenarios, setScenarios] = useState([
    { id: 1, name: 'Bull Market', description: 'Strong uptrend conditions', winRate: 75, avgWin: 150, avgLoss: 50, volatility: 'medium', duration: '4h' },
    { id: 2, name: 'Bear Market', description: 'Strong downtrend conditions', winRate: 45, avgWin: 120, avgLoss: 80, volatility: 'high', duration: '3h' },
    { id: 3, name: 'Sideways Market', description: 'Range-bound conditions', winRate: 60, avgWin: 80, avgLoss: 60, volatility: 'low', duration: '6h' },
    { id: 4, name: 'High Volatility', description: 'News-driven volatility', winRate: 55, avgWin: 200, avgLoss: 100, volatility: 'high', duration: '2h' },
    { id: 5, name: 'Low Volatility', description: 'Calm market conditions', winRate: 65, avgWin: 60, avgLoss: 40, volatility: 'low', duration: '8h' }
  ])

  const [selectedScenario, setSelectedScenario] = useState(null)
  const [simulationHistory, setSimulationHistory] = useState([])

  // Load simulation data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('phoenixSimulatorData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setSimulationData(data.simulationData || simulationData);
      setSimulationHistory(data.simulationHistory || []);
    }
  }, []);

  // Save simulation data to localStorage
  useEffect(() => {
    const data = {
      simulationData,
      simulationHistory,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('phoenixSimulatorData', JSON.stringify(data));
  }, [simulationData, simulationHistory]);

  const chartRefs = {
    equityChart: useRef(null),
    pnlChart: useRef(null),
    distributionChart: useRef(null),
    performanceChart: useRef(null)
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
    // Equity Chart
    if (chartRefs.equityChart.current && !chartInstances.current.equityChart) {
      chartInstances.current.equityChart = new Chart(chartRefs.equityChart.current, {
        type: 'line',
        data: {
          labels: ['Start', '15m', '30m', '45m', '1h', '1h15m', '1h30m', '1h45m', '2h'],
          datasets: [{
            label: 'Equity Curve',
            data: [10000, 10150, 10080, 10220, 10190, 10350, 10280, 10420, 10380],
            borderColor: ORANGE,
            borderWidth: 2,
            pointRadius: 3,
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
                label: ctx => ' Equity: $' + ctx.parsed.y.toLocaleString()
              }
            }
          }
        }
      })
    }

    // P&L Chart
    if (chartRefs.pnlChart.current && !chartInstances.current.pnlChart) {
      chartInstances.current.pnlChart = new Chart(chartRefs.pnlChart.current, {
        type: 'bar',
        data: {
          labels: ['Trade 1', 'Trade 2', 'Trade 3', 'Trade 4', 'Trade 5', 'Trade 6', 'Trade 7', 'Trade 8'],
          datasets: [{
            label: 'Trade P&L',
            data: [150, -70, 140, -60, 160, -80, 140, -40],
            backgroundColor: (ctx) => ctx.parsed.y >= 0 ? GREEN : RED,
            borderRadius: 4
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
        type: 'doughnut',
        data: {
          labels: ['Winning Trades', 'Losing Trades'],
          datasets: [{
            data: [60, 40],
            backgroundColor: [GREEN, RED],
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

    // Performance Chart
    if (chartRefs.performanceChart.current && !chartInstances.current.performanceChart) {
      chartInstances.current.performanceChart = new Chart(chartRefs.performanceChart.current, {
        type: 'radar',
        data: {
          labels: ['Win Rate', 'Risk/Reward', 'Discipline', 'Patience', 'Analysis', 'Execution'],
          datasets: [{
            label: 'Performance Metrics',
            data: [75, 85, 70, 80, 90, 75],
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

  const startSimulation = (scenario) => {
    setSelectedScenario(scenario)
    setIsSimulating(true)
    
    // Simulate trading progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      
      setSimulationData(prev => ({
        ...prev,
        balance: prev.balance + (Math.random() - 0.3) * 100,
        equity: prev.equity + (Math.random() - 0.3) * 100,
        trades: prev.trades + Math.floor(Math.random() * 3),
        winRate: 45 + Math.random() * 30,
        pnl: prev.pnl + (Math.random() - 0.3) * 50,
        drawdown: Math.max(0, prev.drawdown + (Math.random() - 0.7) * 2)
      }))

      if (progress >= 100) {
        clearInterval(interval)
        setIsSimulating(false)
        setSimulationHistory(prev => [...prev, {
          ...scenario,
          completedAt: new Date().toLocaleString(),
          finalBalance: simulationData.balance,
          totalTrades: simulationData.trades,
          winRate: simulationData.winRate,
          totalPnL: simulationData.pnl
        }])
      }
    }, 500)
  }

  const stopSimulation = () => {
    setIsSimulating(false)
    setSelectedScenario(null)
  }

  const ScenarioCard = ({ scenario }) => {
    const volatilityColors = {
      low: GREEN,
      medium: ORANGE,
      high: RED
    }

    return (
      <div className="scenario-card">
        <div className="scenario-header">
          <div className="scenario-title">{scenario.name}</div>
          <div className="scenario-duration">{scenario.duration}</div>
        </div>
        <div className="scenario-description">{scenario.description}</div>
        <div className="scenario-stats">
          <div className="scenario-stat">
            <div className="stat-label">Win Rate</div>
            <div className="stat-value">{scenario.winRate}%</div>
          </div>
          <div className="scenario-stat">
            <div className="stat-label">Avg Win</div>
            <div className="stat-value green">${scenario.avgWin}</div>
          </div>
          <div className="scenario-stat">
            <div className="stat-label">Avg Loss</div>
            <div className="stat-value red">${scenario.avgLoss}</div>
          </div>
          <div className="scenario-stat">
            <div className="stat-label">Volatility</div>
            <div className="stat-value" style={{ color: volatilityColors[scenario.volatility] }}>
              {scenario.volatility}
            </div>
          </div>
        </div>
        <div className="scenario-actions">
          <button 
            className="scenario-btn"
            onClick={() => startSimulation(scenario)}
            disabled={isSimulating}
          >
            {isSimulating && selectedScenario?.id === scenario.id ? 'Running...' : 'Start Simulation'}
          </button>
        </div>
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'live':
        return (
          <div>
            {isSimulating && (
              <div className="simulation-banner">
                <div className="simulation-info">
                  <h3>Simulation Running: {selectedScenario?.name}</h3>
                  <div className="simulation-stats">
                    <div className="sim-stat">
                      <span className="sim-label">Balance:</span>
                      <span className="sim-value">${simulationData.balance.toFixed(2)}</span>
                    </div>
                    <div className="sim-stat">
                      <span className="sim-label">Trades:</span>
                      <span className="sim-value">{simulationData.trades}</span>
                    </div>
                    <div className="sim-stat">
                      <span className="sim-label">Win Rate:</span>
                      <span className="sim-value">{simulationData.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="sim-stat">
                      <span className="sim-label">P&L:</span>
                      <span className={`sim-value ${simulationData.pnl >= 0 ? 'positive' : 'negative'}`}>
                        ${simulationData.pnl.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="stop-btn" onClick={stopSimulation}>Stop Simulation</button>
              </div>
            )}

            <div className="scenarios-grid">
              {scenarios.map(scenario => (
                <ScenarioCard key={scenario.id} scenario={scenario} />
              ))}
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div>
            <div className="overview-grid">
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Simulation Performance</div>
                  <div className="ov-badge win">Active</div>
                </div>
                <div className="ov-row"><div className="ov-key">Total Simulations</div><div className="ov-val">{simulationHistory.length}</div></div>
                <div className="ov-row"><div className="ov-key">Avg Win Rate</div><div className="ov-val green">62.3%</div></div>
                <div className="ov-row"><div className="ov-key">Best Scenario</div><div className="ov-val">Bull Market</div></div>
                <div className="ov-row"><div className="ov-key">Worst Scenario</div><div className="ov-val red">Bear Market</div></div>
                <div className="ov-row"><div className="ov-key">Avg P&L</div><div className="ov-val green">+$245</div></div>
                <div className="ov-row"><div className="ov-key">Max Drawdown</div><div className="ov-val red">-8.2%</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Risk Analysis</div>
                  <div className="ov-badge neutral">Analysis</div>
                </div>
                <div className="ov-row"><div className="ov-key">Risk/Reward</div><div className="ov-val green">1:2.1</div></div>
                <div className="ov-row"><div className="ov-key">Sharpe Ratio</div><div className="ov-val">1.45</div></div>
                <div className="ov-row"><div className="ov-key">Max Consecutive Losses</div><div className="ov-val red">4</div></div>
                <div className="ov-row"><div className="ov-key">Max Consecutive Wins</div><div className="ov-val green">8</div></div>
                <div className="ov-row"><div className="ov-key">Volatility Score</div><div className="ov-val">Medium</div></div>
                <div className="ov-row"><div className="ov-key">Recovery Time</div><div className="ov-val">2.3 days</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Strategy Insights</div>
                  <div className="ov-badge win">Optimized</div>
                </div>
                <div className="ov-row"><div className="ov-key">Best Market</div><div className="ov-val green">Uptrend</div></div>
                <div className="ov-row"><div className="ov-key">Worst Market</div><div className="ov-val red">Downtrend</div></div>
                <div className="ov-row"><div className="ov-key">Optimal Time</div><div className="ov-val">14:00-16:00</div></div>
                <div className="ov-row"><div className="ov-key">Recommended Pairs</div><div className="ov-val">XAU/USD, EUR/USD</div></div>
                <div className="ov-row"><div className="ov-key">Position Size</div><div className="ov-val">2.0%</div></div>
                <div className="ov-row"><div className="ov-key">Stop Distance</div><div className="ov-val">25 pips</div></div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Equity Curve</div>
                  <div style={{ fontSize: '11px', color: GREEN }}>+$380 P&L</div>
                </div>
                <div style={{ position: 'relative', height: '200px' }}>
                  <canvas ref={chartRefs.equityChart}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Trade Distribution</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>8 trades</div>
                </div>
                <div style={{ position: 'relative', height: '200px' }}>
                  <canvas ref={chartRefs.pnlChart}></canvas>
                </div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Win/Loss Ratio</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>60% win rate</div>
                </div>
                <div style={{ position: 'relative', height: '250px' }}>
                  <canvas ref={chartRefs.distributionChart}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Performance Metrics</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>Overall score</div>
                </div>
                <div style={{ position: 'relative', height: '250px' }}>
                  <canvas ref={chartRefs.performanceChart}></canvas>
                </div>
              </div>
            </div>
          </div>
        )

      case 'history':
        return (
          <div>
            <div className="trades-header">
              <h3>Simulation History ({simulationHistory.length})</h3>
              <div className="trades-actions">
                <button className="btn-outline" onClick={() => {
                  setSimulationHistory([]);
                  localStorage.setItem('phoenixSimulatorData', JSON.stringify({
                    simulationData,
                    simulationHistory: [],
                    timestamp: new Date().toISOString()
                  }));
                }}>Clear History</button>
                <button className="btn-outline" onClick={() => {
                  const dataStr = JSON.stringify(simulationHistory, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'simulation-history.json';
                  link.click();
                }}>Export Data</button>
              </div>
            </div>

            <div className="trades-table-container">
              <table className="trades-table">
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Completed</th>
                    <th>Duration</th>
                    <th>Final Balance</th>
                    <th>Total Trades</th>
                    <th>Win Rate</th>
                    <th>Total P&L</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {simulationHistory.map((sim) => (
                    <tr key={sim.id} className="trade-row">
                      <td className="trade-cell">{sim.name}</td>
                      <td className="trade-cell">{sim.completedAt}</td>
                      <td className="trade-cell">{sim.duration}</td>
                      <td className="trade-cell trade-number">${sim.finalBalance.toFixed(2)}</td>
                      <td className="trade-cell">{sim.totalTrades}</td>
                      <td className="trade-cell">{sim.winRate.toFixed(1)}%</td>
                      <td className="trade-cell">
                        <span className={`trade-pnl ${sim.totalPnL >= 0 ? 'positive' : 'negative'}`}>
                          ${sim.totalPnL.toFixed(2)}
                        </span>
                      </td>
                      <td className="trade-cell">
                        <div className="trade-actions">
                          <button className="trade-btn" title="View Details">{'\ud83d\udcca'}</button>
                          <button className="trade-btn" title="Replay">{'\u25b6'}</button>
                          <button className="trade-btn" title="Delete">{'\ud83d\uddd1\ufe0f'}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {simulationHistory.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">{'\ud83d\udd2e'}</div>
                <h3>No Simulation History</h3>
                <p>Run your first simulation to see results here</p>
                <button 
                  className="btn-primary"
                  onClick={() => setActiveTab('live')}
                >
                  Start First Simulation
                </button>
              </div>
            )}
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
          <div className="page-title">Simulator</div>
          <div className="page-sub">Phoenix Challenge · Market Simulation</div>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">{'\ud83d\udd2e'} {simulationHistory.length} completed</div>
          <button className="btn-new">Custom Scenario</button>
        </div>
      </div>

      <div className="tab-bar">
        {['live', 'analytics', 'history'].map(tab => (
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

export default PhoenixSimulator
