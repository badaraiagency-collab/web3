/**
 * Utility functions for handling authentication data and token expiration
 */

export const clearAllAuthData = (): void => {
  // Clear all possible auth-related localStorage items
  localStorage.removeItem('supabase.auth.token')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  localStorage.removeItem('userProfile')
  localStorage.removeItem('googleSheetStatus')
  localStorage.removeItem('dashboardVisited')
  
  // Clear any other potential auth-related items
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (
      key.includes('auth') || 
      key.includes('token') || 
      key.includes('user') || 
      key.includes('profile') ||
      key.includes('session')
    )) {
      keysToRemove.push(key)
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key))
}

export const redirectToLandingPage = (): void => {
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
}

export const handleTokenExpiration = (): void => {
  console.log('🔄 Token expired, clearing auth data and redirecting...')
  clearAllAuthData()
  redirectToLandingPage()
}

export const isTokenExpiredError = (errorMessage: string): boolean => {
  const expiredKeywords = [
    'token expired',
    'invalid token',
    'unauthorized',
    'authentication failed',
    '401',
    'expired',
    'invalid session'
  ]
  
  return expiredKeywords.some(keyword => 
    errorMessage.toLowerCase().includes(keyword.toLowerCase())
  )
}
