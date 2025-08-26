import React from 'react'
import { CheckCircle, AlertCircle, Loader, Clock } from 'lucide-react'
import { cn } from '../lib/utils'

const StatusIndicator = ({ status, variant = 'default', className, message }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'syncing':
        return {
          icon: Loader,
          text: message || 'Syncing to CRM...',
          className: 'text-primary-500',
          bgClassName: 'bg-primary-50 border-primary-200',
          iconClassName: 'animate-spin'
        }
      case 'synced':
        return {
          icon: CheckCircle,
          text: message || 'Successfully synced to CRM',
          className: 'text-success-500',
          bgClassName: 'bg-success-50 border-success-200',
          iconClassName: ''
        }
      case 'error':
        return {
          icon: AlertCircle,
          text: message || 'Error syncing to CRM',
          className: 'text-error-500',
          bgClassName: 'bg-error-50 border-error-200',
          iconClassName: ''
        }
      case 'pending':
        return {
          icon: Clock,
          text: message || 'Pending sync to CRM',
          className: 'text-warning-500',
          bgClassName: 'bg-warning-50 border-warning-200',
          iconClassName: ''
        }
      default:
        return {
          icon: AlertCircle,
          text: message || 'Unknown status',
          className: 'text-text-tertiary',
          bgClassName: 'bg-gray-50 border-gray-200',
          iconClassName: ''
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Icon className={cn("h-4 w-4", config.className, config.iconClassName)} />
        <span className={cn("text-sm", config.className)}>{config.text}</span>
      </div>
    )
  }

  if (variant === 'badge') {
    return (
      <div className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", className, {
        'bg-primary-100 text-primary-800': status === 'syncing',
        'bg-success-100 text-success-600': status === 'synced',
        'bg-error-100 text-error-600': status === 'error',
        'bg-warning-100 text-warning-600': status === 'pending',
        'bg-gray-100 text-gray-600': status === 'unknown',
      })}>
        <Icon className={cn("h-3 w-3 mr-1", config.iconClassName)} />
        <span>{config.text}</span>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex items-center space-x-3 p-4 rounded-lg border shadow-sm transition-all duration-base", 
      config.bgClassName,
      className
    )}>
      <div className={cn(
        "p-2 rounded-full", 
        status === 'syncing' && 'bg-primary-100',
        status === 'synced' && 'bg-success-100',
        status === 'error' && 'bg-error-100',
        status === 'pending' && 'bg-warning-100',
        status === 'unknown' && 'bg-gray-100'
      )}>
        <Icon className={cn("h-5 w-5", config.className, config.iconClassName)} />
      </div>
      <div className="flex-1">
        <span className={cn("font-medium", config.className)}>{config.text}</span>
        {message && status !== 'synced' && status !== 'syncing' && (
          <p className="text-sm text-text-secondary mt-1">{message}</p>
        )}
      </div>
    </div>
  )
}

export default StatusIndicator
