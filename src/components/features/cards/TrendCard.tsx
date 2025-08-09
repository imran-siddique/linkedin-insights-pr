import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Hash, ArrowSquareOut } from '@phosphor-icons/react'
import type { TrendingTopic } from '@/types/linkedin'

interface TrendCardProps {
  trend: TrendingTopic
}

export function TrendCard({ trend }: TrendCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Hash className="h-5 w-5 mr-2" />
            {trend.topic}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {trend.relevanceScore}/10
            </Badge>
            <Badge variant={trend.marketDemand === 'high' ? 'default' : 'outline'}>
              {trend.marketDemand} demand
            </Badge>
            {trend.competitionLevel && (
              <Badge variant="outline" className={
                trend.competitionLevel === 'low' ? 'bg-green-50 text-green-700' :
                trend.competitionLevel === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              }>
                {trend.competitionLevel} competition
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Difficulty:</span>
              <Badge variant="outline" className={
                trend.difficulty === 'beginner' ? 'bg-green-50 text-green-700' :
                trend.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              }>
                {trend.difficulty}
              </Badge>
            </div>
            
            {trend.estimatedReach && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Est. Reach:</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {trend.estimatedReach.toLocaleString()}
                </Badge>
              </div>
            )}
          </div>
          
          {trend.relatedSkills && trend.relatedSkills.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Relevant Skills:</p>
              <div className="flex flex-wrap gap-1">
                {trend.relatedSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {trend.hashtags && trend.hashtags.length > 0 ? (
              trend.hashtags.map((hashtag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{hashtag}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                No hashtags available
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">{trend.suggestedAction}</p>
          <Button variant="outline" size="sm">
            <ArrowSquareOut className="h-4 w-4 mr-2" />
            Explore Topic
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}