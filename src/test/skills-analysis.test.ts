import { describe, it, expect, vi, beforeEach } from 'vitest'
import { skillsAnalysisService } from '../lib/skills-analysis'

// Mock the global spark object
const mockSpark = {
  llmPrompt: vi.fn((strings, ...values) => strings.join('')),
  llm: vi.fn().mockResolvedValue('{"result": "mock response"}'),
}

vi.stubGlobal('spark', mockSpark)

describe('Skills Analysis Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('analyzeSkills', () => {
    it('performs comprehensive skills analysis', async () => {
      const profileData = {
        name: 'John Doe',
        industry: 'Technology',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        experience: 5,
        roleLevel: 'senior' as const
      }

      // Mock AI response for skills analysis
      mockSpark.llm.mockResolvedValueOnce(JSON.stringify({
        overallScore: 8.5,
        marketAlignment: { alignmentScore: 8 },
        competitiveAdvantage: {
          competitiveScore: 7,
          rarityScore: 6,
          uniqueSkills: ['TypeScript', 'React'],
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
        ]
      }))

      const result = await skillsAnalysisService.analyzeSkills(profileData)
      
      expect(result).toHaveProperty('overallScore')
      expect(result).toHaveProperty('marketAlignment')
      expect(result).toHaveProperty('competitiveAdvantage')
      expect(result).toHaveProperty('categoryBreakdown')
      expect(result).toHaveProperty('skillGaps')
      expect(result).toHaveProperty('learningPath')
      
      expect(result.overallScore).toBeGreaterThan(0)
      expect(result.overallScore).toBeLessThanOrEqual(10)
      expect(result.categoryBreakdown).toBeInstanceOf(Array)
      expect(result.skillGaps).toBeInstanceOf(Array)
    })

    it('handles different experience levels', async () => {
      const juniorProfile = {
        name: 'Junior Dev',
        industry: 'Technology',
        skills: ['JavaScript', 'HTML', 'CSS'],
        experience: 1,
        roleLevel: 'entry' as const
      }

      const seniorProfile = {
        name: 'Senior Dev',
        industry: 'Technology',
        skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'Docker'],
        experience: 8,
        roleLevel: 'senior' as const
      }

      // Mock different responses based on experience
      mockSpark.llm
        .mockResolvedValueOnce(JSON.stringify({ overallScore: 6.0 }))
        .mockResolvedValueOnce(JSON.stringify({ overallScore: 8.5 }))

      const juniorResult = await skillsAnalysisService.analyzeSkills(juniorProfile)
      const seniorResult = await skillsAnalysisService.analyzeSkills(seniorProfile)
      
      expect(seniorResult.overallScore).toBeGreaterThan(juniorResult.overallScore)
    })

    it('generates appropriate skill gaps for different roles', async () => {
      const frontendProfile = {
        name: 'Frontend Dev',
        industry: 'Technology',
        skills: ['JavaScript', 'React', 'CSS'],
        experience: 3,
        roleLevel: 'mid' as const
      }

      mockSpark.llm.mockResolvedValueOnce(JSON.stringify({
        skillGaps: [
          {
            category: 'backend',
            priority: 'important',
            timeToAcquire: '4-6 months',
            cost: 'medium',
            impact: 'Enables full-stack development',
            missingSkills: ['Node.js', 'Express', 'MongoDB'],
            roi: 8
          },
          {
            category: 'devops',
            priority: 'beneficial',
            timeToAcquire: '2-3 months',
            cost: 'low',
            impact: 'Better deployment practices',
            missingSkills: ['Docker', 'CI/CD'],
            roi: 6
          }
        ]
      }))

      const result = await skillsAnalysisService.analyzeSkills(frontendProfile)
      
      expect(result.skillGaps).toBeInstanceOf(Array)
      expect(result.skillGaps.length).toBeGreaterThan(0)
      
      const backendGap = result.skillGaps.find(gap => gap.category === 'backend')
      expect(backendGap).toBeTruthy()
      expect(backendGap?.missingSkills).toContain('Node.js')
    })

    it('creates personalized learning paths', async () => {
      const profileData = {
        name: 'Mid-Level Dev',
        industry: 'Technology',
        skills: ['JavaScript', 'React'],
        experience: 3,
        roleLevel: 'mid' as const
      }

      const result = await skillsAnalysisService.analyzeSkills(profileData)
      
      expect(result.learningPath).toBeTruthy()
      expect(result.learningPath.totalDuration).toBeTruthy()
      expect(result.learningPath.phases).toBeInstanceOf(Array)
      expect(result.learningPath.phases.length).toBeGreaterThan(0)
      
      const firstPhase = result.learningPath.phases[0]
      expect(firstPhase).toHaveProperty('phase')
      expect(firstPhase).toHaveProperty('duration')
      expect(firstPhase).toHaveProperty('skills')
      expect(firstPhase).toHaveProperty('resources')
      expect(firstPhase).toHaveProperty('projects')
    })

    it('handles API errors gracefully', async () => {
      mockSpark.llm.mockRejectedValueOnce(new Error('AI API Error'))

      const profileData = {
        name: 'Test User',
        industry: 'Technology',
        skills: ['JavaScript'],
        experience: 2,
        roleLevel: 'mid' as const
      }

      const result = await skillsAnalysisService.analyzeSkills(profileData)
      
      // Should return fallback data
      expect(result.overallScore).toBe(5.0)
      expect(result.categoryBreakdown).toBeInstanceOf(Array)
      expect(result.skillGaps).toBeInstanceOf(Array)
    })
  })

  describe('skill trend analysis', () => {
    it('analyzes current skill market trends', async () => {
      const profileData = {
        name: 'Developer',
        industry: 'Technology',
        skills: ['React', 'Python', 'Kubernetes'],
        experience: 4,
        roleLevel: 'mid' as const
      }

      mockSpark.llm.mockResolvedValueOnce(JSON.stringify({
        skillTrends: [
          {
            skill: 'React',
            trend: 'stable',
            trendScore: 1,
            jobPostingsGrowth: 5,
            salaryTrend: 3,
            geographic: [
              { location: 'San Francisco', growth: 10 },
              { location: 'New York', growth: 8 }
            ]
          },
          {
            skill: 'Kubernetes',
            trend: 'explosive',
            trendScore: 8,
            jobPostingsGrowth: 45,
            salaryTrend: 12,
            geographic: [
              { location: 'Seattle', growth: 50 },
              { location: 'Austin', growth: 35 }
            ]
          }
        ]
      }))

      const result = await skillsAnalysisService.analyzeSkills(profileData)
      
      expect(result.skillTrends).toBeDefined()
      expect(result.skillTrends).toBeInstanceOf(Array)
      
      const kubernetesSkill = result.skillTrends?.find(s => s.skill === 'Kubernetes')
      expect(kubernetesSkill).toBeTruthy()
      expect(kubernetesSkill?.trend).toBe('explosive')
      expect(kubernetesSkill?.geographic).toBeInstanceOf(Array)
    })
  })

  describe('competitive advantage analysis', () => {
    it('identifies unique skill combinations', async () => {
      const profileData = {
        name: 'Full Stack Dev',
        industry: 'Technology',
        skills: ['React', 'Python', 'Machine Learning', 'AWS'],
        experience: 6,
        roleLevel: 'senior' as const
      }

      mockSpark.llm.mockResolvedValueOnce(JSON.stringify({
        competitiveAdvantage: {
          competitiveScore: 8.5,
          rarityScore: 7.2,
          uniqueSkills: ['Machine Learning', 'React'],
          skillCombinations: ['React + ML', 'Python + AWS', 'Full Stack + AI'],
          differentiators: [
            'Rare combination of frontend and ML skills',
            'Strong cloud deployment experience',
            'Can bridge technical and product teams'
          ]
        }
      }))

      const result = await skillsAnalysisService.analyzeSkills(profileData)
      
      expect(result.competitiveAdvantage.uniqueSkills).toContain('Machine Learning')
      expect(result.competitiveAdvantage.skillCombinations).toContain('React + ML')
      expect(result.competitiveAdvantage.differentiators.length).toBeGreaterThan(0)
    })
  })
})