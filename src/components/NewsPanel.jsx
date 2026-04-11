import React, { useState } from 'react';
import './NewsPanel.css';

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

          </div>
  );
};

export default NewsPanel;
