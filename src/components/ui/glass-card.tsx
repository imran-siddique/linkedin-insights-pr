import React from 'react'
import { cn } from '@/lib/utils'
import { motion, MotionProps } from 'framer-motion'

   */
  
   * Whether to show the border
   */
   */
  intensity?: number
  
  /**
   * Whether to show the border
   * @default true
   */
  border?: boolean
  
  /**
   * Whether to enable hover effects
   * @default true
   */
  hover?: boolean
}
  /**
 * A modern glass-morphism car
   * @default 12
expor
  blur?: number
  
  /**
   * Additional Framer Motion props
   */
  motionProps?: MotionProps
}

/**
 * A modern glass-morphism card component with sophisticated visual effects.
 * Features backdrop blur, subtle borders, and smooth hover interactions.
   
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
     
    className, 
    }
    intensity = 0.1, 
    border = true, 
    hover = true, 
    blur = 12,
    motionProps = {},
          // 
  }, ref) => {
    // Generate dynamic styles based on intensity
    const backgroundOpacity = Math.max(0.05, Math.min(0.2, intensity))
    const borderOpacity = Math.max(0.1, Math.min(0.3, intensity * 2))
    
    const defaultMotionProps: MotionProps = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
      whileHover: hover ? { 
        y: -2,
        transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
      } : undefined,
      ...motionProps
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          // Base styles
          'relative overflow-hidden rounded-xl',
          
          style={{
          `backdrop-blur-[${blur}px] backdrop-saturate-150`,
        />
          // Background with opacity control
          'bg-card/80',
          
        <div className="relative z-1
          border && [
            'border border-border/50',
            'shadow-[0_0_0_1px_rgba(255,255,255,0.05)]'
)
  HTMLDivE
          // Shadow system for depth
          'shadow-lg shadow-black/5',
          'dark:shadow-black/20',
          
          // Hover effects
          hover && [
            'transition-all duration-200 ease-out',
            'hover:shadow-xl hover:shadow-black/10',
            'hover:bg-card/90',
            'hover:border-border/70',
            'dark:hover:shadow-black/30'
          ],
          
          // Focus styles for accessibility
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          
  React.HTMLAttribu
        )}
    ref={ref}
        {...props}
      c
        {/* Inner glow effect */}
        <div 
          className="absolute inset-0 rounded-xl opacity-50"

            background: `radial-gradient(circle at 50% 0%, hsl(var(--primary) / ${backgroundOpacity}), transparent 70%)`
 */
        />
  React.
        {/* Subtle top highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Content container */}
        <div className="relative z-10">
          {children}
        </div>

    )
 */
)

GlassCard.displayName = 'GlassCard'

/**
 * Glass card header component with proper spacing and typography
 */
export const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  Reac
    ref={ref}
    ref={ref}
      'flex flex-col space-y-1.5 p-6 pb-4',
      className
    )}
  />
  />

GlassCardHeader.displayName = 'GlassCardHeader'

/**

 */
export const GlassCardTitle = React.forwardRef<
  HTMLParagraphElement,

>(({ className, ...props }, ref) => (

    ref={ref}
    className={cn(
      'text-xl font-semibold leading-none tracking-tight text-foreground',

    )}

  />

GlassCardTitle.displayName = 'GlassCardTitle'

/**
 * Glass card description with muted styling
 */
export const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (

    ref={ref}

      'text-sm text-muted-foreground leading-relaxed',
      className
    )}

  />

GlassCardDescription.displayName = 'GlassCardDescription'

/**

 */
export const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (

    ref={ref}
    className={cn('p-6 pt-0', className)}
    {...props}

))
GlassCardContent.displayName = 'GlassCardContent'


 * Glass card footer with subtle separation

export const GlassCardFooter = React.forwardRef<

  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div

    className={cn(
      'flex items-center p-6 pt-0 border-t border-border/20 mt-auto',
      className

    {...props}

))
GlassCardFooter.displayName = 'GlassCardFooter'