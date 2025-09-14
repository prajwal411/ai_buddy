"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { User, TrendingUp, MessageCircle, Heart, Award, Clock, Wind, Brain, Flame } from "lucide-react"
import { useGamification } from "@/hooks/use-gamification"
import { StreakIndicator } from "@/components/streak-indicator"
import { DailyCheckInButton } from "@/components/daily-checkin-button"

export function UserDashboard() {
  const { progress, badges, trackBreathingExercise, trackMoodEntry, trackChatSession } = useGamification()

  const recentActivity = [
    { type: "mood", description: "Logged mood: Content", time: "2 hours ago", icon: Heart },
    { type: "chat", description: "AI chat session completed", time: "5 hours ago", icon: MessageCircle },
    { type: "breathing", description: "4-7-8 breathing exercise", time: "1 day ago", icon: Wind },
    { type: "meditation", description: "Morning Mindfulness (5 min)", time: "1 day ago", icon: Brain },
  ]

  const getActivityColor = (type: string) => {
    switch (type) {
      case "mood":
        return "text-green-400"
      case "chat":
        return "text-blue-400"
      case "breathing":
        return "text-purple-400"
      case "meditation":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const calculateJoinDays = () => {
    if (!progress.lastCheckIn) return 0
    const joinDate = new Date(progress.lastCheckIn)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - joinDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <section id="profile" className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Your Wellness Journey</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Track your progress, celebrate achievements, and see how you're growing on your mental health journey.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <StreakIndicator />
            <DailyCheckInButton />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Overview */}
          <Card className="liquid-glass-enhanced border-white/20 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-lime-400" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-lime-400/20 border-2 border-lime-400/30 flex items-center justify-center">
                  <User className="h-8 w-8 text-lime-400" />
                </div>
                <h3 className="text-white font-semibold">Welcome back!</h3>
                <p className="text-white/60 text-sm">
                  {progress.dailyCheckIns > 0
                    ? `${progress.dailyCheckIns} check-ins completed`
                    : "Start your journey today!"}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Current Streak</span>
                  <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-400/30">
                    <Flame className="h-3 w-3 mr-1" />
                    {progress.currentStreak} days
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Total Sessions</span>
                  <span className="text-white font-medium">{progress.chatSessions + progress.breathingExercises}</span>
                </div>
                {progress.longestStreak > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">Best Streak</span>
                    <span className="text-lime-400 font-medium">{progress.longestStreak} days</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <Card className="liquid-glass-enhanced border-white/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-lime-400" />
                Your Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <MessageCircle className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{progress.chatSessions}</div>
                  <div className="text-xs text-white/60">AI Chats</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <Heart className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{progress.moodEntries}</div>
                  <div className="text-xs text-white/60">Mood Entries</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <Wind className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{progress.breathingExercises}</div>
                  <div className="text-xs text-white/60">Breathing</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <Flame className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{progress.dailyCheckIns}</div>
                  <div className="text-xs text-white/60">Check-ins</div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Weekly Breathing Progress</span>
                  <span className="text-white/60 text-sm">{progress.weeklyBreathingCount}/7</span>
                </div>
                <Progress value={(progress.weeklyBreathingCount / 7) * 100} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Weekly Mood Tracking</span>
                  <span className="text-white/60 text-sm">{progress.weeklyMoodCount}/5</span>
                </div>
                <Progress value={(progress.weeklyMoodCount / 5) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="liquid-glass-enhanced border-white/20 md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-lime-400" />
                Achievements & Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      badge.unlocked ? "bg-lime-400/10 border-lime-400/30" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        badge.unlocked ? "bg-lime-400/20 border-lime-400/30" : "bg-white/10 border-white/20"
                      } border text-xl`}
                    >
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${badge.unlocked ? "text-white" : "text-white/60"}`}>{badge.name}</h4>
                      <p className="text-xs text-white/60">{badge.description}</p>
                      {badge.unlockedAt && (
                        <p className="text-xs text-lime-400 mt-1">
                          Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {badge.unlocked && (
                      <Badge className="bg-lime-400/20 text-lime-400 border-lime-400/30 text-xs">Unlocked</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="liquid-glass-enhanced border-white/20 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-lime-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={trackBreathingExercise}
                  variant="outline"
                  className="w-full border-purple-400/30 text-purple-300 hover:bg-purple-400/10 bg-transparent"
                >
                  <Wind className="h-4 w-4 mr-2" />
                  Log Breathing Exercise
                </Button>
                <Button
                  onClick={trackMoodEntry}
                  variant="outline"
                  className="w-full border-green-400/30 text-green-300 hover:bg-green-400/10 bg-transparent"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Log Mood Entry
                </Button>
                <Button
                  onClick={trackChatSession}
                  variant="outline"
                  className="w-full border-blue-400/30 text-blue-300 hover:bg-blue-400/10 bg-transparent"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Log Chat Session
                </Button>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <h4 className="text-white/80 text-sm font-medium mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {recentActivity.slice(0, 3).map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                        <Icon className={`h-4 w-4 ${getActivityColor(activity.type)}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white/90 text-sm">{activity.description}</p>
                          <p className="text-white/60 text-xs">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
