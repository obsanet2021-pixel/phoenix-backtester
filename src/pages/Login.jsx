import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login, googleLogin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const googleButtonRef = useRef(null)

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual Google OAuth client ID
        callback: handleGoogleResponse,
        auto_select: false,
      })

      // Render the Google Sign-In button
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'filled_black',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signin_with',
        logo_alignment: 'left',
        width: '100%'
      })
    }
  }, [])

  const handleGoogleResponse = (response) => {
    const payload = JSON.parse(atob(response.credential.split('.')[1]))
    const result = googleLogin(payload)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  const handleGoogleSignIn = () => {
    // For demo purposes, simulate Google sign-in
    const mockGoogleUser = {
      sub: '123456789',
      email: email || 'user@gmail.com',
      name: name || 'Google User',
      picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
    }
    const result = googleLogin(mockGoogleUser)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#000',
      fontFamily: 'monospace'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        padding: '40px',
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(255, 107, 0, 0.3)',
        borderRadius: '12px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: '#ff6b00', 
            borderRadius: '8px',
            margin: '0 auto 16px'
          }} />
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#fff',
            marginBottom: '8px'
          }}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            {isSignup ? 'Sign up to start backtesting' : 'Sign in to your Phoenix account'}
          </p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '24px',
            color: '#ef4444',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                color: '#9ca3af', 
                fontSize: '12px', 
                marginBottom: '8px' 
              }}>
                NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 107, 0, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff6b00'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 107, 0, 0.2)'}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              color: '#9ca3af', 
              fontSize: '12px', 
              marginBottom: '8px' 
            }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 107, 0, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff6b00'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 107, 0, 0.2)'}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              color: '#9ca3af', 
              fontSize: '12px', 
              marginBottom: '8px' 
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 107, 0, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff6b00'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 107, 0, 0.2)'}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#ff6b00',
              color: '#000',
              fontSize: '16px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '16px'
            }}
            onMouseEnter={(e) => { e.target.style.background = '#ff8c3a'; }}
            onMouseLeave={(e) => { e.target.style.background = '#ff6b00'; }}
          >
            {isSignup ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </form>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          margin: '24px 0' 
        }}>
          <div style={{ 
            flex: 1, 
            height: '1px', 
            background: 'rgba(255, 107, 0, 0.2)' 
          }} />
          <span style={{ 
            padding: '0 16px', 
            color: '#6b7280', 
            fontSize: '12px' 
          }}>
            OR
          </span>
          <div style={{ 
            flex: 1, 
            height: '1px', 
            background: 'rgba(255, 107, 0, 0.2)' 
          }} />
        </div>

        <button
          onClick={handleGoogleSignIn}
          style={{
            width: '100%',
            padding: '14px',
            background: '#fff',
            color: '#000',
            fontSize: '16px',
            fontWeight: 'bold',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
          onMouseEnter={(e) => { 
            e.target.style.background = '#f8f9fa'; 
            e.target.style.borderColor = '#e0e0e0';
          }}
          onMouseLeave={(e) => { 
            e.target.style.background = '#fff'; 
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isSignup ? 'Sign up with Google' : 'Sign in with Google'}
        </button>

        {/* Hidden div for Google Sign-In button rendering */}
        <div ref={googleButtonRef} style={{ display: 'none' }} />

        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#6b7280' }}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            onClick={() => {
              setIsSignup(!isSignup)
              setError('')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff6b00',
              cursor: 'pointer',
              fontSize: '14px',
              marginLeft: '4px',
              textDecoration: 'underline'
            }}
          >
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '12px',
              textDecoration: 'underline'
            }}
          >
            ← Back to landing page
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
