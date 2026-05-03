import { memo, useEffect, useRef } from 'react'

const datafeedUrl =
  import.meta.env.VITE_TRADINGVIEW_DATAFEED_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  'http://localhost:3001'

// Custom UDF Datafeed Adapter for TradingView Charting Library
class UDFDatafeed {
  constructor(datafeedURL) {
    this._datafeedURL = datafeedURL
    this._configuration = undefined

    this._logMessage('Datafeed constructor called')
  }

  _logMessage(message) {
    if (typeof console !== 'undefined') {
      console.log(new Date().toLocaleTimeString() + '. Datafeed: ' + message)
    }
  }

  _send(url, params) {
    const queryString = Object.keys(params)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
      .join('&')
    return fetch(url + (queryString ? '?' + queryString : ''), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.status !== 200) {
        throw new Error('Bad response status: ' + response.status)
      }
      return response.json()
    })
  }

  onReady(callback) {
    this._logMessage('onReady called')
    if (this._configuration !== undefined) {
      setTimeout(() => callback(this._configuration))
      return
    }

    this._send(this._datafeedURL + '/config')
      .then((response) => {
        this._configuration = response
        callback(response)
      })
      .catch((error) => {
        this._logMessage('Error on configuration: ' + JSON.stringify(error))
        // Provide default configuration if server fails
        this._configuration = {
          supports_search: true,
          supports_group_request: false,
          supports_marks: false,
          supports_timescale_marks: false,
          supports_time: true,
          exchanges: [{ value: 'FX', name: 'Forex', desc: 'Forex Market' }],
          symbols_types: [{ name: 'Forex', value: 'forex' }],
        }
        callback(this._configuration)
      })
  }

  searchSymbols(userInput, exchange, symbolType, onResult) {
    this._logMessage('searchSymbols called')
    this._send(this._datafeedURL + '/search', {
      q: userInput,
      exchange: exchange || '',
      type: symbolType || '',
    })
      .then((response) => {
        onResult(response)
      })
      .catch((error) => {
        this._logMessage('Error searching symbols: ' + JSON.stringify(error))
        onResult([])
      })
  }

  resolveSymbol(symbolName, onResolve, onError) {
    this._logMessage('resolveSymbol called: ' + symbolName)
    this._send(this._datafeedURL + '/symbols', { symbol: symbolName })
      .then((response) => {
        if (response.s && response.s === 'error') {
          onError(response.errmsg || 'Unknown error')
          return
        }
        onResolve({
          name: response.name || symbolName,
          full_name: response.full_name || symbolName,
          description: response.description || symbolName,
          type: response.type || 'forex',
          session: response.session || '24x7',
          timezone: response.timezone || 'Etc/UTC',
          ticker: response.ticker || symbolName,
          minmov: response.minmov || 1,
          pricescale: response.pricescale || 100000,
          has_intraday: response.has_intraday !== undefined ? response.has_intraday : true,
          supported_resolutions: response.supported_resolutions || ['1', '5', '15', '30', '60', '240', 'D'],
          volume_precision: response.volume_precision || 0,
          data_status: response.data_status || 'streaming',
        })
      })
      .catch((error) => {
        this._logMessage('Error resolving symbol: ' + JSON.stringify(error))
        // Provide default symbol info if server fails
        onResolve({
          name: symbolName,
          full_name: symbolName,
          description: symbolName,
          type: 'forex',
          session: '24x7',
          timezone: 'Etc/UTC',
          ticker: symbolName,
          minmov: 1,
          pricescale: 100000,
          has_intraday: true,
          supported_resolutions: ['1', '5', '15', '30', '60', '240', 'D'],
          volume_precision: 0,
          data_status: 'streaming',
        })
      })
  }

  getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
    this._logMessage('getBars called')
    const { from, to, firstDataRequest } = periodParams

    this._send(this._datafeedURL + '/history', {
      symbol: symbolInfo.ticker || symbolInfo.name,
      resolution: resolution,
      from: from,
      to: to,
    })
      .then((response) => {
        if (response.s !== 'ok' && response.s !== 'no_data') {
          onErrorCallback(response.errmsg || 'Unknown error')
          return
        }

        if (response.s === 'no_data' || !response.t || response.t.length === 0) {
          onHistoryCallback([], { noData: true })
          return
        }

        const bars = []
        const times = response.t
        const opens = response.o
        const highs = response.h
        const lows = response.l
        const closes = response.c
        const volumes = response.v

        for (let i = 0; i < times.length; i++) {
          bars.push({
            time: times[i] * 1000,
            open: opens[i],
            high: highs[i],
            low: lows[i],
            close: closes[i],
            volume: volumes ? volumes[i] : undefined,
          })
        }

        onHistoryCallback(bars, { noData: false, nextTime: response.nextTime })
      })
      .catch((error) => {
        this._logMessage('Error getting bars: ' + JSON.stringify(error))
        onErrorCallback('Network error: ' + error.message)
      })
  }

  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    this._logMessage('subscribeBars called with subscriberUID: ' + subscriberUID)
    // Real-time updates would be handled here with WebSocket or polling
    // For now, this is a no-op since we're doing historical backtesting
  }

  unsubscribeBars(subscriberUID) {
    this._logMessage('unsubscribeBars called with subscriberUID: ' + subscriberUID)
  }

  getServerTime(callback) {
    this._logMessage('getServerTime called')
    callback(Math.floor(Date.now() / 1000))
  }
}

function ChartWorkspace() {
  const chartRef = useRef(null)
  const widgetRef = useRef(null)

  useEffect(() => {
    // Load the TradingView Charting Library script
    const script = document.createElement('script')
    script.src = '/charting_library/charting_library.js'
    script.async = true
    document.body.appendChild(script)

    const initWidget = () => {
      if (!window.TradingView || !chartRef.current) {
        return
      }

      // Clean up existing widget
      if (widgetRef.current) {
        widgetRef.current.remove()
        widgetRef.current = null
      }

      // Create custom UDF datafeed instance
      const datafeed = new UDFDatafeed(datafeedUrl)

      // Initialize the TradingView Charting Library widget
      widgetRef.current = new window.TradingView.widget({
        symbol: 'EURUSD',
        datafeed: datafeed,
        interval: '15',
        container: chartRef.current,
        library_path: '/charting_library/',
        locale: 'en',
        disabled_features: ['use_localstorage_for_settings', 'header_symbol_search'],
        enabled_features: ['study_templates'],
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        fullscreen: false,
        autosize: true,
        theme: 'dark',
        custom_css_url: '/charting_library/themed.css',
        overrides: {
          'mainSeriesProperties.showCountdown': true,
          'paneProperties.background': '#131722',
          'paneProperties.vertGridProperties.color': '#2a2e39',
          'paneProperties.horzGridProperties.color': '#2a2e39',
          'symbolWatermarkProperties.transparency': 90,
          'scalesProperties.textColor': '#787b86',
        },
        loading_screen: {
          backgroundColor: '#131722',
          foregroundColor: '#2962FF',
        },
      })
    }

    script.onload = initWidget

    // Cleanup
    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove()
        widgetRef.current = null
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
      }}
    />
  )
}

export default memo(ChartWorkspace)
