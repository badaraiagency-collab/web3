"use client"

import Image from "next/image"

export function AuthLoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <Image 
            src="/badarai-logo.png" 
            alt="BadarAI Logo" 
            width={80} 
            height={80}
            className="w-20 h-20 object-contain mx-auto animate-pulse"
          />
        </div>
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-600 font-medium">Initializing BadarAI...</p>
      </div>
    </div>
  )
}
