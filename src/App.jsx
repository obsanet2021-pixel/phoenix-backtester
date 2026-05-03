import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import PhoenixSidebar from './components/ui/PhoenixSidebar'
import PageLoader from './components/ui/PageLoader'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import RiskDisclaimer from './pages/RiskDisclaimer'
import Contact from './pages/Contact'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TradesProvider } from './context/TradesContext'

const PhoenixJournal = lazy(() => import('./pages/PhoenixJournal'))
const PhoenixDashboard = lazy(() => import('./pages/PhoenixDashboard'))
const PhoenixAnalytics = lazy(() => import('./pages/PhoenixAnalytics'))
const PhoenixReports = lazy(() => import('./pages/PhoenixReports'))
const PhoenixBacktest = lazy(() => import('./pages/PhoenixBacktest'))
const PhoenixTrades = lazy(() => import('./pages/PhoenixTrades'))
const PhoenixSimulator = lazy(() => import('./pages/PhoenixSimulator'))
const PhoenixChallenge = lazy(() => import('./pages/PhoenixChallenge'))
const PhoenixChart = lazy(() => import('./pages/PhoenixChart'))
const PhoenixBacktester = lazy(() => import('./components/PhoenixBacktesterNew'))

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, isConfigured } = useAuth()

  if (loading) {
    return <PageLoader title="Loading session..." />
  }

  if (isConfigured && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function SuspendedPage({ title, children }) {
  return (
    <Suspense fallback={<PageLoader title={title} />}>
      {children}
    </Suspense>
  )
}

function ProtectedLayout({ title, children }) {
  return (
    <ProtectedRoute>
      <div className="app">
        <PhoenixSidebar />
        <div className="main">
          <ErrorBoundary>
            <SuspendedPage title={title}>{children}</SuspendedPage>
          </ErrorBoundary>
        </div>
      </div>
    </ProtectedRoute>
  )
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/disclaimer" element={<RiskDisclaimer />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/dashboard" element={<ProtectedLayout title="Loading dashboard..."><PhoenixDashboard /></ProtectedLayout>} />
      <Route path="/journal" element={<ProtectedLayout title="Loading journal..."><PhoenixJournal /></ProtectedLayout>} />
      <Route path="/analytics" element={<ProtectedLayout title="Loading analytics..."><PhoenixAnalytics /></ProtectedLayout>} />
      <Route path="/reports" element={<ProtectedLayout title="Loading reports..."><PhoenixReports /></ProtectedLayout>} />
      <Route path="/trades" element={<ProtectedLayout title="Loading trades..."><PhoenixTrades /></ProtectedLayout>} />
      <Route path="/backtest" element={<ProtectedLayout title="Loading backtests..."><PhoenixBacktest /></ProtectedLayout>} />
      <Route path="/simulator" element={<ProtectedLayout title="Loading simulator..."><PhoenixSimulator /></ProtectedLayout>} />
      <Route path="/challenge" element={<ProtectedLayout title="Loading challenge..."><PhoenixChallenge /></ProtectedLayout>} />
      <Route path="/chart" element={<ProtectedLayout title="Loading chart..."><PhoenixChart /></ProtectedLayout>} />
      <Route path="/phoenix-backtester" element={<ProtectedRoute><SuspendedPage title="Loading backtester..."><PhoenixBacktester /></SuspendedPage></ProtectedRoute>} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <TradesProvider>
        <AppContent />
      </TradesProvider>
    </AuthProvider>
  )
}

export default App
