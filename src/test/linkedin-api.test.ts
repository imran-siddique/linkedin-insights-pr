import { describe, it, expect, vi, beforeEach } from 'vitest'
import { linkedInService } from '../lib/linkedin-api'

// Mock the global spark object
const mockSpark = {
  llmPrompt: vi.fn((strings, ...values) => strings.join('')),
  llm: vi.fn().mockResolvedValue('{"result": "mock response"}'),
}

vi.stubGlobal('spark', mockSpark)

describe('LinkedIn API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('extractLinkedInUsername', () => {
    it('extracts username from full LinkedIn URL', () => {
      const testCases = [
        { input: 'https://linkedin.com/in/johndoe', expected: 'johndoe' },
        { input: 'https://www.linkedin.com/in/johndoe/', expected: 'johndoe' },
        { input: 'linkedin.com/in/jane-smith', expected: 'jane-smith' },
        { input: 'johndoe', expected: 'johndoe' }
      ]

      testCases.forEach(({ input, expected }) => {
        const result = linkedInService.extractLinkedInUsername(input)
        expect(result).toBe(expected)
      })
    })

    it('returns null for invalid URLs', () => {
      const invalidInputs = [
        '',
        'https://facebook.com/user',
        'not-a-url',
        'https://linkedin.com/company/test'
      ]

      invalidInputs.forEach(input => {
        const result = linkedInService.extractLinkedInUsername(input)
        expect(result).toBeNull()
      })
    })
  })

  describe('getProfileInsights', () => {
    it('generates profile insights', async () => {
      const profileData = {
        name: 'John Doe',
        industry: 'Technology',
        skills: ['JavaScript', 'React'],
        followers: 5000,
        connections: 1000,
        experience: 5,
        profileScore: 85
      }

      mockSpark.llm.mockResolvedValueOnce(JSON.stringify({
        strengths: ['Strong technical skills', 'Good engagement'],
        improvements: ['Add more content', 'Expand network']
      }))

      const result = await linkedInService.getProfileInsights('johndoe', profileData)
      
      expect(result).toBeTruthy()
      expect(result.strengths).toBeInstanceOf(Array)
      expect(result.improvements).toBeInstanceOf(Array)
      expect(mockSpark.llm).toHaveBeenCalled()
    })

    it('handles API errors gracefully', async () => {
      mockSpark.llm.mockRejectedValueOnce(new Error('API Error'))

      const profileData = {
        name: 'John Doe',
        industry: 'Tech',
        skills: [],
        followers: 100,
        connections: 50,
        experience: 1,
        profileScore: 60
      }

      const result = await linkedInService.getProfileInsights('johndoe', profileData)
      
      expect(result.strengths).toEqual(['Profile analysis in progress'])
      expect(result.improvements).toEqual(['Profile analysis in progress'])
    })
  })

  describe('getActivityMetrics', () => {
    it('calculates activity metrics based on profile data', async () => {
      const profileData = {
        followers: 5000,
        posts: 50,
        engagement: 4.5,
        followerGrowthTrend: 'increasing' as const,
        contentFrequency: 'weekly' as const
      }

      const result = await linkedInService.getActivityMetrics(profileData)
      
      expect(result.avgPostsPerWeek).toBeGreaterThan(0)
      expect(result.engagementTrend).toMatch(/increasing|decreasing|stable/)
      expect(result.audienceGrowth).toBeGreaterThan(0)
      expect(result.bestPostingTimes).toBeInstanceOf(Array)
      expect(result.bestPostingDays).toBeInstanceOf(Array)
    })

    it('handles different content frequencies', async () => {
      const testCases = [
        { contentFrequency: 'daily' as const, expectedMin: 5 },
        { contentFrequency: 'weekly' as const, expectedMin: 1 },
        { contentFrequency: 'monthly' as const, expectedMax: 1 },
        { contentFrequency: 'rarely' as const, expectedMax: 0.5 }
      ]

      for (const { contentFrequency, expectedMin, expectedMax } of testCases) {
        const profileData = {
          followers: 1000,
          posts: 10,
          engagement: 3.0,
          followerGrowthTrend: 'stable' as const,
          contentFrequency
        }

        const result = await linkedInService.getActivityMetrics(profileData)
        
        if (expectedMin) {
          expect(result.avgPostsPerWeek).toBeGreaterThanOrEqual(expectedMin)
        }
        if (expectedMax) {
          expect(result.avgPostsPerWeek).toBeLessThanOrEqual(expectedMax)
        }
      }
    })
  })

  describe('analyzeVisualBranding', () => {
    it('provides visual branding analysis', async () => {
      const result = await linkedInService.analyzeVisualBranding('johndoe')
      
      expect(result).toHaveProperty('hasPhoto')
      expect(result).toHaveProperty('hasBanner')
      expect(result).toHaveProperty('recommendations')
      expect(result.recommendations).toBeInstanceOf(Array)
    })
  })

  describe('performCompetitiveAnalysis', () => {
    it('performs competitive analysis', async () => {
      const profileData = {
        name: 'John Doe',
        industry: 'Technology',
        followers: 5000,
        engagement: 4.5,
        skills: ['JavaScript', 'React'],
        experience: 5,
        profileScore: 85,
        roleLevel: 'senior' as const
      }

      mockSpark.llm.mockResolvedValueOnce(JSON.stringify({
        competitors: [
          {
            id: 'comp1',
            name: 'Jane Smith',
            followers: 8000,
            engagement: 5.2,
            experience: 7,
            isInfluencer: false,
            growthRate: 15,
            headline: 'Senior Developer',
            keyStrengths: ['Leadership', 'Technical'],
            contentStrategy: ['Technical posts', 'Industry news']
          }
        ]
      }))

      const result = await linkedInService.performCompetitiveAnalysis(profileData)
      
      expect(result).toHaveProperty('userRanking')
      expect(result).toHaveProperty('marketPositioning')
      expect(result).toHaveProperty('industryBenchmarks')
      expect(result).toHaveProperty('competitors')
      expect(result.competitors).toBeInstanceOf(Array)
    })
  })

  describe('generateCompensationAnalysis', () => {
    it('generates compensation analysis', async () => {
      const profileData = {
        name: 'John Doe',
        industry: 'Technology',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: 5,
        roleLevel: 'senior' as const,
        location: 'San Francisco, CA'
      }

      const result = await linkedInService.generateCompensationAnalysis(profileData)
      
      expect(result).toHaveProperty('currentMarketPosition')
      expect(result).toHaveProperty('benchmarkComparison')
      expect(result).toHaveProperty('skillImpact')
      expect(result.currentMarketPosition.estimatedSalaryRange).toHaveProperty('min')
      expect(result.currentMarketPosition.estimatedSalaryRange).toHaveProperty('median')
      expect(result.currentMarketPosition.estimatedSalaryRange).toHaveProperty('max')
    })

    it('adjusts compensation based on experience level', async () => {
      const juniorProfile = {
        name: 'Junior Dev',
        industry: 'Technology',
        skills: ['JavaScript'],
        experience: 1,
        roleLevel: 'entry' as const,
        location: 'Austin, TX'
      }

      const seniorProfile = {
        name: 'Senior Dev',
        industry: 'Technology',
        skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
        experience: 8,
        roleLevel: 'senior' as const,
        location: 'San Francisco, CA'
      }

      const juniorResult = await linkedInService.generateCompensationAnalysis(juniorProfile)
      const seniorResult = await linkedInService.generateCompensationAnalysis(seniorProfile)
      
      expect(seniorResult.currentMarketPosition.estimatedSalaryRange.median)
        .toBeGreaterThan(juniorResult.currentMarketPosition.estimatedSalaryRange.median)
    })
  })
})