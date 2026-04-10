import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { calculator } from '../services/calculator'

export const useTradeLogic = () => {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all trades
  const fetchTrades = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setTrades(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Add new trade
  const addTrade = async (tradeData) => {
    setLoading(true)
    setError(null)
    
    try {
      // Calculate P&L if exit price is provided
      if (tradeData.exit_price) {
        const pnl = calculateTradePnL(tradeData)
        tradeData.pnl_amount = pnl
        tradeData.outcome = pnl > 0 ? 'Win' : pnl < 0 ? 'Loss' : 'BE'
      } else {
        tradeData.outcome = 'Open'
      }
      
      const { data, error } = await supabase
        .from('trades')
        .insert([tradeData])
        .select()
      
      if (error) throw error
      
      setTrades(prev => [data[0], ...prev])
      return data[0]
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update trade
  const updateTrade = async (id, updates) => {
    setLoading(true)
    setError(null)
    
    try {
      // Recalculate P&L if exit price changed
      if (updates.exit_price) {
        const trade = trades.find(t => t.id === id)
        const updatedTrade = { ...trade, ...updates }
        const pnl = calculateTradePnL(updatedTrade)
        updates.pnl_amount = pnl
        updates.outcome = pnl > 0 ? 'Win' : pnl < 0 ? 'Loss' : 'BE'
      }
      
      const { data, error } = await supabase
        .from('trades')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      
      setTrades(prev => prev.map(trade => 
        trade.id === id ? data[0] : trade
      ))
      return data[0]
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete trade
  const deleteTrade = async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setTrades(prev => prev.filter(trade => trade.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Calculate individual trade P&L
  const calculateTradePnL = (trade) => {
    if (!trade.exit_price) return 0
    
    const pipValue = trade.type === 'Long' 
      ? trade.exit_price - trade.entry_price
      : trade.entry_price - trade.exit_price
    
    // Assuming standard lot size (you can make this configurable)
    const lotSize = 0.1 // Mini lot
    const pipValuePerLot = trade.pair.includes('JPY') ? 1000 : 10000
    
    return pipValue * pipValuePerLot * lotSize
  }

  // Get performance metrics
  const getMetrics = () => {
    const winRate = calculator.calculateWinRate(trades)
    const totalPnL = calculator.calculateTotalPnL(trades)
    const drawdown = calculator.calculateDrawdown(trades)
    const progress = calculator.calculateProgress(trades)
    
    return {
      totalTrades: trades.length,
      winRate,
      totalPnL,
      drawdown,
      progress,
      accountBalance: 10000 + totalPnL
    }
  }

  useEffect(() => {
    fetchTrades()
  }, [])

  return {
    trades,
    loading,
    error,
    fetchTrades,
    addTrade,
    updateTrade,
    deleteTrade,
    getMetrics,
    calculateTradePnL
  }
}
