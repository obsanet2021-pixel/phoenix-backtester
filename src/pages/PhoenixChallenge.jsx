import React, { useState, useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

const PhoenixChallenge = () => {
  const [activeTab, setActiveTab] = useState('challenges')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [userChallenges, setUserChallenges] = useState([])
  const [userProgress, setUserProgress] = useState({
    totalTrades: 0,
    winRate: 0,
    profitLoss: 0,
    challengesCompleted: 0,
    currentStreak: 0,
    xp: 0,
    level: 1
  })
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const accountTypes = [
    { id: 1, size: 2500, price: 47, profitTarget: 5, maxDrawdown: 5, dailyDrawdown: 4, phase: '1-Phase', timeLimit: 'Unlimited', refundable: true },
    { id: 2, size: 5000, price: 87, profitTarget: 8, maxDrawdown: 8, dailyDrawdown: 5, phase: '1-Phase', timeLimit: 'Unlimited', refundable: true },
    { id: 3, size: 10000, price: 147, profitTarget: 10, maxDrawdown: 10, dailyDrawdown: 5, phase: '1-Phase', timeLimit: 'Unlimited', refundable: true },
    { id: 4, size: 15000, price: 207, profitTarget: 10, maxDrawdown: 10, dailyDrawdown: 5, phase: '1-Phase', timeLimit: 'Unlimited', refundable: true },
    { id: 5, size: 25000, price: 327, profitTarget: 10, maxDrawdown: 10, dailyDrawdown: 5, phase: '1-Phase', timeLimit: 'Unlimited', refundable: true },
    { id: 6, size: 50000, price: 567, profitTarget: 10, maxDrawdown: 10, dailyDrawdown: 5, phase: '1-Phase', timeLimit: 'Unlimited', refundable: true },
    { id: 7, size: 100000, price: 1047, profitTarget: 10, maxDrawdown: 10, dailyDrawdown: 5, phase: '1-Phase', timeLimit: 'Unlimited', refundable: true },
    { id: 8, size: 200000, price: 1947, profitTarget: 10, maxDrawdown: 10, dailyDrawdown: 5, phase: '1-Phase', timeLimit: 'Unlimited', refundable: true },
    { id: 9, size: 300000, price: 2747, profitTarget: 10, maxDrawdown: 10, dailyDrawdown: 5, phase: '1-Phase', timeLimit: 'Unlimited', refundable: true },
    { id: 10, size: 500000, price: 4347, profitTarget: 10, maxDrawdown: 10, dailyDrawdown: 5, phase: '1-Phase', timeLimit: 'Unlimited', refundable: true },
    { id: 11, size: 1000000, price: 8147, profitTarget: 10, maxDrawdown: 10, dailyDrawdown: 5, phase: '1-Phase', timeLimit: 'Unlimited', refundable: true }
  ]

  // Demo challenges for new users
  const demoChallenges = [
    {
      id: 1,
      title: "First Trade Challenge",
      description: "Place your first trade and learn the basics",
      difficulty: "Beginner",
      requirements: {
        trades: 1,
        profit: 0
      },
      reward: "100 XP",
      icon: "target",
      status: "available",
      xpReward: 100
    },
    {
      id: 2,
      title: "Risk Management Master",
      description: "Complete 10 trades with maximum 2% risk per trade",
      difficulty: "Intermediate",
      requirements: {
        trades: 10,
        maxRisk: 2
      },
      reward: "250 XP",
      icon: "shield",
      status: userProgress.totalTrades >= 5 ? "available" : "locked",
      xpReward: 250
    },
    {
      id: 3,
      title: "Profit Target Pro",
      description: "Achieve $500 profit in a single trading session",
      difficulty: "Advanced",
      requirements: {
        profit: 500,
        trades: 5
      },
      reward: "500 XP",
      icon: "trending-up",
      status: userProgress.totalTrades >= 20 ? "available" : "locked",
      xpReward: 500
    },
    {
      id: 4,
      title: "Consistency King",
      description: "Maintain 60% win rate over 50 trades",
      difficulty: "Expert",
      requirements: {
        trades: 50,
        winRate: 60
      },
      reward: "1000 XP",
      icon: "crown",
      status: userProgress.totalTrades >= 50 ? "available" : "locked",
      xpReward: 1000
    }
  ]

  const startChallenge = (challenge) => {
    if (challenge.status === 'locked') {
      alert('This challenge is locked! Complete previous challenges first.');
      return;
    }

    setActiveChallenge(challenge);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      alert(`Started: ${challenge.title}\n\n${challenge.description}\n\nGood luck!`);
    }, 1000);
  };

  const updateProgress = (tradeData) => {
    const newProgress = {
      ...userProgress,
      totalTrades: userProgress.totalTrades + 1,
      winRate: userProgress.totalTrades > 0 ? 
        ((userProgress.winRate * userProgress.totalTrades + (tradeData.profit > 0 ? 100 : 0)) / (userProgress.totalTrades + 1)) : 0,
      profitLoss: userProgress.profitLoss + tradeData.profit,
      currentStreak: tradeData.profit > 0 ? userProgress.currentStreak + 1 : 0
    };

    // Check challenge completion
    demoChallenges.forEach(challenge => {
      if (challenge.status === 'available' || challenge.status === 'active') {
        let completed = false;
        
        if (challenge.id === 1 && newProgress.totalTrades >= challenge.requirements.trades) {
          completed = true;
        }
        if (challenge.id === 2 && newProgress.totalTrades >= challenge.requirements.trades) {
          completed = true;
        }
        if (challenge.id === 3 && newProgress.profitLoss >= challenge.requirements.profit) {
          completed = true;
        }
        if (challenge.id === 4 && newProgress.totalTrades >= challenge.requirements.trades && newProgress.winRate >= challenge.requirements.winRate) {
          completed = true;
        }

        if (completed) {
          challenge.status = 'completed';
          newProgress.challengesCompleted += 1;
          newProgress.xp += challenge.xpReward;
          newProgress.level = Math.floor(newProgress.xp / 1000) + 1;
          alert(`Challenge Completed: ${challenge.title}\n+${challenge.reward}`);
        }
      }
    });

    setUserProgress(newProgress);
  };

  const simulateTrade = () => {
    const profit = Math.random() > 0.5 ? 25 : -15;
    updateProgress({ profit });
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      const resetData = {
        totalTrades: 0,
        winRate: 0,
        profitLoss: 0,
        challengesCompleted: 0,
        currentStreak: 0,
        xp: 0,
        level: 1
      };
      setUserProgress(resetData);
      
      // Reset challenge statuses
      demoChallenges.forEach(challenge => {
        if (challenge.id === 1) {
          challenge.status = 'available';
        } else {
          challenge.status = 'locked';
        }
      });
    }
  };

  const chartRefs = {
    comparisonChart: useRef(null),
    progressChart: useRef(null),
    distributionChart: useRef(null)
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
    // Comparison Chart
    if (chartRefs.comparisonChart.current && !chartInstances.current.comparisonChart) {
      chartInstances.current.comparisonChart = new Chart(chartRefs.comparisonChart.current, {
        type: 'bar',
        data: {
          labels: ['5K', '10K', '25K', '50K', '100K', '200K'],
          datasets: [{
            label: 'Account Size vs Price',
            data: [87, 147, 327, 567, 1047, 1947],
            backgroundColor: ORANGE,
            borderRadius: 4
          }]
        },
        options: {
          ...baseOpts(v => '$' + v),
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ' Price: $' + ctx.parsed.y
              }
            }
          }
        }
      })
    }

    // Progress Chart
    if (chartRefs.progressChart.current && !chartInstances.current.progressChart) {
      chartInstances.current.progressChart = new Chart(chartRefs.progressChart.current, {
        type: 'line',
        data: {
          labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
          datasets: [{
            label: 'Challenge Progress',
            data: [10000, 10250, 10180, 10320, 10190, 10350, 10280],
            borderColor: GREEN,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: GREEN,
            fill: true,
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200)
              g.addColorStop(0, 'rgba(34,197,94,0.2)')
              g.addColorStop(1, 'rgba(34,197,94,0)')
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

    // Distribution Chart
    if (chartRefs.distributionChart.current && !chartInstances.current.distributionChart) {
      chartInstances.current.distributionChart = new Chart(chartRefs.distributionChart.current, {
        type: 'doughnut',
        data: {
          labels: ['Active', 'Passed', 'Failed', 'Pending'],
          datasets: [{
            data: [45, 30, 15, 10],
            backgroundColor: [ORANGE, GREEN, RED, TEAL],
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

  const handleRequestAccount = (account) => {
    setSelectedAccount(account)
    setShowRequestModal(true)
  }

  const handleSubmitRequest = (formData) => {
    const newChallenge = {
      id: Date.now(),
      account: selectedAccount,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      ...formData
    }
    
    setUserChallenges([...userChallenges, newChallenge])
    setShowRequestModal(false)
    setSelectedAccount(null)
  }

  const AccountCard = ({ account }) => {
    const isPopular = [5000, 10000, 25000].includes(account.size)
    
    return (
      <div className={`account-card ${isPopular ? 'popular' : ''}`}>
        {isPopular && <div className="popular-badge">Most Popular</div>}
        <div className="account-header">
          <div className="account-size">${account.size.toLocaleString()}</div>
          <div className="account-price">${account.price}</div>
        </div>
        <div className="account-rules">
          <div className="rule-item">
            <span className="rule-label">Profit Target</span>
            <span className="rule-value green">{account.profitTarget}%</span>
          </div>
          <div className="rule-item">
            <span className="rule-label">Max Drawdown</span>
            <span className="rule-value red">{account.maxDrawdown}%</span>
          </div>
          <div className="rule-item">
            <span className="rule-label">Daily Drawdown</span>
            <span className="rule-value orange">{account.dailyDrawdown}%</span>
          </div>
          <div className="rule-item">
            <span className="rule-label">Phase</span>
            <span className="rule-value">{account.phase}</span>
          </div>
          <div className="rule-item">
            <span className="rule-label">Time Limit</span>
            <span className="rule-value">{account.timeLimit}</span>
          </div>
          <div className="rule-item">
            <span className="rule-label">Refundable</span>
            <span className="rule-value">{account.refundable ? 'Yes' : 'No'}</span>
          </div>
        </div>
        <div className="account-actions">
          <button 
            className="account-btn primary"
            onClick={() => handleRequestAccount(account)}
          >
            Request Account
          </button>
          <button className="account-btn secondary">
            View Details
          </button>
        </div>
      </div>
    )
  }

  const RequestModal = () => {
    if (!showRequestModal || !selectedAccount) return null

    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      experience: '',
      tradingStyle: '',
      riskTolerance: '',
      agreeTerms: false
    })

    return (
      <div className="modal-overlay">
        <div className="modal-content challenge-modal">
          <div className="modal-header">
            <h3>Request ${selectedAccount.size.toLocaleString()} Evaluation</h3>
            <button 
              className="modal-close" 
              onClick={() => {
                setShowRequestModal(false)
                setSelectedAccount(null)
              }}
            >
              {'\u2715'}
            </button>
          </div>
          <div className="modal-body">
            <div className="challenge-summary">
              <div className="summary-item">
                <span className="summary-label">Account Size:</span>
                <span className="summary-value">${selectedAccount.size.toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Price:</span>
                <span className="summary-value">${selectedAccount.price}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Profit Target:</span>
                <span className="summary-value green">{selectedAccount.profitTarget}%</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Max Drawdown:</span>
                <span className="summary-value red">{selectedAccount.maxDrawdown}%</span>
              </div>
            </div>
            
            <div className="form-section">
              <h4>Personal Information</h4>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <select 
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                >
                  <option value="">Select Country</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                  <option value="au">Australia</option>
                  <option value="de">Germany</option>
                  <option value="fr">France</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h4>Trading Experience</h4>
              <div className="form-group">
                <label>Years of Experience</label>
                <select 
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                >
                  <option value="">Select Experience</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">More than 5 years</option>
                </select>
              </div>
              <div className="form-group">
                <label>Trading Style</label>
                <select 
                  value={formData.tradingStyle}
                  onChange={(e) => setFormData({...formData, tradingStyle: e.target.value})}
                >
                  <option value="">Select Style</option>
                  <option value="scalping">Scalping</option>
                  <option value="day">Day Trading</option>
                  <option value="swing">Swing Trading</option>
                  <option value="position">Position Trading</option>
                </select>
              </div>
              <div className="form-group">
                <label>Risk Tolerance</label>
                <select 
                  value={formData.riskTolerance}
                  onChange={(e) => setFormData({...formData, riskTolerance: e.target.value})}
                >
                  <option value="">Select Risk Level</option>
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                  />
                  <span>I agree to the evaluation terms and conditions</span>
                </label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="btn-cancel" 
              onClick={() => {
                setShowRequestModal(false)
                setSelectedAccount(null)
              }}
            >
              Cancel
            </button>
            <button 
              className="btn-primary"
              onClick={() => handleSubmitRequest(formData)}
              disabled={!formData.agreeTerms || !formData.fullName || !formData.email}
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'accounts':
        return (
          <div>
            <div className="accounts-header">
              <h3>Available Evaluation Accounts</h3>
              <div className="accounts-filter">
                <select className="filter-select">
                  <option value="all">All Sizes</option>
                  <option value="small">Small (&lt;$10K)</option>
                  <option value="medium">Medium ($10K-$50K)</option>
                  <option value="large">Large (&gt;$50K)</option>
                </select>
                <select className="filter-select">
                  <option value="all">All Phases</option>
                  <option value="1-phase">1-Phase</option>
                  <option value="2-phase">2-Phase</option>
                </select>
              </div>
            </div>

            <div className="accounts-grid">
              {accountTypes.map(account => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </div>
        )

      case 'my-challenges':
        return (
          <div>
            <div className="trades-header">
              <h3>My Challenges ({userChallenges.length})</h3>
              <div className="trades-actions">
                <button className="btn-outline" onClick={() => {
                  const dataStr = JSON.stringify(userChallenges, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'challenges-export.json';
                  link.click();
                }}>Export Data</button>
                <button 
                  className="btn-new"
                  onClick={() => setActiveTab('accounts')}
                >
                  Request New Challenge
                </button>
              </div>
            </div>

            <div className="trades-table-container">
              <table className="trades-table">
                <thead>
                  <tr>
                    <th>Account Size</th>
                    <th>Status</th>
                    <th>Requested</th>
                    <th>Progress</th>
                    <th>Current Balance</th>
                    <th>Days Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userChallenges.map(challenge => (
                    <tr key={challenge.id} className="trade-row">
                      <td className="trade-cell">${challenge.account.size.toLocaleString()}</td>
                      <td className="trade-cell">
                        <span className={`trade-status ${challenge.status}`}>
                          {challenge.status}
                        </span>
                      </td>
                      <td className="trade-cell">
                        {new Date(challenge.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="trade-cell">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '45%' }}></div>
                        </div>
                        <span className="progress-text">45%</span>
                      </td>
                      <td className="trade-cell trade-number">$10,450</td>
                      <td className="trade-cell">12</td>
                      <td className="trade-cell">
                        <div className="trade-actions">
                          <button className="trade-btn" title="View Details">{'\ud83d\udcca'}</button>
                          <button className="trade-btn" title="Manage">{'\u2699\ufe0f'}</button>
                          <button className="trade-btn" title="Cancel">{'\u274c'}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {userChallenges.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">{'\ud83c\udfaf'}</div>
                <h3>No Active Challenges</h3>
                <p>Request your first evaluation account to get started</p>
                <button 
                  className="btn-primary"
                  onClick={() => setActiveTab('accounts')}
                >
                  Browse Accounts
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
                  <div className="ov-title">Challenge Statistics</div>
                  <div className="ov-badge win">Active</div>
                </div>
                <div className="ov-row"><div className="ov-key">Total Challenges</div><div className="ov-val">{userChallenges.length}</div></div>
                <div className="ov-row"><div className="ov-key">Pass Rate</div><div className="ov-val green">67%</div></div>
                <div className="ov-row"><div className="ov-key">Avg Completion</div><div className="ov-val">18 days</div></div>
                <div className="ov-row"><div className="ov-key">Best Performance</div><div className="ov-val green">+12.5%</div></div>
                <div className="ov-row"><div className="ov-key">Total Funded</div><div className="ov-val">$125,000</div></div>
                <div className="ov-row"><div className="ov-key">Success Rate</div><div className="ov-val green">85%</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Popular Accounts</div>
                  <div className="ov-badge neutral">Trends</div>
                </div>
                <div className="ov-row"><div className="ov-key">Most Requested</div><div className="ov-val">$10K</div></div>
                <div className="ov-row"><div className="ov-key">Highest Success</div><div className="ov-val green">$5K</div></div>
                <div className="ov-row"><div className="ov-key">Fastest Pass</div><div className="ov-val green">$25K</div></div>
                <div className="ov-row"><div className="ov-key">Best Value</div><div className="ov-val">$100K</div></div>
                <div className="ov-row"><div className="ov-key">Avg Size</div><div className="ov-val">$47,500</div></div>
                <div className="ov-row"><div className="ov-key">Success Rate</div><div className="ov-val green">72%</div></div>
              </div>
              <div className="ov-panel">
                <div className="ov-header">
                  <div className="ov-title">Performance Metrics</div>
                  <div className="ov-badge win">Excellent</div>
                </div>
                <div className="ov-row"><div className="ov-key">Avg Profit Target</div><div className="ov-val">8.2%</div></div>
                <div className="ov-row"><div className="ov-key">Avg Drawdown</div><div className="ov-val red">3.1%</div></div>
                <div className="ov-row"><div className="ov-key">Risk/Reward</div><div className="ov-val green">1:2.6</div></div>
                <div className="ov-row"><div className="ov-key">Consistency</div><div className="ov-val green">91%</div></div>
                <div className="ov-row"><div className="ov-key">Discipline Score</div><div className="ov-val green">8.5/10</div></div>
                <div className="ov-row"><div className="ov-key">Overall Rating</div><div className="ov-val green">A+</div></div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Account Size vs Price</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>Popular choices</div>
                </div>
                <div style={{ position: 'relative', height: '200px' }}>
                  <canvas ref={chartRefs.comparisonChart}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <div className="chart-title">Challenge Progress</div>
                  <div style={{ fontSize: '11px', color: GREEN }}>+2.8%</div>
                </div>
                <div style={{ position: 'relative', height: '200px' }}>
                  <canvas ref={chartRefs.progressChart}></canvas>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">Challenge Status Distribution</div>
                <div style={{ fontSize: '11px', color: '#555' }}>All time</div>
              </div>
              <div style={{ position: 'relative', height: '250px' }}>
                <canvas ref={chartRefs.distributionChart}></canvas>
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
          <div className="page-title">Challenge</div>
          <div className="page-sub">Phoenix Challenge · Evaluation Accounts</div>
        </div>
        <div className="topbar-right">
          <div className="streak-badge">{'\ud83c\udfaf'} {userChallenges.length} active</div>
          <button 
            className="btn-new"
            onClick={() => setActiveTab('accounts')}
          >
            Request Account
          </button>
        </div>
      </div>

      <div className="tab-bar">
        {['accounts', 'my-challenges', 'analytics'].map(tab => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
          </div>
        ))}
      </div>

      <div className="content">
        {renderTab()}
      </div>

      <RequestModal />
    </div>
  )
}

export default PhoenixChallenge
