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