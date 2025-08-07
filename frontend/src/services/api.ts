import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
const API_KEY = import.meta.env.VITE_API_KEY || 'development-key'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens or request modifications here
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'An error occurred'
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.error('Authentication failed')
    } else if (error.response?.status === 429) {
      console.error('Rate limit exceeded')
    }
    
    return Promise.reject(new Error(message))
  }
)

// API service functions
export const linkedInAPI = {
  // Profile endpoints
  analyzeProfile: async (linkedinUrl: string) => {
    return apiClient.post('/profile/analyze', { linkedinUrl })
  },

  getProfileInsights: async (username: string) => {
    return apiClient.get(`/profile/${username}/insights`)
  },

  getActivityMetrics: async (username: string) => {
    return apiClient.get(`/profile/${username}/activity`)
  },

  getVisualBranding: async (username: string) => {
    return apiClient.get(`/profile/${username}/visual-branding`)
  },

  // Recommendations endpoints
  generateRecommendations: async (profileData: any) => {
    return apiClient.post('/recommendations/generate', { profileData })
  },

  getSkillInsights: async (skills: string[], experience: number, industry: string) => {
    return apiClient.post('/recommendations/skill-insights', { skills, experience, industry })
  },

  getTrendingTopics: async (profileData: any) => {
    return apiClient.post('/recommendations/trending-topics', { profileData })
  },

  getContentStrategy: async (industry: string, experience?: string) => {
    return apiClient.get(`/recommendations/content-strategy/${industry}`, {
      params: { experience }
    })
  },

  // Competitive analysis endpoints
  performCompetitiveAnalysis: async (profileData: any) => {
    return apiClient.post('/competitive/analyze', { profileData })
  },

  generateCompetitiveProfiles: async (profileData: any, sampleSize = 10) => {
    return apiClient.post('/competitive/profiles', { profileData, sampleSize })
  },

  getIndustryBenchmarks: async (industry: string) => {
    return apiClient.get(`/competitive/benchmarks/${industry}`)
  },

  // Compensation endpoints
  analyzeCompensation: async (profileData: any) => {
    return apiClient.post('/compensation/analyze', { profileData })
  },

  getSalaryBenchmarks: async (industry: string, role?: string, experience?: string, location?: string) => {
    return apiClient.get('/compensation/benchmarks', {
      params: { industry, role, experience, location }
    })
  },

  getSkillImpact: async (skills: string[], industry?: string, experience?: string) => {
    return apiClient.post('/compensation/skill-impact', { skills, industry, experience })
  },

  getSalaryTrends: async (industry: string, timeframe = '12') => {
    return apiClient.get(`/compensation/trends/${industry}`, {
      params: { timeframe }
    })
  }
}

export default apiClient