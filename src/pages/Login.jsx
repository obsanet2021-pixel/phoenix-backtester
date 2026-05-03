import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const fieldStyle = {
  width: '100%',
  padding: '12px',
  background: 'rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(255, 107, 0, 0.2)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
}

export default function Login() {
  const navigate = useNavigate()
  const { login, signup, signInWithGoogle, isConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const result = isSignup
      ? await signup(email, password, name)
      : await login(email, password)

    setSubmitting(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    navigate('/dashboard')
  }

  async function handleGoogleLogin() {
    setError('')
    const result = await signInWithGoogle()

    if (!result.success) {
      setError(result.error)
    }
  }

  // Dev mode bypass for localhost testing
  function handleDevLogin() {
    // Create a mock user session for development
    const mockUser = {
      id: 'dev-user-123',
      email: 'dev@localhost',
      name: 'Developer',
      created_at: new Date().toISOString()
    }
    localStorage.setItem('phoenix_user', JSON.stringify(mockUser))
    localStorage.setItem('phoenix_session', JSON.stringify({ 
      access_token: 'dev-token',
      expires_at: Date.now() + 86400000 // 24 hours
    }))
    navigate('/dashboard')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
          background: 'rgba(0, 0, 0, 0.88)',
          border: '1px solid rgba(255, 107, 0, 0.3)',
          borderRadius: '12px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: '#ff6b00',
              borderRadius: '8px',
              margin: '0 auto 16px',
            }}
          />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            {isSignup
              ? 'Create your account to unlock dashboards, backtests, and saved trades.'
              : 'Sign in with your Supabase account to continue.'}
          </p>
        </div>

        {!isConfigured && (
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '24px',
              color: '#f59e0b',
              fontSize: '13px',
            }}
          >
            Supabase is not configured. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable production auth.
          </div>
        )}

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '24px',
              color: '#ef4444',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>
                NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                style={fieldStyle}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={fieldStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={fieldStyle}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '14px',
              background: submitting ? '#9a3412' : '#ff6b00',
              color: '#000',
              fontSize: '16px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
            }}
          >
            {submitting ? 'PROCESSING...' : isSignup ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 107, 0, 0.2)' }} />
          <span style={{ padding: '0 16px', color: '#6b7280', fontSize: '12px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 107, 0, 0.2)' }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '12px',
            background: '#111827',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          Continue with Google
        </button>

        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#6b7280' }}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsSignup((value) => !value)
              setError('')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff6b00',
              cursor: 'pointer',
              fontSize: '14px',
              marginLeft: '4px',
              textDecoration: 'underline',
            }}
          >
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </div>

        {/* Dev Mode Login - Only on localhost */}
        {window.location.hostname === 'localhost' && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleDevLogin}
              style={{
                width: '100%',
                padding: '12px',
                background: '#22c55e',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              Dev Login (Skip Auth)
            </button>
            <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '8px' }}>
              Only available on localhost for testing
            </p>
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '12px',
              textDecoration: 'underline',
            }}
          >
            {'<- Back to landing page'}
          </button>
        </div>
      </div>
    </div>
  )
}
