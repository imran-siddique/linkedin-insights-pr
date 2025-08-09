import React from 'react'
import { Card, CardProps } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface GlassCardProps extends CardProps {
  gradient?: boolean
  blur?: 'sm' | 'md' | 'lg'
  opacity?: 'low' | 'medium' | 'high'
}

export function GlassCard({ 
  className, 
  gradient = false, 
  blur = 'sm', 
  opacity = 'medium',
  children, 
  ...props 
}: GlassCardProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md', 
    lg: 'backdrop-blur-lg'
  }

  const opacityClasses = {
    low: 'bg-white/60',
    medium: 'bg-white/80',
    high: 'bg-white/90'
  }

  return (
    <Card
      className={cn(
        'border-0 shadow-xl relative overflow-hidden',
        blurClasses[blur],
        opacityClasses[opacity],
        className
      )}
      {...props}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  )
}