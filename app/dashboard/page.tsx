"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Phone, BarChart3, Play, RefreshCw } from "lucide-react"
import { GoogleSheetStatus } from "@/components/google-sheet-status"
import { StartCampaignButton } from "@/components/start-campaign-button"
import { LiveCampaignMetrics } from "@/components/live-campaign-metrics"
import { ClonedVoicesList } from "@/components/cloned-voices-list"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { apiService, DEFAULT_MAX_CALL_DURATION_SECONDS, DEFAULT_MAX_CALL_DURATION_MINUTES } from "@/lib/api"
import { SingleCallModal } from "@/components/single-call-modal"
import { SubscriptionDetails } from "@/components/subscription-details"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Clock } from "lucide-react"

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isPageRefreshing, setIsPageRefreshing] = useState(false)
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [sheetStatus, setSheetStatus] = useState<any>(null)
  const [isLoadingSheetStatus, setIsLoadingSheetStatus] = useState(true)
  const [hasInboundKnowledgeBase, setHasInboundKnowledgeBase] = useState(false)
  const [hasOutboundKnowledgeBase, setHasOutboundKnowledgeBase] = useState(false)
  const [isLoadingConfig, setIsLoadingConfig] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true)
  const [showSingleCallModal, setShowSingleCallModal] = useState(false)
  const [maxCallDuration, setMaxCallDuration] = useState(DEFAULT_MAX_CALL_DURATION_SECONDS) // Default: 100 minutes (6000 seconds) - stored in seconds
  const [maxCallDurationMinutes, setMaxCallDurationMinutes] = useState(DEFAULT_MAX_CALL_DURATION_MINUTES) // Display value in minutes
  const [isSavingMaxCallDuration, setIsSavingMaxCallDuration] = useState(false)

  // Check if this is the first visit to dashboard after login
  useEffect(() => {
    const dashboardVisited = localStorage.getItem('dashboardVisited')
    if (dashboardVisited) {
      setIsFirstVisit(false)
      setIsLoading(false) // Skip loading for returning users
    } else {
      // Mark as visited for future visits
      localStorage.setItem('dashboardVisited', 'true')
    }
  }, [])

  // Function to load initial dashboard data (Google Sheet status and campaign stats)
  const loadInitialDashboardData = useCallback(async () => {
    if (hasLoadedInitialData) {
      return
    }
    
    try {
      // Load Google Sheet status
      await apiService.checkGoogleSheetStatus({
        showToast: false,
        forceRefresh: false
      })
      
      // Load campaign stats if user is available
      if (user?.id) {
        await apiService.getCampaignStats({
          user_id: user.id,
        }, {
          showToast: false,
          forceRefresh: false
        })
      }
      
      setHasLoadedInitialData(true)
    } catch (error) {
      // Still mark as loaded to prevent infinite retries
      setHasLoadedInitialData(true)
    }
  }, [hasLoadedInitialData, user])

  // Function to refresh dashboard data
  const refreshDashboardData = useCallback(async (forceRefresh: boolean = false) => {
    if (forceRefresh) {
      setIsPageRefreshing(true)
    }
    
    setRefreshKey(prev => prev + 1)
    
    try {
      // Always refresh Google Sheet status
      await apiService.checkGoogleSheetStatus({
        showToast: false,
        forceRefresh: forceRefresh
      })
      
      // Always refresh campaign stats if user is available
      if (user?.id) {
        await apiService.getCampaignStats({
          user_id: user.id,
        }, {
          showToast: false,
          forceRefresh: forceRefresh
        })
      }
    } catch (error) {
      // Error refreshing data
    } finally {
      if (forceRefresh) {
        // Small delay to show refresh state
        setTimeout(() => {
          setIsPageRefreshing(false)
        }, 500)
      }
    }
  }, [user])

  // Listen for navigation events to refresh data
  useEffect(() => {
    const handlePageRefresh = (event: CustomEvent) => {
      const { path, isNewPage, forceRefresh } = event.detail
      
      if (path === '/dashboard') {
        if (isNewPage) {
          // New page navigation - refresh all data
          refreshDashboardData(true)
        } else if (forceRefresh) {
          // Force refresh requested
          refreshDashboardData(true)
        } else {
          // Regular refresh
          refreshDashboardData(false)
        }
      }
    }

    // Listen for page refresh events
    window.addEventListener('pageRefresh', handlePageRefresh as EventListener)
    
    // Listen for page visibility changes (user returning to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated && user) {
        refreshDashboardData(false)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('pageRefresh', handlePageRefresh as EventListener)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refreshDashboardData, isAuthenticated, user])

  // Handle page load and authentication
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }
    
    // Set loading to false once we have authentication status
    if (isAuthenticated !== undefined && user) {
      setIsLoading(false)
    }
  }, [isAuthenticated, user, router, isFirstVisit])

  // Load initial dashboard data once user is available
  useEffect(() => {
    if (user && !hasLoadedInitialData) {
      loadInitialDashboardData()
    }
  }, [user, hasLoadedInitialData, loadInitialDashboardData])

  // Fetch campaign stats after cloned-voices is loaded
  useEffect(() => {
    const fetchCampaignStatsAfterVoices = async () => {
      if (!user?.id) {
        return
      }
      
      // Wait a bit for cloned-voices to load, then fetch campaign stats
      setTimeout(async () => {
        try {
          await apiService.getCampaignStats({
            user_id: user.id,
          }, {
            showToast: false,
            forceRefresh: false
          })
        } catch (error) {
          // Error fetching campaign stats
        }
      }, 1000) // Wait 1 second after cloned-voices call
    }

    if (user?.id) {
      fetchCampaignStatsAfterVoices()
    }
  }, [user])
  
  // Auto-refresh dashboard every 30 seconds
  useEffect(() => {
    if (!user?.id) return
    
    const dashboardInterval = setInterval(() => {
      refreshDashboardData(false)
    }, 30000) // 30 seconds
    
    return () => {
      clearInterval(dashboardInterval)
    }
  }, [user, refreshDashboardData])

  // Load Google Sheet status
  useEffect(() => {
    const loadSheetStatus = async () => {
      if (!user) return
      
      setIsLoadingSheetStatus(true)
      try {
        const status = await apiService.checkGoogleSheetStatus({
          showToast: false,
          forceRefresh: false
        })
        setSheetStatus(status)
      } catch (error) {
        // Error loading sheet status
      } finally {
        setIsLoadingSheetStatus(false)
      }
    }
    
    loadSheetStatus()
  }, [user, refreshKey])

  // Load configuration to check knowledge base
  useEffect(() => {
    const loadConfiguration = async () => {
      if (!user) return
      
      setIsLoadingConfig(true)
      try {
        const config = await apiService.getConfiguration({
          showToast: false,
          forceRefresh: false
        })
        
        // Load max call duration from dedicated API
        try {
          const maxDurationResult = await apiService.getMaxCallDuration({
            showToast: false,
            forceRefresh: false
          })
          
          if (maxDurationResult.success && maxDurationResult.max_call_duration !== null) {
            // API returns value in minutes, so use it directly
            // Store in seconds for internal use (multiply by 60)
            const minutes = maxDurationResult.max_call_duration
            setMaxCallDuration(minutes * 60) // Store in seconds internally
            setMaxCallDurationMinutes(minutes) // Display in minutes
          } else {
            // Set default to 100 minutes if not found
            setMaxCallDuration(DEFAULT_MAX_CALL_DURATION_SECONDS)
            setMaxCallDurationMinutes(DEFAULT_MAX_CALL_DURATION_MINUTES)
          }
        } catch (error) {
          // Set default to 100 minutes on error
          setMaxCallDuration(DEFAULT_MAX_CALL_DURATION_SECONDS)
          setMaxCallDurationMinutes(DEFAULT_MAX_CALL_DURATION_MINUTES)
        }
        
        if (config.success && config.configuration) {
          
          // Check if inbound_call_knowledge_base exists and is not empty
          if (config.configuration.inbound_call_knowledge_base) {
            try {
              const parsed = JSON.parse(config.configuration.inbound_call_knowledge_base)
              // Check if business scenario is set (required field)
              setHasInboundKnowledgeBase(!!parsed.businessScenario?.trim())
            } catch (e) {
              setHasInboundKnowledgeBase(false)
            }
          } else {
            setHasInboundKnowledgeBase(false)
          }

          // Check if outbound_call_knowledge_base exists and is not empty
          if (config.configuration.outbound_call_knowledge_base) {
            try {
              const parsed = JSON.parse(config.configuration.outbound_call_knowledge_base)
              // Check if business scenario is set (required field)
              setHasOutboundKnowledgeBase(!!parsed.businessScenario?.trim())
            } catch (e) {
              setHasOutboundKnowledgeBase(false)
            }
          } else {
            setHasOutboundKnowledgeBase(false)
          }
        } else {
          setHasInboundKnowledgeBase(false)
          setHasOutboundKnowledgeBase(false)
        }
      } catch (error) {
        setHasInboundKnowledgeBase(false)
        setHasOutboundKnowledgeBase(false)
      } finally {
        setIsLoadingConfig(false)
      }
    }
    
    loadConfiguration()
  }, [user, refreshKey])
  
  // Save max call duration
  const handleSaveMaxCallDuration = async () => {
    if (!user?.id) return
    
    // API expects value in minutes, so send directly (no conversion needed)
    const durationInMinutes = maxCallDurationMinutes
    
    setIsSavingMaxCallDuration(true)
    try {
      // First try to update (PUT), if it fails with 404, create (POST)
      let result = await apiService.updateMaxCallDuration({
        max_call_duration: durationInMinutes
      }, {
        showToast: false,
        forceRefresh: true
      })
      
      // If update fails (not found), try to create
      if (!result.success) {
        result = await apiService.createMaxCallDuration({
          max_call_duration: durationInMinutes
        }, {
          showToast: false,
          forceRefresh: true
        })
      }
      
      if (result.success) {
        // Update local state with saved value (store in seconds internally, display in minutes)
        setMaxCallDuration(durationInMinutes * 60)
        toast({
          title: "Success!",
          description: result.message || "Max call duration updated successfully",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update max call duration",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      // If update fails with 404, try to create
      try {
        const createResult = await apiService.createMaxCallDuration({
          max_call_duration: durationInMinutes
        }, {
          showToast: false,
          forceRefresh: true
        })
        
        if (createResult.success) {
          setMaxCallDuration(durationInMinutes * 60)
          toast({
            title: "Success!",
            description: createResult.message || "Max call duration set successfully",
            variant: "default",
          })
        } else {
          toast({
            title: "Error",
            description: createResult.message || "Failed to set max call duration",
            variant: "destructive",
          })
        }
      } catch (createError) {
        toast({
          title: "Error",
          description: "Failed to save max call duration",
          variant: "destructive",
        })
      }
    } finally {
      setIsSavingMaxCallDuration(false)
    }
  }

  // Load subscription to check if plan is active
  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) return
      
      setIsLoadingSubscription(true)
      try {
        const subscriptionResult = await apiService.getSubscription({
          showToast: false,
          forceRefresh: false
        })
        
        if (subscriptionResult.success && subscriptionResult.data) {
          setSubscription(subscriptionResult.data)
        } else {
          setSubscription(null)
        }
      } catch (error) {
        setSubscription(null)
      } finally {
        setIsLoadingSubscription(false)
      }
    }
    
    loadSubscription()
  }, [user, refreshKey])

  // Check if Google Sheet is connected and knowledge base is set
  const hasGoogleSheet = sheetStatus?.has_sheet && sheetStatus?.is_synced
  const isSheetReady = hasGoogleSheet && !isLoadingSheetStatus
  const hasActiveSubscription = subscription?.is_active === true
  const hasKnowledgeBase = hasInboundKnowledgeBase && hasOutboundKnowledgeBase
  const canStartCampaign = isSheetReady && hasKnowledgeBase && !isLoadingConfig && hasActiveSubscription && !isLoadingSubscription

  // Show loading state only for first visit or when actually loading
  const shouldShowLoader = (isFirstVisit && isLoading) || isPageRefreshing

  return (
    <>
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Show loading state only for first visit */}
            {shouldShowLoader ? (
              <LoadingSpinner
                size="lg"
                text={
                  isPageRefreshing 
                    ? "Refreshing dashboard..." 
                    : "Loading your dashboard..."
                }
                subtitle={
                  isPageRefreshing
                    ? 'Updating with latest data...'
                    : 'Preparing your personalized dashboard'
                }
                showProgress={isPageRefreshing}
                progressWidth={isPageRefreshing ? 80 : 60}
                className="py-20"
              />
            ) : (
              <>
                {/* Header */}
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {`Welcome ${user?.name || 'User'}, `}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                    Manage your BadarAI calling automation campaigns, view analytics, and control your platform from one central location.
                  </p>
                </div>

              {/* Subscription Details and Max Call Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Subscription Details */}
                <SubscriptionDetails 
                  subscription={subscription}
                  isLoading={isLoadingSubscription}
                />
                
                {/* Max Call Duration */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">Max Call Duration</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxCallDuration" className="text-sm font-medium">
                        Duration (minutes)
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="maxCallDuration"
                          type="number"
                          placeholder="100"
                          value={maxCallDurationMinutes}
                          onChange={(e) => setMaxCallDurationMinutes(Number(e.target.value))}
                          min="1"
                          max="120"
                          className="max-w-xs"
                        />
                        <Button
                          onClick={handleSaveMaxCallDuration}
                          disabled={isSavingMaxCallDuration}
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          {isSavingMaxCallDuration ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Maximum time AI agent will stay on call (default: 100 minutes). This applies to all campaigns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Max Call Duration Display (Simple field above Google Sheet) */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Max Call Duration:</span>
                    <span className="text-sm text-gray-900 font-semibold">{maxCallDurationMinutes} minutes</span>
                  </div>
                </div>
              </div>

              {/* Google Sheet Status (Moved lower) */}
              {user && (
                <GoogleSheetStatus 
                  key={`sheet-status-${refreshKey}`}
                  onSheetStatusRefresh={async () => {
                    await new Promise<void>((resolve) => {
                      setRefreshKey(prev => prev + 1)
                      resolve()
                    })
                  }}
                />
              )}

              {/* Subscription Expired Alert - Persistent Warning */}
              {!isLoadingSubscription && !hasActiveSubscription && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-400 rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl animate-pulse">
                        ⚠️
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-orange-900 mb-2">
                        Subscription Expired
                      </h3>
                      <p className="text-orange-800">
                        Your subscription plan has expired. You cannot start new campaigns until you renew your subscription. 
                        {subscription && (
                          <span className="block mt-2 text-sm">
                            <strong>Used Minutes:</strong> {subscription.used_minutes} / {subscription.total_minutes}
                          </span>
                        )}
                        <span className="block mt-3 text-sm font-semibold">
                          Please contact support to renew your subscription and continue using the platform.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Your Cloned Voices Section */}
              <div className={`relative ${!isSheetReady ? 'opacity-60' : ''}`}>
                {!isSheetReady && (
                  <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
                      <div className="text-3xl mb-3">🔒</div>
                      <h3 className="font-semibold text-gray-900 mb-2">Connect Google Sheet First</h3>
                      <p className="text-sm text-gray-600">
                        Please connect your Google Sheet above to unlock voice cloning features.
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Phone className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">Your Cloned Voices</h2>
                  </div>
                  <button
                    onClick={() => isSheetReady && router.push('/voice-clone')}
                    disabled={!isSheetReady}
                    className={`text-purple-600 hover:text-purple-700 font-medium hover:underline text-sm ${!isSheetReady ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    View All →
                  </button>
                </div>
                
                <ClonedVoicesList
                  showCreateButton={true}
                  onCreateClick={() => router.push('/voice-clone')}
                  limit={3}
                />
              </div>

              {/* Campaign Management Section */}
              <div className={`relative ${!canStartCampaign ? 'opacity-60' : ''}`}>
                {!canStartCampaign && (
                  <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
                      <div className="text-3xl mb-3">
                        {!isSheetReady || !hasKnowledgeBase ? '🔒' : !hasActiveSubscription ? '⚠️' : '🔒'}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {!isSheetReady 
                          ? 'Connect Google Sheet First' 
                          : !hasKnowledgeBase 
                          ? 'Configure Knowledge Base Required'
                          : !hasActiveSubscription
                          ? 'Subscription Expired'
                          : 'Configuration Required'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {!isSheetReady 
                          ? 'Please connect your Google Sheet above to unlock campaign management features.'
                          : !hasKnowledgeBase
                          ? `Please configure both Inbound and Outbound Knowledge Bases before starting campaigns. ${!hasInboundKnowledgeBase ? 'Inbound knowledge base is missing. ' : ''}${!hasOutboundKnowledgeBase ? 'Outbound knowledge base is missing. ' : ''}Go to Knowledge Base page to set them up.`
                          : !hasActiveSubscription
                          ? 'Your plan has expired. Please renew your subscription to start campaigns.'
                          : 'Please complete all required configurations to start campaigns.'
                        }
                      </p>
                      {isSheetReady && !hasKnowledgeBase && hasActiveSubscription && (
                        <button
                          onClick={() => router.push('/knowledge-base')}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Configure Knowledge Base
                        </button>
                      )}
                      {isSheetReady && hasKnowledgeBase && !hasActiveSubscription && (
                        <p className="mt-4 text-xs text-gray-600">
                          Contact support to renew your subscription.
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Play className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">Campaign Management</h2>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <StartCampaignButton 
                    onCampaignStarted={() => {
                      refreshDashboardData(true)
                    }}
                    disabled={!canStartCampaign}
                  />
                  
                  {/* Single Call Button */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => setShowSingleCallModal(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!hasActiveSubscription}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Initiate Single Call
                    </Button>
                    {!hasActiveSubscription && (
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Active subscription required for single calls
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Campaign Metrics Section */}
              <div className={`relative ${!isSheetReady ? 'opacity-60' : ''}`}>
                {!isSheetReady && (
                  <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
                      <div className="text-3xl mb-3">🔒</div>
                      <h3 className="font-semibold text-gray-900 mb-2">Connect Google Sheet First</h3>
                      <p className="text-sm text-gray-600">
                        Please connect your Google Sheet above to view campaign metrics.
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Live Campaign Metrics</h2>
                </div>

                <LiveCampaignMetrics 
                  key={`metrics-${refreshKey}`}
                  disabled={!isSheetReady}
                  onRefresh={() => refreshDashboardData(true)}
                />
              </div>
            </>
          )}

        </div>
      </div>

      {/* Single Call Modal */}
      {user && (
        <SingleCallModal
          open={showSingleCallModal}
          onOpenChange={setShowSingleCallModal}
          userId={user.id}
        />
      )}
    </>
  )
}
