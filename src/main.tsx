import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary"
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { setupGlobalErrorHandling, errorService } from './lib/errorHandling'
import { CONFIG, validateConfig } from './lib/config'
import { startHealthMonitoring } from './lib/monitoring'
import { bundleAnalytics, optimize } from './lib/optimization'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

// Validate configuration on startup
const configValidation = validateConfig()
if (!configValidation.isValid && CONFIG.IS_DEVELOPMENT) {
  console.error('❌ Configuration validation failed:', configValidation.errors)
} else if (CONFIG.IS_DEVELOPMENT) {
  console.log('✅ Configuration validated successfully')
}

// Setup global error handling
setupGlobalErrorHandling()

// Start health monitoring in production
if (CONFIG.IS_PRODUCTION) {
  startHealthMonitoring(60000) // Check every minute in production
} else {
  startHealthMonitoring(10000) // More frequent checks in development
}

// Performance optimizations
if (CONFIG.IS_PRODUCTION) {
  // Preload critical resources based on device capabilities
  if (optimize.shouldLoadFeature('heavy-scripts')) {
    // Could preload additional resources here
  }
}

// Log startup information
if (CONFIG.IS_DEVELOPMENT) {
  console.log(`🚀 Starting ${CONFIG.APP_NAME} v${CONFIG.APP_VERSION}`)
  console.log('Environment:', CONFIG.IS_PRODUCTION ? 'production' : 'development')
  console.log('Device Performance Tier:', optimize.getDevicePerformanceTier())
  console.log('Reduced Motion Preference:', optimize.prefersReducedMotion())
} else {
  // Log minimal production info
  console.log(`${CONFIG.APP_NAME} v${CONFIG.APP_VERSION} loaded`)
}

// Performance monitoring
window.addEventListener('load', () => {
  // Log bundle performance after full load
  setTimeout(() => {
    bundleAnalytics.logBundlePerformance()
    
    const impact = bundleAnalytics.estimateBundleImpact()
    if (CONFIG.IS_DEVELOPMENT && impact.impact === 'high') {
      console.warn('⚠️ High bundle impact detected:', impact)
    }
  }, 1000)
})

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary 
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) => {
      errorService.logError(error, 'Root Error Boundary')
      if (CONFIG.ENABLE_DEBUG_MODE) {
        console.error('Root error boundary caught:', error, errorInfo)
      }
    }}
    onReset={() => {
      if (CONFIG.ENABLE_DEBUG_MODE) {
        console.log('🔄 Root application reset')
      }
      // Force reload as a last resort
      setTimeout(() => window.location.reload(), 100)
    }}
  >
    <App />
  </ErrorBoundary>
)
