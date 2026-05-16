"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Always start with defaults so SSR and the initial client render match.
  // localStorage is loaded in a useEffect after hydration (see below).
  const [user, setUser] = useState<UserState>(defaultUser);
  const [emojis, setEmojis] = useState<EmojiItem[]>(SAMPLE_EMOJIS);
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiItem | null>(SAMPLE_EMOJIS[0] ?? null);
  
  const [filter, setFilter] = useState<string>("all");
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [activePrompt, setActivePrompt] = useState<string>("");
  const [activeStyle, setActiveStyle] = useState<StyleType>("Sticker");
  const [activeMood, setActiveMood] = useState<MoodType>("Happy");
  const [activeSize, setActiveSize] = useState<number>(128);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("emoji_user");
      localStorage.removeItem("emoji_items");
    } catch (e) {
      console.error("Failed to clear local storage on logout", e);
    }
    window.location.href = "/";
  }, []);

  const syncBackendData = useCallback(async (token: string) => {
    try {
      const [profile, history] = await Promise.all([
        API.getProfile(token),
        API.getHistory(token),
      ]);

      if (profile) {
        setUser((prev) => {
          const updatedUser = {
            ...prev,
            plan: profile.plan_type,
            generationsUsed: profile.generations_used,
            maxGenerations: profile.max_generations,
            name: profile.full_name || prev.name,
          };
          localStorage.setItem("emoji_user", JSON.stringify(updatedUser));
          return updatedUser;
        });
      }

      if (history && history.length > 0) {
        const backendItems: EmojiItem[] = history.map((rec) => {
          const art = generateEmojiSvg(rec.original_prompt, rec.style, rec.mood);
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
            userId: rec.user_id,
          };
        });

        setEmojis((prev) => {
          const map = new Map<string, EmojiItem>();
          backendItems.forEach((it) => map.set(it.id, it));
          prev.forEach((it) => {
            if (!map.has(it.id)) map.set(it.id, it);
          });
          const merged = Array.from(map.values());
          localStorage.setItem("emoji_items", JSON.stringify(merged));
          return merged;
        });
      }
    } catch (err: any) {
      // Log the sync error but do NOT auto-logout — a background sync failure
      // (e.g. temporary network issue) should not destroy the user session.
      console.error("Failed to synchronize backend data", err);
    }
  }, []);

  // Hydrate user + emoji state from localStorage after the first paint.
  // Running this in useEffect guarantees the server and client initial renders
  // are identical (both use the defaults above), preventing hydration mismatches.
  useEffect(() => {
    try {
      const storedUserStr = localStorage.getItem("emoji_user");
      if (storedUserStr) {
        const parsed: UserState = JSON.parse(storedUserStr);
        setUser(parsed);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }

    try {
      const storedEmojis = localStorage.getItem("emoji_items");
      if (storedEmojis) {
        const parsed: EmojiItem[] = JSON.parse(storedEmojis);
        setEmojis(parsed);
        setSelectedEmoji(parsed[0] ?? null);
      }
    } catch (e) {
      console.error("Failed to parse emojis from localStorage", e);
    }
  }, []);

  // Sync backend data whenever the user is authenticated.
  useEffect(() => {
    if (user.isAuthenticated && user.accessToken) {
      syncBackendData(user.accessToken);
    }
  }, [user.isAuthenticated, user.accessToken, syncBackendData]);

  const saveUser = (newUser: UserState) => {
    setUser(newUser);
    try {
      localStorage.setItem("emoji_user", JSON.stringify(newUser));
    } catch (e) {
      console.error("Failed to save user", e);
    }
  };

  const saveEmojis = (newEmojis: EmojiItem[]) => {
    setEmojis(newEmojis);
    try {
      localStorage.setItem("emoji_items", JSON.stringify(newEmojis));
    } catch (e) {
      console.error("Failed to save emojis", e);
    }
  };

  const login = (email: string, name?: string, token?: string, id?: string) => {
    const displayName = name || email.split("@")[0] || "User";
    const loggedInUser: UserState = {
      ...user,
      isAuthenticated: true,
      email,
      name: displayName,
      accessToken: token,
      id: id,
    };
    saveUser(loggedInUser);
    if (token) {
      syncBackendData(token);
    }
  };

  const upgradePlan = () => {
    // This function can be expanded to call a backend endpoint to upgrade the plan
    // For now, it optimistically updates the UI and relies on the next full sync
    // to confirm the plan change from the backend.
    const upgradedUser: UserState = {
      ...user,
      plan: "Premium", // Optimistically update to Premium
      maxGenerations: 100, // Optimistically update
    };
    saveUser(upgradedUser);
    setShowUpgradeModal(false);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.error("Confetti error", e);
    }
  };

  const selectEmoji = (id: string) => {
    const item = emojis.find((e) => e.id === id)
    if (item) {
      setSelectedEmoji(item)
    }
  }

  const generateEmoji = async (prompt: string, style: StyleType, mood: MoodType, size: number): Promise<boolean> => {
    if (user.generationsUsed >= user.maxGenerations) {
      setShowUpgradeModal(true)
      return false
    }

    setIsGenerating(true)
    try {
      // If authenticated, use the backend API (real image generation)
      if (user.accessToken) {
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

        const updatedUser = { ...user, generationsUsed: user.generationsUsed + 1 };
        saveUser(updatedUser);

        return true;
      } else {
        // Guest/unauthenticated: fall back to local SVG generation
        const art = generateEmojiSvg(prompt, style, mood)
        const guestEmoji: EmojiItem = {
          id: `local-${Date.now()}`,
          prompt,
          style,
          mood,
          svgContent: art.svg,
          isFavorite: false,
          createdAt: new Date().toISOString(),
          bgColor: art.bgColor,
        }

        const updatedEmojis = [guestEmoji, ...emojis]
        saveEmojis(updatedEmojis)
        selectEmoji(guestEmoji.id)

        const updatedUser = { ...user, generationsUsed: user.generationsUsed + 1 };
        saveUser(updatedUser);

        return true;
      }
    } catch (error: any) {
      console.error("Failed to generate emoji:", error);
      alert(`Error generating emoji: ${error.message}`);
      return false;
    } finally {
      setIsGenerating(false);
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
