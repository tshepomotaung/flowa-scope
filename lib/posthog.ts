"use client"
import posthog from "posthog-js"

let initialised = false

export function initPostHog() {
  if (typeof window === "undefined" || initialised) return
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: true,
    person_profiles: "never",
    ip: false,
  })
  initialised = true
}

export function captureEvent(event: string, props?: Record<string, unknown>) {
  if (typeof window !== "undefined" && initialised) {
    posthog.capture(event, props)
  }
}
