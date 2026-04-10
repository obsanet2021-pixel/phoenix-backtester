import React from 'react'
import { Search, Filter, Calendar, Download, Eye } from 'lucide-react'

const Journal = () => {
  // Sample data - replace with real data from Supabase
  const trades = [
    {
      id: 1,
      date: '2024-01-10',
      pair: 'EURUSD',
      type: 'Long',
      setup: 'Breaker Block + Liquidity Sweep',
      timeframe: 'H1',
      entry: 1.0850,
      exit: 1.0925,
      stopLoss: 1.0800,
      takeProfit: 1.0950,
      outcome: 'Win',
      pnl: 125.00,
      notes: 'Perfect breaker block formation with liquidity sweep below. Strong momentum continuation.'
    },
    {
      id: 2,
      date: '2024-01-09',
      pair: 'GBPUSD',
      type: 'Short',
      setup: 'Fair Value Gap',
      timeframe: 'H4',
      entry: 1.2750,
      exit: 1.2825,
      stopLoss: 1.2700,
      takeProfit: 1.2600,
      outcome: 'Loss',
      pnl: -75.00,
      notes: 'FVG got filled quickly, market reversed against position. Need better context analysis.'
    },
    {
      id: 3,
      date: '2024-01-08',
      pair: 'XAUUSD',
      type: 'Long',
      setup: 'Order Block',
      timeframe: 'D1',
      entry: 2025.50,
      exit: 2045.50,
      stopLoss: 2015.50,
      takeProfit: 2065.50,
      outcome: 'Win',
      pnl: 200.00,
      notes: 'Daily order block held perfectly. Risk management was key on this volatile pair.'
    }
  ]

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-white">Trading Journal</h1>
          <div className="flex gap-4">
            <button className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-white hover:bg-gray-800 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="glass-dark rounded-lg p-4 border border-slate-800 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search trades..."
                className="w-full pl-10 pr-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white"
              />
            </div>
            
            <select className="px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white">
              <option>All Pairs</option>
              <option>EURUSD</option>
              <option>GBPUSD</option>
              <option>XAUUSD</option>
            </select>
            
            <select className="px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white">
              <option>All Setups</option>
              <option>Breaker Block</option>
              <option>Liquidity Sweep</option>
              <option>Fair Value Gap</option>
              <option>Order Block</option>
            </select>
            
            <select className="px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white">
              <option>All Outcomes</option>
              <option>Win</option>
              <option>Loss</option>
              <option>BE</option>
            </select>
          </div>
        </div>

        {/* Trade Cards */}
        <div className="space-y-4">
          {trades.map(trade => (
            <div key={trade.id} className="glass-dark rounded-lg p-6 border border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{trade.pair}</h3>
                    <p className="text-slate-400 text-sm">{trade.date} - {trade.timeframe}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trade.type === 'Long' ? 'bg-bull/20 text-bull' : 'bg-bear/20 text-bear'
                    }`}>
                      {trade.type}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trade.outcome === 'Win' ? 'bg-bull/20 text-bull' : 
                      trade.outcome === 'Loss' ? 'bg-bear/20 text-bear' : 
                      'bg-neutral/20 text-neutral'
                    }`}>
                      {trade.outcome}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${trade.pnl >= 0 ? 'text-bull' : 'text-bear'}`}>
                    ${trade.pnl.toFixed(2)}
                  </p>
                  <p className="text-slate-400 text-sm">P&L</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Setup</p>
                  <p className="text-white">{trade.setup}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Entry</p>
                  <p className="text-white">{trade.entry}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Stop Loss</p>
                  <p className="text-bear">{trade.stopLoss}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Take Profit</p>
                  <p className="text-bull">{trade.takeProfit}</p>
                </div>
              </div>

              {trade.exit && (
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">Exit Price</p>
                    <p className="text-white">{trade.exit}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">R:R Ratio</p>
                    <p className="text-white">1:{((Math.abs(trade.entry - trade.takeProfit) / Math.abs(trade.entry - trade.stopLoss))).toFixed(1)}</p>
                  </div>
                </div>
              )}

              {trade.notes && (
                <div className="border-t border-slate-700 pt-4">
                  <p className="text-slate-400 text-sm mb-2">Notes</p>
                  <p className="text-slate-300">{trade.notes}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button className="glass px-3 py-1 rounded text-white hover:bg-white/10 transition-colors flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Chart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button className="glass px-3 py-2 rounded text-white hover:bg-white/10 transition-colors">
              Previous
            </button>
            <button className="glass px-3 py-2 rounded text-bull border border-bull/30">
              1
            </button>
            <button className="glass px-3 py-2 rounded text-white hover:bg-white/10 transition-colors">
              2
            </button>
            <button className="glass px-3 py-2 rounded text-white hover:bg-white/10 transition-colors">
              3
            </button>
            <button className="glass px-3 py-2 rounded text-white hover:bg-white/10 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Journal
