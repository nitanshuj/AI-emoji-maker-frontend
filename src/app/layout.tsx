import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/context/AppContext"
import { UpgradeModal } from "@/components/ui/UpgradeModal"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Work Emoji Generator — Custom Workplace Reactions",
  description: "Generate polished, workplace-safe custom emojis in seconds with AI vector graphics. Export to PNG and ZIP bundles for Slack and Microsoft Teams.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
        <AppProvider>
          {children}
          <UpgradeModal />
        </AppProvider>
      </body>
    </html>
  )
}
