"use client"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AppLoader } from "@/components/ui/app-loader"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <AppLoader />
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onAuthClick={() => {}} />
      <main className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  )
}
