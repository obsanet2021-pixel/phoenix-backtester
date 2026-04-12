import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('');
  const fullText = ">_ Backtest like a predator. Trade like a pro.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      
      {/* Animated Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }}
      />
      
      {/* Glowing Orbs */}
      <div 
        className="absolute top-20 left-20 w-96 h-96 bg-green-500 rounded-full blur-[100px] opacity-20 animate-pulse"
        style={{ transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)` }}
      />
      <div 
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-20 animate-pulse delay-1000"
        style={{ transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)` }}
      />

      {/* Navigation - Minimal, aggressive */}
      <nav className="relative z-10 border-b border-green-500/20 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-sm animate-pulse" />
            <span className="font-mono font-bold text-xl tracking-tighter">
              PHOENIX<span className="text-green-500">_BT</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="font-mono text-sm text-gray-400 hover:text-green-500 transition-colors">
              [features]
            </a>
            <a href="#demo" className="font-mono text-sm text-gray-400 hover:text-green-500 transition-colors">
              [demo]
            </a>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-green-500 text-black font-mono text-sm font-bold hover:bg-green-400 transition-all transform hover:scale-105"
            >
              ENTER_TERMINAL →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Terminal Style */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          
          {/* Terminal Header */}
          <div className="bg-black/80 border border-green-500/30 rounded-t-lg p-3 font-mono text-xs text-green-500">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4">root@phoenix:~/backtester</span>
            </div>
          </div>
          
          {/* Terminal Content */}
          <div className="bg-black/90 border border-t-0 border-green-500/30 rounded-b-lg p-8 font-mono">
            <div className="mb-6">
              <span className="text-green-500">$</span>
              <span className="text-gray-400 ml-2">./deploy --strategy=aggressive</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
              <span className="text-white">{typedText}</span>
              <span className="animate-pulse text-green-500">_</span>
            </h1>
            
            <p className="text-gray-400 text-lg mb-8 max-w-2xl font-mono leading-relaxed">
              {">"} Professional backtesting with prop firm challenges, real-time analytics, and execution-grade data. <span className="text-green-500">No more guessing.</span>
            </p>
            
            <div className="flex gap-4 flex-wrap">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-green-500 text-black font-mono font-bold text-lg hover:bg-green-400 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                INITIALIZE_SESSION →
              </button>
              <button 
                onClick={() => navigate('/simulator')}
                className="px-8 py-4 border border-green-500 text-green-500 font-mono font-bold text-lg hover:bg-green-500/10 transition-all"
              >
                [TRY_DEMO]
              </button>
            </div>
            
            {/* Stats Bar */}
            <div className="mt-12 pt-8 border-t border-green-500/20 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-gray-500 text-xs">ACTIVE_TRADERS</div>
                <div className="text-2xl font-bold text-white">10,428</div>
                <div className="text-green-500 text-xs">↑ +23% this month</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">AVG_WIN_RATE</div>
                <div className="text-2xl font-bold text-white">68.7%</div>
                <div className="text-green-500 text-xs">↑ +12% improvement</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">BACKTEST_HOURS</div>
                <div className="text-2xl font-bold text-white">247,891</div>
                <div className="text-green-500 text-xs">executed this week</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">PROP_CHALLENGES</div>
                <div className="text-2xl font-bold text-white">3,247</div>
                <div className="text-green-500 text-xs">completed successfully</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Market Ticker */}
        <div className="mt-20 overflow-hidden border-t border-b border-green-500/20 bg-black/50 py-2">
          <div className="animate-marquee whitespace-nowrap font-mono text-sm">
            <span className="text-green-500">XAU/USD</span> <span className="text-white">$2,342.80</span> <span className="text-green-500">↑ +0.34%</span>
            <span className="mx-8 text-gray-600">||</span>
            <span className="text-green-500">EUR/USD</span> <span className="text-white">1.0892</span> <span className="text-red-500">↓ -0.12%</span>
            <span className="mx-8 text-gray-600">||</span>
            <span className="text-green-500">BTC/USD</span> <span className="text-white">$52,340</span> <span className="text-green-500">↑ +2.15%</span>
            <span className="mx-8 text-gray-600">||</span>
            <span className="text-green-500">SPX</span> <span className="text-white">5,234.56</span> <span className="text-green-500">↑ +0.67%</span>
            <span className="mx-8 text-gray-600">||</span>
            <span className="text-green-500">OIL</span> <span className="text-white">$78.34</span> <span className="text-red-500">↓ -0.45%</span>
          </div>
        </div>

        {/* Features - Matrix Style */}
        <div id="features" className="mt-32">
          <div className="text-center mb-16">
            <div className="font-mono text-green-500 text-sm mb-4">[ SYSTEM_CAPABILITIES ]</div>
            <h2 className="text-4xl md:text-5xl font-bold font-mono">We don't guess. <span className="text-green-500">We execute.</span></h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                title: "REAL-TIME_ANALYTICS",
                description: "Watch your performance metrics update in real-time as you trade. No delays, no excuses.",
                metric: "< 100ms",
                metricLabel: "latency"
              },
              {
                icon: "🎯",
                title: "PROP_FIRM_SIM",
                description: "Practice with actual prop firm rules - daily loss limits, drawdowns, and profit targets.",
                metric: "98.4%",
                metricLabel: "accuracy rate"
              },
              {
                icon: "📊",
                title: "DEEP_ANALYSIS",
                description: "Win rates, RR ratios, drawdowns, Monte Carlo simulations - every metric you need.",
                metric: "40+",
                metricLabel: "analytics metrics"
              }
            ].map((feature, i) => (
              <div key={i} className="group bg-black/60 border border-green-500/20 hover:border-green-500/50 transition-all p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <div className="font-mono text-green-500 text-sm mb-2">{feature.title}</div>
                <p className="text-gray-400 mb-4 leading-relaxed">{feature.description}</p>
                <div className="pt-4 border-t border-green-500/20">
                  <div className="text-2xl font-bold text-white">{feature.metric}</div>
                  <div className="text-xs text-gray-500 font-mono">{feature.metricLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Demo Preview - In-Place Dashboard */}
        <div id="demo" className="mt-32">
          <div className="text-center mb-8">
            <div className="font-mono text-green-500 text-sm mb-2">[ LIVE_PREVIEW ]</div>
            <h2 className="text-3xl md:text-4xl font-bold font-mono">See the matrix in action</h2>
          </div>
          
          <div className="bg-black/80 border border-green-500/30 rounded-lg overflow-hidden">
            {/* Dashboard Preview Header */}
            <div className="bg-green-500/10 p-4 border-b border-green-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-mono text-sm text-green-500">LIVE_DATA_STREAM</span>
                </div>
                <div className="font-mono text-xs text-gray-500">refresh: 1.2ms</div>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Real-time KPIs */}
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "TOTAL_PNL", value: "+$3,048", change: "+3.05%", positive: true },
                    { label: "WIN_RATE", value: "66.7%", change: "+12.3%", positive: true },
                    { label: "PROFIT_FACTOR", value: "1.85", change: "+0.23", positive: true },
                    { label: "SHARPE_RATIO", value: "1.92", change: "excellent", positive: true }
                  ].map((kpi, i) => (
                    <div key={i} className="bg-green-500/5 p-4 rounded border border-green-500/20">
                      <div className="font-mono text-xs text-gray-500">{kpi.label}</div>
                      <div className="text-2xl font-bold text-white mt-1">{kpi.value}</div>
                      <div className={`text-xs font-mono mt-1 ${kpi.positive ? 'text-green-500' : 'text-red-500'}`}>
                        {kpi.change}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Trade Feed */}
                <div className="lg:col-span-2 bg-green-500/5 rounded p-4 border border-green-500/20">
                  <div className="font-mono text-xs text-gray-500 mb-3">[ RECENT_EXECUTIONS ]</div>
                  <div className="space-y-2">
                    {[
                      { pair: "XAU/USD", action: "BUY", size: "2.5", price: "2342.80", pnl: "+$2,024", time: "09:34:22" },
                      { pair: "XAU/USD", action: "SELL", size: "1.0", price: "2345.20", pnl: "-$500", time: "10:15:47" },
                      { pair: "EUR/USD", action: "BUY", size: "5.0", price: "1.0892", pnl: "+$1,524", time: "11:02:13" }
                    ].map((trade, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-black/50 rounded font-mono text-sm">
                        <div className="flex items-center gap-4">
                          <span className={trade.action === 'BUY' ? 'text-green-500' : 'text-red-500'}>{trade.action}</span>
                          <span className="text-white">{trade.pair}</span>
                          <span className="text-gray-500">{trade.size}</span>
                          <span className="text-gray-500">{trade.price}</span>
                        </div>
                        <div className={trade.pnl.includes('+') ? 'text-green-500' : 'text-red-500'}>
                          {trade.pnl}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Equity Curve Mini */}
                <div className="bg-green-500/5 rounded p-4 border border-green-500/20">
                  <div className="font-mono text-xs text-gray-500 mb-3">[ EQUITY_CURVE ]</div>
                  <div className="h-32 flex items-end gap-1">
                    {[65, 72, 68, 75, 82, 78, 85, 90, 88, 92, 95, 100].map((height, i) => (
                      <div key={i} className="flex-1 bg-green-500/30 hover:bg-green-500 transition-all" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>04:00</span>
                    <span>12:00</span>
                    <span>20:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA - Aggressive */}
        <div className="mt-32 mb-20">
          <div className="bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 border-t border-b border-green-500/30 py-16">
            <div className="text-center">
              <div className="font-mono text-green-500 text-sm mb-4">[ READY_FOR_DEPLOYMENT ]</div>
              <h2 className="text-4xl md:text-6xl font-bold font-mono mb-6">Stop backtesting in spreadsheets.</h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join 10,000+ traders who've upgraded to professional-grade backtesting.
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-12 py-5 bg-green-500 text-black font-mono font-bold text-xl hover:bg-green-400 transition-all transform hover:scale-105 inline-flex items-center gap-3"
              >
                DEPLOY_STRATEGY →
              </button>
              <div className="mt-6 font-mono text-xs text-gray-500">
                &gt;_ No credit card required. Cancel anytime.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
