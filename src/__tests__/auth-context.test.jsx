import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from '../context/AuthContext'

const supabaseAuthMocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: {
      getSession: supabaseAuthMocks.getSession,
      onAuthStateChange: supabaseAuthMocks.onAuthStateChange,
      signInWithPassword: supabaseAuthMocks.signInWithPassword,
      signUp: supabaseAuthMocks.signUp,
      signInWithOAuth: supabaseAuthMocks.signInWithOAuth,
      signOut: supabaseAuthMocks.signOut,
    },
  },
}))

describe('AuthContext', () => {
  it('returns validation errors for invalid credentials', async () => {
    supabaseAuthMocks.getSession.mockResolvedValue({ data: { session: null } })
    supabaseAuthMocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    let response
    await act(async () => {
      response = await result.current.login('bad-email', '123')
    })

    expect(response.success).toBe(false)
    expect(response.error).toMatch(/valid email/i)
  })

  it('uses Supabase signInWithPassword for valid logins', async () => {
    supabaseAuthMocks.getSession.mockResolvedValue({ data: { session: null } })
    supabaseAuthMocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    })
    supabaseAuthMocks.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    let response
    await act(async () => {
      response = await result.current.login('trader@example.com', 'password123')
    })

    expect(supabaseAuthMocks.signInWithPassword).toHaveBeenCalled()
    expect(response.success).toBe(true)
  })
})
