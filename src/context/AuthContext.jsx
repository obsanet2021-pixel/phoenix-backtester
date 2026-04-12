import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('phoenixUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = (email, password) => {
    // Simple demo authentication
    if (email && password) {
      const userData = {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      }
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('phoenixUser', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const signup = (email, password, name) => {
    // Simple demo signup
    if (email && password && name) {
      const userData = {
        id: Date.now(),
        email,
        name,
        createdAt: new Date().toISOString()
      }
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('phoenixUser', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'All fields are required' }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('phoenixUser')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
