import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CompetitiveAnalysis } from '@/types/linkedin'

interface CompetitiveTabProps {
  competitiveAnalysis: CompetitiveAnalysis | null
}

export function CompetitiveTab({ competitiveAnalysis }: CompetitiveTabProps) {
  if (!competitiveAnalysis) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No competitive analysis available. Try analyzing a profile first.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold">Competitive Analysis</h3>
        <p className="text-muted-foreground">
          See how you stack up against industry peers and identify growth opportunities.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
          <TabsTrigger value="competitors">Top Competitors</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="text-center text-muted-foreground py-8">
            Competitive overview component to be implemented
          </div>
        </TabsContent>
        
        <TabsContent value="gaps" className="mt-4">
          <div className="text-center text-muted-foreground py-8">
            Gap analysis component to be implemented
          </div>
        </TabsContent>
        
        <TabsContent value="competitors" className="mt-4">
          <div className="text-center text-muted-foreground py-8">
            Top competitors component to be implemented
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-4">
          <div className="text-center text-muted-foreground py-8">
            Competitive insights component to be implemented
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}