import React from 'react'
import { Separator } from '@/components/ui/separator'
import { TrendCard } from '@/components/features/cards/TrendCard'
import type { TrendingTopic } from '@/types/linkedin'

interface TrendsTabProps {
  trendingTopics: TrendingTopic[]
}

export function TrendsTab({ trendingTopics }: TrendsTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">Skill-Relevant Industry Trends</h3>
      <p className="text-muted-foreground">
        Trending topics specifically aligned with your skill set and expertise.
      </p>
      <Separator />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {trendingTopics && trendingTopics.length > 0 ? (
          trendingTopics.map((trend, index) => (
            <TrendCard key={index} trend={trend} />
          ))
        ) : (
          <div className="col-span-2 text-center text-muted-foreground py-8">
            No trending topics available. Try analyzing a profile first.
          </div>
        )}
      </div>
    </div>
  )
}