"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { EmojiItem, MoodType, PlanType, StyleType, UserState } from "@/types/emoji"
import { generateEmojiSvg, SAMPLE_EMOJIS } from "@/lib/emojiGenerator"
import { API } from "@/lib/api"
import confetti from "canvas-confetti"

interface AppContextType {
  user: UserState
  login: (email: string, name?: string, token?: string, id?: string) => void
  logout: () => void
  upgradePlan: () => void
  emojis: EmojiItem[]
  selectedEmoji: EmojiItem | null
  selectEmoji: (id: string) => void
  generateEmoji: (prompt: string, style: StyleType, mood: MoodType, size: number) => Promise<boolean>
  remixEmoji: (emoji: EmojiItem) => void
  toggleFavorite: (id: string) => void
  deleteEmoji: (id: string) => void
  filter: string
  setFilter: (filter: string) => void
  showUpgradeModal: boolean
  setShowUpgradeModal: (show: boolean) => void
  activePrompt: string
  setActivePrompt: (prompt: string) => void
  activeStyle: StyleType
  setActiveStyle: (style: StyleType) => void
  activeMood: MoodType
  setActiveMood: (mood: MoodType) => void
  activeSize: number
  setActiveSize: (size: number) => void
  isGenerating: boolean
}

const defaultUser: UserState = {
  isAuthenticated: false,
  email: "",
  name: "Alex Patel",
  plan: "Free",
  generationsUsed: 1,
  maxGenerations: 2,
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserState>(defaultUser)
  const [emojis, setEmojis] = useState<EmojiItem[]>(SAMPLE_EMOJIS)
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiItem | null>(SAMPLE_EMOJIS[0])
  const [filter, setFilter] = useState<string>("all")
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false)
  const [activePrompt, setActivePrompt] = useState<string>("")
  const [activeStyle, setActiveStyle] = useState<StyleType>("Sticker")
  const [activeMood, setActiveMood] = useState<MoodType>("Happy")
  const [activeSize, setActiveSize] = useState<number>(128)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  // Load state from localStorage on client mount & fetch history if authenticated
  useEffect(() => {
    try {
      const storedUserStr = localStorage.getItem("emoji_user")
      let currentUser = defaultUser

      if (storedUserStr) {
        currentUser = JSON.parse(storedUserStr)
        setUser(currentUser)
      } else {
        const initialUser: UserState = {
          isAuthenticated: true,
          email: "alex.patel@acmecorp.com",
          name: "Alex Patel",
          plan: "Free",
          generationsUsed: 1,
          maxGenerations: 2,
        }
        setUser(initialUser)
        localStorage.setItem("emoji_user", JSON.stringify(initialUser))
        currentUser = initialUser
      }

      const storedEmojis = localStorage.getItem("emoji_items")
      if (storedEmojis) {
        const parsed = JSON.parse(storedEmojis)
        if (parsed.length > 0) {
          setEmojis(parsed)
          setSelectedEmoji(parsed[0])
        }
      }

      // If user has access token, synchronize history from backend
      if (currentUser.isAuthenticated && currentUser.accessToken) {
        loadBackendHistory(currentUser.accessToken)
      }
    } catch (e) {
      console.error("Failed to load local state", e)
    }
  }, [])

  const loadBackendHistory = async (token: string) => {
    try {
      const history = await API.getHistory(token)
      if (history && history.length > 0) {
        // Map backend history records to EmojiItem format
        const backendItems: EmojiItem[] = history.map((rec) => {
          const art = generateEmojiSvg(rec.original_prompt, rec.style, rec.mood)
          return {
            id: rec.id,
            prompt: rec.original_prompt,
            finalPrompt: rec.final_prompt,
            style: rec.style,
            mood: rec.mood,
            svgContent: art.svg,
            imageUrl: rec.image_url,
            isFavorite: false,
            createdAt: rec.created_at,
            bgColor: art.bgColor,
            userId: rec.user_id
          }
        })

        setEmojis((prev) => {
          const map = new Map<string, EmojiItem>()
          backendItems.forEach((it) => map.set(it.id, it))
          prev.forEach((it) => {
            if (!map.has(it.id)) map.set(it.id, it)
          })
          const merged = Array.from(map.values())
          localStorage.setItem("emoji_items", JSON.stringify(merged))
          return merged
        })
      }
    } catch (err) {
      console.error("Failed to fetch backend history", err)
    }
  }

  const saveUser = (newUser: UserState) => {
    setUser(newUser)
    try {
      localStorage.setItem("emoji_user", JSON.stringify(newUser))
    } catch (e) {
      console.error("Failed to save user", e)
    }
  }

  const saveEmojis = (newEmojis: EmojiItem[]) => {
    setEmojis(newEmojis)
    try {
      localStorage.setItem("emoji_items", JSON.stringify(newEmojis))
    } catch (e) {
      console.error("Failed to save emojis", e)
    }
  }

  const login = (email: string, name?: string, token?: string, id?: string) => {
    const displayName = name || email.split("@")[0] || "User"
    const loggedInUser: UserState = {
      ...user,
      isAuthenticated: true,
      email,
      name: displayName,
      accessToken: token || user.accessToken,
      id: id || user.id
    }
    saveUser(loggedInUser)
    if (token) {
      loadBackendHistory(token)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem("emoji_user")
      localStorage.removeItem("work_emoji_items")
    } catch (e) {
      console.error("Failed to clear local storage on logout", e)
    }
    // Redirect to home and force a reload to clear all state.
    window.location.href = "/"
  }

  const upgradePlan = () => {
    const upgradedUser: UserState = {
      ...user,
      plan: "Premium",
      maxGenerations: 10,
    }
    saveUser(upgradedUser)
    setShowUpgradeModal(false)

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } catch (e) {
      console.error("Confetti error", e)
    }
  }

  const selectEmoji = (id: string) => {
    const item = emojis.find((e) => e.id === id)
    if (item) {
      setSelectedEmoji(item)
    }
  }

  const generateEmoji = async (prompt: string, style: StyleType, mood: MoodType, size: number): Promise<boolean> => {
    if (!user.accessToken) {
      console.error("Cannot generate: user is not authenticated.");
      return false;
    }
    if (user.generationsUsed >= user.maxGenerations) {
      setShowUpgradeModal(true)
      return false
    }

    setIsGenerating(true)
    try {
      const newEmojiData = await API.generateEmoji(prompt, style, mood, user.accessToken, size, size)
      
      const art = generateEmojiSvg(newEmojiData.original_prompt, newEmojiData.style, newEmojiData.mood)
      const newEmoji: EmojiItem = {
        id: newEmojiData.id,
        prompt: newEmojiData.original_prompt,
        finalPrompt: newEmojiData.final_prompt,
        style: newEmojiData.style,
        mood: newEmojiData.mood,
        svgContent: art.svg,
        imageUrl: newEmojiData.image_url,
        isFavorite: false,
        createdAt: newEmojiData.created_at,
        bgColor: art.bgColor,
        userId: newEmojiData.user_id
      }

      const updatedEmojis = [newEmoji, ...emojis]
      saveEmojis(updatedEmojis)
      selectEmoji(newEmoji.id)

      const updatedUser = { ...user, generationsUsed: user.generationsUsed + 1 }
      saveUser(updatedUser)

      return true
    } catch (error) {
      console.error("Failed to generate emoji:", error)
      // Here you might want to show a toast notification to the user
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  const remixEmoji = (emoji: EmojiItem) => {
    setActivePrompt(emoji.prompt)
    setActiveStyle(emoji.style)
    setActiveMood(emoji.mood)
  }

  const toggleFavorite = (id: string) => {
    const updated = emojis.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    )
    saveEmojis(updated)
    if (selectedEmoji?.id === id) {
      setSelectedEmoji(updated.find((e) => e.id === id) || null)
    }
  }

  const deleteEmoji = (id: string) => {
    const updated = emojis.filter((item) => item.id !== id)
    saveEmojis(updated)
    if (selectedEmoji?.id === id) {
      setSelectedEmoji(updated.length > 0 ? updated[0] : null)
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        upgradePlan,
        emojis,
        selectedEmoji,
        selectEmoji,
        generateEmoji,
        remixEmoji,
        toggleFavorite,
        deleteEmoji,
        filter,
        setFilter,
        showUpgradeModal,
        setShowUpgradeModal,
        activePrompt,
        setActivePrompt,
        activeStyle,
        setActiveStyle,
        activeMood,
        setActiveMood,
        activeSize,
        setActiveSize,
        isGenerating,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
