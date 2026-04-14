import React from 'react'

const RiskDisclaimer = () => {
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
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: '#ef4444' }}>
            ⚠️ Risk Disclaimer
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Please read this disclaimer carefully before using Phoenix Backtester
          </p>
        </div>

        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)', 
          borderRadius: '8px', 
          padding: '24px', 
          marginBottom: '48px' 
        }}>
          <p style={{ color: '#ef4444', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
            TRADING INVOLVES SUBSTANTIAL RISK OF LOSS
          </p>
          <p style={{ color: '#fff', lineHeight: 1.6 }}>
            Phoenix Backtester is an educational and simulation tool only. It is NOT financial advice, 
            and it does NOT guarantee future trading results. You are solely responsible for your 
            trading decisions and any financial losses you may incur.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              1. No Financial Advice
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>Phoenix Backtester does NOT provide financial advice, investment recommendations, or trading signals. All content, tools, and data provided are for educational and informational purposes only.</p>
              <p>Any strategies, backtest results, or performance metrics shown are hypothetical and should not be considered as recommendations for actual trading.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              2. Backtesting Limitations
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>Backtesting has inherent limitations that you must understand:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong style={{ color: '#fff' }}>Historical data may not accurately represent future market conditions</strong></li>
                <li><strong style={{ color: '#fff' }}>Backtest results do not account for slippage, commission, or other real-world trading costs</strong></li>
                <li><strong style={{ color: '#fff' }}>Past performance does NOT guarantee future results</strong></li>
                <li><strong style={{ color: '#fff' }}>Optimization bias: Strategies may be overfitted to historical data</strong></li>
                <li><strong style={{ color: '#fff' }}>Market conditions change: What worked in the past may not work in the future</strong></li>
                <li><strong style={{ color: '#fff' }}>Liquidity constraints: Backtesting assumes perfect order execution</strong></li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              3. Trading Risk Warning
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>Trading financial instruments involves significant risk:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>You may lose more than your initial investment</li>
                <li>Market volatility can result in rapid and substantial losses</li>
                <li>Leverage amplifies both gains and losses</li>
                <li>Technical issues may prevent order execution</li>
                <li>Unexpected market events can cause sudden price movements</li>
              </ul>
              <p><strong style={{ color: '#ef4444' }}>Only trade with money you can afford to lose.</strong></p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              4. Data Accuracy
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>Phoenix Backtester uses third-party data providers for market data. While we strive to provide accurate data:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>We do NOT guarantee the accuracy, completeness, or timeliness of any data</li>
                <li>Data may contain errors or be delayed</li>
                <li>Historical data may be adjusted or corrected over time</li>
                <li>You should verify data from multiple sources before making trading decisions</li>
              </ul>
              <p>We are not responsible for any trading decisions made based on inaccurate or incomplete data.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              5. No Guarantee of Results
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p><strong style={{ color: '#fff' }}>Phoenix Backtester does NOT guarantee:</strong></p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Profitable trading results</li>
                <li>Any specific level of returns</li>
                <li>Success of any trading strategy</li>
                <li>Accuracy of backtest predictions</li>
                <li>Performance of any trading system</li>
              </ul>
              <p>All trading involves risk, and you may lose some or all of your invested capital.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              6. Professional Advice
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>Before engaging in any trading activity, you should:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Consult with a qualified financial advisor</li>
                <li>Thoroughly understand the risks involved</li>
                <li>Only invest money you can afford to lose</li>
                <li>Consider your financial situation, investment objectives, and risk tolerance</li>
                <li>Educate yourself about trading and financial markets</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              7. Limitation of Liability
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>Phoenix Backtester and its affiliates shall NOT be liable for:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Any trading losses you incur</li>
                <li>Decisions made based on information from this platform</li>
                <li>Errors or inaccuracies in data provided</li>
                <li>Service interruptions or downtime</li>
                <li>Any direct, indirect, incidental, or consequential damages</li>
              </ul>
              <p>Use of this platform is at your own risk.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              8. Suitability
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>Trading may NOT be suitable for everyone. You should NOT trade if you:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Cannot afford to lose your investment</li>
                <li>Have limited understanding of financial markets</li>
                <li>Are prone to emotional trading decisions</li>
                <li>Are seeking guaranteed returns</li>
                <li>Have outstanding debts or financial obligations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              9. Acknowledgment
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>By using Phoenix Backtester, you acknowledge that you:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Have read and understood this Risk Disclaimer</li>
                <li>Understand that trading involves substantial risk of loss</li>
                <li>Are using this platform at your own risk</li>
                <li>Are solely responsible for your trading decisions</li>
                <li>Will not hold Phoenix Backtester liable for any trading losses</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              10. Contact
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>If you have questions about this Risk Disclaimer, please contact us:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong style={{ color: '#fff' }}>Email:</strong> support@phoenixbacktest.xyz</li>
                <li><strong style={{ color: '#fff' }}>Website:</strong> https://phoenixbacktest.xyz</li>
              </ul>
            </div>
          </section>
        </div>

        <div style={{ 
          marginTop: '64px', 
          padding: '24px', 
          background: 'rgba(255, 107, 0, 0.1)', 
          border: '1px solid rgba(255, 107, 0, 0.3)', 
          borderRadius: '8px' 
        }}>
          <p style={{ color: '#ff6b00', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
            TRADE RESPONSIBLY. ONLY INVEST WHAT YOU CAN AFFORD TO LOSE.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RiskDisclaimer
