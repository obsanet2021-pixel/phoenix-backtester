import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrades } from '../../context/TradesContext'
import { logEvent } from '../../lib/errorLogger'
import useBacktesterState from './hooks/useBacktesterState'
import ChartWorkspace from './components/ChartWorkspace'
import ReplayToolbar from './components/ReplayToolbar'
import SidebarPanel from './components/SidebarPanel'
import SystemMessageModal from './components/SystemMessageModal'
import TopActions from './components/TopActions'
import TradeModal from './components/TradeModal'

export default function PhoenixBacktesterScreen() {
  const navigate = useNavigate()
  const { trades, createTrade } = useTrades()
  const {
    showTradeModal,
    setShowTradeModal,
    showGoToMenu,
    setShowGoToMenu,
    sidebarTab,
    setSidebarTab,
    notes,
    setNotes,
    tradeForm,
    setTradeForm,
    messageCard,
    showMessage,
    closeMessage,
    replay,
    setReplay,
    newsEvents,
  } = useBacktesterState()

  const handleSaveTrade = useCallback(async () => {
    const payload = {
      pair: tradeForm.pair,
      type: tradeForm.type,
      orderType: tradeForm.orderType,
      entry: tradeForm.entry,
      sl: tradeForm.sl,
      tp: tradeForm.tp,
      size: tradeForm.size,
      timeframe: tradeForm.timeframe,
      riskPercent: tradeForm.riskPercent,
      riskAmount: tradeForm.riskAmount,
      status: 'open',
      pnl: 0,
      duration: '--',
    }

    await createTrade(payload)
    setShowTradeModal(false)
    logEvent('backtester.trade_saved', { pair: payload.pair, entry: payload.entry })
    showMessage(`Trade saved for ${payload.pair} at ${payload.entry}.`)
  }, [createTrade, setShowTradeModal, showMessage, tradeForm])

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(trades, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'backtest-export.json'
    link.click()
    logEvent('backtester.export', { tradeCount: trades.length })
  }, [trades])

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: '#131722',
        color: '#d1d4dc',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            background: '#1e222d',
            height: '100%',
          }}
        >
          <TopActions
            showGoToMenu={showGoToMenu}
            setShowGoToMenu={setShowGoToMenu}
            onOpenTrade={() => setShowTradeModal(true)}
            onExport={handleExport}
            onExit={() => navigate('/dashboard')}
          />
          <ChartWorkspace />
          <ReplayToolbar replay={replay} setReplay={setReplay} />
        </div>

        <div
          style={{
            background: '#131722',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #2a2e39',
          }}
        >
          <div style={{ display: 'flex', gap: '30px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#787b86' }}>Open Trades</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{trades.filter((trade) => trade.status === 'open').length}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#787b86' }}>Replay Speed</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{replay.speed}x</div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#787b86' }}>
            Shared trades are now backed by the trade provider.
          </div>
        </div>
      </div>

      <SidebarPanel
        sidebarTab={sidebarTab}
        setSidebarTab={setSidebarTab}
        notes={notes}
        setNotes={setNotes}
        newsEvents={newsEvents}
        onSaveNotes={() => showMessage('Notes stored in the current session for your next review.')}
      />

      <TradeModal
        open={showTradeModal}
        tradeForm={tradeForm}
        setTradeForm={setTradeForm}
        onClose={() => setShowTradeModal(false)}
        onSave={handleSaveTrade}
      />
      <SystemMessageModal messageCard={messageCard} onClose={closeMessage} />
    </div>
  )
}
