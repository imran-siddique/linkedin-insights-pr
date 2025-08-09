import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FloatingElementProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FloatingElement({ children, delay = 0, className }: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [-2, 2, -2],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface GradientTextProps {
  children: React.ReactNode
  className?: string
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span className={cn(
      'bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent',
      className
    )}>
      {children}
    </span>
  )
}

interface HoverGlowProps {
  children: React.ReactNode
  className?: string
  glowColor?: 'primary' | 'accent' | 'success' | 'warning'
}

export function HoverGlow({ children, className, glowColor = 'primary' }: HoverGlowProps) {
  const glowClasses = {
    primary: 'group-hover:shadow-primary/20',
    accent: 'group-hover:shadow-accent/20',
    success: 'group-hover:shadow-green-500/20',
    warning: 'group-hover:shadow-orange-500/20'
  }

  return (
    <div className={cn('group transition-all duration-300', className)}>
      <div className={cn(
        'transition-shadow duration-300 hover:shadow-2xl',
        glowClasses[glowColor]
      )}>
        {children}
      </div>
    </div>
  )
}

interface TypewriterProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function Typewriter({ text, speed = 50, className, onComplete }: TypewriterProps) {
  const [displayedText, setDisplayedText] = React.useState('')
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else {
      onComplete?.()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-block"
        >
          |
        </motion.span>
      )}
    </span>
  )
}