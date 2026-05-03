import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { ProtectedRoute } from '../App'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../context/AuthContext'

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users when Supabase is configured', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      isConfigured: true,
    })

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Private content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('renders children when auth is ready and authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      isConfigured: true,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Private content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    )

    expect(screen.getByText('Private content')).toBeInTheDocument()
  })
})
