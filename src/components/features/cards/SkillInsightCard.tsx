import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, BookOpen, Star } from '@phosphor-icons/react'
import type { SkillInsight } from '@/types/linkedin'

interface SkillInsightCardProps {
  insight: SkillInsight
}

export function SkillInsightCard({ insight }: SkillInsightCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            {insight.skill}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={insight.marketDemand === 'high' ? 'default' : 'secondary'}>
              {insight.marketDemand} demand
            </Badge>
            <Badge variant={insight.growth === 'growing' ? 'default' : 'outline'} className={
              insight.growth === 'growing' ? 'bg-green-100 text-green-800' :
              insight.growth === 'stable' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }>
              {insight.growth}
            </Badge>
            {insight.demandScore && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                Score: {insight.demandScore}/100
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Salary Impact:</span>
              <Badge variant="outline" className={
                insight.salary_impact === 'high' ? 'bg-green-50 text-green-700' :
                insight.salary_impact === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                'bg-gray-50 text-gray-700'
              }>
                {insight.salary_impact}
              </Badge>
            </div>
            
            {insight.averageSalaryIncrease && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg. Increase:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {insight.averageSalaryIncrease}
                </Badge>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Learning Resources:</p>
            <div className="space-y-1">
              {insight.learning_resources && insight.learning_resources.length > 0 ? (
                insight.learning_resources.slice(0, 3).map((resource, index) => (
                  <div key={index} className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {resource}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No resources available</div>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Related Opportunities:</p>
            <div className="space-y-1">
              {insight.related_opportunities && insight.related_opportunities.length > 0 ? (
                insight.related_opportunities.slice(0, 2).map((opportunity, index) => (
                  <div key={index} className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 mr-2" />
                    {opportunity}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No opportunities available</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}