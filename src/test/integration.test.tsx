import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'

// Mock all external dependencies
vi.mock('@/hooks/useKV', () => ({
  useKV: vi.fn()
}))

vi.mock('../lib/linkedin-api', () => ({
  linkedInService: {
    extractLinkedInUsername: vi.fn(),
    getProfileInsights: vi.fn(),
    getActivityMetrics: vi.fn(),
    analyzeVisualBranding: vi.fn(),
    performCompetitiveAnalysis: vi.fn(),
    generateCompensationAnalysis: vi.fn()
  }
}))

vi.mock('../lib/skills-analysis', () => ({
  skillsAnalysisService: {
    analyzeSkills: vi.fn()
  }
}))

vi.mock('../components/ScrapingManager', () => ({
  default: vi.fn(({ onScrapingComplete, autoStart }) => {
    // Auto-trigger success callback for testing
    if (autoStart) {
      setTimeout(() => {
        onScrapingComplete({
          success: true,
          data: {
            name: 'Test User',
            industry: 'Technology',
            followers: 5000,
            connections: 1500,
            posts: 50,
            engagement: 4.5,
            skills: ['JavaScript', 'React', 'Node.js'],
            experience: 5,
            roleLevel: 'senior',
            profileScore: 85,
            contentFrequency: 'weekly',
            followerGrowthTrend: 'increasing',
            dataFreshness: 'real-time',
            confidenceScore: 0.9
          },
          source: 'api',
          confidence: 0.9,
          timestamp: Date.now()
        })
      }, 100)
    }
    
    return (
      <div data-testid="scraping-manager">
        <p>Scraping Manager Mock</p>
      </div>
    )
  })
}))

describe('App Integration Tests', () => {
  let mockUseKV: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup mock for useKV hook
    mockUseKV = vi.fn()
    const { useKV } = vi.mocked(require('@/hooks/useKV'))
    useKV.mockImplementation(mockUseKV)
    
    // Default mock implementation
    mockUseKV.mockImplementation((key: string) => {
      const mockSetters = {
        'profile-data': [null, vi.fn(), vi.fn()],
        'recommendations': [[], vi.fn(), vi.fn()],
        'trending-topics': [[], vi.fn(), vi.fn()],
        'skill-insights': [[], vi.fn(), vi.fn()],
        'profile-insights': [null, vi.fn(), vi.fn()],
        'activity-metrics': [null, vi.fn(), vi.fn()],
        'visual-branding': [null, vi.fn(), vi.fn()],
        'competitive-analysis': [null, vi.fn(), vi.fn()],
        'compensation-analysis': [null, vi.fn(), vi.fn()],
        'skills-analysis': [null, vi.fn(), vi.fn()],
        'last-analysis-time': [null, vi.fn(), vi.fn()]
      }
      return mockSetters[key] || [null, vi.fn(), vi.fn()]
    })
  })

  it('completes full analysis workflow', async () => {
    const user = userEvent.setup()
    
    // Mock services
    const { linkedInService } = vi.mocked(require('../lib/linkedin-api'))
    const { skillsAnalysisService } = vi.mocked(require('../lib/skills-analysis'))
    
    linkedInService.extractLinkedInUsername.mockReturnValue('testuser')
    linkedInService.getProfileInsights.mockResolvedValue({
      strengths: ['Strong profile', 'Good engagement'],
      improvements: ['Add more content', 'Expand network']
    })
    linkedInService.getActivityMetrics.mockResolvedValue({
      avgPostsPerWeek: 3,
      engagementTrend: 'increasing',
      audienceGrowth: 45,
      bestPostingTimes: ['10:00 AM'],
      bestPostingDays: ['Tuesday']
    })
    linkedInService.analyzeVisualBranding.mockResolvedValue({
      hasPhoto: true,
      hasBanner: false,
      recommendations: ['Add banner']
    })
    linkedInService.performCompetitiveAnalysis.mockResolvedValue({
      userRanking: {
        followers: { rank: 15, percentile: 75 },
        engagement: { rank: 8, percentile: 85 },
        profileScore: { rank: 12, percentile: 80 },
        overallScore: { rank: 10, percentile: 82 }
      },
      marketPositioning: {
        currentPosition: 'senior',
        recommendedPosition: 'Thought leader',
        strengthAreas: ['Technical expertise']
      },
      industryBenchmarks: { avgFollowers: 3500, avgEngagement: 4.2, avgProfileScore: 75 },
      userProfile: { followers: 5000, engagement: 4.5, profileScore: 85, industry: 'Technology' },
      gapAnalysis: [],
      competitors: [],
      competitorInsights: []
    })
    linkedInService.generateCompensationAnalysis.mockResolvedValue({
      currentMarketPosition: {
        estimatedSalaryRange: { min: 80000, median: 95000, max: 120000 },
        percentileRanking: 70,
        skillPremium: 15,
        locationAdjustment: 5
      },
      benchmarkComparison: {
        industryMedian: 85000,
        roleMedian: 92000,
        locationMedian: 88000,
        experienceMedian: 90000,
        userEstimate: 95000
      },
      userProfile: { location: 'San Francisco, CA' },
      skillImpact: [],
      industryBenchmarks: []
    })
    skillsAnalysisService.analyzeSkills.mockResolvedValue({
      overallScore: 8.5,
      marketAlignment: { alignmentScore: 8 },
      competitiveAdvantage: {
        competitiveScore: 7,
        rarityScore: 6,
        uniqueSkills: ['React', 'TypeScript'],
        skillCombinations: ['React + TypeScript'],
        differentiators: ['Full-stack expertise']
      },
      categoryBreakdown: [],
      skillGaps: [],
      learningPath: {
        totalDuration: '6 months',
        estimatedCost: { min: 500, max: 1500 },
        difficulty: 'intermediate',
        timeCommitment: '10 hours/week',
        phases: []
      },
      skillTrends: []
    })
    
    render(<App />)
    
    // Step 1: Enter LinkedIn profile
    const input = screen.getByLabelText(/linkedin profile url/i)
    await user.type(input, 'https://linkedin.com/in/testuser')
    
    // Step 2: Start analysis
    const analyzeButton = screen.getByRole('button', { name: /analyze profile/i })
    await user.click(analyzeButton)
    
    // Step 3: Wait for scraping to complete and data to be processed
    await waitFor(() => {
      expect(screen.queryByText(/analyzing/i)).not.toBeInTheDocument()
    }, { timeout: 5000 })
    
    // Step 4: Verify profile data is displayed
    await waitFor(() => {
      expect(screen.getByText(/5,000/)).toBeInTheDocument() // Followers count
    })
    
    // Step 5: Check tabs are accessible
    expect(screen.getByRole('tab', { name: /recommendations/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /skills analysis/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /trends/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /competition/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /salary/i })).toBeInTheDocument()
    
    // Step 6: Navigate to different tabs
    const skillsTab = screen.getByRole('tab', { name: /skills analysis/i })
    await user.click(skillsTab)
    
    await waitFor(() => {
      expect(screen.getByText(/comprehensive skills analysis/i)).toBeInTheDocument()
    })
    
    // Step 7: Check competitive analysis tab
    const competitionTab = screen.getByRole('tab', { name: /competition/i })
    await user.click(competitionTab)
    
    await waitFor(() => {
      expect(screen.getByText(/competitive analysis/i)).toBeInTheDocument()
    })
    
    // Step 8: Check salary analysis tab
    const salaryTab = screen.getByRole('tab', { name: /salary/i })
    await user.click(salaryTab)
    
    await waitFor(() => {
      expect(screen.getByText(/salary & compensation analysis/i)).toBeInTheDocument()
    })
  })

  it('handles analysis errors gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock service failures
    const { linkedInService } = vi.mocked(require('../lib/linkedin-api'))
    linkedInService.extractLinkedInUsername.mockReturnValue('testuser')
    
    // Mock ScrapingManager to trigger error
    const ScrapingManager = vi.mocked(require('../components/ScrapingManager')).default
    ScrapingManager.mockImplementation(({ onScrapingError, autoStart }) => {
      if (autoStart) {
        setTimeout(() => {
          onScrapingError('Profile not found')
        }, 100)
      }
      return <div data-testid="scraping-manager">Scraping Manager Mock</div>
    })
    
    render(<App />)
    
    const input = screen.getByLabelText(/linkedin profile url/i)
    await user.type(input, 'https://linkedin.com/in/testuser')
    
    const analyzeButton = screen.getByRole('button', { name: /analyze profile/i })
    await user.click(analyzeButton)
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/scraping failed/i)).toBeInTheDocument()
    })
  })

  it('validates input correctly', async () => {
    const user = userEvent.setup()
    
    render(<App />)
    
    const input = screen.getByLabelText(/linkedin profile url/i)
    const analyzeButton = screen.getByRole('button', { name: /analyze profile/i })
    
    // Test invalid input
    await user.type(input, 'invalid-input')
    
    await waitFor(() => {
      expect(analyzeButton).toBeDisabled()
    })
    
    // Test valid input
    await user.clear(input)
    await user.type(input, 'https://linkedin.com/in/validuser')
    
    await waitFor(() => {
      expect(analyzeButton).not.toBeDisabled()
    })
  })

  it('shows loading states during analysis', async () => {
    const user = userEvent.setup()
    
    render(<App />)
    
    const input = screen.getByLabelText(/linkedin profile url/i)
    await user.type(input, 'https://linkedin.com/in/testuser')
    
    const analyzeButton = screen.getByRole('button', { name: /analyze profile/i })
    await user.click(analyzeButton)
    
    // Should show loading state
    expect(screen.getByText(/analyzing/i)).toBeInTheDocument()
    
    // Button should be disabled during loading
    expect(analyzeButton).toBeDisabled()
  })

  it('persists data between sessions', async () => {
    const user = userEvent.setup()
    
    // Mock that profile data already exists
    mockUseKV.mockImplementation((key: string) => {
      if (key === 'profile-data') {
        return [{
          name: 'Existing User',
          followers: 3000,
          skills: ['Python', 'Django'],
          industry: 'Technology'
        }, vi.fn(), vi.fn()]
      }
      return [null, vi.fn(), vi.fn()]
    })
    
    render(<App />)
    
    // Should display existing profile data
    await waitFor(() => {
      expect(screen.getByText(/3,000/)).toBeInTheDocument() // Followers
    })
  })
})