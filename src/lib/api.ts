import { MoodType, StyleType } from "@/types/emoji"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export interface AuthAPIResponse {
  access_token: string
  token_type: string
  user: {
    id: string
    email: string
    full_name?: string
  }
}

export interface GenerateAPIResponse {
  id: string
  user_id: string
  original_prompt: string
  final_prompt: string
  image_url: string
  image_size: string
  style: StyleType
  mood: MoodType
  created_at: string
}

export interface HistoryAPIResponse {
  generations: GenerateAPIResponse[]
}

export const API = {
  /**
   * Register a new account on the FastAPI backend
   */
  async signup(email: string, password: string): Promise<AuthAPIResponse> {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || "Failed to register account")
    }

    return res.json()
  },

  /**
   * Authenticate with the FastAPI backend
   */
  async login(email: string, password: string): Promise<AuthAPIResponse> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || "Invalid login credentials")
    }

    return res.json()
  },

  /**
   * Generate an emoji/sticker image via FastAPI and AIMLAPI
   */
  async generateEmoji(
    prompt: string,
    style: StyleType,
    mood: MoodType,
    token: string,
    width: number = 128,
    height: number = 128
  ): Promise<GenerateAPIResponse> {
    const res = await fetch(`${BASE_URL}/emoji/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ prompt, style, mood, width, height })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || "Failed to generate emoji via backend")
    }

    return res.json()
  },

  /**
   * Get generation history for the authenticated user
   */
  async getHistory(token: string): Promise<GenerateAPIResponse[]> {
    const res = await fetch(`${BASE_URL}/emoji/history`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error("Failed to load generation history")
    }

    const data: HistoryAPIResponse = await res.json()
    return data.generations || []
  }
}
