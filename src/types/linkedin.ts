export interface ProfileData {
  name: string
  headline: string
  followers: number
  connections: number
  posts: number
  engagement: number
  profileScore: number
  industry: string
  skills: string[]
  experience: number // years of experience
  location?: string
  summary?: string
  profilePhotoUrl?: string
  bannerImageUrl?: string
  hasPhoto?: boolean
  hasBanner?: boolean
  lastActive?: string
  verificationLevel?: 'basic' | 'standard' | 'premium'
  contentFrequency?: 'daily' | 'weekly' | 'monthly' | 'rarely'
  networkGrowthRate?: number
  // Enhanced profiling fields
  roleLevel?: 'individual' | 'manager' | 'director' | 'executive' | 'founder'
  followerGrowthTrend?: 'increasing' | 'stable' | 'decreasing'
  // Real-time scraping metadata
  lastUpdated?: string
  scrapedAt?: number
  dataFreshness?: 'real-time' | 'cached' | 'estimated'
  confidenceScore?: number
  trending?: boolean
  recentActivitySpike?: boolean
  networkVelocity?: number
}

export interface Recommendation {
  id: string
  category: 'content' | 'networking' | 'optimization' | 'skills'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  action: string
  relatedSkills?: string[]
  impactScore: number
}

export interface TrendingTopic {
  topic: string
  relevanceScore: number
  hashtags: string[]
  suggestedAction: string
  relatedSkills: string[]
  marketDemand: 'high' | 'medium' | 'low'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedReach?: number
  competitionLevel?: 'low' | 'medium' | 'high'
}

export interface SkillInsight {
  skill: string
  marketDemand: 'high' | 'medium' | 'low'
  growth: 'growing' | 'stable' | 'declining'
  salary_impact: 'high' | 'medium' | 'low'
  learning_resources: string[]
  related_opportunities: string[]
  demandScore?: number
  averageSalaryIncrease?: string
}

export interface ProfileInsights {
  strengths: string[]
  improvements: string[]
  contentSuggestions: string[]
  networkingTips: string[]
  skillRecommendations: string[]
}

export interface ActivityMetrics {
  avgPostsPerWeek: number
  engagementTrend: 'increasing' | 'decreasing' | 'stable'
  bestPostingDays: string[]
  bestPostingTimes: string[]
  audienceGrowth: number
  contentTypes: Array<{
    type: string
    performance: 'high' | 'medium' | 'low'
  }>
}

export interface VisualBrandingAnalysis {
  hasPhoto: boolean
  hasBanner: boolean
  recommendations: string[]
  photoQualityScore?: number
  bannerRelevanceScore?: number
}

export interface CompetitorAnalysis {
  industry: string
  averageFollowers: number
  averageEngagement: number
  topPerformers: Array<{
    name: string
    followers: number
    engagement: number
    keyStrengths: string[]
  }>
  benchmarkMetrics: {
    followers: 'above' | 'average' | 'below'
    engagement: 'above' | 'average' | 'below'
    postFrequency: 'above' | 'average' | 'below'
  }
}

export interface ContentStrategy {
  suggestedTopics: string[]
  optimalPostingSchedule: Array<{
    day: string
    times: string[]
    contentType: string
  }>
  hashtagRecommendations: string[]
  contentMix: Array<{
    type: string
    percentage: number
    description: string
  }>
}

export interface NetworkingOpportunities {
  suggestedConnections: Array<{
    title: string
    reason: string
    industry: string
    connectionType: 'peer' | 'mentor' | 'potential_client' | 'industry_leader'
  }>
  events: Array<{
    name: string
    type: 'conference' | 'webinar' | 'networking' | 'workshop'
    relevance: number
    date?: string
  }>
  groups: Array<{
    name: string
    memberCount: number
    relevance: number
    focus: string
  }>
}

export interface CompetitiveProfile {
  id: string
  name: string
  headline: string
  followers: number
  connections: number
  engagement: number
  posts: number
  industry: string
  skills: string[]
  experience: number
  profileScore: number
  keyStrengths: string[]
  contentStrategy: string[]
  isInfluencer: boolean
  growthRate: number // percentage
}

export interface SalaryBenchmark {
  role: string
  experience: 'entry' | 'mid' | 'senior' | 'executive'
  location: string
  industry: string
  baseSalary: {
    min: number
    median: number
    max: number
  }
  totalComp: {
    min: number
    median: number
    max: number
  }
  equity: {
    typical: boolean
    value?: string
  }
  bonus: {
    typical: boolean
    percentage?: number
  }
  skills: string[]
  companies: string[]
  growthProjection: number // percentage
}

export interface CompensationAnalysis {
  userProfile: {
    estimatedRole: string
    experienceLevel: 'entry' | 'mid' | 'senior' | 'executive'
    location: string
    skills: string[]
  }
  currentMarketPosition: {
    estimatedSalaryRange: {
      min: number
      median: number
      max: number
    }
    percentileRanking: number
    skillPremium: number // additional percentage for rare skills
    locationAdjustment: number // cost of living adjustment
  }
  benchmarkComparison: {
    industryMedian: number
    roleMedian: number
    locationMedian: number
    experienceMedian: number
    userEstimate: number
    variance: number // percentage difference from median
  }
  skillImpact: Array<{
    skill: string
    salaryPremium: number // percentage increase
    demandLevel: 'very-high' | 'high' | 'moderate' | 'low'
    avgSalaryIncrease: number
    topPayingCompanies: string[]
  }>
  careerProgression: Array<{
    nextRole: string
    timeframe: string
    salaryIncrease: number
    requiredSkills: string[]
    certifications: string[]
    growthPath: string
  }>
  geographicOpportunities: Array<{
    location: string
    costOfLivingIndex: number
    averageSalary: number
    jobMarketHealth: 'excellent' | 'good' | 'moderate' | 'challenging'
    topCompanies: string[]
    livingStandard: 'higher' | 'similar' | 'lower'
  }>
  negotiationInsights: {
    leveragePoints: string[]
    marketTrends: string[]
    timingAdvice: string
    researchTips: string[]
  }
  industryBenchmarks: SalaryBenchmark[]
}

export interface CompetitiveAnalysis {
  userProfile: ProfileData
  competitors: CompetitiveProfile[]
  industryBenchmarks: {
    avgFollowers: number
    avgEngagement: number
    avgPostsPerMonth: number
    avgConnections: number
    avgProfileScore: number
  }
  userRanking: {
    followers: { rank: number, percentile: number }
    engagement: { rank: number, percentile: number }
    profileScore: { rank: number, percentile: number }
    overallScore: { rank: number, percentile: number }
  }
  gapAnalysis: Array<{
    category: 'followers' | 'engagement' | 'content' | 'skills' | 'optimization'
    currentValue: number
    benchmarkValue: number
    gap: number
    recommendation: string
    priority: 'high' | 'medium' | 'low'
    timeToImprove: string
  }>
  competitorInsights: Array<{
    competitorName: string
    keyTakeaways: string[]
    contentThemes: string[]
    postingPatterns: string
    uniqueStrategies: string[]
  }>
  marketPositioning: {
    currentPosition: 'leader' | 'challenger' | 'follower' | 'niche'
    strengthAreas: string[]
    opportunityAreas: string[]
    threats: string[]
    recommendedPosition: string
  }
}

// Real-time scraping interfaces
export interface RateLimitConfig {
  requestsPerMinute?: number
  requestsPerHour?: number
  requestsPerDay?: number
  backoffMultiplier?: number
  maxBackoffTime?: number
}

export interface ScrapingSession {
  id: string
  identifier: string
  startTime: number
  status: 'active' | 'completed' | 'failed' | 'rate-limited'
  currentStrategy?: string
  attempts?: number
  strategies?: string[]
  result?: ScrapingResult
  error?: string
}

export interface ScrapingResult {
  success: boolean
  data?: ProfileData
  error?: string
  source: 'public-api' | 'website-scraping' | 'ai-analysis' | 'pattern-analysis' | 'cache' | 'scraper'
  confidence?: number
  timestamp: number
  sessionId?: string
  rateLimitInfo?: {
    remainingRequests: number
    resetTime: number
    currentWindow: string
  }
}

export interface ScrapingStats {
  totalRequests: number
  successfulScrapes: number
  failedScrapes: number
  averageResponseTime: number
  cacheHitRate: number
  rateLimitHits: number
  strategiesUsed: Record<string, number>
}