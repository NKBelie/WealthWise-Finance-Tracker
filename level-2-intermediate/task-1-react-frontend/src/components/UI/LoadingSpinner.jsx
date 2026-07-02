import React from 'react'
import { Loader2 } from 'lucide-react'

function LoadingSpinner({ 
  size = 'medium', 
  text = 'Loading...', 
  className = '' 
}) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <Loader2 
        className={`animate-spin text-primary-600 ${sizeClasses[size]}`} 
      />
      {text && (
        <p className="text-sm text-gray-600">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner