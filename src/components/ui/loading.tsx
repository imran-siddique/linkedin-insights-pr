import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'accent'
  className?: string
}

export function Spinner({ 
  size = 'md', 
  variant = 'primary', 
  className 
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  const variantClasses = {
    primary: 'border-primary',
    secondary: 'border-muted-foreground',
    accent: 'border-accent'
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={cn(
        'rounded-full border-2 border-transparent border-t-current border-r-current',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  )
}

interface PulsingDotsProps {
  count?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'accent'
  className?: string
}

export function PulsingDots({ 
  count = 3, 
  size = 'md', 
  variant = 'primary',
  className 
}: PulsingDotsProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  }

  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-muted-foreground',
    accent: 'bg-accent'
  }

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
          className={cn(
            'rounded-full',
            sizeClasses[size],
            variantClasses[variant]
          )}
        />
      ))}
    </div>
  )
}

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  variant?: 'primary' | 'accent' | 'gradient'
  className?: string
}

export function ProgressRing({ 
  progress, 
  size = 64, 
  strokeWidth = 4,
  variant = 'primary',
  className 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  const variantClasses = {
    primary: 'stroke-primary',
    accent: 'stroke-accent',
    gradient: 'stroke-url(#gradient)'
  }

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {variant === 'gradient' && (
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        )}
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={variantClasses[variant]}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      
      {/* Progress text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium text-foreground">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}