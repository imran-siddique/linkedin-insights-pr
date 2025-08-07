import { useState, useCallback, useEffect } from 'react'
import { linkedInScraper } from '@/lib/linkedin-scraper'
import { ScrapingResult, ScrapingSession } from '@/types/linkedin'

export function useLinkedInScraper() {
  const [isActive, setIsActive] = useState(false)
  const [currentSession, setCurrentSession] = useState<ScrapingSession | null>(null)
  const [lastResult, setLastResult] = useState<ScrapingResult | null>(null)
  const [rateLimitStatus, setRateLimitStatus] = useState({ minute: 0, hour: 0, day: 0 })

  // Update rate limit status periodically
  useEffect(() => {
    const updateRateLimits = () => {
      if (linkedInScraper.getStats) {
        const stats = linkedInScraper.getStats()
        setRateLimitStatus(stats)
      }
    }

    updateRateLimits()
    const interval = setInterval(updateRateLimits, 5000)
    return () => clearInterval(interval)
  }, [])

  // Clean up old sessions periodically
  useEffect(() => {
    const cleanup = () => {
      if (linkedInScraper.cleanup) {
        linkedInScraper.cleanup()
      }
    }

    const interval = setInterval(cleanup, 60000) // Every minute
    return () => clearInterval(interval)
  }, [])

  const scrapeProfile = useCallback(async (identifier: string): Promise<ScrapingResult> => {
    setIsActive(true)
    setCurrentSession(null)
    setLastResult(null)

    try {
      const result = await linkedInScraper.scrapeProfile(identifier)
      
      // Update session info if available
      if (result.sessionId) {
        const session = linkedInScraper.getSession(result.sessionId)
        setCurrentSession(session)
      }

      setLastResult(result)
      return result
    } catch (error) {
      const errorResult: ScrapingResult = {
        success: false,
        error: (error as Error).message,
        source: 'scraper',
        timestamp: Date.now()
      }
      setLastResult(errorResult)
      return errorResult
    } finally {
      setIsActive(false)
    }
  }, [])

  const getRateLimitStatus = useCallback(() => rateLimitStatus, [rateLimitStatus])

  return {
    isActive,
    currentSession,
    lastResult,
    rateLimitStatus: getRateLimitStatus(),
    scrapeProfile
  }
}

export default useLinkedInScraper