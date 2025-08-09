import React from 'react'
import { Separator } from '@/components/ui/separator'
import { SkillInsightCard } from '@/components/features/cards/SkillInsightCard'
import type { SkillInsight } from '@/types/linkedin'

interface SkillInsightsTabProps {
  skillInsights: SkillInsight[]
}

export function SkillInsightsTab({ skillInsights }: SkillInsightsTabProps) {
  return (
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
  )
}