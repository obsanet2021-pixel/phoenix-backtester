import React, { useState, useEffect, useRef } from 'react'
import { Calendar, Activity } from 'lucide-react'

const ActivityHeatmap = ({ trades = [], className = '' }) => {
  const [heatmapData, setHeatmapData] = useState({})
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const containerRef = useRef(null)

  // Generate heatmap data from trades
  useEffect(() => {
    if (!trades || trades.length === 0) {
      // Generate sample data for demonstration
      const sampleData = generateSampleData()
      setHeatmapData(sampleData)
      return
    }

    const data = {}
    trades.forEach(trade => {
      if (trade.created_at) {
        const date = new Date(trade.created_at)
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        data[dateKey] = (data[dateKey] || 0) + 1
      }
    })
    setHeatmapData(data)
  }, [trades])

  const generateSampleData = () => {
    const data = {}
    const today = new Date()
    
    // Generate sample activity for the last 90 days
    for (let i = 0; i < 90; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Random activity: 0-10 trades per day
      const tradeCount = Math.floor(Math.random() * 11)
      if (tradeCount > 0) {
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        data[dateKey] = tradeCount
      }
    }
    
    return data
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const getActivityLevel = (day, month, year) => {
    const dateKey = `${year}-${month}-${day}`
    const count = heatmapData[dateKey] || 0
    
    if (count === 0) return 0
    if (count <= 3) return 1
    if (count <= 6) return 2
    return 3
  }

  const getCellColor = (level) => {
    switch (level) {
      case 0: return 'bg-slate-800/50'
      case 1: return 'bg-emerald-900/40'
      case 2: return 'bg-emerald-700/60'
      case 3: return 'bg-emerald-500/80'
      default: return 'bg-slate-800/50'
    }
  }

  const renderMonth = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth)
    const weeks = []
    let days = []

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-6 h-6"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const level = getActivityLevel(day, selectedMonth, selectedYear)
      const dateKey = `${selectedYear}-${selectedMonth}-${day}`
      const count = heatmapData[dateKey] || 0

      days.push(
        <div
          key={day}
          className={`w-6 h-6 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 ${getCellColor(level)}`}
          title={`${count} trades on ${selectedMonth + 1}/${day}/${selectedYear}`}
        >
          {count > 0 && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
            </div>
          )}
        </div>
      )

      // Start new week after Sunday
      if ((firstDay + day - 1) % 7 === 6 || day === daysInMonth) {
        weeks.push(
          <div key={`week-${weeks.length}`} className="flex gap-1">
            {days}
          </div>
        )
        days = []
      }
    }

    return weeks
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  const totalTrades = Object.values(heatmapData).reduce((sum, count) => sum + count, 0)
  const activeDays = Object.keys(heatmapData).length

  return (
    <div className={`luxury-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-emerald-glow" />
          <h3 className="text-xl font-black text-white">Activity Heatmap</h3>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
          >
            {monthNames.map((name, index) => (
              <option key={name} value={index}>{name}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
          >
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-slate-400 mb-2">
          {totalTrades} trades across {activeDays} active days
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-7 gap-1 text-xs text-slate-500 mb-2">
          {weekDays.map((day, index) => (
            <div key={index} className="flex items-center justify-center h-6">
              {day}
            </div>
          ))}
        </div>
        
        <div className="space-y-1">
          {renderMonth()}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-slate-800/50"></div>
          <span className="text-xs text-slate-400">No trades</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-900/40"></div>
          <span className="text-xs text-slate-400">Low activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-700/60"></div>
          <span className="text-xs text-slate-400">Medium activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500/80"></div>
          <span className="text-xs text-slate-400">High activity</span>
        </div>
      </div>
    </div>
  )
}

export default ActivityHeatmap
