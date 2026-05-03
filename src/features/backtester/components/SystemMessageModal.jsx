import { memo } from 'react'

function SystemMessageModal({ messageCard, onClose }) {
  if (!messageCard.open) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: '#0f1625',
          borderRadius: '24px',
          border: '1px solid rgba(245, 160, 35, 0.3)',
          boxShadow: '0 12px 28px -8px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          minWidth: '320px',
          maxWidth: '420px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(90deg, #0f1727, #0b1120)',
            padding: '14px 18px',
            borderBottom: '1px solid #2a3a48',
          }}
        >
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#eef4ff' }}>{messageCard.title}</div>
          <div style={{ fontSize: '0.7rem', color: '#8aa0bc' }}>{messageCard.subtitle}</div>
        </div>
        <div style={{ padding: '18px', background: '#0a101c' }}>
          <div
            style={{
              background: '#080e18',
              padding: '16px',
              borderRadius: '18px',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: '#ccdeee',
              borderLeft: '3px solid #f5b042',
              lineHeight: 1.4,
            }}
          >
            {messageCard.message}
          </div>
        </div>
        <div
          style={{
            padding: '12px 18px 16px',
            display: 'flex',
            justifyContent: 'flex-end',
            background: '#0b111e',
            borderTop: '1px solid #1f2c38',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f5a623',
              color: '#0a0f18',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '40px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(SystemMessageModal)
