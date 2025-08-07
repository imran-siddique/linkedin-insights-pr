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
  experience: number
  location?: string
  summary?: string
  profilePhotoUrl?: string
  bannerImageUrl?: string
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
  growthRate: number
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
  growthProjection: number
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
    skillPremium: number
    locationAdjustment: number
  }
  benchmarkComparison: {
    industryMedian: number
    roleMedian: number
    locationMedian: number
    experienceMedian: number
    userEstimate: number
    variance: number
  }
  skillImpact: Array<{
    skill: string
    salaryPremium: number
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

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

// Request types
export interface AnalyzeProfileRequest {
  linkedinUrl: string
}

export interface GenerateRecommendationsRequest {
  profileData: ProfileData
}

export interface SkillInsightsRequest {
  skills: string[]
  experience: number
  industry: string
}

export interface TrendingTopicsRequest {
  profileData: ProfileData
}