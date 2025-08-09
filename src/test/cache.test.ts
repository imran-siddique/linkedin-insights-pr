import { describe, it, expect, vi, beforeEach } from 'vitest'
import { profileCache, analysisCache, cacheUtils } from '../lib/cache'

describe('Cache Service', () => {
  beforeEach(() => {
    profileCache.clear()
    analysisCache.clear()
  })

  describe('profileCache', () => {
    it('stores and retrieves profile data', () => {
      const profileData = {
        name: 'John Doe',
        industry: 'Tech',
        followers: 1000,
        skills: ['JavaScript']
      }

      profileCache.set('test-key', profileData)
      const retrieved = profileCache.get('test-key')
      
      expect(retrieved).toEqual(profileData)
    })

    it('returns undefined for non-existent keys', () => {
      const result = profileCache.get('non-existent')
      expect(result).toBeUndefined()
    })

    it('respects cache expiration', () => {
      vi.useFakeTimers()
      
      const profileData = { name: 'John' }
      profileCache.set('test-key', profileData)
      
      // Fast forward past expiration
      vi.advanceTimersByTime(24 * 60 * 60 * 1001) // 24+ hours
      
      const result = profileCache.get('test-key')
      expect(result).toBeUndefined()
      
      vi.useRealTimers()
    })

    it('clears all cache entries', () => {
      profileCache.set('key1', { name: 'User1' })
      profileCache.set('key2', { name: 'User2' })
      
      expect(profileCache.get('key1')).toBeTruthy()
      expect(profileCache.get('key2')).toBeTruthy()
      
      profileCache.clear()
      
      expect(profileCache.get('key1')).toBeUndefined()
      expect(profileCache.get('key2')).toBeUndefined()
    })
  })

  describe('analysisCache', () => {
    it('stores and retrieves analysis results', () => {
      const analysisData = {
        recommendations: [],
        trends: [],
        timestamp: Date.now()
      }

      analysisCache.set('analysis-key', analysisData)
      const retrieved = analysisCache.get('analysis-key')
      
      expect(retrieved).toEqual(analysisData)
    })

    it('handles cache size limits', () => {
      // Fill cache beyond limit
      for (let i = 0; i < 150; i++) {
        analysisCache.set(`key-${i}`, { data: i })
      }
      
      // Earlier entries should be evicted
      expect(analysisCache.get('key-0')).toBeUndefined()
      expect(analysisCache.get('key-149')).toBeTruthy()
    })
  })

  describe('cacheUtils', () => {
    it('generates consistent cache keys', () => {
      const key1 = cacheUtils.generateKey('profile', 'user1', 'tech')
      const key2 = cacheUtils.generateKey('profile', 'user1', 'tech')
      const key3 = cacheUtils.generateKey('profile', 'user2', 'tech')
      
      expect(key1).toBe(key2)
      expect(key1).not.toBe(key3)
    })

    it('validates cache keys', () => {
      expect(cacheUtils.isValidKey('valid-key-123')).toBe(true)
      expect(cacheUtils.isValidKey('')).toBe(false)
      expect(cacheUtils.isValidKey('key with spaces')).toBe(false)
      expect(cacheUtils.isValidKey('key-with-special-chars!')).toBe(false)
    })

    it('cleans up all caches', () => {
      profileCache.set('profile-1', { name: 'User' })
      analysisCache.set('analysis-1', { data: 'test' })
      
      cacheUtils.cleanupAll()
      
      expect(profileCache.get('profile-1')).toBeUndefined()
      expect(analysisCache.get('analysis-1')).toBeUndefined()
    })

    it('gets cache statistics', () => {
      profileCache.set('key1', { data: 1 })
      profileCache.set('key2', { data: 2 })
      analysisCache.set('key3', { data: 3 })
      
      const stats = cacheUtils.getStats()
      
      expect(stats.profileCache.size).toBe(2)
      expect(stats.analysisCache.size).toBe(1)
      expect(stats.totalSize).toBe(3)
      expect(stats.profileCache.hitRate).toBeGreaterThanOrEqual(0)
    })
  })
})