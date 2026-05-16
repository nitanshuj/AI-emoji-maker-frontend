export type StyleType = "Flat" | "Sticker" | "Doodle" | "Pixel" | "Mascot"
export type MoodType = "Happy" | "Tired" | "Confused" | "Celebrate"
export type PlanType = "Free" | "Premium" | "Ultra"

export interface EmojiItem {
  id: string
  prompt: string
  finalPrompt?: string
  style: StyleType
  mood: MoodType
  svgContent: string
  imageUrl?: string
  isFavorite: boolean
  createdAt: string
  bgColor: string
  userId?: string
}

export interface UserState {
  isAuthenticated: boolean
  email: string
  name: string
  firstName?: string
  lastName?: string
  plan: PlanType
  generationsUsed: number
  maxGenerations: number
  accessToken?: string
  id?: string
}
