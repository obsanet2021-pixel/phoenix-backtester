import { memo, useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

function AnalyticsChart({ type, data, options, height = 280 }) {
  const canvasRef = useRef(null)
  const chartInstanceRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    chartInstanceRef.current = new Chart(canvasRef.current, {
      type,
      data,
      options,
    })

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [data, options, type])

  return (
    <div style={{ position: 'relative', height }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default memo(AnalyticsChart)
