import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

// Global spark interface
declare global {
  interface Window {
    spark: {
      llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => string
      llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>
      user: () => Promise<{ avatarUrl: string; email: string; id: string; isOwner: boolean; login: string }>
      kv: {
        keys: () => Promise<string[]>
        get: <T>(key: string) => Promise<T | undefined>
        set: <T>(key: string, value: T) => Promise<void>
        delete: (key: string) => Promise<void>
      }
    }
  }
}

// Access spark globally
const spark = (typeof window !== 'undefined' && window.spark) || {
  llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => strings.join(''),
  llm: async (prompt: string) => Promise.resolve(''),
  user: async () => Promise.resolve({ avatarUrl: '', email: '', id: '', isOwner: false, login: '' }),
  kv: {
    keys: async () => Promise.resolve([]),
    get: async () => Promise.resolve(undefined),
    set: async () => Promise.resolve(),
    delete: async () => Promise.resolve()
  }
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  TrendUp, 
  TrendDown, 
  Users, 
  ChatCircle, 
  Lightbulb, 
  Hash,
  Calendar,
  MagnifyingGlass,
  ArrowSquareOut,
  Target,
  Lightning,
  Brain,
  Star,
  BookOpen,
  Trophy,
  CheckCircle,
  WarningCircle,
  Info,
  ChartBar,
  Crown,
  Shield,
  Gauge,
  ArrowUp,
  ArrowDown,
  Equals,
  CurrencyDollar,
  MapPin,
  Buildings,
  GraduationCap,
  ChartLineUp,
  Briefcase,
  Globe,
  Activity,
  Clock
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { linkedInService } from '@/lib/linkedin-api'
import { skillsAnalysisService } from '@/lib/skills-analysis'
import ScrapingManager from '@/components/ScrapingManager'
import { ErrorFallback } from './ErrorFallback'
import { CONFIG } from '@/lib/config'
import { errorService, safeAsync, setupGlobalErrorHandling } from '@/lib/errorHandling'
import { validation, security, performance } from '@/lib/security'
import { profileCache, analysisCache, cacheUtils } from '@/lib/cache'
import { healthMonitor } from '@/lib/monitoring'
import { 
  ProfileData, 
  Recommendation, 
  TrendingTopic, 
  SkillInsight, 
  ProfileInsights,
  ActivityMetrics,
  VisualBrandingAnalysis,
  CompetitiveAnalysis,
  CompensationAnalysis,
  ScrapingResult,
  SkillAnalysis
} from '@/types/linkedin'

function App() {
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useKV<ProfileData | null>('profile-data', null)
  const [recommendations, setRecommendations] = useKV<Recommendation[]>('recommendations', [])
  const [trendingTopics, setTrendingTopics] = useKV<TrendingTopic[]>('trending-topics', [])
  const [skillInsights, setSkillInsights] = useKV<SkillInsight[]>('skill-insights', [])
  const [profileInsights, setProfileInsights] = useKV<ProfileInsights | null>('profile-insights', null)
  const [activityMetrics, setActivityMetrics] = useKV<ActivityMetrics | null>('activity-metrics', null)
  const [visualBranding, setVisualBranding] = useKV<VisualBrandingAnalysis | null>('visual-branding', null)
  const [competitiveAnalysis, setCompetitiveAnalysis] = useKV<CompetitiveAnalysis | null>('competitive-analysis', null)
  const [compensationAnalysis, setCompensationAnalysis] = useKV<CompensationAnalysis | null>('compensation-analysis', null)
  const [skillsAnalysis, setSkillsAnalysis] = useKV<SkillAnalysis | null>('skills-analysis', null)
  const [lastAnalysisTime, setLastAnalysisTime] = useKV<number | null>('last-analysis-time', null)
  const [error, setError] = useState('')
  const [analysisStage, setAnalysisStage] = useState('')
  const [scrapingResult, setScrapingResult] = useState<ScrapingResult | null>(null)
  const [showScrapingManager, setShowScrapingManager] = useState(false)

  // Setup global error handling on component mount
  useEffect(() => {
    setupGlobalErrorHandling()
    
    // Log application startup
    if (CONFIG.ENABLE_DEBUG_MODE) {
      console.log(`🚀 ${CONFIG.APP_NAME} v${CONFIG.APP_VERSION} started`)
      console.log('Configuration:', CONFIG)
      console.log('Health Status:', healthMonitor.getHealthStatus())
    }

    // Record error events for health monitoring
    const originalLogError = errorService.logError
    errorService.logError = (error: Error, context?: string) => {
      healthMonitor.recordError()
      return originalLogError.call(errorService, error, context)
    }

    return () => {
      // Cleanup on unmount
      cacheUtils.cleanupAll()
      
      if (CONFIG.ENABLE_DEBUG_MODE) {
        console.log('🏁 Application cleanup completed')
        console.log('Final Health Status:', healthMonitor.getHealthStatus())
      }
    }
  }, [])

  // Debounced input validation
  const debouncedValidateInput = useCallback(
    performance.debounce((input: string) => {
      if (!input.trim()) {
        setError('')
        return
      }

      const validation_result = validation.validateLinkedInInput(input)
      if (!validation_result.isValid && validation_result.error) {
        setError(validation_result.error)
      } else {
        setError('')
      }
    }, 500),
    []
  )

  // Handle input changes with validation
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLinkedinUrl(value)
    debouncedValidateInput(value)
  }, [debouncedValidateInput])

  // Memoized validation result
  const inputValidation = useMemo(() => {
    if (!linkedinUrl.trim()) return { isValid: true }
    return validation.validateLinkedInInput(linkedinUrl.trim())
  }, [linkedinUrl])

  const analyzeProfile = async () => {
    // Input validation
    const validationResult = validation.validateLinkedInInput(linkedinUrl.trim())
    if (!validationResult.isValid) {
      setError(validationResult.error || 'Invalid input')
      return
    }

    const sanitizedInput = validationResult.sanitized!
    const linkedinId = linkedInService.extractLinkedInUsername(sanitizedInput)
    if (!linkedinId) {
      setError('Please enter a valid LinkedIn profile URL or username')
      return
    }

    // Rate limiting check
    const rateLimitCheck = security.checkRateLimit('profile_analysis')
    if (!rateLimitCheck.allowed) {
      const waitTime = Math.ceil((rateLimitCheck.retryAfter || 0) / 1000)
      setError(`Rate limit exceeded. Please wait ${waitTime} seconds before trying again.`)
      toast.error(`Rate limit exceeded. Wait ${waitTime}s`)
      return
    }

    // Check minimum interval between analyses
    if (!security.checkAnalysisInterval(lastAnalysisTime)) {
      const waitTime = Math.ceil((CONFIG.MIN_ANALYSIS_INTERVAL - (Date.now() - (lastAnalysisTime || 0))) / 1000)
      setError(`Please wait ${waitTime} seconds between analyses.`)
      return
    }

    setIsLoading(true)
    setError('')
    setAnalysisStage('')
    setShowScrapingManager(true)

    try {
      setLastAnalysisTime(Date.now())
      
      // Log analysis start
      if (CONFIG.ENABLE_DEBUG_MODE) {
        console.log(`🔍 Starting analysis for: ${linkedinId}`)
      }
      
    } catch (error: any) {
      errorService.logError(error, 'Analysis Initialization')
      setError(error.message || 'Failed to initialize profile analysis.')
      toast.error('Analysis initialization failed.')
      setIsLoading(false)
    }
  }

  const handleScrapingComplete = async (result: ScrapingResult) => {
    try {
      setScrapingResult(result)
      
      if (!result.data) {
        throw new Error('No profile data received from scraper')
      }

      const fetchedProfileData = result.data
      setProfileData(fetchedProfileData)

      // Cache the profile data
      const cacheKey = cacheUtils.generateKey('profile', fetchedProfileData.name, fetchedProfileData.industry)
      profileCache.set(cacheKey, fetchedProfileData)

      // Continue with enhanced AI analysis
      await performAIAnalysis(fetchedProfileData)
      
      setAnalysisStage('')
      setShowScrapingManager(false)
      toast.success(`Profile analyzed successfully via ${result.source}! 🎉`)
      
    } catch (error: any) {
      errorService.logError(error, 'Post-scraping Analysis')
      setError(error.message || 'Failed to complete analysis after scraping.')
      toast.error('Analysis completion failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleScrapingError = (errorMessage: string) => {
    errorService.logError(new Error(errorMessage), 'Scraping Process')
    setError(`Scraping failed: ${errorMessage}`)
    setIsLoading(false)
    setShowScrapingManager(false)
    toast.error('Profile scraping failed.')
  }

  const performAIAnalysis = async (profileData: ProfileData) => {
    const linkedinId = linkedInService.extractLinkedInUsername(linkedinUrl.trim())
    
    try {
      // Check cache first for analysis results
      const analysisCacheKey = cacheUtils.generateKey('analysis', linkedinId || '', profileData.industry)
      const cachedAnalysis = analysisCache.get(analysisCacheKey)
      
      if (cachedAnalysis && CONFIG.ENABLE_DEBUG_MODE) {
        console.log('💾 Using cached analysis results')
      }

      // Stage 1: Generate AI-powered recommendations
      setAnalysisStage('Generating personalized recommendations...')
      const recommendationsResult = await safeAsync(async () => {
        const prompt = spark.llmPrompt`Based on this LinkedIn profile data: ${JSON.stringify(profileData)}, generate 8 specific, actionable recommendations for improving their LinkedIn presence and professional growth. Focus heavily on their skills: ${profileData.skills.join(', ')}. For each recommendation, consider:
        - Current market trends for their skills
        - Opportunities to showcase expertise
        - Skills to develop or highlight
        - Ways to position themselves in the market
        - Their experience level of ${profileData.experience} years
        - Their industry: ${profileData.industry}
        - Real-time data freshness: ${profileData.dataFreshness || 'unknown'}

        Format as JSON array with fields: category (content/networking/optimization/skills), title, description, priority (high/medium/low), action, relatedSkills (array of relevant skills), impactScore (1-10).`
        
        const response = await spark.llm(prompt, 'gpt-4o-mini', true)
        const parsed = JSON.parse(response)
        return Array.isArray(parsed) 
          ? parsed.map((rec: any, index: number) => ({ ...rec, id: `rec-${index}` }))
          : []
      }, 'AI Recommendations Generation', [])

      if (recommendationsResult) {
        setRecommendations(recommendationsResult)
      }

      // Stage 2: Generate skill-aware trending topics
      setAnalysisStage('Analyzing industry trends...')
      const trendsResult = await safeAsync(async () => {
        const prompt = spark.llmPrompt`For someone in the ${profileData.industry} industry with these skills: ${profileData.skills.join(', ')} and ${profileData.experience} years of experience, identify 6 current trending topics they should engage with on LinkedIn. Consider:
        - Emerging technologies related to their skills
        - Industry shifts affecting their expertise
        - New applications of their existing skills
        - Complementary skills they should develop
        - Their professional level and experience
        - Data recency: profile data is ${profileData.dataFreshness || 'estimated'}
        
        Format as JSON array with fields: topic, relevanceScore (1-10), hashtags (array), suggestedAction, relatedSkills (array), marketDemand (high/medium/low), difficulty (beginner/intermediate/advanced), estimatedReach (number), competitionLevel (low/medium/high).`
        
        const response = await spark.llm(prompt, 'gpt-4o-mini', true)
        const parsed = JSON.parse(response)
        return Array.isArray(parsed) ? parsed : []
      }, 'Trending Topics Analysis', [])

      if (trendsResult) {
        setTrendingTopics(trendsResult)
      }

      // Stage 3: Generate skill insights
      setAnalysisStage('Evaluating skill market value...')
      const skillsResult = await safeAsync(async () => {
        const prompt = spark.llmPrompt`Analyze these skills for market opportunities: ${profileData.skills.join(', ')}. For each skill, provide detailed insights on:
        - Current market demand and growth potential
        - Growth trajectory (growing/stable/declining)
        - Salary impact potential
        - Specific learning resources to advance
        - Related opportunities in the market
        - Demand score out of 100
        - Average salary increase potential
        
        Consider the person has ${profileData.experience} years of experience in ${profileData.industry}.
        Profile data quality: ${profileData.confidenceScore ? Math.round(profileData.confidenceScore * 100) : 'unknown'}% confidence.
        
        Format as JSON array with fields: skill, marketDemand (high/medium/low), growth (growing/stable/declining), salary_impact (high/medium/low), learning_resources (array), related_opportunities (array), demandScore (1-100), averageSalaryIncrease (percentage string).`
        
        const response = await spark.llm(prompt, 'gpt-4o-mini', true)
        const parsed = JSON.parse(response)
        return Array.isArray(parsed) ? parsed : []
      }, 'Skill Market Analysis', [])

      if (skillsResult) {
        setSkillInsights(skillsResult)
      }

      // Continue with remaining analysis stages
      await Promise.allSettled([
        // Stage 4: Generate profile insights
        safeAsync(async () => {
          setAnalysisStage('Analyzing profile strengths...')
          const insights = await linkedInService.getProfileInsights(linkedinId || 'unknown', profileData)
          setProfileInsights(insights)
        }, 'Profile Insights Generation'),

        // Stage 5: Analyze activity metrics
        safeAsync(async () => {
          setAnalysisStage('Calculating activity metrics...')
          const metrics = await linkedInService.getActivityMetrics(profileData)
          setActivityMetrics(metrics)
        }, 'Activity Metrics Calculation'),

        // Stage 6: Analyze visual branding
        safeAsync(async () => {
          setAnalysisStage('Evaluating visual branding...')
          const branding = await linkedInService.analyzeVisualBranding(linkedinId || 'unknown')
          setVisualBranding(branding)
        }, 'Visual Branding Analysis'),

        // Stage 7: Perform competitive analysis
        safeAsync(async () => {
          setAnalysisStage('Analyzing competitive landscape...')
          const competitiveData = await linkedInService.performCompetitiveAnalysis(profileData)
          setCompetitiveAnalysis(competitiveData)
        }, 'Competitive Analysis'),

        // Stage 8: Generate compensation analysis
        safeAsync(async () => {
          setAnalysisStage('Analyzing salary benchmarks and compensation...')
          const compensationData = await linkedInService.generateCompensationAnalysis(profileData)
          setCompensationAnalysis(compensationData)
        }, 'Compensation Analysis'),

        // Stage 9: Perform comprehensive skills analysis
        safeAsync(async () => {
          setAnalysisStage('Conducting comprehensive skills analysis...')
          const skillsData = await skillsAnalysisService.analyzeSkills(profileData)
          setSkillsAnalysis(skillsData)
        }, 'Skills Analysis')
      ])

      // Cache the complete analysis results
      const completeAnalysis = {
        recommendations: recommendationsResult,
        trends: trendsResult,
        skills: skillsResult,
        timestamp: Date.now()
      }
      analysisCache.set(analysisCacheKey, completeAnalysis)

    } catch (error: any) {
      errorService.logError(error, 'AI Analysis Pipeline')
      errorService.logWarning('Some AI analysis steps failed, but profile data is available', 'Analysis Pipeline')
    }
  }

  const LoadingStateCard = ({ stage }: { stage: string }) => (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-foreground">Analyzing your LinkedIn profile...</p>
            {stage && (
              <p className="text-sm text-muted-foreground flex items-center">
                <Info className="h-4 w-4 mr-2" />
                {stage}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <Progress value={
            stage.includes('Validating') ? 10 :
            stage.includes('Fetching profile') ? 20 :
            stage.includes('recommendations') ? 35 :
            stage.includes('trends') ? 50 :
            stage.includes('skill market') ? 65 :
            stage.includes('strengths') ? 75 :
            stage.includes('activity') ? 85 :
            stage.includes('visual') ? 90 :
            stage.includes('competitive') ? 95 :
            stage.includes('landscape') ? 95 :
            stage.includes('salary benchmarks') ? 98 :
            stage.includes('skills analysis') ? 100 : 5
          } className="w-full" />
        </div>
      </CardContent>
    </Card>
  )

  const ProfileInsightsCard = () => {
    if (!profileInsights) return null

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              Profile Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profileInsights.strengths.map((strength, index) => (
                <div key={index} className="flex items-start">
                  <Star className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <WarningCircle className="h-5 w-5 mr-2" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profileInsights.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start">
                  <TrendUp className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{improvement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const ActivityMetricsCard = () => {
    if (!activityMetrics) return null

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Activity & Engagement Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Posting Frequency</p>
              <p className="text-2xl font-bold text-primary">{activityMetrics.avgPostsPerWeek}</p>
              <p className="text-xs text-muted-foreground">posts per week</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Engagement Trend</p>
              <div className="flex items-center">
                {activityMetrics.engagementTrend === 'increasing' ? (
                  <TrendUp className="h-5 w-5 text-green-500 mr-1" />
                ) : (
                  <TrendDown className="h-5 w-5 text-gray-500 mr-1" />
                )}
                <span className="text-sm font-medium capitalize">{activityMetrics.engagementTrend}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Monthly Growth</p>
              <p className="text-2xl font-bold text-primary">+{activityMetrics.audienceGrowth}</p>
              <p className="text-xs text-muted-foreground">followers</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            <p className="text-sm font-medium">Best Posting Times</p>
            <div className="flex flex-wrap gap-2">
              {activityMetrics.bestPostingTimes.map((time, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {time}
                </Badge>
              ))}
            </div>
            
            <p className="text-sm font-medium mt-3">Best Posting Days</p>
            <div className="flex flex-wrap gap-2">
              {activityMetrics.bestPostingDays.map((day, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const MetricCard = ({ title, value, change, icon: Icon }: { 
    title: string
    value: string | number
    change?: number
    icon: React.ElementType 
  }) => (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="flex items-center space-x-4 w-full">
          <Icon className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <div className="flex items-center text-sm">
                {change >= 0 ? (
                  <TrendUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{recommendation.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={recommendation.priority === 'high' ? 'default' : 'secondary'}>
              {recommendation.priority}
            </Badge>
            <Badge variant="outline">
              {recommendation.category}
            </Badge>
            {recommendation.impactScore && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Impact: {recommendation.impactScore}/10
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-3">{recommendation.description}</p>
        
        {recommendation.relatedSkills && recommendation.relatedSkills.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-2">Related Skills:</p>
            <div className="flex flex-wrap gap-2">
              {recommendation.relatedSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Button variant="outline" size="sm">
          {recommendation.action}
        </Button>
      </CardContent>
    </Card>
  )

  const SkillInsightCard = ({ insight }: { insight: SkillInsight }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            {insight.skill}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={insight.marketDemand === 'high' ? 'default' : 'secondary'}>
              {insight.marketDemand} demand
            </Badge>
            <Badge variant={insight.growth === 'growing' ? 'default' : 'outline'} className={
              insight.growth === 'growing' ? 'bg-green-100 text-green-800' :
              insight.growth === 'stable' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }>
              {insight.growth}
            </Badge>
            {insight.demandScore && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                Score: {insight.demandScore}/100
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Salary Impact:</span>
              <Badge variant="outline" className={
                insight.salary_impact === 'high' ? 'bg-green-50 text-green-700' :
                insight.salary_impact === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                'bg-gray-50 text-gray-700'
              }>
                {insight.salary_impact}
              </Badge>
            </div>
            
            {insight.averageSalaryIncrease && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg. Increase:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {insight.averageSalaryIncrease}
                </Badge>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Learning Resources:</p>
            <div className="space-y-1">
              {insight.learning_resources && insight.learning_resources.length > 0 ? (
                insight.learning_resources.slice(0, 3).map((resource, index) => (
                  <div key={index} className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {resource}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No resources available</div>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Related Opportunities:</p>
            <div className="space-y-1">
              {insight.related_opportunities && insight.related_opportunities.length > 0 ? (
                insight.related_opportunities.slice(0, 2).map((opportunity, index) => (
                  <div key={index} className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 mr-2" />
                    {opportunity}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No opportunities available</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const TrendCard = ({ trend }: { trend: TrendingTopic }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Hash className="h-5 w-5 mr-2" />
            {trend.topic}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {trend.relevanceScore}/10
            </Badge>
            <Badge variant={trend.marketDemand === 'high' ? 'default' : 'outline'}>
              {trend.marketDemand} demand
            </Badge>
            {trend.competitionLevel && (
              <Badge variant="outline" className={
                trend.competitionLevel === 'low' ? 'bg-green-50 text-green-700' :
                trend.competitionLevel === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              }>
                {trend.competitionLevel} competition
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Difficulty:</span>
              <Badge variant="outline" className={
                trend.difficulty === 'beginner' ? 'bg-green-50 text-green-700' :
                trend.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              }>
                {trend.difficulty}
              </Badge>
            </div>
            
            {trend.estimatedReach && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Est. Reach:</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {trend.estimatedReach.toLocaleString()}
                </Badge>
              </div>
            )}
          </div>
          
          {trend.relatedSkills && trend.relatedSkills.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Relevant Skills:</p>
              <div className="flex flex-wrap gap-1">
                {trend.relatedSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {trend.hashtags && trend.hashtags.length > 0 ? (
              trend.hashtags.map((hashtag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{hashtag}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                No hashtags available
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">{trend.suggestedAction}</p>
          <Button variant="outline" size="sm">
            <ArrowSquareOut className="h-4 w-4 mr-2" />
            Explore Topic
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const CompetitiveAnalysisOverview = () => {
    if (!competitiveAnalysis) return null

    return (
      <div className="space-y-6">
        {/* Market Positioning Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              Your Market Position
            </CardTitle>
            <CardDescription>
              How you rank against industry peers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary mr-2" />
                  <span className="text-2xl font-bold">#{competitiveAnalysis.userRanking.followers.rank}</span>
                </div>
                <p className="text-sm text-muted-foreground">Followers Rank</p>
                <Badge variant={competitiveAnalysis.userRanking.followers.percentile >= 70 ? 'default' : 'secondary'}>
                  {competitiveAnalysis.userRanking.followers.percentile}th percentile
                </Badge>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <TrendUp className="h-6 w-6 text-accent mr-2" />
                  <span className="text-2xl font-bold">#{competitiveAnalysis.userRanking.engagement.rank}</span>
                </div>
                <p className="text-sm text-muted-foreground">Engagement Rank</p>
                <Badge variant={competitiveAnalysis.userRanking.engagement.percentile >= 70 ? 'default' : 'secondary'}>
                  {competitiveAnalysis.userRanking.engagement.percentile}th percentile
                </Badge>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <Gauge className="h-6 w-6 text-green-500 mr-2" />
                  <span className="text-2xl font-bold">#{competitiveAnalysis.userRanking.profileScore.rank}</span>
                </div>
                <p className="text-sm text-muted-foreground">Profile Score</p>
                <Badge variant={competitiveAnalysis.userRanking.profileScore.percentile >= 70 ? 'default' : 'secondary'}>
                  {competitiveAnalysis.userRanking.profileScore.percentile}th percentile
                </Badge>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-500 mr-2" />
                  <span className="text-2xl font-bold">#{competitiveAnalysis.userRanking.overallScore.rank}</span>
                </div>
                <p className="text-sm text-muted-foreground">Overall Rank</p>
                <Badge variant={competitiveAnalysis.userRanking.overallScore.percentile >= 70 ? 'default' : 'secondary'}>
                  {competitiveAnalysis.userRanking.overallScore.percentile}th percentile
                </Badge>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Current Position: <Badge className="ml-2">{competitiveAnalysis.marketPositioning.currentPosition}</Badge>
                </h4>
                <p className="text-sm text-muted-foreground">
                  {competitiveAnalysis.marketPositioning.recommendedPosition}
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-sm">Strength Areas:</p>
                <div className="flex flex-wrap gap-1">
                  {competitiveAnalysis.marketPositioning.strengthAreas.slice(0, 3).map((area, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Industry Benchmarks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChartBar className="h-5 w-5 mr-2" />
              Industry Benchmarks
            </CardTitle>
            <CardDescription>
              How your metrics compare to {competitiveAnalysis.userProfile.industry} industry averages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Followers</span>
                  <div className="flex items-center">
                    {competitiveAnalysis.userProfile.followers >= competitiveAnalysis.industryBenchmarks.avgFollowers ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className="text-sm font-bold">
                      {((competitiveAnalysis.userProfile.followers / competitiveAnalysis.industryBenchmarks.avgFollowers - 1) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  You: {competitiveAnalysis.userProfile.followers.toLocaleString()} | 
                  Avg: {competitiveAnalysis.industryBenchmarks.avgFollowers.toLocaleString()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Engagement</span>
                  <div className="flex items-center">
                    {competitiveAnalysis.userProfile.engagement >= competitiveAnalysis.industryBenchmarks.avgEngagement ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className="text-sm font-bold">
                      {((competitiveAnalysis.userProfile.engagement / competitiveAnalysis.industryBenchmarks.avgEngagement - 1) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  You: {competitiveAnalysis.userProfile.engagement}% | 
                  Avg: {competitiveAnalysis.industryBenchmarks.avgEngagement}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Profile Score</span>
                  <div className="flex items-center">
                    {competitiveAnalysis.userProfile.profileScore >= competitiveAnalysis.industryBenchmarks.avgProfileScore ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className="text-sm font-bold">
                      {((competitiveAnalysis.userProfile.profileScore / competitiveAnalysis.industryBenchmarks.avgProfileScore - 1) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  You: {competitiveAnalysis.userProfile.profileScore} | 
                  Avg: {competitiveAnalysis.industryBenchmarks.avgProfileScore}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const CompetitiveGapAnalysis = () => {
    if (!competitiveAnalysis?.gapAnalysis) return null

    return (
      <div className="space-y-4">
        {competitiveAnalysis.gapAnalysis.map((gap, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize flex items-center">
                  {gap.category === 'followers' && <Users className="h-5 w-5 mr-2" />}
                  {gap.category === 'engagement' && <TrendUp className="h-5 w-5 mr-2" />}
                  {gap.category === 'content' && <ChatCircle className="h-5 w-5 mr-2" />}
                  {gap.category === 'skills' && <Brain className="h-5 w-5 mr-2" />}
                  {gap.category === 'optimization' && <Gauge className="h-5 w-5 mr-2" />}
                  {gap.category} Gap
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={gap.priority === 'high' ? 'destructive' : gap.priority === 'medium' ? 'default' : 'secondary'}>
                    {gap.priority} priority
                  </Badge>
                  <Badge variant="outline">
                    {gap.timeToImprove}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Score</p>
                    <p className="text-lg font-bold">{gap.currentValue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Industry Avg</p>
                    <p className="text-lg font-bold">{gap.benchmarkValue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gap</p>
                    <div className="flex items-center justify-center">
                      {gap.gap < 0 ? (
                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      ) : (
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      )}
                      <p className={`text-lg font-bold ${gap.gap < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {Math.abs(gap.gap)}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Recommended Action:</p>
                  <p className="text-sm text-muted-foreground">{gap.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const TopCompetitors = () => {
    if (!competitiveAnalysis?.competitors) return null

    const topCompetitors = competitiveAnalysis.competitors
      .sort((a, b) => b.followers - a.followers)
      .slice(0, 6)

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topCompetitors.map((competitor, index) => (
            <Card key={competitor.id} className="relative">
              {competitor.isInfluencer && (
                <Crown className="absolute top-4 right-4 h-5 w-5 text-yellow-500" />
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{competitor.name}</CardTitle>
                  <Badge variant={index < 2 ? 'default' : 'secondary'}>
                    #{index + 1}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {competitor.headline}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Followers</p>
                      <p className="font-semibold">{competitor.followers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Engagement</p>
                      <p className="font-semibold">{competitor.engagement}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Experience</p>
                      <p className="font-semibold">{competitor.experience} years</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Growth Rate</p>
                      <div className="flex items-center">
                        {competitor.growthRate >= 0 ? (
                          <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <p className={`font-semibold text-xs ${competitor.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {Math.abs(competitor.growthRate)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Key Strengths:</p>
                    <div className="flex flex-wrap gap-1">
                      {competitor.keyStrengths.slice(0, 3).map((strength, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Content Themes:</p>
                    <div className="flex flex-wrap gap-1">
                      {competitor.contentStrategy.slice(0, 2).map((theme, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const CompetitorInsights = () => {
    if (!competitiveAnalysis?.competitorInsights) return null

    return (
      <div className="space-y-4">
        {competitiveAnalysis.competitorInsights.slice(0, 4).map((insight, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Insights from {insight.competitorName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Key Takeaways:</p>
                  <div className="space-y-1">
                    {insight.keyTakeaways.slice(0, 3).map((takeaway, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Content Themes:</p>
                  <div className="flex flex-wrap gap-2">
                    {insight.contentThemes.map((theme, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Posting Pattern:</p>
                  <p className="text-sm text-muted-foreground">{insight.postingPatterns}</p>
                </div>

                {insight.uniqueStrategies.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Unique Strategies:</p>
                    <div className="space-y-1">
                      {insight.uniqueStrategies.slice(0, 2).map((strategy, idx) => (
                        <div key={idx} className="flex items-start">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strategy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const CompensationOverview = () => {
    if (!compensationAnalysis) return null

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CurrencyDollar className="h-5 w-5 mr-2" />
              Your Market Position
            </CardTitle>
            <CardDescription>
              Based on your skills, experience, and industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <CurrencyDollar className="h-6 w-6 text-primary mr-2" />
                  <span className="text-2xl font-bold">
                    ${compensationAnalysis.currentMarketPosition.estimatedSalaryRange.median.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Estimated Median</p>
                <Badge variant="secondary">
                  ${compensationAnalysis.currentMarketPosition.estimatedSalaryRange.min.toLocaleString()} - 
                  ${compensationAnalysis.currentMarketPosition.estimatedSalaryRange.max.toLocaleString()}
                </Badge>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <ChartBar className="h-6 w-6 text-accent mr-2" />
                  <span className="text-2xl font-bold">{compensationAnalysis.currentMarketPosition.percentileRanking}th</span>
                </div>
                <p className="text-sm text-muted-foreground">Percentile</p>
                <Badge variant={compensationAnalysis.currentMarketPosition.percentileRanking >= 70 ? 'default' : 'secondary'}>
                  {compensationAnalysis.currentMarketPosition.percentileRanking >= 80 ? 'Top performer' :
                   compensationAnalysis.currentMarketPosition.percentileRanking >= 60 ? 'Above average' :
                   compensationAnalysis.currentMarketPosition.percentileRanking >= 40 ? 'Average' : 'Below average'}
                </Badge>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <Brain className="h-6 w-6 text-green-500 mr-2" />
                  <span className="text-2xl font-bold">+{compensationAnalysis.currentMarketPosition.skillPremium}%</span>
                </div>
                <p className="text-sm text-muted-foreground">Skill Premium</p>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Above market
                </Badge>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">
                    {compensationAnalysis.currentMarketPosition.locationAdjustment >= 0 ? '+' : ''}
                    {compensationAnalysis.currentMarketPosition.locationAdjustment}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Location Adjustment</p>
                <Badge variant="outline">
                  {compensationAnalysis.userProfile.location}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChartLineUp className="h-5 w-5 mr-2" />
              Benchmark Comparison
            </CardTitle>
            <CardDescription>
              How your estimated compensation compares across different dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Industry Average', value: compensationAnalysis.benchmarkComparison.industryMedian, icon: Buildings },
                { label: 'Role Average', value: compensationAnalysis.benchmarkComparison.roleMedian, icon: Briefcase },
                { label: 'Location Average', value: compensationAnalysis.benchmarkComparison.locationMedian, icon: MapPin },
                { label: 'Experience Level', value: compensationAnalysis.benchmarkComparison.experienceMedian, icon: GraduationCap }
              ].map((benchmark, index) => {
                const variance = ((compensationAnalysis.benchmarkComparison.userEstimate - benchmark.value) / benchmark.value) * 100
                const Icon = benchmark.icon
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <p className="text-sm font-medium">{benchmark.label}</p>
                        <p className="text-sm text-muted-foreground">${benchmark.value.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {variance >= 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                      <Badge variant={variance >= 0 ? 'default' : 'secondary'}>
                        {variance >= 0 ? '+' : ''}{variance.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Skills Analysis Components
  const SkillsAnalysisOverview = () => {
    if (!skillsAnalysis) return null

    return (
      <div className="space-y-6">
        {/* Overall Skills Score */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Skills Portfolio Score
              </div>
              <div className="text-3xl font-bold text-primary">{skillsAnalysis.overallScore}/10</div>
            </CardTitle>
            <CardDescription>
              Comprehensive evaluation of your skill portfolio's market value and competitiveness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={skillsAnalysis.overallScore * 10} className="w-full mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-accent">{skillsAnalysis.marketAlignment.alignmentScore}/10</div>
                <p className="text-sm text-muted-foreground">Market Alignment</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-green-600">{skillsAnalysis.competitiveAdvantage.competitiveScore}/10</div>
                <p className="text-sm text-muted-foreground">Competitive Edge</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-600">{skillsAnalysis.competitiveAdvantage.rarityScore}/10</div>
                <p className="text-sm text-muted-foreground">Skill Rarity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillsAnalysis.categoryBreakdown.slice(0, 4).map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <div className="text-2xl mr-2">{category.icon}</div>
                    {category.category}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={category.marketDemand === 'very-high' || category.marketDemand === 'high' ? 'default' : 'secondary'}>
                      {category.marketDemand} demand
                    </Badge>
                    <div className="text-lg font-bold">{category.categoryScore}/10</div>
                  </div>
                </div>
                <CardDescription className="text-sm">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={category.categoryScore * 10} className="w-full mb-3" />
                  <div className="flex flex-wrap gap-2">
                    {category.skills.slice(0, 5).map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-1 ${
                          skill.marketValue >= 8 ? 'bg-green-500' :
                          skill.marketValue >= 6 ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></span>
                        {skill.name}
                      </Badge>
                    ))}
                    {category.skills.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{category.skills.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const SkillGapsAnalysis = () => {
    if (!skillsAnalysis?.skillGaps) return null

    return (
      <div className="space-y-4">
        {skillsAnalysis.skillGaps.map((gap, index) => (
          <Card key={index} className={`border-l-4 ${
            gap.priority === 'critical' ? 'border-l-red-500' :
            gap.priority === 'important' ? 'border-l-yellow-500' :
            gap.priority === 'beneficial' ? 'border-l-blue-500' : 'border-l-gray-400'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize">{gap.category} Skills</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    gap.priority === 'critical' ? 'destructive' :
                    gap.priority === 'important' ? 'default' : 'secondary'
                  }>
                    {gap.priority}
                  </Badge>
                  <Badge variant="outline">{gap.timeToAcquire}</Badge>
                  <Badge variant="outline" className={`${
                    gap.cost === 'free' ? 'bg-green-50 text-green-700' :
                    gap.cost === 'low' ? 'bg-blue-50 text-blue-700' :
                    gap.cost === 'medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {gap.cost} cost
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{gap.impact}</p>
                
                <div>
                  <p className="text-sm font-medium mb-2">Missing Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {gap.missingSkills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">ROI Score:</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      {gap.roi}/10
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    View Learning Path
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const LearningPathView = () => {
    if (!skillsAnalysis?.learningPath) return null

    const path = skillsAnalysis.learningPath

    return (
      <div className="space-y-6">
        {/* Learning Path Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Personalized Learning Path
            </CardTitle>
            <CardDescription>
              A structured approach to advance your skills and career
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <Clock className="h-6 w-6 mx-auto text-primary" />
                <div className="font-semibold">{path.totalDuration}</div>
                <p className="text-xs text-muted-foreground">Total Duration</p>
              </div>
              <div className="text-center space-y-2">
                <CurrencyDollar className="h-6 w-6 mx-auto text-green-600" />
                <div className="font-semibold">${path.estimatedCost.min}-${path.estimatedCost.max}</div>
                <p className="text-xs text-muted-foreground">Investment Range</p>
              </div>
              <div className="text-center space-y-2">
                <Gauge className="h-6 w-6 mx-auto text-blue-600" />
                <div className="font-semibold capitalize">{path.difficulty}</div>
                <p className="text-xs text-muted-foreground">Difficulty Level</p>
              </div>
              <div className="text-center space-y-2">
                <Calendar className="h-6 w-6 mx-auto text-purple-600" />
                <div className="font-semibold">{path.timeCommitment}</div>
                <p className="text-xs text-muted-foreground">Time Commitment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Phases */}
        <div className="space-y-4">
          {path.phases.map((phase, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    {phase.phase}
                  </CardTitle>
                  <Badge variant="outline">{phase.duration}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Skills to Develop:</p>
                    <div className="flex flex-wrap gap-2">
                      {phase.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Key Resources:</p>
                    <div className="space-y-2">
                      {phase.resources.slice(0, 3).map((resource, resourceIndex) => (
                        <div key={resourceIndex} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>{resource.title}</span>
                            <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                          </div>
                          <Badge variant={resource.cost === 'free' ? 'secondary' : 'outline'} className="text-xs">
                            {resource.cost}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Milestone Projects:</p>
                    <div className="space-y-1">
                      {phase.projects.slice(0, 2).map((project, projectIndex) => (
                        <div key={projectIndex} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {project.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        errorService.logError(error, 'React Error Boundary')
        if (CONFIG.ENABLE_DEBUG_MODE) {
          console.error('React Error Boundary caught error:', error, errorInfo)
        }
      }}
      onReset={() => {
        // Clear any problematic state
        setError('')
        setIsLoading(false)
        setShowScrapingManager(false)
        
        if (CONFIG.ENABLE_DEBUG_MODE) {
          console.log('🔄 Application reset after error')
        }
      }}
    >
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {CONFIG.APP_NAME}
            </h1>
            <p className="text-lg text-muted-foreground">
              Unlock insights from your LinkedIn profile and discover opportunities for professional growth
            </p>
            {CONFIG.ENABLE_DEBUG_MODE && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  v{CONFIG.APP_VERSION} • Debug Mode
                </Badge>
              </div>
            )}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MagnifyingGlass className="h-6 w-6 mr-2" />
                Analyze Your LinkedIn Profile
              </CardTitle>
              <CardDescription>
                Enter your LinkedIn profile URL or username to get comprehensive insights and growth recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="linkedin-url">LinkedIn Profile URL or Username</Label>
                    <Input
                      id="linkedin-url"
                      placeholder="linkedin.com/in/username or just username"
                      value={linkedinUrl}
                      onChange={handleInputChange}
                      className={`mt-1 ${!inputValidation.isValid ? 'border-destructive' : ''}`}
                      maxLength={CONFIG.MAX_INPUT_LENGTH}
                      disabled={isLoading}
                    />
                    {linkedinUrl && !inputValidation.isValid && (
                      <p className="text-sm text-destructive mt-1">
                        {inputValidation.error}
                      </p>
                    )}
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={analyzeProfile} 
                      disabled={isLoading || !inputValidation.isValid || !linkedinUrl.trim()}
                      className="px-6"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Lightning className="h-4 w-4 mr-2" />
                          Analyze Profile
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-blue-800">
                    <strong>Enhanced Analysis:</strong> Real-time profile scraping with accurate follower count estimation, 
                    skill market value analysis, industry-specific benchmarking, competitive analysis, 
                    salary & compensation insights, content strategy recommendations, and personalized growth opportunities 
                    based on your professional level and industry.
                  </AlertDescription>
                </Alert>
                
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <WarningCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {isLoading && <LoadingStateCard stage={analysisStage} />}

          {/* Real-time Scraping Manager */}
          {showScrapingManager && (
            <ScrapingManager 
              identifier={linkedInService.extractLinkedInUsername(linkedinUrl.trim()) || ''}
              onScrapingComplete={handleScrapingComplete}
              onScrapingError={handleScrapingError}
              autoStart={true}
            />
          )}

        {/* Profile Analysis Results */}
        {profileData && !isLoading && !showScrapingManager && (
          <div className="space-y-8">
            {/* Data Source & Quality Indicator */}
            {scrapingResult && (
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Data Source:</span>
                        <Badge variant="default">{scrapingResult.source}</Badge>
                      </div>
                      
                      {scrapingResult.confidence && (
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Confidence:</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {Math.round(scrapingResult.confidence * 100)}%
                          </Badge>
                        </div>
                      )}
                      
                      {profileData.dataFreshness && (
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Freshness:</span>
                          <Badge variant="secondary" className="capitalize">
                            {profileData.dataFreshness}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Updated {new Date(scrapingResult.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Profile Summary & Role Analysis */}
            {profileData.roleLevel && (
              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Professional Level</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default" className="capitalize">
                          {profileData.roleLevel.replace('_', ' ')}
                        </Badge>
                        {profileData.experience && (
                          <Badge variant="outline">
                            {profileData.experience} years exp.
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Network Size</p>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-semibold">
                          {profileData.followers.toLocaleString()} followers
                        </span>
                        {profileData.followerGrowthTrend && (
                          <Badge variant="outline" className={
                            profileData.followerGrowthTrend === 'increasing' ? 'text-green-700 border-green-200' :
                            profileData.followerGrowthTrend === 'stable' ? 'text-blue-700 border-blue-200' :
                            'text-orange-700 border-orange-200'
                          }>
                            {profileData.followerGrowthTrend === 'increasing' && <TrendUp className="h-3 w-3 mr-1" />}
                            {profileData.followerGrowthTrend === 'stable' && <Equals className="h-3 w-3 mr-1" />}
                            {profileData.followerGrowthTrend === 'decreasing' && <TrendDown className="h-3 w-3 mr-1" />}
                            {profileData.followerGrowthTrend}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Follower-to-connection ratio: {(profileData.followers / profileData.connections).toFixed(2)}x
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Activity Level</p>
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-accent" />
                        <span className="font-semibold capitalize">
                          {profileData.contentFrequency || 'unknown'} poster
                        </span>
                        <Badge variant="secondary">
                          {profileData.engagement}% engagement
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Profile Insights */}
            <ProfileInsightsCard />

            {/* Activity Metrics */}
            <ActivityMetricsCard />

            {/* Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Followers"
                value={profileData.followers.toLocaleString()}
                change={profileData.followerGrowthTrend === 'increasing' ? 12 : 
                        profileData.followerGrowthTrend === 'decreasing' ? -5 : 0}
                icon={Users}
              />
              <MetricCard
                title="Connections"
                value={profileData.connections.toLocaleString()}
                change={8}
                icon={Users}
              />
              <MetricCard
                title="Posts"
                value={profileData.posts}
                change={profileData.contentFrequency === 'daily' ? 25 :
                        profileData.contentFrequency === 'weekly' ? 10 :
                        profileData.contentFrequency === 'monthly' ? -2 : -8}
                icon={ChatCircle}
              />
              <MetricCard
                title="Engagement Rate"
                value={`${profileData.engagement}%`}
                change={profileData.followers < 1000 ? 15 : 
                        profileData.followers < 5000 ? 8 : 3}
                icon={TrendUp}
              />
            </div>

            {/* Skills Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-6 w-6 mr-2" />
                  Your Skills Portfolio
                </CardTitle>
                <CardDescription>
                  Core skills identified from your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      No skills identified
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Follower Benchmark Context */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartBar className="h-5 w-5 mr-2" />
                  LinkedIn Follower Benchmarks
                </CardTitle>
                <CardDescription>
                  How your follower count compares to industry standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Your Position:</p>
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl font-bold text-primary">
                          {profileData.followers.toLocaleString()}
                        </div>
                        <div className="space-y-1">
                          <Badge variant={
                            profileData.followers >= 15000 ? 'default' :
                            profileData.followers >= 5000 ? 'secondary' :
                            profileData.followers >= 1500 ? 'outline' : 'secondary'
                          }>
                            {profileData.followers >= 15000 ? 'Industry Leader' :
                             profileData.followers >= 5000 ? 'Established Professional' :
                             profileData.followers >= 1500 ? 'Active Professional' : 'Growing Professional'}
                          </Badge>
                          <p className="text-xs text-muted-foreground capitalize">
                            {profileData.roleLevel?.replace('_', ' ')} level
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-medium">Industry Context:</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Most professionals:</span>
                          <span>200-1,500</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Active professionals:</span>
                          <span>1,500-5,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Industry leaders:</span>
                          <span>5,000-15,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Influencers/Executives:</span>
                          <span>15,000+</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">
                        Your follower count is realistic for a {profileData.roleLevel?.replace('_', ' ')} in {profileData.industry}
                      </span>
                    </div>
                    {scrapingResult && (
                      <Badge variant="outline" className="text-xs">
                        {Math.round((scrapingResult.confidence || 0.75) * 100)}% confidence
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Optimization & Visual Branding */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Optimization Score</CardTitle>
                  <CardDescription>
                    Your current profile completeness and optimization level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Score</span>
                      <span className="text-sm font-medium">{profileData.profileScore}%</span>
                    </div>
                    <Progress value={profileData.profileScore} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      {profileData.profileScore >= 80 ? 'Excellent! Your profile is well-optimized.' :
                       profileData.profileScore >= 60 ? 'Good profile, but there\'s room for improvement.' :
                       'Your profile needs optimization to maximize visibility.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {visualBranding && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      Visual Branding
                    </CardTitle>
                    <CardDescription>
                      Profile photo and banner analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Profile Photo</span>
                        <Badge variant={visualBranding.hasPhoto ? 'default' : 'destructive'}>
                          {visualBranding.hasPhoto ? 'Present' : 'Missing'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Custom Banner</span>
                        <Badge variant={visualBranding.hasBanner ? 'default' : 'secondary'}>
                          {visualBranding.hasBanner ? 'Present' : 'Default'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Recommendations:</p>
                        <div className="space-y-1">
                          {visualBranding.recommendations.slice(0, 2).map((rec, index) => (
                            <p key={index} className="text-xs text-muted-foreground flex items-start">
                              <TrendUp className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                              {rec}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Tabs defaultValue="recommendations" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="recommendations">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="skills-analysis">
                  <Brain className="h-4 w-4 mr-2" />
                  Skills Analysis
                </TabsTrigger>
                <TabsTrigger value="skills">
                  <Brain className="h-4 w-4 mr-2" />
                  Skill Insights
                </TabsTrigger>
                <TabsTrigger value="trends">
                  <TrendUp className="h-4 w-4 mr-2" />
                  Trends
                </TabsTrigger>
                <TabsTrigger value="competitive">
                  <ChartBar className="h-4 w-4 mr-2" />
                  Competition
                </TabsTrigger>
                <TabsTrigger value="salary">
                  <CurrencyDollar className="h-4 w-4 mr-2" />
                  Salary
                </TabsTrigger>
                <TabsTrigger value="strategy">
                  <Target className="h-4 w-4 mr-2" />
                  Strategy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recommendations" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">AI-Powered Growth Recommendations</h3>
                  <p className="text-muted-foreground">
                    Personalized suggestions based on your skills and market opportunities.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {recommendations && recommendations.length > 0 ? (
                      recommendations.map((recommendation) => (
                        <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-muted-foreground py-8">
                        No recommendations available. Try analyzing a profile first.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skills-analysis" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold">Comprehensive Skills Analysis</h3>
                    <p className="text-muted-foreground">
                      Deep dive into your skill portfolio with market insights, gap analysis, and personalized learning paths.
                    </p>
                  </div>
                  
                  {skillsAnalysis ? (
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
                        <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
                        <TabsTrigger value="learning">Learning Path</TabsTrigger>
                        <TabsTrigger value="trends">Market Trends</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="mt-4">
                        <SkillsAnalysisOverview />
                      </TabsContent>
                      
                      <TabsContent value="gaps" className="mt-4">
                        <div className="space-y-4">
                          <h4 className="text-xl font-semibold">Critical Skill Gaps Analysis</h4>
                          <p className="text-muted-foreground">
                            Identify missing skills that could accelerate your career growth and increase your market value.
                          </p>
                          <SkillGapsAnalysis />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="learning" className="mt-4">
                        <div className="space-y-4">
                          <h4 className="text-xl font-semibold">Personalized Learning Journey</h4>
                          <p className="text-muted-foreground">
                            A structured roadmap to develop the skills that matter most for your career advancement.
                          </p>
                          <LearningPathView />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="trends" className="mt-4">
                        <div className="space-y-4">
                          <h4 className="text-xl font-semibold">Skills Market Intelligence</h4>
                          <p className="text-muted-foreground">
                            Current and future trends for your skills, competitive advantages, and market positioning insights.
                          </p>
                          
                          {skillsAnalysis.skillTrends && skillsAnalysis.skillTrends.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              {skillsAnalysis.skillTrends.slice(0, 6).map((trend, index) => (
                                <Card key={index}>
                                  <CardHeader>
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="text-lg">{trend.skill}</CardTitle>
                                      <div className="flex items-center space-x-2">
                                        <Badge variant={
                                          trend.trend === 'explosive' || trend.trend === 'growing' ? 'default' :
                                          trend.trend === 'stable' ? 'secondary' : 'destructive'
                                        }>
                                          {trend.trend}
                                        </Badge>
                                        <Badge variant="outline">
                                          {trend.trendScore > 0 ? '+' : ''}{trend.trendScore}
                                        </Badge>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="text-muted-foreground">Job Growth:</span>
                                          <div className="flex items-center">
                                            {trend.jobPostingsGrowth >= 0 ? (
                                              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                                            ) : (
                                              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                                            )}
                                            <span className={trend.jobPostingsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                                              {Math.abs(trend.jobPostingsGrowth)}%
                                            </span>
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Salary Trend:</span>
                                          <div className="flex items-center">
                                            {trend.salaryTrend >= 0 ? (
                                              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                                            ) : (
                                              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                                            )}
                                            <span className={trend.salaryTrend >= 0 ? 'text-green-600' : 'text-red-600'}>
                                              {Math.abs(trend.salaryTrend)}%
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {trend.geographic && trend.geographic.length > 0 && (
                                        <div>
                                          <p className="text-sm font-medium mb-2">Top Markets:</p>
                                          <div className="flex flex-wrap gap-1">
                                            {trend.geographic.slice(0, 3).map((geo, idx) => (
                                              <Badge key={idx} variant="secondary" className="text-xs">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {geo.location}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                          
                          {/* Competitive Advantage Summary */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Star className="h-5 w-5 mr-2" />
                                Your Competitive Advantages
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium mb-2">Unique Skills:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {skillsAnalysis.competitiveAdvantage.uniqueSkills.slice(0, 4).map((skill, idx) => (
                                        <Badge key={idx} variant="default" className="text-xs">
                                          <Crown className="h-3 w-3 mr-1" />
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-2">Power Combinations:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {skillsAnalysis.competitiveAdvantage.skillCombinations.slice(0, 3).map((combo, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                          {combo}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-sm font-medium mb-2">Key Differentiators:</p>
                                  <div className="space-y-1">
                                    {skillsAnalysis.competitiveAdvantage.differentiators.slice(0, 3).map((diff, idx) => (
                                      <div key={idx} className="flex items-start text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        {diff}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No skills analysis available. Try analyzing a profile first.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="skills" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Skill Market Analysis</h3>
                  <p className="text-muted-foreground">
                    Deep insights into your skills' market value and growth opportunities.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {skillInsights && skillInsights.length > 0 ? (
                      skillInsights.map((insight, index) => (
                        <SkillInsightCard key={index} insight={insight} />
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-muted-foreground py-8">
                        No skill insights available. Try analyzing a profile first.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Skill-Relevant Industry Trends</h3>
                  <p className="text-muted-foreground">
                    Trending topics specifically aligned with your skill set and expertise.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {trendingTopics && trendingTopics.length > 0 ? (
                      trendingTopics.map((trend, index) => (
                        <TrendCard key={index} trend={trend} />
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-muted-foreground py-8">
                        No trending topics available. Try analyzing a profile first.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="competitive" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold">Competitive Analysis</h3>
                    <p className="text-muted-foreground">
                      See how you stack up against industry peers and identify growth opportunities.
                    </p>
                  </div>
                  
                  {competitiveAnalysis ? (
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
                        <TabsTrigger value="competitors">Top Competitors</TabsTrigger>
                        <TabsTrigger value="insights">Insights</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="mt-4">
                        <CompetitiveAnalysisOverview />
                      </TabsContent>
                      
                      <TabsContent value="gaps" className="mt-4">
                        <div className="space-y-4">
                          <h4 className="text-xl font-semibold">Performance Gaps & Opportunities</h4>
                          <p className="text-muted-foreground">
                            Key areas where you can improve compared to industry benchmarks.
                          </p>
                          <CompetitiveGapAnalysis />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="competitors" className="mt-4">
                        <div className="space-y-4">
                          <h4 className="text-xl font-semibold">Top Performers in Your Industry</h4>
                          <p className="text-muted-foreground">
                            Leading professionals you can learn from and benchmark against.
                          </p>
                          <TopCompetitors />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="insights" className="mt-4">
                        <div className="space-y-4">
                          <h4 className="text-xl font-semibold">Competitive Intelligence</h4>
                          <p className="text-muted-foreground">
                            Strategic insights derived from analyzing top performers in your field.
                          </p>
                          <CompetitorInsights />
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No competitive analysis available. Try analyzing a profile first.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="salary" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold">Salary & Compensation Analysis</h3>
                    <p className="text-muted-foreground">
                      Comprehensive compensation insights based on your skills, experience, and market data.
                    </p>
                  </div>
                  
                  {compensationAnalysis ? (
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Market Position</TabsTrigger>
                        <TabsTrigger value="skills">Skill Impact</TabsTrigger>
                        <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="mt-4">
                        <CompensationOverview />
                      </TabsContent>
                      
                      <TabsContent value="skills" className="mt-4">
                        <div className="space-y-4">
                          <h4 className="text-xl font-semibold">Skill Impact on Salary</h4>
                          <p className="text-muted-foreground">
                            How your specific skills affect your earning potential in the current market.
                          </p>
                          
                          {compensationAnalysis.skillImpact && compensationAnalysis.skillImpact.length > 0 ? (
                            <div className="space-y-4">
                              {compensationAnalysis.skillImpact.slice(0, 6).map((skill, index) => (
                                <Card key={index}>
                                  <CardHeader>
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="text-lg flex items-center">
                                        <Brain className="h-5 w-5 mr-2" />
                                        {skill.skill}
                                      </CardTitle>
                                      <div className="flex items-center space-x-2">
                                        <Badge variant={skill.demandLevel === 'very-high' ? 'default' : 
                                                        skill.demandLevel === 'high' ? 'secondary' : 'outline'}>
                                          {skill.demandLevel} demand
                                        </Badge>
                                        <Badge variant="outline" className="bg-green-50 text-green-700">
                                          +{skill.salaryPremium}% premium
                                        </Badge>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Average Salary Increase:</span>
                                        <Badge variant="outline" className="bg-green-50 text-green-700">
                                          +${skill.avgSalaryIncrease.toLocaleString()}
                                        </Badge>
                                      </div>
                                      
                                      <div>
                                        <p className="text-sm font-medium mb-2">Top Paying Companies:</p>
                                        <div className="flex flex-wrap gap-2">
                                          {skill.topPayingCompanies.slice(0, 4).map((company, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                              <Buildings className="h-3 w-3 mr-1" />
                                              {company}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground py-8">
                              No skill impact data available yet.
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="benchmarks" className="mt-4">
                        <div className="space-y-4">
                          <h4 className="text-xl font-semibold">Industry Salary Benchmarks</h4>
                          <p className="text-muted-foreground">
                            Detailed compensation data for similar roles in your industry and location.
                          </p>
                          
                          {compensationAnalysis.industryBenchmarks && compensationAnalysis.industryBenchmarks.length > 0 ? (
                            <div className="space-y-4">
                              {compensationAnalysis.industryBenchmarks.slice(0, 8).map((benchmark, index) => (
                                <Card key={index}>
                                  <CardHeader>
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="text-lg flex items-center">
                                        <Briefcase className="h-5 w-5 mr-2" />
                                        {benchmark.role}
                                      </CardTitle>
                                      <div className="flex items-center space-x-2">
                                        <Badge variant="outline" className="capitalize">
                                          {benchmark.experience}
                                        </Badge>
                                        <Badge variant="secondary">
                                          {benchmark.location}
                                        </Badge>
                                        <Badge variant="outline" className="bg-green-50 text-green-700">
                                          +{benchmark.growthProjection}% growth
                                        </Badge>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm font-medium mb-1">Base Salary Range</p>
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                              <span className="text-muted-foreground">Min:</span>
                                              <span className="font-medium">${benchmark.baseSalary.min.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                              <span className="text-muted-foreground">Median:</span>
                                              <span className="font-semibold">${benchmark.baseSalary.median.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                              <span className="text-muted-foreground">Max:</span>
                                              <span className="font-medium">${benchmark.baseSalary.max.toLocaleString()}</span>
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <p className="text-sm font-medium mb-1">Total Compensation</p>
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                              <span className="text-muted-foreground">Min:</span>
                                              <span className="font-medium">${benchmark.totalComp.min.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                              <span className="text-muted-foreground">Median:</span>
                                              <span className="font-semibold">${benchmark.totalComp.median.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                              <span className="text-muted-foreground">Max:</span>
                                              <span className="font-medium">${benchmark.totalComp.max.toLocaleString()}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm">Equity Compensation:</span>
                                          <Badge variant={benchmark.equity.typical ? 'default' : 'outline'}>
                                            {benchmark.equity.typical ? `Yes (${benchmark.equity.value})` : 'Not typical'}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm">Annual Bonus:</span>
                                          <Badge variant={benchmark.bonus.typical ? 'default' : 'outline'}>
                                            {benchmark.bonus.typical ? `${benchmark.bonus.percentage}%` : 'Not typical'}
                                          </Badge>
                                        </div>
                                      </div>

                                      <div>
                                        <p className="text-sm font-medium mb-2">Key Skills:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {benchmark.skills.slice(0, 6).map((skill, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>

                                      <div>
                                        <p className="text-sm font-medium mb-2">Top Companies:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {benchmark.companies.slice(0, 4).map((company, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                              <Buildings className="h-3 w-3 mr-1" />
                                              {company}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground py-8">
                              No benchmark data available yet.
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No compensation analysis available. Try analyzing a profile first.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="strategy" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">Skill-Based Content Strategy</h3>
                  <p className="text-muted-foreground">
                    Strategic content recommendations based on your expertise and market positioning.
                  </p>
                  <Separator />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          Optimal Posting Times
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Tuesday - 10:00 AM</span>
                            <Badge variant="default">Peak</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Wednesday - 2:00 PM</span>
                            <Badge variant="secondary">Good</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Thursday - 9:00 AM</span>
                            <Badge variant="secondary">Good</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Trophy className="h-5 w-5 mr-2" />
                          Skill Showcase Opportunities
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="border-l-4 border-primary pl-3">
                            <p className="text-sm font-medium">Share Project Deep-Dives</p>
                            <p className="text-xs text-muted-foreground">Showcase technical expertise with detailed case studies</p>
                          </div>
                          <div className="border-l-4 border-accent pl-3">
                            <p className="text-sm font-medium">Industry Commentary</p>
                            <p className="text-xs text-muted-foreground">Position yourself as a thought leader in your field</p>
                          </div>
                          <div className="border-l-4 border-secondary pl-3">
                            <p className="text-sm font-medium">Learning Journey Posts</p>
                            <p className="text-xs text-muted-foreground">Document skill development and continuous learning</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Content Performance by Skill</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Technical Tutorials</span>
                            <span className="text-sm font-medium">High engagement</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Career Insights</span>
                            <span className="text-sm font-medium">Medium engagement</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Tool Reviews</span>
                            <span className="text-sm font-medium">High engagement</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Brain className="h-5 w-5 mr-2" />
                          Skill Monetization Ideas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Consulting Services</span>
                            <Badge variant="outline">High potential</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Online Course Creation</span>
                            <Badge variant="outline">Medium potential</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Speaking Engagements</span>
                            <Badge variant="outline">High potential</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
    <Toaster />
    </ErrorBoundary>
  )
}

export default App