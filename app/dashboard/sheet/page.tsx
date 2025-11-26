"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, ExternalLink, Plus, Download, Unlink } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"
import { ErrorHandler } from "@/lib/error-handler"

export default function SheetPage() {
  const { user, isAuthenticated, userProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isUnlinking, setIsUnlinking] = useState(false)
  const [hideAfterSetup, setHideAfterSetup] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  // Check if user has a Google Sheet connected
  const hasGoogleSheet = userProfile?.google_sheet_id && userProfile?.google_sheet_synced_at
  const sheetUrl = hasGoogleSheet ? `https://docs.google.com/spreadsheets/d/${userProfile.google_sheet_id}` : undefined

  const handleUnlinkSheet = async () => {
    if (!hasGoogleSheet) return
    
    try {
      setIsUnlinking(true)
      const result = await apiService.unlinkGoogleSheet()
      
      if (result.success) {
        toast({
          title: "Sheet Unlinked",
          description: "Your Google Sheet integration has been unlinked successfully.",
          variant: "default",
        })
        // Hide the component after successful unlinking
        setHideAfterSetup(true)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to unlink the Google Sheet.",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorInfo = ErrorHandler.formatError(error)
      toast({
        title: errorInfo.title,
        description: errorInfo.message,
        variant: errorInfo.variant || "destructive",
      })
    } finally {
      setIsUnlinking(false)
    }
  }

  if (hideAfterSetup) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <FileSpreadsheet className="h-24 w-24 text-blue-600 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Google Sheet Unlinked</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Your Google Sheet integration has been successfully removed. You can set up a new sheet when you're ready.
              </p>
              <Button 
                onClick={() => setHideAfterSetup(false)}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Connect New Sheet
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Sheet</h1>
            <p className="text-muted-foreground">Manage your Google Sheet and contacts</p>
          </div>
          {hasGoogleSheet && (
            <Button className="gap-2" asChild>
              <a href={sheetUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open Sheet
              </a>
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Sheet Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Status:</p>
                <div className="flex items-center gap-2 mt-1">
                  {hasGoogleSheet ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active & Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Connected</Badge>
                  )}
                </div>
              </div>
            </div>

            {hasGoogleSheet && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-sm text-muted-foreground">Total Contacts</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-sm text-muted-foreground">Called Today</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">144</div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Contacts
              </CardTitle>
              <CardDescription>Import or manually add contacts to your sheet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2" disabled={!hasGoogleSheet}>
                <Plus className="h-4 w-4" />
                Add Contact Manually
              </Button>
              <Button variant="outline" className="w-full gap-2 bg-transparent" disabled={!hasGoogleSheet}>
                <Download className="h-4 w-4" />
                Import from CSV
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sheet Management</CardTitle>
              <CardDescription>Advanced sheet operations and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full bg-transparent" disabled={!hasGoogleSheet}>
                Sync Sheet Data
              </Button>
              <Button variant="outline" className="w-full bg-transparent" disabled={!hasGoogleSheet}>
                Export Call Results
              </Button>
              <Button variant="outline" className="w-full bg-transparent" disabled={!hasGoogleSheet}>
                Sheet Settings
              </Button>
              {hasGoogleSheet && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent text-red-700 border-red-300 hover:bg-red-100"
                      disabled={isUnlinking}
                    >
                      {isUnlinking ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>
                          Unlinking...
                        </>
                      ) : (
                        <>
                          <Unlink className="h-4 w-4 mr-2" />
                          Unlink Google Sheet
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently remove your Google Sheet integration and all associated data will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleUnlinkSheet}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Unlink Sheet
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>
        </div>

        {!hasGoogleSheet && (
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Set up your Google Sheet to start making automated calls</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
