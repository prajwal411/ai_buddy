"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Sparkles, Flame, Trophy } from "lucide-react"
import { useGamification, type Badge as BadgeType } from "@/hooks/use-gamification"

export function GamificationOverlay() {
  const { newBadges, progress } = useGamification()
  const [showBadgeNotification, setShowBadgeNotification] = useState(false)
  const [currentBadge, setCurrentBadge] = useState<BadgeType | null>(null)

  useEffect(() => {
    if (newBadges.length > 0) {
      setCurrentBadge(newBadges[0])
      setShowBadgeNotification(true)
    }
  }, [newBadges])

  if (!showBadgeNotification || !currentBadge) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="liquid-glass-enhanced border-lime-400/30 max-w-md w-full animate-in zoom-in-95 duration-300">
        <CardContent className="p-6 text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-lime-400/20 to-lime-600/20 border-2 border-lime-400/30 flex items-center justify-center animate-pulse">
              <span className="text-4xl">{currentBadge.icon}</span>
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-lime-400 animate-spin" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-lime-400" />
              Badge Unlocked!
            </h3>
            <h4 className="text-lg font-semibold text-lime-400">{currentBadge.name}</h4>
            <p className="text-white/80 text-sm">{currentBadge.description}</p>
          </div>

          {progress.currentStreak > 1 && (
            <div className="flex items-center justify-center gap-2 text-orange-400">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-medium">{progress.currentStreak} day streak!</span>
            </div>
          )}

          <Button
            onClick={() => setShowBadgeNotification(false)}
            className="w-full bg-lime-400 text-black hover:bg-lime-300"
          >
            Awesome!
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBadgeNotification(false)}
            className="absolute top-2 right-2 h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
