"use client"

import { ReactNode } from "react"
import { Navbar } from "@/components/navbar"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onAuthClick={() => {}} />
      <main className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  )
}
