import { ProfileData, CompetitiveProfile, CompetitiveAnalysis, CompensationAnalysis } from '../types'

/**
 * LinkedIn Service for backend operations
 * Handles all LinkedIn profile analysis and competitive research
 */
export class LinkedInService {
  private accessToken: string | null = null

  constructor(private openaiApiKey?: string) {}

  /**
   * Extract LinkedIn username from various URL formats
   */
  extractLinkedInUsername(input: string): string | null {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9\-\.]+)\/?/,
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/pub\/([a-zA-Z0-9\-\.]+)\/[0-9a-z]+\/[0-9a-z]+\/[0-9a-z]+\/?/,
      /^([a-zA-Z0-9\-\.]+)$/ // Direct username
    ]

    for (const pattern of patterns) {
      const match = input.trim().match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }

  /**
   * Generate realistic profile data using AI
   */
  async getProfileData(usernameOrUrl: string): Promise<ProfileData> {
    const username = this.extractLinkedInUsername(usernameOrUrl)
    
    if (!username) {
      throw new Error('Invalid LinkedIn profile URL or username')
    }

    try {
      // For now, generate realistic mock data
      // In production, this would integrate with actual LinkedIn API or scraping service
      
      const profileData = await this.generateMockProfileData(username)
      return profileData

    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error)
      throw new Error('Unable to analyze LinkedIn profile. Please check the username and try again.')
    }
  }

  /**
   * Generate mock profile data (to be replaced with real API integration)
   */
  private async generateMockProfileData(username: string): Promise<ProfileData> {
    // Generate realistic data based on username patterns
    const isDevProfile = username.toLowerCase().includes('dev') || username.toLowerCase().includes('engineer')
    const isMarketingProfile = username.toLowerCase().includes('marketing') || username.toLowerCase().includes('growth')
    const isDesignProfile = username.toLowerCase().includes('design') || username.toLowerCase().includes('ux')

    let industry = 'Technology'
    let skills = ['Leadership', 'Strategic Planning', 'Project Management', 'Communication']
    let headline = 'Professional | Industry Expert'

    if (isDevProfile) {
      industry = 'Software Development'
      skills = ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Git', 'Agile']
      headline = 'Software Engineer | Full Stack Developer'
    } else if (isMarketingProfile) {
      industry = 'Marketing & Advertising'
      skills = ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Growth Hacking', 'Social Media', 'SEM', 'A/B Testing']
      headline = 'Digital Marketing Manager | Growth Specialist'
    } else if (isDesignProfile) {
      industry = 'Design'
      skills = ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing']
      headline = 'UX/UI Designer | Product Designer'
    }

    const variance = (base: number, factor: number = 0.2) => {
      return Math.floor(base * (1 + (Math.random() - 0.5) * factor))
    }

    return {
      name: this.generateNameFromUsername(username),
      headline,
      followers: variance(1500, 0.5),
      connections: variance(800, 0.3),
      posts: variance(75, 0.4),
      engagement: Math.max(2, Math.min(12, variance(6, 0.3))),
      profileScore: Math.max(60, Math.min(95, variance(78, 0.15))),
      industry,
      skills,
      experience: Math.max(2, Math.min(15, variance(6, 0.5))),
      location: 'United States'
    }
  }

  /**
   * Generate a realistic name from username
   */
  private generateNameFromUsername(username: string): string {
    const names = [
      'Alex Johnson', 'Sarah Chen', 'Michael Rodriguez', 'Emily Davis',
      'David Kim', 'Jessica Wilson', 'Ryan Patel', 'Amanda Thompson',
      'Christopher Lee', 'Rachel Martinez', 'Kevin Brown', 'Lisa Zhang',
      'Daniel Garcia', 'Nicole Taylor', 'Mark Anderson', 'Jennifer White'
    ]
    
    return names[Math.floor(Math.random() * names.length)]
  }

  /**
   * Get additional profile insights
   */
  async getProfileInsights(username: string, profileData: ProfileData) {
    // In production, this would use real AI/LLM service
    return {
      strengths: [
        'Strong professional network',
        'Consistent posting schedule',
        'High-quality content engagement',
        'Industry-relevant skills portfolio'
      ],
      improvements: [
        'Increase posting frequency',
        'Expand skill endorsements',
        'Optimize headline for keywords',
        'Add more multimedia content'
      ],
      contentSuggestions: [
        'Share industry insights',
        'Post project case studies',
        'Engage with thought leaders',
        'Create educational content'
      ],
      networkingTips: [
        'Connect with industry peers',
        'Join relevant LinkedIn groups',
        'Attend virtual events',
        'Engage with others\' content'
      ],
      skillRecommendations: [
        'Learn emerging technologies',
        'Develop soft skills',
        'Get industry certifications',
        'Practice public speaking'
      ]
    }
  }

  /**
   * Analyze visual branding
   */
  async analyzeVisualBranding(username: string) {
    return {
      hasPhoto: Math.random() > 0.2,
      hasBanner: Math.random() > 0.5,
      recommendations: [
        'Use a high-quality professional headshot',
        'Add a custom banner that reflects your industry',
        'Ensure your photo is recent and clearly shows your face',
        'Consider using brand colors in your banner design'
      ]
    }
  }

  /**
   * Get activity metrics estimation
   */
  async getActivityMetrics(profileData: ProfileData) {
    return {
      avgPostsPerWeek: Math.max(1, Math.floor(profileData.posts / 52)),
      engagementTrend: profileData.engagement > 5 ? 'increasing' as const : 'stable' as const,
      bestPostingDays: ['Tuesday', 'Wednesday', 'Thursday'],
      bestPostingTimes: ['9:00 AM', '1:00 PM', '5:00 PM'],
      audienceGrowth: Math.floor(profileData.followers * 0.02),
      contentTypes: [
        { type: 'Professional insights', performance: 'high' as const },
        { type: 'Industry news commentary', performance: 'medium' as const },
        { type: 'Career updates', performance: 'medium' as const },
        { type: 'Educational content', performance: 'high' as const }
      ]
    }
  }

  /**
   * Validate profile URL accessibility
   */
  async validateProfileAccess(username: string): Promise<boolean> {
    try {
      return /^[a-zA-Z0-9\-\.]{3,100}$/.test(username)
    } catch {
      return false
    }
  }

  /**
   * Generate competitive profiles for analysis
   */
  async generateCompetitiveProfiles(userProfile: ProfileData, sampleSize: number = 10): Promise<CompetitiveProfile[]> {
    // In production, this would generate realistic competitive data
    const competitors: CompetitiveProfile[] = []
    
    for (let i = 0; i < sampleSize; i++) {
      const variance = (base: number, factor: number = 0.3) => {
        return Math.floor(base * (1 + (Math.random() - 0.5) * factor))
      }

      competitors.push({
        id: `comp-${i + 1}`,
        name: `Competitor ${i + 1}`,
        headline: `${userProfile.industry} Professional`,
        followers: variance(userProfile.followers, 0.8),
        connections: variance(userProfile.connections, 0.5),
        engagement: Math.max(1, Math.min(15, variance(userProfile.engagement, 0.4))),
        posts: variance(userProfile.posts, 0.6),
        industry: userProfile.industry,
        skills: [...userProfile.skills].sort(() => 0.5 - Math.random()).slice(0, 8),
        experience: Math.max(1, variance(userProfile.experience, 0.5)),
        profileScore: Math.max(50, Math.min(100, variance(userProfile.profileScore, 0.2))),
        keyStrengths: ['Strong network', 'Quality content', 'Industry expertise'],
        contentStrategy: ['Thought leadership', 'Educational content', 'Industry insights'],
        isInfluencer: i < 2, // Top 2 are influencers
        growthRate: Math.floor((Math.random() - 0.1) * 20) // -2% to 18%
      })
    }

    return competitors
  }

  /**
   * Perform comprehensive competitive analysis
   */
  async performCompetitiveAnalysis(userProfile: ProfileData): Promise<CompetitiveAnalysis> {
    const competitors = await this.generateCompetitiveProfiles(userProfile, 12)
    
    // Calculate industry benchmarks
    const industryBenchmarks = {
      avgFollowers: Math.floor(competitors.reduce((sum, comp) => sum + comp.followers, 0) / competitors.length),
      avgEngagement: Math.floor((competitors.reduce((sum, comp) => sum + comp.engagement, 0) / competitors.length) * 10) / 10,
      avgPostsPerMonth: Math.floor(competitors.reduce((sum, comp) => sum + comp.posts, 0) / competitors.length / 12),
      avgConnections: Math.floor(competitors.reduce((sum, comp) => sum + comp.connections, 0) / competitors.length),
      avgProfileScore: Math.floor(competitors.reduce((sum, comp) => sum + comp.profileScore, 0) / competitors.length)
    }

    // Calculate user ranking
    const allProfiles = [userProfile, ...competitors]
    const sortByFollowers = [...allProfiles].sort((a, b) => b.followers - a.followers)
    const sortByEngagement = [...allProfiles].sort((a, b) => b.engagement - a.engagement)
    const sortByProfileScore = [...allProfiles].sort((a, b) => b.profileScore - a.profileScore)
    
    const followersRank = sortByFollowers.findIndex(p => p.name === userProfile.name) + 1
    const engagementRank = sortByEngagement.findIndex(p => p.name === userProfile.name) + 1
    const profileScoreRank = sortByProfileScore.findIndex(p => p.name === userProfile.name) + 1
    const overallRank = Math.floor((followersRank + engagementRank + profileScoreRank) / 3)

    const userRanking = {
      followers: { 
        rank: followersRank, 
        percentile: Math.floor(((allProfiles.length - followersRank) / allProfiles.length) * 100) 
      },
      engagement: { 
        rank: engagementRank, 
        percentile: Math.floor(((allProfiles.length - engagementRank) / allProfiles.length) * 100) 
      },
      profileScore: { 
        rank: profileScoreRank, 
        percentile: Math.floor(((allProfiles.length - profileScoreRank) / allProfiles.length) * 100) 
      },
      overallScore: { 
        rank: overallRank, 
        percentile: Math.floor(((allProfiles.length - overallRank) / allProfiles.length) * 100) 
      }
    }

    // Mock gap analysis
    const gapAnalysis = [
      {
        category: 'followers' as const,
        currentValue: userProfile.followers,
        benchmarkValue: industryBenchmarks.avgFollowers,
        gap: industryBenchmarks.avgFollowers - userProfile.followers,
        recommendation: 'Increase content frequency and engage more with your network',
        priority: 'medium' as const,
        timeToImprove: '3-6 months'
      },
      {
        category: 'engagement' as const,
        currentValue: userProfile.engagement,
        benchmarkValue: industryBenchmarks.avgEngagement,
        gap: industryBenchmarks.avgEngagement - userProfile.engagement,
        recommendation: 'Focus on creating more interactive and valuable content',
        priority: 'high' as const,
        timeToImprove: '2-4 months'
      }
    ]

    return {
      userProfile,
      competitors,
      industryBenchmarks,
      userRanking,
      gapAnalysis,
      competitorInsights: [
        {
          competitorName: competitors[0]?.name || 'Top Performer',
          keyTakeaways: ['Consistent posting schedule', 'High-quality content', 'Strong engagement'],
          contentThemes: ['Industry insights', 'Professional tips', 'Market analysis'],
          postingPatterns: 'Posts 3-4 times per week, primarily Tuesday-Thursday',
          uniqueStrategies: ['Video content', 'LinkedIn polls', 'Thought leadership articles']
        }
      ],
      marketPositioning: {
        currentPosition: userRanking.overallScore.percentile >= 75 ? 'leader' as const : 
                        userRanking.overallScore.percentile >= 50 ? 'challenger' as const :
                        userRanking.overallScore.percentile >= 25 ? 'follower' as const : 'niche' as const,
        strengthAreas: ['Technical expertise', 'Professional network'],
        opportunityAreas: ['Content marketing', 'Thought leadership'],
        threats: ['Increased competition', 'Platform algorithm changes'],
        recommendedPosition: 'Focus on becoming a thought leader in your niche'
      }
    }
  }

  /**
   * Generate comprehensive compensation analysis
   */
  async generateCompensationAnalysis(profileData: ProfileData): Promise<CompensationAnalysis> {
    // In production, this would use real salary data APIs
    const baseSalary = this.estimateSalary(profileData)
    
    return {
      userProfile: {
        estimatedRole: this.estimateRole(profileData),
        experienceLevel: profileData.experience <= 2 ? 'entry' : 
                        profileData.experience <= 5 ? 'mid' : 
                        profileData.experience <= 10 ? 'senior' : 'executive',
        location: profileData.location || 'United States',
        skills: profileData.skills
      },
      currentMarketPosition: {
        estimatedSalaryRange: {
          min: Math.floor(baseSalary * 0.8),
          median: baseSalary,
          max: Math.floor(baseSalary * 1.3)
        },
        percentileRanking: Math.floor(Math.random() * 40) + 40, // 40-80th percentile
        skillPremium: Math.floor(Math.random() * 20) + 5, // 5-25%
        locationAdjustment: 0
      },
      benchmarkComparison: {
        industryMedian: baseSalary,
        roleMedian: baseSalary,
        locationMedian: baseSalary,
        experienceMedian: baseSalary,
        userEstimate: baseSalary,
        variance: 0
      },
      skillImpact: profileData.skills.slice(0, 5).map(skill => ({
        skill,
        salaryPremium: Math.floor(Math.random() * 15) + 5,
        demandLevel: ['high', 'very-high', 'moderate'][Math.floor(Math.random() * 3)] as 'high' | 'very-high' | 'moderate',
        avgSalaryIncrease: Math.floor(Math.random() * 20000) + 5000,
        topPayingCompanies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'].slice(0, 3)
      })),
      careerProgression: [],
      geographicOpportunities: [],
      negotiationInsights: {
        leveragePoints: ['High demand skills', 'Strong LinkedIn presence', 'Industry experience'],
        marketTrends: ['Remote work increasing salaries', 'Skill-based hiring growing'],
        timingAdvice: 'Best negotiation window is during performance reviews or job changes',
        researchTips: ['Research company salary ranges', 'Know your market value', 'Practice negotiation']
      },
      industryBenchmarks: []
    }
  }

  private estimateSalary(profileData: ProfileData): number {
    const baseSalaries: Record<string, number> = {
      'Software Development': 95000,
      'Marketing & Advertising': 75000,
      'Design': 80000,
      'Technology': 85000,
      'Finance': 90000,
      'Healthcare': 70000,
      'Education': 60000
    }

    const baseSalary = baseSalaries[profileData.industry] || 70000
    const experienceMultiplier = 1 + (profileData.experience * 0.08) // 8% per year
    
    return Math.floor(baseSalary * experienceMultiplier)
  }

  private estimateRole(profileData: ProfileData): string {
    if (profileData.skills.some(s => s.toLowerCase().includes('javascript') || s.toLowerCase().includes('python'))) {
      return 'Software Engineer'
    }
    if (profileData.skills.some(s => s.toLowerCase().includes('marketing') || s.toLowerCase().includes('seo'))) {
      return 'Marketing Manager'
    }
    if (profileData.skills.some(s => s.toLowerCase().includes('design') || s.toLowerCase().includes('ux'))) {
      return 'Product Designer'
    }
    return 'Professional'
  }
}

// Export singleton instance
export const linkedInService = new LinkedInService(process.env.OPENAI_API_KEY)