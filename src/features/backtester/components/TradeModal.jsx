import { memo } from 'react'

function TradeModal({ open, tradeForm, setTradeForm, onClose, onSave }) {
  if (!open) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        style={{
          background: '#1e222d',
          borderRadius: '8px',
          width: '600px',
          maxWidth: '90%',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: '#ff6b00',
            padding: '20px',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '20px', fontWeight: '600' }}>Place a Trade</span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            x
          </button>
        </div>

        <div style={{ padding: '25px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            {[
              ['pair', 'Currency Pair'],
              ['timeframe', 'Timeframe'],
              ['entry', 'Entry Price'],
              ['sl', 'Stop Loss'],
              ['tp', 'Take Profit'],
              ['size', 'Position Size'],
              ['riskPercent', 'Risk Percent'],
              ['riskAmount', 'Risk Amount'],
            ].map(([key, label]) => (
              <div key={key}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#d1d4dc' }}>
                  {label}
                </label>
                <input
                  type="text"
                  value={tradeForm[key]}
                  onChange={(event) =>
                    setTradeForm((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#2a2e39',
                    border: '1px solid #363a45',
                    borderRadius: '4px',
                    color: '#d1d4dc',
                    fontSize: '14px',
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {['BUY', 'SELL'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTradeForm((current) => ({ ...current, type: value }))}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  background: tradeForm.type === value ? '#ff6b00' : '#2a2e39',
                  color: tradeForm.type === value ? '#fff' : '#787b86',
                  cursor: 'pointer',
                }}
              >
                {value}
              </button>
            ))}
            {['Market', 'Limit', 'Stop'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTradeForm((current) => ({ ...current, orderType: value }))}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  background: tradeForm.orderType === value ? '#ff6b00' : '#2a2e39',
                  color: tradeForm.orderType === value ? '#fff' : '#787b86',
                  cursor: 'pointer',
                }}
              >
                {value}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 24px',
                background: '#2a2e39',
                color: '#d1d4dc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              style={{
                padding: '10px 24px',
                background: '#26a69a',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Save Trade
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(TradeModal)
