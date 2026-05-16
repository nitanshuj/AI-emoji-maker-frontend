import React from "react"
import { Navbar } from "@/components/layout/Navbar"
import { LeftPanel } from "@/components/emoji/LeftPanel"
import { CenterPanel } from "@/components/emoji/CenterPanel"
import { RightPanel } from "@/components/emoji/RightPanel"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Studio Dashboard — Work Emoji Generator",
  description: "Create, inspect, and export your professional workplace emojis in various art styles and moods.",
}

export default function AppPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      {/* 3-panel desktop layout and stacked mobile layout */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1700px] w-full mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          
          {/* Left Panel: Generator Controls (3 cols on large screen) */}
          <section className="lg:col-span-4 xl:col-span-3 h-full">
            <LeftPanel />
          </section>

          {/* Center Panel: Gallery & Actions (5 cols on large screen) */}
          <section className="lg:col-span-8 xl:col-span-6 h-full">
            <CenterPanel />
          </section>

          {/* Right Panel: Selected Preview & Export (4 cols on large screen) */}
          <section className="lg:col-span-12 xl:col-span-3 h-full">
            <RightPanel />
          </section>

        </div>
      </main>
    </div>
  )
}
