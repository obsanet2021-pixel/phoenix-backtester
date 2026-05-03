export function SkeletonBlock({ height = 16, width = '100%', style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 8,
        background: 'linear-gradient(90deg, rgba(40,40,40,0.9), rgba(60,60,60,0.9), rgba(40,40,40,0.9))',
        backgroundSize: '200% 100%',
        animation: 'pulse 1.4s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

export default function LoadingSkeleton({ rows = 4 }) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {Array.from({ length: rows }, (_, index) => (
        <SkeletonBlock key={index} height={index === 0 ? 24 : 16} />
      ))}
    </div>
  )
}
