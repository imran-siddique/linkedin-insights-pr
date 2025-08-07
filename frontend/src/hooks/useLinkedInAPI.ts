import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from 'react-query'
import { linkedInAPI } from '../services/api'
import { toast } from 'sonner'

// Profile hooks
export const useAnalyzeProfile = (options?: UseMutationOptions<any, Error, string>) => {
  return useMutation({
    mutationFn: linkedInAPI.analyzeProfile,
    onSuccess: () => {
      toast.success('Profile analyzed successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
    ...options,
  })
}

export const useProfileInsights = (username: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['profile-insights', username],
    queryFn: () => linkedInAPI.getProfileInsights(username),
    enabled: !!username,
    ...options,
  })
}

export const useActivityMetrics = (username: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['activity-metrics', username],
    queryFn: () => linkedInAPI.getActivityMetrics(username),
    enabled: !!username,
    ...options,
  })
}

export const useVisualBranding = (username: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['visual-branding', username],
    queryFn: () => linkedInAPI.getVisualBranding(username),
    enabled: !!username,
    ...options,
  })
}

// Recommendations hooks
export const useGenerateRecommendations = (options?: UseMutationOptions<any, Error, any>) => {
  return useMutation({
    mutationFn: linkedInAPI.generateRecommendations,
    onError: (error: Error) => {
      toast.error(error.message)
    },
    ...options,
  })
}

export const useSkillInsights = (
  skills: string[],
  experience: number,
  industry: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['skill-insights', skills, experience, industry],
    queryFn: () => linkedInAPI.getSkillInsights(skills, experience, industry),
    enabled: skills.length > 0 && !!industry,
    ...options,
  })
}

export const useTrendingTopics = (profileData: any, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['trending-topics', profileData],
    queryFn: () => linkedInAPI.getTrendingTopics(profileData),
    enabled: !!profileData,
    ...options,
  })
}

export const useContentStrategy = (industry: string, experience?: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['content-strategy', industry, experience],
    queryFn: () => linkedInAPI.getContentStrategy(industry, experience),
    enabled: !!industry,
    ...options,
  })
}

// Competitive analysis hooks
export const useCompetitiveAnalysis = (options?: UseMutationOptions<any, Error, any>) => {
  return useMutation({
    mutationFn: linkedInAPI.performCompetitiveAnalysis,
    onError: (error: Error) => {
      toast.error(error.message)
    },
    ...options,
  })
}

export const useCompetitiveProfiles = (options?: UseMutationOptions<any, Error, { profileData: any; sampleSize?: number }>) => {
  return useMutation({
    mutationFn: ({ profileData, sampleSize }) => linkedInAPI.generateCompetitiveProfiles(profileData, sampleSize),
    onError: (error: Error) => {
      toast.error(error.message)
    },
    ...options,
  })
}

export const useIndustryBenchmarks = (industry: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['industry-benchmarks', industry],
    queryFn: () => linkedInAPI.getIndustryBenchmarks(industry),
    enabled: !!industry,
    ...options,
  })
}

// Compensation hooks
export const useCompensationAnalysis = (options?: UseMutationOptions<any, Error, any>) => {
  return useMutation({
    mutationFn: linkedInAPI.analyzeCompensation,
    onError: (error: Error) => {
      toast.error(error.message)
    },
    ...options,
  })
}

export const useSalaryBenchmarks = (
  industry: string,
  role?: string,
  experience?: string,
  location?: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['salary-benchmarks', industry, role, experience, location],
    queryFn: () => linkedInAPI.getSalaryBenchmarks(industry, role, experience, location),
    enabled: !!industry,
    ...options,
  })
}

export const useSkillImpact = (
  skills: string[],
  industry?: string,
  experience?: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['skill-impact', skills, industry, experience],
    queryFn: () => linkedInAPI.getSkillImpact(skills, industry, experience),
    enabled: skills.length > 0,
    ...options,
  })
}

export const useSalaryTrends = (industry: string, timeframe?: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['salary-trends', industry, timeframe],
    queryFn: () => linkedInAPI.getSalaryTrends(industry, timeframe),
    enabled: !!industry,
    ...options,
  })
}