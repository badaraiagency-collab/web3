import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, JetBrains_Mono } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import { NavigationProvider } from "@/lib/navigation-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "BadarAI - AI-Powered Call Automation",
  description: "Connect your Google Sheets, add contacts, and let AI call them automatically with BadarAI's intelligent calling platform.",
  generator: "v0.app",
  icons: {
    icon: "/badarai-logo.png",
    shortcut: "/badarai-logo.png",
    apple: "/badarai-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} antialiased`}>
      <body>
        <AuthProvider>
          <NavigationProvider>
            {children}
          </NavigationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
