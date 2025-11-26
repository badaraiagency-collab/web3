import { ApiErrorHandler, ErrorHandlingResult } from './api-error-handler'
import { apiCacheManager, type ApiCallOptions } from './api-cache-manager'

// Constants
export const DEFAULT_MAX_CALL_DURATION_SECONDS = 6000 // 100 minutes in seconds
export const DEFAULT_MAX_CALL_DURATION_MINUTES = 100 // 100 minutes

// Authentication Interfaces
export interface AuthResponse {
  status: 'success' | 'failed';
  message: string;
  data?: {
    user_id: string;
    email: string;
    access_token: string;
    refresh_token: string;
    expires_at: string;
  };
}

export interface UserInfo {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  is_authenticated: boolean
  is_anonymous: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  full_name: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  access_token: string
  new_password: string
}

// Profile Management
export interface UserProfile {
  id: number
  supabase_user_id: string
  email: string
  full_name: string | null
  phone_number: string | null
  company: string | null
  job_title: string | null
  bio: string | null
  website: string | null
  location: string | null
  timezone: string | null
  language: string
  is_public: boolean
  google_sheet_id: string | null
  google_sheet_synced_at: string | null
  created_at: string
  updated_at: string
}

export interface ProfileUpdateData {
  full_name?: string;
  phone_number?: string;
  company?: string;
  job_title?: string;
  bio?: string;
  website?: string;
  location?: string;
  timezone?: string;
  language?: string;
  is_public?: boolean;
}

// Google Sheet Validation Response
export interface SheetValidationResponse {
  valid: boolean;
  message: string;
  sheet_id?: string;
  already_synced?: boolean;
  status?: 'ready' | 'needs_restructure' | 'needs_sheets' | 'needs_setup' | 'error';
  error?: string;
  error_type?: 'invalid_format' | 'access_denied' | 'already_connected' | 'service_unavailable' | 'validation_error';
  service_account_email?: string;
  structure_info?: {
    ready: boolean;
    status: string;
    message: string;
    existing_sheets?: string[];
    missing_sheets?: string[];
    structure_issues?: string[];
    column_validation?: {
      [sheetName: string]: {
        valid?: boolean;
        missing_columns?: string[];
        extra_columns?: string[];
        current_headers?: string[];
      };
    };
  };
}

// Google Sheet Status Response
export interface SheetStatusResponse {
  has_sheet: boolean;
  is_synced: boolean;
  sheet_id?: string;
  synced_at?: string;
  last_sync?: string;
  status: 'ready' | 'needs_setup' | 'error';
  error?: string;
}

// Campaign Interfaces
export interface Campaign {
  id: number;
  name: string;
  status: string;
  total_contacts: number;
  calls_made: number;
  calls_answered: number;
  calls_not_answered: number;
  started_at: string;
  progress_percentage: number;
}

export interface CampaignMetrics {
  total_calls: number;
  answered_calls: number;
  not_answered_calls: number;
  success_rate: number;
}

export interface CampaignStats {
  user_id: string;
  campaign_id: string;
  campaign_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  target_calls: number;
  remaining_calls: number;
  current_call: number;
  phone_number: string;
  room_name: string;
}

export interface CampaignStatsRequest {
  user_id: string;
}

export interface CampaignStatsResponse {
  status: string;
  message: string;
  campaign_stats: CampaignStats[];
}

// Legacy interface for backward compatibility
export interface CampaignStatusResponse {
  success: boolean;
  data?: {
    active_campaigns: Campaign[];
    metrics: CampaignMetrics;
  };
  error?: string;
}

export interface CompletedCampaign {
  id: number;
  name: string;
  status: string;
  total_contacts: number;
  calls_made: number;
  calls_answered: number;
  calls_not_answered: number;
  started_at: string;
  completed_at: string;
  success_rate: number;
  duration_hours: number;
}

export interface FailedCampaign {
  id: number;
  name: string;
  status: string;
  total_contacts: number;
  calls_made: number;
  calls_answered: number;
  calls_not_answered: number;
  started_at: string;
  created_at: string;
  failure_rate: number;
  duration_hours: number;
}

export interface CampaignHistoryResponse {
  success: boolean;
  data?: {
    completed_campaigns: CompletedCampaign[];
    failed_campaigns: FailedCampaign[];
    summary: {
      total_completed: number;
      total_failed: number;
      avg_completion_time: number;
      avg_failure_rate: number;
    };
  };
  error?: string;
}

export interface StartCampaignRequest {
  user_id: string;
  campaign_id: string;
  campaign_name: string;
  target_calls: number;
  remaining_calls: number;
  sheet_id: string;
  sheet_row?: number;
  sip_call_from: string;
  max_call_duration?: number; // Maximum call duration in seconds
}

export interface StartCampaignResponse {
  status: string;
  message: string;
  row_count: number;
  row_to_process: number;
  data: any[];
  remaining_calls: number;
}

export interface StopCampaignRequest {
  campaign_id: string | number;
  user_id: string;
  campaign_name: string;
}

export interface StopCampaignResponse {
  success: boolean;
  message: string;
  campaign_id: number;
}

// Single Call Interfaces
export interface SingleCallRequest {
  user_id: string;
  phone_number: string;
  sip_call_from: string;
  name?: string;
  company_name?: string;
  country_code?: string;
}

export interface SingleCallResponse {
  status: 'success' | 'error';
  message: string;
  room_name: string | null;
  participant_id: string | null;
}

// Configuration Interfaces
export interface ConfigurationData {
  user_id: string;
  inbound_call_knowledge_base: string | null;
  outbound_call_knowledge_base: string | null;
  sheet_id: string | null;
  sheet_synced_at: string | null;
  elevenlabs_api_key: string | null;
  voice_id: string | null;
  voice_speed: number;
  phone_number: string | null;
  max_call_duration: number | null; // Maximum call duration in seconds (global setting)
  created_at: string;
  updated_at: string;
}

export interface Configuration {
  success: boolean;
  message: string;
  configuration?: ConfigurationData;
  error?: string | null;
}

export interface ConfigurationRequest {
  inbound_call_knowledge_base?: string;
  outbound_call_knowledge_base?: string;
  elevenlabs_api_key?: string;
  voice_id?: string;
  voice_speed?: number;
  max_call_duration?: number; // Maximum call duration in seconds (global setting)
}

// Max Call Duration Interfaces
export interface MaxCallDurationResponse {
  success: boolean;
  message: string;
  max_call_duration: number | null;
  error?: string;
}

export interface MaxCallDurationRequest {
  max_call_duration: number;
}

// Subscription Interfaces
export interface SubscriptionData {
  id: number;
  user_id: string;
  total_minutes: number;
  used_minutes: number;
  remaining_minutes: number;
  is_active: boolean;
  voice_clones: number;
  remaining_voice_clones: number;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionResponse {
  success: boolean;
  data?: SubscriptionData;
  message: string;
  error?: string;
}

// Phone Number Interfaces
export interface PhoneNumber {
  id: number;
  user_id: string;
  phone_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PhoneNumberResponse {
  success: boolean;
  phone_numbers: PhoneNumber[];
}

export interface PhoneNumberRequest {
  phone_number: string;
}

// Cloned Voice Interfaces
export interface ClonedVoice {
  id: number;
  user_id: string;
  voice_name: string;
  voice_id: string;
  language: string;
  accent: string;
  age: string;
  gender: string;
  use_case: string;
  created_at: string;
  updated_at: string;
}

export interface ClonedVoiceResponse {
  success: boolean;
  message: string;
  data: ClonedVoice[] | ClonedVoice | null;
  error: string | null;
}

export interface CreateClonedVoiceRequest {
  voice_name: string;
  voice_id: string;
  language: string;
  accent: string;
  age: string;
  gender: string;
  use_case: string;
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = 'https://badarai.site/api'
  }

  private getAccessToken(): string {
    if (typeof window !== 'undefined') {
      // Try to get token from Supabase auth
      const supabaseToken = localStorage.getItem('supabase.auth.token')
      if (supabaseToken) {
        try {
          const parsed = JSON.parse(supabaseToken)
          // Supabase stores tokens in currentSession.access_token
          if (parsed.currentSession?.access_token) {
            return parsed.currentSession.access_token
          }
          // Fallback to direct token if structure is different
          if (parsed.access_token) {
            return parsed.access_token
          }
        } catch (e) {
          // Failed to parse Supabase token
        }
      }
      
      // Fallback to legacy token storage
      return localStorage.getItem('accessToken') || ''
    }
    return ''
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    const accessToken = this.getAccessToken()
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    return headers
  }

  private handleTokenExpiration(): void {
    // Clear expired token and user data
    localStorage.removeItem('supabase.auth.token')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    localStorage.removeItem('userProfile')
    localStorage.removeItem('googleSheetStatus')
    
    // Redirect to base URL instead of login page
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  private isTokenExpiredError(errorMessage: string): boolean {
    return errorMessage.includes('Invalid or expired token') || 
           errorMessage.includes('Authentication failed') ||
           errorMessage.includes('token') ||
           errorMessage.includes('401') ||
           errorMessage.includes('Unauthorized')
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
      return response.json()
    }

    // Handle 401 Unauthorized - token expired
    if (response.status === 401) {
      this.handleTokenExpiration()
      throw new Error('Token expired. Please log in again.')
    }

    // Try to parse error response
    let errorData: any = null
    try {
      errorData = await response.json()
    } catch {
      // If we can't parse JSON, create a basic error object
      errorData = { error: response.statusText || 'Unknown error' }
    }

    // Use the new error handler
    const errorResult = ApiErrorHandler.handleApiError(response, errorData)
    
    // Create a custom error with the handled result
    const error = new Error(errorResult.message)
    ;(error as any).errorResult = errorResult
    ;(error as any).status = response.status
    ;(error as any).errorData = errorData
    
    throw error
  }

  // Authentication Methods
  async login(credentials: LoginRequest, options?: ApiCallOptions): Promise<AuthResponse> {
    return apiCacheManager.executeWithCache(
      'login',
      async () => {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(credentials),
        })
        return this.handleResponse<AuthResponse>(response)
      },
      { ...options, showToast: true, toastMessage: 'Signing you in...', ttl: 0 } // Don't cache login
    )
  }

  async signup(userData: SignupRequest, options?: ApiCallOptions): Promise<AuthResponse> {
    return apiCacheManager.executeWithCache(
      'signup',
      async () => {
        const response = await fetch(`${this.baseUrl}/auth/signup`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(userData),
        })
        return this.handleResponse<AuthResponse>(response)
      },
      { ...options, showToast: true, toastMessage: 'Creating your account...', ttl: 0 } // Don't cache signup
    )
  }

  async logout(options?: ApiCallOptions): Promise<void> {
    return apiCacheManager.executeWithCache(
      'logout',
      async () => {
        const response = await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: this.getHeaders(),
        })
        return this.handleResponse<void>(response)
      },
      { ...options, showToast: true, toastMessage: 'Signing you out...', ttl: 0 } // Don't cache logout
    )
  }

  async requestPasswordReset(data: PasswordResetRequest, options?: ApiCallOptions): Promise<void> {
    return apiCacheManager.executeWithCache(
      'passwordReset',
      async () => {
        const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        })
        return this.handleResponse<void>(response)
      },
      { ...options, showToast: true, toastMessage: 'Sending reset email...', ttl: 0 } // Don't cache password reset
    )
  }

  async confirmPasswordReset(data: PasswordResetConfirmRequest, options?: ApiCallOptions): Promise<void> {
    return apiCacheManager.executeWithCache(
      'passwordResetConfirm',
      async () => {
        const response = await fetch(`${this.baseUrl}/auth/reset/confirm`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        })
        return this.handleResponse<void>(response)
      },
      { ...options, showToast: true, toastMessage: 'Updating your password...', ttl: 0 } // Don't cache password reset confirm
    )
  }

  // Profile Management Methods
  async getUserProfile(options?: ApiCallOptions): Promise<UserProfile> {
    return apiCacheManager.executeWithCache(
      'userProfile',
      async () => {
        const response = await fetch(`${this.baseUrl}/auth/profile`, {
          method: 'GET',
          headers: this.getHeaders(),
        })
        return this.handleResponse<UserProfile>(response)
      },
      { ...options, showToast: true, toastMessage: 'Loading your profile...', ttl: 10 * 60 * 1000 } // Cache for 10 minutes
    )
  }

  async createOrUpdateUserProfile(data: ProfileUpdateData, options?: ApiCallOptions): Promise<void> {
    const result = await apiCacheManager.executeWithCache(
      'updateUserProfile',
      async () => {
        const response = await fetch(`${this.baseUrl}/auth/profile`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        })
        return this.handleResponse<void>(response)
      },
      { ...options, showToast: true, toastMessage: 'Updating your profile...', ttl: 0 } // Don't cache updates
    )
    
    // Invalidate profile cache after update
    apiCacheManager.invalidateCache('userProfile')
    
    return result
  }

  async updateUserProfile(data: ProfileUpdateData, options?: ApiCallOptions): Promise<void> {
    const result = await apiCacheManager.executeWithCache(
      'updateUserProfile',
      async () => {
        const response = await fetch(`${this.baseUrl}/auth/profile`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        })
        return this.handleResponse<void>(response)
      },
      { ...options, showToast: true, toastMessage: 'Updating your profile...', ttl: 0 } // Don't cache updates
    )
    
    // Invalidate profile cache after update
    apiCacheManager.invalidateCache('userProfile')
    
    return result
  }

  async checkProfileExists(options?: ApiCallOptions): Promise<{ exists: boolean }> {
    return apiCacheManager.executeWithCache(
      'profileExists',
      async () => {
        const response = await fetch(`${this.baseUrl}/auth/profile/exists`, {
          method: 'GET',
          headers: this.getHeaders(),
        })
        return this.handleResponse<{ exists: boolean }>(response)
      },
      { ...options, showToast: false, ttl: 5 * 60 * 1000 } // Cache for 5 minutes
    )
  }

  // Google Sheet Methods
  async validateGoogleSheet(sheetId: string, options?: ApiCallOptions): Promise<SheetValidationResponse> {
    return apiCacheManager.executeWithCache(
      `validateSheet_${sheetId}`,
      async () => {
        const response = await fetch(`${this.baseUrl}/google-sheets/validate`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ sheet_id: sheetId }),
        })
        return this.handleResponse<SheetValidationResponse>(response)
      },
      { ...options, showToast: true, toastMessage: 'Validating Google Sheet...', ttl: 2 * 60 * 1000 } // Cache for 2 minutes
    )
  }

  async setupUserGoogleSheet(sheetId: string, options?: ApiCallOptions): Promise<any> {
    const result = await apiCacheManager.executeWithCache(
      'setupUserGoogleSheet',
      async () => {
        const response = await fetch(`${this.baseUrl}/google-sheets/setup`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ sheet_id: sheetId }),
        })
        return this.handleResponse<any>(response)
      },
      { ...options, showToast: true, toastMessage: 'Setting up your Google Sheet...', ttl: 0 } // Don't cache setup
    )
    
    // Invalidate related caches after setup
    apiCacheManager.invalidateCache('userProfile')
    apiCacheManager.invalidateCache('googleSheetStatus')
    
    return result
  }

  async checkGoogleSheetStatus(options?: ApiCallOptions): Promise<SheetStatusResponse> {
    return apiCacheManager.executeWithCache(
      'googleSheetStatus',
      async () => {
        const response = await fetch(`${this.baseUrl}/google-sheets/status`, {
          method: 'GET',
          headers: this.getHeaders(),
        })
        return this.handleResponse<SheetStatusResponse>(response)
      },
      { ...options, showToast: true, toastMessage: 'Checking sheet status...', ttl: 5 * 60 * 1000 } // Cache for 5 minutes
    )
  }

  async unlinkGoogleSheet(options?: ApiCallOptions): Promise<any> {
    const result = await apiCacheManager.executeWithCache(
      'unlinkGoogleSheet',
      async () => {
        const response = await fetch(`${this.baseUrl}/google-sheets/unlink`, {
          method: 'POST',
          headers: this.getHeaders(),
        })
        return this.handleResponse<any>(response)
      },
      { ...options, showToast: true, toastMessage: 'Unlinking your Google Sheet...', ttl: 0 } // Don't cache unlink
    )
    
    // Invalidate related caches after unlinking
    apiCacheManager.invalidateCache('userProfile')
    apiCacheManager.invalidateCache('googleSheetStatus')
    
    return result
  }

  // Campaign Methods
  async getCampaignStats(data: CampaignStatsRequest, options?: ApiCallOptions): Promise<CampaignStatsResponse> {
    return apiCacheManager.executeWithCache(
      `campaignStats_${data.user_id}`,
      async () => {
        const response = await fetch(`https://campaign-368713156644.europe-west1.run.app/get-campaign-stats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        return this.handleResponse<CampaignStatsResponse>(response)
      },
      { ...options, showToast: false, ttl: 5 * 1000 } // Cache for 5 seconds (live data)
    )
  }


  async getCampaignHistory(skip: number = 0, limit: number = 50, options?: ApiCallOptions): Promise<CampaignHistoryResponse> {
    return apiCacheManager.executeWithCache(
      'campaignHistory',
      async () => {
        const response = await fetch(`${this.baseUrl}/campaigns/history?skip=${skip}&limit=${limit}`, {
          method: 'GET',
          headers: this.getHeaders(),
        })
        return this.handleResponse<CampaignHistoryResponse>(response)
      },
      { ...options, showToast: true, toastMessage: 'Loading campaign history...', ttl: 5 * 60 * 1000 } // Cache for 5 minutes
    )
  }

  async startCampaign(data: StartCampaignRequest, options?: ApiCallOptions): Promise<StartCampaignResponse> {
    const result = await apiCacheManager.executeWithCache(
      'startCampaign',
      async () => {
        const response = await fetch(`https://campaign-368713156644.europe-west1.run.app/start-campaign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        return this.handleResponse<StartCampaignResponse>(response)
      },
      { ...options, showToast: true, toastMessage: 'Starting your campaign...', ttl: 0 } // Don't cache campaign start
    )
    
    // Invalidate campaign status cache after starting
    apiCacheManager.invalidateCache('campaignStatus')
    
    return result
  }

  async stopCampaign(campaignId: string | number, userId: string, campaignName: string, options?: ApiCallOptions): Promise<StopCampaignResponse> {
    const result = await apiCacheManager.executeWithCache(
      'stopCampaign',
      async () => {
        const response = await fetch(`https://campaign-368713156644.europe-west1.run.app/stop-campaign`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ 
            campaign_id: campaignId,
            user_id: userId,
            campaign_name: campaignName
          }),
        })
        return this.handleResponse<StopCampaignResponse>(response)
      },
      { ...options, showToast: true, toastMessage: 'Stopping your campaign...', ttl: 0 } // Don't cache campaign stop
    )
    
    // Invalidate campaign status cache after stopping
    apiCacheManager.invalidateCache('campaignStatus')
    
    return result
  }

  async singleCall(data: SingleCallRequest, options?: ApiCallOptions): Promise<SingleCallResponse> {
    return apiCacheManager.executeWithCache(
      'singleCall',
      async () => {
        try {
          // Don't send Authorization header for single call to avoid CORS preflight issues
          const response = await fetch(`https://campaign-368713156644.europe-west1.run.app/single-call`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          return this.handleResponse<SingleCallResponse>(response)
        } catch (error: any) {
          // Handle network/CORS errors
          if (error instanceof TypeError && error.message === 'Failed to fetch') {
            const corsError = new Error('Network error: Unable to connect to the server. This may be due to CORS configuration on the server. Please check server CORS settings for the /single-call endpoint.')
            ;(corsError as any).errorResult = {
              message: 'Network error: Unable to connect to the server. This may be due to CORS configuration on the server.',
              status: 0,
              type: 'CORS_ERROR'
            }
            throw corsError
          }
          throw error
        }
      },
      { ...options, showToast: true, toastMessage: 'Initiating call...', ttl: 0 } // Don't cache single call
    )
  }

  // Subscription Methods
  async getSubscription(options?: ApiCallOptions): Promise<SubscriptionResponse> {
    return apiCacheManager.executeWithCache(
      'subscription',
      async () => {
        const response = await fetch(`${this.baseUrl}/subscriptions`, {
          method: 'GET',
          headers: this.getHeaders(),
        })
        return this.handleResponse<SubscriptionResponse>(response)
      },
      { ...options, showToast: false, ttl: 5 * 60 * 1000 } // Cache for 5 minutes
    )
  }

  // Configuration Methods
  async getConfiguration(options?: ApiCallOptions): Promise<Configuration> {
    return apiCacheManager.executeWithCache(
      'configuration',
      async () => {
        const response = await fetch(`${this.baseUrl}/configuration/`, {
          method: 'GET',
          headers: this.getHeaders(),
        })
        return this.handleResponse<Configuration>(response)
      },
      { ...options, showToast: false, ttl: 10 * 60 * 1000 } // Cache for 10 minutes
    )
  }

  async createConfiguration(data: ConfigurationRequest, options?: ApiCallOptions): Promise<Configuration> {
    const result = await apiCacheManager.executeWithCache(
      'createConfiguration',
      async () => {
        const response = await fetch(`${this.baseUrl}/configuration/`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        })
        return this.handleResponse<Configuration>(response)
      },
      { ...options, showToast: true, toastMessage: 'Saving configuration...', ttl: 0 } // Don't cache configuration create
    )
    
    // Invalidate configuration cache after creation
    apiCacheManager.invalidateCache('configuration')
    
    return result
  }

  async updateConfiguration(data: ConfigurationRequest, options?: ApiCallOptions): Promise<Configuration> {
    const result = await apiCacheManager.executeWithCache(
      'updateConfiguration',
      async () => {
        const response = await fetch(`${this.baseUrl}/configuration/`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        })
        return this.handleResponse<Configuration>(response)
      },
      { ...options, showToast: true, toastMessage: 'Updating configuration...', ttl: 0 } // Don't cache configuration update
    )
    
    // Invalidate configuration cache after update
    apiCacheManager.invalidateCache('configuration')
    
    return result
  }

  async deleteConfiguration(options?: ApiCallOptions): Promise<Configuration> {
    const result = await apiCacheManager.executeWithCache(
      'deleteConfiguration',
      async () => {
        const response = await fetch(`${this.baseUrl}/configuration/`, {
          method: 'DELETE',
          headers: this.getHeaders(),
        })
        return this.handleResponse<Configuration>(response)
      },
      { ...options, showToast: true, toastMessage: 'Deleting configuration...', ttl: 0 } // Don't cache configuration delete
    )
    
    // Invalidate configuration cache after delete
    apiCacheManager.invalidateCache('configuration')
    
    return result
  }

  // Max Call Duration Methods
  async getMaxCallDuration(options?: ApiCallOptions): Promise<MaxCallDurationResponse> {
    return apiCacheManager.executeWithCache(
      'maxCallDuration',
      async () => {
        const response = await fetch(`${this.baseUrl}/configuration/max-call-duration`, {
          method: 'GET',
          headers: this.getHeaders(),
        })
        return this.handleResponse<MaxCallDurationResponse>(response)
      },
      { ...options, showToast: false, ttl: 5 * 60 * 1000 } // Cache for 5 minutes
    )
  }

  async createMaxCallDuration(data: MaxCallDurationRequest, options?: ApiCallOptions): Promise<MaxCallDurationResponse> {
    const result = await apiCacheManager.executeWithCache(
      'createMaxCallDuration',
      async () => {
        const response = await fetch(`${this.baseUrl}/configuration/max-call-duration`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        })
        return this.handleResponse<MaxCallDurationResponse>(response)
      },
      { ...options, showToast: true, toastMessage: 'Setting max call duration...', ttl: 0 } // Don't cache max call duration create
    )
    
    // Invalidate max call duration cache after create
    apiCacheManager.invalidateCache('maxCallDuration')
    
    return result
  }

  async updateMaxCallDuration(data: MaxCallDurationRequest, options?: ApiCallOptions): Promise<MaxCallDurationResponse> {
    const result = await apiCacheManager.executeWithCache(
      'updateMaxCallDuration',
      async () => {
        const response = await fetch(`${this.baseUrl}/configuration/max-call-duration`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        })
        return this.handleResponse<MaxCallDurationResponse>(response)
      },
      { ...options, showToast: true, toastMessage: 'Updating max call duration...', ttl: 0 } // Don't cache max call duration update
    )
    
    // Invalidate max call duration cache after update
    apiCacheManager.invalidateCache('maxCallDuration')
    
    return result
  }

  // Phone Number Methods
  async getPhoneNumbers(options?: ApiCallOptions): Promise<PhoneNumberResponse> {
    return apiCacheManager.executeWithCache(
      'phoneNumbers',
      async () => {
        const response = await fetch(`${this.baseUrl}/phone-numbers`, {
          method: 'GET',
          headers: this.getHeaders(),
        })
        return this.handleResponse<PhoneNumberResponse>(response)
      },
      { ...options, showToast: false, ttl: 10 * 60 * 1000 } // Cache for 10 minutes
    )
  }

  async registerPhoneNumber(phoneNumber: string, options?: ApiCallOptions): Promise<any> {
    const result = await apiCacheManager.executeWithCache(
      'registerPhoneNumber',
      async () => {
        const response = await fetch(`${this.baseUrl}/phone-numbers`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ phone_number: phoneNumber }),
        })
        return this.handleResponse<any>(response)
      },
      { ...options, showToast: true, toastMessage: 'Registering phone number...', ttl: 0 } // Don't cache phone number registration
    )
    
    // Invalidate phone numbers cache after registration
    apiCacheManager.invalidateCache('phoneNumbers')
    
    return result
  }

  async activatePhoneNumber(phoneNumber: string, options?: ApiCallOptions): Promise<any> {
    const result = await apiCacheManager.executeWithCache(
      'activatePhoneNumber',
      async () => {
        const response = await fetch(`${this.baseUrl}/phone-numbers/${encodeURIComponent(phoneNumber)}/activate`, {
          method: 'PUT',
          headers: this.getHeaders(),
        })
        return this.handleResponse<any>(response)
      },
      { ...options, showToast: true, toastMessage: 'Activating phone number...', ttl: 0 } // Don't cache phone number activation
    )
    
    // Invalidate phone numbers cache after activation
    apiCacheManager.invalidateCache('phoneNumbers')
    
    return result
  }

  async deactivatePhoneNumber(phoneNumber: string, options?: ApiCallOptions): Promise<any> {
    const result = await apiCacheManager.executeWithCache(
      'deactivatePhoneNumber',
      async () => {
        const response = await fetch(`${this.baseUrl}/phone-numbers/${encodeURIComponent(phoneNumber)}/deactivate`, {
          method: 'PUT',
          headers: this.getHeaders(),
        })
        return this.handleResponse<any>(response)
      },
      { ...options, showToast: true, toastMessage: 'Deactivating phone number...', ttl: 0 } // Don't cache phone number deactivation
    )
    
    // Invalidate phone numbers cache after deactivation
    apiCacheManager.invalidateCache('phoneNumbers')
    
    return result
  }

  async deletePhoneNumber(phoneNumber: string, options?: ApiCallOptions): Promise<any> {
    const result = await apiCacheManager.executeWithCache(
      'deletePhoneNumber',
      async () => {
        const response = await fetch(`${this.baseUrl}/phone-numbers/${encodeURIComponent(phoneNumber)}`, {
          method: 'DELETE',
          headers: this.getHeaders(),
        })
        return this.handleResponse<any>(response)
      },
      { ...options, showToast: true, toastMessage: 'Deleting phone number...', ttl: 0 } // Don't cache phone number deletion
    )
    
    // Invalidate phone numbers cache after deletion
    apiCacheManager.invalidateCache('phoneNumbers')
    
    return result
  }

  // Cloned Voice Methods
  async getClonedVoices(options?: ApiCallOptions): Promise<ClonedVoiceResponse> {
    return apiCacheManager.executeWithCache(
      'clonedVoices',
      async () => {
        const response = await fetch(`${this.baseUrl}/cloned-voices/`, {
          method: 'GET',
          headers: this.getHeaders(),
        })
        return this.handleResponse<ClonedVoiceResponse>(response)
      },
      { ...options, showToast: false, ttl: 5 * 60 * 1000 } // Cache for 5 minutes
    )
  }

  async createClonedVoice(data: CreateClonedVoiceRequest, options?: ApiCallOptions): Promise<ClonedVoiceResponse> {
    const result = await apiCacheManager.executeWithCache(
      'createClonedVoice',
      async () => {
        const response = await fetch(`${this.baseUrl}/cloned-voices/`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        })
        return this.handleResponse<ClonedVoiceResponse>(response)
      },
      { ...options, showToast: true, toastMessage: 'Creating cloned voice...', ttl: 0 } // Don't cache voice creation
    )
    
    // Invalidate cloned voices cache after creation
    apiCacheManager.invalidateCache('clonedVoices')
    
    return result
  }

  async deleteClonedVoice(voiceId: number, options?: ApiCallOptions): Promise<ClonedVoiceResponse> {
    const result = await apiCacheManager.executeWithCache(
      'deleteClonedVoice',
      async () => {
        const response = await fetch(`${this.baseUrl}/cloned-voices/${voiceId}`, {
          method: 'DELETE',
          headers: this.getHeaders(),
        })
        return this.handleResponse<ClonedVoiceResponse>(response)
      },
      { ...options, showToast: true, toastMessage: 'Deleting cloned voice...', ttl: 0 } // Don't cache voice deletion
    )
    
    // Invalidate cloned voices cache after deletion
    apiCacheManager.invalidateCache('clonedVoices')
    
    return result
  }

  // Voice Clone Upload Methods (IVC & PVC)
  async uploadVoiceClone(formData: FormData, options?: ApiCallOptions): Promise<any> {
    try {
      const result = await apiCacheManager.executeWithCache(
        'uploadVoiceClone',
        async () => {
          const headers: HeadersInit = {}
          const accessToken = this.getAccessToken()
          if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`
          }
          // Don't set Content-Type for FormData - browser will set it with boundary

          const response = await fetch(`${this.baseUrl}/cloned-voices/upload`, {
            method: 'POST',
            headers: headers,
            body: formData,
          })
          return this.handleResponse<any>(response)
        },
        { ...options, ttl: 0 }
      )
      
      // Invalidate cloned voices cache after upload
      apiCacheManager.invalidateCache('clonedVoices')
      apiCacheManager.invalidateCache('subscription')
      
      return result
    } catch (error: any) {
      throw error
    }
  }

  async getPvcCaptcha(voiceId: string, options?: ApiCallOptions): Promise<any> {
    try {
      return await apiCacheManager.executeWithCache(
        `pvcCaptcha_${voiceId}`,
        async () => {
          const response = await fetch(`${this.baseUrl}/cloned-voices/pvc/captcha/${voiceId}`, {
            method: 'GET',
            headers: this.getHeaders(),
          })
          return this.handleResponse<any>(response)
        },
        { ...options, ttl: 0 }
      )
    } catch (error: any) {
      throw error
    }
  }

  async verifyPvc(formData: FormData, options?: ApiCallOptions): Promise<any> {
    try {
      const result = await apiCacheManager.executeWithCache(
        'verifyPvc',
        async () => {
          const headers: HeadersInit = {}
          const accessToken = this.getAccessToken()
          if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`
          }
          // Don't set Content-Type for FormData - browser will set it with boundary

          const response = await fetch(`${this.baseUrl}/cloned-voices/pvc/verify`, {
            method: 'POST',
            headers: headers,
            body: formData,
          })
          return this.handleResponse<any>(response)
        },
        { ...options, ttl: 0 }
      )
      
      // Invalidate cloned voices cache after verification
      apiCacheManager.invalidateCache('clonedVoices')
      
      return result
    } catch (error: any) {
      throw error
    }
  }

  // Text-to-Speech for cloned voices
  async textToSpeech(voiceId: string, text: string, options?: ApiCallOptions): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/cloned-voices/text-to-speech`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          voice_id: voiceId,
          text: text,
          output_format: "mp3_44100_128"
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Text-to-speech failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      // Return the audio blob
      const blob = await response.blob()
      return blob
    } catch (error: any) {
      throw error
    }
  }

  // Utility Methods
  getErrorResult(error: any): ErrorHandlingResult {
    if (error?.errorResult) {
      return error.errorResult
    }
    
    // Fallback error handling
    return {
      title: 'Error',
      message: error?.message || 'An unexpected error occurred',
      variant: 'destructive',
      action: 'retry'
    }
  }
}

export const apiService = new ApiService()
