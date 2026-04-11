import React from 'react'
import phoenixLogo from '../assets/phoenix-logo.png'

const PhoenixSidebar = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', section: 'Main', icon: 'grid' },
    { id: 'analytics', label: 'Analytics', section: 'Main', icon: 'chart' },
    { id: 'reports', label: 'Reports', section: 'Main', icon: 'document' },
    { id: 'trades', label: 'Trades', section: 'Tools', icon: 'monitor' },
    { id: 'backtest', label: 'Backtest', section: 'Tools', icon: 'refresh' },
    { id: 'journal', label: 'Journal', section: 'Tools', icon: 'book' },
    { id: 'simulator', label: 'Simulator', section: 'Tools', icon: 'sun' },
    { id: 'challenge', label: 'Challenge', section: 'Tools', icon: 'target' }
  ]

  const getIcon = (iconName) => {
    const icons = {
      grid: (
        <svg className="nav-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1"></rect>
        </svg>
      ),
      chart: (
        <svg className="nav-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
      document: (
        <svg className="nav-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      ),
      monitor: (
        <svg className="nav-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="14" rx="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
      refresh: (
        <svg className="nav-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="17 1 21 5 17 9"></polyline>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
          <polyline points="7 23 3 19 7 15"></polyline>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
        </svg>
      ),
      book: (
        <svg className="nav-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      sun: (
        <svg className="nav-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"></path>
        </svg>
      ),
      target: (
        <svg className="nav-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      )
    }
    return icons[iconName] || icons.grid
  }

  const groupedItems = navItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={phoenixLogo} alt="Phoenix Logo" className="logo-image" />
        <div>
          <div className="logo-text">Phoenix</div>
          <div className="logo-sub">Backtester</div>
        </div>
      </div>
      <div className="nav">
        {Object.entries(groupedItems).map(([section, items]) => (
          <React.Fragment key={section}>
            <div className="nav-section">{section}</div>
            {items.map(item => (
              <div
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                {getIcon(item.icon)}
                {item.label}
                {activePage === item.id && <div className="dot"></div>}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="sidebar-bottom">
        <div className="account-badge">
          <div className="acct-avatar">PX</div>
          <div className="acct-info">
            <div className="acct-name">Phoenix Challenge</div>
            <div className="acct-status">
              <div className="pulse"></div> Active · $10k Eval
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhoenixSidebar
