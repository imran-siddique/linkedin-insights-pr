import React from 'react'
import { DataSourceIndicator } from './profile/DataSourceIndicator'
import { ProfileSummary } from './profile/ProfileSummary'
import { ProfileInsightsCards } from './profile/ProfileInsightsCards'
import { ActivityMetricsCard } from './profile/ActivityMetricsCard'
import { MetricCards } from './profile/MetricCards'
import { SkillsOverview } from './profile/SkillsOverview'
import { FollowerBenchmarkCard } from './profile/FollowerBenchmarkCard'
import { AnalysisTabs } from './analysis/AnalysisTabs'
import type {
  ProfileData,
  ScrapingResult,
  Recommendation,
  TrendingTopic,
  SkillInsight,
  ProfileInsights,
  ActivityMetrics,
  VisualBrandingAnalysis,
  CompetitiveAnalysis,
  CompensationAnalysis,
  SkillAnalysis
} from '@/types/linkedin'

interface ProfileDashboardProps {
  profileData: ProfileData
  scrapingResult: ScrapingResult | null
  recommendations: Recommendation[]
  trendingTopics: TrendingTopic[]
  skillInsights: SkillInsight[]
  profileInsights: ProfileInsights | null
  activityMetrics: ActivityMetrics | null
  visualBranding: VisualBrandingAnalysis | null
  competitiveAnalysis: CompetitiveAnalysis | null
  compensationAnalysis: CompensationAnalysis | null
  skillsAnalysis: SkillAnalysis | null
}

export function ProfileDashboard({
  profileData,
  scrapingResult,
  recommendations,
  trendingTopics,
  skillInsights,
  profileInsights,
  activityMetrics,
  visualBranding,
  competitiveAnalysis,
  compensationAnalysis,
  skillsAnalysis
}: ProfileDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Data Source & Quality Indicator */}
      <DataSourceIndicator scrapingResult={scrapingResult} profileData={profileData} />

      {/* Profile Summary & Role Analysis */}
      <ProfileSummary profileData={profileData} />
      
      {/* Profile Insights */}
      <ProfileInsightsCards profileInsights={profileInsights} />

      {/* Activity Metrics */}
      <ActivityMetricsCard activityMetrics={activityMetrics} />

      {/* Main Metrics & Profile Score */}
      <MetricCards profileData={profileData} />

      {/* Skills Overview */}
      <SkillsOverview profileData={profileData} />

      {/* Follower Benchmark Context */}
      <FollowerBenchmarkCard profileData={profileData} scrapingResult={scrapingResult} />

      {/* Analysis Tabs */}
      <AnalysisTabs
        recommendations={recommendations}
        trendingTopics={trendingTopics}
        skillInsights={skillInsights}
        competitiveAnalysis={competitiveAnalysis}
        compensationAnalysis={compensationAnalysis}
        skillsAnalysis={skillsAnalysis}
      />
    </div>
  )
}