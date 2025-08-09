import React from 'react'
import { Badge } from '@/components/ui/badge'
import { CONFIG } from '@/lib/config'

export function AppHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-foreground mb-2">
        {CONFIG.APP_NAME}
      </h1>
      <p className="text-lg text-muted-foreground">
        Unlock insights from your LinkedIn profile and discover opportunities for professional growth
      </p>
      {CONFIG.ENABLE_DEBUG_MODE && (
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            v{CONFIG.APP_VERSION} • Debug Mode
          </Badge>
        </div>
      )}
    </div>
  )
}