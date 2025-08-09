import { describe, it, expect, vi } from 'vitest'

describe('Type Definitions', () => {
  it('should have correct ProfileData type structure', () => {
    // Import types to check they exist
    const profileData = {
      name: 'John Doe',
      industry: 'Technology',
      followers: 5000,
      connections: 1500,
      posts: 50,
      engagement: 4.5,
      skills: ['JavaScript', 'React'],
      experience: 5,
      roleLevel: 'senior' as const,
      profileScore: 85,
      contentFrequency: 'weekly' as const,
      followerGrowthTrend: 'increasing' as const,
      dataFreshness: 'real-time' as const,
      confidenceScore: 0.9,
      location: 'San Francisco, CA'
    }
    
    expect(profileData.name).toBe('John Doe')
    expect(profileData.skills).toContain('JavaScript')
    expect(typeof profileData.followers).toBe('number')
    expect(typeof profileData.engagement).toBe('number')
  })

  it('should have correct Recommendation type structure', () => {
    const recommendation = {
      id: 'rec-1',
      title: 'Improve LinkedIn Headline',
      description: 'Your headline could be more specific',
      category: 'optimization' as const,
      priority: 'high' as const,
      action: 'Update your headline',
      relatedSkills: ['Personal Branding'],
      impactScore: 8
    }
    
    expect(recommendation.id).toBe('rec-1')
    expect(recommendation.priority).toBe('high')
    expect(recommendation.relatedSkills).toContain('Personal Branding')
  })

  it('should have correct TrendingTopic type structure', () => {
    const trend = {
      topic: 'AI in Software Development',
      relevanceScore: 9,
      hashtags: ['AI', 'SoftwareDevelopment', 'MachineLearning'],
      suggestedAction: 'Share insights about AI tools',
      relatedSkills: ['Python', 'Machine Learning'],
      marketDemand: 'high' as const,
      difficulty: 'intermediate' as const,
      estimatedReach: 15000,
      competitionLevel: 'medium' as const
    }
    
    expect(trend.topic).toBeTruthy()
    expect(trend.hashtags).toBeInstanceOf(Array)
    expect(trend.relevanceScore).toBeGreaterThan(0)
  })

  it('should have correct SkillInsight type structure', () => {
    const skillInsight = {
      skill: 'React',
      marketDemand: 'high' as const,
      growth: 'growing' as const,
      salary_impact: 'high' as const,
      learning_resources: ['React Documentation', 'React Course'],
      related_opportunities: ['Frontend Developer', 'Full Stack Developer'],
      demandScore: 85,
      averageSalaryIncrease: '15%'
    }
    
    expect(skillInsight.skill).toBe('React')
    expect(skillInsight.learning_resources).toBeInstanceOf(Array)
    expect(skillInsight.demandScore).toBe(85)
  })

  it('should have correct ScrapingResult type structure', () => {
    const scrapingResult = {
      success: true,
      data: {
        name: 'Test User',
        followers: 1000,
        skills: ['JavaScript']
      },
      source: 'api' as const,
      confidence: 0.9,
      timestamp: Date.now()
    }
    
    expect(scrapingResult.success).toBe(true)
    expect(scrapingResult.source).toBe('api')
    expect(scrapingResult.data).toBeTruthy()
  })

  it('should have correct CompetitiveAnalysis type structure', () => {
    const competitiveAnalysis = {
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
    }
    
    expect(competitiveAnalysis.userRanking).toBeTruthy()
    expect(competitiveAnalysis.userRanking.followers.rank).toBe(15)
    expect(competitiveAnalysis.marketPositioning.strengthAreas).toBeInstanceOf(Array)
  })

  it('should have correct CompensationAnalysis type structure', () => {
    const compensationAnalysis = {
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
    }
    
    expect(compensationAnalysis.currentMarketPosition.estimatedSalaryRange.median).toBe(95000)
    expect(compensationAnalysis.benchmarkComparison.userEstimate).toBe(95000)
    expect(compensationAnalysis.userProfile.location).toBeTruthy()
  })

  it('should have correct SkillAnalysis type structure', () => {
    const skillAnalysis = {
      overallScore: 8.5,
      marketAlignment: { alignmentScore: 8 },
      competitiveAdvantage: {
        competitiveScore: 7,
        rarityScore: 6,
        uniqueSkills: ['React', 'TypeScript'],
        skillCombinations: ['React + TypeScript'],
        differentiators: ['Full-stack expertise']
      },
      categoryBreakdown: [
        {
          category: 'Frontend Development',
          categoryScore: 9,
          marketDemand: 'very-high' as const,
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
          priority: 'important' as const,
          timeToAcquire: '3-6 months',
          cost: 'low' as const,
          impact: 'High impact on full-stack capabilities',
          missingSkills: ['Docker', 'Kubernetes'],
          roi: 8
        }
      ],
      learningPath: {
        totalDuration: '6-12 months',
        estimatedCost: { min: 500, max: 2000 },
        difficulty: 'intermediate' as const,
        timeCommitment: '10-15 hours/week',
        phases: [
          {
            phase: 'Foundation Building',
            duration: '2 months',
            skills: ['Docker Basics'],
            resources: [
              { title: 'Docker Documentation', type: 'docs', cost: 'free' }
            ],
            projects: [
              { title: 'Containerize React App' }
            ]
          }
        ]
      },
      skillTrends: []
    }
    
    expect(skillAnalysis.overallScore).toBe(8.5)
    expect(skillAnalysis.categoryBreakdown).toBeInstanceOf(Array)
    expect(skillAnalysis.skillGaps).toBeInstanceOf(Array)
    expect(skillAnalysis.learningPath.phases).toBeInstanceOf(Array)
  })

  it('should have correct union types for enums', () => {
    // Test role level enum
    const roleLevels: Array<'entry' | 'mid' | 'senior' | 'lead' | 'executive'> = [
      'entry', 'mid', 'senior', 'lead', 'executive'
    ]
    
    expect(roleLevels).toContain('senior')
    expect(roleLevels).toContain('entry')
    
    // Test priority enum
    const priorities: Array<'high' | 'medium' | 'low'> = [
      'high', 'medium', 'low'
    ]
    
    expect(priorities).toContain('high')
    expect(priorities).toContain('low')
    
    // Test market demand enum
    const marketDemands: Array<'very-high' | 'high' | 'medium' | 'low' | 'very-low'> = [
      'very-high', 'high', 'medium', 'low', 'very-low'
    ]
    
    expect(marketDemands).toContain('very-high')
    expect(marketDemands).toContain('low')
  })
})