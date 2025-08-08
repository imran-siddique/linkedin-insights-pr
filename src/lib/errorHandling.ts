import { CONFIG } from './config'

/**
 * Production-ready error logging service
 */
class ErrorService {
  private static instance: ErrorService
  private errorQueue: Array<{ error: Error; context?: string; timestamp: number }> = []
  private lastReportTime = 0
  private readonly REPORT_INTERVAL = 5000 // 5 seconds

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService()
    }
    return ErrorService.instance
  }

  /**
   * Log an error with context
   */
  logError(error: Error, context?: string): void {
    const errorInfo = {
      error,
      context,
      timestamp: Date.now()
    }

    // Always log to console in development
    if (CONFIG.IS_DEVELOPMENT) {
      console.error(`[${context || 'Unknown Context'}]:`, error)
    }

    // Queue error for reporting
    if (CONFIG.ENABLE_ERROR_REPORTING) {
      this.errorQueue.push(errorInfo)
      this.throttledReport()
    }
  }

  /**
   * Log a warning message
   */
  logWarning(message: string, context?: string): void {
    const warning = new Error(message)
    warning.name = 'Warning'
    
    if (CONFIG.IS_DEVELOPMENT) {
      console.warn(`[${context || 'Unknown Context'}]:`, message)
    }

    if (CONFIG.ENABLE_ERROR_REPORTING) {
      this.errorQueue.push({
        error: warning,
        context,
        timestamp: Date.now()
      })
    }
  }

  /**
   * Throttled error reporting to prevent spam
   */
  private throttledReport(): void {
    const now = Date.now()
    if (now - this.lastReportTime > this.REPORT_INTERVAL && this.errorQueue.length > 0) {
      this.reportErrors()
      this.lastReportTime = now
    }
  }

  /**
   * Report queued errors (in production, this could send to a service)
   */
  private reportErrors(): void {
    if (this.errorQueue.length === 0) return

    // In production, you might send these to a logging service
    // For now, we'll just log them in a structured way
    const errors = this.errorQueue.splice(0, 10) // Process max 10 errors at once
    
    errors.forEach(({ error, context, timestamp }) => {
      const errorReport = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date(timestamp).toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        appVersion: CONFIG.APP_VERSION
      }

      // In production, replace this with actual error reporting
      if (CONFIG.IS_DEVELOPMENT) {
        console.group('🚨 Error Report')
        console.table(errorReport)
        console.groupEnd()
      } else {
        // Example: Send to logging service
        // fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorReport)
        // }).catch(() => {}) // Silently fail to avoid error loops
      }
    })
  }

  /**
   * Get error statistics
   */
  getErrorStats(): { queueSize: number; lastReportTime: number } {
    return {
      queueSize: this.errorQueue.length,
      lastReportTime: this.lastReportTime
    }
  }

  /**
   * Clear error queue (useful for testing)
   */
  clearErrors(): void {
    this.errorQueue = []
  }
}

export const errorService = ErrorService.getInstance()

/**
 * Global error handler setup
 */
export function setupGlobalErrorHandling(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorService.logError(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      'Global Promise Handler'
    )
    event.preventDefault() // Prevent console logging in production
  })

  // Handle global errors
  window.addEventListener('error', (event) => {
    errorService.logError(
      new Error(`Global Error: ${event.message} at ${event.filename}:${event.lineno}`),
      'Global Error Handler'
    )
  })

  // React Error Boundary integration
  window.addEventListener('react-error-boundary', (event: CustomEvent) => {
    errorService.logError(
      event.detail.error,
      'React Error Boundary'
    )
  })
}

/**
 * Utility function to safely execute async operations
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await operation()
  } catch (error) {
    errorService.logError(error as Error, context)
    return fallback
  }
}

/**
 * Utility function to safely execute sync operations
 */
export function safeSync<T>(
  operation: () => T,
  context: string,
  fallback?: T
): T | undefined {
  try {
    return operation()
  } catch (error) {
    errorService.logError(error as Error, context)
    return fallback
  }
}