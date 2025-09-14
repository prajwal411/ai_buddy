"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Wind, Heart, Brain, Sparkles, Timer } from "lucide-react"

interface BreathingSession {
  inhale: number
  hold: number
  exhale: number
  cycles: number
}

const breathingTechniques: Record<string, BreathingSession> = {
  "4-7-8": { inhale: 4, hold: 7, exhale: 8, cycles: 4 },
  "Box Breathing": { inhale: 4, hold: 4, exhale: 4, cycles: 6 },
  Calm: { inhale: 4, hold: 2, exhale: 6, cycles: 5 },
}

const meditationSessions = [
  { name: "Morning Mindfulness", duration: "5 min", description: "Start your day with clarity and intention" },
  { name: "Stress Relief", duration: "10 min", description: "Release tension and find inner peace" },
  { name: "Sleep Preparation", duration: "15 min", description: "Prepare your mind for restful sleep" },
  { name: "Anxiety Support", duration: "8 min", description: "Ground yourself and reduce anxious thoughts" },
]

const affirmations = [
  "I am worthy of love and happiness",
  "I choose peace over worry",
  "I am stronger than my challenges",
  "I trust in my ability to overcome difficulties",
  "I am grateful for this moment",
  "I deserve compassion, especially from myself",
  "I am growing and learning every day",
  "I have the power to create positive change",
]

export function WellnessTools() {
  const [selectedTechnique, setSelectedTechnique] = useState<string>("4-7-8")
  const [isBreathing, setIsBreathing] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [currentCycle, setCurrentCycle] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [currentAffirmation, setCurrentAffirmation] = useState(0)

  const technique = breathingTechniques[selectedTechnique]

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isBreathing && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isBreathing && timeLeft === 0) {
      // Move to next phase
      if (breathingPhase === "inhale") {
        setBreathingPhase("hold")
        setTimeLeft(technique.hold)
      } else if (breathingPhase === "hold") {
        setBreathingPhase("exhale")
        setTimeLeft(technique.exhale)
      } else if (breathingPhase === "exhale") {
        const nextCycle = currentCycle + 1
        if (nextCycle >= technique.cycles) {
          // Session complete
          setIsBreathing(false)
          setCurrentCycle(0)
          setBreathingPhase("inhale")
        } else {
          setCurrentCycle(nextCycle)
          setBreathingPhase("inhale")
          setTimeLeft(technique.inhale)
        }
      }
    }

    return () => clearInterval(interval)
  }, [isBreathing, timeLeft, breathingPhase, technique, currentCycle])

  const startBreathing = () => {
    setIsBreathing(true)
    setCurrentCycle(0)
    setBreathingPhase("inhale")
    setTimeLeft(technique.inhale)
  }

  const stopBreathing = () => {
    setIsBreathing(false)
    setCurrentCycle(0)
    setBreathingPhase("inhale")
    setTimeLeft(0)
  }

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length)
  }

  const getPhaseInstruction = () => {
    switch (breathingPhase) {
      case "inhale":
        return "Breathe In"
      case "hold":
        return "Hold"
      case "exhale":
        return "Breathe Out"
    }
  }

  const getPhaseColor = () => {
    switch (breathingPhase) {
      case "inhale":
        return "text-blue-400"
      case "hold":
        return "text-yellow-400"
      case "exhale":
        return "text-green-400"
    }
  }

  return (
    <section id="wellness" className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Wellness Tools</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover guided meditation, breathing exercises, and mindfulness practices to support your mental wellbeing
            journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Breathing Exercise */}
          <Card className="liquid-glass-enhanced border-white/20 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wind className="h-5 w-5 text-lime-400" />
                Breathing Exercise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Technique Selection */}
              <div className="space-y-2">
                <label className="text-white/80 text-sm">Choose Technique:</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.keys(breathingTechniques).map((tech) => (
                    <Button
                      key={tech}
                      variant={selectedTechnique === tech ? "default" : "outline"}
                      size="sm"
                      className={
                        selectedTechnique === tech
                          ? "bg-lime-400 text-black hover:bg-lime-300"
                          : "border-white/20 text-white hover:bg-white/10"
                      }
                      onClick={() => setSelectedTechnique(tech)}
                      disabled={isBreathing}
                    >
                      {tech}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Breathing Visualization */}
              <div className="text-center py-6">
                <div
                  className={`w-24 h-24 mx-auto rounded-full border-4 border-lime-400/30 flex items-center justify-center mb-4 transition-all duration-1000 ${
                    isBreathing
                      ? breathingPhase === "inhale"
                        ? "scale-125 bg-lime-400/20"
                        : breathingPhase === "exhale"
                          ? "scale-75 bg-lime-400/10"
                          : "scale-110 bg-lime-400/15"
                      : "scale-100 bg-lime-400/10"
                  }`}
                >
                  <Wind className="h-8 w-8 text-lime-400" />
                </div>

                {isBreathing ? (
                  <div className="space-y-2">
                    <div className={`text-xl font-bold ${getPhaseColor()}`}>{getPhaseInstruction()}</div>
                    <div className="text-3xl font-bold text-white">{timeLeft}</div>
                    <div className="text-sm text-white/60">
                      Cycle {currentCycle + 1} of {technique.cycles}
                    </div>
                    <Progress value={((currentCycle + 1) / technique.cycles) * 100} className="w-full" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-lg text-white/80">Ready to begin</div>
                    <div className="text-sm text-white/60">
                      {technique.cycles} cycles • {technique.inhale}-{technique.hold}-{technique.exhale} pattern
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                {!isBreathing ? (
                  <Button onClick={startBreathing} className="flex-1 bg-lime-400 text-black hover:bg-lime-300">
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button
                    onClick={stopBreathing}
                    variant="outline"
                    className="flex-1 border-white/20 text-white bg-transparent"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Meditation Sessions */}
          <Card className="liquid-glass-enhanced border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-lime-400" />
                Guided Meditation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {meditationSessions.map((session, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-medium text-sm">{session.name}</h4>
                    <Badge variant="outline" className="border-lime-400/50 text-lime-400 text-xs">
                      <Timer className="h-3 w-3 mr-1" />
                      {session.duration}
                    </Badge>
                  </div>
                  <p className="text-white/60 text-xs">{session.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Daily Affirmations */}
          <Card className="liquid-glass-enhanced border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-lime-400" />
                Daily Affirmations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <div className="mb-4">
                  <Heart className="h-8 w-8 text-lime-400 mx-auto mb-3" />
                </div>
                <blockquote className="text-white text-center italic leading-relaxed">
                  "{affirmations[currentAffirmation]}"
                </blockquote>
              </div>

              <Button
                onClick={nextAffirmation}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Next Affirmation
              </Button>

              <div className="text-center">
                <p className="text-xs text-white/60">
                  {currentAffirmation + 1} of {affirmations.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
