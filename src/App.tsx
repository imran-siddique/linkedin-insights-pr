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
  Zap,
  Brain,
  Star,
  BookOpen,
  Trophy
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
  skills: string[]
  experience: number // years of experience
}

interface Recommendation {
  id: string
  category: 'content' | 'networking' | 'optimization' | 'skills'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  action: string
  relatedSkills?: string[]
  impactScore: number
}

interface TrendingTopic {
  topic: string
  relevanceScore: number
  hashtags: string[]
  suggestedAction: string
  relatedSkills: string[]
  marketDemand: 'high' | 'medium' | 'low'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface SkillInsight {
  skill: string
  marketDemand: 'high' | 'medium' | 'low'
  growth: 'growing' | 'stable' | 'declining'
  salary_impact: 'high' | 'medium' | 'low'
  learning_resources: string[]
  related_opportunities: string[]
}

function App() {
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useKV<ProfileData | null>('profile-data', null)
  const [recommendations, setRecommendations] = useKV<Recommendation[]>('recommendations', [])
  const [trendingTopics, setTrendingTopics] = useKV<TrendingTopic[]>('trending-topics', [])
  const [skillInsights, setSkillInsights] = useKV<SkillInsight[]>('skill-insights', [])
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
        industry: 'Technology',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Machine Learning', 'Data Analysis'],
        experience: Math.floor(Math.random() * 10) + 2
      }

      setProfileData(mockProfileData)

      // Generate AI recommendations based on skills and profile
      const prompt = spark.llmPrompt`Based on this LinkedIn profile data: ${JSON.stringify(mockProfileData)}, generate 8 specific, actionable recommendations for improving their LinkedIn presence and professional growth. Focus heavily on their skills: ${mockProfileData.skills.join(', ')}. For each recommendation, consider:
      - Current market trends for their skills
      - Opportunities to showcase expertise
      - Skills to develop or highlight
      - Ways to position themselves in the market

      Format as JSON array with fields: category (content/networking/optimization/skills), title, description, priority (high/medium/low), action, relatedSkills (array of relevant skills), impactScore (1-10).`
      
      try {
        const recommendationsResponse = await spark.llm(prompt, 'gpt-4o-mini', true)
        const parsedRecommendations = JSON.parse(recommendationsResponse)
        const generatedRecommendations = Array.isArray(parsedRecommendations) 
          ? parsedRecommendations.map((rec: any, index: number) => ({
              ...rec,
              id: `rec-${index}`
            }))
          : []

        setRecommendations(generatedRecommendations)
      } catch (parseError) {
        console.error('Failed to parse recommendations:', parseError)
        setRecommendations([])
      }

      // Generate skill-aware trending topics
      const trendPrompt = spark.llmPrompt`For someone in the ${mockProfileData.industry} industry with these skills: ${mockProfileData.skills.join(', ')}, identify 6 current trending topics they should engage with on LinkedIn. Consider:
      - Emerging technologies related to their skills
      - Industry shifts affecting their expertise
      - New applications of their existing skills
      - Complementary skills they should develop
      
      Format as JSON array with fields: topic, relevanceScore (1-10), hashtags (array), suggestedAction, relatedSkills (array), marketDemand (high/medium/low), difficulty (beginner/intermediate/advanced).`
      
      try {
        const trendsResponse = await spark.llm(trendPrompt, 'gpt-4o-mini', true)
        const parsedTrends = JSON.parse(trendsResponse)
        const generatedTrends = Array.isArray(parsedTrends) ? parsedTrends : []

        setTrendingTopics(generatedTrends)
      } catch (parseError) {
        console.error('Failed to parse trends:', parseError)
        setTrendingTopics([])
      }

      // Generate skill insights
      const skillPrompt = spark.llmPrompt`Analyze these skills for market opportunities: ${mockProfileData.skills.join(', ')}. For each skill, provide insights on:
      - Current market demand
      - Growth trajectory (growing/stable/declining)
      - Salary impact potential
      - Learning resources to advance
      - Related opportunities in the market
      
      Format as JSON array with fields: skill, marketDemand (high/medium/low), growth (growing/stable/declining), salary_impact (high/medium/low), learning_resources (array), related_opportunities (array).`
      
      try {
        const skillResponse = await spark.llm(skillPrompt, 'gpt-4o-mini', true)
        const parsedSkillInsights = JSON.parse(skillResponse)
        const generatedSkillInsights = Array.isArray(parsedSkillInsights) ? parsedSkillInsights : []

        setSkillInsights(generatedSkillInsights)
      } catch (parseError) {
        console.error('Failed to parse skill insights:', parseError)
        setSkillInsights([])
      }

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
            {recommendation.impactScore && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Impact: {recommendation.impactScore}/10
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-3">{recommendation.description}</p>
        
        {recommendation.relatedSkills && recommendation.relatedSkills.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-2">Related Skills:</p>
            <div className="flex flex-wrap gap-2">
              {recommendation.relatedSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Button variant="outline" size="sm">
          {recommendation.action}
        </Button>
      </CardContent>
    </Card>
  )

  const SkillInsightCard = ({ insight }: { insight: SkillInsight }) => (
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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

  const TrendCard = ({ trend }: { trend: TrendingTopic }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Hash className="h-5 w-5 mr-2" />
            {trend.topic}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {trend.relevanceScore}/10
            </Badge>
            <Badge variant={trend.marketDemand === 'high' ? 'default' : 'outline'}>
              {trend.marketDemand} demand
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Difficulty:</span>
            <Badge variant="outline" className={
              trend.difficulty === 'beginner' ? 'bg-green-50 text-green-700' :
              trend.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-700' :
              'bg-red-50 text-red-700'
            }>
              {trend.difficulty}
            </Badge>
          </div>
          
          {trend.relatedSkills && trend.relatedSkills.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Relevant Skills:</p>
              <div className="flex flex-wrap gap-1">
                {trend.relatedSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {trend.hashtags && trend.hashtags.length > 0 ? (
              trend.hashtags.map((hashtag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{hashtag}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                No hashtags available
              </Badge>
            )}
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

            {/* Skills Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-6 w-6 mr-2" />
                  Your Skills Portfolio
                </CardTitle>
                <CardDescription>
                  Core skills identified from your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      No skills identified
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="recommendations">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="skills">
                  <Brain className="h-4 w-4 mr-2" />
                  Skill Insights
                </TabsTrigger>
                <TabsTrigger value="trends">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trends
                </TabsTrigger>
                <TabsTrigger value="strategy">
                  <Target className="h-4 w-4 mr-2" />
                  Strategy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recommendations" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">AI-Powered Growth Recommendations</h3>
                  <p className="text-muted-foreground">
                    Personalized suggestions based on your skills and market opportunities.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {recommendations && recommendations.length > 0 ? (
                      recommendations.map((recommendation) => (
                        <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-muted-foreground py-8">
                        No recommendations available. Try analyzing a profile first.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Skill Market Analysis</h3>
                  <p className="text-muted-foreground">
                    Deep insights into your skills' market value and growth opportunities.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {skillInsights && skillInsights.length > 0 ? (
                      skillInsights.map((insight, index) => (
                        <SkillInsightCard key={index} insight={insight} />
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-muted-foreground py-8">
                        No skill insights available. Try analyzing a profile first.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Skill-Relevant Industry Trends</h3>
                  <p className="text-muted-foreground">
                    Trending topics specifically aligned with your skill set and expertise.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {trendingTopics && trendingTopics.length > 0 ? (
                      trendingTopics.map((trend, index) => (
                        <TrendCard key={index} trend={trend} />
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-muted-foreground py-8">
                        No trending topics available. Try analyzing a profile first.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="strategy" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">Skill-Based Content Strategy</h3>
                  <p className="text-muted-foreground">
                    Strategic content recommendations based on your expertise and market positioning.
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
                        <CardTitle className="flex items-center">
                          <Trophy className="h-5 w-5 mr-2" />
                          Skill Showcase Opportunities
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="border-l-4 border-primary pl-3">
                            <p className="text-sm font-medium">Share Project Deep-Dives</p>
                            <p className="text-xs text-muted-foreground">Showcase technical expertise with detailed case studies</p>
                          </div>
                          <div className="border-l-4 border-accent pl-3">
                            <p className="text-sm font-medium">Industry Commentary</p>
                            <p className="text-xs text-muted-foreground">Position yourself as a thought leader in your field</p>
                          </div>
                          <div className="border-l-4 border-secondary pl-3">
                            <p className="text-sm font-medium">Learning Journey Posts</p>
                            <p className="text-xs text-muted-foreground">Document skill development and continuous learning</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Content Performance by Skill</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Technical Tutorials</span>
                            <span className="text-sm font-medium">High engagement</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Career Insights</span>
                            <span className="text-sm font-medium">Medium engagement</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Tool Reviews</span>
                            <span className="text-sm font-medium">High engagement</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Brain className="h-5 w-5 mr-2" />
                          Skill Monetization Ideas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Consulting Services</span>
                            <Badge variant="outline">High potential</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Online Course Creation</span>
                            <Badge variant="outline">Medium potential</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Speaking Engagements</span>
                            <Badge variant="outline">High potential</Badge>
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