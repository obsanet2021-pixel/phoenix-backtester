import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Welcome = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleEnterApp = () => {
    navigate('/dashboard')
  }

  const DemoEquityCurve = () => {
    return (
      <div style={{ height: '192px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#787b86', marginBottom: '8px' }}>
          <span>04:00</span>
          <span>08:00</span>
          <span>12:00</span>
          <span>14:00</span>
        </div>
        <div style={{ position: 'relative', height: '160px', background: '#0a1019', borderRadius: '12px', padding: '16px' }}>
          <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 600 160">
            <path
              d="M0,120 L100,100 L200,80 L300,40 L400,50 L500,30 L600,25"
              fill="none"
              stroke="#22C55E"
              strokeWidth="3"
            />
            <path
              d="M0,120 L100,100 L200,80 L300,40 L400,50 L500,30 L600,25 L600,160 L0,160 Z"
              fill="url(#gradient)"
              opacity="0.1"
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    )
  }

  const DemoHeatmap = () => {
    const days = [
      { day: "Mon", value: 2124, type: "win" },
      { day: "Tue", value: -500, type: "loss" },
      { day: "Wed", value: 1524, type: "win" },
      { day: "Thu", value: 0, type: "none" },
      { day: "Fri", value: 0, type: "none" },
    ]

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
        {days.map((day, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#787b86', marginBottom: '4px' }}>{day.day}</div>
            <div style={{
              padding: '8px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              background: day.type === 'win' ? 'rgba(34, 197, 94, 0.2)' : 
                        day.type === 'loss' ? 'rgba(239, 68, 68, 0.2)' : 
                        '#1e222d',
              color: day.type === 'win' ? '#22c55e' : 
                     day.type === 'loss' ? '#ef4444' : 
                     '#787b86'
            }}>
              {day.type === 'win' ? `+$${day.value}` : day.type === 'loss' ? `-$${Math.abs(day.value)}` : '—'}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const DemoRecentTrades = () => {
    const trades = [
      { pair: "XAU/USD", type: "BUY", date: "Jan 2", pnl: "+$2,024", profit: true },
      { pair: "XAU/USD", type: "SELL", date: "Jan 2", pnl: "-$500", profit: false },
      { pair: "XAU/USD", type: "BUY", date: "Jan 1", pnl: "+$1,524", profit: true },
    ]

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {trades.map((trade, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '8px', 
            background: '#1e222d', 
            borderRadius: '8px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                background: trade.profit ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: trade.profit ? '#22c55e' : '#ef4444'
              }}>
                {trade.type}
              </span>
              <span style={{ fontSize: '14px', color: '#d1d4dc' }}>{trade.pair}</span>
              <span style={{ fontSize: '12px', color: '#787b86' }}>{trade.date}</span>
            </div>
            <span style={{ fontWeight: '600', color: trade.profit ? '#22c55e' : '#ef4444' }}>
              {trade.pnl}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #0b1219, #0b1219, #0f172a)' 
    }}>
      {/* Navigation */}
      <nav style={{
        borderBottom: '1px solid #2a2e39',
        background: 'rgba(11, 18, 25, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/phoenix-logo.png" alt="Phoenix Logo" style={{ width: '32px', height: '32px' }} />
          <span style={{ fontWeight: '700', fontSize: '20px', color: '#ff6b00' }}>Phoenix Backtester</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={handleEnterApp}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #ff6b00, #ff8c00)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #e55f00, #ff7700)'}
            onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ff6b00, #ff8c00)'}
          >
            Enter App →
          </button>
        </div>
      </nav>

      {/* Hero Section with Live Dashboard */}
      <div style={{ padding: '48px 24px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Headline */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(255, 107, 0, 0.2)',
            color: '#ff6b00',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '16px',
            border: '1px solid rgba(255, 107, 0, 0.3)'
          }}>
            Trusted by 10,000+ traders
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '24px',
            background: 'linear-gradient(90deg, #fff, #ff6b00, #fff)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Turn your trades into data. Your data into profits.
          </h1>
          <p style={{ fontSize: '20px', color: '#787b86', marginBottom: '32px' }}>
            Journal, analyze, and optimize - just like the pros. Join thousands of traders who've improved their win rate by 40%.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button 
              onClick={handleEnterApp}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #ff6b00, #ff8c00)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #e55f00, #ff7700)'}
              onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ff6b00, #ff8c00)'}
            >
              Start Journaling Free →
            </button>
            <button 
              onClick={handleEnterApp}
              style={{
                padding: '14px 32px',
                background: 'transparent',
                color: '#ff6b00',
                border: '1px solid #ff6b00',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 107, 0, 0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Watch Demo
            </button>
          </div>
        </div>

        {/* Live Demo Dashboard */}
        <div style={{
          background: 'rgba(30, 34, 45, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #2a2e39',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '80px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>Live Demo Dashboard</h2>
              <p style={{ color: '#787b86', fontSize: '14px' }}>
                See exactly how your trading data comes to life
              </p>
            </div>
            <div style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid #22c55e',
              color: '#22c55e',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              ● Live Preview
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#1e222d', padding: '4px', borderRadius: '8px' }}>
            {['dashboard', 'analytics', 'journal'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: activeTab === tab ? '#ff6b00' : 'transparent',
                  color: activeTab === tab ? '#fff' : '#787b86',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {/* KPI Cards */}
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Total PnL', value: '+$3,048', color: '#22c55e', sub: '↑ +3.05%' },
                  { label: 'Win Rate', value: '66.7%', color: '#d1d4dc', sub: 'Above average' },
                  { label: 'Avg RR', value: '3.55', color: '#d1d4dc', sub: '↑ Above average' },
                  { label: 'Best Trade', value: '+$2,024', color: '#22c55e', sub: 'Jan 2, 2026' }
                ].map((kpi, i) => (
                  <div key={i} style={{
                    background: 'rgba(30, 34, 45, 0.5)',
                    border: '1px solid #2a2e39',
                    borderRadius: '12px',
                    padding: '24px'
                  }}>
                    <div style={{ fontSize: '12px', color: '#787b86', marginBottom: '4px' }}>{kpi.label}</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: kpi.color }}>{kpi.value}</div>
                    <div style={{ fontSize: '12px', color: '#22c55e' }}>{kpi.sub}</div>
                  </div>
                ))}
              </div>

              {/* Equity Curve */}
              <div style={{ gridColumn: '1 / 3', background: 'rgba(30, 34, 45, 0.5)', border: '1px solid #2a2e39', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Equity Curve</h3>
                <DemoEquityCurve />
              </div>

              {/* Recent Trades */}
              <div style={{ background: 'rgba(30, 34, 45, 0.5)', border: '1px solid #2a2e39', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Recent Trades</h3>
                <DemoRecentTrades />
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              <div style={{ background: 'rgba(30, 34, 45, 0.5)', border: '1px solid #2a2e39', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Winners & Losers</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#787b86', marginBottom: '4px' }}>Total Winners</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>2</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#787b86', marginBottom: '4px' }}>Total Losers</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>1</div>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #2a2e39', paddingTop: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#787b86', marginBottom: '8px' }}>Average Win</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#22c55e' }}>+1.76%</div>
                  <div style={{ fontSize: '12px', color: '#787b86', marginTop: '8px', marginBottom: '8px' }}>Average Loss</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#ef4444' }}>-0.49%</div>
                </div>
              </div>

              <div style={{ background: 'rgba(30, 34, 45, 0.5)', border: '1px solid #2a2e39', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Trade Heatmap</h3>
                <DemoHeatmap />
              </div>
            </div>
          )}

          {/* Journal Tab */}
          {activeTab === 'journal' && (
            <div style={{ background: 'rgba(30, 34, 45, 0.5)', border: '1px solid #2a2e39', borderRadius: '12px', padding: '24px' }}>
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📓</div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Document Your Journey</h3>
                <p style={{ color: '#787b86', marginBottom: '16px' }}>Add notes, tags, and screenshots to every trade</p>
                <button 
                  onClick={handleEnterApp}
                  style={{
                    padding: '10px 24px',
                    background: 'transparent',
                    color: '#ff6b00',
                    border: '1px solid #ff6b00',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 107, 0, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  Start Journaling
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', marginBottom: '48px' }}>
            Everything you need to trade better
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { icon: '🏆', title: 'Performance Analytics', desc: 'Track win rate, RR, drawdown, and more with beautiful charts' },
              { icon: '📅', title: 'Trade Calendar', desc: 'See your wins and losses by day, week, or month' },
              { icon: '🎯', title: 'Prop Firm Simulator', desc: 'Practice with real challenge rules and tracking' }
            ].map((feature, i) => (
              <div key={i} style={{
                background: 'rgba(30, 34, 45, 0.5)',
                border: '1px solid #2a2e39',
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = '#ff6b00'}
              onMouseLeave={(e) => e.target.style.borderColor = '#2a2e39'}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ff6b00' }}>{feature.title}</h3>
                <p style={{ color: '#787b86', fontSize: '14px' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{
            background: 'linear-gradient(90deg, rgba(255, 107, 0, 0.2), rgba(147, 51, 234, 0.2))',
            border: '1px solid rgba(255, 107, 0, 0.3)',
            borderRadius: '16px',
            padding: '48px 24px'
          }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>Ready to level up your trading?</h2>
            <p style={{ color: '#d1d4dc', marginBottom: '24px' }}>Join 10,000+ traders who've transformed their backtesting</p>
            <button 
              onClick={handleEnterApp}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #ff6b00, #ff8c00)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #e55f00, #ff7700)'}
              onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ff6b00, #ff8c00)'}
            >
              Start Your 5-Day Free Trial ⚡
            </button>
            <p style={{ fontSize: '12px', color: '#787b86', marginTop: '16px' }}>No credit card required • Cancel anytime</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
