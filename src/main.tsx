import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary 
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) => {
      console.error('Root error boundary caught:', error, errorInfo)
    }}
    onReset={() => {
      console.log('🔄 Root application reset')
      // Force reload as a last resort
      setTimeout(() => window.location.reload(), 100)
    }}
  >
    <App />
  </ErrorBoundary>
)
