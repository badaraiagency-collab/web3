"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Phone, BarChart3, Loader2, RefreshCw, CheckCircle, XCircle, Clock, PhoneCall, Square } from "lucide-react"
import { apiService } from "@/lib/api"
import type { CampaignStats } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

interface CampaignMetrics {
  total_calls: number
  answered_calls: number
  not_answered_calls: number
  success_rate: number
  status: string
  phone_number: string
  room_name: string
  remaining_calls: number
  current_call: number
}

interface LiveCampaignMetricsProps {
  disabled?: boolean
  onRefresh?: () => void
}

export function LiveCampaignMetrics({ disabled = false, onRefresh }: LiveCampaignMetricsProps) {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null)
  const [campaignsList, setCampaignsList] = useState<Array<CampaignStats>>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stoppingCampaignId, setStoppingCampaignId] = useState<string | number | null>(null)
  const { toast } = useToast()
  const isInitialized = useRef(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const componentId = useRef(`metrics-${Date.now()}-${Math.random()}`)

  // Use useCallback to prevent unnecessary re-renders and duplicate API calls
  const fetchLiveMetrics = useCallback(async (isRefresh = false) => {
    // Check if user is available
    if (!user?.id) {
      setMetrics({
        total_calls: 0,
        answered_calls: 0,
        not_answered_calls: 0,
        success_rate: 0,
        status: '',
        phone_number: '',
        room_name: '',
        remaining_calls: 0,
        current_call: 0
      })
      isInitialized.current = true
      setLoading(false)
      return
    }
    
    // Only prevent duplicate calls during initialization if it's not a manual refresh
    // Manual refresh should always call the API
    if (!isRefresh && isInitialized.current) {
      return
    }
    
    try {
      // Only set loading state if it's a manual refresh or first load
      if (isRefresh || !isInitialized.current) {
        setLoading(true)
      }
      
      // Invalidate cache before calling if it's a manual refresh
      if (isRefresh) {
        const { apiCacheManager } = await import('@/lib/api-cache-manager')
        apiCacheManager.invalidateCache(`campaignStats_${user.id}`)
      }
      
      // Use the new getCampaignStats endpoint - only needs user_id
      // Always force refresh to get latest data
      const result = await apiService.getCampaignStats({
        user_id: user.id,
      }, {
        showToast: isRefresh, // Only show toast on manual refresh
        forceRefresh: true // Always force refresh to get latest data
      })
      
      if (result.status === "success" || result.status === "Success") {
        // Store all campaigns
        if (result.campaign_stats && result.campaign_stats.length > 0) {
          setCampaignsList(result.campaign_stats)
          
          // Use the first campaign for main metrics display
          const stats = result.campaign_stats[0]
          const campaignMetrics: CampaignMetrics = {
            total_calls: stats.target_calls ?? 0,
            answered_calls: 0, // Not available in stats
            not_answered_calls: Math.max(0, (stats.target_calls ?? 0) - (stats.current_call ?? 0)),
            success_rate: (stats.target_calls ?? 0) > 0 
              ? (((stats.current_call ?? 0) / (stats.target_calls ?? 0)) * 100) 
              : 0,
            status: stats.status ?? '',
            phone_number: stats.phone_number ?? '',
            room_name: stats.room_name ?? '',
            remaining_calls: stats.remaining_calls ?? 0,
            current_call: stats.current_call ?? 0
          }
          setMetrics(campaignMetrics)
          isInitialized.current = true
        } else {
          // No campaigns in response, but still set empty state
          setCampaignsList([])
          setMetrics({
            total_calls: 0,
            answered_calls: 0,
            not_answered_calls: 0,
            success_rate: 0,
            status: '',
            phone_number: '',
            room_name: '',
            remaining_calls: 0,
            current_call: 0
          })
          isInitialized.current = true
        }
      } else {
        // API returned error, but still set empty state so component renders
        setCampaignsList([])
        setMetrics({
          total_calls: 0,
          answered_calls: 0,
          not_answered_calls: 0,
          success_rate: 0,
          status: '',
          phone_number: '',
          room_name: '',
          remaining_calls: 0,
          current_call: 0
        })
        isInitialized.current = true
        if (isRefresh) {
          toast({
            title: "Refresh Failed",
            description: result.message || "Failed to refresh live metrics",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      if (isRefresh) {
        toast({
          title: "Refresh Failed",
          description: "Failed to refresh live metrics",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }, [toast, user])

  useEffect(() => {
    // Don't fetch if disabled (sheet not connected)
    if (disabled) {
      setLoading(false)
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }
    
    // Check if user is available before fetching
    if (!user?.id) {
      setMetrics({
        total_calls: 0,
        answered_calls: 0,
        not_answered_calls: 0,
        success_rate: 0,
        status: '',
        phone_number: '',
        room_name: '',
        remaining_calls: 0,
        current_call: 0
      })
      setLoading(false)
      isInitialized.current = true
      return
    }
    
    // Fetch on mount or when enabled - always call API if user is available
    // Reset initialization flag to ensure API is called
    isInitialized.current = false
    fetchLiveMetrics(false)
    
    // Set up auto-refresh every 30 seconds for live updates
    // Always call the API on interval if user is available
    intervalRef.current = setInterval(() => {
      if (user?.id) {
        // Reset initialization flag temporarily to allow API call
        isInitialized.current = false
        fetchLiveMetrics(false)
      }
    }, 30000)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [fetchLiveMetrics, disabled, user])

  // Listen for campaign data changes in localStorage and API cache updates
  useEffect(() => {
    if (disabled || !user?.id) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentCampaign') {
        // Reset initialization flag to allow fetching
        isInitialized.current = false
        // Fetch new campaign data
        fetchLiveMetrics(false)
      }
    }

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange)

    // Also listen for custom events (from same tab)
    const handleCampaignUpdate = () => {
      isInitialized.current = false
      fetchLiveMetrics(false)
    }

    window.addEventListener('campaignUpdated', handleCampaignUpdate)

    // Listen for API cache updates - refresh when campaign stats are updated
    const handleCacheUpdate = (e: CustomEvent) => {
      const cacheKey = e.detail?.cacheKey
      if (cacheKey && cacheKey.includes('campaignStats')) {
        // Reset initialization flag to allow fetching
        isInitialized.current = false
        // Fetch updated campaign data
        fetchLiveMetrics(false)
      }
    }

    window.addEventListener('apiCacheUpdated', handleCacheUpdate as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('campaignUpdated', handleCampaignUpdate)
      window.removeEventListener('apiCacheUpdated', handleCacheUpdate as EventListener)
    }
  }, [disabled, user, fetchLiveMetrics])

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      // Reset initialization flag to ensure API is called
      isInitialized.current = false
      
      // Invalidate cache before calling to ensure fresh data
      if (user?.id) {
        const { apiCacheManager } = await import('@/lib/api-cache-manager')
        apiCacheManager.invalidateCache(`campaignStats_${user.id}`)
      }
      
      // Force refresh - this will bypass cache and always call the API
      await fetchLiveMetrics(true)
      
      // Call parent refresh callback to refresh whole dashboard
      onRefresh?.()
    } catch (error) {
      // Manual refresh failed
    } finally {
      setRefreshing(false)
    }
  }

  if (loading && !metrics) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Loading live metrics...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaign Data</h3>
          <p className="text-gray-600 mb-4">Start a campaign to see live metrics here.</p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 mx-auto text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {refreshing ? 'Refreshing...' : 'Refresh Metrics'}
          </button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'running':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'in-active':
      case 'inactive':
      case 'stopped':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const isActiveCampaign = (status: string) => {
    const activeStatuses = ['active', 'running', 'pending']
    const statusLower = status?.toLowerCase() || ''
    // Explicitly exclude 'in-active' status
    if (statusLower === 'in-active' || statusLower === 'inactive' || statusLower === 'stopped' || statusLower === 'completed' || statusLower === 'failed') {
      return false
    }
    return activeStatuses.includes(statusLower)
  }

  const handleStopCampaign = async (campaignId: string | number, campaignName: string) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User ID not found. Please log in again.",
        variant: "destructive",
      })
      return
    }
    
    setStoppingCampaignId(campaignId)
    
    try {
      const result = await apiService.stopCampaign(campaignId, user.id, campaignName, {
        showToast: true,
        forceRefresh: true
      })
      
      if (result.success) {
        toast({
          title: "Campaign Stopped",
          description: result.message || `Campaign "${campaignName}" has been stopped.`,
          variant: "default",
        })
        
        // Refresh the metrics to update the list
        isInitialized.current = false
        await fetchLiveMetrics(true)
        
        // Call parent refresh callback
        onRefresh?.()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to stop campaign",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to stop campaign",
        variant: "destructive",
      })
    } finally {
      setStoppingCampaignId(null)
    }
  }

  // Separate campaigns into active and inactive
  const activeCampaigns = campaignsList.filter(campaign => isActiveCampaign(campaign.status))
  const inactiveCampaigns = campaignsList.filter(campaign => !isActiveCampaign(campaign.status))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Campaign Status */}
      {metrics.status && (
        <div className="mb-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(metrics.status)}`}>
            <span className="capitalize">{metrics.status}</span>
          </div>
        </div>
      )}

      {/* Success Rate */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Progress</h4>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-gray-900">{metrics.current_call} / {metrics.total_calls}</span>
          <span className="text-sm text-gray-600">{metrics.success_rate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(metrics.success_rate, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Key Metrics Grid - Responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Phone className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-blue-600">{metrics.total_calls}</div>
          <div className="text-xs md:text-sm text-gray-600">Target Calls</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-green-600">{metrics.current_call}</div>
          <div className="text-xs md:text-sm text-gray-600">Calls Made</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-orange-600">{metrics.remaining_calls}</div>
          <div className="text-xs md:text-sm text-gray-600">Remaining</div>
        </div>
      </div>

      {/* Additional Info */}
      {(metrics.phone_number || metrics.room_name) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          {metrics.phone_number && (
            <div className="text-xs text-gray-600 mb-1">
              <span className="font-medium">Phone:</span> {metrics.phone_number}
            </div>
          )}
          {metrics.room_name && (
            <div className="text-xs text-gray-600">
              <span className="font-medium">Room:</span> {metrics.room_name}
            </div>
          )}
        </div>
      )}

      {/* Active Campaigns Section */}
      {activeCampaigns.length > 0 && (
        <div className="mb-4 border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Active Campaigns</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activeCampaigns.map((campaign, index) => (
              <div
                key={`${campaign.campaign_id}-${campaign.updated_at}-${index}`}
                className={`p-3 rounded-lg border ${getStatusColor(campaign.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{campaign.campaign_name}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-600">
                      {campaign.current_call} / {campaign.target_calls}
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStopCampaign(campaign.campaign_id, campaign.campaign_name)}
                      disabled={stoppingCampaignId === campaign.campaign_id}
                      className="h-6 px-2 text-xs"
                    >
                      {stoppingCampaignId === campaign.campaign_id ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Stopping...
                        </>
                      ) : (
                        <>
                          <Square className="h-3 w-3 mr-1" />
                          Stop
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Target:</span> {campaign.target_calls}
                  </div>
                  <div>
                    <span className="text-gray-600">Made:</span> {campaign.current_call}
                  </div>
                  <div>
                    <span className="text-gray-600">Remaining:</span> {campaign.remaining_calls}
                  </div>
                </div>
                {campaign.target_calls > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((campaign.current_call / campaign.target_calls) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Campaigns Section */}
      {inactiveCampaigns.length > 0 && (
        <div className="mb-4 border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Inactive Campaigns</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {inactiveCampaigns.map((campaign, index) => (
              <div
                key={`${campaign.campaign_id}-${campaign.updated_at}-${index}`}
                className={`p-3 rounded-lg border ${getStatusColor(campaign.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{campaign.campaign_name}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {campaign.current_call} / {campaign.target_calls}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Target:</span> {campaign.target_calls}
                  </div>
                  <div>
                    <span className="text-gray-600">Made:</span> {campaign.current_call}
                  </div>
                  <div>
                    <span className="text-gray-600">Remaining:</span> {campaign.remaining_calls}
                  </div>
                </div>
                {campaign.target_calls > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-gray-400 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((campaign.current_call / campaign.target_calls) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auto-refresh info */}
      <div className="text-center border-t pt-4">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>Auto-refreshing every 30 seconds</span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 disabled:opacity-50 ml-2"
          >
            {refreshing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            {refreshing ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
      </div>
    </div>
  )
}