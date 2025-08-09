import { describe, it, expect, vi, beforeEach } from 'vitest'
import { errorService, safeAsync, setupGlobalErrorHandling } from '../lib/errorHandling'
import { healthMonitor } from '../lib/monitoring'

describe('Error Handling Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear error logs
    errorService.clearLogs()
  })

  describe('errorService', () => {
    it('logs errors with context', () => {
      const error = new Error('Test error')
      errorService.logError(error, 'Test Context')
      
      const logs = errorService.getErrorLogs()
      expect(logs.length).toBe(1)
      expect(logs[0].error.message).toBe('Test error')
      expect(logs[0].context).toBe('Test Context')
      expect(logs[0].timestamp).toBeTruthy()
    })

    it('logs warnings', () => {
      errorService.logWarning('Test warning', 'Warning Context')
      
      const logs = errorService.getWarningLogs()
      expect(logs.length).toBe(1)
      expect(logs[0].message).toBe('Test warning')
      expect(logs[0].context).toBe('Warning Context')
    })

    it('maintains error log limits', () => {
      // Log more than the limit
      for (let i = 0; i < 150; i++) {
        errorService.logError(new Error(`Error ${i}`), 'Test')
      }
      
      const logs = errorService.getErrorLogs()
      expect(logs.length).toBeLessThanOrEqual(100)
      
      // Should keep the most recent errors
      expect(logs[logs.length - 1].error.message).toContain('149')
    })

    it('gets error summary', () => {
      errorService.logError(new Error('Error 1'), 'Context A')
      errorService.logError(new Error('Error 2'), 'Context A')
      errorService.logError(new Error('Error 3'), 'Context B')
      errorService.logWarning('Warning 1', 'Context A')
      
      const summary = errorService.getErrorSummary()
      expect(summary.totalErrors).toBe(3)
      expect(summary.totalWarnings).toBe(1)
      expect(summary.errorsByContext['Context A']).toBe(2)
      expect(summary.errorsByContext['Context B']).toBe(1)
      expect(summary.recentErrors.length).toBe(3)
    })

    it('clears logs', () => {
      errorService.logError(new Error('Test'), 'Context')
      errorService.logWarning('Warning', 'Context')
      
      expect(errorService.getErrorLogs().length).toBe(1)
      expect(errorService.getWarningLogs().length).toBe(1)
      
      errorService.clearLogs()
      
      expect(errorService.getErrorLogs().length).toBe(0)
      expect(errorService.getWarningLogs().length).toBe(0)
    })
  })

  describe('safeAsync', () => {
    it('executes async function successfully', async () => {
      const mockFn = vi.fn().mockResolvedValue('success')
      
      const result = await safeAsync(mockFn, 'Test Context', 'fallback')
      
      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalled()
    })

    it('returns fallback value on error', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))
      
      const result = await safeAsync(mockFn, 'Test Context', 'fallback')
      
      expect(result).toBe('fallback')
      
      const logs = errorService.getErrorLogs()
      expect(logs.length).toBe(1)
      expect(logs[0].context).toBe('Test Context')
    })

    it('handles functions without fallback value', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))
      
      const result = await safeAsync(mockFn, 'Test Context')
      
      expect(result).toBeUndefined()
    })

    it('preserves original error details', async () => {
      const originalError = new Error('Original error message')
      originalError.stack = 'Original stack trace'
      
      const mockFn = vi.fn().mockRejectedValue(originalError)
      
      await safeAsync(mockFn, 'Test Context', 'fallback')
      
      const logs = errorService.getErrorLogs()
      expect(logs[0].error.message).toBe('Original error message')
      expect(logs[0].error.stack).toBe('Original stack trace')
    })
  })

  describe('setupGlobalErrorHandling', () => {
    it('sets up global error handlers', () => {
      const originalAddEventListener = global.addEventListener
      const mockAddEventListener = vi.fn()
      global.addEventListener = mockAddEventListener

      setupGlobalErrorHandling()
      
      expect(mockAddEventListener).toHaveBeenCalledWith('error', expect.any(Function))
      expect(mockAddEventListener).toHaveBeenCalledWith('unhandledrejection', expect.any(Function))
      
      global.addEventListener = originalAddEventListener
    })

    it('handles global errors', () => {
      let errorHandler: ((event: ErrorEvent) => void) | undefined
      
      const mockAddEventListener = vi.fn((type, handler) => {
        if (type === 'error') {
          errorHandler = handler
        }
      })
      global.addEventListener = mockAddEventListener

      setupGlobalErrorHandling()
      
      expect(errorHandler).toBeDefined()
      
      if (errorHandler) {
        const errorEvent = new ErrorEvent('error', {
          message: 'Global error',
          filename: 'test.js',
          lineno: 10,
          colno: 5,
          error: new Error('Global error')
        })
        
        errorHandler(errorEvent)
        
        const logs = errorService.getErrorLogs()
        expect(logs.length).toBe(1)
        expect(logs[0].context).toBe('Global Error Handler')
      }
    })

    it('handles unhandled promise rejections', () => {
      let rejectionHandler: ((event: PromiseRejectionEvent) => void) | undefined
      
      const mockAddEventListener = vi.fn((type, handler) => {
        if (type === 'unhandledrejection') {
          rejectionHandler = handler
        }
      })
      global.addEventListener = mockAddEventListener

      setupGlobalErrorHandling()
      
      expect(rejectionHandler).toBeDefined()
      
      if (rejectionHandler) {
        const rejectionEvent = {
          reason: new Error('Unhandled rejection'),
          preventDefault: vi.fn()
        } as any
        
        rejectionHandler(rejectionEvent)
        
        const logs = errorService.getErrorLogs()
        expect(logs.length).toBe(1)
        expect(logs[0].context).toBe('Unhandled Promise Rejection')
        expect(rejectionEvent.preventDefault).toHaveBeenCalled()
      }
    })
  })
})

describe('Health Monitor', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Reset health monitor
    healthMonitor.reset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('tracks request count', () => {
    healthMonitor.recordRequest()
    healthMonitor.recordRequest()
    
    const status = healthMonitor.getHealthStatus()
    expect(status.requests.total).toBe(2)
  })

  it('tracks error count', () => {
    healthMonitor.recordError()
    healthMonitor.recordError()
    
    const status = healthMonitor.getHealthStatus()
    expect(status.errors.total).toBe(2)
  })

  it('calculates error rate', () => {
    healthMonitor.recordRequest()
    healthMonitor.recordRequest()
    healthMonitor.recordRequest()
    healthMonitor.recordError()
    
    const status = healthMonitor.getHealthStatus()
    expect(status.errors.rate).toBeCloseTo(0.25, 2) // 1 error out of 4 total
  })

  it('tracks response times', () => {
    const startTime = healthMonitor.startTimer('test-operation')
    vi.advanceTimersByTime(100)
    healthMonitor.endTimer('test-operation', startTime)
    
    const status = healthMonitor.getHealthStatus()
    expect(status.performance.avgResponseTime).toBeGreaterThan(0)
  })

  it('identifies slow operations', () => {
    const startTime = healthMonitor.startTimer('slow-operation')
    vi.advanceTimersByTime(2000) // 2 seconds
    healthMonitor.endTimer('slow-operation', startTime)
    
    const status = healthMonitor.getHealthStatus()
    expect(status.performance.slowOperations.length).toBeGreaterThan(0)
    expect(status.performance.slowOperations[0].operation).toBe('slow-operation')
  })

  it('maintains rolling window of recent data', () => {
    // Generate many requests over time
    for (let i = 0; i < 100; i++) {
      healthMonitor.recordRequest()
      if (i % 10 === 0) {
        healthMonitor.recordError()
      }
      vi.advanceTimersByTime(1000) // 1 second intervals
    }
    
    const status = healthMonitor.getHealthStatus()
    expect(status.requests.recent).toBeLessThanOrEqual(status.requests.total)
    expect(status.errors.recent).toBeLessThanOrEqual(status.errors.total)
  })

  it('calculates overall health score', () => {
    // Good scenario - few errors, fast responses
    for (let i = 0; i < 10; i++) {
      healthMonitor.recordRequest()
      const startTime = healthMonitor.startTimer('fast-op')
      vi.advanceTimersByTime(50)
      healthMonitor.endTimer('fast-op', startTime)
    }
    
    let status = healthMonitor.getHealthStatus()
    expect(status.score).toBeGreaterThan(0.8)
    
    // Bad scenario - many errors, slow responses
    healthMonitor.reset()
    for (let i = 0; i < 10; i++) {
      healthMonitor.recordRequest()
      healthMonitor.recordError()
      const startTime = healthMonitor.startTimer('slow-op')
      vi.advanceTimersByTime(2000)
      healthMonitor.endTimer('slow-op', startTime)
    }
    
    status = healthMonitor.getHealthStatus()
    expect(status.score).toBeLessThan(0.5)
  })

  it('resets statistics', () => {
    healthMonitor.recordRequest()
    healthMonitor.recordError()
    
    let status = healthMonitor.getHealthStatus()
    expect(status.requests.total).toBe(1)
    expect(status.errors.total).toBe(1)
    
    healthMonitor.reset()
    
    status = healthMonitor.getHealthStatus()
    expect(status.requests.total).toBe(0)
    expect(status.errors.total).toBe(0)
  })
})