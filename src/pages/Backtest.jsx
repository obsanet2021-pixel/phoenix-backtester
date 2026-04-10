import React from 'react'
import ChartContainer from '../components/charts/ChartContainer'
import { Play, Pause, SkipForward, Settings, Save } from 'lucide-react'

const Backtest = () => {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Backtesting Engine</h1>
          <p className="text-gray-500">Test your strategies with historical data</p>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-white">Backtesting Arena</h1>
          <div className="flex gap-4">
            <button className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-white hover:bg-gray-800 transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-white hover:bg-gray-800 transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Trade
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-3">
            <div className="glass-dark rounded-lg p-4 border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">EURUSD</span>
                  <span className="text-slate-400">H1</span>
                  <span className="text-bull text-sm">+0.45%</span>
                </div>
                <div className="flex gap-2">
                  <button className="glass px-3 py-1 rounded text-white hover:bg-white/10 transition-colors">
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <button className="glass px-3 py-1 rounded text-white hover:bg-white/10 transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="glass px-3 py-1 rounded text-white hover:bg-white/10 transition-colors">
                    <Pause className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <ChartContainer />
            </div>
          </div>

          {/* Trade Entry Panel */}
          <div className="lg:col-span-1">
            <div className="glass-dark rounded-lg p-4 border border-slate-800">
              <h2 className="text-lg font-bold text-white mb-4">Trade Entry</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm">Setup Type</label>
                  <select className="w-full mt-1 px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white">
                    <option>Breaker Block</option>
                    <option>Liquidity Sweep</option>
                    <option>Fair Value Gap</option>
                    <option>Order Block</option>
                    <option>Market Structure Shift</option>
                    <option>Smart Money Concept</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-sm">Trade Direction</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button className="glass px-3 py-2 rounded text-bull border border-bull/30 hover:bg-bull/10 transition-colors">
                      Long
                    </button>
                    <button className="glass px-3 py-2 rounded text-bear border border-bear/30 hover:bg-bear/10 transition-colors">
                      Short
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-sm">Entry Price</label>
                  <input 
                    type="number" 
                    className="w-full mt-1 px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white"
                    placeholder="1.0850"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-sm">Stop Loss</label>
                  <input 
                    type="number" 
                    className="w-full mt-1 px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white"
                    placeholder="1.0800"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-sm">Take Profit</label>
                  <input 
                    type="number" 
                    className="w-full mt-1 px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white"
                    placeholder="1.0950"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-sm">Risk/Reward</label>
                  <div className="mt-1 px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white">
                    1:2.5
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-sm">Notes</label>
                  <textarea 
                    className="w-full mt-1 px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white"
                    rows="3"
                    placeholder="Trade notes..."
                  />
                </div>

                <button className="w-full glass px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors font-medium">
                  Record Trade
                </button>
              </div>
            </div>

            {/* Active Trades */}
            <div className="glass-dark rounded-lg p-4 border border-slate-800 mt-4">
              <h2 className="text-lg font-bold text-white mb-4">Active Trades</h2>
              <div className="space-y-2">
                <div className="glass px-3 py-2 rounded border border-slate-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white text-sm">EURUSD</span>
                      <span className="text-bull text-xs ml-2">Long</span>
                    </div>
                    <span className="text-bull text-sm">+45.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Backtest
