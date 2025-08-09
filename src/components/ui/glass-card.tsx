import React from 'react'
import { cn } from '@/lib/utils'
import { motion, MotionProps } from 'framer-motion'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The intensity of the glass effect (0-1)
   * @default 0.1
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
  
  /**
   * The blur amount in pixels
   * @default 12
   */
  blur?: number
  
  /**
   * Additional Framer Motion props
   */
  motionProps?: MotionProps
}

/**
 * A modern glass-morphism card component with sophisticated visual effects.
 * Features backdrop blur, subtle borders, and smooth hover interactions.
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    children, 
    intensity = 0.1, 
    border = true, 
    hover = true, 
    blur = 12,
    motionProps = {},
    ...props 
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
          
          // Glass effect with dynamic backdrop blur
          `backdrop-blur-[${blur}px] backdrop-saturate-150`,
          
          // Background with opacity control
          'bg-card/80',
          
          // Border with subtle glow
          border && [
            'border border-border/50',
            'shadow-[0_0_0_1px_rgba(255,255,255,0.05)]'
          ],
          
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
          
          className
        )}
        {...defaultMotionProps}
        {...props}
      >
        {/* Inner glow effect */}
        <div 
          className="absolute inset-0 rounded-xl opacity-50"
          style={{
            background: `radial-gradient(circle at 50% 0%, hsl(var(--primary) / ${backgroundOpacity}), transparent 70%)`
          }}
        />
        
        {/* Subtle top highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Content container */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

/**
 * Glass card header component with proper spacing and typography
 */
export const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-1.5 p-6 pb-4',
      className
    )}
    {...props}
  />
))
GlassCardHeader.displayName = 'GlassCardHeader'

/**
 * Glass card title with optimized typography
 */
export const GlassCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-none tracking-tight text-foreground',
      className
    )}
    {...props}
  />
))
GlassCardTitle.displayName = 'GlassCardTitle'

/**
 * Glass card description with muted styling
 */
export const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-muted-foreground leading-relaxed',
      className
    )}
    {...props}
  />
))
GlassCardDescription.displayName = 'GlassCardDescription'

/**
 * Glass card content area with proper padding
 */
export const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-0', className)}
    {...props}
  />
))
GlassCardContent.displayName = 'GlassCardContent'

/**
 * Glass card footer with subtle separation
 */
export const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center p-6 pt-0 border-t border-border/20 mt-auto',
      className
    )}
    {...props}
  />
))
GlassCardFooter.displayName = 'GlassCardFooter'