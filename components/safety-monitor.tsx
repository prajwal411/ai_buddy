"use client"

import { useEffect, useState } from "react"
import { useCrisisDetection } from "@/hooks/use-crisis-detection"
import { EmergencyResources } from "@/components/emergency-resources"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, Heart, X } from "lucide-react"

interface SafetyMonitorProps {
  messages: Array<{ content: string; sender: "user" | "ai"; timestamp: Date }>
  onCrisisDetected?: (severity: "high" | "medium" | "low") => void
  onResourcesRequested?: () => void
}

export function SafetyMonitor({ messages, onCrisisDetected, onResourcesRequested }: SafetyMonitorProps) {
  const { analyzeText, getPatternAnalysis } = useCrisisDetection()
  const [activeAlert, setActiveAlert] = useState<{
    severity: "high" | "medium" | "low"
    message: string
    showResources: boolean
  } | null>(null)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Analyze the most recent user message
    const userMessages = messages.filter((m) => m.sender === "user")
    if (userMessages.length === 0) return

    const latestMessage = userMessages[userMessages.length - 1]
    const result = analyzeText(latestMessage.content)

    if (result.detected && result.severity) {
      const alertKey = `${result.severity}-${result.keywords.join(",")}`

      if (!dismissed.has(alertKey)) {
        setActiveAlert({
          severity: result.severity,
          message: result.message,
          showResources: result.shouldShowResources,
        })

        if (onCrisisDetected) {
          onCrisisDetected(result.severity)
        }
      }
    }
  }, [messages, analyzeText, onCrisisDetected, dismissed])

  const handleDismissAlert = () => {
    if (activeAlert) {
      const alertKey = `${activeAlert.severity}-${Date.now()}`
      setDismissed((prev) => new Set([...prev, alertKey]))
    }
    setActiveAlert(null)
  }

  const handleResourcesClick = () => {
    if (onResourcesRequested) {
      onResourcesRequested()
    }
    handleDismissAlert()
  }

  if (!activeAlert) return null

  const getAlertStyles = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/10 border-red-400/20 text-red-400"
      case "medium":
        return "bg-orange-500/10 border-orange-400/20 text-orange-400"
      case "low":
        return "bg-yellow-500/10 border-yellow-400/20 text-yellow-400"
      default:
        return "bg-gray-500/10 border-gray-400/20 text-gray-400"
    }
  }

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return AlertTriangle
      case "medium":
        return Shield
      case "low":
        return Heart
      default:
        return AlertTriangle
    }
  }

  const AlertIcon = getAlertIcon(activeAlert.severity)

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert className={`${getAlertStyles(activeAlert.severity)} relative`}>
        <AlertIcon className="h-4 w-4" />
        <Button
          onClick={handleDismissAlert}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-white/10"
        >
          <X className="h-3 w-3" />
        </Button>

        <AlertDescription className="pr-8">
          <p className="text-sm mb-3">{activeAlert.message}</p>

          <div className="flex gap-2">
            {activeAlert.showResources && (
              <EmergencyResources
                triggerText="Get Help Now"
                showUrgentOnly={activeAlert.severity === "high"}
                className="text-xs px-3 py-1 h-auto"
              />
            )}

            <Button
              onClick={handleResourcesClick}
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1 h-auto bg-white/10 border-white/20 hover:bg-white/20"
            >
              I'm Safe
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
