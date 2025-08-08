import { CONFIG } from './config'
import { errorService } from './errorHandling'
import { cacheUtils } from './cache'

/**
 * Application health monitoring and status reporting
 */
export class HealthMonitor {
  private static instance: HealthMonitor
  private startTime: number = Date.now()
  private memoryUsageHistory: number[] = []
  private errorCount: number = 0
  private lastCheck: number = Date.now()

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor()
    }
    return HealthMonitor.instance
  }

  /**
   * Get comprehensive health status
   */
  getHealthStatus(): HealthStatus {
    const now = Date.now()
    const uptime = now - this.startTime
    const memoryUsage = this.getMemoryUsage()
    const cacheStats = cacheUtils.getAllStats()
    const errorStats = errorService.getErrorStats()

    // Update memory usage history (keep last 10 readings)
    this.memoryUsageHistory.push(memoryUsage.percentage)
    if (this.memoryUsageHistory.length > 10) {
      this.memoryUsageHistory.shift()
    }

    const status: HealthStatus = {
      status: this.determineOverallStatus(),
      timestamp: new Date(now).toISOString(),
      uptime,
      version: CONFIG.APP_VERSION,
      environment: CONFIG.IS_PRODUCTION ? 'production' : 'development',
      
      performance: {
        memoryUsage,
        memoryTrend: this.calculateMemoryTrend(),
        responseTime: now - this.lastCheck,
        uptime
      },
      
      cache: {
        totalSize: cacheStats.profile.size + cacheStats.analysis.size + cacheStats.scraping.size,
        hitRate: (cacheStats.profile.hitRate + cacheStats.analysis.hitRate + cacheStats.scraping.hitRate) / 3,
        details: cacheStats
      },
      
      errors: {
        queueSize: errorStats.queueSize,
        lastReportTime: errorStats.lastReportTime,
        recentCount: this.errorCount
      },
      
      features: {
        debugMode: CONFIG.ENABLE_DEBUG_MODE,
        analytics: CONFIG.ENABLE_ANALYTICS,
        errorReporting: CONFIG.ENABLE_ERROR_REPORTING
      },
      
      limits: {
        maxRequestsPerMinute: CONFIG.MAX_REQUESTS_PER_MINUTE,
        cacheMaxSize: CONFIG.MAX_CACHE_SIZE,
        cacheTTL: CONFIG.CACHE_TTL
      }
    }

    this.lastCheck = now
    return status
  }

  /**
   * Get memory usage information
   */
  private getMemoryUsage(): MemoryUsage {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100)
      }
    }
    
    return {
      used: 0,
      total: 0,
      limit: 0,
      percentage: 0
    }
  }

  /**
   * Calculate memory usage trend
   */
  private calculateMemoryTrend(): 'increasing' | 'stable' | 'decreasing' {
    if (this.memoryUsageHistory.length < 3) return 'stable'
    
    const recent = this.memoryUsageHistory.slice(-3)
    const first = recent[0]
    const last = recent[recent.length - 1]
    const diff = last - first
    
    if (diff > 5) return 'increasing'
    if (diff < -5) return 'decreasing'
    return 'stable'
  }

  /**
   * Determine overall application status
   */
  private determineOverallStatus(): 'healthy' | 'degraded' | 'unhealthy' {
    const memoryUsage = this.getMemoryUsage()
    const errorStats = errorService.getErrorStats()
    
    // Critical conditions
    if (memoryUsage.percentage > 90) return 'unhealthy'
    if (errorStats.queueSize > 50) return 'unhealthy'
    
    // Degraded conditions
    if (memoryUsage.percentage > 70) return 'degraded'
    if (errorStats.queueSize > 10) return 'degraded'
    if (this.calculateMemoryTrend() === 'increasing') return 'degraded'
    
    return 'healthy'
  }

  /**
   * Record an error occurrence
   */
  recordError(): void {
    this.errorCount++
  }

  /**
   * Reset error count
   */
  resetErrorCount(): void {
    this.errorCount = 0
  }

  /**
   * Get simple status check
   */
  isHealthy(): boolean {
    return this.getHealthStatus().status === 'healthy'
  }

  /**
   * Get formatted uptime string
   */
  getUptimeString(): string {
    const uptime = Date.now() - this.startTime
    const hours = Math.floor(uptime / (1000 * 60 * 60))
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000)
    
    return `${hours}h ${minutes}m ${seconds}s`
  }

  /**
   * Export health data for monitoring systems
   */
  exportHealthData(): object {
    const status = this.getHealthStatus()
    
    return {
      ...status,
      exportedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth
      },
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      } : null
    }
  }
}

export const healthMonitor = HealthMonitor.getInstance()

/**
 * Types for health monitoring
 */
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  version: string
  environment: string
  performance: PerformanceMetrics
  cache: CacheMetrics
  errors: ErrorMetrics
  features: FeatureFlags
  limits: LimitConfiguration
}

interface PerformanceMetrics {
  memoryUsage: MemoryUsage
  memoryTrend: 'increasing' | 'stable' | 'decreasing'
  responseTime: number
  uptime: number
}

interface MemoryUsage {
  used: number
  total: number
  limit: number
  percentage: number
}

interface CacheMetrics {
  totalSize: number
  hitRate: number
  details: any
}

interface ErrorMetrics {
  queueSize: number
  lastReportTime: number
  recentCount: number
}

interface FeatureFlags {
  debugMode: boolean
  analytics: boolean
  errorReporting: boolean
}

interface LimitConfiguration {
  maxRequestsPerMinute: number
  cacheMaxSize: number
  cacheTTL: number
}

/**
 * Start periodic health monitoring
 */
export function startHealthMonitoring(intervalMs = 30000): () => void {
  let isMonitoring = true
  
  const monitor = async () => {
    if (!isMonitoring) return
    
    try {
      const status = healthMonitor.getHealthStatus()
      
      if (CONFIG.ENABLE_DEBUG_MODE) {
        console.log(`🏥 Health Check: ${status.status} (${healthMonitor.getUptimeString()})`)
        
        if (status.status !== 'healthy') {
          console.warn('📊 Health Details:', status)
        }
      }
      
      // In production, you might send this to a monitoring service
      if (CONFIG.IS_PRODUCTION && status.status === 'unhealthy') {
        // Example: Send alert to monitoring service
        // await fetch('/api/health-alert', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(status)
        // }).catch(() => {}) // Silent fail
      }
      
    } catch (error) {
      errorService.logError(error as Error, 'Health Monitoring')
    }
    
    // Schedule next check
    setTimeout(monitor, intervalMs)
  }
  
  // Start monitoring
  monitor()
  
  // Return cleanup function
  return () => {
    isMonitoring = false
  }
}

// Auto-start health monitoring if enabled
if (typeof window !== 'undefined' && CONFIG.ENABLE_ANALYTICS) {
  startHealthMonitoring()
}