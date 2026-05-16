"use client"

import React from "react"
import { useApp } from "@/context/AppContext"
import { StyleType, MoodType } from "@/types/emoji"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, Wand2, Palette, SmilePlus, HelpCircle } from "lucide-react"

const STYLES: StyleType[] = ["Flat", "Sticker", "Doodle", "Pixel", "Mascot"]
const MOODS: MoodType[] = ["Happy", "Tired", "Confused", "Celebrate"]

const SIZES = [
  { label: "128px", value: 128 },
  { label: "256px", value: 256 },
  { label: "512px", value: 512 },
]

const QUICK_PROMPTS = [
  "Coffee mug before morning standup",
  "Cat wearing headset answering slack calls",
  "Confused laptop debugging production error",
  "Rocket launch on deployment day",
  "Lightbulb brilliant sprint idea",
]

export function LeftPanel() {
  const {
    activePrompt,
    setActivePrompt,
    activeStyle,
    setActiveStyle,
    activeMood,
    setActiveMood,
    activeSize,
    setActiveSize,
    generateEmoji,
    isGenerating,
    user,
    setShowUpgradeModal
  } = useApp()

  const handleGenerate = () => {
    generateEmoji(activePrompt, activeStyle, activeMood, activeSize)
  }

  const handleQuickPrompt = (promptText: string) => {
    setActivePrompt(promptText)
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-card p-5 shadow-sm transition-all sm:p-6 h-full">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wand2 className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Studio Generator
          </h2>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          Step 1 of 3
        </span>
      </div>

      {/* Prompt Textarea */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label htmlFor="prompt-input" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            Describe your work emoji
          </label>
          <span className="text-[11px] text-muted-foreground">e.g. coffee, bug, meeting</span>
        </div>
        <Textarea
          id="prompt-input"
          placeholder="e.g., A happy steaming coffee cup during early morning standup call..."
          value={activePrompt}
          onChange={(e) => setActivePrompt(e.target.value)}
          className="min-h-[120px] resize-none text-sm p-3 rounded-xl border bg-muted/30 focus-visible:ring-primary shadow-inner"
        />

        {/* Quick Prompts Chips */}
        <div className="pt-1">
          <p className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <HelpCircle className="h-3 w-3" /> Quick suggestions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(p)}
                className="rounded-full bg-secondary/80 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary transition-colors truncate max-w-[220px]"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-2.5 pt-2 border-t">
        <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Palette className="h-4 w-4 text-primary" />
          Image Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => (
            <button
              key={size.value}
              type="button"
              onClick={() => setActiveSize(size.value)}
              className={`flex flex-col items-center justify-center rounded-xl border p-2.5 transition-all ${
                activeSize === size.value
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary"
                  : "border text-muted-foreground hover:border-foreground/20 hover:bg-secondary/40 font-medium"
              }`}
            >
              <span className="text-xs">{size.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Style Chips */}
      <div className="space-y-2.5 pt-2 border-t">
        <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Palette className="h-4 w-4 text-primary" />
          Art Style
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {STYLES.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setActiveStyle(style)}
              className={`flex flex-col items-center justify-center rounded-xl border p-2.5 transition-all ${
                activeStyle === style
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary"
                  : "border text-muted-foreground hover:border-foreground/20 hover:bg-secondary/40 font-medium"
              }`}
            >
              <span className="text-xs">{style}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mood Chips */}
      <div className="space-y-2.5 pt-2 border-t">
        <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <SmilePlus className="h-4 w-4 text-amber-500" />
          Mood
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MOODS.map((mood) => {
            let moodEmoji = "😊"
            if (mood === "Tired") moodEmoji = "☕"
            else if (mood === "Confused") moodEmoji = "🤔"
            else if (mood === "Celebrate") moodEmoji = "🚀"

            return (
              <button
                key={mood}
                type="button"
                onClick={() => setActiveMood(mood)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all ${
                  activeMood === mood
                    ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold shadow-sm ring-1 ring-amber-500"
                    : "border text-muted-foreground hover:border-foreground/20 hover:bg-secondary/40 font-medium"
                }`}
              >
                <span className="text-base">{moodEmoji}</span>
                <span className="text-xs">{mood}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Primary Generate Button */}
      <div className="pt-4 border-t mt-auto">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !activePrompt.trim()}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 text-base"
        >
          {isGenerating ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Crafting Emoji...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Generate Emoji</span>
            </>
          )}
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          {user.generationsUsed >= user.maxGenerations ? (
            <span className="text-destructive font-semibold cursor-pointer" onClick={() => setShowUpgradeModal(true)}>
              Generation limit reached. Click here to upgrade!
            </span>
          ) : (
            <span>You have {user.maxGenerations - user.generationsUsed} free generations remaining today.</span>
          )}
        </p>
      </div>

    </div>
  )
}
