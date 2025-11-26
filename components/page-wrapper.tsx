"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface PageWrapperProps {
  children: ReactNode
  requireAuth?: boolean
  loadingText?: string
  loadingSubtitle?: string
  className?: string
  showNavbar?: boolean
}

export function PageWrapper({ 
  children, 
  requireAuth = true,
  loadingText = "Loading...",
  loadingSubtitle,
  className = "",
  showNavbar = false
}: PageWrapperProps) {
  const { isAuthenticated, userProfile, refreshUserProfile, isProfileLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasAttemptedProfileLoad, setHasAttemptedProfileLoad] = useState(false)

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push('/')
      return
    }
    
    // If authenticated but no profile, attempt to load it
    if (requireAuth && isAuthenticated && !userProfile && !hasAttemptedProfileLoad) {
      console.log('PageWrapper: Attempting to load profile...')
      setHasAttemptedProfileLoad(true)
      refreshUserProfile()
    }
    
    // Set loading to false once we have authentication status and profile loading is complete
    if (requireAuth) {
      if (isAuthenticated !== undefined && !isProfileLoading && hasAttemptedProfileLoad) {
        console.log('PageWrapper: Loading complete, showing content')
        setIsLoading(false)
      }
    } else {
      // For non-auth pages, just set loading to false
      setIsLoading(false)
    }
  }, [isAuthenticated, userProfile, isProfileLoading, hasAttemptedProfileLoad, router, refreshUserProfile, requireAuth])

  // Show loading state while:
  // 1. Authentication is being checked (for auth pages)
  // 2. Profile is being loaded (for auth pages)
  // 3. Profile loading has been attempted but not completed (for auth pages)
  const shouldShowLoader = isLoading || (requireAuth && (isProfileLoading || (isAuthenticated && !userProfile && hasAttemptedProfileLoad)))

  if (shouldShowLoader) {
    return (
      <div className={className}>
        <LoadingSpinner
          size="lg"
          text={loadingText}
          subtitle={loadingSubtitle || (isProfileLoading ? 'Fetching your profile...' : 'Please wait...')}
          showProgress={isProfileLoading}
          progressWidth={60}
          className="py-20"
        />
      </div>
    )
  }

  return <>{children}</>
}
