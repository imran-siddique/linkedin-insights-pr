import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  useAnalyzeProfile,
  useGenerateRecommendations,
  useCompetitiveAnalysis,
  useCompensationAnalysis
} from './hooks/useLinkedInAPI'
import { ProfileData, Recommendation, CompetitiveAnalysis, CompensationAnalysis } from './types'

// Simple UI components (you can replace with shadcn/ui later)
const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={`bg-white rounded-lg shadow-md border ${className}`}>{children}</div>
)

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-6 pb-4">{children}</div>
)

const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
)

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-6 pt-0">{children}</div>
)

const Button: React.FC<{
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}> = ({ onClick, disabled, variant = 'primary', children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      variant === 'primary'
        ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100'
    }`}
  >
    {children}
  </button>
)

const Input: React.FC<{
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
}> = ({ value, onChange, placeholder, className }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
)

const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'secondary' }> = ({ 
  children, 
  variant = 'default' 
}) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    variant === 'default' 
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-100 text-gray-800'
  }`}>
    {children}
  </span>
)

function App() {
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [competitiveData, setCompetitiveData] = useState<CompetitiveAnalysis | null>(null)
  const [compensationData, setCompensationData] = useState<CompensationAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const analyzeProfileMutation = useAnalyzeProfile({
    onSuccess: (response) => {
      setProfileData(response.data)
      // Auto-generate other insights
      generateRecommendationsMutation.mutate(response.data)
      competitiveAnalysisMutation.mutate(response.data)
      compensationAnalysisMutation.mutate(response.data)
    }
  })

  const generateRecommendationsMutation = useGenerateRecommendations({
    onSuccess: (response) => {
      setRecommendations(response.data)
    }
  })

  const competitiveAnalysisMutation = useCompetitiveAnalysis({
    onSuccess: (response) => {
      setCompetitiveData(response.data)
    }
  })

  const compensationAnalysisMutation = useCompensationAnalysis({
    onSuccess: (response) => {
      setCompensationData(response.data)
    }
  })

  const handleAnalyze = () => {
    if (!linkedinUrl.trim()) {
      toast.error('Please enter a LinkedIn profile URL')
      return
    }
    analyzeProfileMutation.mutate(linkedinUrl)
  }

  const isLoading = analyzeProfileMutation.isLoading || 
                   generateRecommendationsMutation.isLoading ||
                   competitiveAnalysisMutation.isLoading ||
                   compensationAnalysisMutation.isLoading

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            LinkedIn Analytics & Growth Advisor
          </h1>
          <p className="text-lg text-gray-600">
            Unlock insights from your LinkedIn profile and discover opportunities for professional growth
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analyze Your LinkedIn Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="linkedin.com/in/username or just username"
                />
              </div>
              <Button onClick={handleAnalyze} disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Analyze Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="mb-8">
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Analyzing your LinkedIn profile...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {profileData && !isLoading && (
          <div className="space-y-8">
            {/* Profile Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{profileData.followers.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{profileData.connections.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{profileData.engagement}%</div>
                    <div className="text-sm text-gray-600">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{profileData.profileScore}%</div>
                    <div className="text-sm text-gray-600">Profile Score</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <Badge key={index}>{skill}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'recommendations', label: 'Recommendations' },
                { id: 'competitive', label: 'Competition' },
                { id: 'salary', label: 'Salary' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'recommendations' && recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>AI-Powered Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{rec.title}</h4>
                          <div className="flex space-x-2">
                            <Badge variant={rec.priority === 'high' ? 'default' : 'secondary'}>
                              {rec.priority} priority
                            </Badge>
                            <Badge variant="secondary">
                              {rec.category}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{rec.description}</p>
                        <p className="text-sm font-medium text-blue-600">{rec.action}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'competitive' && competitiveData && (
              <Card>
                <CardHeader>
                  <CardTitle>Competitive Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">#{competitiveData.userRanking.overallScore.rank}</div>
                      <div className="text-sm text-gray-600">Overall Rank</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{competitiveData.userRanking.overallScore.percentile}th</div>
                      <div className="text-sm text-gray-600">Percentile</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{competitiveData.industryBenchmarks.avgFollowers.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Industry Avg Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{competitiveData.industryBenchmarks.avgEngagement}%</div>
                      <div className="text-sm text-gray-600">Industry Avg Engagement</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Top Competitors</h4>
                    <div className="space-y-3">
                      {competitiveData.competitors.slice(0, 3).map((competitor) => (
                        <div key={competitor.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{competitor.name}</h5>
                            <div className="flex space-x-2">
                              <Badge>{competitor.followers.toLocaleString()} followers</Badge>
                              <Badge variant="secondary">{competitor.engagement}% engagement</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{competitor.headline}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'salary' && compensationData && (
              <Card>
                <CardHeader>
                  <CardTitle>Compensation Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${compensationData.currentMarketPosition.estimatedSalaryRange.median.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Estimated Median Salary</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{compensationData.currentMarketPosition.percentileRanking}th</div>
                      <div className="text-sm text-gray-600">Percentile</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+{compensationData.currentMarketPosition.skillPremium}%</div>
                      <div className="text-sm text-gray-600">Skill Premium</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Salary Range</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between text-sm">
                        <span>Min: ${compensationData.currentMarketPosition.estimatedSalaryRange.min.toLocaleString()}</span>
                        <span>Median: ${compensationData.currentMarketPosition.estimatedSalaryRange.median.toLocaleString()}</span>
                        <span>Max: ${compensationData.currentMarketPosition.estimatedSalaryRange.max.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {compensationData.skillImpact.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Top Skills Impact</h4>
                      <div className="space-y-2">
                        {compensationData.skillImpact.slice(0, 5).map((skill, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b">
                            <span className="font-medium">{skill.skill}</span>
                            <Badge>+{skill.salaryPremium}% premium</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App