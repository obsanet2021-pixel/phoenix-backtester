// Phoenix Challenge calculator for drawdown and performance metrics

export const calculator = {
  // Calculate current drawdown percentage
  calculateDrawdown(trades, accountSize = 10000) {
    if (!trades.length) return 0
    
    let balance = accountSize
    let peak = accountSize
    let maxDrawdown = 0
    
    trades.forEach(trade => {
      if (trade.pnl_amount) {
        balance += trade.pnl_amount
        peak = Math.max(peak, balance)
        const drawdown = ((peak - balance) / peak) * 100
        maxDrawdown = Math.max(maxDrawdown, drawdown)
      }
    })
    
    return maxDrawdown
  },

  // Calculate win rate
  calculateWinRate(trades) {
    const completedTrades = trades.filter(t => t.outcome && t.outcome !== 'Open')
    if (!completedTrades.length) return 0
    
    const wins = completedTrades.filter(t => t.outcome === 'Win').length
    return (wins / completedTrades.length) * 100
  },

  // Calculate total P&L
  calculateTotalPnL(trades) {
    return trades.reduce((total, trade) => {
      return total + (trade.pnl_amount || 0)
    }, 0)
  },

  // Calculate risk to reward ratio
  calculateRR(entry, stopLoss, takeProfit) {
    const risk = Math.abs(entry - stopLoss)
    const reward = Math.abs(takeProfit - entry)
    return reward / risk
  },

  // Check if trade violates Phoenix Challenge rules
  checkPhoenixRules(trade, currentDrawdown, maxDrawdown = 5) {
    const violations = []
    
    // Check drawdown limit
    if (currentDrawdown > maxDrawdown) {
      violations.push(`Drawdown exceeded ${maxDrawdown}% limit`)
    }
    
    // Check position sizing (assuming 1% risk per trade)
    const riskPercent = Math.abs(trade.entry_price - trade.stop_loss) / trade.entry_price * 100
    if (riskPercent > 2) { // 2% max risk
      violations.push('Position size exceeds 2% risk limit')
    }
    
    return violations
  },

  // Calculate account progress toward goal
  calculateProgress(trades, accountSize = 10000, goal = 20000) {
    const currentBalance = accountSize + this.calculateTotalPnL(trades)
    const progress = ((currentBalance - accountSize) / (goal - accountSize)) * 100
    return Math.max(0, Math.min(100, progress)) // Clamp between 0-100
  }
}
