import React, { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  MagnifyingGlass, 
  Lightning, 
  Info, 
  WarningCircle, 
  CheckCircle,
  Sparkle,
  User,
  TrendUp,
  Shield,
  Target
} from '@phosphor-icons/react'
import { CONFIG } from '@/lib/config'
import { validation, performance } from '@/lib/security'
import { linkedInService } from '@/lib/linkedin-api'
import ScrapingManager from '@/components/ScrapingManager'
import type { ScrapingResult } from '@/types/linkedin'
import { motion } from 'framer-motion'

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
  const [inputFocused, setInputFocused] = useState(false)

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

  const features = [
    { icon: User, label: 'Profile Analysis', description: 'Complete profile scoring & optimization tips' },
    { icon: TrendUp, label: 'Industry Insights', description: 'Market trends & growth opportunities' },
    { icon: Target, label: 'Competitive Analysis', description: 'Benchmark against industry peers' },
    { icon: Sparkle, label: 'AI Recommendations', description: 'Personalized content & networking strategies' }
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <Card className="relative overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          
          <CardHeader className="relative z-10 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-2xl font-semibold">
                  <div className="mr-3 p-2 bg-primary/10 rounded-xl">
                    <MagnifyingGlass className="h-6 w-6 text-primary" />
                  </div>
                  Analyze Your LinkedIn Profile
                </CardTitle>
                <CardDescription className="text-base mt-2 text-muted-foreground max-w-2xl">
                  Get comprehensive insights, competitive analysis, and personalized growth recommendations 
                  powered by real-time data and AI analysis.
                </CardDescription>
              </div>
              <div className="hidden md:flex">
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Secure & Private
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10 space-y-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="linkedin-url" className="text-sm font-medium text-foreground">
                  LinkedIn Profile URL or Username
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="linkedin-url"
                    placeholder="linkedin.com/in/username or just username"
                    value={linkedinUrl}
                    onChange={handleInputChange}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className={`
                      pl-12 pr-4 h-14 text-base transition-all duration-200
                      ${!inputValidation.isValid 
                        ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
                        : 'focus:border-primary focus:ring-primary/20'
                      }
                      ${inputFocused || linkedinUrl 
                        ? 'bg-white shadow-lg scale-[1.02]' 
                        : 'bg-white/70'
                      }
                    `}
                    maxLength={CONFIG.MAX_INPUT_LENGTH}
                    disabled={isLoading}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <MagnifyingGlass 
                      className={`h-5 w-5 transition-colors ${
                        inputFocused ? 'text-primary' : 'text-muted-foreground'
                      }`} 
                    />
                  </div>
                  {linkedinUrl && inputValidation.isValid && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="h-5 w-5 text-accent" />
                    </div>
                  )}
                </div>
                
                {linkedinUrl && !inputValidation.isValid && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive mt-2 flex items-center"
                  >
                    <WarningCircle className="h-4 w-4 mr-1" />
                    {inputValidation.error}
                  </motion.p>
                )}
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleAnalyze}
                  disabled={isLoading || !inputValidation.isValid || !linkedinUrl.trim()}
                  size="lg"
                  className={`
                    px-8 py-6 text-base font-medium transition-all duration-200
                    ${isLoading 
                      ? 'bg-muted text-muted-foreground' 
                      : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:scale-105'
                    }
                  `}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Analyzing Profile...
                    </>
                  ) : (
                    <>
                      <Lightning className="h-5 w-5 mr-3" />
                      Start Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-border/50">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-4 rounded-xl hover:bg-white/60 transition-colors"
                >
                  <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm text-foreground mb-1">{feature.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Info Alert */}
            <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
              <Info className="h-5 w-5 text-primary" />
              <AlertDescription className="text-foreground">
                <span className="font-medium">Enhanced Analysis Includes:</span> Real-time profile scraping, 
                accurate follower metrics, skill market value assessment, industry benchmarking, 
                competitive analysis, salary insights, and personalized growth strategies.
              </AlertDescription>
            </Alert>
            
            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Alert className="border-destructive/20 bg-destructive/5">
                  <WarningCircle className="h-5 w-5 text-destructive" />
                  <AlertDescription className="text-destructive font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

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
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="mb-8 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Animated Icon */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
          </div>

          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-semibold text-foreground">Analyzing Your Profile</h3>
            <p className="text-muted-foreground">
              Our AI is processing your LinkedIn data to generate personalized insights and recommendations.
            </p>
          </div>

          {stage && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-primary/5 rounded-full">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{stage}</span>
            </div>
          )}

          {/* Enhanced Progress Bar */}
          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>
                {stage.includes('Validating') ? '10%' :
                 stage.includes('Fetching profile') ? '20%' :
                 stage.includes('recommendations') ? '35%' :
                 stage.includes('trends') ? '50%' :
                 stage.includes('skill market') ? '65%' :
                 stage.includes('strengths') ? '75%' :
                 stage.includes('activity') ? '85%' :
                 stage.includes('visual') ? '90%' :
                 stage.includes('competitive') ? '95%' :
                 stage.includes('landscape') ? '95%' :
                 stage.includes('salary benchmarks') ? '98%' :
                 stage.includes('skills analysis') ? '100%' : '5%'}
              </span>
            </div>
            <Progress 
              value={
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
              }
              className="w-full h-2 bg-muted" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)