import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { logEvent, logWarning } from '../lib/errorLogger'

let memoryTrades = []

function toDbPair(pair) {
  return String(pair || 'EURUSD').replace('/', '').toUpperCase()
}

function toUiPair(pair) {
  const clean = String(pair || 'EURUSD').replace('/', '').toUpperCase()
  return clean.length === 6 ? `${clean.slice(0, 3)}/${clean.slice(3)}` : clean
}

function toDbType(type) {
  return String(type || 'BUY').toUpperCase() === 'SELL' ? 'Short' : 'Long'
}

function toUiType(type) {
  return type === 'Short' ? 'SELL' : 'BUY'
}

function toDbTimeframe(timeframe) {
  const value = String(timeframe || 'M15').toUpperCase()
  const mapping = {
    '1M': 'M1',
    M1: 'M1',
    '5M': 'M5',
    M5: 'M5',
    '15M': 'M15',
    M15: 'M15',
    '30M': 'M30',
    M30: 'M30',
    '1H': 'H1',
    H1: 'H1',
    '4H': 'H4',
    H4: 'H4',
    '1D': 'D1',
    D1: 'D1',
    '1W': 'W1',
    W1: 'W1',
    '1MN': 'MN1',
    MN1: 'MN1',
  }

  return mapping[value] || 'M15'
}

function numberOrNull(value) {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function validateTradeInput(trade) {
  if (!trade) {
    throw new Error('Trade payload is required.')
  }

  if (!trade.pair) {
    throw new Error('Currency pair is required.')
  }

  const entry = numberOrNull(trade.entry ?? trade.entryPrice)
  const stopLoss = numberOrNull(trade.sl ?? trade.stopLoss)
  const takeProfit = numberOrNull(trade.tp ?? trade.takeProfit)
  const size = numberOrNull(trade.size)

  if (!entry || entry <= 0) {
    throw new Error('Entry price must be greater than zero.')
  }

  if (!stopLoss || stopLoss <= 0) {
    throw new Error('Stop loss must be greater than zero.')
  }

  if (!takeProfit || takeProfit <= 0) {
    throw new Error('Take profit must be greater than zero.')
  }

  if (!size || size <= 0) {
    throw new Error('Position size must be greater than zero.')
  }

  return true
}

function toIsoTimestamp(trade) {
  if (trade.timestamp) {
    return trade.timestamp
  }

  if (trade.date && trade.time) {
    return new Date(`${trade.date}T${trade.time}`).toISOString()
  }

  return new Date().toISOString()
}

export function normalizeTrade(record) {
  const openedAt = record.opened_at || record.created_at || new Date().toISOString()
  const openedDate = new Date(openedAt)
  const pnl = record.pnl_amount ?? 0

  return {
    id: record.id,
    pair: toUiPair(record.pair),
    type: toUiType(record.type),
    timeframe: record.timeframe,
    entry: record.entry_price,
    exit: record.exit_price,
    sl: record.stop_loss,
    tp: record.take_profit,
    size: record.position_size ?? record.metadata?.size ?? 0,
    pnl,
    status: record.status || (record.outcome === 'Open' ? 'open' : 'closed'),
    date: openedDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }),
    time: openedDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    timestamp: openedAt,
    notes: record.notes || record.metadata?.notes || '',
    mood: record.metadata?.mood || 'neutral',
    duration: record.metadata?.duration || '--',
    orderType: record.metadata?.orderType || 'Market',
    riskPercent: record.metadata?.riskPercent || 1,
    riskAmount: record.metadata?.riskAmount || 0,
    setupType: record.setup_type,
  }
}

function serializeTrade(trade, userId) {
  const entryPrice = numberOrNull(trade.entry ?? trade.entryPrice) ?? 0
  const stopLoss = numberOrNull(trade.sl ?? trade.stopLoss ?? entryPrice) ?? entryPrice
  const takeProfit = numberOrNull(trade.tp ?? trade.takeProfit ?? entryPrice) ?? entryPrice
  const exitPrice = numberOrNull(trade.exit ?? trade.exitPrice)
  const status = trade.status || (exitPrice ? 'closed' : 'open')

  return {
    user_id: userId || null,
    pair: toDbPair(trade.pair),
    type: toDbType(trade.type),
    timeframe: toDbTimeframe(trade.timeframe),
    entry_price: entryPrice,
    exit_price: exitPrice,
    stop_loss: stopLoss,
    take_profit: takeProfit,
    setup_type: trade.setupType || 'Order Block',
    outcome: status === 'open' ? 'Open' : trade.outcome || (Number(trade.pnl) >= 0 ? 'Win' : 'Loss'),
    pnl_amount: numberOrNull(trade.pnl),
    notes: trade.notes || '',
    opened_at: toIsoTimestamp(trade),
    closed_at: status === 'closed' ? new Date().toISOString() : null,
    status,
    position_size: numberOrNull(trade.size),
    metadata: {
      duration: trade.duration || '--',
      mood: trade.mood || 'neutral',
      orderType: trade.orderType || 'Market',
      riskPercent: numberOrNull(trade.riskPercent) ?? 1,
      riskAmount: numberOrNull(trade.riskAmount) ?? 0,
      size: numberOrNull(trade.size) ?? 0,
    },
  }
}

export async function listTrades(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    logWarning('Supabase not configured for trades. Falling back to in-memory state.')
    return memoryTrades
  }

  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .order('opened_at', { ascending: false })

  if (error) {
    throw error
  }

  const normalized = data.map(normalizeTrade)
  memoryTrades = normalized
  return normalized
}

export async function createTrade(trade, userId) {
  validateTradeInput(trade)

  if (!isSupabaseConfigured || !supabase || !userId) {
    const nextTrade = {
      ...trade,
      id: trade.id || Date.now().toString(),
    }
    memoryTrades = [nextTrade, ...memoryTrades]
    logEvent('trade.created.memory', { tradeId: nextTrade.id, pair: nextTrade.pair })
    return nextTrade
  }

  const { data, error } = await supabase
    .from('trades')
    .insert(serializeTrade(trade, userId))
    .select()
    .single()

  if (error) {
    throw error
  }

  const normalized = normalizeTrade(data)
  memoryTrades = [normalized, ...memoryTrades.filter((item) => item.id !== normalized.id)]
  logEvent('trade.created', { tradeId: normalized.id, pair: normalized.pair, status: normalized.status })
  return normalized
}

export async function updateTrade(tradeId, updates, userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    const nextTrades = memoryTrades.map((trade) =>
      trade.id === tradeId ? { ...trade, ...updates } : trade,
    )
    memoryTrades = nextTrades
    logEvent('trade.updated.memory', { tradeId })
    return nextTrades.find((trade) => trade.id === tradeId) ?? null
  }

  const existingTrade = memoryTrades.find((trade) => trade.id === tradeId)
  const mergedTrade = { ...existingTrade, ...updates, id: tradeId }
  validateTradeInput(mergedTrade)

  const { data, error } = await supabase
    .from('trades')
    .update(serializeTrade(mergedTrade, userId))
    .eq('id', tradeId)
    .select()
    .single()

  if (error) {
    throw error
  }

  const normalized = normalizeTrade(data)
  memoryTrades = memoryTrades.map((trade) => (trade.id === tradeId ? normalized : trade))
  logEvent('trade.updated', { tradeId, status: normalized.status })
  return normalized
}

export async function removeTrade(tradeId, userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    memoryTrades = memoryTrades.filter((trade) => trade.id !== tradeId)
    logEvent('trade.deleted.memory', { tradeId })
    return
  }

  const { error } = await supabase.from('trades').delete().eq('id', tradeId)

  if (error) {
    throw error
  }

  memoryTrades = memoryTrades.filter((trade) => trade.id !== tradeId)
  logEvent('trade.deleted', { tradeId })
}
