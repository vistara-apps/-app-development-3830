import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '../lib/utils'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const TOAST_DURATION = 5000 // 5 seconds

const toastVariants = {
  success: {
    icon: CheckCircle,
    className: 'bg-success-50 border-success-500 text-success-600',
    iconClassName: 'text-success-500'
  },
  error: {
    icon: AlertCircle,
    className: 'bg-error-50 border-error-500 text-error-600',
    iconClassName: 'text-error-500'
  },
  info: {
    icon: Info,
    className: 'bg-primary-50 border-primary-500 text-primary-600',
    iconClassName: 'text-primary-500'
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-warning-50 border-warning-500 text-warning-600',
    iconClassName: 'text-warning-500'
  }
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = TOAST_DURATION) => {
    const id = Date.now().toString()
    
    setToasts(prev => [...prev, { id, message, type, duration }])
    
    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const Toast = ({ toast }) => {
    const { id, message, type } = toast
    const variant = toastVariants[type]
    const Icon = variant.icon

    return (
      <div 
        className={cn(
          "flex items-center p-4 rounded-md border shadow-sm mb-3 max-w-md w-full animate-in fade-in slide-in-from-right-5",
          variant.className
        )}
        role="alert"
      >
        <Icon className={cn("h-5 w-5 mr-3 flex-shrink-0", variant.iconClassName)} />
        <div className="flex-1 mr-2">{message}</div>
        <button 
          onClick={() => removeToast(id)}
          className="p-1 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

