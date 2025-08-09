import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { linkedInService } from '@/lib/linkedin-api'
import { skillsAnalysisService } from '@/lib/skills-analysis'
import { errorService, safeAsync } from '@/lib/errorHandling'
import { validation, security } from '@/lib/security'
import { profileCache, analysisCache, cacheUtils } from '@/lib/cache'
import { CONFIG } from '@/lib/config'
import type {
  ProfileData,
  Recommendation,
  TrendingTopic,
  SkillInsight,
  ProfileInsights,
  ActivityMetrics,
  VisualBrandingAnalysis,
  CompetitiveAnalysis,
  CompensationAnalysis,
  SkillAnalysis,
  ScrapingResult
} from '@/types/linkedin'

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

export function useProfileAnalysis() {
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
  const [isLoading, setIsLoading] = useState(false)
  const [analysisStage, setAnalysisStage] = useState('')
  const [scrapingResult, setScrapingResult] = useState<ScrapingResult | null>(null)
  const [showScrapingManager, setShowScrapingManager] = useState(false)

  const analyzeProfile = useCallback(async (linkedinUrl: string) => {
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
  }, [lastAnalysisTime, setLastAnalysisTime])

  const handleScrapingComplete = useCallback(async (result: ScrapingResult) => {
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
  }, [setProfileData])

  const handleScrapingError = useCallback((errorMessage: string) => {
    errorService.logError(new Error(errorMessage), 'Scraping Process')
    setError(`Scraping failed: ${errorMessage}`)
    setIsLoading(false)
    setShowScrapingManager(false)
    toast.error('Profile scraping failed.')
  }, [])

  const performAIAnalysis = async (profileData: ProfileData) => {
    try {
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
          const insights = await linkedInService.getProfileInsights('unknown', profileData)
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
          const branding = await linkedInService.analyzeVisualBranding('unknown')
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

    } catch (error: any) {
      errorService.logError(error, 'AI Analysis Pipeline')
      errorService.logWarning('Some AI analysis steps failed, but profile data is available', 'Analysis Pipeline')
    }
  }

  return {
    profileData,
    recommendations,
    trendingTopics,
    skillInsights,
    profileInsights,
    activityMetrics,
    visualBranding,
    competitiveAnalysis,
    compensationAnalysis,
    skillsAnalysis,
    scrapingResult,
    isLoading,
    error,
    analysisStage,
    showScrapingManager,
    analyzeProfile,
    handleScrapingComplete,
    handleScrapingError
  }
}