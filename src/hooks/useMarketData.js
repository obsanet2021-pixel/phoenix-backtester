import { useState, useEffect, useCallback } from 'react'
import { marketApi } from '../services/marketApi'

export const useMarketData = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPrice, setCurrentPrice] = useState(null)

  // Fetch historical data
  const fetchHistoricalData = useCallback(async (pair, timeframe, startDate, endDate) => {
    setLoading(true)
    setError(null)
    
    try {
      const candles = await marketApi.getCandles(pair, timeframe, startDate, endDate)
      setData(candles)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch current price
  const fetchCurrentPrice = useCallback(async (pair) => {
    try {
      const price = await marketApi.getCurrentPrice(pair)
      setCurrentPrice(price)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  // Get available pairs
  const getAvailablePairs = useCallback(async () => {
    try {
      return await marketApi.getAvailablePairs()
    } catch (err) {
      setError(err.message)
      return []
    }
  }, [])

  // Update data with new candle
  const addCandle = useCallback((newCandle) => {
    setData(prev => [...prev, newCandle])
  }, [])

  // Clear data
  const clearData = useCallback(() => {
    setData([])
    setCurrentPrice(null)
  }, [])

  return {
    data,
    loading,
    error,
    currentPrice,
    fetchHistoricalData,
    fetchCurrentPrice,
    getAvailablePairs,
    addCandle,
    clearData
  }
}
