"use client"

import { Badge } from "@/components/ui/badge"
import { Flame, Calendar } from "lucide-react"
import { useGamification } from "@/hooks/use-gamification"

export function StreakIndicator() {
  const { progress } = useGamification()

  if (progress.currentStreak === 0) return null

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="secondary"
        className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-400/30 hover:from-orange-500/30 hover:to-red-500/30"
      >
        <Flame className="h-3 w-3 mr-1" />
        {progress.currentStreak} day streak
      </Badge>

      {progress.longestStreak > progress.currentStreak && (
        <Badge variant="outline" className="border-white/20 text-white/60">
          <Calendar className="h-3 w-3 mr-1" />
          Best: {progress.longestStreak}
        </Badge>
      )}
    </div>
  )
}
