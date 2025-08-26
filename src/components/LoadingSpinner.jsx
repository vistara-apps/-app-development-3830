import React from 'react'
import { cn } from '../lib/utils'

const sizes = {
  xs: 'h-3 w-3 border-[1.5px]',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
  xl: 'h-12 w-12 border-4'
}

const variants = {
  primary: 'border-primary-200 border-t-primary-600',
  accent: 'border-accent-200 border-t-accent-600',
  white: 'border-white/30 border-t-white',
  light: 'border-gray-200 border-t-gray-600',
}

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary', 
  className,
  fullscreen = false,
  label = 'Loading...'
}) => {
  const spinner = (
    <div 
      className={cn(
        "inline-block rounded-full animate-spin", 
        sizes[size], 
        variants[variant],
        className
      )}
      role="status"
      aria-label={label}
    />
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center space-y-3">
          {spinner}
          {label && <p className="text-text-secondary font-medium">{label}</p>}
        </div>
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner

