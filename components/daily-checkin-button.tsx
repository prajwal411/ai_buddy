"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar } from "lucide-react"
import { useGamification } from "@/hooks/use-gamification"

export function DailyCheckInButton() {
  const { progress, performDailyCheckIn } = useGamification()
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const lastCheckIn = new Date(progress.lastCheckIn || 0).toDateString()
    setHasCheckedInToday(today === lastCheckIn)
  }, [progress.lastCheckIn])

  const handleCheckIn = () => {
    performDailyCheckIn()
    setHasCheckedInToday(true)
  }

  if (hasCheckedInToday) {
    return (
      <Button
        disabled
        className="bg-lime-400/20 text-lime-400 border-lime-400/30 hover:bg-lime-400/20"
        variant="outline"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Checked in today!
      </Button>
    )
  }

  return (
    <Button onClick={handleCheckIn} className="bg-lime-400 text-black hover:bg-lime-300">
      <Calendar className="h-4 w-4 mr-2" />
      Daily Check-in
    </Button>
  )
}
