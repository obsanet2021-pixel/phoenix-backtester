import React from 'react'

const TermsOfService = () => {
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
            Terms of Service
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              1. Acceptance of Terms
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>By accessing or using Phoenix Backtester ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.</p>
              <p>These Terms constitute a legally binding agreement between you and Phoenix Backtester. We reserve the right to modify these Terms at any time. Your continued use of the Service after any changes constitutes acceptance of the updated Terms.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              2. Description of Service
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>Phoenix Backtester is a financial backtesting platform that allows users to:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Test trading strategies on historical market data</li>
                <li>Analyze performance metrics and risk parameters</li>
                <li>Store and manage trading data and results</li>
                <li>View real-time market data through integrated charting tools</li>
              </ul>
              <p>The Service is provided "as is" and may include third-party data and tools. We do not guarantee the accuracy, completeness, or timeliness of any data or information provided.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              3. User Accounts
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>To use certain features of the Service, you must create an account. You agree to:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information to keep it accurate</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be responsible for all activities that occur under your account</li>
              </ul>
              <p>You may not create multiple accounts without our permission. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              4. Acceptable Use
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to the Service or related systems</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated tools to access the Service without permission</li>
                <li>Reverse engineer or attempt to extract source code from the Service</li>
                <li>Use the Service to create derivative works or competing products</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              5. Financial Disclaimer
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p><strong style={{ color: '#fff' }}>IMPORTANT:</strong> Phoenix Backtester is a simulation and educational tool only. It is NOT financial advice, and it does NOT guarantee future trading results.</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Past performance does not guarantee future results</li>
                <li>Backtesting results may not accurately reflect live trading conditions</li>
                <li>Trading involves substantial risk of loss and is not suitable for all investors</li>
                <li>You are solely responsible for your trading decisions and outcomes</li>
                <li>We are not responsible for any financial losses incurred through use of this Service</li>
              </ul>
              <p>Consult a qualified financial advisor before making any trading decisions.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              6. Intellectual Property
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>All content, features, and functionality of the Service are owned by Phoenix Backtester and are protected by copyright, trademark, and other intellectual property laws.</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>You may not reproduce, distribute, or create derivative works of our content</li>
                <li>You retain ownership of your trading data and backtest results</li>
                <li>Third-party data providers retain ownership of their data</li>
                <li>TradingView and other partner trademarks are property of their respective owners</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              7. Data and Content
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>You are responsible for all content you upload, store, or create using the Service. You agree to:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Ensure your content does not violate any laws or third-party rights</li>
                <li>Grant us a license to store, process, and display your content for Service operation</li>
                <li>Understand that we may retain data for legal or security purposes even after account deletion</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              8. Limitation of Liability
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>To the maximum extent permitted by law, Phoenix Backtester shall not be liable for:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Any indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Trading losses resulting from use of the Service</li>
                <li>Errors or inaccuracies in data provided through the Service</li>
                <li>Service interruptions or downtime</li>
              </ul>
              <p>Our total liability shall not exceed the amount you paid for the Service, if any, in the twelve months preceding the claim.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              9. Termination
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>We reserve the right to terminate or suspend your account and access to the Service at any time, with or without cause, with or without notice.</p>
              <p>Upon termination, your right to use the Service will immediately cease. We may delete your account data in accordance with our data retention policies.</p>
              <p>You may terminate your account at any time by contacting us or using account deletion features.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              10. Indemnification
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>You agree to indemnify and hold harmless Phoenix Backtester and its affiliates from any claims, damages, or expenses arising from:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Content you upload or create using the Service</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              11. Governing Law
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising under these Terms shall be resolved in the appropriate courts.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              12. Changes to Terms
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>We may modify these Terms at any time. We will notify users of significant changes by posting on the Service or sending email notifications. Your continued use of the Service after changes constitutes acceptance.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              13. Contact Information
            </h2>
            <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              <p>For questions about these Terms of Service, please contact us:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong style={{ color: '#fff' }}>Email:</strong> support@phoenix-backtester.com</li>
                <li><strong style={{ color: '#fff' }}>Website:</strong> https://phoenixbacktest.xyz</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
