import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain } from '@phosphor-icons/react'
import type { Recommendation } from '@/types/linkedin'

interface RecommendationCardProps {
  recommendation: Recommendation
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{recommendation.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={recommendation.priority === 'high' ? 'default' : 'secondary'}>
              {recommendation.priority}
            </Badge>
            <Badge variant="outline">
              {recommendation.category}
            </Badge>
            {recommendation.impactScore && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Impact: {recommendation.impactScore}/10
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-3">{recommendation.description}</p>
        
        {recommendation.relatedSkills && recommendation.relatedSkills.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-2">Related Skills:</p>
            <div className="flex flex-wrap gap-2">
              {recommendation.relatedSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Button variant="outline" size="sm">
          {recommendation.action}
        </Button>
      </CardContent>
    </Card>
  )
}