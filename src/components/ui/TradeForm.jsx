import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useTradeLogic } from '../../hooks/useTradeLogic'

const TradeForm = ({ onClose, onTradeAdded }) => {
  const { addTrade, loading } = useTradeLogic()
  const [formData, setFormData] = useState({
    pair: 'EURUSD',
    type: 'Long',
    timeframe: 'H1',
    setup_type: 'Breaker Block',
    entry_price: '',
    exit_price: '',
    stop_loss: '',
    take_profit: '',
    notes: ''
  })

  const pairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURGBP', 'EURJPY', 'GBPJPY', 'XAUUSD']
  const timeframes = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN1']
  const setupTypes = ['Breaker Block', 'Liquidity Sweep', 'Fair Value Gap', 'Order Block', 'Market Structure Shift', 'Smart Money Concept']

  const calculatePnL = () => {
    if (!formData.entry_price || !formData.exit_price || !formData.stop_loss) return 0
    
    const entry = parseFloat(formData.entry_price)
    const exit = parseFloat(formData.exit_price)
    const stopLoss = parseFloat(formData.stop_loss)
    
    if (!entry || !exit || !stopLoss) return 0
    
    // Calculate position size (assuming 1% risk per trade)
    const riskAmount = 100 // $100 risk (1% of $10k account)
    const riskPips = Math.abs(entry - stopLoss)
    const pipValue = riskAmount / riskPips
    
    // Calculate P&L
    const pnl = formData.type === 'Long' 
      ? (exit - entry) * pipValue
      : (entry - exit) * pipValue
    
    return pnl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.entry_price || !formData.stop_loss || !formData.take_profit) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const tradeData = {
        ...formData,
        entry_price: parseFloat(formData.entry_price),
        stop_loss: parseFloat(formData.stop_loss),
        take_profit: parseFloat(formData.take_profit),
        exit_price: formData.exit_price ? parseFloat(formData.exit_price) : null
      }

      // Calculate P&L if exit price is provided
      if (formData.exit_price) {
        tradeData.pnl_amount = calculatePnL()
        tradeData.outcome = tradeData.pnl_amount > 0 ? 'Win' : tradeData.pnl_amount < 0 ? 'Loss' : 'BE'
      } else {
        tradeData.outcome = 'Open'
      }

      await addTrade(tradeData)
      
      toast.success('Trade saved successfully!')
      
      // Reset form
      setFormData({
        pair: 'EURUSD',
        type: 'Long',
        timeframe: 'H1',
        setup_type: 'Breaker Block',
        entry_price: '',
        exit_price: '',
        stop_loss: '',
        take_profit: '',
        notes: ''
      })
      
      if (onTradeAdded) onTradeAdded()
      if (onClose) onClose()
      
    } catch (error) {
      toast.error('Failed to save trade: ' + error.message)
    }
  }

  const calculateRR = () => {
    if (!formData.entry_price || !formData.stop_loss || !formData.take_profit) return '1:0'
    
    const entry = parseFloat(formData.entry_price)
    const stopLoss = parseFloat(formData.stop_loss)
    const takeProfit = parseFloat(formData.take_profit)
    
    if (!entry || !stopLoss || !takeProfit) return '1:0'
    
    const risk = Math.abs(entry - stopLoss)
    const reward = Math.abs(takeProfit - entry)
    const rr = reward / risk
    
    return `1:${rr.toFixed(2)}`
  }

  const estimatedPnL = calculatePnL()

  return (
    <div className="glass-dark rounded-lg p-6 border border-slate-800">
      <h2 className="text-xl font-bold text-white mb-6">Record Trade</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">Currency Pair</label>
            <select
              value={formData.pair}
              onChange={(e) => setFormData({...formData, pair: e.target.value})}
              className="w-full px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white"
            >
              {pairs.map(pair => (
                <option key={pair} value={pair}>{pair}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">Trade Direction</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'Long'})}
                className={`px-3 py-2 rounded transition-colors ${
                  formData.type === 'Long' 
                    ? 'bg-bull/20 text-bull border border-bull/30' 
                    : 'glass text-white hover:bg-white/10'
                }`}
              >
                Long
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'Short'})}
                className={`px-3 py-2 rounded transition-colors ${
                  formData.type === 'Short' 
                    ? 'bg-bear/20 text-bear border border-bear/30' 
                    : 'glass text-white hover:bg-white/10'
                }`}
              >
                Short
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">Timeframe</label>
            <select
              value={formData.timeframe}
              onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
              className="w-full px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white"
            >
              {timeframes.map(tf => (
                <option key={tf} value={tf}>{tf}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">Setup Type</label>
            <select
              value={formData.setup_type}
              onChange={(e) => setFormData({...formData, setup_type: e.target.value})}
              className="w-full px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white"
            >
              {setupTypes.map(setup => (
                <option key={setup} value={setup}>{setup}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">Entry Price *</label>
            <input
              type="number"
              step="0.00001"
              value={formData.entry_price}
              onChange={(e) => setFormData({...formData, entry_price: e.target.value})}
              className="w-full px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white"
              placeholder="1.0850"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">Exit Price</label>
            <input
              type="number"
              step="0.00001"
              value={formData.exit_price}
              onChange={(e) => setFormData({...formData, exit_price: e.target.value})}
              className="w-full px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white"
              placeholder="1.0950"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">Stop Loss *</label>
            <input
              type="number"
              step="0.00001"
              value={formData.stop_loss}
              onChange={(e) => setFormData({...formData, stop_loss: e.target.value})}
              className="w-full px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white"
              placeholder="1.0800"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">Take Profit *</label>
            <input
              type="number"
              step="0.00001"
              value={formData.take_profit}
              onChange={(e) => setFormData({...formData, take_profit: e.target.value})}
              className="w-full px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white"
              placeholder="1.0950"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">Risk:Reward</label>
            <div className="px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white">
              {calculateRR()}
            </div>
          </div>

          {formData.exit_price && (
            <div>
              <label className="block text-slate-400 text-sm mb-2">Estimated P&L</label>
              <div className={`px-3 py-2 border rounded font-bold ${
                estimatedPnL >= 0 
                  ? 'bg-bull/20 text-bull border-bull/30' 
                  : 'bg-bear/20 text-bear border-bear/30'
              }`}>
                ${estimatedPnL.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="w-full px-3 py-2 bg-rich-black-900 border border-slate-700 rounded text-white"
            rows="3"
            placeholder="Trade notes and observations..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 glass px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Trade'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="glass px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default TradeForm
