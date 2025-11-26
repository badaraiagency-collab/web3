"use client"

import { useState, useEffect } from "react"
import { Phone, BarChart3, TrendingUp, Users, Target, Loader2, Play, Pause, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface CampaignStatusProps {
  userProfile: any
  onRefresh?: () => void
}

export function CampaignStatus({ userProfile, onRefresh }: CampaignStatusProps) {
  const [campaignData, setCampaignData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCampaignStatus()
    // Removed automatic polling - user will manually refresh
  }, [])

  const fetchCampaignStatus = async () => {
    try {
      setLoading(true)
      
      // Get campaign from localStorage
      const storedCampaign = localStorage.getItem('currentCampaign')
      if (!storedCampaign || !userProfile?.user_id) {
        setCampaignData(null)
        setError(null)
        setLastUpdated(new Date())
        setLoading(false)
        return
      }
      
      const campaign = JSON.parse(storedCampaign)
      if (!campaign.id || !campaign.name) {
        setCampaignData(null)
        setError(null)
        setLastUpdated(new Date())
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
          // Convert stats to the format expected by this component
          setCampaignData({
            active_campaigns: [{
              id: stats.campaign_id,
              name: stats.campaign_name,
              status: stats.status,
              total_contacts: stats.target_calls,
              calls_made: stats.current_call,
              remaining_calls: stats.remaining_calls,
              started_at: stats.created_at,
              updated_at: stats.updated_at,
              phone_number: stats.phone_number,
              room_name: stats.room_name,
            }],
            metrics: {
              total_calls: stats.target_calls,
              completed_calls: stats.current_call,
              remaining_calls: stats.remaining_calls,
            }
          })
          setError(null)
          setLastUpdated(new Date())
        } else {
          setCampaignData(null)
          setError(null)
          setLastUpdated(new Date())
        }
      } else {
        setError(result.message || 'Failed to fetch campaign status')
      }
    } catch (error) {
      setError('Failed to fetch campaign status')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await fetchCampaignStatus()
      
      // Call parent refresh callback if provided
      onRefresh?.()
      
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
        return <Play className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'stopped':
        return <Pause className="h-4 w-4 text-gray-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
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

  if (loading && !campaignData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Loading campaign status...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Campaigns</h3>
          <p className="text-gray-600 mb-4">{error}</p>
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
            {refreshing ? 'Refreshing...' : 'Try Again'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Active Campaigns */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Active Campaigns</h3>
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
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {campaignData?.active_campaigns && campaignData.active_campaigns.length > 0 ? (
          <div className="space-y-4">
            {campaignData.active_campaigns.map((campaign: any) => (
              <div
                key={campaign.id}
                className={`border rounded-lg p-4 ${getStatusColor(campaign.status)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(campaign.status)}
                    <h4 className="font-medium">{campaign.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {campaign.started_at && new Date(campaign.started_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{campaign.total_contacts}</div>
                    <div className="text-xs text-gray-600">Total Contacts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{campaign.calls_made}</div>
                    <div className="text-xs text-gray-600">Calls Made</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{campaign.calls_answered}</div>
                    <div className="text-xs text-gray-600">Answered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">{campaign.calls_failed}</div>
                    <div className="text-xs text-gray-600">Failed</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {campaign.total_contacts > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${campaign.progress_percentage}%` }}
                    ></div>
                  </div>
                )}
                
                <div className="text-xs text-gray-600 mt-2 text-center">
                  Progress: {campaign.progress_percentage}% ({campaign.calls_made}/{campaign.total_contacts})
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Campaigns</h3>
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
        )}
      </div>
    </div>
  )
}
