/**
 * Configuration constants for production environment
 */
export const CONFIG = {
  // Application metadata
  APP_NAME: import.meta.env.VITE_APP_NAME || 'LinkedIn Analytics & Growth Advisor',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Environment
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  
  // Feature flags
  ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true' || false,
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING !== 'false',
  
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: parseInt(import.meta.env.VITE_MAX_REQUESTS_PER_MINUTE || '60', 10),
  SCRAPING_RATE_LIMIT: parseInt(import.meta.env.VITE_SCRAPING_RATE_LIMIT || '5', 10),
  
  // Cache settings
  CACHE_TTL: parseInt(import.meta.env.VITE_CACHE_TTL || '300000', 10), // 5 minutes
  MAX_CACHE_SIZE: parseInt(import.meta.env.VITE_MAX_CACHE_SIZE || '100', 10),
  
  // API settings
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10), // 10 seconds
  
  // Validation
  MAX_INPUT_LENGTH: 200,
  MIN_ANALYSIS_INTERVAL: 30000, // 30 seconds between analyses
} as const

/**
 * Validates configuration on startup
 */
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (CONFIG.MAX_REQUESTS_PER_MINUTE < 1 || CONFIG.MAX_REQUESTS_PER_MINUTE > 1000) {
    errors.push('MAX_REQUESTS_PER_MINUTE must be between 1 and 1000')
  }
  
  if (CONFIG.CACHE_TTL < 1000 || CONFIG.CACHE_TTL > 3600000) {
    errors.push('CACHE_TTL must be between 1 second and 1 hour')
  }
  
  if (CONFIG.API_TIMEOUT < 1000 || CONFIG.API_TIMEOUT > 30000) {
    errors.push('API_TIMEOUT must be between 1 and 30 seconds')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validate config on module load in development
if (CONFIG.IS_DEVELOPMENT) {
  const validation = validateConfig()
  if (!validation.isValid) {
    console.warn('Configuration validation failed:', validation.errors)
  }
}