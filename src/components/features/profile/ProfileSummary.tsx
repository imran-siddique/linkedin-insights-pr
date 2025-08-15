import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, CircleNotch, TrendUp, TrendDown, Equals, Sparkle, LinkedinLogo, ArrowSquareOut } from '@phosphor-icons/react'
import type { ProfileData } from '@/types/linkedin'

interface ProfileSummaryProps {
  profileData: ProfileData
}

export function ProfileSummary({ profileData }: ProfileSummaryProps) {
  if (!profileData.roleLevel) return null

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendUp className="h-3 w-3 mr-1 text-green-600" />
      case 'stable':
        return <Equals className="h-3 w-3 mr-1 text-blue-600" />
      default:
        return <TrendDown className="h-3 w-3 mr-1 text-orange-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
      case 'stable':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
    }
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 backdrop-blur-sm">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-16 -left-16 w-32 h-32 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl"></div>
      
      <div className="p-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sparkle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Professional Overview</h2>
              <p className="text-sm text-muted-foreground">Key profile metrics and growth indicators</p>
            </div>
          </div>
          
          {/* LinkedIn Profile Link */}
          {profileData.linkedinUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              onClick={() => window.open(profileData.linkedinUrl, '_blank')}
            >
              <LinkedinLogo className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600">View on LinkedIn</span>
              <ArrowSquareOut className="h-3 w-3 text-blue-600" />
            </Button>
          )}
        </div>

        {/* Data Quality Indicator */}
        {(profileData.dataFreshness || profileData.confidenceScore) && (
          <div className="mb-6 p-3 bg-white/30 rounded-lg border border-white/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">Data Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                {profileData.dataFreshness && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      profileData.dataFreshness === 'real-time' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : profileData.dataFreshness === 'cached'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {profileData.dataFreshness}
                  </Badge>
                )}
                {profileData.confidenceScore && (
                  <Badge variant="secondary" className="text-xs">
                    {profileData.confidenceScore}% confidence
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Professional Level */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Professional Level
              </p>
            </div>
            <div className="space-y-3">
              <Badge 
                variant="default" 
                className="capitalize text-sm px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              >
                {profileData.roleLevel.replace('_', ' ')}
              </Badge>
              {profileData.experience && (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs bg-white/50 border-muted">
                    {profileData.experience} years experience
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Network Size */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Network Size
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Users className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {profileData.followers.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">followers</p>
                </div>
              </div>
              
              {profileData.followerGrowthTrend && (
                <Badge 
                  variant="outline" 
                  className={`text-xs transition-colors ${getTrendColor(profileData.followerGrowthTrend)}`}
                >
                  {getTrendIcon(profileData.followerGrowthTrend)}
                  {profileData.followerGrowthTrend}
                </Badge>
              )}
              
              <div className="text-xs text-muted-foreground bg-white/30 rounded-lg p-2">
                <span className="font-medium">Connection ratio:</span> {' '}
                {(profileData.followers / profileData.connections).toFixed(2)}x
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Activity Level
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CircleNotch className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground capitalize">
                    {profileData.contentFrequency || 'Unknown'} poster
                  </p>
                  <p className="text-xs text-muted-foreground">content frequency</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Badge 
                  variant="secondary" 
                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                >
                  {profileData.engagement}% engagement rate
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}