import { CONFIG } from './config'

/**
 * Rate limiter for API calls and user actions
 */
class RateLimiter {
  private timestamps: { [key: string]: number[] } = {}

  /**
   * Check if an action is allowed based on rate limiting
   * @param key - Unique identifier for the action
   * @param maxRequests - Maximum requests allowed
   * @param windowMs - Time window in milliseconds
   */
  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    
    // Initialize if not exists
    if (!this.timestamps[key]) {
      this.timestamps[key] = []
    }

    // Remove old timestamps outside the window
    this.timestamps[key] = this.timestamps[key].filter(
      timestamp => now - timestamp < windowMs
    )

    // Check if under limit
    if (this.timestamps[key].length < maxRequests) {
      this.timestamps[key].push(now)
      return true
    }

    return false
  }

  /**
   * Get remaining requests for a key
   */
  getRemainingRequests(key: string, maxRequests: number, windowMs: number): number {
    const now = Date.now()
    
    if (!this.timestamps[key]) {
      return maxRequests
    }

    // Count recent timestamps
    const recentRequests = this.timestamps[key].filter(
      timestamp => now - timestamp < windowMs
    ).length

    return Math.max(0, maxRequests - recentRequests)
  }

  /**
   * Get time until next request is allowed
   */
  getRetryAfter(key: string, windowMs: number): number {
    if (!this.timestamps[key] || this.timestamps[key].length === 0) {
      return 0
    }

    const oldestTimestamp = Math.min(...this.timestamps[key])
    const retryAfter = (oldestTimestamp + windowMs) - Date.now()
    return Math.max(0, retryAfter)
  }

  /**
   * Clear rate limiting data for a key
   */
  clear(key: string): void {
    delete this.timestamps[key]
  }

  /**
   * Clear all rate limiting data
   */
  clearAll(): void {
    this.timestamps = {}
  }
}

export const rateLimiter = new RateLimiter()

/**
 * Input validation utilities
 */
export const validation = {
  /**
   * Validate LinkedIn URL or username
   */
  validateLinkedInInput(input: string): { isValid: boolean; error?: string; sanitized?: string } {
    if (!input || typeof input !== 'string') {
      return { isValid: false, error: 'Input is required' }
    }

    const trimmed = input.trim()
    if (trimmed.length === 0) {
      return { isValid: false, error: 'Input cannot be empty' }
    }

    if (trimmed.length > CONFIG.MAX_INPUT_LENGTH) {
      return { isValid: false, error: `Input too long (max ${CONFIG.MAX_INPUT_LENGTH} characters)` }
    }

    // Remove potentially dangerous characters
    const sanitized = trimmed.replace(/[<>\"'&]/g, '')
    
    // Basic LinkedIn URL patterns
    const linkedinPatterns = [
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w\-]+\/?$/i,
      /^linkedin\.com\/in\/[\w\-]+\/?$/i,
      /^(www\.)?linkedin\.com\/in\/[\w\-]+\/?$/i,
      /^[\w\-]+$/ // Just username
    ]

    const isValidPattern = linkedinPatterns.some(pattern => pattern.test(sanitized))
    
    if (!isValidPattern) {
      return { 
        isValid: false, 
        error: 'Please enter a valid LinkedIn profile URL or username' 
      }
    }

    return { isValid: true, sanitized }
  },

  /**
   * Validate and sanitize general text input
   */
  sanitizeText(text: string, maxLength = 1000): string {
    if (!text || typeof text !== 'string') return ''
    
    return text
      .trim()
      .slice(0, maxLength)
      .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
      .replace(/\s+/g, ' ') // Normalize whitespace
  },

  /**
   * Validate email format (basic)
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Check if a value is a valid URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

/**
 * Security utilities
 */
export const security = {
  /**
   * Check if an action should be throttled
   */
  checkRateLimit(action: string): { allowed: boolean; retryAfter?: number } {
    const key = `action_${action}`
    const allowed = rateLimiter.isAllowed(
      key,
      CONFIG.MAX_REQUESTS_PER_MINUTE,
      60000 // 1 minute
    )

    if (!allowed) {
      const retryAfter = rateLimiter.getRetryAfter(key, 60000)
      return { allowed: false, retryAfter }
    }

    return { allowed: true }
  },

  /**
   * Check minimum interval between profile analyses
   */
  checkAnalysisInterval(lastAnalysisTime: number | null): boolean {
    if (!lastAnalysisTime) return true
    
    const now = Date.now()
    return (now - lastAnalysisTime) >= CONFIG.MIN_ANALYSIS_INTERVAL
  },

  /**
   * Generate a simple hash for data integrity checks
   */
  simpleHash(data: string): string {
    let hash = 0
    if (data.length === 0) return hash.toString()
    
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36)
  },

  /**
   * Check if data appears to be valid JSON
   */
  isValidJSON(str: string): boolean {
    try {
      JSON.parse(str)
      return true
    } catch {
      return false
    }
  }
}

/**
 * Performance monitoring utilities
 */
export const performance = {
  /**
   * Measure execution time of a function
   */
  measureTime<T>(name: string, fn: () => T): T {
    const start = Date.now()
    const result = fn()
    const end = Date.now()
    
    if (CONFIG.ENABLE_DEBUG_MODE) {
      console.log(`⏱️ ${name}: ${(end - start)}ms`)
    }
    
    return result
  },

  /**
   * Measure execution time of an async function
   */
  async measureTimeAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now()
    const result = await fn()
    const end = Date.now()
    
    if (CONFIG.ENABLE_DEBUG_MODE) {
      console.log(`⏱️ ${name}: ${(end - start)}ms`)
    }
    
    return result
  },

  /**
   * Debounce function calls
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number | null = null
    
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout)
      
      timeout = setTimeout(() => {
        func.apply(null, args)
      }, wait)
    }
  },

  /**
   * Throttle function calls
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}