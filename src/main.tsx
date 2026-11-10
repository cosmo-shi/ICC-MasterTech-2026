import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/system.css'
import App from './App.tsx'
import { startClassSync } from './sync/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// On-screen keyboards shrink the visible area without telling the page layout. When that happens
// while a field has focus, bring the field (and the button under it) back into view.
if (typeof window !== 'undefined' && window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    const el = document.activeElement
    if (el instanceof HTMLElement && el.matches('input, textarea, select')) el.scrollIntoView({ block: 'center', behavior: 'auto' })
  })
}

// Class link: does nothing until this device joins a class.
startClassSync()

// Offline cache (built app only). Failure just means no offline copy; the app still works.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => undefined)
  })
  // When a newer version takes over, reload once so the page and its files match.
  let reloaded = false
  const hadController = !!navigator.serviceWorker.controller
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloaded) return
    reloaded = true
    window.location.reload()
  })
}
