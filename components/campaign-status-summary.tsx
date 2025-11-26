"use client"

import { useState, useEffect } from "react"
import { Play, Pause, CheckCircle, XCircle, Clock, Loader2, RefreshCw } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface CampaignStatusSummaryProps {
  userProfile: any
}

interface CampaignData {
  id: number
  name: string
  status: string
  total_contacts: number
  calls_made: number
  calls_answered: number
  calls_failed: number
  started_at: string
  progress_percentage: number
}

export function CampaignStatusSummary({ userProfile }: CampaignStatusSummaryProps) {
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  // Load campaign data from localStorage on mount
  useEffect(() => {
    loadCampaignFromStorage()
    fetchCampaignStatus()
    
    // Cleanup function to clear localStorage when component unmounts
    return () => {
      // Don't clear localStorage on unmount - keep it for persistence
      // Only clear when campaign is actually stopped
    }
  }, [])

  // Function to clear campaign data (called when campaign is stopped)
  const clearCampaignData = () => {
    setCampaignData(null)
    saveCampaignToStorage(null)
  }

  // Expose clear function to parent components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).clearCampaignData = clearCampaignData
    }
  }, [])

  const loadCampaignFromStorage = () => {
    try {
      const stored = localStorage.getItem('currentCampaign')
      if (stored) {
        const campaign = JSON.parse(stored)
        setCampaignData(campaign)
        setLoading(false)
      }
    } catch (error) {
      // Error loading campaign from localStorage
    }
  }

  const saveCampaignToStorage = (campaign: CampaignData | null) => {
    try {
      if (campaign) {
        localStorage.setItem('currentCampaign', JSON.stringify(campaign))
      } else {
        localStorage.removeItem('currentCampaign')
      }
    } catch (error) {
      // Error saving campaign to localStorage
    }
  }

  const fetchCampaignStatus = async () => {
    try {
      setLoading(true)
      
      // Get campaign from localStorage
      const storedCampaign = localStorage.getItem('currentCampaign')
      if (!storedCampaign || !userProfile?.user_id) {
        setCampaignData(null)
        saveCampaignToStorage(null)
        setLoading(false)
        return
      }
      
      const campaign = JSON.parse(storedCampaign)
      if (!campaign.id || !campaign.name) {
        setCampaignData(null)
        saveCampaignToStorage(null)
        setLoading(false)
        return
      }
      
      // Use the new getCampaignStats endpoint
      const result = await apiService.getCampaignStats({
        user_id: userProfile.user_id,
      })
      
      if (result.status === "success" || result.status === "Success") {
        if (result.campaign_stats && result.campaign_stats.length > 0) {
          const stats = result.campaign_stats[0]
          // Convert stats to CampaignData format
          const campaignData: CampaignData = {
            id: parseInt(stats.campaign_id) || campaign.id,
            name: stats.campaign_name,
            status: stats.status,
            total_contacts: stats.target_calls,
            calls_made: stats.current_call,
            calls_answered: 0, // Not available in stats
            calls_failed: 0, // Not available in stats
            started_at: stats.created_at,
            progress_percentage: stats.target_calls > 0 
              ? ((stats.target_calls - stats.remaining_calls) / stats.target_calls) * 100 
              : 0
          }
          setCampaignData(campaignData)
          saveCampaignToStorage(campaignData)
        } else {
          // No stats found
          setCampaignData(null)
          saveCampaignToStorage(null)
        }
      } else {
        // Error response
        setCampaignData(null)
        saveCampaignToStorage(null)
      }
    } catch (error) {
      setCampaignData(null)
      saveCampaignToStorage(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await fetchCampaignStatus()
      toast({
        title: "Status Updated",
        description: "Campaign status has been refreshed",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh campaign status",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="h-5 w-5 text-green-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'stopped':
        return <Pause className="h-5 w-5 text-gray-600" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Loading campaign status...</span>
        </div>
      </div>
    )
  }

  if (!campaignData) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center mb-4">
          <Play className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Campaign</h3>
        <p className="text-gray-600 mb-4">Start a campaign to see live status updates here.</p>
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
          {refreshing ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Campaign Status Card */}
      <div className={`border rounded-lg p-4 ${getStatusColor(campaignData.status)}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(campaignData.status)}
            <h4 className="font-medium">{campaignData.name}</h4>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaignData.status)}`}>
              {campaignData.status.charAt(0).toUpperCase() + campaignData.status.slice(1)}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {campaignData.started_at && new Date(campaignData.started_at).toLocaleDateString()}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="text-center">
            <div className="text-lg font-semibold">{campaignData.total_contacts}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{campaignData.calls_made}</div>
            <div className="text-xs text-gray-600">Made</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{campaignData.progress_percentage}%</div>
            <div className="text-xs text-gray-600">Progress</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        {campaignData.total_contacts > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${campaignData.progress_percentage}%` }}
            ></div>
          </div>
        )}
      </div>
      
      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {refreshing ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>
    </div>
  )
}
