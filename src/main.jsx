import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'
import './index.css'
import './styles/globals.css'
import App from './App.jsx'

// Web Vitals monitoring
const logWebVitals = (metric) => {
  console.log('[Web Vitals]', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType
  })
  
  // Send to analytics service (optional - uncomment when ready)
  // if (window.gtag) {
  //   window.gtag('event', metric.name, {
  //     value: Math.round(metric.value),
  //     event_category: 'Web Vitals',
  //     event_label: metric.id,
  //     non_interaction: true
  //   })
  // }
}

onCLS(logWebVitals)
onFID(logWebVitals)
onFCP(logWebVitals)
onLCP(logWebVitals)
onTTFB(logWebVitals)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
