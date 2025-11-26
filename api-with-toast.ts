"use client"

import { toast } from "@/hooks/use-toast"
import { apiService, type UserProfile, type ProfileUpdateData } from "./api"

// Cache management
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

// Cache TTL in milliseconds (5 minutes default)
const DEFAULT_CACHE_TTL = 5 * 60 * 1000

interface CacheOptions {
  ttl?: number
  key?: string
}

interface ApiCallOptions extends CacheOptions {
  showToast?: boolean
  toastMessage?: string
  toastType?: 'success' | 'info' | 'warning'
}

class ApiServiceWithToast {
  private getCacheKey(endpoint: string, options?: CacheOptions): string {
    return options?.key || endpoint
  }

  private isCacheValid(cacheKey: string): boolean {
    const cached = cache.get(cacheKey)
    if (!cached) return false
    
    const now = Date.now()
    return (now - cached.timestamp) < cached.ttl
  }

  private getCachedData(cacheKey: string): any | null {
    if (this.isCacheValid(cacheKey)) {
      const cached = cache.get(cacheKey)
      return cached?.data || null
    }
    return null
  }

  private setCachedData(cacheKey: string, data: any, ttl: number = DEFAULT_CACHE_TTL): void {
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  private showToast(message: string, type: 'success' | 'info' | 'warning' = 'info') {
    toast({
      title: type === 'success' ? '✅ Success' : type === 'warning' ? '⚠️ Notice' : 'ℹ️ Info',
      description: message,
      variant: type === 'success' ? 'default' : type === 'warning' ? 'default' : 'default',
      duration: 3000,
    })
  }

  // Profile Management
  async getUserProfile(options?: ApiCallOptions) {
    const cacheKey = this.getCacheKey('userProfile', options)
    
    // Check cache first
    const cached = this.getCachedData(cacheKey)
    if (cached) {
      if (options?.showToast) {
        this.showToast('Profile loaded from cache', 'info')
      }
      return cached
    }

    try {
      if (options?.showToast) {
        this.showToast('Loading your profile...', 'info')
      }
      
      const result = await apiService.getUserProfile()
      
      if (options?.showToast) {
        this.showToast(options.toastMessage || 'Profile updated successfully', 'success')
      }
      
      // Cache the result
      this.setCachedData(cacheKey, result, options?.ttl)
      
      return result
    } catch (error) {
      if (options?.showToast) {
        this.showToast('Failed to load profile. Please try again.', 'warning')
      }
      throw error
    }
  }

  async updateUserProfile(profileData: ProfileUpdateData, options?: ApiCallOptions) {
    try {
      if (options?.showToast) {
        this.showToast('Updating your profile...', 'info')
      }
      
      const result = await apiService.updateUserProfile(profileData)
      
      if (options?.showToast) {
        this.showToast(options.toastMessage || 'Profile updated successfully', 'success')
      }
      
      // Invalidate profile cache
      cache.delete('userProfile')
      
      return result
    } catch (error) {
      if (options?.showToast) {
        this.showToast('Failed to update profile. Please try again.', 'warning')
      }
      throw error
    }
  }

  // Google Sheet Management
  async checkGoogleSheetStatus(options?: ApiCallOptions) {
    const cacheKey = this.getCacheKey('googleSheetStatus', options)
    
    // Check cache first
    const cached = this.getCachedData(cacheKey)
    if (cached) {
      if (options?.showToast) {
        this.showToast('Sheet status loaded from cache', 'info')
      }
      return cached
    }

    try {
      if (options?.showToast) {
        this.showToast('Checking Google Sheet status...', 'info')
      }
      
      const result = await apiService.checkGoogleSheetStatus()
      
      if (options?.showToast) {
        this.showToast('Sheet status updated', 'success')
      }
      
      // Cache the result
      this.setCachedData(cacheKey, result, options?.ttl)
      
      return result
    } catch (error) {
      if (options?.showToast) {
        this.showToast('Failed to check sheet status. Please try again.', 'warning')
      }
      throw error
    }
  }

  async validateGoogleSheet(sheetId: string, options?: ApiCallOptions) {
    try {
      if (options?.showToast) {
        this.showToast('Validating Google Sheet...', 'info')
      }
      
      const result = await apiService.validateGoogleSheet(sheetId)
      
      if (options?.showToast) {
        if (result.valid) {
          this.showToast('Google Sheet validated successfully', 'success')
        } else {
          this.showToast('Google Sheet validation failed', 'warning')
        }
      }
      
      return result
    } catch (error) {
      if (options?.showToast) {
        this.showToast('Failed to validate sheet. Please try again.', 'warning')
      }
      throw error
    }
  }

  async setupUserGoogleSheet(sheetId: string, options?: ApiCallOptions) {
    try {
      if (options?.showToast) {
        this.showToast('Setting up your Google Sheet...', 'info')
      }
      
      const result = await apiService.setupUserGoogleSheet(sheetId)
      
      if (options?.showToast) {
        this.showToast('Google Sheet connected successfully', 'success')
      }
      
      // Invalidate sheet status cache
      cache.delete('googleSheetStatus')
      
      return result
    } catch (error) {
      if (options?.showToast) {
        this.showToast('Failed to connect sheet. Please try again.', 'warning')
      }
      throw error
    }
  }

  async unlinkGoogleSheet(options?: ApiCallOptions) {
    try {
      if (options?.showToast) {
        this.showToast('Unlinking Google Sheet...', 'info')
      }
      
      const result = await apiService.unlinkGoogleSheet()
      
      if (options?.showToast) {
        this.showToast('Google Sheet unlinked successfully', 'success')
      }
      
      // Invalidate sheet status cache
      cache.delete('googleSheetStatus')
      
      return result
    } catch (error) {
      if (options?.showToast) {
        this.showToast('Failed to unlink sheet. Please try again.', 'warning')
      }
      throw error
    }
  }

  // Campaign Management
  async startCampaign(campaignData: any, options?: ApiCallOptions) {
    try {
      if (options?.showToast) {
        this.showToast('Starting campaign...', 'info')
      }
      
      const result = await apiService.startCampaign(campaignData)
      
      if (options?.showToast) {
        this.showToast('Campaign started successfully', 'success')
      }
      
      // Invalidate campaign status cache
      cache.delete('campaignStatus')
      
      return result
    } catch (error) {
      if (options?.showToast) {
        this.showToast('Failed to start campaign. Please try again.', 'warning')
      }
      throw error
    }
  }

  async stopCampaign(campaignId: number, options?: ApiCallOptions) {
    try {
      if (options?.showToast) {
        this.showToast('Stopping campaign...', 'info')
      }
      
      const result = await apiService.stopCampaign(campaignId)
      
      if (options?.showToast) {
        this.showToast('Campaign stopped successfully', 'success')
      }
      
      // Invalidate campaign status cache
      cache.delete('campaignStatus')
      
      return result
    } catch (error) {
      if (options?.showToast) {
        this.showToast('Failed to stop campaign. Please try again.', 'warning')
      }
      throw error
    }
  }

  // Authentication
  async login(credentials: any, options?: ApiCallOptions) {
    try {
      if (options?.showToast) {
        this.showToast('Signing you in...', 'info')
      }
      
      const result = await apiService.login(credentials)
      
      if (options?.showToast) {
        this.showToast('Welcome back!', 'success')
      }
      
      // Clear all caches on login
      cache.clear()
      
      return result
    } catch (error) {
      if (options?.showToast) {
        this.showToast('Login failed. Please check your credentials.', 'warning')
      }
      throw error
    }
  }

  async signup(userData: any, options?: ApiCallOptions) {
    try {
      if (options?.showToast) {
        this.showToast('Creating your account...', 'info')
      }
      
      const result = await apiService.signup(userData)
      
      if (options?.showToast) {
        this.showToast('Account created successfully!', 'success')
      }
      
      // Clear all caches on signup
      cache.clear()
      
      return result
    } catch (error) {
      if (options?.showToast) {
        this.showToast('Signup failed. Please try again.', 'warning')
      }
      throw error
    }
  }

  // Password Reset
  async requestPasswordReset(email: string, options?: ApiCallOptions) {
    try {
      if (options?.showToast) {
        this.showToast('Sending password reset email...', 'info')
      }
      
      const result = await apiService.requestPasswordReset({ email })
      
      if (options?.showToast) {
        this.showToast('Password reset email sent successfully', 'success')
      }
      
      return result
    } catch (error) {
      if (options?.showToast) {
        this.showToast('Failed to send reset email. Please try again.', 'warning')
      }
      throw error
    }
  }

  async confirmPasswordReset(accessToken: string, newPassword: string, options?: ApiCallOptions) {
    try {
      if (options?.showToast) {
        this.showToast('Resetting your password...', 'info')
      }
      
      const result = await apiService.confirmPasswordReset({ access_token: accessToken, new_password: newPassword })
      
      if (options?.showToast) {
        this.showToast('Password reset successfully', 'success')
      }
      
      return result
    } catch (error) {
      if (options?.showToast) {
        this.showToast('Failed to reset password. Please try again.', 'warning')
      }
      throw error
    }
  }

  // Cache Management
  clearCache(pattern?: string) {
    if (pattern) {
      // Clear specific cache entries
      for (const key of cache.keys()) {
        if (key.includes(pattern)) {
          cache.delete(key)
        }
      }
    } else {
      // Clear all cache
      cache.clear()
    }
  }

  getCacheStats() {
    return {
      size: cache.size,
      keys: Array.from(cache.keys()),
      entries: Array.from(cache.entries()).map(([key, value]) => ({
        key,
        age: Date.now() - value.timestamp,
        ttl: value.ttl,
        isValid: this.isCacheValid(key)
      }))
    }
  }
}

export const apiServiceWithToast = new ApiServiceWithToast()
export type { UserProfile, ProfileUpdateData }
