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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          
          <AppHeader />
          
          <ProfileAnalysisForm
            onAnalyze={analyzeProfile}
            isLoading={isLoading}
            error={error}
            analysisStage={analysisStage}
            showScrapingManager={showScrapingManager}
            onScrapingComplete={handleScrapingComplete}
            onScrapingError={handleScrapingError}
          />

          {hasProfileData && (
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
          )}

        </div>
      </div>
      <Toaster />
    </ErrorBoundary>
  )
}

export default App