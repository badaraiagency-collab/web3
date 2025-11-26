"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface NavigationContextType {
  currentPage: string
  navigateTo: (path: string, forceRefresh?: boolean) => void
  refreshCurrentPage: () => void
  isNavigating: boolean
  forcePageRefresh: (path: string) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)
  const [lastPath, setLastPath] = useState<string | null>(null)

  // Track path changes and trigger refresh events
  useEffect(() => {
    if (lastPath && lastPath !== pathname) {
      console.log(`[Navigation] Path changed from ${lastPath} to ${pathname}`)
      
      // Dispatch refresh event for the new page
      window.dispatchEvent(new CustomEvent('pageRefresh', { 
        detail: { 
          path: pathname,
          fromPath: lastPath,
          isNewPage: true
        } 
      }))
      
      setLastPath(pathname)
    } else if (!lastPath) {
      setLastPath(pathname)
    }
  }, [pathname, lastPath])

  const navigateTo = useCallback(async (path: string, forceRefresh: boolean = false) => {
    console.log(`[Navigation] navigateTo called: ${path}, forceRefresh: ${forceRefresh}, currentPath: ${pathname}`)
    
    if (path === pathname && !forceRefresh) {
      // If navigating to the same page, just refresh the data
      console.log(`[Navigation] Same page navigation, triggering refresh`)
      window.dispatchEvent(new CustomEvent('pageRefresh', { 
        detail: { 
          path,
          fromPath: pathname,
          isNewPage: false,
          forceRefresh: true
        } 
      }))
      return
    }

    if (path !== pathname) {
      // Navigating to a different page
      console.log(`[Navigation] Navigating to different page: ${path}`)
      setIsNavigating(true)
      
      // Navigate to the new page
      router.push(path)
      
      // Reset navigation state after a short delay
      setTimeout(() => {
        setIsNavigating(false)
      }, 100)
    }
  }, [router, pathname])

  const refreshCurrentPage = useCallback(() => {
    console.log(`[Navigation] refreshCurrentPage called for: ${pathname}`)
    window.dispatchEvent(new CustomEvent('pageRefresh', { 
      detail: { 
        path: pathname,
        fromPath: pathname,
        isNewPage: false,
        forceRefresh: true
      } 
    }))
  }, [pathname])

  const forcePageRefresh = useCallback((path: string) => {
    console.log(`[Navigation] forcePageRefresh called for: ${path}`)
    window.dispatchEvent(new CustomEvent('pageRefresh', { 
      detail: { 
        path,
        fromPath: pathname,
        isNewPage: false,
        forceRefresh: true
      } 
    }))
  }, [pathname])

  const value: NavigationContextType = {
    currentPage: pathname,
    navigateTo,
    refreshCurrentPage,
    isNavigating,
    forcePageRefresh
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
