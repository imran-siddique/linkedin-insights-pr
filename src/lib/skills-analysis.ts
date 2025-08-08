import { 
  ProfileData, 
  SkillCategory, 
  SkillGap, 
  MarketAlignment, 
  SkillTrend, 
  CompetitiveAdvantage,
  LearningPath,
  CertificationRecommendation,
  SkillAnalysis
} from '@/types/linkedin'

// Global spark interface
declare global {
  interface Window {
    spark: {
      llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => string
      llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>
    }
  }
}

// Access spark globally
const spark = (typeof window !== 'undefined' && window.spark) || {
  llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => strings.join(''),
  llm: async (prompt: string) => Promise.resolve('{}'),
}

/**
 * Advanced Skills Analysis Service
 * Provides deep insights into skill portfolio, market alignment, and learning paths
 */
export class SkillsAnalysisService {
  /**
   * Perform comprehensive skills analysis
   */
  async analyzeSkills(profileData: ProfileData): Promise<SkillAnalysis> {
    try {
      const [
        categoryBreakdown,
        skillGaps,
        learningPath,
        marketAlignment,
        competitiveAdvantage,
        skillTrends,
        certificationRecommendations
      ] = await Promise.all([
        this.categorizeSkills(profileData),
        this.identifySkillGaps(profileData),
        this.generateLearningPath(profileData),
        this.assessMarketAlignment(profileData),
        this.evaluateCompetitiveAdvantage(profileData),
        this.analyzeSkillTrends(profileData),
        this.recommendCertifications(profileData)
      ])

      // Calculate overall score based on various factors
      const overallScore = this.calculateOverallScore({
        categoryBreakdown,
        marketAlignment,
        competitiveAdvantage,
        skillTrends
      })

      return {
        overallScore,
        categoryBreakdown,
        skillGaps,
        learningPath,
        marketAlignment,
        competitiveAdvantage,
        skillTrends,
        certificationRecommendations
      }
    } catch (error) {
      console.error('Skills analysis failed:', error)
      throw new Error('Failed to complete skills analysis')
    }
  }

  /**
   * Categorize skills into technical, business, creative, etc.
   */
  private async categorizeSkills(profileData: ProfileData): Promise<SkillCategory[]> {
    const prompt = spark.llmPrompt`
    Analyze and categorize these skills from a ${profileData.industry} professional with ${profileData.experience} years of experience:
    Skills: ${profileData.skills.join(', ')}
    Current Role Level: ${profileData.roleLevel || 'unknown'}
    
    Categorize into skill groups (Technical, Business, Creative, Leadership, Data, Communication, etc.) and provide detailed analysis for each skill including:
    - Proficiency level estimation based on experience
    - Current market value (1-10)
    - Demand trend (rising/stable/declining)  
    - Salary impact percentage
    - Learning difficulty
    - Time to master
    - Related skills
    - Job roles that use this skill
    - Industry demand breakdown
    - Top certifications
    - Learning resources
    - Project ideas
    - Companies known for this skill
    
    Format as JSON with categories array containing: category, skills array, categoryScore, marketDemand, description, icon.
    `

    const response = await spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    return data.categories || []
  }

  /**
   * Identify missing skills that would boost career prospects
   */
  private async identifySkillGaps(profileData: ProfileData): Promise<SkillGap[]> {
    const prompt = spark.llmPrompt`
    Based on this professional profile, identify critical skill gaps that are limiting career growth:
    
    Industry: ${profileData.industry}
    Current Skills: ${profileData.skills.join(', ')}
    Experience: ${profileData.experience} years
    Role Level: ${profileData.roleLevel || 'individual contributor'}
    
    Identify skill gaps in categories like:
    - Technical skills trending in the industry
    - Leadership/management skills for career progression
    - Cross-functional skills for better collaboration
    - Emerging technologies relevant to their field
    - Industry-specific certifications
    
    For each gap, provide: category, missingSkills array, priority level, impact description, 
    timeToAcquire, cost, and roi score.
    
    Format as JSON array of gap objects.
    `

    const response = await spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    return Array.isArray(data) ? data : data.gaps || []
  }

  /**
   * Generate personalized learning path
   */
  private async generateLearningPath(profileData: ProfileData): Promise<LearningPath> {
    const prompt = spark.llmPrompt`
    Create a comprehensive learning path for advancing in ${profileData.industry} with current skills: ${profileData.skills.join(', ')}.
    
    Professional context:
    - Experience: ${profileData.experience} years
    - Role Level: ${profileData.roleLevel}
    - Industry: ${profileData.industry}
    
    Design a learning path with:
    - Total duration estimate
    - Learning phases (Foundation, Intermediate, Advanced, Specialization)
    - Skills to develop in each phase
    - Specific resources (courses, books, tutorials)
    - Hands-on projects for each phase
    - Key milestones and assessments
    - Prerequisites needed
    - Estimated costs (min/max)
    - Time commitment required
    
    Focus on skills that will have maximum career impact and market demand.
    
    Format as JSON with totalDuration, phases array, estimatedCost object, timeCommitment, difficulty, prerequisites array.
    `

    const response = await spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    return data
  }

  /**
   * Assess how well skills align with market demands
   */
  private async assessMarketAlignment(profileData: ProfileData): Promise<MarketAlignment> {
    const prompt = spark.llmPrompt`
    Assess market alignment for a ${profileData.industry} professional with these skills: ${profileData.skills.join(', ')}.
    
    Analyze:
    - Overall alignment with current market demands (score 1-10)
    - Industry fit score (1-10)
    - Future-readiness score (1-10)
    - Specific recommendations for better alignment
    - Emerging skills to watch in their industry
    - Skills that are becoming less relevant
    - Hot skill combinations with high demand and salary
    
    Consider market trends, AI impact, remote work changes, and industry evolution.
    
    Format as JSON with alignmentScore, industryFit, futureFit, recommendations array, 
    emergingSkillsToWatch array, fadingSkills array, hotSkillCombinations array.
    `

    const response = await spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    return data
  }

  /**
   * Evaluate competitive advantages from skill portfolio
   */
  private async evaluateCompetitiveAdvantage(profileData: ProfileData): Promise<CompetitiveAdvantage> {
    const prompt = spark.llmPrompt`
    Evaluate competitive advantages for someone in ${profileData.industry} with skills: ${profileData.skills.join(', ')}.
    
    Analyze:
    - Unique skills that few professionals possess
    - Valuable skill combinations that create competitive advantage
    - Rarity score of their skill portfolio (1-10)
    - Overall competitive score (1-10)
    - Specific advantages they have over peers
    - Key differentiators in the job market
    - Potential niche specializations
    
    Consider skill scarcity, combination uniqueness, and market value.
    
    Format as JSON with uniqueSkills array, skillCombinations array, rarityScore, 
    competitiveScore, advantages array, differentiators array, niche string.
    `

    const response = await spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    return data
  }

  /**
   * Analyze trends for each skill
   */
  private async analyzeSkillTrends(profileData: ProfileData): Promise<SkillTrend[]> {
    const prompt = spark.llmPrompt`
    Analyze current trends for these skills in ${profileData.industry}: ${profileData.skills.join(', ')}.
    
    For each skill, provide:
    - Overall trend (explosive/growing/stable/declining/dying)
    - Trend score (-10 to +10)
    - Year-over-year job posting growth percentage
    - Salary trend direction and percentage
    - Geographic demand variations (top locations)
    - Historical timeline data (past 3 years)
    
    Consider factors like:
    - Technology adoption rates
    - Industry transformation
    - Remote work impact
    - AI/automation effects
    - Market saturation
    
    Format as JSON array of trend objects with skill, trend, trendScore, yearOverYearGrowth, 
    jobPostingsGrowth, salaryTrend, geographic array, timeline array.
    `

    const response = await spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    return Array.isArray(data) ? data : data.trends || []
  }

  /**
   * Recommend relevant certifications
   */
  private async recommendCertifications(profileData: ProfileData): Promise<CertificationRecommendation[]> {
    const prompt = spark.llmPrompt`
    Recommend valuable certifications for a ${profileData.industry} professional with skills: ${profileData.skills.join(', ')}.
    
    Professional context:
    - Experience: ${profileData.experience} years  
    - Role Level: ${profileData.roleLevel}
    
    Recommend certifications that:
    - Enhance existing skills
    - Fill critical skill gaps
    - Boost career progression
    - Have high industry recognition
    - Provide good ROI
    
    For each certification, include:
    - Name and provider
    - Skills it validates
    - Cost and duration
    - Difficulty level
    - Industry recognition level
    - ROI score (1-10)
    - Prerequisites
    - Maintenance requirements
    - Salary impact percentage
    - Relevant job roles
    - URL if known
    
    Format as JSON array of certification objects.
    `

    const response = await spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    return Array.isArray(data) ? data : data.certifications || []
  }

  /**
   * Calculate overall skills portfolio score
   */
  private calculateOverallScore(analysis: {
    categoryBreakdown: SkillCategory[]
    marketAlignment: MarketAlignment
    competitiveAdvantage: CompetitiveAdvantage
    skillTrends: SkillTrend[]
  }): number {
    // Weight different factors
    const categoryScore = analysis.categoryBreakdown.reduce((sum, cat) => sum + cat.categoryScore, 0) / analysis.categoryBreakdown.length || 5
    const alignmentScore = analysis.marketAlignment.alignmentScore || 5
    const competitiveScore = analysis.competitiveAdvantage.competitiveScore || 5
    const trendScore = analysis.skillTrends.reduce((sum, trend) => sum + Math.max(0, trend.trendScore + 10) / 2, 0) / analysis.skillTrends.length || 5

    // Weighted average (can be tuned)
    const overall = (
      categoryScore * 0.3 +
      alignmentScore * 0.3 +
      competitiveScore * 0.2 +
      trendScore * 0.2
    )

    return Math.round(overall * 10) / 10 // Round to 1 decimal place
  }
}

export const skillsAnalysisService = new SkillsAnalysisService()