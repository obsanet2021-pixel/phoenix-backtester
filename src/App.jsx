import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import PhoenixSidebar from './components/ui/PhoenixSidebar'
import PhoenixJournal from './pages/PhoenixJournal'
import PhoenixDashboard from './pages/PhoenixDashboard'
import PhoenixAnalytics from './pages/PhoenixAnalytics'
import PhoenixReports from './pages/PhoenixReports'
import PhoenixBacktest from './pages/PhoenixBacktest'
import PhoenixTrades from './pages/PhoenixTrades'
import PhoenixSimulator from './pages/PhoenixSimulator'
import PhoenixChallengeFixed from './pages/PhoenixChallengeFixed'
import PhoenixJournalFixed from './pages/PhoenixJournalFixed'
import PhoenixChart from './pages/PhoenixChart'
import StandaloneReplayChart from './pages/StandaloneReplayChart'
import StandaloneBacktester from './pages/StandaloneBacktester'
import PhoenixBacktesterFixed from './components/PhoenixBacktesterFixed'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'journal':
        return (
          <ErrorBoundary>
            <PhoenixJournalFixed />
          </ErrorBoundary>
        )
      case 'dashboard':
        return (
          <ErrorBoundary>
            <PhoenixDashboard />
          </ErrorBoundary>
        )
      case 'analytics':
        return (
          <ErrorBoundary>
            <PhoenixAnalytics />
          </ErrorBoundary>
        )
      case 'reports':
        return (
          <ErrorBoundary>
            <PhoenixReports />
          </ErrorBoundary>
        )
      case 'trades':
        return (
          <ErrorBoundary>
            <PhoenixTrades />
          </ErrorBoundary>
        )
      case 'simulator':
        return (
          <ErrorBoundary>
            <PhoenixSimulator />
          </ErrorBoundary>
        )
      case 'challenge':
        return (
          <ErrorBoundary>
            <PhoenixChallengeFixed />
          </ErrorBoundary>
        )
      case 'chart':
        return (
          <ErrorBoundary>
            <PhoenixChart />
          </ErrorBoundary>
        )
      case 'backtest':
        return (
          <ErrorBoundary>
            <PhoenixBacktest setActivePage={setActivePage} />
          </ErrorBoundary>
        )
      default:
        return (
          <ErrorBoundary>
            <PhoenixDashboard />
          </ErrorBoundary>
        )
    }
  }

  return (
    <Routes>
      {/* Standalone replay chart route */}
      <Route path="/replay-chart" element={<StandaloneReplayChart />} />
      <Route path="/backtester" element={<StandaloneBacktester />} />
      <Route path="/phoenix-backtester" element={<PhoenixBacktesterFixed />} />
      
      {/* Main app with sidebar */}
      <Route path="/*" element={
        <div className="app">
          <PhoenixSidebar activePage={activePage} setActivePage={setActivePage} />
          <div className="main">
            {renderPage()}
          </div>
        </div>
      } />
    </Routes>
  )
}

export default App
