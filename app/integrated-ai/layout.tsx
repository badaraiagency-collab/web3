import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Integrated AI Assistant - BadarAI",
  description: "Real-time AI conversation with speech-to-text, LLM, and text-to-speech integration",
}

export default function IntegratedAILayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
