import React from 'react'
import { Badge } from '@/components/ui/badge'
import { CONFIG } from '@/lib/config'
import { LinkedinLogo, TrendUp } from '@phosphor-icons/react'

export function AppHeader() {
  return (
    <div className="text-center mb-16">
      <div className="flex justify-center items-center mb-6">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm">
            <LinkedinLogo size={48} className="text-primary" />
          </div>
        </div>
      </div>
      
      <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-4">
        {CONFIG.APP_NAME}
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
        Transform your LinkedIn presence with AI-powered insights, competitive analysis, 
        and personalized growth strategies tailored to your industry.
      </p>

      <div className="flex justify-center items-center gap-6 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-border/30">
          <TrendUp size={16} className="text-accent" />
          <span className="text-sm font-medium text-foreground">Real-time Analytics</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-border/30">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-foreground">AI-Powered Insights</span>
        </div>
      </div>
      
      {CONFIG.ENABLE_DEBUG_MODE && (
        <div className="mt-4">
          <Badge variant="outline" className="text-xs font-mono bg-white/50 backdrop-blur-sm">
            v{CONFIG.APP_VERSION} • Debug Mode
          </Badge>
        </div>
      )}
    </div>
  )
}