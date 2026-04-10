import React, { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts'
import { Square, MousePointer, Trash2 } from 'lucide-react'

const ChartContainer = () => {
  const chartContainerRef = useRef()
  const chartRef = useRef()
  const candlestickSeriesRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawMode, setDrawMode] = useState(false)
  const [startPoint, setStartPoint] = useState(null)
  const [currentBox, setCurrentBox] = useState(null)
  const [breakerBoxes, setBreakerBoxes] = useState([])
  const [boxIdCounter, setBoxIdCounter] = useState(0)

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

  // Drawing functions
  const getMousePosition = (event) => {
    if (!chartRef.current) return null
    
    const rect = chartContainerRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // Convert pixel coordinates to chart coordinates
    const timeScale = chartRef.current.timeScale()
    const priceScale = candlestickSeriesRef.current?.priceScale()
    
    if (!timeScale || !priceScale) return null
    
    const time = timeScale.coordinateToTime(x)
    const price = priceScale.coordinateToPrice(y)
    
    return { time, price, x, y }
  }

  const handleMouseDown = (event) => {
    if (!drawMode) return
    
    const pos = getMousePosition(event)
    if (!pos) return
    
    setIsDrawing(true)
    setStartPoint(pos)
    
    // Create new rectangle
    const newBox = {
      id: boxIdCounter,
      startTime: pos.time,
      endTime: pos.time,
      startPrice: pos.price,
      endPrice: pos.price,
    }
    
    setCurrentBox(newBox)
  }

  const handleMouseMove = (event) => {
    if (!isDrawing || !startPoint) return
    
    const pos = getMousePosition(event)
    if (!pos) return
    
    // Update current box dimensions
    const updatedBox = {
      ...currentBox,
      endTime: pos.time,
      endPrice: pos.price,
    }
    
    setCurrentBox(updatedBox)
  }

  const handleMouseUp = () => {
    if (!isDrawing || !currentBox) return
    
    // Save the completed box
    setBreakerBoxes(prev => [...prev, currentBox])
    setBoxIdCounter(prev => prev + 1)
    
    // Reset drawing state
    setIsDrawing(false)
    setStartPoint(null)
    setCurrentBox(null)
  }

  const clearAllBoxes = () => {
    setBreakerBoxes([])
    setBoxIdCounter(0)
  }

  const deleteBox = (id) => {
    setBreakerBoxes(prev => prev.filter(box => box.id !== id))
  }

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return

    // Create chart with dark theme
    const chart = createChart(chartContainerRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      layout: {
        background: {
          type: 'solid',
          color: '#030303', // Rich black 950
        },
        textColor: '#94a3b8', // Slate 400
      },
      grid: {
        vertLines: {
          color: 'rgba(148, 163, 184, 0.1)', // Slate 400 with opacity
        },
        horzLines: {
          color: 'rgba(148, 163, 184, 0.1)', // Slate 400 with opacity
        },
      },
      crosshair: {
        mode: 'normal',
        vertLine: {
          width: 1,
          color: 'rgba(148, 163, 184, 0.5)',
          style: 'dashed',
        },
        horzLine: {
          width: 1,
          color: 'rgba(148, 163, 184, 0.5)',
          style: 'dashed',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(148, 163, 184, 0.1)',
        textColor: '#94a3b8',
      },
      timeScale: {
        borderColor: 'rgba(148, 163, 184, 0.1)',
        textColor: '#94a3b8',
        timeVisible: true,
        secondsVisible: false,
      },
      overlayPriceScales: {
        ticksVisible: false,
        borderVisible: false,
      },
      localization: {
        priceFormatter: (price) => price.toFixed(2),
      },
    })

    // Add candlestick series for price action
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981', // Bull green
      downColor: '#ef4444', // Bear red
      borderDownColor: '#ef4444',
      borderUpColor: '#10b981',
      wickDownColor: '#ef4444',
      wickUpColor: '#10b981',
    })

    // Store reference for drawing operations
    candlestickSeriesRef.current = candlestickSeries

    // Sample data - replace with real market data
    const sampleData = [
      { time: '2024-01-01', open: 100, high: 105, low: 95, close: 102 },
      { time: '2024-01-02', open: 102, high: 108, low: 101, close: 107 },
      { time: '2024-01-03', open: 107, high: 110, low: 103, close: 105 },
      { time: '2024-01-04', open: 105, high: 106, low: 98, close: 99 },
      { time: '2024-01-05', open: 99, high: 104, low: 97, close: 103 },
      { time: '2024-01-06', open: 103, high: 109, low: 102, close: 108 },
      { time: '2024-01-07', open: 108, high: 112, low: 106, close: 110 },
      { time: '2024-01-08', open: 110, high: 111, low: 104, close: 105 },
      { time: '2024-01-09', open: 105, high: 107, low: 100, close: 101 },
      { time: '2024-01-10', open: 101, high: 106, low: 99, close: 104 },
    ]

    candlestickSeries.setData(sampleData)

    // Auto-scale the chart to fit all data
    chart.timeScale().fitContent()

    // Store chart reference
    chartRef.current = chart

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.remove()
      }
    }
  }, [dimensions])

  // Draw breaker boxes on chart
  useEffect(() => {
    if (!chartRef.current || !candlestickSeriesRef.current) return

    // Remove existing rectangles
    const existingShapes = chartRef.current.getAllShapes()
    existingShapes.forEach(shape => {
      chartRef.current.removeShape(shape)
    })

    // Draw all saved breaker boxes
    breakerBoxes.forEach(box => {
      const rectangle = chartRef.current.addShape({
        shape: 'rectangle',
        id: `breaker-${box.id}`,
        point1: {
          time: box.startTime,
          price: Math.max(box.startPrice, box.endPrice)
        },
        point2: {
          time: box.endTime,
          price: Math.min(box.startPrice, box.endPrice)
        },
        options: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)', // Bear red with transparency
          borderColor: 'rgba(239, 68, 68, 0.8)',
          borderWidth: 2,
          text: `Breaker ${box.id + 1}`,
          textColor: '#f8fafc',
          fontSize: 12,
          font: 'Arial',
        }
      })
    })

    // Draw current box being drawn
    if (currentBox && isDrawing) {
      chartRef.current.addShape({
        shape: 'rectangle',
        id: 'current-drawing',
        point1: {
          time: currentBox.startTime,
          price: Math.max(currentBox.startPrice, currentBox.endPrice)
        },
        point2: {
          time: currentBox.endTime,
          price: Math.min(currentBox.startPrice, currentBox.endPrice)
        },
        options: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)', // Bull green with transparency
          borderColor: 'rgba(16, 185, 129, 0.8)',
          borderWidth: 2,
          borderStyle: 'dashed',
        }
      })
    }
  }, [breakerBoxes, currentBox, isDrawing])

  return (
    <div className="w-full h-full bg-rich-black-950 rounded-lg overflow-hidden">
      {/* Drawing Tools Toolbar */}
      <div className="glass-dark border-b border-slate-800 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawMode(!drawMode)}
              className={`px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-2 ${
                drawMode 
                  ? 'bg-bull/20 text-bull border border-bull/30' 
                  : 'glass text-slate-400 hover:text-white'
              }`}
            >
              {drawMode ? <Square className="w-4 h-4" /> : <MousePointer className="w-4 h-4" />}
              {drawMode ? 'Drawing Mode' : 'Draw Box'}
            </button>
            
            {breakerBoxes.length > 0 && (
              <>
                <span className="text-slate-400 text-sm">
                  {breakerBoxes.length} {breakerBoxes.length === 1 ? 'box' : 'boxes'}
                </span>
                <button
                  onClick={clearAllBoxes}
                  className="px-3 py-1.5 rounded text-sm glass text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </>
            )}
          </div>
          
          {drawMode && (
            <div className="text-slate-400 text-sm">
              Click and drag to draw a Breaker Block zone
            </div>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={chartContainerRef}
        className="w-full h-full"
        style={{ minHeight: '400px', cursor: drawMode ? 'crosshair' : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  )
}

export default ChartContainer
