"use client"

import React, { useState } from "react"
import { useApp } from "@/context/AppContext"
import { EmojiItem } from "@/types/emoji"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileArchive, Sliders, Check, EyeOff, Sparkles, RefreshCw, Layers } from "lucide-react"
import JSZip from "jszip"

const EXPORT_SIZES = [
  { label: "400px", size: 400, desc: "Ultra HD" },
  { label: "128px", size: 128, desc: "Slack / Teams" },
  { label: "72px", size: 72, desc: "Discord / Icon" },
  { label: "32px", size: 32, desc: "Favicon / Micro" },
]

export function RightPanel() {
  const { selectedEmoji, remixEmoji, toggleFavorite } = useApp()
  const [selectedSize, setSelectedSize] = useState<number>(128)
  const [isTransparent, setIsTransparent] = useState<boolean>(true)
  const [isExporting, setIsExporting] = useState<boolean>(false)

  if (!selectedEmoji) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center shadow-sm h-full min-h-[400px]">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Sliders className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">Preview &amp; Export</h3>
        <p className="text-xs text-muted-foreground max-w-xs">
          Select an emoji from the center gallery or generate a new one to unlock multi-resolution downloads and ZIP bundles.
        </p>
      </div>
    )
  }

  // Convert SVG/Image to PNG data url using Canvas
  const renderItemToCanvas = (emoji: EmojiItem, size: number, transparent: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      let url = ""
      if (emoji.imageUrl) {
        url = emoji.imageUrl
      } else {
        const blob = new Blob([emoji.svgContent], { type: "image/svg+xml;charset=utf-8" })
        url = URL.createObjectURL(blob)
      }

      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        if (ctx) {
          if (!transparent) {
            ctx.fillStyle = emoji.bgColor
            ctx.fillRect(0, 0, size, size)
          }
          ctx.drawImage(img, 0, 0, size, size)
          resolve(canvas.toDataURL("image/png"))
        } else {
          reject("No canvas context")
        }
        if (!emoji.imageUrl) URL.revokeObjectURL(url)
      }
      img.onerror = () => {
        reject("Image load error")
        if (!emoji.imageUrl) URL.revokeObjectURL(url)
      }
      img.src = url
    })
  }

  const handleDownloadPng = async () => {
    if (!selectedEmoji) return
    setIsExporting(true)
    try {
      const dataUrl = await renderItemToCanvas(selectedEmoji, selectedSize, isTransparent)
      const downloadLink = document.createElement("a")
      downloadLink.href = dataUrl
      downloadLink.download = `work-emoji-${selectedEmoji.style.toLowerCase()}-${selectedSize}x${selectedSize}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } catch (e) {
      console.error("Export PNG error", e)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadZip = async () => {
    if (!selectedEmoji) return
    setIsExporting(true)
    try {
      const zip = new JSZip()
      const folder = zip.folder(`work-emoji-${selectedEmoji.style.toLowerCase()}`)

      for (const item of EXPORT_SIZES) {
        const dataUrl = await renderItemToCanvas(selectedEmoji, item.size, isTransparent)
        const base64Data = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "")
        folder?.file(`emoji-${selectedEmoji.style.toLowerCase()}-${item.size}x${item.size}.png`, base64Data, { base64: true })
      }

      // Add original prompt / metadata matching database schema
      folder?.file(`metadata.json`, JSON.stringify({
        id: selectedEmoji.id,
        prompt: selectedEmoji.prompt,
        finalPrompt: selectedEmoji.finalPrompt || selectedEmoji.prompt,
        style: selectedEmoji.style,
        mood: selectedEmoji.mood,
        createdAt: selectedEmoji.createdAt
      }, null, 2))

      if (!selectedEmoji.imageUrl) {
        folder?.file(`emoji-original-vector.svg`, selectedEmoji.svgContent)
      }

      const content = await zip.generateAsync({ type: "blob" })
      const zipUrl = URL.createObjectURL(content)
      const downloadLink = document.createElement("a")
      downloadLink.href = zipUrl
      downloadLink.download = `work-emoji-${selectedEmoji.style.toLowerCase()}-bundle.zip`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(zipUrl)
    } catch (e) {
      console.error("ZIP Export error", e)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-card p-5 shadow-sm transition-all sm:p-6 h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Sliders className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Inspector &amp; Export
          </h2>
        </div>
        <Badge variant="outline" className="text-xs font-semibold">
          {selectedEmoji.style} Art
        </Badge>
      </div>

      {/* Selected Preview Area */}
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/30 p-6 relative overflow-hidden group">
        
        {/* Background texture indicator */}
        <div 
          className={`absolute inset-0 transition-colors duration-300 ${isTransparent ? "bg-grid-pattern opacity-10" : ""}`} 
          style={!isTransparent ? { backgroundColor: selectedEmoji.bgColor } : undefined}
        />

        <div className="relative z-10 my-4 flex h-40 w-40 items-center justify-center drop-shadow-xl transition-transform duration-300 group-hover:scale-105">
          {selectedEmoji.imageUrl ? (
            <img 
              src={selectedEmoji.imageUrl} 
              alt={selectedEmoji.prompt} 
              className="h-full w-full object-contain pointer-events-none" 
              crossOrigin="anonymous" 
            />
          ) : (
            <div 
              className="h-full w-full p-2"
              dangerouslySetInnerHTML={{ __html: selectedEmoji.svgContent }}
            />
          )}
        </div>

        {/* Action overlay chips */}
        <div className="relative z-10 mt-2 flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => remixEmoji(selectedEmoji)}
            className="h-8 rounded-full text-xs font-semibold shadow-sm gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Remix
          </Button>
          <Button
            variant={selectedEmoji.isFavorite ? "default" : "secondary"}
            size="sm"
            onClick={() => toggleFavorite(selectedEmoji.id)}
            className="h-8 rounded-full text-xs font-semibold shadow-sm"
          >
            {selectedEmoji.isFavorite ? "★ Favorited" : "☆ Add Favorite"}
          </Button>
        </div>
      </div>

      {/* AI Optimized Prompt Display from Database */}
      {selectedEmoji.finalPrompt && (
        <div className="rounded-xl border bg-muted/40 p-3.5 space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Optimized Prompt
            </span>
            <Badge variant="secondary" className="text-[10px]">FLUX.1 Schnell</Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-h-24 overflow-y-auto pr-1">
            {selectedEmoji.finalPrompt}
          </p>
        </div>
      )}

      {/* Transparent Background Toggle */}
      <div className="flex items-center justify-between rounded-xl border p-3.5 bg-muted/20">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isTransparent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <label htmlFor="trans-toggle" className="text-sm font-semibold text-foreground cursor-pointer">
              Transparent Background
            </label>
            <p className="text-[11px] text-muted-foreground">Perfect for Slack &amp; Teams reactions</p>
          </div>
        </div>

        <button
          id="trans-toggle"
          type="button"
          onClick={() => setIsTransparent(!isTransparent)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            isTransparent ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isTransparent ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Export Size Options */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground flex items-center justify-between">
          <span>Export Resolution</span>
          <span className="text-xs text-primary font-bold">{selectedSize}x{selectedSize} PNG</span>
        </label>
        
        <div className="grid grid-cols-2 gap-2.5">
          {EXPORT_SIZES.map((item) => (
            <button
              key={item.size}
              type="button"
              onClick={() => setSelectedSize(item.size)}
              className={`flex flex-col items-start justify-center rounded-xl border p-3 transition-all text-left ${
                selectedSize === item.size
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary"
                  : "border text-muted-foreground hover:border-foreground/20 hover:bg-secondary/40 font-medium"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-sm font-bold text-foreground">{item.label}</span>
                {selectedSize === item.size && <Check className="h-4 w-4 text-primary" />}
              </div>
              <span className="text-[11px] text-muted-foreground">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="space-y-3 pt-4 border-t mt-auto">
        <Button
          onClick={handleDownloadPng}
          disabled={isExporting}
          className="w-full h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 text-base"
        >
          <Download className="h-5 w-5" />
          <span>Download {selectedSize}px PNG</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleDownloadZip}
          disabled={isExporting}
          className="w-full h-12 rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/10 font-bold transition-all flex items-center justify-center gap-2 text-base"
        >
          <FileArchive className="h-5 w-5 text-purple-600" />
          <span>Download ZIP Package (All 4 Sizes)</span>
        </Button>
      </div>

    </div>
  )
}
