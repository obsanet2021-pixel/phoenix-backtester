import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  createTrade as createTradeRecord,
  listTrades,
  removeTrade,
  updateTrade as updateTradeRecord,
} from '../services/trades'
import { logError, logEvent } from '../lib/errorLogger'

const TradesContext = createContext(null)

export function TradesProvider({ children }) {
  const { user, isAuthenticated, isConfigured } = useAuth()
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function refreshTrades() {
    try {
      setLoading(true)
      setError('')
      const nextTrades = await listTrades(user?.id)
      setTrades(nextTrades)
    } catch (nextError) {
      logError(nextError, { operation: 'trades.refresh' })
      setError(nextError.message || 'Failed to load trades.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isConfigured && !isAuthenticated) {
      setTrades([])
      setLoading(false)
      return
    }

    refreshTrades()
  }, [isAuthenticated, isConfigured, user?.id])

  const value = useMemo(
    () => ({
      trades,
      loading,
      error,
      async refreshTrades() {
        await refreshTrades()
      },
      async createTrade(trade) {
        const createdTrade = await createTradeRecord(trade, user?.id)
        setTrades((current) => [createdTrade, ...current])
        logEvent('trades.context_created', { tradeId: createdTrade.id })
        return createdTrade
      },
      async updateTrade(tradeId, updates) {
        const updatedTrade = await updateTradeRecord(tradeId, updates, user?.id)
        if (updatedTrade) {
          setTrades((current) =>
            current.map((trade) => (trade.id === tradeId ? updatedTrade : trade)),
          )
          logEvent('trades.context_updated', { tradeId })
        }
        return updatedTrade
      },
      async deleteTrade(tradeId) {
        await removeTrade(tradeId, user?.id)
        setTrades((current) => current.filter((trade) => trade.id !== tradeId))
        logEvent('trades.context_deleted', { tradeId })
      },
    }),
    [error, loading, trades, user?.id],
  )

  return <TradesContext.Provider value={value}>{children}</TradesContext.Provider>
}

export function useTrades() {
  const context = useContext(TradesContext)

  if (!context) {
    throw new Error('useTrades must be used within a TradesProvider')
  }

  return context
}
