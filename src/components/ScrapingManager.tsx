import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Clock, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Pause,
  Play,
  BarChart,
  Shield,
  Globe,
  Cpu,
  Activity,
  Timer,
  Database,
  TrendingUp,
  AlertCircle
} from '@phosphor-icons/react'
import { ScrapingResult, ScrapingSession, ScrapingStats } from '@/types/linkedin'
import { useLinkedInScraper } from '@/hooks/useLinkedInScraper'
import { useKV } from '@github/spark/hooks'

interface ScrapingManagerProps {
  identifier: string
  onScrapingComplete: (result: ScrapingResult) => void
  onScrapingError: (error: string) => void
  autoStart?: boolean
}

export function ScrapingManager({ 
  identifier, 
  onScrapingComplete, 
  onScrapingError,
  autoStart = false 
}: ScrapingManagerProps) {
  const { 
    isActive: scraperIsActive, 
    currentSession, 
    lastResult, 
    rateLimitStatus, 
    scrapeProfile 
  } = useLinkedInScraper()
  
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState<string>('')
  const [scrapingStats, setScrapingStats] = useKV<ScrapingStats>('scraping-stats', {
    totalRequests: 0,
    successfulScrapes: 0,
    failedScrapes: 0,
    averageResponseTime: 0,
    cacheHitRate: 0,
    rateLimitHits: 0,
    strategiesUsed: {}
  })
  
  const isActive = scraperIsActive

  // Auto-start scraping if requested
  useEffect(() => {
    if (autoStart && identifier && !isActive) {
      startScraping()
    }
  }, [autoStart, identifier])

  // Handle scraping results
  useEffect(() => {
    if (lastResult) {
      setProgress(100)
      setCurrentStage(lastResult.success ? 'Scraping completed successfully!' : 'Scraping failed')
      
      if (lastResult.success) {
        onScrapingComplete(lastResult)
      } else {
        onScrapingError(lastResult.error || 'Unknown scraping error')
      }
    }
  }, [lastResult, onScrapingComplete, onScrapingError])

  const startScraping = async () => {
    if (!identifier || isActive) return

    setProgress(0)
    setCurrentStage('Initializing scraping session...')

    const startTime = Date.now()

    try {
      // Update stats
      setScrapingStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + 1
      }))

      // Start scraping with progress monitoring
      const progressStages = [
        'Validating identifier format...',
        'Checking rate limits...',
        'Attempting public API access...',
        'Falling back to website scraping...',
        'Using AI analysis...',
        'Finalizing data extraction...'
      ]

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 15, 90)
          const stageIndex = Math.floor((newProgress / 100) * progressStages.length)
          setCurrentStage(progressStages[stageIndex] || progressStages[progressStages.length - 1])
          return newProgress
        })
      }, 800)

      const result = await scrapeProfile(identifier)

      clearInterval(progressInterval)
      
      const endTime = Date.now()
      const responseTime = endTime - startTime

      // Update statistics
      setScrapingStats(prev => {
        const newStats = {
          ...prev,
          averageResponseTime: (prev.averageResponseTime * (prev.totalRequests - 1) + responseTime) / prev.totalRequests,
          strategiesUsed: {
            ...prev.strategiesUsed,
            [result.source]: (prev.strategiesUsed[result.source] || 0) + 1
          }
        }

        if (result.success) {
          newStats.successfulScrapes += 1
          if (result.source === 'cache') {
            newStats.cacheHitRate = (newStats.cacheHitRate * (prev.totalRequests - 1) + 1) / prev.totalRequests
          }
        } else {
          newStats.failedScrapes += 1
        }

        return newStats
      })

    } catch (error) {
      setCurrentStage('Scraping failed')
      setProgress(0)
      
      setScrapingStats(prev => ({
        ...prev,
        failedScrapes: prev.failedScrapes + 1
      }))

      onScrapingError((error as Error).message)
    }
  }

  const formatResponseTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const getProgressColor = () => {
    if (progress === 100) return 'bg-green-500'
    if (progress > 50) return 'bg-blue-500'
    return 'bg-orange-500'
  }

  const getRateLimitBadgeColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100
    if (percentage >= 90) return 'destructive'
    if (percentage >= 75) return 'secondary'
    return 'outline'
  }

  return (
    <div className="space-y-4">
      {/* Main Scraping Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Real-time LinkedIn Scraper
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={isActive ? 'default' : 'outline'}>
                {isActive ? 'Active' : 'Idle'}
              </Badge>
              {lastScrapingResult && (
                <Badge variant={lastScrapingResult.success ? 'default' : 'destructive'}>
                  {lastScrapingResult.source}
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            Advanced profile scraping with rate limiting and fallback strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Display */}
            {(isActive || progress > 0) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Scraping Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className={`w-full ${getProgressColor()}`} />
                {currentStage && (
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    {currentStage}
                  </p>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <Button onClick={startScraping} disabled={!identifier || isActive} className="px-6">
                <Play className="h-4 w-4 mr-2" />
                {isActive ? 'Scraping...' : 'Start Scraping'}
              </Button>
              
              {lastResult && (
                <Badge variant="outline" className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatResponseTime(Date.now() - lastResult.timestamp)}
                </Badge>
              )}
            </div>

            {/* Last Result Summary */}
            {lastResult && (
              <Alert className={lastResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {lastResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>
                      {lastResult.success 
                        ? `Successfully scraped profile using ${lastResult.source}` 
                        : `Scraping failed: ${lastResult.error}`
                      }
                    </span>
                    {lastResult.confidence && (
                      <Badge variant="outline" className="text-xs">
                        {Math.round(lastResult.confidence * 100)}% confidence
                      </Badge>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Rate Limiting Status
          </CardTitle>
          <CardDescription>
            Current API usage across different time windows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Per Minute</span>
                <Badge variant={getRateLimitBadgeColor(rateLimitStatus.minute, 8)}>
                  {rateLimitStatus.minute}/8
                </Badge>
              </div>
              <Progress value={(rateLimitStatus.minute / 8) * 100} className="w-full" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Per Hour</span>
                <Badge variant={getRateLimitBadgeColor(rateLimitStatus.hour, 80)}>
                  {rateLimitStatus.hour}/80
                </Badge>
              </div>
              <Progress value={(rateLimitStatus.hour / 80) * 100} className="w-full" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Per Day</span>
                <Badge variant={getRateLimitBadgeColor(rateLimitStatus.day, 800)}>
                  {rateLimitStatus.day}/800
                </Badge>
              </div>
              <Progress value={(rateLimitStatus.day / 800) * 100} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Information */}
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Current Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Session ID:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{currentSession.id}</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Identifier:</span>
                <span className="font-medium">{currentSession.identifier}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={
                  currentSession.status === 'completed' ? 'default' :
                  currentSession.status === 'failed' ? 'destructive' :
                  currentSession.status === 'rate-limited' ? 'secondary' : 'outline'
                }>
                  {currentSession.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Attempts:</span>
                <span className="font-medium">{currentSession.attempts || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">
                  {formatResponseTime(Date.now() - currentSession.startTime)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scraping Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2" />
            Scraping Statistics
          </CardTitle>
          <CardDescription>
            Performance metrics and success rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-primary">{scrapingStats.totalRequests}</p>
              <p className="text-xs text-muted-foreground">Total Requests</p>
            </div>
            
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-green-600">{scrapingStats.successfulScrapes}</p>
              <p className="text-xs text-muted-foreground">Successful</p>
            </div>
            
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-blue-600">
                {scrapingStats.totalRequests > 0 
                  ? `${Math.round((scrapingStats.cacheHitRate) * 100)}%`
                  : '0%'
                }
              </p>
              <p className="text-xs text-muted-foreground">Cache Hit Rate</p>
            </div>
            
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-orange-600">
                {formatResponseTime(scrapingStats.averageResponseTime)}
              </p>
              <p className="text-xs text-muted-foreground">Avg Response</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <p className="text-sm font-medium mb-2">Strategy Usage:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(scrapingStats.strategiesUsed).map(([strategy, count]) => (
                <Badge key={strategy} variant="outline" className="text-xs">
                  {strategy}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ScrapingManager