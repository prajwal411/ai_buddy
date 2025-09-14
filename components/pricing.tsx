"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

type Feature = { text: string; muted?: boolean }

const ACCENT = "#C6FF3A"

function FeatureItem({ text, muted = false }: Feature) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: ACCENT }} />
      <span className={`text-sm ${muted ? "text-neutral-500" : "text-neutral-200"}`}>{text}</span>
    </li>
  )
}

type Currency = "INR" | "USD"

const PRICES: Record<Currency, { startup: string; pro: string; premium: string; save: string }> = {
  INR: {
    startup: "₹25,000/-",
    pro: "₹55,000/-",
    premium: "₹1,70,500/-",
    save: "Save Flat ₹1,500/-",
  },
  USD: {
    startup: "$299",
    pro: "$699",
    premium: "$2,049",
    save: "$20",
  },
}

function guessLocalCurrency(): Currency {
  const lang = typeof navigator !== "undefined" ? navigator.language : ""
  const tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : ""
  if (/-(IN|PK|BD)\b/i.test(lang) || /(Kolkata|Karachi|Dhaka)/i.test(tz || "")) return "INR"
  return "USD"
}

const startupExamples = [
  { title: "Product Launch Animation", description: "15s teaser for tech startup" },
  { title: "Brand Reveal", description: "Logo animation with 3D effects" },
  { title: "Social Media Reel", description: "Instagram-ready product showcase" },
]

const proExamples = [
  { title: "Campaign Animation", description: "25s brand story with motion graphics" },
  { title: "Product Demo", description: "Professional 3D product walkthrough" },
  { title: "Commercial Spot", description: "High-impact advertising animation" },
]

const premiumExamples = [
  { title: "Full Campaign Suite", description: "40s cinematic brand experience" },
  { title: "Multi-Product Showcase", description: "Complex 3D environment with 5 SKUs" },
  { title: "Award-Winning Animation", description: "Premium storytelling with advanced effects" },
]

export function Pricing() {
  const [openPlan, setOpenPlan] = useState<null | "Startup" | "Pro" | "Premium">(null)
  const [currency, setCurrency] = useState<Currency>("USD")

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch("/api/geo", { cache: "no-store" })
        if (!res.ok) throw new Error("geo failed")
        const data = await res.json()
        if (!cancelled) setCurrency(data?.currency === "INR" ? "INR" : "USD")
      } catch {
        if (!cancelled) setCurrency(guessLocalCurrency())
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const getExamples = (plan: "Startup" | "Pro" | "Premium") => {
    switch (plan) {
      case "Startup":
        return startupExamples
      case "Pro":
        return proExamples
      case "Premium":
        return premiumExamples
      default:
        return []
    }
  }

  return null; // Pricing section removed as requested.
}
