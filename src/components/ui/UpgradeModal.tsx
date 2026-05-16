"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/context/AppContext"
import { Sparkles, Check, Zap, AlertCircle, CheckCircle2 } from "lucide-react"

export function UpgradeModal() {
  const { user, showUpgradeModal, setShowUpgradeModal, upgradePlan } = useApp()

  return (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="max-w-md overflow-hidden p-6 sm:rounded-3xl">
        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
        
        <DialogHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 shadow-lg shadow-purple-500/20">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose a plan that fits your creative needs. Unlock more generations and features.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-6">
          {/* Free Plan */}
          <div className={`rounded-lg border p-4 ${user.plan === 'Free' ? 'border-primary' : ''}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">Free</h3>
                <p className="text-sm text-muted-foreground">10 generations per week</p>
              </div>
              <Button variant="outline" size="sm" disabled={user.plan === 'Free'}>Current Plan</Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className={`rounded-lg border p-4 ${user.plan === 'Premium' ? 'border-primary' : ''}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">Premium <span className="text-sm font-normal text-muted-foreground">- ₹100/mo</span></h3>
                <p className="text-sm text-muted-foreground">100 generations per week, priority support</p>
              </div>
              <Button size="sm" disabled>Upgrade</Button>
            </div>
          </div>

          {/* Ultra Plan */}
          <div className={`rounded-lg border p-4 ${user.plan === 'Ultra' ? 'border-primary' : ''}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">Ultra <span className="text-sm font-normal text-muted-foreground">- ₹500/mo</span></h3>
                <p className="text-sm text-muted-foreground">500 generations per week, priority support, early access</p>
              </div>
              <Button size="sm" disabled>Upgrade</Button>
            </div>
          </div>
        </div>

        {/* Current Usage Progress */}
        <div className="my-6 rounded-2xl border bg-muted/50 p-4">
          <div className="flex items-center justify-between text-sm font-medium mb-2">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Zap className="h-4 w-4 text-amber-500" />
              Weekly Usage
            </span>
            <span className={user.generationsUsed >= user.maxGenerations ? "text-destructive font-semibold" : "text-foreground font-semibold"}>
              {user.generationsUsed} / {user.maxGenerations}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full transition-all duration-500 ${user.generationsUsed >= user.maxGenerations ? 'bg-destructive' : 'bg-primary'}`}
              style={{ width: `${Math.min(100, (user.generationsUsed / user.maxGenerations) * 100)}%` }}
            />
          </div>
          {user.generationsUsed >= user.maxGenerations && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-destructive font-medium">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Weekly limit reached. Upgrade to continue creating!</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setShowUpgradeModal(false)}
            className="w-full h-10 rounded-xl text-muted-foreground hover:text-foreground"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
