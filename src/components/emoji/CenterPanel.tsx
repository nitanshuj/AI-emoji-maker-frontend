"use client"

import React, { useState } from "react"
import { useApp } from "@/context/AppContext"
import { EmojiItem, StyleType } from "@/types/emoji"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Sparkles, Download, RefreshCw, Trash2, Eye, Grid } from "lucide-react"

export function CenterPanel() {
  const {
    emojis,
    selectedEmoji,
    selectEmoji,
    remixEmoji,
    toggleFavorite,
    deleteEmoji,
    isGenerating,
  } = useApp()

  const [filterTab, setFilterTab] = useState<string>("all")

  // Filter emojis based on active tab
  const filteredEmojis = emojis.filter((item) => {
    if (filterTab === "all") return true
    if (filterTab === "favorites") return item.isFavorite
    return item.style.toLowerCase() === filterTab.toLowerCase()
  })

  const handleDownloadSingle = (emoji: EmojiItem) => {
    try {
      const svgBlob = new Blob([emoji.svgContent], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)
      const downloadLink = document.createElement("a")
      downloadLink.href = svgUrl
      downloadLink.download = `work-emoji-${emoji.style.toLowerCase()}-${emoji.mood.toLowerCase()}.svg`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(svgUrl)
    } catch (e) {
      console.error("Single download error", e)
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-sm transition-all sm:p-6 h-full min-h-[500px]">
      
      {/* Panel Header & Tabs */}
      <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Grid className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Generated Gallery
            </h2>
            <p className="text-xs text-muted-foreground">
              {filteredEmojis.length} {filteredEmojis.length === 1 ? 'emoji' : 'emojis'} available
            </p>
          </div>
        </div>

        <Tabs value={filterTab} onValueChange={setFilterTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3 h-9 w-full sm:w-auto">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs flex items-center gap-1">
              <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> Favorites
            </TabsTrigger>
            <TabsTrigger value="sticker" className="text-xs">Stickers</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Grid Content / Skeletons / Empty State */}
      <div className="flex-1 overflow-y-auto pr-1">
        
        {/* Loading Skeleton during generation */}
        {isGenerating && (
          <div className="mb-4 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 animate-pulse">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Sparkles className="h-7 w-7 animate-bounce" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">Crafting Workplace Emoji...</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Assembling vectors, optimizing color harmony, and adding that special coffee boost!
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isGenerating && filteredEmojis.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center bg-muted/20 my-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">No Emojis Found</h3>
            <p className="text-xs text-muted-foreground max-w-xs mb-6">
              {filterTab === "favorites" 
                ? "You haven't added any emojis to your favorites yet. Click the heart icon on any card!"
                : "Your gallery is currently empty. Use the prompt studio on the left to create your first custom work emoji!"}
            </p>
            {filterTab !== "all" && (
              <Button variant="outline" size="sm" onClick={() => setFilterTab("all")} className="h-8 rounded-lg text-xs">
                View All Emojis
              </Button>
            )}
          </div>
        )}

        {/* Emojis Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredEmojis.map((emoji) => {
            const isSelected = selectedEmoji?.id === emoji.id

            return (
              <div
                key={emoji.id}
                onClick={() => selectEmoji(emoji.id)}
                className={`group relative flex flex-col rounded-2xl border bg-card p-4 transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-primary border-transparent bg-primary/5 shadow-sm"
                    : "border hover:border-foreground/20"
                }`}
              >
                
                {/* SVG Visual Display */}
                <div 
                  className="relative mb-3 flex h-36 w-full items-center justify-center rounded-xl overflow-hidden transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundColor: emoji.bgColor }}
                >
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-[10px] px-2 py-0.5 font-bold shadow-xs">
                      {emoji.style}
                    </Badge>
                  </div>

                  {/* Favorite Button top right */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(emoji.id)
                    }}
                    className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground shadow-xs transition-colors hover:text-rose-500 hover:bg-background"
                    title={emoji.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={`h-4 w-4 transition-transform ${emoji.isFavorite ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
                  </button>

                  {emoji.imageUrl ? (
                    <img 
                      src={emoji.imageUrl} 
                      alt={emoji.prompt} 
                      className="h-28 w-28 object-contain drop-shadow-md pointer-events-none" 
                      crossOrigin="anonymous" 
                    />
                  ) : (
                    <div 
                      className="h-28 w-28 p-2 pointer-events-none"
                      dangerouslySetInnerHTML={{ __html: emoji.svgContent }}
                    />
                  )}
                </div>

                {/* Info & Metadata */}
                <div className="mb-3 flex-1">
                  <p className="text-xs font-semibold text-foreground line-clamp-2 leading-relaxed mb-1" title={emoji.prompt}>
                    {emoji.prompt}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span>Mood: <strong className="text-foreground">{emoji.mood}</strong></span>
                  </div>
                </div>

                {/* Quick Action Footer */}
                <div className="flex items-center justify-between border-t pt-3 mt-auto">
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      remixEmoji(emoji)
                    }}
                    className="h-8 px-2.5 text-xs rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 gap-1.5 font-medium"
                    title="Load prompt &amp; style into generator"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Remix</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownloadSingle(emoji)
                      }}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
                      title="Quick SVG Download"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteEmoji(emoji.id)
                      }}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Emoji"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                </div>

              </div>
            )
          })}
        </div>

      </div>

    </div>
  )
}
