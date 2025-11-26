export interface ApiError {
  status: number
  message: string
  error?: string
  error_type?: string
  details?: any
}

export interface ErrorHandlingResult {
  title: string
  message: string
  variant: 'default' | 'destructive' | 'warning'
  action?: 'retry' | 'redirect' | 'show_help' | 'none'
  helpText?: string
}

export class ApiErrorHandler {
  private static readonly ERROR_MESSAGES: Record<string, ErrorHandlingResult> = {
    // Campaign API Errors
    'campaign_service_not_ready': {
      title: 'Service Not Ready',
      message: 'The campaign service is not properly configured. Please check Twilio and Google Sheets setup.',
      variant: 'warning',
      action: 'show_help',
      helpText: 'Contact support to verify Twilio and Google Sheets configuration.'
    },
    'no_google_sheet_connected': {
      title: 'No Google Sheet Connected',
      message: 'You need to connect a Google Sheet before starting a campaign.',
      variant: 'warning',
      action: 'redirect',
      helpText: 'Go to the Google Sheets section to connect your sheet first.'
    },
    'no_phone_numbers_found': {
      title: 'No Contacts Found',
      message: 'No phone numbers were found in the Contact tab of your Google Sheet.',
      variant: 'warning',
      action: 'show_help',
      helpText: 'Make sure your Contact tab has phone numbers in column A (starting from row 2).'
    },

    // Google Sheets API Errors
    'invalid_sheet_id_format': {
      title: 'Invalid Sheet ID',
      message: 'The Google Sheet ID format is invalid. Please check and try again.',
      variant: 'destructive',
      action: 'none',
      helpText: 'Sheet ID should be at least 20 characters long and found in the URL.'
    },
    'access_denied': {
      title: 'Access Denied',
      message: 'Cannot access the Google Sheet. Please check sharing permissions.',
      variant: 'destructive',
      action: 'show_help',
      helpText: 'Share the sheet with: call-automations@call-automation-469200.iam.gserviceaccount.com with Editor access.'
    },
    'already_connected': {
      title: 'Sheet Already Connected',
      message: 'This Google Sheet is already connected to another user account.',
      variant: 'warning',
      action: 'none',
      helpText: 'Please use a different Google Sheet or contact support.'
    },
    'service_unavailable': {
      title: 'Service Unavailable',
      message: 'Google Sheets service is temporarily unavailable.',
      variant: 'warning',
      action: 'retry',
      helpText: 'Please try again in a few minutes or contact support.'
    },

    // General API Errors
    'token_expired': {
      title: 'Session Expired',
      message: 'Your login session has expired. Please log in again.',
      variant: 'destructive',
      action: 'redirect',
      helpText: 'You will be redirected to the login page.'
    },
    'network_error': {
      title: 'Connection Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      variant: 'destructive',
      action: 'retry',
      helpText: 'Ensure you have a stable internet connection and the backend server is running.'
    },
    'server_error': {
      title: 'Server Error',
      message: 'An unexpected error occurred on the server.',
      variant: 'destructive',
      action: 'retry',
      helpText: 'Please try again or contact support if the issue persists.'
    },
    'validation_error': {
      title: 'Validation Error',
      message: 'The provided data is invalid. Please check your input.',
      variant: 'destructive',
      action: 'none',
      helpText: 'Review the form fields and ensure all required information is provided.'
    }
  }

  static handleApiError(response: Response, errorData?: any): ErrorHandlingResult {
    const status = response.status
    let errorType = 'unknown'
    let errorMessage = 'An unexpected error occurred'

    // Try to extract error information from response
    if (errorData) {
      errorType = errorData.error_type || errorData.error || 'unknown'
      errorMessage = errorData.message || errorData.error || errorMessage
    }

    // Handle specific error types
    if (errorType !== 'unknown' && this.ERROR_MESSAGES[errorType]) {
      return this.ERROR_MESSAGES[errorType]
    }

    // Handle HTTP status codes
    switch (status) {
      case 400:
        return {
          title: 'Bad Request',
          message: errorMessage || 'The request contains invalid data.',
          variant: 'destructive',
          action: 'none'
        }

      case 401:
        return {
          title: 'Session Expired',
          message: 'Your login session has expired. Please log in again.',
          variant: 'destructive',
          action: 'redirect',
          helpText: 'You will be redirected to the login page to re-authenticate.'
        }

      case 403:
        return {
          title: 'Access Forbidden',
          message: errorMessage || 'You do not have permission to perform this action.',
          variant: 'destructive',
          action: 'show_help',
          helpText: 'Contact support if you believe this is an error.'
        }

      case 404:
        return {
          title: 'Not Found',
          message: errorMessage || 'The requested resource was not found.',
          variant: 'destructive',
          action: 'none'
        }

      case 409:
        return {
          title: 'Conflict',
          message: errorMessage || 'The request conflicts with the current state.',
          variant: 'warning',
          action: 'none'
        }

      case 422:
        return {
          title: 'Validation Error',
          message: errorMessage || 'The provided data is invalid.',
          variant: 'destructive',
          action: 'none'
        }

      case 429:
        return {
          title: 'Too Many Requests',
          message: 'You have made too many requests. Please wait before trying again.',
          variant: 'warning',
          action: 'retry',
          helpText: 'Wait a few minutes before trying again.'
        }

      case 500:
        return {
          title: 'Server Error',
          message: errorMessage || 'An internal server error occurred.',
          variant: 'destructive',
          action: 'retry',
          helpText: 'Please try again or contact support if the issue persists.'
        }

      case 502:
      case 503:
      case 504:
        return {
          title: 'Service Unavailable',
          message: 'The service is temporarily unavailable. Please try again later.',
          variant: 'warning',
          action: 'retry',
          helpText: 'Please wait a few minutes and try again.'
        }

      default:
        return {
          title: 'Error',
          message: errorMessage || `An error occurred (HTTP ${status})`,
          variant: 'destructive',
          action: 'retry'
        }
    }
  }

  static handleNetworkError(error: Error): ErrorHandlingResult {
    if (error.message.includes('Failed to fetch')) {
      return {
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
        variant: 'destructive',
        action: 'retry',
        helpText: 'Ensure you have a stable internet connection and the backend server is running.'
      }
    }

    if (error.message.includes('NetworkError')) {
      return {
        title: 'Network Error',
        message: 'A network error occurred. Please check your connection.',
        variant: 'destructive',
        action: 'retry',
        helpText: 'Try refreshing the page or check your network settings.'
      }
    }

    return {
      title: 'Unexpected Error',
      message: error.message || 'An unexpected error occurred.',
      variant: 'destructive',
      action: 'retry'
    }
  }

  static getRetryDelay(status: number): number {
    // Return retry delay in milliseconds based on status code
    switch (status) {
      case 429: return 60000 // 1 minute for rate limiting
      case 500: return 5000  // 5 seconds for server errors
      case 502:
      case 503:
      case 504: return 10000 // 10 seconds for service unavailable
      default: return 3000   // 3 seconds default
    }
  }

  static shouldRetry(status: number): boolean {
    // Determine if the request should be retried
    return [408, 429, 500, 502, 503, 504].includes(status)
  }

  static isUserError(status: number): boolean {
    // Determine if the error is due to user input vs server/system
    return [400, 401, 403, 404, 409, 422].includes(status)
  }
}
