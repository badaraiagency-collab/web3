"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminStats } from "@/components/admin-stats"
import { UsersTable } from "@/components/users-table"
import { SubscriptionManagement } from "@/components/subscription-management"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    } else if (!user?.isAdmin) {
      // Not admin, show unauthorized message
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user) {
    return null
  }

  if (!user.isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Alert className="max-w-md">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-center">
              <strong>Unauthorized.</strong> Admin access only.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        <AdminStats />
        <UsersTable />
        <SubscriptionManagement />
      </div>
    </DashboardLayout>
  )
}
