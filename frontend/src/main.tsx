import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import './index.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element #root not found — check index.html')
}

/**
 * BrowserRouter must wrap the entire app (only instance in the project).
 * ErrorBoundary sits inside the router so error UI can use Link if needed.
 */
ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
)
