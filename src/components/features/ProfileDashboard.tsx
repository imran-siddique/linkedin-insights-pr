import React from 'react'
import { DataSourceIndicator } from './profile/DataSourceIndicator'
import { ProfileSummary } from './profile/ProfileSummary'
import { ProfileInsightsCards } from './profile/ProfileInsightsCards'
import { ActivityMetricsCard } from './profile/ActivityMetricsCard'
import { MetricCards } from './profile/MetricCards'
import { SkillsOverview } from './profile/SkillsOverview'
import { FollowerBenchmarkCard } from './profile/FollowerBenchmarkCard'
import { AnalysisTabs } from './analysis/AnalysisTabs'
import { StaggerContainer, StaggerItem } from '@/components/ui/animated-container'
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
    <StaggerContainer stagger={0.15} className="space-y-12">
      {/* Data Source & Quality Indicator */}
      <StaggerItem>
        <DataSourceIndicator scrapingResult={scrapingResult} profileData={profileData} />
      </StaggerItem>

      {/* Profile Summary & Role Analysis */}
      <StaggerItem>
        <ProfileSummary profileData={profileData} />
      </StaggerItem>
      
      {/* Profile Insights */}
      <StaggerItem>
        <ProfileInsightsCards profileInsights={profileInsights} />
      </StaggerItem>

      {/* Activity Metrics */}
      <StaggerItem>
        <ActivityMetricsCard activityMetrics={activityMetrics} />
      </StaggerItem>

      {/* Main Metrics & Profile Score */}
      <StaggerItem>
        <MetricCards profileData={profileData} />
      </StaggerItem>

      {/* Skills Overview */}
      <StaggerItem>
        <SkillsOverview profileData={profileData} />
      </StaggerItem>

      {/* Follower Benchmark Context */}
      <StaggerItem>
        <FollowerBenchmarkCard profileData={profileData} scrapingResult={scrapingResult} />
      </StaggerItem>

      {/* Analysis Tabs */}
      <StaggerItem>
        <AnalysisTabs
          recommendations={recommendations}
          trendingTopics={trendingTopics}
          skillInsights={skillInsights}
          competitiveAnalysis={competitiveAnalysis}
          compensationAnalysis={compensationAnalysis}
          skillsAnalysis={skillsAnalysis}
        />
      </StaggerItem>
    </StaggerContainer>
  )
}