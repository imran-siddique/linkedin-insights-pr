import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Users, TrendUp, LinkedinLogo, ArrowSquareOut, Trophy, Target, ChartBar } from '@phosphor-icons/react'
import type { CompetitiveAnalysis } from '@/types/linkedin'

interface CompetitiveTabProps {
  competitiveAnalysis: CompetitiveAnalysis | null
}

export function CompetitiveTab({ competitiveAnalysis }: CompetitiveTabProps) {
  if (!competitiveAnalysis) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <ChartBar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium mb-2">No Competitive Analysis Available</h3>
        <p>Competitive analysis data will appear here after your profile is processed.</p>
      </div>
    )
  }

  const { userRanking, gapAnalysis, competitors, industryBenchmarks, userProfile } = competitiveAnalysis

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold">Competitive Analysis</h3>
        <p className="text-muted-foreground">
          See how you stack up against industry peers and identify growth opportunities.
        </p>
      </div>

      {/* Your Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span>Your Industry Rankings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Followers</span>
                <Badge variant={userRanking.followers.percentile > 70 ? "default" : "secondary"}>
                  #{userRanking.followers.rank}
                </Badge>
              </div>
              <Progress value={userRanking.followers.percentile} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {userRanking.followers.percentile}th percentile
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Engagement</span>
                <Badge variant={userRanking.engagement.percentile > 70 ? "default" : "secondary"}>
                  #{userRanking.engagement.rank}
                </Badge>
              </div>
              <Progress value={userRanking.engagement.percentile} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {userRanking.engagement.percentile}th percentile
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Score</span>
                <Badge variant={userRanking.overallScore.percentile > 70 ? "default" : "secondary"}>
                  #{userRanking.overallScore.rank}
                </Badge>
              </div>
              <Progress value={userRanking.overallScore.percentile} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {userRanking.overallScore.percentile}th percentile
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gap Analysis */}
      {gapAnalysis && gapAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Growth Opportunities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gapAnalysis.slice(0, 3).map((gap, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium capitalize">{gap.category}</h4>
                    <Badge variant={gap.priority === 'high' ? 'destructive' : gap.priority === 'medium' ? 'default' : 'secondary'}>
                      {gap.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{gap.recommendation}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Current: {gap.currentValue}</span>
                    <span>Target: {gap.benchmarkValue}</span>
                    <span>Gap: {gap.gap}</span>
                    <span>Time: {gap.timeToImprove}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Competitors */}
      {competitors && competitors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>Industry Leaders to Watch</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitors.slice(0, 5).map((competitor, index) => (
                <div key={competitor.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{competitor.name}</span>
                      {competitor.isInfluencer && (
                        <Badge variant="outline" className="text-xs">
                          <TrendUp className="h-3 w-3 mr-1" />
                          Influencer
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{competitor.headline}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{competitor.followers.toLocaleString()} followers</span>
                      <span>{competitor.engagement}% engagement</span>
                      <span>Score: {competitor.profileScore}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1 hover:bg-blue-50"
                    onClick={() => window.open(`https://www.linkedin.com/in/${competitor.name.toLowerCase().replace(/\s+/g, '-')}/`, '_blank')}
                  >
                    <LinkedinLogo className="h-3 w-3 text-blue-600" />
                    <span className="text-blue-600">View</span>
                    <ArrowSquareOut className="h-3 w-3 text-blue-600" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Industry Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Benchmarks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{industryBenchmarks.avgFollowers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Avg Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{industryBenchmarks.avgEngagement}%</div>
              <div className="text-sm text-muted-foreground">Avg Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{industryBenchmarks.avgConnections.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Avg Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{industryBenchmarks.avgProfileScore}</div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}