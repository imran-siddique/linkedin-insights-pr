import { Router, Request, Response } from 'express'
import { linkedInService } from '../services/linkedinService'
import { asyncHandler, AppError } from '../middleware/errorHandler'
import NodeCache from 'node-cache'
import { ApiResponse } from '../types'

const router = Router()
const cache = new NodeCache({ stdTTL: 900 }) // 15 minute cache for compensation data

/**
 * @route POST /api/compensation/analyze
 * @desc Generate comprehensive compensation analysis
 * @access Public (with API key)
 */
router.post('/analyze', asyncHandler(async (req: Request, res: Response) => {
  const { profileData } = req.body
  
  if (!profileData || !profileData.industry || !profileData.skills || !profileData.experience) {
    throw new AppError('Valid profile data with industry, skills, and experience is required', 400)
  }

  const cacheKey = `compensation_${profileData.industry}_${profileData.experience}_${profileData.skills.length}`
  const cachedAnalysis = cache.get(cacheKey)
  
  if (cachedAnalysis) {
    const response: ApiResponse<any> = {
      success: true,
      data: cachedAnalysis,
      message: 'Compensation analysis retrieved from cache',
      timestamp: new Date().toISOString()
    }
    return res.json(response)
  }

  const compensationAnalysis = await linkedInService.generateCompensationAnalysis(profileData)
  
  cache.set(cacheKey, compensationAnalysis)

  const response: ApiResponse<any> = {
    success: true,
    data: compensationAnalysis,
    message: 'Compensation analysis completed successfully',
    timestamp: new Date().toISOString()
  }

  res.json(response)
}))

/**
 * @route GET /api/compensation/benchmarks
 * @desc Get salary benchmarks by industry and role
 * @access Public (with API key)
 */
router.get('/benchmarks', asyncHandler(async (req: Request, res: Response) => {
  const { industry, role, experience, location } = req.query
  
  if (!industry) {
    throw new AppError('Industry parameter is required', 400)
  }

  const cacheKey = `salary_benchmarks_${industry}_${role || 'general'}_${experience || 'all'}_${location || 'us'}`
  const cachedBenchmarks = cache.get(cacheKey)
  
  if (cachedBenchmarks) {
    const response: ApiResponse<any> = {
      success: true,
      data: cachedBenchmarks,
      message: 'Salary benchmarks retrieved from cache',
      timestamp: new Date().toISOString()
    }
    return res.json(response)
  }

  // Generate mock salary benchmarks
  const experienceLevel = experience as string || 'mid'
  const baseSalary = getSalaryByIndustryAndExperience(industry as string, experienceLevel)
  
  const benchmarks = {
    industry: industry as string,
    role: role as string || 'Professional',
    experience: experienceLevel,
    location: location as string || 'United States',
    baseSalary: {
      min: Math.floor(baseSalary * 0.8),
      median: baseSalary,
      max: Math.floor(baseSalary * 1.3)
    },
    totalComp: {
      min: Math.floor(baseSalary * 0.9),
      median: Math.floor(baseSalary * 1.15),
      max: Math.floor(baseSalary * 1.5)
    },
    equity: {
      typical: Math.random() > 0.3,
      value: '0.1-2%'
    },
    bonus: {
      typical: Math.random() > 0.4,
      percentage: Math.floor(Math.random() * 20) + 5
    },
    skills: [
      'Leadership',
      'Strategic Planning',
      'Project Management',
      'Communication',
      'Problem Solving'
    ],
    companies: [
      'Google',
      'Microsoft',
      'Amazon',
      'Meta',
      'Apple'
    ],
    growthProjection: Math.floor(Math.random() * 10) + 5,
    dataPoints: Math.floor(Math.random() * 500) + 100,
    lastUpdated: new Date().toISOString()
  }
  
  cache.set(cacheKey, benchmarks, 1800) // 30 minute cache

  const response: ApiResponse<any> = {
    success: true,
    data: benchmarks,
    message: 'Salary benchmarks generated successfully',
    timestamp: new Date().toISOString()
  }

  res.json(response)
}))

/**
 * @route POST /api/compensation/skill-impact
 * @desc Analyze salary impact of specific skills
 * @access Public (with API key)
 */
router.post('/skill-impact', asyncHandler(async (req: Request, res: Response) => {
  const { skills, industry, experience } = req.body
  
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    throw new AppError('Skills array is required', 400)
  }

  if (skills.length > 20) {
    throw new AppError('Maximum 20 skills allowed per request', 400)
  }

  const cacheKey = `skill_impact_${skills.join('_').toLowerCase()}_${industry || 'general'}_${experience || 'mid'}`
  const cachedImpact = cache.get(cacheKey)
  
  if (cachedImpact) {
    const response: ApiResponse<any> = {
      success: true,
      data: cachedImpact,
      message: 'Skill impact analysis retrieved from cache',
      timestamp: new Date().toISOString()
    }
    return res.json(response)
  }

  const skillImpactAnalysis = skills.map((skill: string) => ({
    skill,
    salaryPremium: Math.floor(Math.random() * 15) + 5, // 5-20%
    demandLevel: ['high', 'very-high', 'moderate', 'low'][Math.floor(Math.random() * 4)],
    avgSalaryIncrease: Math.floor(Math.random() * 25000) + 5000, // $5k-$30k
    marketTrend: ['growing', 'stable', 'declining'][Math.floor(Math.random() * 3)],
    jobOpenings: Math.floor(Math.random() * 10000) + 1000,
    topPayingCompanies: [
      'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple',
      'Netflix', 'Tesla', 'Stripe', 'Uber', 'Airbnb'
    ].sort(() => 0.5 - Math.random()).slice(0, 4),
    relatedCertifications: [
      `${skill} Certification`,
      `Advanced ${skill}`,
      `${skill} Professional`
    ].slice(0, 2),
    learningResources: [
      `${skill} Masterclass`,
      `Learn ${skill} Online`,
      `${skill} Bootcamp`
    ].slice(0, 3)
  }))
  
  cache.set(cacheKey, skillImpactAnalysis)

  const response: ApiResponse<any> = {
    success: true,
    data: skillImpactAnalysis,
    message: 'Skill impact analysis completed successfully',
    timestamp: new Date().toISOString()
  }

  res.json(response)
}))

/**
 * @route GET /api/compensation/trends/:industry
 * @desc Get salary trends for an industry
 * @access Public (with API key)
 */
router.get('/trends/:industry', asyncHandler(async (req: Request, res: Response) => {
  const { industry } = req.params
  const { timeframe = '12' } = req.query
  
  if (!industry) {
    throw new AppError('Industry parameter is required', 400)
  }

  const cacheKey = `salary_trends_${industry.toLowerCase().replace(/\s+/g, '_')}_${timeframe}`
  const cachedTrends = cache.get(cacheKey)
  
  if (cachedTrends) {
    const response: ApiResponse<any> = {
      success: true,
      data: cachedTrends,
      message: 'Salary trends retrieved from cache',
      timestamp: new Date().toISOString()
    }
    return res.json(response)
  }

  // Generate mock salary trends
  const months = parseInt(timeframe as string) || 12
  const trends = {
    industry,
    timeframe: `${months} months`,
    overallGrowth: `${Math.floor(Math.random() * 8) + 2}%`,
    monthlyData: Array.from({ length: months }, (_, i) => ({
      month: new Date(Date.now() - (months - i - 1) * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      avgSalary: Math.floor(Math.random() * 20000) + 60000,
      jobOpenings: Math.floor(Math.random() * 5000) + 1000,
      competitionIndex: Math.floor(Math.random() * 100) + 50
    })),
    topGrowingRoles: [
      'Senior Software Engineer',
      'Data Scientist',
      'Product Manager',
      'DevOps Engineer',
      'ML Engineer'
    ].slice(0, 3),
    emergingSkills: [
      'AI/ML',
      'Cloud Computing',
      'Cybersecurity',
      'Data Analysis',
      'Remote Leadership'
    ].slice(0, 4),
    insights: [
      `${industry} salaries have grown ${Math.floor(Math.random() * 5) + 3}% year-over-year`,
      'Remote work has increased salary competition',
      'Skills premiums are becoming more significant',
      'Senior roles are seeing the highest demand'
    ]
  }
  
  cache.set(cacheKey, trends, 3600) // 1 hour cache

  const response: ApiResponse<any> = {
    success: true,
    data: trends,
    message: 'Salary trends generated successfully',
    timestamp: new Date().toISOString()
  }

  res.json(response)
}))

// Helper function to get salary by industry and experience
function getSalaryByIndustryAndExperience(industry: string, experience: string): number {
  const baseSalaries: Record<string, Record<string, number>> = {
    'Technology': { entry: 75000, mid: 95000, senior: 130000, executive: 180000 },
    'Software Development': { entry: 80000, mid: 105000, senior: 140000, executive: 200000 },
    'Marketing & Advertising': { entry: 55000, mid: 75000, senior: 100000, executive: 150000 },
    'Design': { entry: 60000, mid: 80000, senior: 110000, executive: 160000 },
    'Finance': { entry: 70000, mid: 90000, senior: 125000, executive: 190000 },
    'Healthcare': { entry: 65000, mid: 80000, senior: 110000, executive: 160000 },
    'Education': { entry: 45000, mid: 60000, senior: 85000, executive: 120000 }
  }

  const industryMap = baseSalaries[industry] || baseSalaries['Technology']
  return industryMap[experience] || industryMap['mid']
}

export { router as compensationRouter }