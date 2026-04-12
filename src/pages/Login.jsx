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
        client_id: '262676848910-5b3m9lujbu0cm7dmp21rc3t16sup4hfg.apps.googleusercontent.com',
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


  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (isSignup) {
      const result = login(email, password)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error)
      }
    } else {
      const result = login(email, password)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error)
      }
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

        {/* Google Sign-In Button */}
        <div ref={googleButtonRef} style={{ marginBottom: '16px' }} />

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
