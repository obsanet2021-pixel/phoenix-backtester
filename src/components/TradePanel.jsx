import React, { useState, useEffect } from 'react';

const TradePanel = ({ onPlaceOrder, currentPrice, balance }) => {
  const [orderType, setOrderType] = useState('Market');
  const [side, setSide] = useState('Buy');
  const [entryPrice, setEntryPrice] = useState(currentPrice);
  const [takeProfit, setTakeProfit] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [riskPercent, setRiskPercent] = useState(1);
  const [riskAmount, setRiskAmount] = useState(49.94);
  const [partials, setPartials] = useState([]);

  useEffect(() => {
    setEntryPrice(currentPrice);
    calculateRiskAmount();
  }, [currentPrice]);

  const calculateRiskAmount = () => {
    const amount = (balance * riskPercent) / 100;
    setRiskAmount(amount);
  };

  const handleRiskPercentChange = (value) => {
    setRiskPercent(value);
    const amount = (balance * value) / 100;
    setRiskAmount(amount);
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

  const placeOrder = () => {
    const orderData = {
      side: side.toUpperCase(),
      orderType,
      entryPrice,
      takeProfit: takeProfit || null,
      stopLoss: stopLoss || null,
      riskAmount,
    };
    onPlaceOrder(orderData);
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

      <style jsx>{`
        .trade-panel {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 16px;
          gap: 16px;
          overflow-y: auto;
        }

        .panel-header h3 {
          margin: 0;
          font-size: 16px;
          color: #ff6b00;
        }

        .order-buttons {
          display: flex;
          gap: 12px;
        }

        .order-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .order-btn.buy {
          background: #22c55e;
          color: white;
        }

        .order-btn.sell {
          background: #ef4444;
          color: white;
        }

        .order-btn.active {
          transform: scale(0.98);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }

        .order-type-buttons {
          display: flex;
          gap: 8px;
        }

        .type-btn {
          flex: 1;
          background: #2d2d2d;
          border: 1px solid #2d2d2d;
          color: #9ca3af;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .type-btn.active {
          background: #ff6b00;
          color: white;
          border-color: #ff6b00;
        }

        .type-btn:hover {
          border-color: #ff6b00;
          color: #ff6b00;
        }

        .input-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .input-group label {
          font-size: 12px;
          color: #9ca3af;
        }

        .input-group input {
          background: #2d2d2d;
          border: 1px solid #3d3d3d;
          color: #e5e5e5;
          padding: 6px 8px;
          border-radius: 4px;
          width: 120px;
          text-align: right;
        }

        .input-group input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .balance-row {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #1f1f1f;
          border-radius: 6px;
        }

        .balance-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .balance-item label {
          font-size: 10px;
          color: #6b7280;
        }

        .balance-value {
          font-size: 14px;
          font-weight: 600;
          color: #ff6b00;
        }

        .risk-section {
          background: #1f1f1f;
          padding: 12px;
          border-radius: 6px;
        }

        .risk-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .risk-row:last-child {
          margin-bottom: 0;
        }

        .risk-row label {
          font-size: 12px;
          color: #9ca3af;
        }

        .risk-row input {
          background: #2d2d2d;
          border: 1px solid #3d3d3d;
          color: #e5e5e5;
          padding: 4px 8px;
          border-radius: 4px;
          width: 80px;
          text-align: right;
        }

        .risk-amount {
          font-weight: 600;
          color: #ff6b00;
        }

        .add-partial-btn {
          width: 100%;
          background: #2d2d2d;
          border: 1px dashed #ff6b00;
          color: #ff6b00;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          margin-bottom: 8px;
          transition: all 0.2s;
        }

        .add-partial-btn:hover {
          background: #ff6b00;
          color: white;
          border-style: solid;
        }

        .partial-item {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          align-items: center;
        }

        .partial-item input {
          flex: 1;
          background: #2d2d2d;
          border: 1px solid #3d3d3d;
          color: #e5e5e5;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .remove-partial-btn {
          background: #ef4444;
          border: none;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .time-section {
          background: #1f1f1f;
          padding: 12px;
          border-radius: 6px;
        }

        .time-section label {
          display: block;
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 8px;
        }

        .time-buttons {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .time-buttons button {
          background: #2d2d2d;
          border: 1px solid #2d2d2d;
          color: #e5e5e5;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          transition: all 0.2s;
        }

        .time-buttons button:hover {
          border-color: #ff6b00;
          color: #ff6b00;
        }

        .customise-btn {
          background: transparent;
          border: 1px solid #ff6b00;
          color: #ff6b00;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          width: 100%;
          transition: all 0.2s;
        }

        .customise-btn:hover {
          background: #ff6b00;
          color: white;
        }

        .place-order-btn {
          background: #ff6b00;
          border: none;
          color: white;
          padding: 12px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
          transition: all 0.2s;
        }

        .place-order-btn:hover {
          background: #e05a00;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default TradePanel;
