import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const PhoenixBacktesterNew = () => {
  const navigate = useNavigate()
  const chartRef = useRef(null)
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [showGotoDropdown, setShowGotoDropdown] = useState(false)
  const [tradeType, setTradeType] = useState('Buy')
  const [orderType, setOrderType] = useState('Market')
  const [balanceTab, setBalanceTab] = useState('Initial Balance')
  const [sidebarTab, setSidebarTab] = useState('News')
  const [activeCurrency, setActiveCurrency] = useState('USD')
  const [selectedImpact, setSelectedImpact] = useState([])
  
  const [tradeData, setTradeData] = useState({
    entryPrice: '4483.415',
    takeProfit: 0,
    stopLoss: 0,
    riskPercent: 1,
    riskAmount: 49.94
  })

  const [balance, setBalance] = useState({
    balance: 10000.00,
    equity: 10000.00,
    unrealizedPnL: 0.00
  })

  // Load TradingView script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.TradingView && chartRef.current) {
        new window.TradingView.widget({
          "width": "100%",
          "height": "100%",
          "symbol": "XAUUSD",
          "interval": "60",
          "timezone": "Europe/London",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#1e222d",
          "enable_publishing": false,
          "hide_top_toolbar": false,
          "save_image": false,
          "container_id": "tradingview_chart",
          "backgroundColor": "#1e222d",
          "gridColor": "#2a2e39",
          "studies": [],
          "show_popup_button": true,
          "popup_width": "1000",
          "popup_height": "650"
        })
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleExport = () => {
    const trades = JSON.parse(localStorage.getItem('phoenixTrades') || '[]')
    const dataStr = JSON.stringify(trades, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'backtest-export.json'
    link.click()
  }

  const handleExit = () => {
    navigate('/')
  }

  const handleSaveTrade = () => {
    const newTrade = {
      id: Date.now(),
      type: tradeType,
      orderType: orderType,
      entry: tradeData.entryPrice,
      takeProfit: tradeData.takeProfit,
      stopLoss: tradeData.stopLoss,
      riskPercent: tradeData.riskPercent,
      riskAmount: tradeData.riskAmount,
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'open',
      pnl: 0
    }

    const trades = JSON.parse(localStorage.getItem('phoenixTrades') || '[]')
    localStorage.setItem('phoenixTrades', JSON.stringify([...trades, newTrade]))
    setShowTradeModal(false)
  }

  const toggleImpact = (impact) => {
    setSelectedImpact(prev => 
      prev.includes(impact) 
        ? prev.filter(i => i !== impact)
        : [...prev, impact]
    )
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      background: '#131722',
      color: '#d1d4dc'
    }}>
      {/* Main Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Go To Button */}
        <button
          style={{
            position: 'fixed',
            top: '20px',
            right: '400px',
            padding: '10px 20px',
            background: '#2a2e39',
            color: '#d1d4dc',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            zIndex: 99
          }}
          onClick={() => setShowGotoDropdown(!showGotoDropdown)}
        >
          Go To ▼
        </button>

        {/* Go To Dropdown */}
        {showGotoDropdown && (
          <div style={{
            position: 'fixed',
            top: '55px',
            right: '400px',
            background: '#1e222d',
            border: '1px solid #2a2e39',
            borderRadius: '4px',
            padding: '10px 0',
            zIndex: 100,
            minWidth: '150px'
          }}>
            {['London', 'New York', 'Tokyo', 'Custom Time', 'Customise'].map(item => (
              <div
                key={item}
                style={{
                  padding: '10px 20px',
                  color: '#d1d4dc',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onClick={() => {
                  console.log('Changing timezone to:', item)
                  setShowGotoDropdown(false)
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}

        {/* TradingView Chart */}
        <div
          id="tradingview_chart"
          ref={chartRef}
          style={{
            flex: 1,
            background: '#1e222d'
          }}
        />

        {/* Open Position Button */}
        <button
          style={{
            position: 'fixed',
            bottom: '100px',
            left: '20px',
            padding: '15px 30px',
            background: '#ff6b00',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(255, 107, 0, 0.4)',
            zIndex: 100,
            transition: 'all 0.2s'
          }}
          onClick={() => setShowTradeModal(true)}
          onMouseEnter={(e) => {
            e.target.style.background = '#e55f00'
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 0, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#ff6b00'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.4)'
          }}
        >
          Open Position Card
        </button>

        {/* Bottom Bar */}
        <div style={{
          background: '#131722',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #2a2e39'
        }}>
          <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#787b86', marginBottom: '4px' }}>Balance</span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#d1d4dc' }}>
                {balance.balance.toFixed(2)}$
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#787b86', marginBottom: '4px' }}>Equity</span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#26a69a' }}>
                {balance.equity.toFixed(2)}$
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#787b86', marginBottom: '4px' }}>Unrealized PnL</span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#d1d4dc' }}>
                {balance.unrealizedPnL.toFixed(2)}$
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <svg style={{ width: '40px', height: '40px', color: '#ff6b00' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <span style={{ fontSize: '32px', fontWeight: '700', color: '#ff6b00' }}>
              Phoenix Backtester
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                background: '#ff6b00',
                color: 'white'
              }}
              onClick={handleExport}
            >
              Export Data
            </button>
            <button
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                background: '#ff6b00',
                color: 'white'
              }}
              onClick={handleExit}
            >
              Exit Session
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{
        width: '380px',
        background: '#1e222d',
        borderLeft: '1px solid #2a2e39',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex',
          background: '#131722',
          borderBottom: '1px solid #2a2e39'
        }}>
          {['News', 'Notes'].map(tab => (
            <button
              key={tab}
              style={{
                flex: 1,
                padding: '15px',
                textAlign: 'center',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                background: sidebarTab === tab ? '#ff6b00' : 'transparent',
                color: sidebarTab === tab ? 'white' : '#787b86',
                transition: 'all 0.2s'
              }}
              onClick={() => setSidebarTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '18px', fontWeight: '700', marginBottom: '5px', display: 'block' }}>
              News (+/- 7 days)
            </span>
            <button style={{
              float: 'right',
              background: 'none',
              border: 'none',
              color: '#787b86',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              Refresh
            </button>
            <div style={{ fontSize: '12px', color: '#787b86' }}>
              Times are shown in Europe/London.
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>
              IMPACT
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['High', 'Medium', 'Low', 'Holiday'].map(impact => (
                <span
                  key={impact}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: selectedImpact.includes(impact) ? '#ff6b00' : 'transparent',
                    color: selectedImpact.includes(impact) ? 'white' : '#ff6b00',
                    border: selectedImpact.includes(impact) ? 'none' : '1px solid #ff6b00',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleImpact(impact)}
                >
                  {impact}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>
              CURRENCIES
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px'
            }}>
              {['AUD', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'JPY', 'NZD', 'USD'].map(currency => (
                <button
                  key={currency}
                  style={{
                    padding: '8px',
                    background: activeCurrency === currency ? '#ff6b00' : '#2a2e39',
                    border: 'none',
                    borderRadius: '4px',
                    color: activeCurrency === currency ? 'white' : '#d1d4dc',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setActiveCurrency(currency)}
                >
                  {currency}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            {['Today', 'Next week', 'Last week'].map(period => (
              <div
                key={period}
                style={{
                  padding: '12px',
                  background: '#2a2e39',
                  borderRadius: '4px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{period}</span>
                <span>▼</span>
              </div>
            ))}
            <div style={{ padding: '20px', textAlign: 'center', color: '#787b86', fontSize: '13px' }}>
              No events for this period.
            </div>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={(e) => {
          if (e.target === e.currentTarget) setShowTradeModal(false)
        }}>
          <div style={{
            background: '#1e222d',
            borderRadius: '8px',
            width: '600px',
            maxWidth: '90%',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#ff6b00',
              padding: '20px',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '20px', fontWeight: '600' }}>Place a Trade:</span>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8
                }}
                onClick={() => setShowTradeModal(false)}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '25px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                {['Buy', 'Sell', 'Limit', 'Market', 'Stop'].map(type => (
                  <button
                    key={type}
                    style={{
                      padding: '8px 20px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: (type === 'Buy' || type === 'Sell') 
                        ? (tradeType === type ? '#ff6b00' : '#2a2e39')
                        : (orderType === type ? '#ff6b00' : '#2a2e39'),
                      color: (type === 'Buy' || type === 'Sell')
                        ? (tradeType === type ? 'white' : '#787b86')
                        : (orderType === type ? 'white' : '#787b86')
                    }}
                    onClick={() => {
                      if (type === 'Buy' || type === 'Sell') {
                        setTradeType(type)
                      } else {
                        setOrderType(type)
                      }
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#d1d4dc' }}>
                  Entry Price
                </label>
                <input
                  type="text"
                  value={tradeData.entryPrice}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#2a2e39',
                    border: '1px solid #363a45',
                    borderRadius: '4px',
                    color: '#d1d4dc',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#d1d4dc' }}>
                    Take Profit
                  </label>
                  <input
                    type="number"
                    value={tradeData.takeProfit}
                    onChange={(e) => setTradeData({...tradeData, takeProfit: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2a2e39',
                      border: '1px solid #363a45',
                      borderRadius: '4px',
                      color: '#d1d4dc',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#d1d4dc' }}>
                    Stop Loss
                  </label>
                  <input
                    type="number"
                    value={tradeData.stopLoss}
                    onChange={(e) => setTradeData({...tradeData, stopLoss: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2a2e39',
                      border: '1px solid #363a45',
                      borderRadius: '4px',
                      color: '#d1d4dc',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                {['Initial Balance', 'Current Balance'].map(tab => (
                  <button
                    key={tab}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: balanceTab === tab ? '#ff6b00' : '#2a2e39',
                      color: balanceTab === tab ? 'white' : '#787b86'
                    }}
                    onClick={() => setBalanceTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#d1d4dc' }}>
                    Risk Percent (%)
                  </label>
                  <input
                    type="number"
                    value={tradeData.riskPercent}
                    onChange={(e) => setTradeData({...tradeData, riskPercent: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2a2e39',
                      border: '1px solid #363a45',
                      borderRadius: '4px',
                      color: '#d1d4dc',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#d1d4dc' }}>
                    Risk Amount ($)
                  </label>
                  <input
                    type="text"
                    value={tradeData.riskAmount}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2a2e39',
                      border: '1px solid #363a45',
                      borderRadius: '4px',
                      color: '#d1d4dc',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#d1d4dc' }}>
                  Partials
                </label>
                <button style={{
                  padding: '10px',
                  background: '#2a2e39',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#787b86',
                  fontSize: '13px',
                  cursor: 'pointer',
                  width: '100%'
                }}>
                  Add Partial
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                <button
                  style={{
                    padding: '10px 24px',
                    background: '#2a2e39',
                    color: '#d1d4dc',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowTradeModal(false)}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: '10px 24px',
                    background: '#26a69a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onClick={handleSaveTrade}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhoenixBacktesterNew
