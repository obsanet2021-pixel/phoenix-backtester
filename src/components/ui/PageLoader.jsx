import LoadingSkeleton, { SkeletonBlock } from './LoadingSkeleton'

export default function PageLoader({ title = 'Loading page...' }) {
  return (
    <div className="main">
      <div className="topbar">
        <div>
          <div className="page-title">{title}</div>
          <div className="page-sub">Fetching live data...</div>
        </div>
      </div>
      <div className="content" style={{ display: 'grid', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <SkeletonBlock height={120} />
          <SkeletonBlock height={120} />
          <SkeletonBlock height={120} />
        </div>
        <LoadingSkeleton rows={8} />
      </div>
    </div>
  )
}
