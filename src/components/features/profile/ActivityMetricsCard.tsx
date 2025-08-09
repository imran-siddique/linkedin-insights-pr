import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, TrendUp, TrendDown } from '@phosphor-icons/react'
import type { ActivityMetrics } from '@/types/linkedin'

interface ActivityMetricsCardProps {
  activityMetrics: ActivityMetrics | null
}

export function ActivityMetricsCard({ activityMetrics }: ActivityMetricsCardProps) {
  if (!activityMetrics) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Activity & Engagement Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Posting Frequency</p>
            <p className="text-2xl font-bold text-primary">{activityMetrics.avgPostsPerWeek}</p>
            <p className="text-xs text-muted-foreground">posts per week</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Engagement Trend</p>
            <div className="flex items-center">
              {activityMetrics.engagementTrend === 'increasing' ? (
                <TrendUp className="h-5 w-5 text-green-500 mr-1" />
              ) : (
                <TrendDown className="h-5 w-5 text-gray-500 mr-1" />
              )}
              <span className="text-sm font-medium capitalize">{activityMetrics.engagementTrend}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Monthly Growth</p>
            <p className="text-2xl font-bold text-primary">+{activityMetrics.audienceGrowth}</p>
            <p className="text-xs text-muted-foreground">followers</p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-3">
          <p className="text-sm font-medium">Best Posting Times</p>
          <div className="flex flex-wrap gap-2">
            {activityMetrics.bestPostingTimes.map((time, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {time}
              </Badge>
            ))}
          </div>
          
          <p className="text-sm font-medium mt-3">Best Posting Days</p>
          <div className="flex flex-wrap gap-2">
            {activityMetrics.bestPostingDays.map((day, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {day}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}