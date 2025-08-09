import { describe, it, expect, vi } from 'vitest'
import { validation, security, performance } from '../lib/security'

describe('Validation Service', () => {
  describe('validateLinkedInInput', () => {
    it('validates correct LinkedIn URLs', () => {
      const validUrls = [
        'https://linkedin.com/in/username',
        'https://www.linkedin.com/in/username',
        'linkedin.com/in/username',
        'www.linkedin.com/in/username'
      ]

      validUrls.forEach(url => {
        const result = validation.validateLinkedInInput(url)
        expect(result.isValid).toBe(true)
        expect(result.sanitized).toBeTruthy()
      })
    })

    it('validates plain usernames', () => {
      const result = validation.validateLinkedInInput('testuser123')
      expect(result.isValid).toBe(true)
      expect(result.sanitized).toBe('testuser123')
    })

    it('rejects invalid inputs', () => {
      const invalidInputs = [
        '',
        '   ',
        'https://facebook.com/user',
        'invalid-url',
        'user@name',
        'user name',
        'a'.repeat(101) // too long
      ]

      invalidInputs.forEach(input => {
        const result = validation.validateLinkedInInput(input)
        expect(result.isValid).toBe(false)
        expect(result.error).toBeTruthy()
      })
    })

    it('sanitizes inputs properly', () => {
      const testCases = [
        { input: '  username  ', expected: 'username' },
        { input: 'https://linkedin.com/in/user/', expected: 'user' },
        { input: 'USERNAME', expected: 'username' }
      ]

      testCases.forEach(({ input, expected }) => {
        const result = validation.validateLinkedInInput(input)
        expect(result.sanitized).toBe(expected)
      })
    })
  })

  describe('sanitizeInput', () => {
    it('removes dangerous characters', () => {
      const dangerous = '<script>alert("xss")</script>'
      const result = validation.sanitizeInput(dangerous)
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert')
    })

    it('preserves safe characters', () => {
      const safe = 'user-name_123'
      const result = validation.sanitizeInput(safe)
      expect(result).toBe(safe)
    })
  })
})

describe('Security Service', () => {
  describe('checkRateLimit', () => {
    it('allows requests within rate limit', () => {
      const result = security.checkRateLimit('test_action')
      expect(result.allowed).toBe(true)
      expect(result.retryAfter).toBeUndefined()
    })

    it('blocks requests exceeding rate limit', () => {
      // Exhaust rate limit
      for (let i = 0; i < 10; i++) {
        security.checkRateLimit('test_burst')
      }
      
      const result = security.checkRateLimit('test_burst')
      expect(result.allowed).toBe(false)
      expect(result.retryAfter).toBeGreaterThan(0)
    })
  })

  describe('checkAnalysisInterval', () => {
    it('allows first analysis', () => {
      const result = security.checkAnalysisInterval(null)
      expect(result).toBe(true)
    })

    it('blocks analysis too soon', () => {
      const recentTime = Date.now() - 1000 // 1 second ago
      const result = security.checkAnalysisInterval(recentTime)
      expect(result).toBe(false)
    })

    it('allows analysis after sufficient interval', () => {
      const oldTime = Date.now() - 120000 // 2 minutes ago
      const result = security.checkAnalysisInterval(oldTime)
      expect(result).toBe(true)
    })
  })

  describe('validateCSRF', () => {
    it('generates and validates CSRF tokens', () => {
      const token = security.generateCSRFToken()
      expect(token).toBeTruthy()
      
      const isValid = security.validateCSRF(token)
      expect(isValid).toBe(true)
    })

    it('rejects invalid CSRF tokens', () => {
      const isValid = security.validateCSRF('invalid-token')
      expect(isValid).toBe(false)
    })
  })
})

describe('Performance Service', () => {
  describe('debounce', () => {
    it('debounces function calls', async () => {
      vi.useFakeTimers()
      
      const fn = vi.fn()
      const debounced = performance.debounce(fn, 100)
      
      debounced()
      debounced()
      debounced()
      
      expect(fn).not.toHaveBeenCalled()
      
      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
      
      vi.useRealTimers()
    })
  })

  describe('throttle', () => {
    it('throttles function calls', async () => {
      vi.useFakeTimers()
      
      const fn = vi.fn()
      const throttled = performance.throttle(fn, 100)
      
      throttled()
      throttled()
      throttled()
      
      expect(fn).toHaveBeenCalledTimes(1)
      
      vi.advanceTimersByTime(100)
      throttled()
      
      expect(fn).toHaveBeenCalledTimes(2)
      
      vi.useRealTimers()
    })
  })

  describe('memoize', () => {
    it('caches function results', () => {
      const fn = vi.fn((x: number) => x * 2)
      const memoized = performance.memoize(fn)
      
      expect(memoized(5)).toBe(10)
      expect(memoized(5)).toBe(10)
      expect(fn).toHaveBeenCalledTimes(1)
      
      expect(memoized(10)).toBe(20)
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})