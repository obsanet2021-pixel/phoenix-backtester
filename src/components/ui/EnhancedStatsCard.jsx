import React, { useState, useRef, useEffect } from 'react'
import { TrendingUp, TrendingDown, Target, Activity } from 'lucide-react'

const EnhancedStatsCard = ({ 
  title, 
  value, 
  subtitle, 
  trend = 'neutral', 
  icon: Icon = Activity,
  className = '',
  children 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setMousePosition({ x, y })
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 50, y: 50 })
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-emerald-glow'
      case 'down': return 'text-ruby-glow'
      default: return 'text-slate-400'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />
      case 'down': return <TrendingDown className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div 
      ref={cardRef}
      className={`relative z-0 h-full dark:bg-border bg-border/40 rounded-lg p-[1px] overflow-hidden transition-all duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`
      }}
    >
      {/* Mouse-tracking blur effects */}
      <div 
        className="absolute w-80 h-80 -left-40 -top-40 dark:before:bg-card-foreground/40 before:bg-emerald before:rounded-full before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] hover:before:opacity-100 before:z-10 before:blur-[100px]"
        style={{
          transform: `translate(${mousePosition.x * 0.8 - 40}%, ${mousePosition.y * 0.8 - 40}%)`
        }}
      />
      <div 
        className="absolute w-96 h-96 -left-48 -top-48 dark:after:bg-card-foreground/40 after:bg-emerald after:rounded-full after:opacity-0 after:pointer-events-none after:transition-opacity after:duration-500 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] hover:after:opacity-10 after:z-30 after:blur-[100px]"
        style={{
          transform: `translate(${mousePosition.x * 0.96 - 48}%, ${mousePosition.y * 0.96 - 48}%)`
        }}
      />

      {/* Card content */}
      <div className="relative h-full bg-card rounded-[inherit] z-20 overflow-hidden">
        <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/2 aspect-square" aria-hidden="true">
          <div className="absolute inset-0 translate-z-0 bg-card rounded-full blur-[80px]" />
        </div>

        <div className="flex flex-col h-full w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white/10 ${getTrendColor()}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-300">{title}</h4>
                {subtitle && (
                  <p className="text-xs text-slate-500">{subtitle}</p>
                )}
              </div>
            </div>
            {trend !== 'neutral' && (
              <div className={`flex items-center gap-1 ${getTrendColor()}`}>
                {getTrendIcon()}
              </div>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-black ${getTrendColor()} mb-2`}>
                {value}
              </div>
              {children && (
                <div className="text-sm text-slate-400">
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedStatsCard
