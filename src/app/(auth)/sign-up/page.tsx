import React from "react"
import { SignUpForm } from "@/components/auth/SignUpForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up — Work Emoji Generator",
  description: "Create your free Work Emoji Generator account to start generating custom workplace reactions.",
}

export default function SignUpPage() {
  return <SignUpForm />
}
