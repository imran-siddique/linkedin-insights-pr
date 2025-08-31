# Examples & Tutorials

This comprehensive guide provides practical examples and step-by-step tutorials for using the LinkedIn Analytics & Growth Advisor application. Whether you're a new user or looking to explore advanced features, these examples will help you get the most out of the platform.

## 🎯 Basic Usage Examples

### Profile Analysis Workflow

#### Example 1: Analyzing a Public Profile

```typescript
// Basic profile analysis example
import { LinkedInService } from '@/lib/linkedin-api'
import { useProfileAnalysis } from '@/hooks/useProfileAnalysis'

function ProfileAnalysisExample() {
  const { data, loading, error, analyzeProfile } = useProfileAnalysis()

  const handleAnalysis = async () => {
    try {
      // Analyze Bill Gates' public LinkedIn profile
      await analyzeProfile('billgates')
      console.log('Analysis complete:', data)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
  }

  return (
    <div>
      <button onClick={handleAnalysis} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Profile'}
      </button>
      
      {data && (
        <div>
          <h2>Profile Analysis Results</h2>
          <p>Score: {data.profileScore}/100</p>
          <p>Completeness: {data.completeness}</p>
          <p>Skills: {data.skills.join(', ')}</p>
        </div>
      )}
      
      {error && (
        <div className="error">
          Error: {error.message}
        </div>
      )}
    </div>
  )
}
```

#### Example 2: Handling Different URL Formats

```typescript
// The service accepts various LinkedIn URL formats
const examples = [
  'billgates',                           // Username only
  'https://linkedin.com/in/billgates',   // Full URL
  'https://www.linkedin.com/in/billgates/', // With www and trailing slash
  'linkedin.com/in/billgates',           // Without protocol
]

examples.forEach(async (url) => {
  try {
    const result = await linkedInService.getProfileData(url)
    console.log(`✅ Successfully analyzed: ${url}`)
  } catch (error) {
    console.error(`❌ Failed to analyze: ${url}`, error.message)
  }
})
```

### Skills Analysis Examples

#### Example 3: Skills Gap Analysis

```typescript
interface SkillsAnalysisResult {
  currentSkills: Skill[]
  missingSkills: Skill[]
  recommendations: SkillRecommendation[]
  marketTrends: MarketTrend[]
}

async function analyzeSkillsGap(profileData: ProfileData): Promise<SkillsAnalysisResult> {
  const skillsService = new SkillsAnalysisService()
  
  // Analyze current skills
  const currentSkills = await skillsService.analyzeCurrentSkills(profileData)
  
  // Identify skill gaps based on industry trends
  const missingSkills = await skillsService.identifySkillGaps(
    currentSkills,
    profileData.industry
  )
  
  // Generate learning recommendations
  const recommendations = await skillsService.generateRecommendations(
    missingSkills,
    profileData.experienceLevel
  )
  
  return {
    currentSkills,
    missingSkills,
    recommendations,
    marketTrends: await skillsService.getMarketTrends(profileData.industry)
  }
}

// Usage example
const skillsAnalysis = await analyzeSkillsGap(profileData)
console.log('Top 3 missing skills:', skillsAnalysis.missingSkills.slice(0, 3))
```

#### Example 4: Skill Prioritization

```typescript
interface SkillPriority {
  skill: string
  priority: 'critical' | 'important' | 'beneficial'
  timeToAcquire: number // months
  salaryImpact: number // percentage increase
  demandLevel: 'high' | 'moderate' | 'low'
}

function prioritizeSkills(missingSkills: Skill[]): SkillPriority[] {
  return missingSkills
    .map(skill => ({
      skill: skill.name,
      priority: calculatePriority(skill),
      timeToAcquire: estimateTimeToAcquire(skill),
      salaryImpact: calculateSalaryImpact(skill),
      demandLevel: getMarketDemand(skill)
    }))
    .sort((a, b) => {
      // Sort by priority, then by impact
      if (a.priority !== b.priority) {
        const priorities = { critical: 3, important: 2, beneficial: 1 }
        return priorities[b.priority] - priorities[a.priority]
      }
      return b.salaryImpact - a.salaryImpact
    })
}

// Example output
const prioritizedSkills = prioritizeSkills(missingSkills)
prioritizedSkills.slice(0, 5).forEach(skill => {
  console.log(`${skill.skill}: ${skill.priority} priority, ${skill.salaryImpact}% salary impact`)
})
```

## 🚀 Advanced Use Cases

### Batch Profile Analysis

#### Example 5: Team Skills Assessment

```typescript
interface TeamMember {
  name: string
  linkedinUrl: string
  role: string
  department: string
}

class TeamAnalyzer {
  private linkedInService = new LinkedInService()
  
  async analyzeTeam(teamMembers: TeamMember[]): Promise<TeamAnalysisResult> {
    const analyses = await Promise.allSettled(
      teamMembers.map(async (member) => {
        try {
          const profileData = await this.linkedInService.getProfileData(member.linkedinUrl)
          const skillsAnalysis = await this.analyzeSkills(profileData)
          
          return {
            member,
            profileData,
            skillsAnalysis,
            status: 'success' as const
          }
        } catch (error) {
          return {
            member,
            error: error.message,
            status: 'failed' as const
          }
        }
      })
    )

    return this.aggregateTeamResults(analyses)
  }
  
  private aggregateTeamResults(analyses: PromiseSettledResult<any>[]): TeamAnalysisResult {
    const successful = analyses
      .filter(result => result.status === 'fulfilled' && result.value.status === 'success')
      .map(result => result.value)

    const failed = analyses
      .filter(result => result.status === 'fulfilled' && result.value.status === 'failed')
      .map(result => result.value)

    // Aggregate skills across the team
    const allSkills = successful.flatMap(analysis => analysis.skillsAnalysis.currentSkills)
    const skillDistribution = this.calculateSkillDistribution(allSkills)
    const teamGaps = this.identifyTeamSkillGaps(successful)

    return {
      summary: {
        totalMembers: analyses.length,
        successfulAnalyses: successful.length,
        failedAnalyses: failed.length
      },
      skillDistribution,
      teamGaps,
      memberAnalyses: successful,
      failures: failed
    }
  }
}

// Usage
const teamAnalyzer = new TeamAnalyzer()
const teamResults = await teamAnalyzer.analyzeTeam([
  { name: 'John Doe', linkedinUrl: 'johndoe', role: 'Developer', department: 'Engineering' },
  { name: 'Jane Smith', linkedinUrl: 'janesmith', role: 'Designer', department: 'Design' },
  // ... more team members
])

console.log('Team skill gaps:', teamResults.teamGaps)
```

### Custom Analytics Dashboard

#### Example 6: Building a Dashboard Component

```tsx
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface DashboardProps {
  profileData: ProfileData
  skillsAnalysis: SkillsAnalysisResult
  marketData: MarketIntelligence
}

export function AnalyticsDashboard({ profileData, skillsAnalysis, marketData }: DashboardProps) {
  const [insights, setInsights] = useState<DashboardInsights | null>(null)

  useEffect(() => {
    // Generate dashboard insights
    const dashboardInsights = generateDashboardInsights(profileData, skillsAnalysis, marketData)
    setInsights(dashboardInsights)
  }, [profileData, skillsAnalysis, marketData])

  if (!insights) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Profile Score Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold">{insights.profileScore}/100</div>
            <Progress value={insights.profileScore} className="flex-1" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {insights.profileScoreCategory}
          </p>
        </CardContent>
      </Card>

      {/* Skills Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Current Skills</span>
              <Badge variant="secondary">{insights.currentSkillsCount}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Recommended Skills</span>
              <Badge variant="outline">{insights.recommendedSkillsCount}</Badge>
            </div>
            <div className="flex justify-between">
              <span>High-Priority Gaps</span>
              <Badge variant="destructive">{insights.criticalGapsCount}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Position */}
      <Card>
        <CardHeader>
          <CardTitle>Market Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span>Industry Ranking</span>
                <span>{insights.industryPercentile}th percentile</span>
              </div>
              <Progress value={insights.industryPercentile} className="mt-1" />
            </div>
            <div>
              <span className="text-sm font-medium">Salary Range</span>
              <p className="text-lg font-semibold">
                ${insights.salaryRange.min.toLocaleString()} - ${insights.salaryRange.max.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Recommendations */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Top Growth Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.topRecommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold">{rec.title}</h4>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                    {rec.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Est. {rec.timeToImplement} to implement
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

## 🔧 Integration Examples

### API Integration

#### Example 7: REST API Wrapper

```typescript
class LinkedInAnalyticsAPI {
  private baseURL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
  private apiKey = process.env.VITE_API_KEY

  async analyzeProfile(username: string): Promise<AnalysisResult> {
    const response = await fetch(`${this.baseURL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ username })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getSkillsAnalysis(profileId: string): Promise<SkillsAnalysisResult> {
    const response = await fetch(`${this.baseURL}/skills/${profileId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`Skills analysis failed: ${response.statusText}`)
    }

    return response.json()
  }

  async getMarketIntelligence(industry: string, location?: string): Promise<MarketData> {
    const params = new URLSearchParams({ industry })
    if (location) params.append('location', location)

    const response = await fetch(`${this.baseURL}/market?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    })

    return response.json()
  }
}

// Usage
const api = new LinkedInAnalyticsAPI()

try {
  const analysis = await api.analyzeProfile('billgates')
  const skills = await api.getSkillsAnalysis(analysis.profileId)
  const market = await api.getMarketIntelligence('Technology', 'San Francisco')
  
  console.log('Complete analysis:', { analysis, skills, market })
} catch (error) {
  console.error('API integration failed:', error)
}
```

#### Example 8: Webhook Integration

```typescript
// Setting up webhooks for real-time updates
interface WebhookPayload {
  event: 'analysis_complete' | 'skills_updated' | 'market_change'
  data: any
  timestamp: string
  profileId: string
}

class WebhookHandler {
  private subscribers: Map<string, Function[]> = new Map()

  subscribe(event: string, callback: Function) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, [])
    }
    this.subscribers.get(event)?.push(callback)
  }

  handleWebhook(payload: WebhookPayload) {
    const callbacks = this.subscribers.get(payload.event) || []
    callbacks.forEach(callback => {
      try {
        callback(payload.data, payload)
      } catch (error) {
        console.error('Webhook callback error:', error)
      }
    })
  }
}

// Usage
const webhookHandler = new WebhookHandler()

// Subscribe to analysis completion
webhookHandler.subscribe('analysis_complete', (data, payload) => {
  console.log('Analysis completed for:', payload.profileId)
  updateDashboard(data)
})

// Subscribe to skills updates
webhookHandler.subscribe('skills_updated', (data) => {
  refreshSkillsDisplay(data)
})
```

## 📊 Data Visualization Examples

### Chart Integration

#### Example 9: Skills Progression Chart

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SkillProgressionProps {
  skillsHistory: SkillsHistoryData[]
}

export function SkillProgressionChart({ skillsHistory }: SkillProgressionProps) {
  const chartData = skillsHistory.map(entry => ({
    date: entry.date,
    totalSkills: entry.skills.length,
    technicalSkills: entry.skills.filter(s => s.category === 'technical').length,
    softSkills: entry.skills.filter(s => s.category === 'soft').length,
    score: entry.overallScore
  }))

  return (
    <div className="w-full h-96">
      <h3 className="text-lg font-semibold mb-4">Skills Progression Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value, name) => [value, name.replace(/([A-Z])/g, ' $1').trim()]}
          />
          <Line 
            type="monotone" 
            dataKey="totalSkills" 
            stroke="#8884d8" 
            strokeWidth={2}
            name="Total Skills"
          />
          <Line 
            type="monotone" 
            dataKey="technicalSkills" 
            stroke="#82ca9d" 
            strokeWidth={2}
            name="Technical Skills"
          />
          <Line 
            type="monotone" 
            dataKey="softSkills" 
            stroke="#ffc658" 
            strokeWidth={2}
            name="Soft Skills"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

#### Example 10: Market Demand Heatmap

```tsx
import { useMemo } from 'react'

interface MarketHeatmapProps {
  skillsData: SkillMarketData[]
  selectedRegion?: string
}

export function SkillsMarketHeatmap({ skillsData, selectedRegion }: MarketHeatmapProps) {
  const heatmapData = useMemo(() => {
    return skillsData.map(skill => ({
      skill: skill.name,
      demand: skill.demandLevel,
      salary: skill.averageSalary,
      growth: skill.growthRate,
      competition: skill.competitionLevel
    }))
  }, [skillsData])

  const getHeatColor = (value: number, max: number) => {
    const intensity = Math.min(value / max, 1)
    return `hsl(${120 - (intensity * 120)}, 100%, ${50 + (intensity * 25)}%)`
  }

  const maxSalary = Math.max(...heatmapData.map(d => d.salary))

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Skills Market Demand - {selectedRegion || 'Global'}</h3>
      <div className="grid grid-cols-1 gap-2">
        {heatmapData.map((skill, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 rounded-lg border"
            style={{ backgroundColor: getHeatColor(skill.salary, maxSalary) }}
          >
            <span className="font-medium">{skill.skill}</span>
            <div className="flex space-x-4 text-sm">
              <span>Demand: {skill.demand}/10</span>
              <span>${skill.salary.toLocaleString()}</span>
              <span>Growth: {skill.growth}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 🎮 Interactive Examples

### Real-time Analysis

#### Example 11: Live Profile Monitor

```tsx
import { useState, useEffect } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'

export function LiveProfileMonitor({ username }: { username: string }) {
  const [analysisData, setAnalysisData] = useState<ProfileData | null>(null)
  const [updates, setUpdates] = useState<ProfileUpdate[]>([])
  
  const { connect, disconnect, send, lastMessage } = useWebSocket(
    `wss://api.example.com/ws/profile/${username}`
  )

  useEffect(() => {
    connect()
    
    // Request initial data
    send({ type: 'get_profile', username })
    
    return () => disconnect()
  }, [username, connect, disconnect, send])

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage.data)
      
      switch (message.type) {
        case 'profile_data':
          setAnalysisData(message.data)
          break
        case 'profile_update':
          setUpdates(prev => [message.data, ...prev.slice(0, 9)]) // Keep last 10 updates
          break
        case 'analysis_complete':
          setAnalysisData(prev => ({ ...prev, ...message.data }))
          break
      }
    }
  }, [lastMessage])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Profile Monitor</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      {analysisData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analysisData.profileScore}/100</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Skills Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analysisData.skills?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">{new Date(analysisData.lastUpdated).toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {updates.map((update, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">{update.description}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(update.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {updates.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent updates</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

## 🧪 Testing Examples

### Component Testing

#### Example 12: Testing Profile Analysis Component

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProfileAnalyzer } from '@/components/ProfileAnalyzer'
import { linkedInService } from '@/lib/linkedin-api'

// Mock the LinkedIn service
jest.mock('@/lib/linkedin-api')
const mockLinkedInService = linkedInService as jest.Mocked<typeof linkedInService>

describe('ProfileAnalyzer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display analysis results when profile is successfully analyzed', async () => {
    // Arrange
    const mockProfileData = {
      username: 'testuser',
      fullName: 'Test User',
      profileScore: 85,
      skills: ['JavaScript', 'React', 'TypeScript'],
      completeness: 'high'
    }
    
    mockLinkedInService.getProfileData.mockResolvedValue(mockProfileData)

    // Act
    render(<ProfileAnalyzer />)
    
    const input = screen.getByLabelText(/linkedin username/i)
    const button = screen.getByRole('button', { name: /analyze/i })
    
    fireEvent.change(input, { target: { value: 'testuser' } })
    fireEvent.click(button)

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('85/100')).toBeInTheDocument()
      expect(screen.getByText('JavaScript, React, TypeScript')).toBeInTheDocument()
    })
  })

  it('should display error message when analysis fails', async () => {
    // Arrange
    mockLinkedInService.getProfileData.mockRejectedValue(
      new Error('Profile not found')
    )

    // Act
    render(<ProfileAnalyzer />)
    
    const input = screen.getByLabelText(/linkedin username/i)
    const button = screen.getByRole('button', { name: /analyze/i })
    
    fireEvent.change(input, { target: { value: 'nonexistentuser' } })
    fireEvent.click(button)

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/profile not found/i)).toBeInTheDocument()
    })
  })

  it('should show loading state during analysis', async () => {
    // Arrange
    mockLinkedInService.getProfileData.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    // Act
    render(<ProfileAnalyzer />)
    
    const input = screen.getByLabelText(/linkedin username/i)
    const button = screen.getByRole('button', { name: /analyze/i })
    
    fireEvent.change(input, { target: { value: 'testuser' } })
    fireEvent.click(button)

    // Assert
    expect(screen.getByText(/analyzing/i)).toBeInTheDocument()
    expect(button).toBeDisabled()
  })
})
```

### Integration Testing

#### Example 13: End-to-End Analysis Flow

```typescript
import { test, expect } from '@playwright/test'

test('complete profile analysis flow', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:5173')

  // Fill in username
  await page.fill('[data-testid="username-input"]', 'billgates')

  // Start analysis
  await page.click('[data-testid="analyze-button"]')

  // Wait for loading to complete
  await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'detached' })

  // Verify results are displayed
  await expect(page.locator('[data-testid="profile-score"]')).toBeVisible()
  await expect(page.locator('[data-testid="skills-list"]')).toBeVisible()
  await expect(page.locator('[data-testid="recommendations"]')).toBeVisible()

  // Check that score is reasonable
  const scoreText = await page.textContent('[data-testid="profile-score"]')
  const score = parseInt(scoreText?.match(/\d+/)?.[0] || '0')
  expect(score).toBeGreaterThan(0)
  expect(score).toBeLessThanOrEqual(100)

  // Verify skills are shown
  const skillsCount = await page.locator('[data-testid="skill-item"]').count()
  expect(skillsCount).toBeGreaterThan(0)

  // Test filtering functionality
  await page.click('[data-testid="filter-technical-skills"]')
  await page.waitForTimeout(500) // Wait for filter to apply
  
  const filteredSkillsCount = await page.locator('[data-testid="skill-item"]:visible').count()
  expect(filteredSkillsCount).toBeLessThanOrEqual(skillsCount)
})

test('error handling for invalid username', async ({ page }) => {
  await page.goto('http://localhost:5173')

  // Try with invalid username
  await page.fill('[data-testid="username-input"]', 'invalid-user-12345')
  await page.click('[data-testid="analyze-button"]')

  // Wait for error message
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
  await expect(page.locator('[data-testid="error-message"]')).toContainText(/not found|invalid/i)
})
```

## 🔗 Advanced Integration Patterns

### Custom Hook Examples

#### Example 14: Advanced Profile Management Hook

```typescript
import { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useDebounce } from './useDebounce'

interface UseProfileManagerOptions {
  autoSave?: boolean
  cacheEnabled?: boolean
  retryAttempts?: number
}

export function useProfileManager(options: UseProfileManagerOptions = {}) {
  const { autoSave = true, cacheEnabled = true, retryAttempts = 3 } = options
  
  const [profiles, setProfiles] = useLocalStorage<ProfileData[]>('analyzed-profiles', [])
  const [currentProfile, setCurrentProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Debounce profile updates for auto-save
  const debouncedProfile = useDebounce(currentProfile, 1000)

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && debouncedProfile && currentProfile) {
      saveProfile(debouncedProfile)
    }
  }, [debouncedProfile, autoSave])

  const analyzeProfile = useCallback(async (username: string, force = false) => {
    setLoading(true)
    setError(null)

    try {
      // Check cache first
      if (cacheEnabled && !force) {
        const cached = profiles.find(p => p.username === username)
        if (cached && isCacheValid(cached)) {
          setCurrentProfile(cached)
          setLoading(false)
          return cached
        }
      }

      // Perform analysis with retry logic
      let lastError: Error | null = null
      for (let attempt = 1; attempt <= retryAttempts; attempt++) {
        try {
          const profileData = await linkedInService.getProfileData(username)
          const insights = await linkedInService.getProfileInsights(username, profileData)
          
          const completeProfile = {
            ...profileData,
            insights,
            analyzedAt: new Date().toISOString(),
            cacheExpiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
          }

          setCurrentProfile(completeProfile)
          
          if (autoSave) {
            saveProfile(completeProfile)
          }

          setLoading(false)
          return completeProfile
        } catch (error) {
          lastError = error as Error
          if (attempt < retryAttempts) {
            await new Promise(resolve => setTimeout(resolve, attempt * 1000))
          }
        }
      }

      throw lastError
    } catch (error) {
      setError(error as Error)
      setLoading(false)
      throw error
    }
  }, [profiles, cacheEnabled, retryAttempts, autoSave])

  const saveProfile = useCallback((profile: ProfileData) => {
    setProfiles(prev => {
      const existing = prev.findIndex(p => p.username === profile.username)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = profile
        return updated
      }
      return [profile, ...prev.slice(0, 9)] // Keep last 10 profiles
    })
  }, [setProfiles])

  const deleteProfile = useCallback((username: string) => {
    setProfiles(prev => prev.filter(p => p.username !== username))
    if (currentProfile?.username === username) {
      setCurrentProfile(null)
    }
  }, [setProfiles, currentProfile])

  const clearCache = useCallback(() => {
    setProfiles([])
    setCurrentProfile(null)
  }, [setProfiles])

  const getProfileHistory = useCallback((username: string) => {
    return profiles
      .filter(p => p.username === username)
      .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())
  }, [profiles])

  return {
    currentProfile,
    profiles,
    loading,
    error,
    analyzeProfile,
    saveProfile,
    deleteProfile,
    clearCache,
    getProfileHistory
  }
}

function isCacheValid(profile: ProfileData): boolean {
  return profile.cacheExpiry ? Date.now() < profile.cacheExpiry : false
}
```

These examples provide a comprehensive foundation for building with the LinkedIn Analytics & Growth Advisor. Each example includes error handling, TypeScript types, and follows React best practices. Use them as starting points for your own implementations!