import React from 'react'
import { useTradeLogic } from '../hooks/useTradeLogic'
import EquityCurve from '../components/charts/EquityCurve'
import RulesMonitor from '../components/ui/RulesMonitor'
import ActivityHeatmap from '../components/charts/ActivityHeatmap'
import StatsCard from '../components/ui/StatsCard'
import { Wallet, Activity, Target, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const { trades, loading, getMetrics } = useTradeLogic()
  const metrics = getMetrics()
  
  // Phoenix Challenge Constants
  const accountSize = 10000
  const fixedDrawdownLimit = 9200 // $9,200 floor (8% drawdown)
  const profitTarget = 20000 // $20,000 target (100% gain)

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-emerald text-xl">Loading Phoenix Challenge data...</div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-black min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">Overview</h1>
          <p className="text-gray-500 text-sm">Phoenix $10,000 Challenge</p>
        </div>
        <div className="text-right">
          <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
            ACCOUNT ACTIVE
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Total Balance" 
          value={`$${accountSize.toLocaleString()}`} 
          icon={Wallet} 
          color="emerald"
          sparklineValue={85}
          trend="up"
        />
        <StatsCard 
          title="Daily P&L" 
          value={`+$${(metrics.currentEquity - accountSize).toFixed(2)}`} 
          icon={Activity} 
          color="blue"
          sparklineValue={metrics.currentEquity >= accountSize ? 70 : 30}
          trend={metrics.currentEquity >= accountSize ? 'up' : 'down'}
        />
        <StatsCard 
          title="Max Drawdown" 
          value={`$${(accountSize - metrics.maxDrawdown).toFixed(2)}`} 
          icon={Target} 
          color="ruby"
          sparklineValue={40}
          trend="down"
        />
        <StatsCard 
          title="Win Rate" 
          value="68%" 
          icon={TrendingUp} 
          color="emerald"
          sparklineValue={75}
          trend="up"
        />
      </div>

      {/* Main Chart Area */}
      <div className="mb-8">
        <EquityCurve trades={trades} />
      </div>

      {/* Secondary Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rules Monitor */}
        <div>
          <RulesMonitor 
            currentEquity={metrics.currentEquity}
            fixedDrawdownLimit={fixedDrawdownLimit}
            profitTarget={profitTarget}
            dailyLossLimit={400}
          />
        </div>

        {/* Recent Trades */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Trades</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-3 text-sm font-semibold text-gray-400">Date</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-400">Pair</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-400">Type</th>
                  <th className="text-right p-3 text-sm font-semibold text-gray-400">P&L</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(0, 5).map((trade, index) => (
                  <tr key={trade.id} className={`border-b border-gray-800 ${index % 2 === 1 ? 'bg-gray-800/50' : ''}`}>
                    <td className="p-3 text-sm text-gray-400">
                      {new Date(trade.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-sm text-gray-400">{trade.pair}</td>
                    <td className="p-3 text-sm text-gray-400">{trade.type}</td>
                    <td className={`p-3 text-sm text-right font-semibold ${
                      trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
