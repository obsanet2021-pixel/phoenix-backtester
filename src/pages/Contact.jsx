import React from 'react'

const Contact = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000',
      color: '#fff',
      fontFamily: 'monospace',
      padding: '80px 24px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px' }}>
            Contact Us
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Get in touch with the Phoenix Backtester team
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '64px' }}>
          <div style={{ 
            background: 'rgba(255, 107, 0, 0.05)', 
            border: '1px solid rgba(255, 107, 0, 0.3)', 
            borderRadius: '8px', 
            padding: '32px' 
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              General Inquiries
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#9ca3af' }}>
              <p>For general questions, feedback, or partnership opportunities:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#6b7280' }}>Email:</span>
                <a href="mailto:support@phoenix-backtester.com" style={{ color: '#ff6b00', textDecoration: 'none' }}>
                  support@phoenix-backtester.com
                </a>
              </div>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(255, 107, 0, 0.05)', 
            border: '1px solid rgba(255, 107, 0, 0.3)', 
            borderRadius: '8px', 
            padding: '32px' 
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              Technical Support
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#9ca3af' }}>
              <p>For technical issues, bugs, or platform assistance:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#6b7280' }}>Email:</span>
                <a href="mailto:tech@phoenix-backtester.com" style={{ color: '#ff6b00', textDecoration: 'none' }}>
                  tech@phoenix-backtester.com
                </a>
              </div>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(255, 107, 0, 0.05)', 
            border: '1px solid rgba(255, 107, 0, 0.3)', 
            borderRadius: '8px', 
            padding: '32px' 
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              Business Inquiries
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#9ca3af' }}>
              <p>For enterprise solutions, API access, or business partnerships:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#6b7280' }}>Email:</span>
                <a href="mailto:business@phoenix-backtester.com" style={{ color: '#ff6b00', textDecoration: 'none' }}>
                  business@phoenix-backtester.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#ff6b00' }}>
            Response Times
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#9ca3af' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
              <span>General Inquiries</span>
              <span style={{ color: '#ff6b00' }}>24-48 hours</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
              <span>Technical Support</span>
              <span style={{ color: '#ff6b00' }}>12-24 hours</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
              <span>Business Inquiries</span>
              <span style={{ color: '#ff6b00' }}>48-72 hours</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#ff6b00' }}>
            Company Information
          </h2>
          <div style={{ 
            background: 'rgba(255, 107, 0, 0.05)', 
            border: '1px solid rgba(255, 107, 0, 0.3)', 
            borderRadius: '8px', 
            padding: '32px' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#9ca3af' }}>
              <div>
                <strong style={{ color: '#fff' }}>Company Name:</strong>
                <span> Phoenix Backtester</span>
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Website:</strong>
                <a href="https://phoenixbacktest.xyz" style={{ color: '#ff6b00', textDecoration: 'none', marginLeft: '8px' }}>
                  https://phoenixbacktest.xyz
                </a>
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Platform:</strong>
                <span> Professional-grade backtesting and trading simulation tool</span>
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Founded:</strong>
                <span> 2026</span>
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Mission:</strong>
                <span> Provide traders with professional-grade tools for strategy development and risk management</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#ff6b00' }}>
            Social Media
          </h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#" style={{ 
              padding: '12px 24px', 
              background: 'rgba(255, 107, 0, 0.1)', 
              border: '1px solid rgba(255, 107, 0, 0.3)', 
              borderRadius: '8px', 
              color: '#ff6b00', 
              textDecoration: 'none',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 107, 0, 0.2)'
              e.target.style.borderColor = 'rgba(255, 107, 0, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 107, 0, 0.1)'
              e.target.style.borderColor = 'rgba(255, 107, 0, 0.3)'
            }}>
              Twitter
            </a>
            <a href="#" style={{ 
              padding: '12px 24px', 
              background: 'rgba(255, 107, 0, 0.1)', 
              border: '1px solid rgba(255, 107, 0, 0.3)', 
              borderRadius: '8px', 
              color: '#ff6b00', 
              textDecoration: 'none',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 107, 0, 0.2)'
              e.target.style.borderColor = 'rgba(255, 107, 0, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 107, 0, 0.1)'
              e.target.style.borderColor = 'rgba(255, 107, 0, 0.3)'
            }}>
              LinkedIn
            </a>
            <a href="#" style={{ 
              padding: '12px 24px', 
              background: 'rgba(255, 107, 0, 0.1)', 
              border: '1px solid rgba(255, 107, 0, 0.3)', 
              borderRadius: '8px', 
              color: '#ff6b00', 
              textDecoration: 'none',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 107, 0, 0.2)'
              e.target.style.borderColor = 'rgba(255, 107, 0, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 107, 0, 0.1)'
              e.target.style.borderColor = 'rgba(255, 107, 0, 0.3)'
            }}>
              GitHub
            </a>
            <a href="#" style={{ 
              padding: '12px 24px', 
              background: 'rgba(255, 107, 0, 0.1)', 
              border: '1px solid rgba(255, 107, 0, 0.3)', 
              borderRadius: '8px', 
              color: '#ff6b00', 
              textDecoration: 'none',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 107, 0, 0.2)'
              e.target.style.borderColor = 'rgba(255, 107, 0, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 107, 0, 0.1)'
              e.target.style.borderColor = 'rgba(255, 107, 0, 0.3)'
            }}>
              Discord
            </a>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255, 107, 0, 0.05)', 
          border: '1px solid rgba(255, 107, 0, 0.3)', 
          borderRadius: '8px', 
          padding: '24px' 
        }}>
          <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>
            We value your feedback and are committed to providing the best possible backtesting experience. 
            Don't hesitate to reach out with any questions, suggestions, or concerns.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Contact
