import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, JetBrains_Mono } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import { NavigationProvider } from "@/lib/navigation-context"
import "./globals.css"
import Script from "next/script"

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

        {/* Tawk.to Chat Widget */}
        <Script
          id="tawkto"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/6926844f188b0a1960fc1227/default';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
