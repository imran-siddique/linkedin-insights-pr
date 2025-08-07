import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Lightbulb, 
  Hash,
  Calendar,
  Search,
  ExternalLink,
  Target,
  Zap
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface ProfileData {
  name: string
  headline: string
  followers: number
  connections: number
  posts: number
  engagement: number
  profileScore: number
  industry: string
}

interface Recommendation {
  id: string
  category: 'content' | 'networking' | 'optimization'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  action: string
}

interface TrendingTopic {
  topic: string
  relevanceScore: number
  hashtags: string[]
  suggestedAction: string
}

function App() {
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useKV<ProfileData | null>('profile-data', null)
  const [recommendations, setRecommendations] = useKV<Recommendation[]>('recommendations', [])
  const [trendingTopics, setTrendingTopics] = useKV<TrendingTopic[]>('trending-topics', [])
  const [error, setError] = useState('')

  const extractLinkedInId = (url: string) => {
    const patterns = [
      /linkedin\.com\/in\/([^\/\?]+)/,
      /linkedin\.com\/pub\/([^\/\?]+)/,
      /^([a-zA-Z0-9\-]+)$/ // Direct username
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const analyzeProfile = async () => {
    if (!linkedinUrl.trim()) {
      setError('Please enter a LinkedIn profile URL or username')
      return
    }

    const linkedinId = extractLinkedInId(linkedinUrl.trim())
    if (!linkedinId) {
      setError('Please enter a valid LinkedIn profile URL or username')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Simulate profile data analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockProfileData: ProfileData = {
        name: 'Professional User',
        headline: 'Software Engineer | Technology Enthusiast',
        followers: Math.floor(Math.random() * 5000) + 500,
        connections: Math.floor(Math.random() * 1000) + 200,
        posts: Math.floor(Math.random() * 100) + 20,
        engagement: Math.floor(Math.random() * 8) + 2,
        profileScore: Math.floor(Math.random() * 30) + 70,
        industry: 'Technology'
      }

      setProfileData(mockProfileData)

      // Generate AI recommendations
      const prompt = spark.llmPrompt`Based on this LinkedIn profile data: ${JSON.stringify(mockProfileData)}, generate 6 specific, actionable recommendations for improving their LinkedIn presence and professional growth. Format as JSON array with fields: category (content/networking/optimization), title, description, priority (high/medium/low), action.`
      
      const recommendationsResponse = await spark.llm(prompt, 'gpt-4o-mini', true)
      const generatedRecommendations = JSON.parse(recommendationsResponse).map((rec: any, index: number) => ({
        ...rec,
        id: `rec-${index}`
      }))

      setRecommendations(generatedRecommendations)

      // Generate trending topics
      const trendPrompt = spark.llmPrompt`For someone in the ${mockProfileData.industry} industry with the headline "${mockProfileData.headline}", identify 5 current trending topics they should engage with on LinkedIn. Format as JSON array with fields: topic, relevanceScore (1-10), hashtags (array), suggestedAction.`
      
      const trendsResponse = await spark.llm(trendPrompt, 'gpt-4o-mini', true)
      const generatedTrends = JSON.parse(trendsResponse)

      setTrendingTopics(generatedTrends)

      toast.success('Profile analyzed successfully!')
    } catch (error) {
      console.error('Analysis error:', error)
      setError('Failed to analyze profile. Please try again.')
      toast.error('Analysis failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const MetricCard = ({ title, value, change, icon: Icon }: { 
    title: string
    value: string | number
    change?: number
    icon: React.ElementType 
  }) => (
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
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
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

  const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{recommendation.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={recommendation.priority === 'high' ? 'default' : 'secondary'}>
              {recommendation.priority}
            </Badge>
            <Badge variant="outline">
              {recommendation.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-3">{recommendation.description}</p>
        <Button variant="outline" size="sm">
          {recommendation.action}
        </Button>
      </CardContent>
    </Card>
  )

  const TrendCard = ({ trend }: { trend: TrendingTopic }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Hash className="h-5 w-5 mr-2" />
            {trend.topic}
          </CardTitle>
          <Badge variant="secondary">
            {trend.relevanceScore}/10
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {trend.hashtags.map((hashtag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{hashtag}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{trend.suggestedAction}</p>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Explore Topic
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            LinkedIn Analytics & Growth Advisor
          </h1>
          <p className="text-lg text-muted-foreground">
            Unlock insights from your LinkedIn profile and discover opportunities for professional growth
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-6 w-6 mr-2" />
              Analyze Your LinkedIn Profile
            </CardTitle>
            <CardDescription>
              Enter your LinkedIn profile URL or username to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="linkedin-url">LinkedIn Profile URL or Username</Label>
                <Input
                  id="linkedin-url"
                  placeholder="linkedin.com/in/username or just username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={analyzeProfile} disabled={isLoading} className="px-6">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {isLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-8 rounded mb-4" />
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {profileData && !isLoading && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Followers"
                value={profileData.followers.toLocaleString()}
                change={12}
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
                change={-5}
                icon={MessageSquare}
              />
              <MetricCard
                title="Engagement Rate"
                value={`${profileData.engagement}%`}
                change={15}
                icon={TrendingUp}
              />
            </div>

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

            <Tabs defaultValue="recommendations" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recommendations">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="trends">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Industry Trends
                </TabsTrigger>
                <TabsTrigger value="strategy">
                  <Target className="h-4 w-4 mr-2" />
                  Content Strategy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recommendations" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">AI-Powered Growth Recommendations</h3>
                  <p className="text-muted-foreground">
                    Personalized suggestions to enhance your LinkedIn presence and professional impact.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {recommendations.map((recommendation) => (
                      <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Industry Trends & Topics</h3>
                  <p className="text-muted-foreground">
                    Current trending topics in your industry that you should engage with to stay relevant.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {trendingTopics.map((trend, index) => (
                      <TrendCard key={index} trend={trend} />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="strategy" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">Content Strategy Advisor</h3>
                  <p className="text-muted-foreground">
                    Data-driven insights for optimal content timing and engagement strategies.
                  </p>
                  <Separator />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          Optimal Posting Times
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Tuesday - 10:00 AM</span>
                            <Badge variant="default">Peak</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Wednesday - 2:00 PM</span>
                            <Badge variant="secondary">Good</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Thursday - 9:00 AM</span>
                            <Badge variant="secondary">Good</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Content Performance Insights</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Industry Updates</span>
                            <span className="text-sm font-medium">High engagement</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Career Tips</span>
                            <span className="text-sm font-medium">Medium engagement</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Personal Stories</span>
                            <span className="text-sm font-medium">High engagement</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}

export default App