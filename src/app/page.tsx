"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smile, Sparkles, ArrowRight, ShieldCheck, Zap, Layers, RefreshCw } from "lucide-react"
import { SignInForm } from "@/components/auth/SignInForm"
import { SignUpForm } from "@/components/auth/SignUpForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-secondary/30 to-background overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 left-0 -translate-x-1/4 w-full h-[600px] bg-gradient-to-br from-purple-600/20 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 w-full h-[600px] bg-gradient-to-tl from-primary/20 via-transparent to-transparent blur-3xl pointer-events-none" />

      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-purple-600 text-white shadow-lg shadow-primary/20">
              <Smile className="h-6 w-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              AI Emoji <span className="text-primary">Gen</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/app">
              <Button variant="ghost" className="font-semibold text-sm h-10 px-4 rounded-xl">Dashboard</Button>
            </Link>
            <Link href="/app">
              <Button className="font-semibold text-sm h-10 px-5 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/20 hover:opacity-90 transition-opacity">
                Start Creating
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center relative z-10">
        <Badge className="mb-6 px-4 py-1.5 text-sm font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center gap-2 shadow-xs">
          <Sparkles className="h-4 w-4" /> Your Personal Emoji Studio
        </Badge>

        <h1 className="max-w-4xl text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.15] mb-8">
          Unleash Your Inner <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">Emoji Artist.</span>
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed">
          Design your own unique, AI-powered emojis in seconds. Choose from Flat, Sticker, Doodle, Pixel, or Mascot styles to perfectly match your vibe.
        </p>

        <div className="w-full max-w-md">
          <Tabs defaultValue="sign-in" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in">
              <SignInForm />
            </TabsContent>
            <TabsContent value="sign-up">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </div>

        {/* Feature Cards Showcase */}
        <div className="mt-24 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-3 text-left">
          
          <div className="flex flex-col rounded-3xl border bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Multiple Styles</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Choose from a variety of professional art styles like Flat, Sticker, Doodle, and more to match your desired aesthetic.
            </p>
          </div>

          <div className="flex flex-col rounded-3xl border bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
              <RefreshCw className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Iterative Remixing</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Not quite right? Instantly remix any generation with a new style, mood, or prompt to dial in the perfect result.
            </p>
          </div>

          <div className="flex flex-col rounded-3xl border bg-card/60 backdrop-blur-md p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our optimized AI pipeline delivers high-quality emoji generations in seconds, so you can create without breaking your flow.
            </p>
          </div>

        </div>

      </main>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        © 2026 Work Emoji Generator. Built for seamless team communication.
      </footer>
    </div>
  )
}
