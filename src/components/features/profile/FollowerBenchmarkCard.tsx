import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ChartBar, Info } from '@phosphor-icons/react'
import type { ProfileData, ScrapingResult } from '@/types/linkedin'

interface FollowerBenchmarkCardProps {
  profileData: ProfileData
  scrapingResult: ScrapingResult | null
}

export function FollowerBenchmarkCard({ profileData, scrapingResult }: FollowerBenchmarkCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ChartBar className="h-5 w-5 mr-2" />
          LinkedIn Follower Benchmarks
        </CardTitle>
        <CardDescription>
          How your follower count compares to industry standards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-sm font-medium">Your Position:</p>
              <div className="flex items-center space-x-3">
                <div className="text-2xl font-bold text-primary">
                  {profileData.followers.toLocaleString()}
                </div>
                <div className="space-y-1">
                  <Badge variant={
                    profileData.followers >= 15000 ? 'default' :
                    profileData.followers >= 5000 ? 'secondary' :
                    profileData.followers >= 1500 ? 'outline' : 'secondary'
                  }>
                    {profileData.followers >= 15000 ? 'Industry Leader' :
                     profileData.followers >= 5000 ? 'Established Professional' :
                     profileData.followers >= 1500 ? 'Active Professional' : 'Growing Professional'}
                  </Badge>
                  <p className="text-xs text-muted-foreground capitalize">
                    {profileData.roleLevel?.replace('_', ' ')} level
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Industry Context:</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Most professionals:</span>
                  <span>200-1,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active professionals:</span>
                  <span>1,500-5,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Industry leaders:</span>
                  <span>5,000-15,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Influencers/Executives:</span>
                  <span>15,000+</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">
                Your follower count is realistic for a {profileData.roleLevel?.replace('_', ' ')} in {profileData.industry}
              </span>
            </div>
            {scrapingResult && (
              <Badge variant="outline" className="text-xs">
                {Math.round((scrapingResult.confidence || 0.75) * 100)}% confidence
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}