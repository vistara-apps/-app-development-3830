import React from 'react'
import { cn } from '../lib/utils'

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  iconClassName,
  variant = 'default'
}) => {
  const renderContent = () => (
    <>
      {Icon && (
        <div className={cn(
          "mx-auto rounded-full p-3 mb-4",
          variant === 'default' ? 'bg-gray-100' : 'bg-primary-100',
          iconClassName
        )}>
          <Icon className={cn(
            "h-8 w-8",
            variant === 'default' ? 'text-gray-500' : 'text-primary-500'
          )} />
        </div>
      )}
      
      {title && (
        <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      )}
      
      {description && (
        <p className="text-text-secondary mb-6 max-w-md mx-auto">{description}</p>
      )}
      
      {action}
    </>
  )

  if (variant === 'compact') {
    return (
      <div className={cn("text-center py-6", className)}>
        {renderContent()}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn("card text-center py-10", className)}>
        {renderContent()}
      </div>
    )
  }

  return (
    <div className={cn("text-center py-16", className)}>
      {renderContent()}
    </div>
  )
}

export default EmptyState

