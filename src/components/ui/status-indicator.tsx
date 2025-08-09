import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, X, Info, WarningCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface StatusIndicatorProps {
  status: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  onDismiss?: () => void
  className?: string
}

export function StatusIndicator({ 
  status, 
  title, 
  description, 
  onDismiss,
  className 
}: StatusIndicatorProps) {
  const icons = {
    success: CheckCircle,
    error: X,
    warning: WarningCircle,
    info: Info
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-orange-50 border-orange-200 text-orange-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-orange-600',
    info: 'text-blue-600'
  }

  const Icon = icons[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'relative flex items-start space-x-3 p-4 border rounded-xl shadow-sm backdrop-blur-sm',
        colors[status],
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3, type: 'spring' }}
      >
        <Icon className={cn('h-5 w-5 flex-shrink-0', iconColors[status])} />
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="mt-1 text-sm opacity-90">{description}</p>
        )}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 ml-auto opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  )
}

interface SuccessAnimationProps {
  size?: number
  className?: string
}

export function SuccessAnimation({ size = 64, className }: SuccessAnimationProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        duration: 0.5, 
        type: 'spring',
        stiffness: 200,
        damping: 15
      }}
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      {/* Outer ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="absolute inset-0 bg-green-100 rounded-full"
      />
      
      {/* Success checkmark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.2, 
            duration: 0.4, 
            type: 'spring' 
          }}
        >
          <CheckCircle 
            className="text-green-600" 
            size={size * 0.6} 
          />
        </motion.div>
      </div>

      {/* Expanding ring animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0.8 }}
        animate={{ scale: 1.2, opacity: 0 }}
        transition={{ 
          delay: 0.3, 
          duration: 0.6, 
          ease: 'easeOut' 
        }}
        className="absolute inset-0 bg-green-200 rounded-full"
      />
    </motion.div>
  )
}