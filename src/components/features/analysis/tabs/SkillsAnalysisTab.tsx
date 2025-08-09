import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { SkillAnalysis } from '@/types/linkedin'

interface SkillsAnalysisTabProps {
  skillsAnalysis: SkillAnalysis | null
}

export function SkillsAnalysisTab({ skillsAnalysis }: SkillsAnalysisTabProps) {
  if (!skillsAnalysis) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No skills analysis available. Try analyzing a profile first.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold">Comprehensive Skills Analysis</h3>
        <p className="text-muted-foreground">
          Deep dive into your skill portfolio with market insights, gap analysis, and personalized learning paths.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
          <TabsTrigger value="learning">Learning Path</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="text-center text-muted-foreground py-8">
            Skills portfolio overview component to be implemented
          </div>
        </TabsContent>
        
        <TabsContent value="gaps" className="mt-4">
          <div className="text-center text-muted-foreground py-8">
            Skill gaps analysis component to be implemented
          </div>
        </TabsContent>
        
        <TabsContent value="learning" className="mt-4">
          <div className="text-center text-muted-foreground py-8">
            Learning path component to be implemented
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-4">
          <div className="text-center text-muted-foreground py-8">
            Market trends component to be implemented
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}