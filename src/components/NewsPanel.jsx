import React, { useState } from 'react';

const NewsPanel = () => {
  const [selectedCurrencies, setSelectedCurrencies] = useState(['USD', 'EUR', 'GBP']);
  const [activeTab, setActiveTab] = useState('Today');
  const [selectedImpacts, setSelectedImpacts] = useState(['High', 'Medium', 'Low']);

  const currencies = ['AUD', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'JPY', 'NZD', 'USD'];
  
  const newsEvents = [
    { impact: 'High', time: '14:30', currency: 'USD', event: 'Unemployment Rate', forecast: '3.7%', previous: '3.8%' },
    { impact: 'Medium', time: '10:00', currency: 'EUR', event: 'CPI Flash Estimate', forecast: '2.4%', previous: '2.3%' },
    { impact: 'Low', time: '09:30', currency: 'GBP', event: 'Services PMI', forecast: '52.5', previous: '52.3' },
    { impact: 'High', time: '15:00', currency: 'JPY', event: 'Monetary Policy Statement', forecast: 'No Change', previous: 'No Change' },
    { impact: 'Medium', time: '08:30', currency: 'AUD', event: 'Retail Sales m/m', forecast: '0.3%', previous: '0.2%' },
  ];

  const toggleCurrency = (currency) => {
    if (selectedCurrencies.includes(currency)) {
      setSelectedCurrencies(selectedCurrencies.filter(c => c !== currency));
    } else {
      setSelectedCurrencies([...selectedCurrencies, currency]);
    }
  };

  const toggleImpact = (impact) => {
    if (selectedImpacts.includes(impact)) {
      setSelectedImpacts(selectedImpacts.filter(i => i !== impact));
    } else {
      setSelectedImpacts([...selectedImpacts, impact]);
    }
  };

  const filteredNews = newsEvents.filter(news => 
    selectedCurrencies.includes(news.currency) && 
    selectedImpacts.includes(news.impact)
  );

  return (
    <div className="news-panel">
      <div className="panel-header">
        <h3>News</h3>
        <span className="period-range">(+/- 7 days)</span>
        <div className="timezone">Times are shown in Europe/London</div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>IMPACT</label>
          <div className="impact-buttons">
            <button 
              className={`impact-high ${selectedImpacts.includes('High') ? 'active' : ''}`}
              onClick={() => toggleImpact('High')}
            >
              High
            </button>
            <button 
              className={`impact-med ${selectedImpacts.includes('Medium') ? 'active' : ''}`}
              onClick={() => toggleImpact('Medium')}
            >
              Medium
            </button>
            <button 
              className={`impact-low ${selectedImpacts.includes('Low') ? 'active' : ''}`}
              onClick={() => toggleImpact('Low')}
            >
              Low
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>HOLIDAYS</label>
          <button className="holiday-btn">Holiday</button>
        </div>

        <div className="filter-group">
          <label>CURRENCIES</label>
          <div className="currencies-grid">
            {currencies.map(curr => (
              <button
                key={curr}
                className={`currency-btn ${selectedCurrencies.includes(curr) ? 'active' : ''}`}
                onClick={() => toggleCurrency(curr)}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="news-tabs">
        <button 
          className={`tab ${activeTab === 'Today' ? 'active' : ''}`}
          onClick={() => setActiveTab('Today')}
        >
          Today
        </button>
        <button 
          className={`tab ${activeTab === 'Next week' ? 'active' : ''}`}
          onClick={() => setActiveTab('Next week')}
        >
          Next week
        </button>
        <button 
          className={`tab ${activeTab === 'Last week' ? 'active' : ''}`}
          onClick={() => setActiveTab('Last week')}
        >
          Last week
        </button>
      </div>

      <div className="news-list">
        {filteredNews.length === 0 ? (
          <div className="no-events">No events for this period.</div>
        ) : (
          filteredNews.map((news, idx) => (
            <div key={idx} className="news-item">
              <div className={`impact-badge impact-${news.impact.toLowerCase()}`}>
                {news.impact}
              </div>
              <div className="news-details">
                <div className="news-time">{news.time}</div>
                <div className="news-currency">{news.currency}</div>
                <div className="news-event">{news.event}</div>
                <div className="news-forecast">
                  F: {news.forecast} | P: {news.previous}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .news-panel {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #1a1a1a;
        }

        .panel-header {
          padding: 16px;
          border-bottom: 1px solid #2d2d2d;
        }

        .panel-header h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          color: #ff6b00;
        }

        .period-range {
          font-size: 11px;
          color: #6b7280;
        }

        .timezone {
          font-size: 10px;
          color: #6b7280;
          margin-top: 4px;
        }

        .filters-section {
          padding: 16px;
          border-bottom: 1px solid #2d2d2d;
        }

        .filter-group {
          margin-bottom: 16px;
        }

        .filter-group label {
          display: block;
          font-size: 11px;
          color: #9ca3af;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .impact-buttons {
          display: flex;
          gap: 8px;
        }

        .impact-buttons button {
          flex: 1;
          padding: 4px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .impact-high {
          background: #374151;
          color: #ef4444;
          border: 1px solid #ef4444;
        }

        .impact-high.active {
          background: #ef4444;
          color: white;
        }

        .impact-med {
          background: #374151;
          color: #f59e0b;
          border: 1px solid #f59e0b;
        }

        .impact-med.active {
          background: #f59e0b;
          color: white;
        }

        .impact-low {
          background: #374151;
          color: #10b981;
          border: 1px solid #10b981;
        }

        .impact-low.active {
          background: #10b981;
          color: white;
        }

        .holiday-btn {
          background: #374151;
          color: #e5e5e5;
          border: 1px solid #374151;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .holiday-btn:hover {
          border-color: #ff6b00;
          color: #ff6b00;
        }

        .currencies-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }

        .currency-btn {
          background: #2d2d2d;
          color: #9ca3af;
          border: 1px solid #2d2d2d;
          padding: 4px;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .currency-btn.active {
          background: #ff6b00;
          color: white;
          border-color: #ff6b00;
        }

        .currency-btn:hover {
          background: #ff6b00;
          color: white;
          border-color: #ff6b00;
        }

        .news-tabs {
          display: flex;
          border-bottom: 1px solid #2d2d2d;
        }

        .tab {
          flex: 1;
          background: transparent;
          border: none;
          padding: 10px;
          color: #9ca3af;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .tab.active {
          color: #ff6b00;
          border-bottom: 2px solid #ff6b00;
        }

        .news-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .no-events {
          text-align: center;
          color: #6b7280;
          padding: 40px;
          font-size: 13px;
        }

        .news-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #1f1f1f;
          border-radius: 6px;
          margin-bottom: 8px;
          transition: all 0.2s;
        }

        .news-item:hover {
          background: #252525;
        }

        .impact-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          min-width: 48px;
          text-align: center;
        }

        .impact-high { 
          background: #ef4444; 
          color: white; 
        }
        .impact-medium { 
          background: #f59e0b; 
          color: white; 
        }
        .impact-low { 
          background: #10b981; 
          color: white; 
        }

        .news-details {
          flex: 1;
        }

        .news-time {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 600;
        }

        .news-currency {
          font-size: 12px;
          color: #ff6b00;
          margin-top: 2px;
        }

        .news-event {
          font-size: 12px;
          margin-top: 2px;
        }

        .news-forecast {
          font-size: 10px;
          color: #6b7280;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

export default NewsPanel;
