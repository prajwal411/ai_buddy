"use client"

import { useState, useEffect } from "react"

export interface UserProgress {
  dailyCheckIns: number
  currentStreak: number
  longestStreak: number
  breathingExercises: number
  moodEntries: number
  chatSessions: number
  lastCheckIn: string
  weeklyBreathingCount: number
  weeklyMoodCount: number
  weeklyResetDate: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  category: "streak" | "breathing" | "mood" | "chat" | "special"
}

export interface Achievement {
  id: string
  name: string
  description: string
  type: "streak" | "breathing" | "mood" | "chat"
  target: number
  current: number
  unlocked: boolean
  badge?: Badge
}

const INITIAL_PROGRESS: UserProgress = {
  dailyCheckIns: 0,
  currentStreak: 0,
  longestStreak: 0,
  breathingExercises: 0,
  moodEntries: 0,
  chatSessions: 0,
  lastCheckIn: "",
  weeklyBreathingCount: 0,
  weeklyMoodCount: 0,
  weeklyResetDate: new Date().toISOString(),
}

const BADGES: Badge[] = [
  {
    id: "first-day",
    name: "First Steps",
    description: "Completed your first daily check-in",
    icon: "🌱",
    unlocked: false,
    category: "streak",
  },
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Maintained a 7-day streak",
    icon: "🔥",
    unlocked: false,
    category: "streak",
  },
  {
    id: "breathing-master",
    name: "Breathing Master",
    description: "You've done 7 breathing exercises this week 🧘",
    icon: "🧘",
    unlocked: false,
    category: "breathing",
  },
  {
    id: "mood-tracker",
    name: "Mood Tracker",
    description: "Logged your mood 5 times this week",
    icon: "📊",
    unlocked: false,
    category: "mood",
  },
  {
    id: "consistency-champion",
    name: "Consistency Champion",
    description: "Maintained a 30-day streak",
    icon: "👑",
    unlocked: false,
    category: "streak",
  },
]

export function useGamification() {
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS)
  const [badges, setBadges] = useState<Badge[]>(BADGES)
  const [newBadges, setNewBadges] = useState<Badge[]>([])
  const [plasmaIntensity, setPlasmaIntensity] = useState(0.25)

  // Load data from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("mindbuddy_progress")
    const savedBadges = localStorage.getItem("mindbuddy_badges")

    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setProgress(parsed)
      } catch (e) {
        console.error("Failed to parse progress:", e)
      }
    }

    if (savedBadges) {
      try {
        const parsed = JSON.parse(savedBadges)
        setBadges(parsed)
      } catch (e) {
        console.error("Failed to parse badges:", e)
      }
    }
  }, [])

  // Save data to localStorage
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress)
    localStorage.setItem("mindbuddy_progress", JSON.stringify(newProgress))
  }

  const saveBadges = (newBadges: Badge[]) => {
    setBadges(newBadges)
    localStorage.setItem("mindbuddy_badges", JSON.stringify(newBadges))
  }

  // Check if it's a new week and reset weekly counters
  const checkWeeklyReset = (currentProgress: UserProgress): UserProgress => {
    const now = new Date()
    const resetDate = new Date(currentProgress.weeklyResetDate)
    const daysSinceReset = Math.floor((now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceReset >= 7) {
      return {
        ...currentProgress,
        weeklyBreathingCount: 0,
        weeklyMoodCount: 0,
        weeklyResetDate: now.toISOString(),
      }
    }

    return currentProgress
  }

  // Check for new badges
  const checkBadges = (currentProgress: UserProgress, currentBadges: Badge[]): Badge[] => {
    const updatedBadges = [...currentBadges]
    const earnedBadges: Badge[] = []

    updatedBadges.forEach((badge) => {
      if (badge.unlocked) return

      let shouldUnlock = false

      switch (badge.id) {
        case "first-day":
          shouldUnlock = currentProgress.currentStreak >= 1
          break
        case "week-warrior":
          shouldUnlock = currentProgress.currentStreak >= 7
          break
        case "breathing-master":
          shouldUnlock = currentProgress.weeklyBreathingCount >= 7
          break
        case "mood-tracker":
          shouldUnlock = currentProgress.weeklyMoodCount >= 5
          break
        case "consistency-champion":
          shouldUnlock = currentProgress.currentStreak >= 30
          break
      }

      if (shouldUnlock) {
        badge.unlocked = true
        badge.unlockedAt = new Date().toISOString()
        earnedBadges.push(badge)
      }
    })

    if (earnedBadges.length > 0) {
      setNewBadges(earnedBadges)
      // Clear new badges after 5 seconds
      setTimeout(() => setNewBadges([]), 5000)
    }

    return updatedBadges
  }

  // Update plasma intensity based on achievements
  const updatePlasmaIntensity = (currentProgress: UserProgress, currentBadges: Badge[]) => {
    const baseIntensity = 0.25
    const streakBonus = Math.min(currentProgress.currentStreak * 0.02, 0.3)
    const badgeBonus = currentBadges.filter((b) => b.unlocked).length * 0.05

    const newIntensity = Math.min(baseIntensity + streakBonus + badgeBonus, 1.0)
    setPlasmaIntensity(newIntensity)
  }

  // Daily check-in
  const performDailyCheckIn = () => {
    const today = new Date().toDateString()
    const lastCheckIn = new Date(progress.lastCheckIn || 0).toDateString()

    if (today === lastCheckIn) {
      return // Already checked in today
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const wasYesterday = yesterday.toDateString() === lastCheckIn

    let updatedProgress = checkWeeklyReset(progress)

    updatedProgress = {
      ...updatedProgress,
      dailyCheckIns: updatedProgress.dailyCheckIns + 1,
      currentStreak: wasYesterday ? updatedProgress.currentStreak + 1 : 1,
      longestStreak: Math.max(updatedProgress.longestStreak, wasYesterday ? updatedProgress.currentStreak + 1 : 1),
      lastCheckIn: new Date().toISOString(),
    }

    const updatedBadges = checkBadges(updatedProgress, badges)

    saveProgress(updatedProgress)
    saveBadges(updatedBadges)
    updatePlasmaIntensity(updatedProgress, updatedBadges)
  }

  // Track breathing exercise
  const trackBreathingExercise = () => {
    let updatedProgress = checkWeeklyReset(progress)

    updatedProgress = {
      ...updatedProgress,
      breathingExercises: updatedProgress.breathingExercises + 1,
      weeklyBreathingCount: updatedProgress.weeklyBreathingCount + 1,
    }

    const updatedBadges = checkBadges(updatedProgress, badges)

    saveProgress(updatedProgress)
    saveBadges(updatedBadges)
    updatePlasmaIntensity(updatedProgress, updatedBadges)
  }

  // Track mood entry
  const trackMoodEntry = () => {
    let updatedProgress = checkWeeklyReset(progress)

    updatedProgress = {
      ...updatedProgress,
      moodEntries: updatedProgress.moodEntries + 1,
      weeklyMoodCount: updatedProgress.weeklyMoodCount + 1,
    }

    const updatedBadges = checkBadges(updatedProgress, badges)

    saveProgress(updatedProgress)
    saveBadges(updatedBadges)
    updatePlasmaIntensity(updatedProgress, updatedBadges)
  }

  // Track chat session
  const trackChatSession = () => {
    let updatedProgress = checkWeeklyReset(progress)

    updatedProgress = {
      ...updatedProgress,
      chatSessions: updatedProgress.chatSessions + 1,
    }

    const updatedBadges = checkBadges(updatedProgress, badges)

    saveProgress(updatedProgress)
    saveBadges(updatedBadges)
    updatePlasmaIntensity(updatedProgress, updatedBadges)
  }

  // Initialize plasma intensity on load
  useEffect(() => {
    updatePlasmaIntensity(progress, badges)
  }, [progress, badges])

  return {
    progress,
    badges,
    newBadges,
    plasmaIntensity,
    performDailyCheckIn,
    trackBreathingExercise,
    trackMoodEntry,
    trackChatSession,
  }
}
