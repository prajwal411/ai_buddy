"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Smile, Frown, Meh, Heart, Zap, Cloud } from "lucide-react"

interface MoodEntry {
  id: string
  mood: string
  intensity: number
  note: string
  timestamp: Date
  color: string
  icon: any
}

const moodOptions = [
  { name: "Happy", color: "bg-yellow-400", icon: Smile, intensity: 4 },
  { name: "Content", color: "bg-green-400", icon: Heart, intensity: 3 },
  { name: "Neutral", color: "bg-gray-400", icon: Meh, intensity: 2 },
  { name: "Anxious", color: "bg-orange-400", icon: Zap, intensity: 2 },
  { name: "Sad", color: "bg-blue-400", icon: Cloud, intensity: 1 },
  { name: "Angry", color: "bg-red-400", icon: Frown, intensity: 1 },
]

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [moodNote, setMoodNote] = useState<string>("")
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    {
      id: "1",
      mood: "Content",
      intensity: 3,
      note: "Had a good morning walk and felt peaceful",
      timestamp: new Date(Date.now() - 86400000), // Yesterday
      color: "bg-green-400",
      icon: Heart,
    },
    {
      id: "2",
      mood: "Anxious",
      intensity: 2,
      note: "Work presentation coming up, feeling nervous",
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      color: "bg-orange-400",
      icon: Zap,
    },
  ])

  const handleMoodSubmit = () => {
    if (!selectedMood) return

    const moodOption = moodOptions.find((m) => m.name === selectedMood)
    if (!moodOption) return

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      intensity: moodOption.intensity,
      note: moodNote,
      timestamp: new Date(),
      color: moodOption.color,
      icon: moodOption.icon,
    }

    setMoodEntries([newEntry, ...moodEntries])
    setSelectedMood("")
    setMoodNote("")
  }

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0
    const total = moodEntries.reduce((sum, entry) => sum + entry.intensity, 0)
    return (total / moodEntries.length).toFixed(1)
  }

  const getMoodTrend = () => {
    if (moodEntries.length < 2) return "neutral"
    const recent =
      moodEntries.slice(0, 3).reduce((sum, entry) => sum + entry.intensity, 0) / Math.min(3, moodEntries.length)
    const older =
      moodEntries.slice(3, 6).reduce((sum, entry) => sum + entry.intensity, 0) /
      Math.min(3, moodEntries.slice(3).length)

    if (recent > older) return "improving"
    if (recent < older) return "declining"
    return "stable"
  }

  return (
    <section id="mood" className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Mood Tracker</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Track your daily emotions and discover patterns in your mental health journey. Understanding your moods is
            the first step to better wellbeing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Mood Entry */}
          <Card className="border-white/20 bg-black/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-lime-400" />
                How are you feeling today?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mood Selection */}
              <div className="grid grid-cols-3 gap-2">
                {moodOptions.map((mood) => {
                  const Icon = mood.icon
                  return (
                    <Button
                      key={mood.name}
                      variant={selectedMood === mood.name ? "default" : "outline"}
                      className={`h-16 flex-col gap-1 ${
                        selectedMood === mood.name
                          ? "bg-lime-400 text-black hover:bg-lime-300"
                          : "border-white/30 text-white bg-black/20 hover:bg-black/40"
                      }`}
                      onClick={() => setSelectedMood(mood.name)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{mood.name}</span>
                    </Button>
                  )
                })}
              </div>

              {/* Note Input */}
              <Textarea
                placeholder="Add a note about your mood (optional)..."
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-lime-400/50 focus:ring-lime-400/20"
                rows={3}
              />

              {/* Submit Button */}
              <Button
                onClick={handleMoodSubmit}
                disabled={!selectedMood}
                className="w-full bg-lime-400 text-black hover:bg-lime-300"
              >
                Log Mood
              </Button>
            </CardContent>
          </Card>

          {/* Mood Insights */}
          <Card className="border-white/20 bg-black/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-lime-400" />
                Your Mood Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-black/30 border border-white/20">
                  <div className="text-2xl font-bold text-lime-400">{getAverageMood()}</div>
                  <div className="text-xs text-gray-300">Average Mood</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-black/30 border border-white/20">
                  <div className="text-2xl font-bold text-lime-400">{moodEntries.length}</div>
                  <div className="text-xs text-gray-300">Entries Logged</div>
                </div>
              </div>

              {/* Trend */}
              <div className="p-3 rounded-lg bg-black/30 border border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Recent Trend:</span>
                  <Badge
                    variant="outline"
                    className={`${
                      getMoodTrend() === "improving"
                        ? "border-green-400 text-green-400"
                        : getMoodTrend() === "declining"
                          ? "border-red-400 text-red-400"
                          : "border-gray-400 text-gray-400"
                    }`}
                  >
                    {getMoodTrend()}
                  </Badge>
                </div>
              </div>

              {/* Recent Entries */}
              <div className="space-y-2">
                <h4 className="text-white text-sm font-medium">Recent Entries</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {moodEntries.slice(0, 3).map((entry) => {
                    const Icon = entry.icon
                    return (
                      <div key={entry.id} className="flex items-center gap-2 p-2 rounded-lg bg-black/30">
                        <div className={`w-6 h-6 rounded-full ${entry.color} flex items-center justify-center`}>
                          <Icon className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-xs font-medium">{entry.mood}</div>
                          <div className="text-gray-300 text-xs truncate">{entry.note || "No note"}</div>
                        </div>
                        <div className="text-gray-300 text-xs">{entry.timestamp.toLocaleDateString()}</div>
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
