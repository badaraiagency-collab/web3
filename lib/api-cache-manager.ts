"use client"

import { toast } from "@/hooks/use-toast"

// Cache entry interface
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  isRefreshing?: boolean
}

// API call options
interface ApiCallOptions {
  showToast?: boolean
  toastMessage?: string
  toastType?: 'success' | 'info' | 'warning' | 'error'
  forceRefresh?: boolean
  cacheKey?: string
  ttl?: number
}

// Toast notification types
type ToastType = 'success' | 'info' | 'warning' | 'error'

class ApiCacheManager {
  private cache = new Map<string, CacheEntry<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes
  private pendingRequests = new Map<string, Promise<any>>()

  /**
   * Get a unique cache key for an endpoint
   */
  private getCacheKey(endpoint: string, options?: { cacheKey?: string }): string {
    return options?.cacheKey || endpoint
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey)
    if (!cached) return false
    
    const now = Date.now()
    return (now - cached.timestamp) < cached.ttl
  }

  /**
   * Get cached data if valid
   */
  private getCachedData<T>(cacheKey: string): T | null {
    if (this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      return cached?.data || null
    }
    return null
  }

  /**
   * Set data in cache
   */
  private setCachedData<T>(cacheKey: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * Mark cache entry as refreshing to prevent duplicate requests
   */
  private setRefreshing(cacheKey: string, isRefreshing: boolean): void {
    const cached = this.cache.get(cacheKey)
    if (cached) {
      cached.isRefreshing = isRefreshing
    }
  }

  /**
   * Show toast notification
   */
  private showToast(message: string, type: ToastType = 'info', duration: number = 3000) {
    const icons = {
      success: '✅',
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌'
    }

    const titles = {
      success: 'Success',
      info: 'Info',
      warning: 'Notice',
      error: 'Error'
    }

    toast({
      title: `${icons[type]} ${titles[type]}`,
      description: message,
      variant: type === 'success' ? 'default' : type === 'error' ? 'destructive' : 'default',
      duration,
    })
  }

  /**
   * Execute an API call with caching and toast notifications
   */
  async executeWithCache<T>(
    endpoint: string,
    apiCall: () => Promise<T>,
    options: ApiCallOptions = {}
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, options)
    const ttl = options.ttl || this.defaultTTL

    // Check if there's a pending request for this endpoint
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`[Cache] Waiting for pending request: ${cacheKey}`)
      return this.pendingRequests.get(cacheKey)!
    }

    // Check cache first (unless force refresh is requested)
    if (!options.forceRefresh) {
      const cached = this.getCachedData<T>(cacheKey)
      if (cached) {
        if (options.showToast) {
          this.showToast('Data loaded from cache', 'info', 2000)
        }
        console.log(`[Cache] Using cached data: ${cacheKey}`)
        return cached
      }
    }

    // Check if cache entry is currently refreshing
    const cached = this.cache.get(cacheKey)
    if (cached?.isRefreshing) {
      console.log(`[Cache] Data is already refreshing: ${cacheKey}`)
      // Wait a bit and check cache again
      await new Promise(resolve => setTimeout(resolve, 100))
      const refreshed = this.getCachedData<T>(cacheKey)
      if (refreshed) {
        return refreshed
      }
    }

    // Show loading toast if requested
    if (options.showToast) {
      this.showToast('Loading data...', 'info', 2000)
    }

    // Mark as refreshing and create pending request
    this.setRefreshing(cacheKey, true)
    const requestPromise = this.executeApiCall(cacheKey, apiCall, options, ttl)
    this.pendingRequests.set(cacheKey, requestPromise)

    try {
      const result = await requestPromise
      return result
    } finally {
      this.pendingRequests.delete(cacheKey)
      this.setRefreshing(cacheKey, false)
    }
  }

  /**
   * Execute the actual API call
   */
  private async executeApiCall<T>(
    cacheKey: string,
    apiCall: () => Promise<T>,
    options: ApiCallOptions,
    ttl: number
  ): Promise<T> {
    try {
      console.log(`[Cache] Making API call: ${cacheKey}`)
      const result = await apiCall()
      
      // Cache the successful result
      this.setCachedData(cacheKey, result, ttl)
      
      // Show success toast if requested
      if (options.showToast) {
        this.showToast(
          options.toastMessage || 'Data loaded successfully',
          'success',
          3000
        )
      }
      
      console.log(`[Cache] API call successful: ${cacheKey}`)
      return result
      
    } catch (error: any) {
      console.error(`[Cache] API call failed: ${cacheKey}`, error)
      
      // Determine error message
      let errorMessage = 'Failed to load data. Please try again.'
      let errorTitle = 'Error'
      
      // Check for network errors (fetch failures)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to server. Please ensure:\n• Backend server is running at https://badarai.site\n• Internet connection is stable\n• No firewall is blocking the connection'
        errorTitle = 'Connection Failed'
      }
      // Check error status code if available
      else if (error.status) {
        switch (error.status) {
          case 400:
            errorMessage = error.message || 'Invalid request. Please check your input and try again.'
            errorTitle = 'Invalid Request'
            break
          case 401:
            errorMessage = 'Session expired. Please login again.'
            errorTitle = 'Authentication Required'
            break
          case 403:
            errorMessage = 'Access denied. You don\'t have permission for this action.'
            errorTitle = 'Access Denied'
            break
          case 404:
            errorMessage = error.message || 'Resource not found. The endpoint may not exist.'
            errorTitle = 'Not Found'
            break
          case 409:
            errorMessage = error.message || 'Conflict. The resource already exists.'
            errorTitle = 'Conflict'
            break
          case 422:
            errorMessage = error.message || 'Validation failed. Please check your input.'
            errorTitle = 'Validation Error'
            break
          case 429:
            errorMessage = 'Too many requests. Please wait a moment and try again.'
            errorTitle = 'Rate Limited'
            break
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = error.message || 'Server error occurred. Please try again later or contact support if the issue persists.'
            errorTitle = 'Server Error'
            break
          default:
            errorMessage = error.message || errorMessage
            break
        }
      }
      // Fallback to checking error message string
      else if (error instanceof Error) {
        if (error.message.includes('NetworkError')) {
          errorMessage = 'Network error. Please check your connection and try again.'
          errorTitle = 'Network Error'
        } else if (error.message.includes('Unauthorized')) {
          errorMessage = 'Session expired. Please login again.'
          errorTitle = 'Authentication Required'
        } else if (error.message.includes('Forbidden')) {
          errorMessage = 'Access denied. You don\'t have permission for this action.'
          errorTitle = 'Access Denied'
        } else {
          errorMessage = error.message || errorMessage
        }
      }
      
      // Show error toast if requested
      if (options.showToast) {
        this.showToast(
          `${errorTitle}: ${errorMessage}`,
          'error',
          6000
        )
      }
      
      throw error
    }
  }

  /**
   * Invalidate cache for a specific endpoint
   */
  invalidateCache(endpoint: string, options?: { cacheKey?: string }): void {
    const cacheKey = this.getCacheKey(endpoint, options)
    this.cache.delete(cacheKey)
    console.log(`[Cache] Invalidated: ${cacheKey}`)
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear()
    this.pendingRequests.clear()
    console.log('[Cache] All cache cleared')
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }

  /**
   * Preload data into cache
   */
  preloadData<T>(endpoint: string, data: T, ttl: number = this.defaultTTL): void {
    const cacheKey = this.getCacheKey(endpoint)
    this.setCachedData(cacheKey, data, ttl)
    console.log(`[Cache] Preloaded: ${cacheKey}`)
  }
}

// Create singleton instance
export const apiCacheManager = new ApiCacheManager()

// Export types for use in other files
export type { ApiCallOptions, ToastType }
