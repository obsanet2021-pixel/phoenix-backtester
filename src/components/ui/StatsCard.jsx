import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Wallet, Activity, Target } from 'lucide-react'

const StatsCard = ({ title, value, icon: Icon, color, sparklineValue = 70, trend = 'up' }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-500',
          border: 'border-emerald-500/20'
        }
      case 'blue':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-500',
          border: 'border-blue-500/20'
        }
      case 'ruby':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-500',
          border: 'border-red-500/20'
        }
      default:
        return {
          bg: 'bg-gray-500/10',
          text: 'text-gray-500',
          border: 'border-gray-500/20'
        }
    }
  }

  const colorClasses = getColorClasses(color)

  return (
    <motion.div 
      className="bg-gray-900 border border-gray-800 p-6 rounded-lg hover:border-gray-700 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.02,
        borderColor: 'rgb(34, 197, 94)'
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
          <Icon className={`w-5 h-5 ${colorClasses.text}`} />
        </div>
      </div>

      {/* Decorative Sparkline */}
      <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${sparklineValue}%` }} 
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className={`h-full ${colorClasses.text}`} 
        />
      </div>

      {/* Trend Indicator */}
      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <TrendingUp className={`w-3 h-3 ${trend === 'up' ? 'text-green-600' : 'text-red-600'} ${trend === 'down' ? 'rotate-180' : ''}`} />
          <span className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? 'Positive' : 'Negative'}
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default StatsCard
