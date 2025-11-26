"use client"

import { useState, useEffect } from "react"
import { FileSpreadsheet, ExternalLink, AlertCircle, Loader2, Plus, Info, AlertTriangle, CheckCircle, XCircle, RefreshCw, Unlink, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiService, SheetValidationResponse } from "@/lib/api"
import { ErrorHandler } from "@/lib/error-handler"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { EnhancedErrorToast } from "@/components/ui/enhanced-error-toast"

interface GoogleSheetStatusProps {
  onSheetStatusRefresh?: () => Promise<void>
}

export function GoogleSheetStatus({ onSheetStatusRefresh }: GoogleSheetStatusProps) {
  const [isConnectingUserSheet, setIsConnectingUserSheet] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [userSheetId, setUserSheetId] = useState("")
  const [showUserSheetDialog, setShowUserSheetDialog] = useState(false)
  const [validationResult, setValidationResult] = useState<SheetValidationResponse | null>(null)
  const [sheetStatus, setSheetStatus] = useState<any>(null)
  const [isLoadingSheetStatus, setIsLoadingSheetStatus] = useState(false)
  const [hasLoadedSheetStatus, setHasLoadedSheetStatus] = useState(false)
  const [isUnlinking, setIsUnlinking] = useState(false)
  const [hideAfterSetup, setHideAfterSetup] = useState(false)
  const [error, setError] = useState<any>(null)
  const { toast } = useToast()

  // Get Google Sheet status from localStorage or API - only once
  useEffect(() => {
    const getSheetStatus = async () => {
      // Prevent multiple calls
      if (hasLoadedSheetStatus || isLoadingSheetStatus) {
        return
      }

      setIsLoadingSheetStatus(true)
      try {
        // Try to get from localStorage first
        const storedStatus = localStorage.getItem('googleSheetStatus')
        if (storedStatus) {
          const parsedStatus = JSON.parse(storedStatus)
          setSheetStatus(parsedStatus)
          setHasLoadedSheetStatus(true)
        }
        
        // Also fetch fresh status from API using cached service
        const freshStatus = await apiService.checkGoogleSheetStatus({
          showToast: false, // Don't show toast for initial load
          forceRefresh: false // Use cache if available
        })
        setSheetStatus(freshStatus)
        localStorage.setItem('googleSheetStatus', JSON.stringify(freshStatus))
        setHasLoadedSheetStatus(true)
      } catch (error) {
        console.error('Error fetching sheet status:', error)
        setHasLoadedSheetStatus(true) // Mark as loaded even on error to prevent infinite retries
      } finally {
        setIsLoadingSheetStatus(false)
      }
    }

    if (!hasLoadedSheetStatus) {
      getSheetStatus()
    }
  }, [hasLoadedSheetStatus, isLoadingSheetStatus])

  // Helper functions
  const hasGoogleSheet = sheetStatus?.has_sheet && sheetStatus?.is_synced
  const needsSync = sheetStatus?.has_sheet && !sheetStatus?.is_synced
  const hasError = sheetStatus?.status === 'error'

  // Reset dialog state when sheet is synced
  useEffect(() => {
    if (sheetStatus?.is_synced) {
      setShowUserSheetDialog(false)
      setUserSheetId("")
      setValidationResult(null)
    }
  }, [sheetStatus?.is_synced])

  // Handle sheet validation
  const handleValidateSheet = async () => {
    if (!userSheetId.trim()) return

    setIsValidating(true)
    setError(null)
    try {
      const result = await apiService.validateGoogleSheet(userSheetId.trim())
      setValidationResult(result)
    } catch (error: any) {
      const errorResult = apiService.getErrorResult(error)
      setError(errorResult)
      
      toast({
        title: errorResult.title,
        description: errorResult.message,
        variant: errorResult.variant === 'warning' ? 'default' : errorResult.variant,
      })
    } finally {
      setIsValidating(false)
    }
  }

  // Handle sheet connection
  const handleConnectUserSheet = async () => {
    if (!userSheetId.trim() || !validationResult?.valid) return

    setIsConnectingUserSheet(true)
    setError(null)
    try {
      const result = await apiService.setupUserGoogleSheet(userSheetId.trim())

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
          variant: "default",
        })
        onSheetStatusRefresh?.()
        setHideAfterSetup(true)
      } else {
        // Fallback for unexpected success:false responses
        setError({
          title: "Error",
          message: result.message || "Failed to connect your Google Sheet. Please try again.",
          variant: "destructive",
          action: "retry"
        })
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
      setIsConnectingUserSheet(false)
    }
  }

  // Handle sheet unlinking
  const handleUnlinkSheet = async () => {
    setIsUnlinking(true)
    try {
      const result = await apiService.unlinkGoogleSheet()
      
      if (result.success) {
        toast({
          title: "Sheet Unlinked",
          description: result.message,
          variant: "default",
        })
        
        // Clear local storage
        localStorage.removeItem('googleSheetStatus')
        
        // Refresh sheet status
        onSheetStatusRefresh?.()
        
        // Reset component state
        setSheetStatus(null)
        setHasLoadedSheetStatus(false)
        setHideAfterSetup(false)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to unlink sheet",
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
      setIsUnlinking(false)
    }
  }

  // Refresh sheet status
  const refreshSheetStatus = async () => {
    setIsLoadingSheetStatus(true)
    try {
      const freshStatus = await apiService.checkGoogleSheetStatus({
        showToast: true,
        toastMessage: 'Sheet status refreshed',
        forceRefresh: true // Force refresh from API
      })
      setSheetStatus(freshStatus)
      localStorage.setItem('googleSheetStatus', JSON.stringify(freshStatus))
    } catch (error) {
      console.error('Error refreshing sheet status:', error)
    } finally {
      setIsLoadingSheetStatus(false)
    }
  }

  // Handle paste sheet URL
  const handlePasteSheetUrl = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const sheetId = text.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1]
      if (sheetId) {
        setUserSheetId(sheetId)
        // Auto-validate when pasting
        setTimeout(() => handleValidateSheet(), 100)
      } else {
        toast({
          title: "Invalid URL",
          description: "Please copy a valid Google Sheets URL",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read clipboard. Please paste manually.",
        variant: "destructive",
      })
    }
  }

  // Helper functions for validation display
  const getValidationStatusIcon = () => {
    if (!validationResult) return <Info className="h-4 w-4 text-gray-400" />
    if (validationResult.valid) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (validationResult.error_type === 'access_denied') return <XCircle className="h-4 w-4 text-red-500" />
    return <AlertTriangle className="h-4 w-4 text-amber-500" />
  }

  const getValidationColor = () => {
    if (!validationResult) return "text-gray-600"
    if (validationResult.valid) return "text-green-600"
    if (validationResult.error_type === 'access_denied') return "text-red-600"
    return "text-amber-600"
  }

  const getValidationMessage = () => {
    if (!validationResult) return "Enter a Google Sheet ID to validate"
    if (validationResult.valid) return "Sheet is accessible and ready for connection"
    if (validationResult.error_type === 'access_denied') return "Access denied. Please check permissions."
    if (validationResult.error_type === 'invalid_format') return "Invalid sheet ID format"
    
    // Handle structure-based status
    if (validationResult.structure_info) {
      const status = validationResult.structure_info.status
      switch (status) {
        case 'ready':
          return "Sheet has correct structure with all required tabs and columns"
        case 'needs_restructure':
          return "Sheet has all required tabs but some columns need adjustment"
        case 'needs_sheets':
          return "Sheet has correct column structure but missing some required tabs"
        case 'needs_setup':
          return "Sheet needs both tabs and column structure setup"
        case 'error':
          return "Failed to check sheet structure"
        default:
          return validationResult.message || "Validation failed"
      }
    }
    
    return validationResult.message || "Validation failed"
  }

  // Main render with conditional content
  return (
    <div className="space-y-4">
      {/* Show connected state after successful connection */}
      {hideAfterSetup && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-center">
            <FileSpreadsheet className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-medium text-blue-900 mb-2">Google Sheet Connected</h3>
            <p className="text-sm text-blue-700 mb-4">
              Your Google Sheet has been successfully connected to your account.
            </p>
            <Button 
              onClick={() => setHideAfterSetup(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Another Sheet
            </Button>
          </div>
        </div>
      )}

      {/* Show loading state */}
      {(isLoadingSheetStatus || !hasLoadedSheetStatus) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-pulse">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
            </div>
            <div className="flex-1">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-64"></div>
              </div>
            </div>
            <div className="animate-pulse">
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-500">Loading Google Sheet status...</p>
          </div>
        </div>
      )}

      {/* Show error state */}
      {hasError && hasLoadedSheetStatus && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-red-900">Failed to Load Sheet Status</h3>
              <p className="text-sm text-red-700">
                {sheetStatus?.error || 'Unable to check Google Sheet status. Please try again.'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshSheetStatus}
              disabled={isLoadingSheetStatus}
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              {isLoadingSheetStatus ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Show connected and synced state */}
      {hasGoogleSheet && !hideAfterSetup && (
        <Card className="border border-green-200 bg-green-50/50">
          <CardContent className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-900">Google Sheet Connected</p>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs px-1.5 py-0 mt-0.5">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Synced
                  </Badge>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="space-y-2">
              <p className="text-sm text-green-700">
                Your call tracking sheet is ready and synced.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-green-600">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Last synced: {sheetStatus?.last_sync ? new Date(sheetStatus.last_sync).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  }) : 'Unknown'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://docs.google.com/spreadsheets/d/${sheetStatus?.sheet_id}`, '_blank')}
                className="text-green-700 border-green-300 hover:bg-green-100 flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Sheet
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsUnlinking(true)}
                    disabled={isUnlinking}
                    className="text-red-700 border-red-300 hover:bg-red-100"
                  >
                    {isUnlinking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Unlink className="h-4 w-4 mr-2" />
                        Unlink
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Unlink Google Sheet</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to unlink your Google Sheet? This will remove the connection but won't delete your sheet.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleUnlinkSheet} className="bg-red-600 hover:bg-red-700">
                      Unlink Sheet
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show needs sync state */}
      {needsSync && !hideAfterSetup && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-900">Google Sheet Needs Sync</h3>
              <p className="text-sm text-amber-700">
                Your sheet is connected but needs to be synchronized.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshSheetStatus}
              disabled={isLoadingSheetStatus}
              className="text-amber-700 border-amber-300 hover:bg-amber-100"
            >
              {isLoadingSheetStatus ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sync Now
            </Button>
          </div>
        </div>
      )}

      {/* Show no sheet connected state */}
      {!hasGoogleSheet && !needsSync && !hasError && hasLoadedSheetStatus && !hideAfterSetup && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">i</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-blue-900">Google Sheet Not Connected</h3>
              </div>
              <p className="text-sm text-blue-700">
                You haven't connected a Google Sheet yet. Connect one to start tracking your call campaigns.
              </p>
            </div>
            <Dialog open={showUserSheetDialog} onOpenChange={setShowUserSheetDialog}>
              <DialogTrigger asChild>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto justify-center flex-shrink-0">
                  <FileSpreadsheet className="h-4 w-4" />
                  Connect Sheet
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Connect Google Sheet</DialogTitle>
                  <DialogDescription>
                    Follow these steps to connect your Google Sheet for call tracking automation.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Step-by-step guidance */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Info className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">How to Connect Your Google Sheet</span>
                    </h3>
                    
                    {/* Important Disclaimer */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-amber-800">
                          <p className="font-medium text-sm mb-1">⚠️ Important Warning</p>
                          <p className="text-xs">
                            <strong>Data will be removed:</strong> When connecting your Google Sheet, our system will set up the required structure 
                            for call tracking, which will remove any existing data. We strongly recommend sharing a <strong>fresh, new document</strong> 
                            to avoid losing important information.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 text-sm text-blue-800">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xs flex-shrink-0">
                          1
                        </div>
                        <div className="min-w-0 flex-1">
                          <strong>Create a New Google Sheet:</strong> Start with a fresh, empty Google Sheet to avoid data loss
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xs flex-shrink-0">
                          2
                        </div>
                        <div className="min-w-0 flex-1">
                          <strong>Share with Service Account:</strong> In your Google Sheet, click "Share" and add this email as an Editor:
                          <div className="flex items-center gap-2 mt-2">
                            <code className="block bg-blue-100 px-2 py-1 rounded text-xs font-mono flex-1 min-w-0 break-all">
                              call-automations@call-automation-469200.iam.gserviceaccount.com
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs flex-shrink-0"
                              onClick={() => {
                                navigator.clipboard.writeText('call-automations@call-automation-469200.iam.gserviceaccount.com')
                                  .then(() => {
                                    toast({
                                      title: "Copied!",
                                      description: "Service account email copied to clipboard",
                                      variant: "default",
                                    })
                                  })
                                  .catch(() => {
                                    toast({
                                      title: "Copy failed",
                                      description: "Please copy the email manually",
                                      variant: "destructive",
                                    })
                                  })
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xs flex-shrink-0">
                          3
                        </div>
                        <div className="min-w-0 flex-1">
                          <strong>Get Sheet ID from URL:</strong> Copy the ID from your Google Sheet URL:
                          <div className="bg-blue-100 p-2 rounded mt-2 font-mono text-xs break-all">
                            https://docs.google.com/spreadsheets/d/<span className="bg-yellow-200 px-1 rounded">YOUR_GOOGLE_SHEET_ID_HERE_abc123xyz</span>/edit
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                            <p className="text-xs text-blue-700">The highlighted part is your Sheet ID (replace with your actual Sheet ID)</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xs flex-shrink-0">
                          4
                        </div>
                        <div className="min-w-0 flex-1">
                          <strong>Paste and Connect:</strong> Paste the Sheet ID or URL below and click "Connect Sheet"
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUserSheetId("")
                        setValidationResult(null)
                      }}
                      className="w-full"
                    >
                      Clear & Start Over
                    </Button>
                  </div>

                  {/* Sheet ID input */}
                  <div className="space-y-2">
                    <Label htmlFor="sheetId" className="text-sm font-medium">
                      Google Sheet ID or URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="sheetId"
                        placeholder="YOUR_GOOGLE_SHEET_ID_HERE or paste full URL"
                        value={userSheetId}
                        onChange={(e) => setUserSheetId(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleValidateSheet}
                        disabled={!userSheetId.trim() || isValidating}
                        className="whitespace-nowrap flex-shrink-0"
                      >
                        {isValidating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Validate
                      </Button>
                    </div>
                    
                    {/* Help text */}
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• <strong>Sheet ID:</strong> The long string of letters and numbers in your Google Sheets URL</p>
                      <p>• <strong>Example URL:</strong> <code className="bg-gray-100 px-1 rounded break-all">docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit</code></p>
                      <p>• You can paste either the full URL or just the Sheet ID</p>
                    </div>
                  </div>

                  {/* Validation Status */}
                  {userSheetId.trim() && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        {getValidationStatusIcon()}
                        <span className={getValidationColor()}>
                          {getValidationMessage()}
                        </span>
                      </div>
                      
                      {/* Success indicator when ready */}
                      {validationResult?.valid && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-green-800 font-medium text-sm">✅ Sheet is ready for connection!</p>
                              <p className="text-green-700 text-xs">Click "Connect Sheet" below to complete the setup.</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Show structure information if available */}
                      {validationResult?.structure_info && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                          <h4 className="font-medium text-gray-900 text-sm">Sheet Structure Analysis:</h4>
                          <div className="text-xs space-y-2">
                            {validationResult.structure_info.existing_sheets && validationResult.structure_info.existing_sheets.length > 0 && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                <span className="text-green-700 min-w-0">
                                  <strong>Existing sheets:</strong> {validationResult.structure_info.existing_sheets.join(', ')}
                                </span>
                              </div>
                            )}
                            {validationResult.structure_info.missing_sheets && validationResult.structure_info.missing_sheets.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Plus className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                <span className="text-blue-700 min-w-0">
                                  <strong>Will create:</strong> {validationResult.structure_info.missing_sheets.join(', ')}
                                </span>
                              </div>
                            )}
                            {validationResult.structure_info.structure_issues && validationResult.structure_info.structure_issues.length > 0 && (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-3 w-3 text-orange-500 flex-shrink-0" />
                                <span className="text-orange-700 min-w-0">
                                  <strong>Structure issues:</strong> {validationResult.structure_info.structure_issues.join(', ')}
                                </span>
                              </div>
                            )}
                            
                            {/* Show detailed column validation */}
                            {validationResult.structure_info.column_validation && (
                              <div className="mt-3 space-y-2 border-t pt-2">
                                <p className="text-gray-600 font-medium">Column Validation:</p>
                                {Object.entries(validationResult.structure_info.column_validation).map(([sheetName, validation]) => (
                                  <div key={sheetName} className="ml-2">
                                    <p className="text-gray-600 min-w-0">
                                      <strong>{sheetName}:</strong>
                                      {validation.valid ? (
                                        <span className="text-green-600"> ✓ All columns correct</span>
                                      ) : (
                                        <span className="text-red-600"> ✗ Needs fixing</span>
                                      )}
                                    </p>
                                    {!validation.valid && (
                                      <div className="ml-2 text-xs mt-1">
                                        {validation.missing_columns && validation.missing_columns.length > 0 && (
                                          <p className="text-red-600 min-w-0">
                                            Missing: {validation.missing_columns.join(', ')}
                                          </p>
                                        )}
                                        {validation.extra_columns && validation.extra_columns.length > 0 && (
                                          <p className="text-amber-600 min-w-0">
                                            Extra: {validation.extra_columns.join(', ')}
                                          </p>
                                        )}
                                        {validation.current_headers && validation.current_headers.length > 0 && (
                                          <p className="text-gray-500 min-w-0">
                                            Current: {validation.current_headers.join(', ')}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Error display */}
                  {error && (
                    <EnhancedErrorToast
                      error={error}
                      onRetry={() => {
                        setError(null)
                        handleConnectUserSheet()
                      }}
                      onDismiss={() => setError(null)}
                      onShowHelp={() => {
                        toast({
                          title: "Help Information",
                          description: error?.helpText || "Please contact support for assistance.",
                          variant: "default",
                        })
                      }}
                    />
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={handleConnectUserSheet}
                      disabled={isConnectingUserSheet || !userSheetId.trim() || !validationResult?.valid}
                      className="flex-1"
                    >
                      {isConnectingUserSheet ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Connect Sheet
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowUserSheetDialog(false)
                        setUserSheetId("")
                        setValidationResult(null)
                        setError(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* Additional help */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">Need Help?</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• Make sure you've shared the sheet with the service account email</p>
                      <p>• The sheet ID is the long string between <code className="bg-gray-200 px-1 rounded">/d/</code> and <code className="bg-gray-200 px-1 rounded">/edit</code> in the URL</p>
                      <p>• If you get "Access denied", check the sharing permissions in Google Sheets</p>
                      <p>• The system will automatically create the required tabs and columns if needed</p>
                    </div>
                    
                    {/* Data Loss Warning */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="text-red-700">
                          <p className="font-medium text-xs mb-1">⚠️ Data Loss Warning</p>
                          <p className="text-xs">
                            <strong>Important:</strong> Connecting an existing Google Sheet will remove all current data to set up the call tracking structure. 
                            Always use a <strong>new, empty sheet</strong> to prevent data loss.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  )
}
