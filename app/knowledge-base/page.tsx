"use client"

import { KnowledgeBaseManager } from "@/components/knowledge-base-manager"

export default function KnowledgeBasePage() {
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Knowledge Base
          </h1>
          <p className="text-gray-600">
            Configure your AI agent's knowledge with business information and common questions to ensure accurate and helpful responses during calls.
          </p>
        </div>

        {/* Knowledge Base Manager */}
        <KnowledgeBaseManager />
      </div>
    </div>
  )
}

