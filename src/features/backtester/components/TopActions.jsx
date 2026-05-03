import { memo } from 'react'

function TopActions({
  showGoToMenu,
  setShowGoToMenu,
  onOpenTrade,
  onExport,
  onExit,
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        gap: '10px',
        zIndex: 100,
      }}
    >
      <button
        type="button"
        onClick={onOpenTrade}
        style={{
          padding: '10px 20px',
          background: '#ff6b00',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(255, 107, 0, 0.4)',
        }}
      >
        Open Position
      </button>

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setShowGoToMenu((value) => !value)}
          style={{
            padding: '10px 20px',
            background: '#2a2e39',
            color: '#d1d4dc',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Go To
        </button>

        {showGoToMenu && (
          <div
            style={{
              position: 'absolute',
              top: '45px',
              right: 0,
              background: '#1e222d',
              border: '1px solid #2a2e39',
              borderRadius: '4px',
              padding: '10px 0',
              zIndex: 101,
              minWidth: '150px',
            }}
          >
            {['London', 'New York', 'Tokyo', 'Custom Time'].map((label) => (
              <div
                key={label}
                style={{
                  padding: '10px 20px',
                  color: '#d1d4dc',
                  fontSize: '14px',
                }}
              >
                {label}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onExport}
        style={{
          padding: '10px 20px',
          background: '#111827',
          color: '#fff',
          border: '1px solid #374151',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Export
      </button>

      <button
        type="button"
        onClick={onExit}
        style={{
          padding: '10px 20px',
          background: '#111827',
          color: '#fff',
          border: '1px solid #374151',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Exit
      </button>
    </div>
  )
}

export default memo(TopActions)
