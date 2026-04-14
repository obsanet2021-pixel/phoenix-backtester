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
import PhoenixChallenge from './pages/PhoenixChallenge'
import PhoenixChart from './pages/PhoenixChart'
import PhoenixBacktester from './components/PhoenixBacktesterNew'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import RiskDisclaimer from './pages/RiskDisclaimer'
import Contact from './pages/Contact'
import { AuthProvider, useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  return children
}

function AppContent() {
  return (
    <Routes>
      {/* Welcome landing page */}
      <Route path="/" element={<Welcome />} />
      
      {/* Login page */}
      <Route path="/login" element={<Login />} />
      
      {/* Privacy Policy */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      
      {/* Terms of Service */}
      <Route path="/terms" element={<TermsOfService />} />
      
      {/* Risk Disclaimer */}
      <Route path="/disclaimer" element={<RiskDisclaimer />} />
      
      {/* Contact */}
      <Route path="/contact" element={<Contact />} />
      
      {/* Dashboard routes with sidebar */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <div className="app">
            <PhoenixSidebar />
            <div className="main">
              <ErrorBoundary>
                <PhoenixDashboard />
              </ErrorBoundary>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/journal" element={
        <ProtectedRoute>
          <div className="app">
            <PhoenixSidebar />
            <div className="main">
              <ErrorBoundary>
                <PhoenixJournal />
              </ErrorBoundary>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/analytics" element={
        <ProtectedRoute>
          <div className="app">
            <PhoenixSidebar />
            <div className="main">
              <ErrorBoundary>
                <PhoenixAnalytics />
              </ErrorBoundary>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute>
          <div className="app">
            <PhoenixSidebar />
            <div className="main">
              <ErrorBoundary>
                <PhoenixReports />
              </ErrorBoundary>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/trades" element={
        <ProtectedRoute>
          <div className="app">
            <PhoenixSidebar />
            <div className="main">
              <ErrorBoundary>
                <PhoenixTrades />
              </ErrorBoundary>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/backtest" element={
        <ProtectedRoute>
          <div className="app">
            <PhoenixSidebar />
            <div className="main">
              <ErrorBoundary>
                <PhoenixBacktest />
              </ErrorBoundary>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/simulator" element={
        <ProtectedRoute>
          <div className="app">
            <PhoenixSidebar />
            <div className="main">
              <ErrorBoundary>
                <PhoenixSimulator />
              </ErrorBoundary>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/challenge" element={
        <ProtectedRoute>
          <div className="app">
            <PhoenixSidebar />
            <div className="main">
              <ErrorBoundary>
                <PhoenixChallenge />
              </ErrorBoundary>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/chart" element={
        <ProtectedRoute>
          <div className="app">
            <PhoenixSidebar />
            <div className="main">
              <ErrorBoundary>
                <PhoenixChart />
              </ErrorBoundary>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      {/* Phoenix Backtester standalone route */}
      <Route path="/phoenix-backtester" element={<PhoenixBacktester />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
