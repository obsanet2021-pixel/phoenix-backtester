import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
          <div className="luxury-card max-w-2xl w-full p-8 text-center">
            <h2 className="text-3xl font-black text-ruby-glow mb-4">Something went wrong</h2>
            <p className="text-slate-300 mb-6">
              This page encountered an error. The rest of the app is still working.
            </p>
            <div className="bg-black/50 rounded-lg p-4 mb-6 text-left">
              <p className="text-emerald text-sm font-semibold mb-2">Error details:</p>
              <p className="text-slate-400 text-xs font-mono break-all">
                {this.state.error && this.state.error.toString()}
              </p>
            </div>
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="btn-luxury bg-emerald/20 border-emerald/50 text-emerald-glow hover:bg-emerald/30 hover:border-emerald/70"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
