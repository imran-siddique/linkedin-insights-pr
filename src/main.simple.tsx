import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary"
// import "@github/spark/spark" // Disabled - not available in this environment

import App from './App.minimal.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary 
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) => {
      console.error('Root error boundary caught:', error, errorInfo)
    }}
    onReset={() => {
      console.log('🔄 Application reset after error')
      setTimeout(() => window.location.reload(), 100)
    }}
  >
    <App />
  </ErrorBoundary>
)