const DEFAULT_STARTING_BALANCE = 10000

export function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function getClosedTrades(trades) {
  return trades.filter((trade) => trade.status === 'closed')
}

export function sortTradesByTime(trades) {
  return trades
    .slice()
    .sort((left, right) => new Date(left.timestamp || left.date) - new Date(right.timestamp || right.date))
}

export function getTradeDateLabel(trade) {
  const date = new Date(trade.timestamp || trade.date || Date.now())
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getTradeRiskReward(trade) {
  const entry = toNumber(trade.entry)
  const stopLoss = toNumber(trade.sl)
  const takeProfit = toNumber(trade.tp)

  if (!entry || !stopLoss || !takeProfit) {
    return 0
  }

  const risk = Math.abs(entry - stopLoss)
  const reward = Math.abs(takeProfit - entry)

  if (!risk) {
    return 0
  }

  return reward / risk
}

export function getTradeMetrics(trades, startingBalance = DEFAULT_STARTING_BALANCE) {
  const closedTrades = getClosedTrades(trades)
  const openTrades = trades.filter((trade) => trade.status === 'open')
  const sortedClosedTrades = sortTradesByTime(closedTrades)
  const pnlValues = sortedClosedTrades.map((trade) => toNumber(trade.pnl))
  const totalPnL = pnlValues.reduce((sum, value) => sum + value, 0)
  const wins = sortedClosedTrades.filter((trade) => toNumber(trade.pnl) > 0)
  const losses = sortedClosedTrades.filter((trade) => toNumber(trade.pnl) < 0)
  const breakevenTrades = sortedClosedTrades.filter((trade) => toNumber(trade.pnl) === 0)
  const winRate = sortedClosedTrades.length ? (wins.length / sortedClosedTrades.length) * 100 : 0
  const avgWin = wins.length ? wins.reduce((sum, trade) => sum + toNumber(trade.pnl), 0) / wins.length : 0
  const avgLoss = losses.length
    ? Math.abs(losses.reduce((sum, trade) => sum + toNumber(trade.pnl), 0) / losses.length)
    : 0
  const avgPnlPerTrade = sortedClosedTrades.length ? totalPnL / sortedClosedTrades.length : 0
  const totalWinAmount = wins.reduce((sum, trade) => sum + toNumber(trade.pnl), 0)
  const totalLossAmount = Math.abs(losses.reduce((sum, trade) => sum + toNumber(trade.pnl), 0))
  const profitFactor = totalLossAmount ? totalWinAmount / totalLossAmount : totalWinAmount ? Number.POSITIVE_INFINITY : 0
  const riskRewardValues = sortedClosedTrades.map(getTradeRiskReward).filter((value) => value > 0)
  const averageRiskReward = riskRewardValues.length
    ? riskRewardValues.reduce((sum, value) => sum + value, 0) / riskRewardValues.length
    : 0
  const expectancy = sortedClosedTrades.length ? totalPnL / sortedClosedTrades.length : 0
  const bestTrade = sortedClosedTrades.length ? Math.max(...pnlValues) : 0
  const worstTrade = sortedClosedTrades.length ? Math.min(...pnlValues) : 0

  const equityCurve = getEquityCurve(sortedClosedTrades, startingBalance)
  const maxDrawdown = equityCurve.maxDrawdown

  return {
    totalTrades: trades.length,
    closedTrades: sortedClosedTrades,
    openTrades,
    totalPnL,
    netPnL: totalPnL,
    avgPnlPerTrade,
    wins,
    losses,
    breakevenTrades,
    winRate,
    lossRate: sortedClosedTrades.length ? (losses.length / sortedClosedTrades.length) * 100 : 0,
    avgWin,
    avgLoss,
    profitFactor: Number.isFinite(profitFactor) ? profitFactor : totalWinAmount,
    averageRiskReward,
    expectancy,
    bestTrade,
    worstTrade,
    balance: startingBalance + totalPnL,
    drawdown: maxDrawdown,
    winLossDistribution: {
      wins: wins.length,
      losses: losses.length,
      breakeven: breakevenTrades.length,
    },
    equityCurve,
  }
}

export function getEquityCurve(trades, startingBalance = DEFAULT_STARTING_BALANCE) {
  let equity = startingBalance
  let peak = startingBalance
  let maxDrawdown = 0

  const points = [
    {
      label: 'Start',
      equity,
      pnl: 0,
      drawdown: 0,
    },
  ]

  sortTradesByTime(trades).forEach((trade, index) => {
    const pnl = toNumber(trade.pnl)
    equity += pnl
    peak = Math.max(peak, equity)
    const drawdown = peak ? ((peak - equity) / peak) * 100 : 0
    maxDrawdown = Math.max(maxDrawdown, drawdown)

    points.push({
      label: trade.date || `Trade ${index + 1}`,
      equity,
      pnl,
      drawdown,
      pair: trade.pair,
      timestamp: trade.timestamp,
    })
  })

  return {
    points,
    labels: points.map((point) => point.label),
    equityValues: points.map((point) => point.equity),
    drawdownValues: points.map((point) => point.drawdown),
    maxDrawdown,
  }
}

export function getPairDistribution(trades) {
  const counts = trades.reduce((accumulator, trade) => {
    const key = trade.pair || 'Unknown'
    accumulator[key] = (accumulator[key] || 0) + 1
    return accumulator
  }, {})

  return Object.entries(counts).sort((left, right) => right[1] - left[1])
}

export function getPairPerformance(trades) {
  const grouped = getClosedTrades(trades).reduce((accumulator, trade) => {
    const key = trade.pair || 'Unknown'
    if (!accumulator[key]) {
      accumulator[key] = []
    }
    accumulator[key].push(trade)
    return accumulator
  }, {})

  return Object.entries(grouped)
    .map(([pair, pairTrades]) => {
      const metrics = getTradeMetrics(pairTrades, 0)

      return {
        pair,
        totalTrades: pairTrades.length,
        winRate: metrics.winRate,
        netPnL: metrics.totalPnL,
        avgPnlPerTrade: metrics.avgPnlPerTrade,
        avgWin: metrics.avgWin,
        avgLoss: metrics.avgLoss,
        averageRiskReward: metrics.averageRiskReward,
      }
    })
    .sort((left, right) => right.netPnL - left.netPnL)
}

export function getTradeFrequencySeries(trades) {
  const grouped = getClosedTrades(trades).reduce((accumulator, trade) => {
    const key = getTradeDateLabel(trade)
    if (!accumulator[key]) {
      accumulator[key] = { label: key, count: 0, pnl: 0 }
    }
    accumulator[key].count += 1
    accumulator[key].pnl += toNumber(trade.pnl)
    return accumulator
  }, {})

  const values = Object.values(grouped)
  return values.length ? values : []
}

export function getTradeTimeline(trades, startingBalance = DEFAULT_STARTING_BALANCE) {
  const equityCurve = getEquityCurve(getClosedTrades(trades), startingBalance)

  return {
    labels: equityCurve.labels,
    equitySeries: equityCurve.equityValues,
    pnlSeries: equityCurve.points.slice(1).map((point) => point.pnl),
    drawdownSeries: equityCurve.drawdownValues,
  }
}
