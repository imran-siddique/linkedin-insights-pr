import { Router, Request, Response } from 'express'
import { linkedInService } from '../services/linkedinService'
import { asyncHandler, AppError } from '../middleware/errorHandler'
import { analyzeProfileSchema } from '../middleware/validation'
import NodeCache from 'node-cache'
import { ApiResponse, ProfileData } from '../types'

const router = Router()
const cache = new NodeCache({ stdTTL: 300 }) // 5 minute cache

/**
 * @route POST /api/profile/analyze
 * @desc Analyze a LinkedIn profile
 * @access Public (with API key)
 */
router.post('/analyze', asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = analyzeProfileSchema.validate(req.body)
  
  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  const { linkedinUrl } = value
  
  // Check cache first
  const cacheKey = `profile_${linkedinUrl}`
  const cachedProfile = cache.get<ProfileData>(cacheKey)
  
  if (cachedProfile) {
    const response: ApiResponse<ProfileData> = {
      success: true,
      data: cachedProfile,
      message: 'Profile data retrieved from cache',
      timestamp: new Date().toISOString()
    }
    return res.json(response)
  }

  // Validate profile access
  const username = linkedInService.extractLinkedInUsername(linkedinUrl)
  if (!username) {
    throw new AppError('Invalid LinkedIn profile URL or username', 400)
  }

  const isValid = await linkedInService.validateProfileAccess(username)
  if (!isValid) {
    throw new AppError('Unable to access this LinkedIn profile', 400)
  }

  // Fetch profile data
  const profileData = await linkedInService.getProfileData(linkedinUrl)
  
  // Cache the result
  cache.set(cacheKey, profileData)

  const response: ApiResponse<ProfileData> = {
    success: true,
    data: profileData,
    message: 'Profile analyzed successfully',
    timestamp: new Date().toISOString()
  }

  res.json(response)
}))

/**
 * @route GET /api/profile/:username/insights
 * @desc Get profile insights
 * @access Public (with API key)
 */
router.get('/:username/insights', asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params
  
  if (!username) {
    throw new AppError('Username is required', 400)
  }

  const cacheKey = `insights_${username}`
  const cachedInsights = cache.get(cacheKey)
  
  if (cachedInsights) {
    const response: ApiResponse<any> = {
      success: true,
      data: cachedInsights,
      message: 'Profile insights retrieved from cache',
      timestamp: new Date().toISOString()
    }
    return res.json(response)
  }

  // Mock profile data for insights (in production, fetch from DB or LinkedIn)
  const mockProfileData: ProfileData = {
    name: 'Professional User',
    headline: 'Professional | Industry Expert',
    followers: 1000,
    connections: 500,
    posts: 50,
    engagement: 5,
    profileScore: 75,
    industry: 'Technology',
    skills: ['Leadership', 'Strategic Planning', 'Project Management'],
    experience: 5
  }

  const insights = await linkedInService.getProfileInsights(username, mockProfileData)
  
  cache.set(cacheKey, insights)

  const response: ApiResponse<any> = {
    success: true,
    data: insights,
    message: 'Profile insights generated successfully',
    timestamp: new Date().toISOString()
  }

  res.json(response)
}))

/**
 * @route GET /api/profile/:username/activity
 * @desc Get activity metrics
 * @access Public (with API key)
 */
router.get('/:username/activity', asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params
  
  if (!username) {
    throw new AppError('Username is required', 400)
  }

  const cacheKey = `activity_${username}`
  const cachedActivity = cache.get(cacheKey)
  
  if (cachedActivity) {
    const response: ApiResponse<any> = {
      success: true,
      data: cachedActivity,
      message: 'Activity metrics retrieved from cache',
      timestamp: new Date().toISOString()
    }
    return res.json(response)
  }

  // Mock profile data (in production, fetch from DB)
  const mockProfileData: ProfileData = {
    name: 'Professional User',
    headline: 'Professional | Industry Expert',
    followers: 1000,
    connections: 500,
    posts: 50,
    engagement: 5,
    profileScore: 75,
    industry: 'Technology',
    skills: ['Leadership', 'Strategic Planning', 'Project Management'],
    experience: 5
  }

  const activity = await linkedInService.getActivityMetrics(mockProfileData)
  
  cache.set(cacheKey, activity)

  const response: ApiResponse<any> = {
    success: true,
    data: activity,
    message: 'Activity metrics generated successfully',
    timestamp: new Date().toISOString()
  }

  res.json(response)
}))

/**
 * @route GET /api/profile/:username/visual-branding
 * @desc Analyze visual branding
 * @access Public (with API key)
 */
router.get('/:username/visual-branding', asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params
  
  if (!username) {
    throw new AppError('Username is required', 400)
  }

  const cacheKey = `visual_${username}`
  const cachedVisual = cache.get(cacheKey)
  
  if (cachedVisual) {
    const response: ApiResponse<any> = {
      success: true,
      data: cachedVisual,
      message: 'Visual branding analysis retrieved from cache',
      timestamp: new Date().toISOString()
    }
    return res.json(response)
  }

  const visualAnalysis = await linkedInService.analyzeVisualBranding(username)
  
  cache.set(cacheKey, visualAnalysis)

  const response: ApiResponse<any> = {
    success: true,
    data: visualAnalysis,
    message: 'Visual branding analyzed successfully',
    timestamp: new Date().toISOString()
  }

  res.json(response)
}))

export { router as profileRouter }