import React from 'react'
import { AlertTriangle, TrendingUp, TrendingDown, Target, Shield } from 'lucide-react'

const RulesMonitor = ({ trades }) => {
  // Fixed Drawdown Model Constants
  const INITIAL_BALANCE = 10000
  const FIXED_MINIMUM_EQUITY = 9200 // $9,200 floor (8% drawdown)
  const maxDailyLoss = 500 // 5% of $10k
  const profitTarget = 20000 // 100% gain target
  
  // Calculate Current Equity using Fixed Drawdown logic
  const totalPnL = trades.reduce((total, trade) => total + (trade.pnl_amount || 0), 0)
  const currentEquity = INITIAL_BALANCE + totalPnL
  
  // Distance to Liquidation calculation
  const distanceToFloor = currentEquity - FIXED_MINIMUM_EQUITY
  const distancePercentage = (distanceToFloor / (INITIAL_BALANCE - FIXED_MINIMUM_EQUITY)) * 100
  const isNearLiquidation = distancePercentage <= 2 // Within 2% of floor
  const isLiquidated = currentEquity <= FIXED_MINIMUM_EQUITY
  
  // Calculate today's P&L (trades from today)
  const today = new Date().toISOString().split('T')[0]
  const todayTrades = trades.filter(trade => trade.created_at?.startsWith(today))
  const todayPnL = todayTrades.reduce((total, trade) => total + (trade.pnl_amount || 0), 0)
  
  // Calculate daily loss limit usage
  const dailyLossUsage = todayPnL < 0 ? Math.abs(todayPnL) : 0
  const dailyLossPercentage = (dailyLossUsage / maxDailyLoss) * 100
  const isNearLimit = dailyLossPercentage > 80
  const isAtLimit = dailyLossPercentage >= 100
  
  // Calculate profit target progress
  const profitProgress = Math.max(0, Math.min(100, ((currentEquity - accountSize) / (profitTarget - accountSize)) * 100))
  const isProfitTargetReached = currentEquity >= profitTarget
  
  // Get drawdown
  const getDrawdown = () => {
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
  }
  
  const drawdown = getDrawdown()

  return (
    <div className="space-y-4">
      {/* Current Equity */}
      <div className={`bg-black rounded-lg p-6 border transition-all duration-300 ${
        isNearLiquidation ? 'border-ruby/60 animate-pulse shadow-lg shadow-ruby/20' : 'border-emerald/20'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald text-sm font-medium mb-1">Current Equity</p>
            <p className={`text-3xl font-bold ${currentEquity >= INITIAL_BALANCE ? 'text-emerald' : 'text-ruby'}`}>
              ${currentEquity.toFixed(2)}
            </p>
            <p className={`text-sm mt-1 ${totalPnL >= 0 ? 'text-emerald' : 'text-ruby'}`}>
              {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)} ({((totalPnL / INITIAL_BALANCE) * 100).toFixed(2)}%)
            </p>
          </div>
          <div className={`p-3 rounded-full ${currentEquity >= INITIAL_BALANCE ? 'bg-emerald/20' : 'bg-ruby/20'}`}>
            <TrendingUp className={`w-6 h-6 ${currentEquity >= INITIAL_BALANCE ? 'text-emerald' : 'text-ruby'}`} />
          </div>
        </div>
      </div>

      {/* Distance to Liquidation Gauge */}
      <div className={`bg-black rounded-lg p-6 border transition-all duration-300 ${
        isNearLiquidation ? 'border-ruby/60 animate-pulse shadow-lg shadow-ruby/20' : 'border-emerald/20'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-emerald text-sm font-medium">Distance to Liquidation</p>
          {isNearLiquidation && !isLiquidated && (
            <div className="flex items-center gap-1 text-ruby">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs">CRITICAL</span>
            </div>
          )}
          {isLiquidated && (
            <div className="flex items-center gap-1 text-ruby">
              <Shield className="w-4 h-4" />
              <span className="text-xs">LIQUIDATED</span>
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Floor: ${FIXED_MINIMUM_EQUITY}</span>
            <span className={`font-bold ${isNearLiquidation ? 'text-ruby' : 'text-emerald'}`}>
              ${distanceToFloor.toFixed(2)} ({distancePercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isLiquidated ? 'bg-ruby' : 
                isNearLiquidation ? 'bg-ruby animate-pulse' : 
                distancePercentage < 20 ? 'bg-ruby' :
                distancePercentage < 50 ? 'bg-yellow-400' :
                'bg-emerald'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, distancePercentage))}%` }}
            />
          </div>
        </div>
        
        <p className={`text-xs ${isLiquidated ? 'text-ruby' : isNearLiquidation ? 'text-ruby' : 'text-slate-400'}`}>
          {isLiquidated ? 'Account has reached minimum equity - Challenge Failed' :
           isNearLiquidation ? `Warning: Within 2% of minimum equity floor` :
           `${distanceToFloor.toFixed(2)} above minimum equity floor`}
        </p>
      </div>

      {/* Daily Loss Limit */}
      <div className="bg-black rounded-lg p-6 border border-emerald/20">
        <div className="flex items-center justify-between mb-3">
          <p className="text-emerald text-sm font-medium">Daily Loss Limit</p>
          {isNearLimit && !isAtLimit && (
            <div className="flex items-center gap-1 text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs">Warning</span>
            </div>
          )}
          {isAtLimit && (
            <div className="flex items-center gap-1 text-ruby">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs">LIMIT REACHED</span>
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Used: ${dailyLossUsage.toFixed(2)}</span>
            <span className="text-slate-400">Limit: ${maxDailyLoss}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isAtLimit ? 'bg-ruby' : 
                isNearLimit ? 'bg-yellow-400' : 
                'bg-emerald'
              }`}
              style={{ width: `${Math.min(100, dailyLossPercentage)}%` }}
            />
          </div>
        </div>
        
        <p className={`text-xs ${isAtLimit ? 'text-ruby' : isNearLimit ? 'text-yellow-400' : 'text-slate-400'}`}>
          {dailyLossPercentage.toFixed(1)}% of daily limit used
        </p>
      </div>

      {/* Profit Target Progress */}
      <div className="bg-black rounded-lg p-6 border border-emerald/20">
        <div className="flex items-center justify-between mb-3">
          <p className="text-emerald text-sm font-medium">Profit Target Progress</p>
          {isProfitTargetReached && (
            <div className="flex items-center gap-1 text-emerald">
              <Target className="w-4 h-4" />
              <span className="text-xs">ACHIEVED!</span>
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Progress: ${currentEquity.toFixed(2)}</span>
            <span className="text-slate-400">Target: ${profitTarget}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isProfitTargetReached ? 'bg-emerald' : 'bg-emerald/60'
              }`}
              style={{ width: `${profitProgress}%` }}
            />
          </div>
        </div>
        
        <p className="text-slate-400 text-xs">
          {profitProgress.toFixed(1)}% toward ${profitTarget - INITIAL_BALANCE} profit target
        </p>
      </div>

      {/* Additional Metrics */}
      <div className="bg-black rounded-lg p-6 border border-emerald/20">
        <p className="text-emerald text-sm font-medium mb-3">Fixed Drawdown Metrics</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Initial Balance</span>
            <span className="text-emerald">${INITIAL_BALANCE.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Minimum Equity</span>
            <span className="text-ruby">${FIXED_MINIMUM_EQUITY.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Max Drawdown</span>
            <span className={drawdown > 8 ? 'text-ruby' : 'text-emerald'}>
              {drawdown.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total Trades</span>
            <span className="text-emerald">{trades.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Win Rate</span>
            <span className="text-emerald">
              {trades.length > 0 ? 
                ((trades.filter(t => t.outcome === 'Win').length / trades.filter(t => t.outcome !== 'Open').length) * 100).toFixed(1) : 
                0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RulesMonitor
