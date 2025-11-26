export const config = {
  // API Configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://badarai.site/api',
  
  // App Configuration
  appName: 'BadarAI',
  appVersion: '1.0.0',
  
  // Feature Flags
  features: {
    voiceClone: true,
    integratedAI: true,
    googleSheets: true,
    analytics: true,
  },
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // URLs
  urls: {
    api: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://badarai.site/api',
    dashboard: '/dashboard',
    auth: '/auth',
  }
}

export default config
