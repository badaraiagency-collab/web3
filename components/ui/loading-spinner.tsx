import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  text?: string
  subtitle?: string
  showProgress?: boolean
  progressWidth?: number
  className?: string
}

export function LoadingSpinner({ 
  size = "md", 
  text = "Loading...", 
  subtitle,
  showProgress = false,
  progressWidth = 60,
  className = ""
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16",
    xl: "h-20 w-20"
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  }

  const titleSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  }

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-pulse"></div>
        </div>
        
        <div className="space-y-2">
          <h2 className={`font-semibold text-gray-900 ${titleSizes[size]}`}>
            {text}
          </h2>
          {subtitle && (
            <p className={`text-gray-600 max-w-md mx-auto ${textSizes[size]}`}>
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Show progress indicator */}
        {showProgress && (
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full animate-pulse transition-all duration-300" 
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}
