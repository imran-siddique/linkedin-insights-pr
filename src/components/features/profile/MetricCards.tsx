import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Users, ChatCircle, TrendUp } from '@phosphor-icons/react'
import type { ProfileData } from '@/types/linkedin'

interface MetricCardsProps {
  profileData: ProfileData
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
}

const MetricCard = ({ title, value, change, icon: Icon }: MetricCardProps) => (
  <Card>
    <CardContent className="flex items-center p-6">
      <div className="flex items-center space-x-4 w-full">
        <Icon className="h-8 w-8 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change !== undefined && (
            <div className="flex items-center text-sm">
              {change >= 0 ? (
                <TrendUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />
              )}
              <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)

export function MetricCards({ profileData }: MetricCardsProps) {
  return (
    <>
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Followers"
          value={profileData.followers.toLocaleString()}
          change={profileData.followerGrowthTrend === 'increasing' ? 12 : 
                  profileData.followerGrowthTrend === 'decreasing' ? -5 : 0}
          icon={Users}
        />
        <MetricCard
          title="Connections"
          value={profileData.connections.toLocaleString()}
          change={8}
          icon={Users}
        />
        <MetricCard
          title="Posts"
          value={profileData.posts}
          change={profileData.contentFrequency === 'daily' ? 25 :
                  profileData.contentFrequency === 'weekly' ? 10 :
                  profileData.contentFrequency === 'monthly' ? -2 : -8}
          icon={ChatCircle}
        />
        <MetricCard
          title="Engagement Rate"
          value={`${profileData.engagement}%`}
          change={profileData.followers < 1000 ? 15 : 
                  profileData.followers < 5000 ? 8 : 3}
          icon={TrendUp}
        />
      </div>

      {/* Profile Optimization Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Optimization Score</CardTitle>
            <CardDescription>
              Your current profile completeness and optimization level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Score</span>
                <span className="text-sm font-medium">{profileData.profileScore}%</span>
              </div>
              <Progress value={profileData.profileScore} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {profileData.profileScore >= 80 ? 'Excellent! Your profile is well-optimized.' :
                 profileData.profileScore >= 60 ? 'Good profile, but there\'s room for improvement.' :
                 'Your profile needs optimization to maximize visibility.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}