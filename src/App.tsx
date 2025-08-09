import React, { useState, useCallback, useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from '@/components/ui/sonner'
import { ErrorFallback } from '@/ErrorFallback'
import { ProfileAnalysisForm } from '@/components/features/ProfileAnalysisForm'
import { ProfileDashboard } from '@/components/features/ProfileDashboard'
import { useProfileAnalysis } from '@/hooks/useProfileAnalysis'
import { CONFIG } from '@/lib/config'
import { errorService, setupGlobalErrorHandling } from '@/lib/errorHandling'
import { Badge } from '@/components/ui/badge'
import { AppHeader } from '@/components/layout/AppHeader'
import { motion } from 'framer-motion'

function App() {
  const {
    profileData,
    recommendations,
    trendingTopics,
    skillInsights,
    profileInsights,
    activityMetrics,
    visualBranding,
    competitiveAnalysis,
    compensationAnalysis,
    skillsAnalysis,
    scrapingResult,
    isLoading,
    error,
    analysisStage,
    showScrapingManager,
    analyzeProfile,
    handleScrapingComplete,
    handleScrapingError
  } = useProfileAnalysis()

  // Setup global error handling on app load
  React.useEffect(() => {
    setupGlobalErrorHandling()
    
    if (CONFIG.ENABLE_DEBUG_MODE) {
      console.log(`🚀 ${CONFIG.APP_NAME} v${CONFIG.APP_VERSION} started`)
    }
  }, [])

  const handleErrorBoundaryError = useCallback((error: Error, errorInfo: any) => {
    errorService.logError(error, 'React Error Boundary')
    if (CONFIG.ENABLE_DEBUG_MODE) {
      console.error('React Error Boundary caught error:', error, errorInfo)
    }
  }, [])

  const handleErrorBoundaryReset = useCallback(() => {
    if (CONFIG.ENABLE_DEBUG_MODE) {
      console.log('🔄 Application reset after error')
    }
  }, [])

  const hasProfileData = profileData && !isLoading && !showScrapingManager

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleErrorBoundaryError}
      onReset={handleErrorBoundaryReset}
    >
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(var(--muted-foreground)_/_0.15)_1px,transparent_0)] [background-size:32px_32px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-12 max-w-7xl">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AppHeader />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProfileAnalysisForm
                onAnalyze={analyzeProfile}
                isLoading={isLoading}
                error={error}
                analysisStage={analysisStage}
                showScrapingManager={showScrapingManager}
                onScrapingComplete={handleScrapingComplete}
                onScrapingError={handleScrapingError}
              />
            </motion.div>

            {hasProfileData && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <ProfileDashboard
                  profileData={profileData}
                  scrapingResult={scrapingResult}
                  recommendations={recommendations}
                  trendingTopics={trendingTopics}
                  skillInsights={skillInsights}
                  profileInsights={profileInsights}
                  activityMetrics={activityMetrics}
                  visualBranding={visualBranding}
                  competitiveAnalysis={competitiveAnalysis}
                  compensationAnalysis={compensationAnalysis}
                  skillsAnalysis={skillsAnalysis}
                />
              </motion.div>
            )}

          </div>
        </div>
      </div>
      <Toaster />
    </ErrorBoundary>
  )
}

export default App