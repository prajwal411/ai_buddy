"use client"

import { useState, useCallback, useRef } from "react"

interface CrisisKeyword {
  word: string
  severity: "high" | "medium" | "low"
  category: "suicide" | "self-harm" | "depression" | "anxiety" | "substance"
}

const CRISIS_KEYWORDS: CrisisKeyword[] = [
  // High severity - immediate intervention
  { word: "suicide", severity: "high", category: "suicide" },
  { word: "kill myself", severity: "high", category: "suicide" },
  { word: "end it all", severity: "high", category: "suicide" },
  { word: "not worth living", severity: "high", category: "suicide" },
  { word: "better off dead", severity: "high", category: "suicide" },
  { word: "want to die", severity: "high", category: "suicide" },
  { word: "hurt myself", severity: "high", category: "self-harm" },
  { word: "cut myself", severity: "high", category: "self-harm" },

  // Medium severity - concern and support
  { word: "hopeless", severity: "medium", category: "depression" },
  { word: "worthless", severity: "medium", category: "depression" },
  { word: "can't go on", severity: "medium", category: "depression" },
  { word: "give up", severity: "medium", category: "depression" },
  { word: "panic attack", severity: "medium", category: "anxiety" },
  { word: "can't breathe", severity: "medium", category: "anxiety" },
  { word: "overdose", severity: "medium", category: "substance" },

  // Low severity - monitoring and gentle support
  { word: "depressed", severity: "low", category: "depression" },
  { word: "anxious", severity: "low", category: "anxiety" },
  { word: "overwhelmed", severity: "low", category: "anxiety" },
  { word: "stressed", severity: "low", category: "anxiety" },
  { word: "sad", severity: "low", category: "depression" },
  { word: "lonely", severity: "low", category: "depression" },
]

interface CrisisDetectionResult {
  detected: boolean
  severity: "high" | "medium" | "low" | null
  keywords: string[]
  categories: string[]
  message: string
  shouldShowResources: boolean
  shouldAlertModerator?: boolean
}

export function useCrisisDetection() {
  const [detectionHistory, setDetectionHistory] = useState<CrisisDetectionResult[]>([])
  const alertCooldown = useRef<Set<string>>(new Set())

  const analyzeText = useCallback((text: string): CrisisDetectionResult => {
    const lowerText = text.toLowerCase()
    const detectedKeywords: string[] = []
    const detectedCategories: string[] = []
    let highestSeverity: "high" | "medium" | "low" | null = null

    // Check for crisis keywords
    CRISIS_KEYWORDS.forEach(({ word, severity, category }) => {
      if (lowerText.includes(word)) {
        detectedKeywords.push(word)
        if (!detectedCategories.includes(category)) {
          detectedCategories.push(category)
        }

        // Update severity (high > medium > low)
        if (!highestSeverity || severity === "high" || (severity === "medium" && highestSeverity === "low")) {
          highestSeverity = severity
        }
      }
    })

    const detected = detectedKeywords.length > 0
    let message = ""
    let shouldShowResources = false
    let shouldAlertModerator = false

    if (detected) {
      switch (highestSeverity) {
        case "high":
          message =
            "I'm really concerned about what you've shared. Your life has value, and there are people who want to help. Please consider reaching out to a crisis helpline immediately."
          shouldShowResources = true
          shouldAlertModerator = true
          break
        case "medium":
          message =
            "I can hear that you're going through a difficult time. These feelings can be overwhelming, but support is available. Would you like me to share some resources that might help?"
          shouldShowResources = true
          break
        case "low":
          message =
            "I understand you're experiencing some challenging emotions. It's important to acknowledge these feelings. Remember that it's okay to seek support when you need it."
          shouldShowResources = false
          break
      }
    }

    const result: CrisisDetectionResult = {
      detected,
      severity: highestSeverity,
      keywords: detectedKeywords,
      categories: detectedCategories,
      message,
      shouldShowResources,
      shouldAlertModerator,
    }

    // Add to history
    setDetectionHistory((prev) => [...prev.slice(-9), result]) // Keep last 10 results

    return result
  }, [])

  const getRecommendedResponse = useCallback((result: CrisisDetectionResult): string => {
    if (!result.detected) return ""

    const responses = {
      high: [
        "I'm really concerned about what you've shared. Your life has value, and there are people who want to help. Please consider reaching out to a crisis helpline: 988 (Suicide & Crisis Lifeline) or text HOME to 741741.",
        "What you're feeling right now is temporary, even though it might not feel that way. There are trained professionals who can help you through this. Please reach out to 988 or text HOME to 741741.",
        "I want you to know that you're not alone, and your life matters. Please consider calling 988 (Suicide & Crisis Lifeline) right now - they have people available 24/7 who care and want to help.",
      ],
      medium: [
        "I can hear that you're struggling right now, and I want you to know that these feelings, while overwhelming, can improve with the right support. Have you considered speaking with a mental health professional?",
        "It sounds like you're going through a really difficult time. These feelings are valid, but you don't have to face them alone. There are resources and people who can help.",
        "I'm concerned about how you're feeling. While I'm here to listen, it might be helpful to connect with someone who can provide more specialized support. Would you like me to share some resources?",
      ],
      low: [
        "I hear that you're experiencing some difficult emotions. It's completely normal to have these feelings, and acknowledging them is an important first step.",
        "Thank you for sharing how you're feeling with me. These emotions can be challenging to navigate. What usually helps you when you're feeling this way?",
        "It sounds like you're dealing with some tough feelings right now. Remember that it's okay to not be okay sometimes, and seeking support is always a good option.",
      ],
    }

    const severityResponses = responses[result.severity!] || responses.low
    return severityResponses[Math.floor(Math.random() * severityResponses.length)]
  }, [])

  const shouldTriggerAlert = useCallback((result: CrisisDetectionResult): boolean => {
    if (!result.shouldAlertModerator) return false

    // Implement cooldown to prevent spam alerts
    const alertKey = result.keywords.join(",")
    if (alertCooldown.current.has(alertKey)) return false

    alertCooldown.current.add(alertKey)
    setTimeout(() => {
      alertCooldown.current.delete(alertKey)
    }, 300000) // 5 minute cooldown

    return true
  }, [])

  const getPatternAnalysis = useCallback(() => {
    const recentDetections = detectionHistory.slice(-5)
    const highSeverityCount = recentDetections.filter((d) => d.severity === "high").length
    const categories = [...new Set(recentDetections.flatMap((d) => d.categories))]

    return {
      recentHighSeverity: highSeverityCount,
      dominantCategories: categories,
      escalating: recentDetections.length >= 3 && recentDetections.slice(-3).every((d) => d.detected),
      needsIntervention: highSeverityCount >= 2,
    }
  }, [detectionHistory])

  return {
    analyzeText,
    getRecommendedResponse,
    shouldTriggerAlert,
    getPatternAnalysis,
    detectionHistory,
  }
}
