"use client"

import React, { useState } from "react"
import { useApp } from "@/context/AppContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { API } from "@/lib/api"
import { Smile, Sparkles, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { login } = useApp()
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const data = await API.login(email, password)
      const fullName = data.user.full_name || email.split("@")[0]
      login(email, fullName, data.access_token, data.user.id)
      router.push("/app")
    } catch (err: any) {
      console.error("Backend login failed:", err)
      setErrorMsg(err.message || "Failed to sign in. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      <div className="space-y-2 text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</h2>
        <p className="text-sm text-muted-foreground">Sign in to access your emoji studio.</p>
      </div>

      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 font-medium">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11 rounded-lg"
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full h-11 font-bold text-base rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/20 hover:opacity-90 transition-opacity">
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </div>
  )
}
