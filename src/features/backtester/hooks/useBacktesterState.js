import { useCallback, useMemo, useState } from 'react'

const initialTradeForm = {
  pair: 'EUR/USD',
  type: 'BUY',
  orderType: 'Market',
  entry: '4483.415',
  tp: '',
  sl: '',
  size: '0.10',
  timeframe: 'M15',
  riskPercent: '1',
  riskAmount: '49.94',
}

export default function useBacktesterState() {
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [showGoToMenu, setShowGoToMenu] = useState(false)
  const [sidebarTab, setSidebarTab] = useState('News')
  const [notes, setNotes] = useState('')
  const [tradeForm, setTradeForm] = useState(initialTradeForm)
  const [messageCard, setMessageCard] = useState({
    open: false,
    title: 'Phoenix Backtester | System Message',
    subtitle: 'secure | low latency | execution core',
    message: 'Phoenix Core ready. All systems operational.',
  })
  const [replay, setReplay] = useState({
    playing: false,
    speed: 1,
    position: { x: 20, y: 80 },
  })

  const newsEvents = useMemo(
    () => [
      {
        id: 'placeholder-1',
        currency: 'USD',
        impact: 'High',
        event: 'No live calendar connected yet',
        date: new Date().toISOString(),
        time: '09:30',
        actual: '--',
        forecast: '--',
        previous: '--',
      },
    ],
    [],
  )

  const showMessage = useCallback((message, title = 'Phoenix Backtester | System Message') => {
    setMessageCard({
      open: true,
      title,
      subtitle: 'secure | low latency | execution core',
      message,
    })
  }, [])

  const closeMessage = useCallback(() => {
    setMessageCard((current) => ({ ...current, open: false }))
  }, [])

  return {
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
  }
}
