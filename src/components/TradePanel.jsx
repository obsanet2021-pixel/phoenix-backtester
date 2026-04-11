import React, { useState, useEffect } from 'react';
import './TradePanel.css';

const TradePanel = ({ onPlaceOrder, currentPrice, balance, riskPercent, setRiskPercent }) => {
  const [orderType, setOrderType] = useState('Market');
  const [side, setSide] = useState('Buy');
  const [entryPrice, setEntryPrice] = useState(currentPrice);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [riskAmount, setRiskAmount] = useState((balance * riskPercent) / 100);
  const [partials, setPartials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setEntryPrice(currentPrice);
    calculateRiskAmount();
  }, [currentPrice]);

  const calculateRiskAmount = () => {
    const amount = (balance * riskPercent) / 100;
    setRiskAmount(amount);
  };

  const handleRiskPercentChange = (value) => {
    const newRiskPercent = Math.max(0.1, Math.min(5, value));
    setRiskPercent(newRiskPercent);
    const amount = (balance * newRiskPercent) / 100;
    setRiskAmount(amount);
  };

  const placeOrder = () => {
    try {
      setError(null);
      setIsLoading(true);

      // Validation
      if (orderType !== 'Market' && (!entryPrice || parseFloat(entryPrice) <= 0)) {
        throw new Error('Please enter a valid entry price');
      }

      if (riskAmount > balance) {
        throw new Error('Risk amount exceeds available balance');
      }

      if (riskAmount <= 0) {
        throw new Error('Risk amount must be greater than 0');
      }

      const orderData = {
        side,
        orderType,
        entryPrice: orderType === 'Market' ? currentPrice : parseFloat(entryPrice),
        riskAmount: riskAmount,
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        takeProfit: takeProfit ? parseFloat(takeProfit) : null,
        partials
      };

      onPlaceOrder(orderData);
      
      // Reset form
      setTakeProfit('');
      setStopLoss('');
      setPartials([]);
      
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const addPartial = () => {
    setPartials([...partials, { percent: 25, price: 0 }]);
  };

  const updatePartial = (index, field, value) => {
    const newPartials = [...partials];
    newPartials[index][field] = value;
    setPartials(newPartials);
  };

  const removePartial = (index) => {
    setPartials(partials.filter((_, i) => i !== index));
  };

  
  const goToTime = (timezone) => {
    // Implement time navigation logic
    console.log(`Go to ${timezone} time`);
  };

  return (
    <div className="trade-panel">
      <div className="panel-header">
        <h3>Place a Trade:</h3>
      </div>

      <div className="order-buttons">
        <button 
          className={`order-btn buy ${side === 'Buy' ? 'active' : ''}`}
          onClick={() => setSide('Buy')}
        >
          Buy
        </button>
        <button 
          className={`order-btn sell ${side === 'Sell' ? 'active' : ''}`}
          onClick={() => setSide('Sell')}
        >
          Sell
        </button>
      </div>

      <div className="order-type-buttons">
        <button 
          className={`type-btn ${orderType === 'Limit' ? 'active' : ''}`}
          onClick={() => setOrderType('Limit')}
        >
          Limit
        </button>
        <button 
          className={`type-btn ${orderType === 'Market' ? 'active' : ''}`}
          onClick={() => setOrderType('Market')}
        >
          Market
        </button>
        <button 
          className={`type-btn ${orderType === 'Stop' ? 'active' : ''}`}
          onClick={() => setOrderType('Stop')}
        >
          Stop
        </button>
      </div>

      <div className="input-group">
        <label>Entry Price</label>
        <input 
          type="number" 
          value={entryPrice.toFixed(3)} 
          onChange={(e) => setEntryPrice(parseFloat(e.target.value))}
          step="0.001"
          disabled={orderType === 'Market'}
        />
      </div>

      <div className="input-group">
        <label>Take Profit</label>
        <input 
          type="number" 
          value={takeProfit} 
          onChange={(e) => setTakeProfit(parseFloat(e.target.value))}
          placeholder="0"
          step="0.001"
        />
      </div>

      <div className="input-group">
        <label>Stop Loss</label>
        <input 
          type="number" 
          value={stopLoss} 
          onChange={(e) => setStopLoss(parseFloat(e.target.value))}
          placeholder="0"
          step="0.001"
        />
      </div>

      <div className="balance-row">
        <div className="balance-item">
          <label>Initial Balance</label>
          <span className="balance-value">${balance.toFixed(2)}</span>
        </div>
        <div className="balance-item">
          <label>Current Balance</label>
          <span className="balance-value">${balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="risk-section">
        <div className="risk-row">
          <label>Risk Percent (%)</label>
          <input 
            type="number" 
            value={riskPercent} 
            onChange={(e) => handleRiskPercentChange(parseFloat(e.target.value))}
            step="0.1"
            min="0"
            max="100"
          />
        </div>
        <div className="risk-row">
          <label>Risk Amount ($)</label>
          <span className="risk-amount">${riskAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="partials-section">
        <button className="add-partial-btn" onClick={addPartial}>
          Add Partial
        </button>
        {partials.map((partial, idx) => (
          <div key={idx} className="partial-item">
            <input 
              type="number" 
              placeholder="%" 
              value={partial.percent}
              onChange={(e) => updatePartial(idx, 'percent', parseFloat(e.target.value))}
            />
            <input 
              type="number" 
              placeholder="Price" 
              value={partial.price}
              onChange={(e) => updatePartial(idx, 'price', parseFloat(e.target.value))}
              step="0.001"
            />
            <button 
              className="remove-partial-btn"
              onClick={() => removePartial(idx)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="time-section">
        <label>Go To</label>
        <div className="time-buttons">
          <button onClick={() => goToTime('London')}>London</button>
          <button onClick={() => goToTime('New York')}>New York</button>
          <button onClick={() => goToTime('Tokyo')}>Tokyo</button>
          <button onClick={() => goToTime('Custom')}>Custom Time</button>
        </div>
        <button className="customise-btn">Customise</button>
      </div>

      <button className="place-order-btn" onClick={placeOrder}>
        GO TO
      </button>

          </div>
  );
};

export default TradePanel;
