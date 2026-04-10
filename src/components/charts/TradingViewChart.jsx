import React, { useEffect, useRef } from 'react'

const TradingViewChart = ({ symbol = 'EURUSD', theme = 'dark' }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    // Load TradingView widget script
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": `FX:${symbol}`,
      "interval": "15",
      "timezone": "Etc/UTC",
      "theme": theme,
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com",
      "details": true,
      "hotlist": true,
      "calendar": false,
      "show_volume": true,
      "studies": [
        "MACD@tv-basicstudies",
        "RSI@tv-basicstudies"
      ],
      "container_id": "tradingview_chart"
    })

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current && containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }
    }
  }, [symbol, theme])

  return (
    <div className="tradingview-chart-container">
      <div 
        ref={containerRef}
        id="tradingview_chart"
        style={{ height: '600px', width: '100%' }}
      />
    </div>
  )
}

export default TradingViewChart
