import { memo } from 'react'

function ReplayToolbar({ replay, setReplay }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${replay.position.x}px`,
        top: `${replay.position.y}px`,
        background: 'rgba(20, 20, 20, 0.95)',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '8px 12px',
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '48px',
      }}
    >
      <div style={{ color: '#888', fontSize: '12px' }}>::</div>
      <button
        type="button"
        onClick={() => setReplay((current) => ({ ...current, playing: !current.playing }))}
        style={{
          background: replay.playing ? '#ef4444' : '#22c55e',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'bold',
          minWidth: '72px',
        }}
      >
        {replay.playing ? 'Pause' : 'Play'}
      </button>
      <input
        type="range"
        min="1"
        max="16"
        step="0.5"
        value={replay.speed}
        onChange={(event) =>
          setReplay((current) => ({
            ...current,
            speed: Number(event.target.value),
          }))
        }
        style={{ flex: 1, cursor: 'pointer' }}
      />
      <span style={{ color: '#888', fontSize: '10px', minWidth: '40px', textAlign: 'center' }}>
        {replay.speed}x
      </span>
      <span style={{ color: replay.playing ? '#22c55e' : '#888', fontSize: '10px' }}>
        {replay.playing ? 'Playing' : 'Ready'}
      </span>
    </div>
  )
}

export default memo(ReplayToolbar)
