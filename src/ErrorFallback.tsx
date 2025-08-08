import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { WarningCircle, ArrowCounterClockwise } from '@phosphor-icons/react'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <WarningCircle className="h-6 w-6 mr-2" />
            Something went wrong
          </CardTitle>
          <CardDescription>
            An unexpected error occurred while running the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-destructive/50 bg-destructive/5">
            <WarningCircle className="h-4 w-4" />
            <AlertDescription className="font-mono text-sm">
              {error.message}
            </AlertDescription>
          </Alert>
          
          <Button onClick={resetErrorBoundary} className="w-full">
            <ArrowCounterClockwise className="h-4 w-4 mr-2" />
            Try again
          </Button>
          
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Reload page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}