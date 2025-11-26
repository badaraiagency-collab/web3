/**
 * Utility for consistent error handling across the app
 * This helps convert various error types into user-friendly messages
 */

export interface ErrorInfo {
  title: string
  message: string
  variant?: 'default' | 'destructive'
  isFallback?: boolean
  setupRequired?: boolean
}

export class ErrorHandler {
  /**
   * Convert any error into a user-friendly error message
   */
  static formatError(error: unknown): ErrorInfo {
    if (error instanceof Error) {
      return this.formatErrorInstance(error)
    }
    
    if (typeof error === 'string') {
      return {
        title: 'Error',
        message: error,
        variant: 'destructive'
      }
    }
    
    return {
      title: 'Unexpected Error',
      message: 'An unexpected error occurred. Please try again.',
      variant: 'destructive'
    }
  }

  /**
   * Format Error instances with specific handling for common error types
   */
  private static formatErrorInstance(error: Error): ErrorInfo {
    const message = error.message.toLowerCase()
    
    // Network errors
    if (message.includes('failed to fetch') || message.includes('network error')) {
      return {
        title: 'Connection Error',
        message: 'Could not connect to the server. Please check your internet connection and ensure the backend server is running.',
        variant: 'destructive'
      }
    }
    
    // Authentication errors
    if (message.includes('unauthorized') || message.includes('401')) {
      return {
        title: 'Authentication Error',
        message: 'Your session has expired. Please log in again.',
        variant: 'destructive'
      }
    }
    
    // Permission errors
    if (message.includes('forbidden') || message.includes('403')) {
      return {
        title: 'Permission Denied',
        message: 'You do not have permission to perform this action.',
        variant: 'destructive'
      }
    }
    
    // Server errors
    if (message.includes('internal server error') || message.includes('500')) {
      return {
        title: 'Server Error',
        message: 'The server encountered an error. Please try again later.',
        variant: 'destructive'
      }
    }
    
    // Service unavailable
    if (message.includes('service unavailable') || message.includes('503')) {
      return {
        title: 'Service Unavailable',
        message: 'The service is temporarily unavailable. Please try again later.',
        variant: 'destructive'
      }
    }
    
    // Google Sheets specific errors
    if (message.includes('google sheets service')) {
      if (message.includes('not configured')) {
        return {
          title: 'Setup Required',
          message: 'Google Sheets service is not configured. Please contact support for setup.',
          variant: 'destructive',
          setupRequired: true
        }
      }
      if (message.includes('needs configuration')) {
        return {
          title: 'Configuration Required',
          message: 'Google Sheets service needs configuration. Please contact support.',
          variant: 'destructive',
          setupRequired: true
        }
      }
    }
    
    // Default error handling
    return {
      title: 'Error',
      message: error.message || 'An unexpected error occurred. Please try again.',
      variant: 'destructive'
    }
  }

  /**
   * Check if an error indicates a fallback mode should be activated
   */
  static isFallbackError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      return message.includes('fallback') || 
             message.includes('not configured') || 
             message.includes('needs configuration') ||
             message.includes('service unavailable')
    }
    return false
  }

  /**
   * Check if an error indicates setup is required
   */
  static isSetupRequiredError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      return message.includes('not configured') || 
             message.includes('needs configuration') ||
             message.includes('setup required')
    }
    return false
  }
}
