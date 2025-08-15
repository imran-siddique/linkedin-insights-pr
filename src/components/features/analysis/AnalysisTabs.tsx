import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lightbulb, Brain, TrendUp, ChartBar, CurrencyDollar } from '@phosphor-icons/react'
import { RecommendationsTab } from './tabs/RecommendationsTab'
import { SkillsAnalysisTab } from './tabs/SkillsAnalysisTab'
import { TrendsTab } from './tabs/TrendsTab'
import { CompetitiveTab } from './tabs/CompetitiveTab'
import { SalaryTab } from './tabs/SalaryTab'
import type {
  Recommendation,
  TrendingTopic,
  SkillInsight,
  CompetitiveAnalysis,
  CompensationAnalysis,
  SkillAnalysis
} from '@/types/linkedin'

interface AnalysisTabsProps {
  recommendations: Recommendation[]
  trendingTopics: TrendingTopic[]
  skillInsights: SkillInsight[]
  competitiveAnalysis: CompetitiveAnalysis | null
  compensationAnalysis: CompensationAnalysis | null
  skillsAnalysis: SkillAnalysis | null
}

export function AnalysisTabs({
  recommendations,
  trendingTopics,
  skillInsights,
  competitiveAnalysis,
  compensationAnalysis,
  skillsAnalysis
}: AnalysisTabsProps) {
  return (
    <Tabs defaultValue="recommendations" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="recommendations">
          <Lightbulb className="h-4 w-4 mr-2" />
          Recommendations
        </TabsTrigger>
        <TabsTrigger value="skills-analysis">
          <Brain className="h-4 w-4 mr-2" />
          Skills Analysis
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
      </TabsList>

      <TabsContent value="recommendations" className="mt-6">
        <RecommendationsTab recommendations={recommendations} />
      </TabsContent>

      <TabsContent value="skills-analysis" className="mt-6">
        <SkillsAnalysisTab skillsAnalysis={skillsAnalysis} />
      </TabsContent>

      <TabsContent value="trends" className="mt-6">
        <TrendsTab trendingTopics={trendingTopics} />
      </TabsContent>

      <TabsContent value="competitive" className="mt-6">
        <CompetitiveTab competitiveAnalysis={competitiveAnalysis} />
      </TabsContent>

      <TabsContent value="salary" className="mt-6">
        <SalaryTab compensationAnalysis={compensationAnalysis} />
      </TabsContent>
    </Tabs>
  )
}