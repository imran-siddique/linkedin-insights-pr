import { Router, Request, Response } from 'express'
import { linkedInService } from '../services/linkedinService'
import { asyncHandler, AppError } from '../middleware/errorHandler'
import NodeCache from 'node-cache'
import { ApiResponse, ProfileData } from '../types'

const router = Router()
const cache = new NodeCache({ stdTTL: 600 }) // 10 minute cache for competitive data

/**
 * @route POST /api/competitive/analyze
 * @desc Perform competitive analysis for a profile
 * @access Public (with API key)
 */
router.post('/analyze', asyncHandler(async (req: Request, res: Response) => {
  const { profileData } = req.body
  
  if (!profileData || !profileData.industry || !profileData.skills) {
    throw new AppError('Valid profile data with industry and skills is required', 400)
  }

  const cacheKey = `competitive_${profileData.industry}_${profileData.experience}`
  const cachedAnalysis = cache.get(cacheKey)
  
  if (cachedAnalysis) {
    const response: ApiResponse<any> = {
      success: true,
      data: cachedAnalysis,
      message: 'Competitive analysis retrieved from cache',
      timestamp: new Date().toISOString()
    }
    return res.json(response)
  }

  const competitiveAnalysis = await linkedInService.performCompetitiveAnalysis(profileData)
  
  cache.set(cacheKey, competitiveAnalysis)

  const response: ApiResponse<any> = {
    success: true,
    data: competitiveAnalysis,
    message: 'Competitive analysis completed successfully',
    timestamp: new Date().toISOString()
  }

  res.json(response)
}))

/**
 * @route POST /api/competitive/profiles
 * @desc Generate competitive profiles for benchmarking
 * @access Public (with API key)
 */
router.post('/profiles', asyncHandler(async (req: Request, res: Response) => {
  const { profileData, sampleSize = 10 } = req.body
  
  if (!profileData || !profileData.industry) {
    throw new AppError('Valid profile data with industry is required', 400)
  }

  if (sampleSize < 5 || sampleSize > 20) {
    throw new AppError('Sample size must be between 5 and 20', 400)
  }

  const cacheKey = `profiles_${profileData.industry}_${sampleSize}`
  const cachedProfiles = cache.get(cacheKey)
  
  if (cachedProfiles) {
    const response: ApiResponse<any> = {
      success: true,
      data: cachedProfiles,
      message: 'Competitive profiles retrieved from cache',
      timestamp: new Date().toISOString()
    }
    return res.json(response)
  }

  const competitiveProfiles = await linkedInService.generateCompetitiveProfiles(profileData, sampleSize)
  
  cache.set(cacheKey, competitiveProfiles)

  const response: ApiResponse<any> = {
    success: true,
    data: competitiveProfiles,
    message: `Generated ${competitiveProfiles.length} competitive profiles`,
    timestamp: new Date().toISOString()
  }

  res.json(response)
}))

/**
 * @route GET /api/competitive/benchmarks/:industry
 * @desc Get industry benchmarks
 * @access Public (with API key)
 */
router.get('/benchmarks/:industry', asyncHandler(async (req: Request, res: Response) => {
  const { industry } = req.params
  
  if (!industry) {
    throw new AppError('Industry parameter is required', 400)
  }

  const cacheKey = `benchmarks_${industry.toLowerCase().replace(/\s+/g, '_')}`
  const cachedBenchmarks = cache.get(cacheKey)
  
  if (cachedBenchmarks) {
    const response: ApiResponse<any> = {
      success: true,
      data: cachedBenchmarks,
      message: 'Industry benchmarks retrieved from cache',
      timestamp: new Date().toISOString()
    }
    return res.json(response)
  }

  // Generate industry benchmarks
  const benchmarks = {
    industry,
    avgFollowers: Math.floor(Math.random() * 3000) + 1000,
    avgEngagement: Math.floor(Math.random() * 8) + 3,
    avgPostsPerMonth: Math.floor(Math.random() * 20) + 8,
    avgConnections: Math.floor(Math.random() * 1000) + 500,
    avgProfileScore: Math.floor(Math.random() * 25) + 70,
    topSkills: [
      'Leadership',
      'Strategic Planning',
      'Project Management',
      'Communication',
      'Problem Solving'
    ],
    trendingHashtags: [
      `#${industry.replace(/\s+/g, '')}`,
      '#Professional',
      '#Career',
      '#Leadership',
      '#Innovation'
    ]
  }
  
  cache.set(cacheKey, benchmarks, 1800) // 30 minute cache
  
  const response: ApiResponse<any> = {
    success: true,
    data: benchmarks,
    message: 'Industry benchmarks generated successfully',
    timestamp: new Date().toISOString()
  }

  res.json(response)
}))

export { router as competitiveRouter }