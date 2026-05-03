import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    function handleMouseMove(event) {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const ctaTarget = isAuthenticated ? '/dashboard' : '/login'

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#000', overflow: 'hidden', fontFamily: 'monospace' }}>
      {/* Background grid with parallax */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: '0.2',
          backgroundImage: `
            linear-gradient(rgba(255, 107, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }}
      />

      {/* Top-left glow circle */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '80px',
          width: '384px',
          height: '384px',
          background: 'rgb(255, 107, 0)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.2,
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
        }}
      />

      {/* Bottom-right glow circle */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          right: '80px',
          width: '384px',
          height: '384px',
          background: 'rgb(255, 140, 58)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.2,
          transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`,
        }}
      />

      <nav style={{ position: 'relative', zIndex: 10, borderBottom: '1px solid rgba(255, 107, 0, 0.2)', background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/phoenix-logo.png" alt="Phoenix" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '20px', letterSpacing: '-0.05em' }}>
              PHOENIX<span style={{ color: '#ff6b00' }}>_BT</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#features" className="desktop-nav" style={{ fontFamily: 'monospace', fontSize: '14px', color: '#9ca3af', textDecoration: 'none', display: 'none' }}>
              [features]
            </a>
            <a href="#demo" className="desktop-nav" style={{ fontFamily: 'monospace', fontSize: '14px', color: '#9ca3af', textDecoration: 'none', display: 'none' }}>
              [demo]
            </a>
            <button
              onClick={() => navigate(ctaTarget)}
              style={{
                padding: '8px 16px',
                background: '#ff6b00',
                color: '#000',
                fontFamily: 'monospace',
                fontSize: '14px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                transition: '0.2s',
              }}
            >
              ENTER_TERMINAL →
            </button>
          </div>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.8)', border: '1px solid rgba(255, 107, 0, 0.3)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#ff6b00' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff6b00' }} />
              <span style={{ marginLeft: '16px' }}>root@phoenix:~/backtester</span>
            </div>
          </div>

          <div className="terminal-content" style={{ background: 'rgba(0, 0, 0, 0.9)', border: '1px solid rgba(255, 107, 0, 0.3)', borderTop: 'none', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', padding: '32px', fontFamily: 'monospace' }}>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ color: '#9ca3af' }}>./deploy --strategy=aggressive</span>
            </div>

            <h1 className="hero-title" style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '-0.05em', lineHeight: 1.1 }}>
              <span style={{ color: '#fff' }}>&gt;_ Backtest like a predator. Trade like a pro.</span>
              <span className="cursor" style={{ color: '#ff6b00' }}>_</span>
            </h1>

            <p className="hero-desc" style={{ color: '#9ca3af', fontSize: '18px', marginBottom: '32px', maxWidth: '600px', fontFamily: 'monospace', lineHeight: 1.6 }}>
              &gt; Professional backtesting with prop firm challenges, real-time analytics, and execution-grade data. <span style={{ color: '#ff6b00' }}>No more guessing.</span>
            </p>

            <div className="hero-buttons" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(ctaTarget)}
                style={{
                  padding: '16px 32px',
                  background: '#ff6b00',
                  color: '#000',
                  fontFamily: 'monospace',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  transition: '0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                INITIALIZE_SESSION →
              </button>
              <button
                onClick={() => navigate(isAuthenticated ? '/simulator' : '/login')}
                style={{
                  padding: '16px 32px',
                  background: 'transparent',
                  color: '#ff6b00',
                  fontFamily: 'monospace',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  border: '1px solid #ff6b00',
                  cursor: 'pointer',
                  transition: '0.2s',
                }}
              >
                [TRY_DEMO]
              </button>
            </div>

            <div className="stats-bar" style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255, 107, 0, 0.2)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              <div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>ACTIVE_TRADERS</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>10,428</div>
                <div style={{ color: '#ff6b00', fontSize: '12px' }}>↑ +23% this month</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>AVG_WIN_RATE</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>68.7%</div>
                <div style={{ color: '#ff6b00', fontSize: '12px' }}>↑ +12% improvement</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>BACKTEST_HOURS</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>247,891</div>
                <div style={{ color: '#ff6b00', fontSize: '12px' }}>executed this week</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>PROP_CHALLENGES</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>3,247</div>
                <div style={{ color: '#ff6b00', fontSize: '12px' }}>completed successfully</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker/Marquee */}
        <div style={{ marginTop: '80px', overflow: 'hidden', borderTop: '1px solid rgba(255, 107, 0, 0.2)', borderBottom: '1px solid rgba(255, 107, 0, 0.2)', background: 'rgba(0, 0, 0, 0.5)', padding: '8px 0' }}>
          <div className="animate-marquee" style={{ whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '14px' }}>
            <span style={{ color: '#ff6b00' }}>XAU/USD</span> <span style={{ color: '#fff' }}>$2,342.80</span> <span style={{ color: '#22c55e' }}>↑ +0.34%</span>
            <span style={{ margin: '0 32px', color: '#4b5563' }}>||</span>
            <span style={{ color: '#ff6b00' }}>EUR/USD</span> <span style={{ color: '#fff' }}>1.0892</span> <span style={{ color: '#ef4444' }}>↓ -0.12%</span>
            <span style={{ margin: '0 32px', color: '#4b5563' }}>||</span>
            <span style={{ color: '#ff6b00' }}>BTC/USD</span> <span style={{ color: '#fff' }}>$52,340</span> <span style={{ color: '#22c55e' }}>↑ +2.15%</span>
            <span style={{ margin: '0 32px', color: '#4b5563' }}>||</span>
            <span style={{ color: '#ff6b00' }}>SPX</span> <span style={{ color: '#fff' }}>5,234.56</span> <span style={{ color: '#22c55e' }}>↑ +0.67%</span>
            <span style={{ margin: '0 32px', color: '#4b5563' }}>||</span>
            <span style={{ color: '#ff6b00' }}>OIL</span> <span style={{ color: '#fff' }}>$78.34</span> <span style={{ color: '#ef4444' }}>↓ -0.45%</span>
          </div>
        </div>

        {/* SYSTEM CAPABILITIES */}
        <div id="features" style={{ marginTop: '128px' }}>
          <div className="features-header" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontFamily: 'monospace', color: '#ff6b00', fontSize: '14px', marginBottom: '16px' }}>[ SYSTEM_CAPABILITIES ]</div>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', fontFamily: 'monospace' }}>
              We don't guess. <span style={{ color: '#ff6b00' }}>We execute.</span>
            </h2>
          </div>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(255, 107, 0, 0.2)', padding: '24px', transition: '0.2s' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>⚡</div>
              <div style={{ fontFamily: 'monospace', color: '#ff6b00', fontSize: '14px', marginBottom: '8px' }}>REAL-TIME_ANALYTICS</div>
              <p style={{ color: '#9ca3af', marginBottom: '16px', lineHeight: 1.6 }}>
                Watch your performance metrics update in real-time as you trade. No delays, no excuses.
              </p>
              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 107, 0, 0.2)' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>&lt; 100ms</div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>latency</div>
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(255, 107, 0, 0.2)', padding: '24px', transition: '0.2s' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🎯</div>
              <div style={{ fontFamily: 'monospace', color: '#ff6b00', fontSize: '14px', marginBottom: '8px' }}>PROP_FIRM_SIM</div>
              <p style={{ color: '#9ca3af', marginBottom: '16px', lineHeight: 1.6 }}>
                Practice with actual prop firm rules - daily loss limits, drawdowns, and profit targets.
              </p>
              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 107, 0, 0.2)' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>98.4%</div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>accuracy rate</div>
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(255, 107, 0, 0.2)', padding: '24px', transition: '0.2s' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>📊</div>
              <div style={{ fontFamily: 'monospace', color: '#ff6b00', fontSize: '14px', marginBottom: '8px' }}>DEEP_ANALYSIS</div>
              <p style={{ color: '#9ca3af', marginBottom: '16px', lineHeight: 1.6 }}>
                Win rates, RR ratios, drawdowns, Monte Carlo simulations - every metric you need.
              </p>
              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 107, 0, 0.2)' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>40+</div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>analytics metrics</div>
              </div>
            </div>
          </div>
        </div>

        {/* SIMULATED DEMO */}
        <div id="demo" style={{ marginTop: '128px' }}>
          <div className="demo-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontFamily: 'monospace', color: '#ff6b00', fontSize: '14px', marginBottom: '8px' }}>[ SIMULATED_DEMO ]</div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>See the matrix in action</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>Interactive demo with simulated data for illustration purposes</p>
          </div>

          <div className="demo-container" style={{ background: 'rgba(0, 0, 0, 0.8)', border: '1px solid rgba(255, 107, 0, 0.3)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(255, 107, 0, 0.1)', padding: '16px', borderBottom: '1px solid rgba(255, 107, 0, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#ff6b00', borderRadius: '50%' }} />
                  <span style={{ fontFamily: 'monospace', fontSize: '14px', color: '#ff6b00' }}>LIVE_DATA_STREAM</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>refresh: 1.2ms</div>
              </div>
            </div>

            <div className="demo-content" style={{ padding: '24px' }}>
              <div className="demo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div className="kpi-grid" style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  <div style={{ background: 'rgba(255, 107, 0, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>TOTAL_PNL</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>+$3,048</div>
                    <div style={{ fontSize: '12px', fontFamily: 'monospace', marginTop: '4px', color: '#22c55e' }}>+3.05%</div>
                  </div>
                  <div style={{ background: 'rgba(255, 107, 0, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>WIN_RATE</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>66.7%</div>
                    <div style={{ fontSize: '12px', fontFamily: 'monospace', marginTop: '4px', color: '#22c55e' }}>+12.3%</div>
                  </div>
                  <div style={{ background: 'rgba(255, 107, 0, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>PROFIT_FACTOR</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>1.85</div>
                    <div style={{ fontSize: '12px', fontFamily: 'monospace', marginTop: '4px', color: '#22c55e' }}>+0.23</div>
                  </div>
                  <div style={{ background: 'rgba(255, 107, 0, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>SHARPE_RATIO</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>1.92</div>
                    <div style={{ fontSize: '12px', fontFamily: 'monospace', marginTop: '4px', color: '#22c55e' }}>excellent</div>
                  </div>
                </div>

                <div className="trade-feed" style={{ gridColumn: '1 / 3', background: 'rgba(255, 107, 0, 0.05)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>[ RECENT_EXECUTIONS ]</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ color: '#22c55e' }}>BUY</span>
                        <span style={{ color: '#fff' }}>XAU/USD</span>
                        <span style={{ color: '#6b7280' }}>2.5</span>
                        <span style={{ color: '#6b7280' }}>2342.80</span>
                      </div>
                      <div style={{ color: '#22c55e' }}>+$2,024</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ color: '#ef4444' }}>SELL</span>
                        <span style={{ color: '#fff' }}>XAU/USD</span>
                        <span style={{ color: '#6b7280' }}>1.0</span>
                        <span style={{ color: '#6b7280' }}>2345.20</span>
                      </div>
                      <div style={{ color: '#ef4444' }}>-$500</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ color: '#22c55e' }}>BUY</span>
                        <span style={{ color: '#fff' }}>EUR/USD</span>
                        <span style={{ color: '#6b7280' }}>5.0</span>
                        <span style={{ color: '#6b7280' }}>1.0892</span>
                      </div>
                      <div style={{ color: '#22c55e' }}>+$1,524</div>
                    </div>
                  </div>
                </div>

                <div className="equity-curve" style={{ background: 'rgba(255, 107, 0, 0.05)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>[ EQUITY_CURVE ]</div>
                  <div style={{ height: '128px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                    {[40, 45, 42, 48, 55, 52, 58, 65, 62, 70, 75, 72, 78, 85, 82, 88, 95, 92, 100].map((height, i) => (
                      <div key={i} style={{ flex: 1, background: 'rgba(255, 107, 0, 0.3)', transition: '0.2s', height: `${height}%` }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    <span>04:00</span>
                    <span>12:00</span>
                    <span>20:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* POWERED BY */}
        <div style={{ marginTop: '96px', marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontFamily: 'monospace', color: '#6b7280', fontSize: '12px', marginBottom: '16px' }}>[ POWERED_BY ]</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace', color: '#fff' }}>Trusted Partners</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '64px', flexWrap: 'wrap', padding: '48px', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '40px 32px', transition: '0.3s' }}>
              <img alt="TradingView" src="https://cdn.prod.website-files.com/667eb56e859feb725a6a82a1/66a87765de26441ae13d3cbf_tt-light.svg" style={{ width: '240px', height: '89px', objectFit: 'contain' }} />
              <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>TradingView</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px 32px', transition: '0.3s' }}>
              <img alt="Yunix Official" src="/yunix logo.png" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
              <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>Yunix</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ marginTop: '128px', marginBottom: '80px' }}>
          <div className="cta-section" style={{ background: 'linear-gradient(90deg, rgba(255, 107, 0, 0.1), transparent, rgba(255, 107, 0, 0.1))', borderTop: '1px solid rgba(255, 107, 0, 0.3)', borderBottom: '1px solid rgba(255, 107, 0, 0.3)', padding: '64px 24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', color: '#ff6b00', fontSize: '14px', marginBottom: '16px' }}>[ READY_FOR_DEPLOYMENT ]</div>
              <h2 className="cta-title" style={{ fontSize: '36px', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '24px' }}>Stop backtesting in spreadsheets.</h2>
              <p className="cta-desc" style={{ color: '#9ca3af', fontSize: '18px', margin: '0 auto 32px', maxWidth: '600px' }}>
                Professional-grade backtesting with real-time analytics and execution-grade data.
              </p>
              <button
                onClick={() => navigate(ctaTarget)}
                style={{
                  padding: '16px 32px',
                  background: 'rgb(255, 107, 0)',
                  color: 'rgb(0, 0, 0)',
                  fontFamily: 'monospace',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  transition: '0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto',
                }}
              >
                START THE JOURNEY →
              </button>
              <div style={{ marginTop: '24px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                No credit card required. Cancel anytime.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid rgba(255, 107, 0, 0.2)', padding: '48px 24px', background: 'rgba(0, 0, 0, 0.8)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="/privacy" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontFamily: 'monospace' }}>Privacy Policy</a>
                <a href="/terms" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontFamily: 'monospace' }}>Terms of Service</a>
                <a href="/disclaimer" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontFamily: 'monospace' }}>Risk Disclaimer</a>
                <a href="/contact" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontFamily: 'monospace' }}>Contact</a>
              </div>
              <div style={{ color: '#4b5563', fontSize: '12px', fontFamily: 'monospace', textAlign: 'center' }}>
                © 2026 Phoenix Backtester. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .cursor {
          animation: pulse 1s ease infinite;
        }
      `}</style>
    </div>
  )
}
