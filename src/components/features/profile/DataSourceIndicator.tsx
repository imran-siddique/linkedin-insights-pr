import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Globe, Shield, CircleNotch, Clock } from '@phosphor-icons/react'
import type { ProfileData, ScrapingResult } from '@/types/linkedin'

interface DataSourceIndicatorProps {
  scrapingResult: ScrapingResult | null
  profileData: ProfileData
}

export function DataSourceIndicator({ scrapingResult, profileData }: DataSourceIndicatorProps) {
  if (!scrapingResult) return null

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Data Source:</span>
              <Badge variant="default">{scrapingResult.source}</Badge>
            </div>
            
            {scrapingResult.confidence && (
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Confidence:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {Math.round(scrapingResult.confidence * 100)}%
                </Badge>
              </div>
            )}
            
            {profileData.dataFreshness && (
              <div className="flex items-center space-x-2">
                <CircleNotch className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Freshness:</span>
                <Badge variant="secondary" className="capitalize">
                  {profileData.dataFreshness}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Updated {new Date(scrapingResult.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}