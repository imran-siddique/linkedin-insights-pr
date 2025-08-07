import { Request, Response, NextFunction } from 'express'

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-API-Key') || req.query.apiKey as string

  // In development, allow requests without API key
  if (process.env.NODE_ENV === 'development') {
    return next()
  }

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key is required',
      message: 'Please provide a valid API key in X-API-Key header or apiKey query parameter'
    })
  }

  // Validate API key (in production, this would check against a database)
  const validApiKeys = process.env.API_KEYS?.split(',') || ['development-key']
  
  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    })
  }

  next()
}