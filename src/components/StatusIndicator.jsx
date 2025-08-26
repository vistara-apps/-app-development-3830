import React from 'react'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { cn } from '../lib/utils'

const StatusIndicator = ({ status, variant = 'default', className, message }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'syncing':
        return {
          icon: Loader,
          text: message || 'Syncing to CRM...',
          className: 'text-blue-500',
          iconClassName: 'animate-spin'
        }
      case 'synced':
        return {
          icon: CheckCircle,
          text: message || 'Successfully synced to CRM',
          className: 'text-green-500',
          iconClassName: ''
        }
      case 'error':
        return {
          icon: AlertCircle,
          text: message || 'Error syncing to CRM',
          className: 'text-red-500',
          iconClassName: ''
        }
      default:
        return {
          icon: AlertCircle,
          text: message || 'Unknown status',
          className: 'text-gray-500',
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

  return (
    <div className={cn("flex items-center space-x-3 p-4 rounded-md border", className, {
      'bg-blue-50 border-blue-200': status === 'syncing',
      'bg-green-50 border-green-200': status === 'synced',
      'bg-red-50 border-red-200': status === 'error',
    })}>
      <Icon className={cn("h-5 w-5", config.className, config.iconClassName)} />
      <span className={cn("font-medium", config.className)}>{config.text}</span>
    </div>
  )
}

export default StatusIndicator