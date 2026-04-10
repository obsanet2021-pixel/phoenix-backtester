import React, { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts'

const EquityCurve = ({ trades }) => {
  const chartContainerRef = useRef()
  const chartRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (chartContainerRef.current) {
        setDimensions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return

    // Create chart with cinematic dark theme
    const chart = createChart(chartContainerRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      layout: {
        background: {
          type: 'solid',
          color: '#000000', // Deep black
        },
        textColor: '#00ff41', // Neon emerald
      },
      grid: {
        vertLines: {
          color: 'rgba(0, 255, 65, 0.1)', // Neon emerald with opacity
        },
        horzLines: {
          color: 'rgba(0, 255, 65, 0.1)', // Neon emerald with opacity
        },
      },
      crosshair: {
        mode: 'normal',
        vertLine: {
          width: 1,
          color: 'rgba(0, 255, 65, 0.5)',
          style: 'dashed',
        },
        horzLine: {
          width: 1,
          color: 'rgba(0, 255, 65, 0.5)',
          style: 'dashed',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(0, 255, 65, 0.2)',
        textColor: '#00ff41',
      },
      timeScale: {
        borderColor: 'rgba(0, 255, 65, 0.2)',
        textColor: '#00ff41',
        timeVisible: true,
        secondsVisible: false,
      },
      localization: {
        priceFormatter: (price) => `$${price.toFixed(2)}`,
      },
    })

    // Add area series for equity curve
    const areaSeries = chart.addAreaSeries({
      topColor: 'rgba(0, 255, 65, 0.4)', // Neon emerald
      bottomColor: 'rgba(0, 255, 65, 0.05)',
      lineColor: '#00ff41',
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    })

    // Add baseline at $10,000
    const baselineSeries = chart.addLineSeries({
      color: '#ff0040', // Ruby red
      lineWidth: 2,
      lineStyle: 'dashed',
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    })

    // Fixed Drawdown Constants
    const INITIAL_BALANCE = 10000
    const FIXED_MINIMUM_EQUITY = 9200

    // Generate equity curve data from trades
    const equityData = []
    const baselineData = []
    const floorData = []
    let runningEquity = INITIAL_BALANCE // Starting equity

    // Always start with today's date or first trade date
    const startDate = trades.length > 0 
      ? trades[trades.length - 1].created_at.split('T')[0]
      : new Date().toISOString().split('T')[0]
    
    // Add initial point at $10,000
    equityData.push({
      time: startDate,
      value: runningEquity
    })
    baselineData.push({
      time: startDate,
      value: INITIAL_BALANCE
    })
    floorData.push({
      time: startDate,
      value: FIXED_MINIMUM_EQUITY
    })

    // Process trades in chronological order
    const sortedTrades = [...trades].reverse() // Oldest to newest
    sortedTrades.forEach(trade => {
      if (trade.pnl_amount !== null) {
        runningEquity += trade.pnl_amount
        equityData.push({
          time: trade.created_at.split('T')[0],
          value: runningEquity
        })
        baselineData.push({
          time: trade.created_at.split('T')[0],
          value: INITIAL_BALANCE
        })
        floorData.push({
          time: trade.created_at.split('T')[0],
          value: FIXED_MINIMUM_EQUITY
        })
      }
    })

    // Set data
    if (equityData.length > 0) {
      areaSeries.setData(equityData)
      baselineSeries.setData(baselineData)
      
      // Add minimum equity floor line
      const floorSeries = chart.addLineSeries({
        color: '#ff0040', // Ruby red for floor
        lineWidth: 2,
        lineStyle: 'dashed',
        priceFormat: {
          type: 'price',
          precision: 2,
          minMove: 0.01,
        },
      })
      floorSeries.setData(floorData)
    } else {
      // Show sample data if no trades - always starting at $10,000
      const sampleData = [
        { time: '2024-01-01', value: INITIAL_BALANCE },
        { time: '2024-01-02', value: 10125 },
        { time: '2024-01-03', value: 10050 },
        { time: '2024-01-04', value: 10200 },
        { time: '2024-01-05', value: 10350 },
        { time: '2024-01-06', value: 10175 },
        { time: '2024-01-07', value: 10400 },
        { time: '2024-01-08', value: 10550 },
        { time: '2024-01-09', value: 10475 },
        { time: '2024-01-10', value: 10600 },
      ]
      
      areaSeries.setData(sampleData)
      
      const sampleBaseline = sampleData.map(point => ({
        time: point.time,
        value: INITIAL_BALANCE
      }))
      baselineSeries.setData(sampleBaseline)
      
      const sampleFloor = sampleData.map(point => ({
        time: point.time,
        value: FIXED_MINIMUM_EQUITY
      }))
      
      const floorSeries = chart.addLineSeries({
        color: '#ff0040', // Ruby red for floor
        lineWidth: 2,
        lineStyle: 'dashed',
        priceFormat: {
          type: 'price',
          precision: 2,
          minMove: 0.01,
        },
      })
      floorSeries.setData(sampleFloor)
    }

    // Auto-scale the chart
    chart.timeScale().fitContent()

    // Store chart reference
    chartRef.current = chart

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.remove()
      }
    }
  }, [dimensions, trades])

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden border border-emerald/20">
      <div 
        ref={chartContainerRef}
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
    </div>
  )
}

export default EquityCurve
