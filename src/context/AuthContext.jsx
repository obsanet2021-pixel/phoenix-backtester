import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { logError, logEvent, logInfo } from '../lib/errorLogger'

const AuthContext = createContext(null)

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateCredentials({ email, password, name, requireName = false }) {
  if (!EMAIL_PATTERN.test(email)) {
    return 'Enter a valid email address.'
  }

  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters.'
  }

  if (requireName && (!name || name.trim().length < 2)) {
    return 'Name must be at least 2 characters.'
  }

  return null
}

function formatAuthError(error) {
  if (!error) {
    return 'Authentication failed.'
  }

  const message = error.message || String(error)

  if (message.toLowerCase().includes('invalid login credentials')) {
    return 'Incorrect email or password.'
  }

  return message
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for dev session in localStorage (for localhost testing)
    const devUser = localStorage.getItem('phoenix_user')
    const devSession = localStorage.getItem('phoenix_session')

    if (devUser && devSession) {
      const parsedUser = JSON.parse(devUser)
      const parsedSession = JSON.parse(devSession)

      // Check if dev session is still valid
      if (parsedSession.expires_at > Date.now()) {
        setUser(parsedUser)
        setSession({ user: parsedUser, ...parsedSession })
        setLoading(false)

        // Don't check Supabase if we have valid dev session
        if (!isSupabaseConfigured || !supabase) {
          return undefined
        }
      } else {
        // Clear expired dev session
        localStorage.removeItem('phoenix_user')
        localStorage.removeItem('phoenix_session')
      }
    }

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return undefined
    }

    let isMounted = true

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return
      }

      if (error) {
        logError(error, { operation: 'auth.getSession' })
      }

      // Only set Supabase session if we don't already have dev session
      if (!devUser) {
        setSession(data.session ?? null)
        setUser(data.session?.user ?? null)
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      logEvent('auth.state_changed', { userId: nextSession?.user?.id || null })
      // Only update if no dev session
      if (!localStorage.getItem('phoenix_user')) {
        setSession(nextSession ?? null)
        setUser(nextSession?.user ?? null)
      }
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      isConfigured: isSupabaseConfigured,
      isAuthenticated: Boolean(session?.user) || Boolean(localStorage.getItem('phoenix_user')),
      async login(email, password) {
        if (!isSupabaseConfigured || !supabase) {
          return {
            success: false,
            error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
          }
        }

        const validationError = validateCredentials({ email, password })
        if (validationError) {
          return { success: false, error: validationError }
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) {
          logInfo('auth.login_failed', { email: email.trim() })
          return { success: false, error: formatAuthError(error) }
        }

        logEvent('auth.login_success', { userId: data.user?.id || null })
        return { success: true, user: data.user }
      },
      async signup(email, password, name) {
        if (!isSupabaseConfigured || !supabase) {
          return {
            success: false,
            error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
          }
        }

        const validationError = validateCredentials({
          email,
          password,
          name,
          requireName: true,
        })

        if (validationError) {
          return { success: false, error: validationError }
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: name.trim(),
            },
            emailRedirectTo: import.meta.env.VITE_APP_URL || window.location.origin,
          },
        })

        if (error) {
          return { success: false, error: formatAuthError(error) }
        }

        logEvent('auth.signup_success', { userId: data.user?.id || null })
        return { success: true, user: data.user }
      },
      async signInWithGoogle() {
        if (!isSupabaseConfigured || !supabase) {
          return {
            success: false,
            error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
          }
        }

        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: import.meta.env.VITE_APP_URL || window.location.origin,
          },
        })

        if (error) {
          return { success: false, error: formatAuthError(error) }
        }

        logEvent('auth.google_redirect_started')
        return { success: true }
      },
      async logout() {
        // Clear dev session if exists
        const hasDevSession = localStorage.getItem('phoenix_user')
        if (hasDevSession) {
          localStorage.removeItem('phoenix_user')
          localStorage.removeItem('phoenix_session')
          setSession(null)
          setUser(null)
          logEvent('auth.dev_logout_success')
          return { success: true }
        }

        if (!supabase) {
          setSession(null)
          setUser(null)
          return { success: true }
        }

        const { error } = await supabase.auth.signOut()

        if (error) {
          return { success: false, error: formatAuthError(error) }
        }

        logEvent('auth.logout_success')
        return { success: true }
      },
    }),
    [loading, session, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
