import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, WarningCircle, Star, TrendUp } from '@phosphor-icons/react'
import type { ProfileInsights } from '@/types/linkedin'

interface ProfileInsightsCardsProps {
  profileInsights: ProfileInsights | null
}

export function ProfileInsightsCards({ profileInsights }: ProfileInsightsCardsProps) {
  if (!profileInsights) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-green-700">
            <CheckCircle className="h-5 w-5 mr-2" />
            Profile Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {profileInsights.strengths.map((strength, index) => (
              <div key={index} className="flex items-start">
                <Star className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700">
            <WarningCircle className="h-5 w-5 mr-2" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {profileInsights.improvements.map((improvement, index) => (
              <div key={index} className="flex items-start">
                <TrendUp className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{improvement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}