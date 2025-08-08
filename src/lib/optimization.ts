/**
 * Production optimization utilities
 * Handles resource management, performance monitoring, and cleanup
 */

import { CONFIG } from './config'
import { errorService } from './errorHandling'

/**
 * Resource management utilities for production optimization
 */
export class ResourceManager {
  private static instance: ResourceManager
  private observers: IntersectionObserver[] = []
  private timers: NodeJS.Timeout[] = []
  private eventListeners: Array<{ element: EventTarget; event: string; handler: EventListener }> = []
  private isCleaningUp = false

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager()
    }
    return ResourceManager.instance
  }

  /**
   * Create and track an intersection observer
   */
  createObserver(callback: IntersectionObserverCallback, options?: IntersectionObserverInit): IntersectionObserver {
    const observer = new IntersectionObserver(callback, options)
    this.observers.push(observer)
    return observer
  }

  /**
   * Create and track a timer
   */
  createTimer(callback: () => void, delay: number, isInterval = false): NodeJS.Timeout {
    const timer = isInterval ? setInterval(callback, delay) : setTimeout(callback, delay)
    this.timers.push(timer)
    return timer
  }

  /**
   * Add and track an event listener
   */
  addEventListener<T extends EventTarget>(
    element: T,
    event: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions
  ): void {
    element.addEventListener(event, handler, options)
    this.eventListeners.push({ element, event, handler })
  }

  /**
   * Clean up all tracked resources
   */
  cleanup(): void {
    if (this.isCleaningUp) return
    this.isCleaningUp = true

    try {
      // Disconnect observers
      this.observers.forEach(observer => {
        try {
          observer.disconnect()
        } catch (error) {
          errorService.logWarning('Failed to disconnect observer', 'Resource Cleanup')
        }
      })
      this.observers = []

      // Clear timers
      this.timers.forEach(timer => {
        try {
          clearTimeout(timer)
          clearInterval(timer)
        } catch (error) {
          errorService.logWarning('Failed to clear timer', 'Resource Cleanup')
        }
      })
      this.timers = []

      // Remove event listeners
      this.eventListeners.forEach(({ element, event, handler }) => {
        try {
          element.removeEventListener(event, handler)
        } catch (error) {
          errorService.logWarning('Failed to remove event listener', 'Resource Cleanup')
        }
      })
      this.eventListeners = []

      if (CONFIG.ENABLE_DEBUG_MODE) {
        console.log('🧹 Resource cleanup completed')
      }
    } catch (error) {
      errorService.logError(error as Error, 'Resource Manager Cleanup')
    } finally {
      this.isCleaningUp = false
    }
  }

  /**
   * Get resource usage statistics
   */
  getStats(): ResourceStats {
    return {
      observers: this.observers.length,
      timers: this.timers.length,
      eventListeners: this.eventListeners.length,
      isCleaningUp: this.isCleaningUp
    }
  }
}

export const resourceManager = ResourceManager.getInstance()

/**
 * Performance optimization utilities
 */
export const optimize = {
  /**
   * Lazy load an image with intersection observer
   */
  lazyLoadImage(img: HTMLImageElement, src: string): void {
    const observer = resourceManager.createObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src
          img.classList.add('loaded')
          observer.unobserve(img)
        }
      })
    }, { rootMargin: '50px' })

    observer.observe(img)
  },

  /**
   * Preload critical resources
   */
  preloadResource(href: string, as: 'script' | 'style' | 'image' | 'font' = 'script'): void {
    if (typeof document === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    
    if (as === 'font') {
      link.crossOrigin = 'anonymous'
    }

    document.head.appendChild(link)
  },

  /**
   * Optimize images by reducing quality on slow connections
   */
  getOptimalImageQuality(): number {
    if (typeof navigator === 'undefined') return 100

    const connection = (navigator as any).connection
    if (!connection) return 100

    // Reduce quality on slow connections
    if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
      return 50
    } else if (connection.effectiveType === '3g') {
      return 75
    }

    return 100
  },

  /**
   * Check if device prefers reduced motion
   */
  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  /**
   * Get device performance tier
   */
  getDevicePerformanceTier(): 'high' | 'medium' | 'low' {
    if (typeof navigator === 'undefined') return 'high'

    const memory = (navigator as any).deviceMemory
    const cores = navigator.hardwareConcurrency

    if (memory >= 8 && cores >= 8) return 'high'
    if (memory >= 4 && cores >= 4) return 'medium'
    return 'low'
  },

  /**
   * Adaptive loading based on device capabilities
   */
  shouldLoadFeature(feature: 'animations' | 'highres-images' | 'heavy-scripts'): boolean {
    const tier = this.getDevicePerformanceTier()
    const reducedMotion = this.prefersReducedMotion()
    const connection = (navigator as any).connection

    switch (feature) {
      case 'animations':
        return !reducedMotion && tier !== 'low'
      
      case 'highres-images':
        return tier === 'high' && 
               (!connection || connection.effectiveType === '4g')
      
      case 'heavy-scripts':
        return tier === 'high'
      
      default:
        return true
    }
  }
}

/**
 * Bundle size monitoring
 */
export const bundleAnalytics = {
  /**
   * Log bundle load performance
   */
  logBundlePerformance(): void {
    if (typeof window === 'undefined' || !CONFIG.ENABLE_DEBUG_MODE) return

    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigationTiming) {
      const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart
      const domContentLoaded = navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart
      const firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime || 0
      
      console.log('📦 Bundle Performance:', {
        totalLoadTime: `${loadTime}ms`,
        domContentLoaded: `${domContentLoaded}ms`,
        firstPaint: firstPaint ? `${firstPaint}ms` : 'N/A',
        transferSize: navigationTiming.transferSize,
        encodedBodySize: navigationTiming.encodedBodySize,
        decodedBodySize: navigationTiming.decodedBodySize
      })
    }
  },

  /**
   * Estimate bundle size impact
   */
  estimateBundleImpact(): BundleImpact {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (!navigationTiming) {
      return { size: 0, loadTime: 0, impact: 'unknown' }
    }

    const size = navigationTiming.encodedBodySize || 0
    const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart

    let impact: 'low' | 'medium' | 'high' | 'unknown' = 'low'
    
    if (size > 2000000) { // > 2MB
      impact = 'high'
    } else if (size > 1000000) { // > 1MB
      impact = 'medium'
    } else if (loadTime > 5000) { // > 5s load time
      impact = 'high'
    } else if (loadTime > 2000) { // > 2s load time
      impact = 'medium'
    }

    return {
      size,
      loadTime,
      impact
    }
  }
}

/**
 * Production cleanup utilities
 */
export const cleanup = {
  /**
   * Set up automatic cleanup on page unload
   */
  setupAutoCleanup(): void {
    if (typeof window === 'undefined') return

    const handleUnload = () => {
      resourceManager.cleanup()
      
      // Clear any remaining intervals/timeouts
      const highestTimeoutId = setTimeout(() => {}, 0)
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i)
        clearInterval(i)
      }
    }

    resourceManager.addEventListener(window, 'beforeunload', handleUnload)
    resourceManager.addEventListener(window, 'unload', handleUnload)
    
    // Also cleanup on visibility change (for SPA navigation)
    resourceManager.addEventListener(document, 'visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        resourceManager.cleanup()
      }
    })
  },

  /**
   * Manual cleanup trigger
   */
  cleanup(): void {
    resourceManager.cleanup()
  }
}

// Types
interface ResourceStats {
  observers: number
  timers: number
  eventListeners: number
  isCleaningUp: boolean
}

interface BundleImpact {
  size: number
  loadTime: number
  impact: 'low' | 'medium' | 'high' | 'unknown'
}

// Auto-setup in production
if (typeof window !== 'undefined') {
  cleanup.setupAutoCleanup()
  
  // Log bundle performance after load
  resourceManager.createTimer(() => {
    bundleAnalytics.logBundlePerformance()
  }, 2000)
}