import React, { useState, useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

const PhoenixJournal = () => {
  const [activeTab, setActiveTab] = useState('trades')
  const [entries, setEntries] = useState([])
  const [trades, setTrades] = useState([])
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [newTrade, setNewTrade] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    pair: 'GBP/USD',
    type: 'Buy',
    entry: '',
    exit: '',
    sl: '',
    tp: '',
    size: '',
    notes: '',
    mood: 'neutral'
  })
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Load trades from localStorage
  useEffect(() => {
    const savedTrades = localStorage.getItem('phoenixTrades');
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
  }, []);

  // Save trades to localStorage
  useEffect(() => {
    localStorage.setItem('phoenixTrades', JSON.stringify(trades));
  }, [trades]);

  const addTrade = () => {
    if (!newTrade.entry || !newTrade.size) {
      alert('Please fill in entry price and position size');
      return;
    }

    setIsLoading(true);
    
    const trade = {
      id: Date.now(),
      ...newTrade,
      pnl: newTrade.exit ? calculatePnL(newTrade) : 0,
      status: newTrade.exit ? 'closed' : 'open',
      timestamp: new Date().toISOString()
    };

    setTrades([trade, ...trades]);
    setNewTrade({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      pair: 'GBP/USD',
      type: 'Buy',
      entry: '',
      exit: '',
      sl: '',
      tp: '',
      size: '',
      notes: '',
      mood: 'neutral'
    });
    setShowNewEntry(false);
    setIsLoading(false);
  };

  const calculatePnL = (trade) => {
    const entry = parseFloat(trade.entry);
    const exit = parseFloat(trade.exit);
    const size = parseFloat(trade.size);
    const multiplier = trade.type === 'Buy' ? 1 : -1;
    return (exit - entry) * size * multiplier;
  };

  const deleteTrade = (tradeId) => {
    if (confirm('Are you sure you want to delete this trade?')) {
      setTrades(trades.filter(t => t.id !== tradeId));
    }
  };

  const editTrade = (tradeId) => {
    const trade = trades.find(t => t.id === tradeId);
    if (trade) {
      setNewTrade({
        ...trade,
        date: trade.date,
        time: trade.time
      });
      setShowNewEntry(true);
    }
  };

  const closeTrade = (tradeId) => {
    const trade = trades.find(t => t.id === tradeId);
    if (trade && !trade.exit) {
      const currentPrice = prompt('Enter exit price:', newTrade.entry);
      if (currentPrice) {
        const updatedTrades = trades.map(t => 
          t.id === tradeId 
            ? { ...t, exit: currentPrice, status: 'closed', pnl: calculatePnL({ ...t, exit: currentPrice }) }
            : t
        );
        setTrades(updatedTrades);
      }
    }
  };

  const exportJournal = () => {
    const data = {
      trades,
      entries,
      exportDate: new Date().toISOString(),
      summary: {
        totalTrades: trades.length,
        closedTrades: trades.filter(t => t.status === 'closed').length,
        openTrades: trades.filter(t => t.status === 'open').length,
        totalPnL: trades.filter(t => t.status === 'closed').reduce((sum, t) => sum + t.pnl, 0)
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phoenix-journal.json';
    a.click();
  };

  const filteredTrades = trades.filter(trade => {
    const matchesFilter = filter === 'all' || trade.status === filter;
    const matchesSearch = searchTerm === '' || 
      trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.notes.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const summary = {
    total: trades.length,
    open: trades.filter(t => t.status === 'open').length,
    closed: trades.filter(t => t.status === 'closed').length,
    pnl: trades.filter(t => t.status === 'closed').reduce((sum, t) => sum + t.pnl, 0),
    winRate: trades.filter(t => t.status === 'closed' && t.pnl > 0).length / Math.max(1, trades.filter(t => t.status === 'closed').length) * 100
  };

  const chartRefs = {
    moodChart: useRef(null),
    performanceChart: useRef(null),
    consistencyChart: useRef(null)
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
    // Mood Chart
    if (chartRefs.moodChart.current && !chartInstances.current.moodChart) {
      chartInstances.current.moodChart = new Chart(chartRefs.moodChart.current, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [{
            label: 'Trading Mood',
            data: [8, 6, 9, 7, 8],
            backgroundColor: (ctx) => {
              const colors = [GREEN, GREEN, GREEN, TEAL, GREEN]
              return colors[ctx.dataIndex]
            },
            borderRadius: 4
          }]
        },
        options: {
          ...baseOpts(v => v + '/10'),
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ' Mood Score: ' + ctx.parsed.y + '/10'
              }
            }
          }
        }
      })
    }

    // Performance Chart
    if (chartRefs.performanceChart.current && !chartInstances.current.performanceChart) {
      chartInstances.current.performanceChart = new Chart(chartRefs.performanceChart.current, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Journal Consistency',
            data: [3, 4, 5, 5],
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
          ...baseOpts(v => v + ' entries'),
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ' Entries: ' + ctx.parsed.y
              }
            }
          }
        }
      })
    }

    // Consistency Chart
    if (chartRefs.consistencyChart.current && !chartInstances.current.consistencyChart) {
      chartInstances.current.consistencyChart = new Chart(chartRefs.consistencyChart.current, {
        type: 'doughnut',
        data: {
          labels: ['Positive', 'Negative', 'Neutral'],
          datasets: [{
            data: [60, 25, 15],
            backgroundColor: [GREEN, RED, TEAL],
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

    return () => {
      Object.values(chartInstances.current).forEach(chart => {
        if (chart) chart.destroy()
      })
      chartInstances.current = {}
    }
  }, [])

  const handleDeleteEntry = (entryId) => {
    setEntries(entries.filter(e => e.id !== entryId))
  }

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry)
    setShowNewEntry(true)
  }

  const EntryCard = ({ entry }) => {
    const moodColors = {
      positive: GREEN,
      negative: RED,
      neutral: TEAL
    }

    return (
      <div className="journal-card">
        <div className="journal-header">
          <div className="journal-date">{entry.date}</div>
          <div className="journal-mood" style={{ color: moodColors[entry.mood] }}>
            {entry.mood === 'positive' ? 'Positive' : entry.mood === 'negative' ? 'Negative' : 'Neutral'}
          </div>
        </div>
        <div className="journal-title">{entry.title}</div>
        <div className="journal-content">{entry.content}</div>
        <div className="journal-footer">
          <div className="journal-pair">{entry.pair}</div>
          <div className={`journal-pnl ${entry.pnl.startsWith('+') ? 'positive' : 'negative'}`}>
            {entry.pnl}
          </div>
        </div>
        <div className="journal-actions">
          <button 
            className="journal-btn" 
            onClick={() => handleDeleteEntry(entry.id)}
            title="Delete"
          >
            {'\ud83d\uddd1\ufe0f'}
          </button>
          <button 
            className="journal-btn" 
            onClick={() => handleEditEntry(entry)}
            title="Edit"
          >
            {'\u270f\ufe0f'}
          </button>
        </div>
      </div>
    )
  }

  const NewEntryModal = () => {
    if (!showNewEntry) return null

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{selectedEntry ? 'Edit Entry' : 'New Journal Entry'}</h3>
            <button 
              className="modal-close" 
              onClick={() => {
                setShowNewEntry(false)
                setSelectedEntry(null)
              }}
            >
              {'\u2715'}
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                defaultValue={selectedEntry?.date || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                defaultValue={selectedEntry?.title || ''}
                placeholder="Enter entry title"
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea 
                rows="4"
                defaultValue={selectedEntry?.content || ''}
                placeholder="Describe your trading experience..."
              />
            </div>
            <div className="form-group">
              <label>Mood</label>
              <select defaultValue={selectedEntry?.mood || 'positive'}>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div className="form-group">
              <label>Currency Pair</label>
              <select defaultValue={selectedEntry?.pair || 'XAUUSD'}>
                <option value="XAUUSD">XAU/USD</option>
                <option value="EURUSD">EUR/USD</option>
                <option value="GBPUSD">GBP/USD</option>
                <option value="USDJPY">USD/JPY</option>
                <option value="AUDUSD">AUD/USD</option>
              </select>
            </div>
            <div className="form-group">
              <label>P&L</label>
              <input 
                type="text" 
                defaultValue={selectedEntry?.pnl || ''}
                placeholder="+$100.00"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="btn-cancel" 
              onClick={() => {
                setShowNewEntry(false)
                setSelectedEntry(null)
              }}
            >
              Cancel
            </button>
            <button 
              className="btn-primary"
              onClick={() => {
                // Handle save logic here
                setShowNewEntry(false)
                setSelectedEntry(null)
              }}
            >
              {selectedEntry ? 'Update' : 'Create'} Entry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'entries':
        return (
          <div>
            <div className="journal-grid">
              {entries.map(entry => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>

            {entries.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">{'\ud83d\udcd4'}</div>
                <h3>No Journal Entries</h3>
                <p>Start documenting your trading journey to improve your performance</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowNewEntry(true)}
                >
                  Create First Entry
                </button>
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
                  <div className="ov-title">Journal Statistics</div>
                  <div className="ov-badge win">Active</div>
                </div>
                <div className="ov-row"><div className="ov-key">Total Entries</div><div className="ov-val">{entries.length}</div></div>
                <div className="ov-row"><div className="ov-key">This Week</div><div className="ov-val green">5</div></div>
                <div className="ov-row"><div className="ov-key">Streak</div><div className="ov-val green">3 days</div></div>
                <div className="ov-row"><div className="ov-key">Avg Mood</div><div className="ov-val">7.2/10</div></div>
                <div className="ov-row"><div className="ov-key">Best Day</div><div className="ov-val">Wednesday</div></div>
                <div className="ov-row"><div className="ov-key">Improvement</div><div className="ov-val green">+23%</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Trading Patterns</div>
                  <div className="ov-badge neutral">Analysis</div>
                </div>
                <div className="ov-row"><div className="ov-key">Most Discussed</div><div className="ov-val">XAU/USD</div></div>
                <div className="ov-row"><div className="ov-key">Common Mistakes</div><div className="ov-val red">Revenge Trading</div></div>
                <div className="ov-row"><div className="ov-key">Strengths</div><div className="ov-val green">Patience</div></div>
                <div className="ov-row"><div className="ov-key">Weaknesses</div><div className="ov-val red">Discipline</div></div>
                <div className="ov-row"><div className="ov-key">Best Time</div><div className="ov-val">14:00-16:00</div></div>
                <div className="ov-row"><div className="ov-key">Worst Time</div><div className="ov-val red">08:00-09:00</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Progress Metrics</div>
                  <div className="ov-badge win">Improving</div>
                </div>
                <div className="ov-row"><div className="ov-key">Consistency</div><div className="ov-val green">85%</div></div>
                <div className="ov-row"><div className="ov-key">Discipline Score</div><div className="ov-val">7.8/10</div></div>
                <div className="ov-row"><div className="ov-key">Emotional Control</div><div className="ov-val green">8.2/10</div></div>
                <div className="ov-row"><div className="ov-key">Rule Following</div><div className="ov-val green">92%</div></div>
                <div className="ov-row"><div className="ov-key">Learning Rate</div><div className="ov-val green">High</div></div>
                <div className="ov-row"><div className="ov-key">Overall Progress</div><div className="ov-val green">+15%</div></div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Weekly Mood Tracking</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>Average: 7.6/10</div>
                </div>
                <div style={{ position: 'relative', height: '200px' }}>
                  <canvas ref={chartRefs.moodChart}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Journal Consistency</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>4 entries/week</div>
                </div>
                <div style={{ position: 'relative', height: '200px' }}>
                  <canvas ref={chartRefs.performanceChart}></canvas>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">Sentiment Analysis</div>
                <div style={{ fontSize: '11px', color: '#555' }}>Based on {entries.length} entries</div>
              </div>
              <div style={{ position: 'relative', height: '250px' }}>
                <canvas ref={chartRefs.consistencyChart}></canvas>
              </div>
            </div>
          </div>
        )

      case 'insights':
        return (
          <div>
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">AI Trading Insights</div>
                <div style={{ fontSize: '11px', color: '#555' }}>Based on your journal entries</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '10px', border: '1px solid #2a2a2a' }}>
                  <h4 style={{ color: GREEN, marginBottom: '8px', fontSize: '14px' }}>Key Strengths</h4>
                  <ul style={{ color: '#aaa', fontSize: '12px', paddingLeft: '16px', margin: 0 }}>
                    <li>Excellent patience in trade execution</li>
                    <li>Good risk management practices</li>
                    <li>Consistent journaling habit</li>
                    <li>Strong emotional awareness</li>
                  </ul>
                </div>
                <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '10px', border: '1px solid #2a2a2a' }}>
                  <h4 style={{ color: RED, marginBottom: '8px', fontSize: '14px' }}>Areas to Improve</h4>
                  <ul style={{ color: '#aaa', fontSize: '12px', paddingLeft: '16px', margin: 0 }}>
                    <li>Avoid revenge trading after losses</li>
                    <li>Stay away from high-impact news</li>
                    <li>Improve morning trading discipline</li>
                    <li>Be more patient with trade setups</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="overview-grid" style={{ marginTop: '20px' }}>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Recommended Actions</div>
                  <div className="ov-badge win">Priority</div>
                </div>
                <div className="ov-row"><div className="ov-key">1. Set News Alerts</div><div className="ov-val">Avoid NFP</div></div>
                <div className="ov-row"><div className="ov-key">2. Morning Routine</div><div className="ov-val">Prep before 9AM</div></div>
                <div className="ov-row"><div className="ov-key">3. Loss Protocol</div><div className="ov-val">30-min break</div></div>
                <div className="ov-row"><div className="ov-key">4. Daily Review</div><div className="ov-val">End of day</div></div>
                <div className="ov-row"><div className="ov-key">5. Weekly Goals</div><div className="ov-val">Set targets</div></div>
                <div className="ov-row"><div className="ov-key">6. Mentor Check-in</div><div className="ov-val">Monthly</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Psychological Profile</div>
                  <div className="ov-badge neutral">Analysis</div>
                </div>
                <div className="ov-row"><div className="ov-key">Trading Style</div><div className="ov-val">Conservative</div></div>
                <div className="ov-row"><div className="ov-key">Risk Tolerance</div><div className="ov-val">Moderate</div></div>
                <div className="ov-row"><div className="ov-key">Emotional Control</div><div className="ov-val green">Strong</div></div>
                <div className="ov-row"><div className="ov-key">Discipline Level</div><div className="ov-val">Good</div></div>
                <div className="ov-row"><div className="ov-key">Learning Aptitude</div><div className="ov-val green">High</div></div>
                <div className="ov-row"><div className="ov-key">Stress Response</div><div className="ov-val">Managed</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Growth Potential</div>
                  <div className="ov-badge win">High</div>
                </div>
                <div className="ov-row"><div className="ov-key">Current Level</div><div className="ov-val">Intermediate</div></div>
                <div className="ov-row"><div className="ov-key">Next Milestone</div><div className="ov-val">Advanced</div></div>
                <div className="ov-row"><div className="ov-key">Time to Goal</div><div className="ov-val">3-6 months</div></div>
                <div className="ov-row"><div className="ov-key">Success Probability</div><div className="ov-val green">85%</div></div>
                <div className="ov-row"><div className="ov-key">Key Focus Areas</div><div className="ov-val">Patience, Rules</div></div>
                <div className="ov-row"><div className="ov-key">Growth Rate</div><div className="ov-val green">+15%/mo</div></div>
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
          <div className="page-title">Journal</div>
          <div className="page-sub">Phoenix Challenge · Trading Psychology</div>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">{'\ud83d\udd25'} 3 day streak</div>
          <button 
            className="btn-new" 
            onClick={() => setShowNewEntry(true)}
          >
            + New Entry
          </button>
        </div>
      </div>

      <div className="tab-bar">
        {['entries', 'analytics', 'insights'].map(tab => (
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

      <NewEntryModal />
    </div>
  )
}

export default PhoenixJournal
