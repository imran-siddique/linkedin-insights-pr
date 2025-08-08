import { CONFIG } from './config'

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
}

/**
 * Production-ready cache implementation with TTL and LRU eviction
 */
class CacheManager<T = any> {
  private cache = new Map<string, CacheItem<T>>()
  private accessOrder: string[] = []
  private readonly maxSize: number
  private readonly defaultTTL: number

  constructor(maxSize = CONFIG.MAX_CACHE_SIZE, defaultTTL = CONFIG.CACHE_TTL) {
    this.maxSize = maxSize
    this.defaultTTL = defaultTTL
  }

  /**
   * Set a value in the cache
   */
  set(key: string, data: T, ttl = this.defaultTTL): void {
    // Remove if already exists to update access order
    if (this.cache.has(key)) {
      this.delete(key)
    }

    // Evict oldest items if at capacity
    while (this.cache.size >= this.maxSize && this.accessOrder.length > 0) {
      const oldestKey = this.accessOrder[0]
      this.delete(oldestKey)
    }

    // Add new item
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0
    })

    this.accessOrder.push(key)
    this.updateAccessOrder(key)
  }

  /**
   * Get a value from the cache
   */
  get(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if expired
    if (this.isExpired(item)) {
      this.delete(key)
      return null
    }

    // Update hit count and access order
    item.hits++
    this.updateAccessOrder(key)
    
    return item.data
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false
    
    if (this.isExpired(item)) {
      this.delete(key)
      return false
    }
    
    return true
  }

  /**
   * Delete a key from the cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      const index = this.accessOrder.indexOf(key)
      if (index > -1) {
        this.accessOrder.splice(index, 1)
      }
    }
    return deleted
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
    this.accessOrder = []
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number
    maxSize: number
    hitRate: number
    oldestEntry: string | null
    newestEntry: string | null
  } {
    let totalHits = 0
    let totalRequests = 0

    for (const item of this.cache.values()) {
      totalHits += item.hits
      totalRequests += item.hits + 1 // +1 for initial set
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
      oldestEntry: this.accessOrder[0] || null,
      newestEntry: this.accessOrder[this.accessOrder.length - 1] || null
    }
  }

  /**
   * Remove expired entries
   */
  cleanup(): number {
    let cleaned = 0
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.delete(key)
        cleaned++
      }
    }
    
    return cleaned
  }

  /**
   * Get or set pattern (compute if not cached)
   */
  async getOrSet<U extends T>(
    key: string,
    factory: () => Promise<U>,
    ttl = this.defaultTTL
  ): Promise<U> {
    const cached = this.get(key) as U
    if (cached !== null) {
      return cached
    }

    const value = await factory()
    this.set(key, value, ttl)
    return value
  }

  private isExpired(item: CacheItem<T>): boolean {
    return Date.now() - item.timestamp > item.ttl
  }

  private updateAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
    this.accessOrder.push(key)
  }
}

// Global cache instances
export const profileCache = new CacheManager(50, CONFIG.CACHE_TTL)
export const analysisCache = new CacheManager(100, CONFIG.CACHE_TTL * 2) // Longer TTL for analysis results
export const scrapingCache = new CacheManager(25, CONFIG.CACHE_TTL / 2) // Shorter TTL for scraping results

/**
 * Cache utilities
 */
export const cacheUtils = {
  /**
   * Generate a cache key from multiple parameters
   */
  generateKey(...parts: (string | number | boolean)[]): string {
    return parts.map(part => String(part)).join(':')
  },

  /**
   * Clean all caches of expired entries
   */
  cleanupAll(): { profile: number; analysis: number; scraping: number } {
    return {
      profile: profileCache.cleanup(),
      analysis: analysisCache.cleanup(),
      scraping: scrapingCache.cleanup()
    }
  },

  /**
   * Get combined cache statistics
   */
  getAllStats(): {
    profile: ReturnType<CacheManager['getStats']>
    analysis: ReturnType<CacheManager['getStats']>
    scraping: ReturnType<CacheManager['getStats']>
  } {
    return {
      profile: profileCache.getStats(),
      analysis: analysisCache.getStats(),
      scraping: scrapingCache.getStats()
    }
  },

  /**
   * Clear all caches
   */
  clearAll(): void {
    profileCache.clear()
    analysisCache.clear()
    scrapingCache.clear()
  },

  /**
   * Warm up cache with commonly accessed data
   */
  async warmup(commonKeys: string[], factory: (key: string) => Promise<any>): Promise<void> {
    const promises = commonKeys.map(async (key) => {
      if (!profileCache.has(key)) {
        try {
          const data = await factory(key)
          profileCache.set(key, data)
        } catch (error) {
          console.warn(`Failed to warm up cache for key: ${key}`, error)
        }
      }
    })

    await Promise.allSettled(promises)
  }
}

// Auto-cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (CONFIG.ENABLE_DEBUG_MODE) {
      const cleaned = cacheUtils.cleanupAll()
      const total = cleaned.profile + cleaned.analysis + cleaned.scraping
      if (total > 0) {
        console.log(`🧹 Cache cleanup: removed ${total} expired entries`)
      }
    } else {
      cacheUtils.cleanupAll()
    }
  }, 5 * 60 * 1000)
}