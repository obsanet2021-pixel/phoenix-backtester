import { memo } from 'react'

function SidebarPanel({
  sidebarTab,
  setSidebarTab,
  notes,
  setNotes,
  newsEvents,
  onSaveNotes,
}) {
  return (
    <aside
      style={{
        width: '340px',
        borderLeft: '1px solid #2a2e39',
        background: '#131722',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', gap: '8px' }}>
        {['News', 'Notes'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSidebarTab(tab)}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #2a2e39',
              background: sidebarTab === tab ? '#ff6b00' : '#1e222d',
              color: sidebarTab === tab ? '#111' : '#d1d4dc',
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {sidebarTab === 'News' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Economic Calendar</div>
            <div style={{ fontSize: '12px', color: '#787b86' }}>
              Connect a live calendar feed later. This panel now has a stable production shell.
            </div>
          </div>
          {newsEvents.map((event) => (
            <div
              key={event.id}
              style={{
                borderRadius: '10px',
                border: '1px solid #2a2e39',
                background: '#1e222d',
                padding: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>{event.event}</span>
                <span style={{ color: '#ff6b00', fontSize: '12px' }}>{event.impact}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#787b86' }}>
                {event.currency} | {event.time} | Actual {event.actual} | Forecast {event.forecast}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Backtester Notes</div>
            <div style={{ fontSize: '12px', color: '#787b86' }}>
              Notes stay local for now. Trade execution data is now handled through the shared trade store.
            </div>
          </div>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Write execution notes, screenshots to review, or setup observations..."
            style={{
              flex: 1,
              minHeight: '320px',
              padding: '15px',
              background: '#2a2e39',
              border: '1px solid #363a45',
              borderRadius: '8px',
              color: '#d1d4dc',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'none',
            }}
          />
          <button
            type="button"
            onClick={onSaveNotes}
            style={{
              padding: '10px 16px',
              background: '#ff6b00',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Save Notes
          </button>
        </div>
      )}
    </aside>
  )
}

export default memo(SidebarPanel)
