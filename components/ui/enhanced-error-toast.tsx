"use client"

import { useState } from "react"
import { AlertTriangle, Info, RefreshCw, ExternalLink, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ErrorHandlingResult } from "@/lib/api-error-handler"

interface EnhancedErrorToastProps {
  error: ErrorHandlingResult
  onRetry?: () => void
  onDismiss?: () => void
  onShowHelp?: () => void
}

export function EnhancedErrorToast({ 
  error, 
  onRetry, 
  onDismiss, 
  onShowHelp 
}: EnhancedErrorToastProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getIcon = () => {
    switch (error.variant) {
      case 'destructive':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getVariantClasses = () => {
    switch (error.variant) {
      case 'destructive':
        return 'border-red-200 bg-red-50 text-red-800'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800'
    }
  }

  const handleAction = () => {
    switch (error.action) {
      case 'retry':
        onRetry?.()
        break
      case 'show_help':
        onShowHelp?.()
        break
      case 'redirect':
        // Handle redirect logic
        break
      default:
        break
    }
  }

  return (
    <div className={`border rounded-lg p-4 ${getVariantClasses()}`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">{error.title}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm mb-3">{error.message}</p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {error.action === 'retry' && onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="h-8 px-3 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
            
            {error.action === 'show_help' && onShowHelp && (
              <Button
                size="sm"
                variant="outline"
                onClick={onShowHelp}
                className="h-8 px-3 text-xs"
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                Show Help
              </Button>
            )}
            
            {error.helpText && (
              <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CollapsibleTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-3 text-xs"
                  >
                    <Info className="h-3 w-3 mr-1" />
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="text-xs bg-white/50 rounded p-2 border">
                    {error.helpText}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
