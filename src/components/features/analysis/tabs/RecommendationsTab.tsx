import React from 'react'
import { Separator } from '@/components/ui/separator'
import { RecommendationCard } from '@/components/features/cards/RecommendationCard'
import type { Recommendation } from '@/types/linkedin'

interface RecommendationsTabProps {
  recommendations: Recommendation[]
}

export function RecommendationsTab({ recommendations }: RecommendationsTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">AI-Powered Growth Recommendations</h3>
      <p className="text-muted-foreground">
        Personalized suggestions based on your skills and market opportunities.
      </p>
      <Separator />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))
        ) : (
          <div className="col-span-2 text-center text-muted-foreground py-8">
            No recommendations available. Try analyzing a profile first.
          </div>
        )}
      </div>
    </div>
  )
}