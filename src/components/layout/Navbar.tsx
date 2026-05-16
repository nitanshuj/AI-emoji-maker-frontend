"use client"

import React from "react"
import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smile, Zap, LogOut, Sparkles, User } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const { user, logout, setShowUpgradeModal } = useApp()
  const remaining = Math.max(0, user.maxGenerations - user.generationsUsed)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-purple-600 text-white shadow-md shadow-primary/20">
            <Smile className="h-6 w-6" />
          </div>
          <div>
            <Link href="/app" className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-lg sm:text-xl text-foreground">
                AI Emoji <span className="text-primary">Gen</span>
              </span>
            </Link>
            <p className="hidden text-[11px] font-medium text-muted-foreground sm:block">
              Your personal emoji studio
            </p>
          </div>
        </div>

        {/* User Info & Plan Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Generations Counter & Meter */}
          <div 
            onClick={() => setShowUpgradeModal(true)}
            className="flex cursor-pointer items-center gap-2 rounded-full border bg-muted/60 px-3 py-1.5 text-xs font-medium transition-all hover:bg-muted shadow-sm"
            title="Click to view plan usage"
          >
            <Zap className={`h-4 w-4 ${remaining === 0 ? 'text-destructive animate-pulse' : 'text-amber-500'}`} />
            <span className="hidden sm:inline text-muted-foreground">Remaining:</span>
            <span className={`font-bold ${remaining === 0 ? 'text-destructive' : 'text-foreground'}`}>
              {remaining} / {user.maxGenerations}
            </span>
            {user.plan === "Free" && (
              <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary uppercase">
                Upgrade
              </span>
            )}
          </div>

          {/* Current Plan Badge */}
          <div onClick={() => setShowUpgradeModal(true)} className="cursor-pointer">
            <Badge
              variant={user.plan === "Ultra" ? "premium" : user.plan === "Premium" ? "premium" : "secondary"}
              className={`px-3 py-1 text-xs ${user.plan === "Ultra" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0" : ""}`}
            >
              {user.plan === "Ultra" ? (
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Ultra
                </span>
              ) : user.plan === "Premium" ? (
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Premium
                </span>
              ) : (
                "Free Plan"
              )}
            </Badge>
          </div>

          {/* User Profile / Avatar & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l">
            <div className="hidden items-center gap-2 md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase border">
                {user.name ? user.name.slice(0, 2) : <User className="h-4 w-4" />}
              </div>
              <span className="text-xs font-medium text-foreground max-w-[120px] truncate">
                {user.name}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive"
              title="Sign out"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Logout
            </Button>
          </div>

        </div>

      </div>
    </header>
  )
}
