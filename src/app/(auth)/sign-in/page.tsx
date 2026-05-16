import React from "react"
import { SignInForm } from "@/components/auth/SignInForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In — Work Emoji Generator",
  description: "Sign into your Work Emoji Generator account to access custom emojis, favorites, and premium exports.",
}

export default function SignInPage() {
  return <SignInForm />
}
