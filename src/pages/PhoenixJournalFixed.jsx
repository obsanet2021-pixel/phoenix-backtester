import React, { useState, useEffect } from 'react';
import './PhoenixJournalFixed.css';

const PhoenixJournalFixed = () => {
  const [trades, setTrades] = useState([]);
  const [newTrade, setNewTrade] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    pair: 'GBP/USD',
    type: 'Buy',
    entry: '',
    exit: '',
    sl: '',
    tp: '',
    size: '',
    notes: ''
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load trades from localStorage
  useEffect(() => {
    const savedTrades = localStorage.getItem('phoenixJournalTrades');
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
  }, []);

  // Save trades to localStorage
  const saveTrades = (tradesData) => {
    setTrades(tradesData);
    localStorage.setItem('phoenixJournalTrades', JSON.stringify(tradesData));
  };

  const addTrade = () => {
    if (!newTrade.entry || !newTrade.size) {
      alert('Please fill in entry price and position size');
      return;
    }

    const trade = {
      id: Date.now(),
      ...newTrade,
      pnl: newTrade.exit ? calculatePnL(newTrade) : 0,
      status: newTrade.exit ? 'closed' : 'open'
    };

    saveTrades([trade, ...trades]);
    setNewTrade({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      pair: 'GBP/USD',
      type: 'Buy',
      entry: '',
      exit: '',
      sl: '',
      tp: '',
      size: '',
      notes: ''
    });
  };

  const calculatePnL = (trade) => {
    const entry = parseFloat(trade.entry);
    const exit = parseFloat(trade.exit);
    const size = parseFloat(trade.size);
    const multiplier = trade.type === 'Buy' ? 1 : -1;
    return (exit - entry) * size * multiplier;
  };

  const deleteTrade = (tradeId) => {
    if (confirm('Are you sure you want to delete this trade?')) {
      saveTrades(trades.filter(t => t.id !== tradeId));
    }
  };

  const editTrade = (tradeId) => {
    const trade = trades.find(t => t.id === tradeId);
    if (trade) {
      setNewTrade({
        ...trade,
        date: trade.date,
        time: trade.time
      });
    }
  };

  const closeTrade = (tradeId) => {
    const trade = trades.find(t => t.id === tradeId);
    if (trade && !trade.exit) {
      const currentPrice = prompt('Enter exit price:', newTrade.entry);
      if (currentPrice) {
        const updatedTrades = trades.map(t => 
          t.id === tradeId 
            ? { ...t, exit: currentPrice, status: 'closed', pnl: calculatePnL({ ...t, exit: currentPrice }) }
            : t
        );
        saveTrades(updatedTrades);
      }
    }
  };

  const exportJournal = () => {
    const data = {
      trades,
      exportDate: new Date().toISOString(),
      summary: {
        totalTrades: trades.length,
        closedTrades: trades.filter(t => t.status === 'closed').length,
        openTrades: trades.filter(t => t.status === 'open').length,
        totalPnL: trades.filter(t => t.status === 'closed').reduce((sum, t) => sum + t.pnl, 0)
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phoenix-journal.json';
    a.click();
  };

  const filteredTrades = trades.filter(trade => {
    const matchesFilter = filter === 'all' || trade.status === filter;
    const matchesSearch = searchTerm === '' || 
      trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.notes.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const summary = {
    total: trades.length,
    open: trades.filter(t => t.status === 'open').length,
    closed: trades.filter(t => t.status === 'closed').length,
    pnl: trades.filter(t => t.status === 'closed').reduce((sum, t) => sum + t.pnl, 0),
    winRate: trades.filter(t => t.status === 'closed' && t.pnl > 0).length / Math.max(1, trades.filter(t => t.status === 'closed').length) * 100
  };

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h1>📓 Trading Journal</h1>
        <p>Track your trades, analyze performance, and improve your strategy</p>
      </div>

      <div className="journal-stats">
        <div className="stat-card">
          <div className="stat-number">{summary.total}</div>
          <div className="stat-label">Total Trades</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{summary.open}</div>
          <div className="stat-label">Open</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{summary.closed}</div>
          <div className="stat-label">Closed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{color: summary.pnl >= 0 ? '#22c55e' : '#ef4444'}}>
            ${summary.pnl.toFixed(2)}
          </div>
          <div className="stat-label">Total P&L</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{summary.winRate.toFixed(1)}%</div>
          <div className="stat-label">Win Rate</div>
        </div>
      </div>

      <div className="journal-form">
        <h3>Add New Trade</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={newTrade.date}
              onChange={(e) => setNewTrade({...newTrade, date: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              value={newTrade.time}
              onChange={(e) => setNewTrade({...newTrade, time: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Currency Pair</label>
            <select
              value={newTrade.pair}
              onChange={(e) => setNewTrade({...newTrade, pair: e.target.value})}
            >
              <option>GBP/USD</option>
              <option>EUR/USD</option>
              <option>USD/JPY</option>
              <option>AUD/USD</option>
              <option>USD/CAD</option>
            </select>
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              value={newTrade.type}
              onChange={(e) => setNewTrade({...newTrade, type: e.target.value})}
            >
              <option>Buy</option>
              <option>Sell</option>
            </select>
          </div>
          <div className="form-group">
            <label>Entry Price</label>
            <input
              type="number"
              step="0.00001"
              value={newTrade.entry}
              onChange={(e) => setNewTrade({...newTrade, entry: e.target.value})}
              placeholder="1.2345"
            />
          </div>
          <div className="form-group">
            <label>Exit Price</label>
            <input
              type="number"
              step="0.00001"
              value={newTrade.exit}
              onChange={(e) => setNewTrade({...newTrade, exit: e.target.value})}
              placeholder="1.2365"
            />
          </div>
          <div className="form-group">
            <label>Stop Loss</label>
            <input
              type="number"
              step="0.00001"
              value={newTrade.sl}
              onChange={(e) => setNewTrade({...newTrade, sl: e.target.value})}
              placeholder="1.2300"
            />
          </div>
          <div className="form-group">
            <label>Take Profit</label>
            <input
              type="number"
              step="0.00001"
              value={newTrade.tp}
              onChange={(e) => setNewTrade({...newTrade, tp: e.target.value})}
              placeholder="1.2400"
            />
          </div>
          <div className="form-group">
            <label>Position Size</label>
            <input
              type="number"
              step="0.01"
              value={newTrade.size}
              onChange={(e) => setNewTrade({...newTrade, size: e.target.value})}
              placeholder="0.10"
            />
          </div>
          <div className="form-group full-width">
            <label>Notes</label>
            <textarea
              value={newTrade.notes}
              onChange={(e) => setNewTrade({...newTrade, notes: e.target.value})}
              placeholder="Trade setup, market conditions, strategy notes..."
              rows="3"
            />
          </div>
        </div>
        <div className="form-actions">
          <button className="add-btn" onClick={addTrade}>
            ➕ Add Trade
          </button>
          <button className="export-btn" onClick={exportJournal}>
            📤 Export Journal
          </button>
        </div>
      </div>

      <div className="journal-filters">
        <div className="filter-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Trades</option>
            <option value="open">Open Only</option>
            <option value="closed">Closed Only</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search trades..."
          />
        </div>
      </div>

      <div className="trades-table">
        <div className="table-header">
          <div>Date</div>
          <div>Time</div>
          <div>Pair</div>
          <div>Type</div>
          <div>Entry</div>
          <div>Exit</div>
          <div>Size</div>
          <div>P&L</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        {filteredTrades.length === 0 ? (
          <div className="no-trades">
            <p>No trades found. Start by adding your first trade above!</p>
          </div>
        ) : (
          filteredTrades.map(trade => (
            <div key={trade.id} className={`trade-row ${trade.status}`}>
              <div>{trade.date}</div>
              <div>{trade.time}</div>
              <div>{trade.pair}</div>
              <div className={trade.type}>{trade.type}</div>
              <div>{trade.entry}</div>
              <div>{trade.exit || '-'}</div>
              <div>{trade.size}</div>
              <div className={trade.pnl >= 0 ? 'profit' : 'loss'}>
                {trade.pnl !== 0 ? `$${trade.pnl.toFixed(2)}` : '-'}
              </div>
              <div className={`status ${trade.status}`}>
                {trade.status}
              </div>
              <div className="actions">
                {trade.status === 'open' && (
                  <button onClick={() => closeTrade(trade.id)} title="Close Trade">
                    ✅
                  </button>
                )}
                <button onClick={() => editTrade(trade.id)} title="Edit Trade">
                  ✏️
                </button>
                <button onClick={() => deleteTrade(trade.id)} title="Delete Trade">
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PhoenixJournalFixed;
