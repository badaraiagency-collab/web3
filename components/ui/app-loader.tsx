export function AppLoader() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-4">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-3">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-600 text-sm font-medium">Loading...</p>
      </div>
    </div>
  )
}

export function InlineLoader() {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative w-5 h-5">
        <div className="absolute inset-0 border-2 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <span className="text-sm text-gray-600">Loading...</span>
    </div>
  )
}

export function ButtonLoader() {
  return (
    <div className="relative w-5 h-5">
      <div className="absolute inset-0 border-2 border-white/30 rounded-full"></div>
      <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
    </div>
  )
}

