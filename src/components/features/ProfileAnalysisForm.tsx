import React, { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlass, Lightning, Info, WarningCircle } from '@phosphor-icons/react'
import { CONFIG } from '@/lib/config'
import { validation, performance } from '@/lib/security'
import { linkedInService } from '@/lib/linkedin-api'
import ScrapingManager from '@/components/ScrapingManager'
import type { ScrapingResult } from '@/types/linkedin'

interface ProfileAnalysisFormProps {
  onAnalyze: (url: string) => void
  isLoading: boolean
  error: string
  analysisStage: string
  showScrapingManager: boolean
  onScrapingComplete: (result: ScrapingResult) => void
  onScrapingError: (error: string) => void
}

export function ProfileAnalysisForm({
  onAnalyze,
  isLoading,
  error,
  analysisStage,
  showScrapingManager,
  onScrapingComplete,
  onScrapingError
}: ProfileAnalysisFormProps) {
  const [linkedinUrl, setLinkedinUrl] = useState('')

  // Debounced input validation
  const debouncedValidateInput = useCallback(
    performance.debounce((input: string) => {
      if (!input.trim()) return
      const validationResult = validation.validateLinkedInInput(input)
      // Handle validation result if needed
    }, 500),
    []
  )

  // Handle input changes with validation
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLinkedinUrl(value)
    debouncedValidateInput(value)
  }, [debouncedValidateInput])

  // Memoized validation result
  const inputValidation = useMemo(() => {
    if (!linkedinUrl.trim()) return { isValid: true }
    return validation.validateLinkedInInput(linkedinUrl.trim())
  }, [linkedinUrl])

  const handleAnalyze = useCallback(() => {
    onAnalyze(linkedinUrl)
  }, [linkedinUrl, onAnalyze])

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MagnifyingGlass className="h-6 w-6 mr-2" />
            Analyze Your LinkedIn Profile
          </CardTitle>
          <CardDescription>
            Enter your LinkedIn profile URL or username to get comprehensive insights and growth recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="linkedin-url">LinkedIn Profile URL or Username</Label>
                <Input
                  id="linkedin-url"
                  placeholder="linkedin.com/in/username or just username"
                  value={linkedinUrl}
                  onChange={handleInputChange}
                  className={`mt-1 ${!inputValidation.isValid ? 'border-destructive' : ''}`}
                  maxLength={CONFIG.MAX_INPUT_LENGTH}
                  disabled={isLoading}
                />
                {linkedinUrl && !inputValidation.isValid && (
                  <p className="text-sm text-destructive mt-1">
                    {inputValidation.error}
                  </p>
                )}
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAnalyze}
                  disabled={isLoading || !inputValidation.isValid || !linkedinUrl.trim()}
                  className="px-6"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Lightning className="h-4 w-4 mr-2" />
                      Analyze Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                <strong>Enhanced Analysis:</strong> Real-time profile scraping with accurate follower count estimation, 
                skill market value analysis, industry-specific benchmarking, competitive analysis, 
                salary & compensation insights, content strategy recommendations, and personalized growth opportunities 
                based on your professional level and industry.
              </AlertDescription>
            </Alert>
            
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <WarningCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading && <LoadingStateCard stage={analysisStage} />}

      {/* Real-time Scraping Manager */}
      {showScrapingManager && (
        <ScrapingManager 
          identifier={linkedInService.extractLinkedInUsername(linkedinUrl.trim()) || ''}
          onScrapingComplete={onScrapingComplete}
          onScrapingError={onScrapingError}
          autoStart={true}
        />
      )}
    </>
  )
}

const LoadingStateCard = ({ stage }: { stage: string }) => (
  <Card className="mb-6">
    <CardContent className="p-6">
      <div className="flex items-center space-x-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-foreground">Analyzing your LinkedIn profile...</p>
          {stage && (
            <p className="text-sm text-muted-foreground flex items-center">
              <Info className="h-4 w-4 mr-2" />
              {stage}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <Progress value={
          stage.includes('Validating') ? 10 :
          stage.includes('Fetching profile') ? 20 :
          stage.includes('recommendations') ? 35 :
          stage.includes('trends') ? 50 :
          stage.includes('skill market') ? 65 :
          stage.includes('strengths') ? 75 :
          stage.includes('activity') ? 85 :
          stage.includes('visual') ? 90 :
          stage.includes('competitive') ? 95 :
          stage.includes('landscape') ? 95 :
          stage.includes('salary benchmarks') ? 98 :
          stage.includes('skills analysis') ? 100 : 5
        } className="w-full" />
      </div>
    </CardContent>
  </Card>
)