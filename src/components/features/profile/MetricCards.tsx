import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, ChatCircle, TrendUp, Target, ArrowUp, ArrowDown, ArrowSquareOut } from '@phosphor-icons/react'
import { StaggerContainer, StaggerItem } from '@/components/ui/animated-container'
import type { ProfileData } from '@/types/linkedin'
import { getLinkedInSectionUrl } from '@/lib/utils'

interface MetricCardsProps {
  profileData: ProfileData
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  color?: 'primary' | 'accent' | 'green' | 'blue'
  description?: string
  linkedinUrl?: string
  linkedinSection?: 'followers' | 'following' | 'recent-activity'
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'primary',
  description,
  linkedinUrl,
  linkedinSection
}: MetricCardProps) => {
  const colorClasses = {
    primary: 'from-primary/10 to-primary/20 text-primary border-primary/20',
    accent: 'from-accent/10 to-accent/20 text-accent border-accent/20',
    green: 'from-green-100 to-green-200 text-green-600 border-green-200',
    blue: 'from-blue-100 to-blue-200 text-blue-600 border-blue-200'
  }

  return (
    <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} opacity-30 group-hover:opacity-50 transition-opacity`}></div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} border`}>
            <Icon className="h-6 w-6" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
              change >= 0 
                ? 'text-green-600 bg-green-50 border border-green-200' 
                : 'text-red-600 bg-red-50 border border-red-200'
            }`}>
              {change >= 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            {linkedinUrl && linkedinSection && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-6 px-2"
                onClick={() => window.open(getLinkedInSectionUrl(linkedinUrl, linkedinSection), '_blank')}
              >
                <span>View</span>
                <ArrowSquareOut className="h-3 w-3" />
              </Button>
            )}
          </div>
          <p className="text-3xl font-bold text-foreground group-hover:scale-105 transition-transform">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricCards({ profileData }: MetricCardsProps) {
  const getProfileScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-blue-600 bg-blue-50'
    return 'text-orange-600 bg-orange-50'
  }

  const getProfileScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent! Your profile is well-optimized for maximum visibility and engagement.'
    if (score >= 60) return 'Good foundation, but there are opportunities to enhance your professional presence.'
    return 'Your profile has significant room for improvement to increase visibility and opportunities.'
  }

  return (
    <div className="space-y-8">
      {/* Main Metrics Grid */}
      <StaggerContainer stagger={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StaggerItem>
            <MetricCard
              title="Network Size"
              value={profileData.followers.toLocaleString()}
              change={profileData.followerGrowthTrend === 'increasing' ? 12 : 
                      profileData.followerGrowthTrend === 'decreasing' ? -5 : 0}
              icon={Users}
              color="primary"
              description="followers"
              linkedinUrl={profileData.linkedinUrl}
              linkedinSection="followers"
            />
          </StaggerItem>
          
          <StaggerItem>
            <MetricCard
              title="Connections"
              value={profileData.connections.toLocaleString()}
              change={8}
              icon={Users}
              color="accent"
              description="professional connections"
            />
          </StaggerItem>
          
          <StaggerItem>
            <MetricCard
              title="Content Output"
              value={profileData.posts}
              change={profileData.contentFrequency === 'daily' ? 25 :
                      profileData.contentFrequency === 'weekly' ? 10 :
                      profileData.contentFrequency === 'monthly' ? -2 : -8}
              icon={ChatCircle}
              color="green"
              description="total posts"
              linkedinUrl={profileData.linkedinUrl}
              linkedinSection="recent-activity"
            />
          </StaggerItem>
          
          <StaggerItem>
            <MetricCard
              title="Engagement Rate"
              value={`${profileData.engagement}%`}
              change={profileData.followers < 1000 ? 15 : 
                      profileData.followers < 5000 ? 8 : 3}
              icon={TrendUp}
              color="blue"
              description="average engagement"
            />
          </StaggerItem>
        </div>
      </StaggerContainer>

      {/* Profile Optimization Score */}
      <StaggerContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StaggerItem>
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Profile Optimization Score</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Your current profile completeness and optimization level
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-6">
                <div className="text-center space-y-2">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getProfileScoreColor(profileData.profileScore)}`}>
                    {profileData.profileScore}% Complete
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Progress 
                    value={profileData.profileScore} 
                    className="w-full h-3 bg-muted/50" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Needs Work</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>
                
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {getProfileScoreMessage(profileData.profileScore)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
          
          <StaggerItem>
            <Card className="flex items-center justify-center h-full bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 backdrop-blur-sm">
              <div className="text-center space-y-4 p-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl flex items-center justify-center">
                  <TrendUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Growth Potential</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Based on your current metrics, you have significant opportunities to expand 
                    your professional network and increase your influence in your industry.
                  </p>
                </div>
                <div className="flex justify-center space-x-2">
                  <Badge variant="outline" className="bg-white/50">
                    {profileData.roleLevel.replace('_', ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')} Level
                  </Badge>
                </div>
              </div>
            </Card>
          </StaggerItem>
        </div>
      </StaggerContainer>
    </div>
  )
}