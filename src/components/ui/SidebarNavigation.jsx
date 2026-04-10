import React from 'react'
import { BarChart3, TrendingUp, BookOpen, Flame } from 'lucide-react'

const SidebarNavigation = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'backtest', label: 'Backtest', icon: BarChart3 },
    { id: 'journal', label: 'Journal', icon: BookOpen }
  ]

  return (
    <div className="w-64 bg-black min-h-screen border-r border-gray-800">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
            <Flame className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Phoenix</h1>
            <p className="text-gray-500 text-xs">Challenge</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Account Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-xs font-medium uppercase">Account</span>
            <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              ACTIVE
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Type</span>
              <span className="text-white text-sm font-medium">$10k Evaluation</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Status</span>
              <span className="text-green-600 text-sm font-medium">Trading</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarNavigation
