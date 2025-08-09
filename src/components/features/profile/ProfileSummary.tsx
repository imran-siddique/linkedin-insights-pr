import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Activity, TrendUp, TrendDown, Equals } from '@phosphor-icons/react'
import type { ProfileData } from '@/types/linkedin'

interface ProfileSummaryProps {
  profileData: ProfileData
}

export function ProfileSummary({ profileData }: ProfileSummaryProps) {
  if (!profileData.roleLevel) return null

  return (
    <Card className="border-l-4 border-l-accent">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Professional Level</p>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="capitalize">
                {profileData.roleLevel.replace('_', ' ')}
              </Badge>
              {profileData.experience && (
                <Badge variant="outline">
                  {profileData.experience} years exp.
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Network Size</p>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-semibold">
                {profileData.followers.toLocaleString()} followers
              </span>
              {profileData.followerGrowthTrend && (
                <Badge variant="outline" className={
                  profileData.followerGrowthTrend === 'increasing' ? 'text-green-700 border-green-200' :
                  profileData.followerGrowthTrend === 'stable' ? 'text-blue-700 border-blue-200' :
                  'text-orange-700 border-orange-200'
                }>
                  {profileData.followerGrowthTrend === 'increasing' && <TrendUp className="h-3 w-3 mr-1" />}
                  {profileData.followerGrowthTrend === 'stable' && <Equals className="h-3 w-3 mr-1" />}
                  {profileData.followerGrowthTrend === 'decreasing' && <TrendDown className="h-3 w-3 mr-1" />}
                  {profileData.followerGrowthTrend}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Follower-to-connection ratio: {(profileData.followers / profileData.connections).toFixed(2)}x
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Activity Level</p>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-accent" />
              <span className="font-semibold capitalize">
                {profileData.contentFrequency || 'unknown'} poster
              </span>
              <Badge variant="secondary">
                {profileData.engagement}% engagement
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}