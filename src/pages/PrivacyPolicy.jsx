import React from 'react'

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              1. Information We Collect
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#9ca3af', lineHeight: 1.6 }}>
              <p>We collect the following types of information:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong style={{ color: '#fff' }}>Account Information:</strong> Email address, name, and authentication data when you create an account</li>
                <li><strong style={{ color: '#fff' }}>Trading Data:</strong> Backtest results, trade history, strategy configurations, and performance metrics</li>
                <li><strong style={{ color: '#fff' }}>Usage Data:</strong> Session information, page views, and feature usage patterns</li>
                <li><strong style={{ color: '#fff' }}>Technical Data:</strong> IP address, browser type, device information, and cookies</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              2. How We Use Your Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#9ca3af', lineHeight: 1.6 }}>
              <p>We use your information to:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Provide and maintain the backtesting platform</li>
                <li>Process and store your backtest results and trading data</li>
                <li>Authenticate your account and provide secure access</li>
                <li>Improve our services and develop new features</li>
                <li>Send you important updates about your account (with your consent)</li>
                <li>Respond to your support requests and inquiries</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              3. Data Storage and Security
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#9ca3af', lineHeight: 1.6 }}>
              <p>Your data is stored securely using:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Encryption in transit (HTTPS/TLS)</li>
                <li>Encrypted local storage for sensitive data</li>
                <li>Secure authentication protocols</li>
                <li>Regular security audits and updates</li>
              </ul>
              <p>We retain your data for as long as your account is active, or as required by law. You may request deletion of your account and associated data at any time.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              4. Data Sharing
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#9ca3af', lineHeight: 1.6 }}>
              <p>We do not sell your personal data to third parties. We may share your data only in the following circumstances:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect our rights, property, or safety</li>
                <li>With service providers who assist in operating our platform (under strict confidentiality agreements)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              5. Your Rights
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#9ca3af', lineHeight: 1.6 }}>
              <p>You have the right to:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              6. Cookies and Tracking
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#9ca3af', lineHeight: 1.6 }}>
              <p>We use cookies and similar technologies to:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Maintain your session and authentication state</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized features</li>
              </ul>
              <p>You can control cookies through your browser settings, but this may affect platform functionality.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              7. Third-Party Services
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#9ca3af', lineHeight: 1.6 }}>
              <p>Our platform integrates with third-party services including:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong style={{ color: '#fff' }}>Google OAuth:</strong> For authentication and account creation</li>
                <li><strong style={{ color: '#fff' }}>TradingView:</strong> For charting and market data display</li>
              </ul>
              <p>These services have their own privacy policies which you should review. We are not responsible for their data practices.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              8. Children's Privacy
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#9ca3af', lineHeight: 1.6 }}>
              <p>Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will take steps to delete it.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              9. Changes to This Policy
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#9ca3af', lineHeight: 1.6 }}>
              <p>We may update this privacy policy from time to time. We will notify you of significant changes by:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Posting the updated policy on this page</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a prominent notice in the platform</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff6b00' }}>
              10. Contact Us
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#9ca3af', lineHeight: 1.6 }}>
              <p>If you have questions about this privacy policy or your personal data, please contact us:</p>
              <ul style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong style={{ color: '#fff' }}>Email:</strong> support@phoenixbacktest.xyz</li>
                <li><strong style={{ color: '#fff' }}>Website:</strong> https://phoenixbacktest.xyz</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
