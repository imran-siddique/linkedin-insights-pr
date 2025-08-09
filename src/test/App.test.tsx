import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'

// Mock the hooks
vi.mock('@/hooks/useKV', () => ({
  useKV: vi.fn(() => [null, vi.fn(), vi.fn()])
}))

// Mock all the service modules
vi.mock('../lib/linkedin-api', () => ({
  linkedInService: {
    extractLinkedInUsername: vi.fn((input) => 'testuser'),
    getProfileInsights: vi.fn().mockResolvedValue({
      strengths: ['Strong profile', 'Good engagement'],
      improvements: ['Add more skills', 'Post more frequently']
    }),
    getActivityMetrics: vi.fn().mockResolvedValue({
      avgPostsPerWeek: 3,
      engagementTrend: 'increasing',
      audienceGrowth: 45,
      bestPostingTimes: ['10:00 AM', '2:00 PM'],
      bestPostingDays: ['Tuesday', 'Wednesday']
    }),
    analyzeVisualBranding: vi.fn().mockResolvedValue({
      hasPhoto: true,
      hasBanner: false,
      recommendations: ['Add a custom banner', 'Update profile photo']
    }),
    performCompetitiveAnalysis: vi.fn().mockResolvedValue({
      userRanking: {
        followers: { rank: 15, percentile: 75 },
        engagement: { rank: 8, percentile: 85 },
        profileScore: { rank: 12, percentile: 80 },
        overallScore: { rank: 10, percentile: 82 }
      },
      marketPositioning: {
        currentPosition: 'senior',
        recommendedPosition: 'Move towards thought leadership',
        strengthAreas: ['Technical expertise', 'Industry knowledge']
      },
      industryBenchmarks: {
        avgFollowers: 3500,
        avgEngagement: 4.2,
        avgProfileScore: 75
      },
      userProfile: {
        followers: 4200,
        engagement: 5.1,
        profileScore: 82,
        industry: 'Technology'
      },
      gapAnalysis: [],
      competitors: [],
      competitorInsights: []
    }),
    generateCompensationAnalysis: vi.fn().mockResolvedValue({
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
      userProfile: {
        location: 'San Francisco, CA'
      },
      skillImpact: [],
      industryBenchmarks: []
    })
  }
}))

vi.mock('../lib/skills-analysis', () => ({
  skillsAnalysisService: {
    analyzeSkills: vi.fn().mockResolvedValue({
      overallScore: 8.5,
      marketAlignment: { alignmentScore: 8 },
      competitiveAdvantage: {
        competitiveScore: 7,
        rarityScore: 6,
        uniqueSkills: ['React', 'TypeScript'],
        skillCombinations: ['React + TypeScript', 'Node.js + MongoDB'],
        differentiators: ['Full-stack expertise', 'Modern tech stack']
      },
      categoryBreakdown: [
        {
          category: 'Frontend Development',
          categoryScore: 9,
          marketDemand: 'very-high',
          description: 'Modern frontend technologies',
          icon: '💻',
          skills: [
            { name: 'React', marketValue: 9 },
            { name: 'TypeScript', marketValue: 8 }
          ]
        }
      ],
      skillGaps: [
        {
          category: 'backend',
          priority: 'important',
          timeToAcquire: '3-6 months',
          cost: 'low',
          impact: 'High impact on full-stack capabilities',
          missingSkills: ['Docker', 'Kubernetes'],
          roi: 8
        }
      ],
      learningPath: {
        totalDuration: '6-12 months',
        estimatedCost: { min: 500, max: 2000 },
        difficulty: 'intermediate',
        timeCommitment: '10-15 hours/week',
        phases: [
          {
            phase: 'Foundation Building',
            duration: '2 months',
            skills: ['Docker Basics', 'CI/CD Fundamentals'],
            resources: [
              { title: 'Docker Documentation', type: 'docs', cost: 'free' },
              { title: 'CI/CD Course', type: 'course', cost: 'paid' }
            ],
            projects: [
              { title: 'Containerize React App' },
              { title: 'Setup CI/CD Pipeline' }
            ]
          }
        ]
      },
      skillTrends: [
        {
          skill: 'React',
          trend: 'stable',
          trendScore: 1,
          jobPostingsGrowth: 5,
          salaryTrend: 3,
          geographic: [{ location: 'San Francisco', growth: 10 }]
        }
      ]
    })
  }
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /linkedin analytics/i })).toBeInTheDocument()
  })

  it('renders the input form', () => {
    render(<App />)
    expect(screen.getByLabelText(/linkedin profile url/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /analyze profile/i })).toBeInTheDocument()
  })

  it('shows validation error for invalid input', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByLabelText(/linkedin profile url/i)
    await user.type(input, 'invalid-url')
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid linkedin/i)).toBeInTheDocument()
    })
  })

  it('accepts valid LinkedIn URL', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByLabelText(/linkedin profile url/i)
    await user.type(input, 'https://linkedin.com/in/testuser')
    
    await waitFor(() => {
      expect(screen.queryByText(/please enter a valid linkedin/i)).not.toBeInTheDocument()
    })
  })

  it('shows loading state when analyzing', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByLabelText(/linkedin profile url/i)
    const button = screen.getByRole('button', { name: /analyze profile/i })
    
    await user.type(input, 'https://linkedin.com/in/testuser')
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/analyzing.../i)).toBeInTheDocument()
    })
  })

  it('disables button when input is invalid', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByLabelText(/linkedin profile url/i)
    const button = screen.getByRole('button', { name: /analyze profile/i })
    
    await user.type(input, 'invalid')
    
    await waitFor(() => {
      expect(button).toBeDisabled()
    })
  })

  it('enables button when input is valid', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByLabelText(/linkedin profile url/i)
    const button = screen.getByRole('button', { name: /analyze profile/i })
    
    await user.type(input, 'https://linkedin.com/in/testuser')
    
    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })
})

describe('App Integration', () => {
  it('handles the complete analysis flow', async () => {
    const user = userEvent.setup()
    
    // Mock successful analysis
    const mockProfileData = {
      name: 'John Doe',
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
    }

    // Mock the useKV hook to return mock data
    const { useKV } = await import('@/hooks/useKV')
    vi.mocked(useKV).mockImplementation((key) => {
      if (key === 'profile-data') {
        return [mockProfileData, vi.fn(), vi.fn()]
      }
      return [null, vi.fn(), vi.fn()]
    })

    render(<App />)
    
    const input = screen.getByLabelText(/linkedin profile url/i)
    await user.type(input, 'https://linkedin.com/in/testuser')
    
    const button = screen.getByRole('button', { name: /analyze profile/i })
    await user.click(button)
    
    // Check that analysis started
    await waitFor(() => {
      expect(screen.getByText(/analyzing.../i)).toBeInTheDocument()
    })
  })
})