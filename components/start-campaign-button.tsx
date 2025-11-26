"use client"

import { useState, useEffect } from "react"
import { Phone, Loader2, Play, AlertTriangle, Square, RotateCcw, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiService, type SubscriptionData, DEFAULT_MAX_CALL_DURATION_SECONDS } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EnhancedErrorToast } from "@/components/ui/enhanced-error-toast"

interface StartCampaignButtonProps {
  onCampaignStarted?: () => void
  disabled?: boolean
}

export function StartCampaignButton({ onCampaignStarted, disabled = false }: StartCampaignButtonProps) {
  const { user } = useAuth()
  const [isStarting, setIsStarting] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [campaignName, setCampaignName] = useState("")
  const [targetCalls, setTargetCalls] = useState(10)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false)
  const [isLoadingConfig, setIsLoadingConfig] = useState(false)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [configuration, setConfiguration] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [activeCampaign, setActiveCampaign] = useState<any>(null)
  const { toast } = useToast()

  // Check for active campaigns on mount and when user changes
  useEffect(() => {
    checkActiveCampaigns()
  }, [user])

  // Load subscription and configuration when dialog opens
  useEffect(() => {
    const loadData = async () => {
      if (!showDialog) return
      
      setIsLoadingSubscription(true)
      setIsLoadingConfig(true)
      
      try {
        // Load subscription
        const subscriptionResult = await apiService.getSubscription({
          showToast: false,
          forceRefresh: false
        })
        
        if (subscriptionResult.success && subscriptionResult.data) {
          setSubscription(subscriptionResult.data)
        } else {
          setSubscription(null)
        }

        // Load configuration
        const configResult = await apiService.getConfiguration({
          showToast: false,
          forceRefresh: false
        })
        
        if (configResult.success && configResult.configuration) {
          setConfiguration(configResult.configuration)
        } else {
          setConfiguration(null)
        }
      } catch (error) {
        setSubscription(null)
        setConfiguration(null)
      } finally {
        setIsLoadingSubscription(false)
        setIsLoadingConfig(false)
      }
    }

    loadData()
  }, [showDialog])

  const isActiveCampaign = (status: string) => {
    const activeStatuses = ['active', 'running', 'pending']
    const statusLower = status?.toLowerCase() || ''
    // Explicitly exclude 'in-active' status
    if (statusLower === 'in-active' || statusLower === 'inactive' || statusLower === 'stopped' || statusLower === 'completed' || statusLower === 'failed') {
      return false
    }
    return activeStatuses.includes(statusLower)
  }

  const checkActiveCampaigns = async () => {
    try {
      if (!user?.id) {
        setActiveCampaign(null)
        return
      }
      
      // Use the new getCampaignStats endpoint
      const result = await apiService.getCampaignStats({
        user_id: user.id,
      })
      
      if (result.status === "success" || result.status === "Success") {
        if (result.campaign_stats && result.campaign_stats.length > 0) {
          // Find the first active campaign
          const activeCampaignStats = result.campaign_stats.find((stats: any) => isActiveCampaign(stats.status))
          
          if (activeCampaignStats) {
            // Update active campaign with stats
            setActiveCampaign({
              id: activeCampaignStats.campaign_id,
              name: activeCampaignStats.campaign_name,
              status: activeCampaignStats.status,
              total_contacts: activeCampaignStats.target_calls,
              calls_made: activeCampaignStats.current_call,
              remaining_calls: activeCampaignStats.remaining_calls,
              started_at: activeCampaignStats.created_at,
              progress_percentage: activeCampaignStats.target_calls > 0 
                ? ((activeCampaignStats.target_calls - activeCampaignStats.remaining_calls) / activeCampaignStats.target_calls) * 100 
                : 0
            })
          } else {
            // No active campaigns found, clear active campaign
            setActiveCampaign(null)
            localStorage.removeItem('currentCampaign')
          }
        } else {
          // No stats found, clear active campaign
          setActiveCampaign(null)
          localStorage.removeItem('currentCampaign')
        }
      } else {
        // API error, clear active campaign
        setActiveCampaign(null)
        localStorage.removeItem('currentCampaign')
      }
    } catch (error) {
      // Failed to check active campaigns, clear active campaign
      setActiveCampaign(null)
      localStorage.removeItem('currentCampaign')
    }
  }

  const handleStartCampaign = async () => {
    try {
      setIsStarting(true)
      setError(null)
      
      // Validate required data
      if (!user?.id) {
        toast({
          title: "Error",
          description: "User ID not found. Please log in again.",
          variant: "destructive",
        })
        setIsStarting(false)
        return
      }

      if (!configuration?.sheet_id) {
        toast({
          title: "Error",
          description: "Google Sheet not configured. Please connect a Google Sheet first.",
          variant: "destructive",
        })
        setIsStarting(false)
        return
      }

      if (!configuration?.phone_number) {
        toast({
          title: "Error",
          description: "Phone number not configured. Please configure your phone number first.",
          variant: "destructive",
        })
        setIsStarting(false)
        return
      }

      // Generate campaign_id (UUID v4)
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0
          const v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      }

      const campaignId = generateUUID()

      // Extract sip_call_from from phone_number (remove country code, first 2 digits)
      const phoneNumber = configuration.phone_number
      const sipCallFrom = phoneNumber.length > 2 ? phoneNumber.substring(2) : phoneNumber

      // Get max_call_duration from dedicated API (global setting)
      // API returns value in minutes, convert to seconds for payload
      let maxCallDuration = DEFAULT_MAX_CALL_DURATION_SECONDS // Default: 100 minutes (6000 seconds)
      try {
        const maxDurationResult = await apiService.getMaxCallDuration({
          showToast: false,
          forceRefresh: false
        })
        if (maxDurationResult.success && maxDurationResult.max_call_duration !== null) {
          // API returns minutes, convert to seconds for payload
          maxCallDuration = maxDurationResult.max_call_duration * 60
        }
      } catch (error) {
        // Use default if API call fails
      }
      
      const startCampaignData = {
        user_id: user.id,
        campaign_id: campaignId,
        campaign_name: campaignName.trim(),
        target_calls: targetCalls,
        remaining_calls: targetCalls,
        sheet_id: configuration.sheet_id,
        sheet_row: 2,
        sip_call_from: sipCallFrom,
        max_call_duration: maxCallDuration, // Maximum call duration in seconds (from global configuration)
      }
      
      const result = await apiService.startCampaign(startCampaignData)

      if (result.status === "success" || result.status === "Success") {
        toast({
          title: "Campaign Started!",
          description: result.message,
          variant: "default",
        })
        
        // Don't save to localStorage - rely on API for campaign status
        // Set the active campaign from API response
        // Re-check active campaigns to get accurate status from API
        await checkActiveCampaigns()
        
        // Dispatch event to notify other components about campaign update
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('campaignUpdated'))
        }
        
        // Check campaign stats after starting
        setTimeout(() => {
          checkActiveCampaigns()
        }, 1000)
        
        resetDialog()
        onCampaignStarted?.()
      } else {
        // If error is about row already processed, allow clearing previous campaign
        const errorMessage = result.message || "Failed to start campaign. Please try again."
        setError({
          title: "Error",
          message: errorMessage,
          variant: "destructive",
          action: errorMessage.includes("already processed") || errorMessage.includes("Row") ? "clear" : "retry"
        })
        setIsStarting(false)
      }
    } catch (error: any) {
      const errorResult = apiService.getErrorResult(error)
      setError(errorResult)
      
      toast({
        title: errorResult.title,
        description: errorResult.message,
        variant: errorResult.variant === 'warning' ? 'default' : errorResult.variant,
      })
    } finally {
      setIsStarting(false)
    }
  }

  const handleStopCampaign = async () => {
    if (!activeCampaign || !user?.id) return
    
    try {
      setIsStopping(true)
      const result = await apiService.stopCampaign(activeCampaign.id, user.id, activeCampaign.name)
      
      if (result.success) {
        toast({
          title: "Campaign Stopped",
          description: result.message,
          variant: "default",
        })
        
        // Clear campaign data from localStorage
        try {
          localStorage.removeItem('currentCampaign')
        } catch (storageError) {
          // Failed to clear campaign from localStorage
        }
        
        setActiveCampaign(null)
        
        // Re-check for active campaigns to update the UI
        await checkActiveCampaigns()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to stop campaign",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      const errorResult = apiService.getErrorResult(error)
      toast({
        title: errorResult.title,
        description: errorResult.message,
        variant: errorResult.variant === 'warning' ? 'default' : errorResult.variant,
      })
    } finally {
      setIsStopping(false)
    }
  }

  const handleRetry = async () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1)
      setTimeout(() => {
        handleStartCampaign()
      }, Math.pow(2, retryCount) * 1000) // Exponential backoff
    }
  }

  const handleDismissError = () => {
    setError(null)
    setRetryCount(0)
  }

  const handleShowHelp = () => {
    toast({
      title: "Help Information",
      description: error?.helpText || "Please contact support for assistance.",
      variant: "default",
    })
  }

  const resetDialog = () => {
    setShowDialog(false)
    setCampaignName("")
    setTargetCalls(10)
    setError(null)
    setRetryCount(0)
  }

  const handleReset = () => {
    setCampaignName("")
    setTargetCalls(10)
    setError(null)
    setRetryCount(0)
  }

  const handleClear = () => {
    setCampaignName("")
    setTargetCalls(10)
    setError(null)
    setRetryCount(0)
  }

  const clearPreviousCampaign = async () => {
    try {
      // Clear localStorage campaign data
      localStorage.removeItem('currentCampaign')
      
      // Clear active campaign state
      setActiveCampaign(null)
      
      // Clear error
      setError(null)
      setRetryCount(0)
      
      // Re-check active campaigns
      await checkActiveCampaigns()
      
      toast({
        title: "Previous Campaign Cleared",
        description: "You can now start a new campaign.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear previous campaign data.",
        variant: "destructive",
      })
    }
  }

  // If there's an active campaign, show stop button
  if (activeCampaign) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Active Campaign:</span> {activeCampaign.name}
          <br />
          <span className="text-xs">
            Progress: {activeCampaign.calls_made}/{activeCampaign.total_contacts} calls
          </span>
        </div>
        <Button
          onClick={handleStopCampaign}
          disabled={isStopping || disabled}
          variant="destructive"
          size="sm"
        >
          {isStopping ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Square className="h-4 w-4 mr-2" />
          )}
          Stop Campaign
        </Button>
      </div>
    )
  }

  // Show start campaign dialog
  return (
    <div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <button
            disabled={disabled}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="h-4 w-4" />
            Start Campaign
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Start New Campaign</DialogTitle>
            <DialogDescription>
              Enter the campaign details to begin calling.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="campaignName">
                Campaign Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="campaignName"
                placeholder="e.g., Summer Campaign 2024"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Enter a name for this campaign
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="targetCalls">
                Target Calls
              </Label>
              <Input
                id="targetCalls"
                type="number"
                placeholder="10"
                value={targetCalls}
                onChange={(e) => setTargetCalls(Number(e.target.value))}
                min="1"
              />
              <p className="text-xs text-gray-500">
                Number of calls to make (default: 10)
              </p>
            </div>

            {isLoadingConfig && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                Loading configuration...
              </div>
            )}

            {configuration && (
              <div className="space-y-2 text-xs text-gray-600 bg-blue-50 p-3 rounded">
                <p><strong>Sheet ID:</strong> {configuration.sheet_id || "Not configured"}</p>
                <p><strong>Phone Number:</strong> {configuration.phone_number || "Not configured"}</p>
                {(!configuration.sheet_id || !configuration.phone_number) && (
                  <p className="text-red-600">Please configure both Google Sheet and Phone Number before starting a campaign.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Error handling */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>{error.message}</span>
                  {(error.message?.includes("already processed") || error.message?.includes("Row")) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearPreviousCampaign}
                      className="ml-2"
                    >
                      Clear & Retry
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isStarting}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={isStarting}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetDialog}
                disabled={isStarting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartCampaign}
                disabled={
                  isStarting || 
                  !campaignName.trim() || 
                  !targetCalls || 
                  targetCalls < 1 ||
                  isLoadingConfig ||
                  !configuration?.sheet_id ||
                  !configuration?.phone_number ||
                  !user?.id
                }
              >
                {isStarting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Campaign
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
