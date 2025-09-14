"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, RefreshCw, User, Shield } from "lucide-react"

interface AnonymousUser {
  id: string
  avatar: string
  createdAt: string
}

const AVATARS = ["🌙", "⭐", "🌸", "🦋", "🌊", "🍃", "🔮", "🌈", "☁️", "🌺"]
const PREFIXES = ["Calm", "Mind", "Peace", "Zen", "Soul", "Dream", "Hope", "Light", "Wise", "Kind"]
const SUFFIXES = ["Star", "Wave", "Bloom", "Flow", "Glow", "Spark", "Beam", "Mist", "Dawn", "Sage"]

export function AnonymousAuth() {
  const [user, setUser] = useState<AnonymousUser | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [loginId, setLoginId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  const generateAnonymousId = (): AnonymousUser => {
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)]
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]
    const number = Math.floor(Math.random() * 999) + 1
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)]

    return {
      id: `${prefix}${suffix}-${number}`,
      avatar,
      createdAt: new Date().toISOString(),
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("mindbuddy_anonymous_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("mindbuddy_anonymous_user")
      }
    }
  }, [])

  const createNewAccount = () => {
    const newUser = generateAnonymousId()
    setUser(newUser)
    localStorage.setItem("mindbuddy_anonymous_user", JSON.stringify(newUser))
    setShowWelcome(true)
    setTimeout(() => setShowWelcome(false), 5000)
  }

  const loginWithId = async () => {
    if (!loginId.trim()) return

    setIsLoading(true)
    // Simulate validation delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, accept any valid format
    if (loginId.includes("-") && loginId.length > 5) {
      const loginUser: AnonymousUser = {
        id: loginId,
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
        createdAt: new Date().toISOString(),
      }
      setUser(loginUser)
      localStorage.setItem("mindbuddy_anonymous_user", JSON.stringify(loginUser))
      setShowLogin(false)
      setLoginId("")
    }
    setIsLoading(false)
  }

  const copyId = async () => {
    if (user) {
      await navigator.clipboard.writeText(user.id)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mindbuddy_anonymous_user")
    setShowLogin(false)
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-black/40 text-white border-lime-400/20 hover:bg-black/60">
          <span className="mr-1">{user.avatar}</span>
          {user.id}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyId}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-black/40"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-black/40"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showWelcome && (
        <Card className="bg-black/40 border-lime-400/20 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-2xl">{user?.avatar}</div>
              <p className="text-white font-medium">Welcome, {user?.id}!</p>
              <p className="text-gray-300 text-sm">Save this ID to access your data later</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!showLogin ? (
        <Card className="bg-black/40 border-lime-400/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-lime-400/20 rounded-full flex items-center justify-center mb-2">
              <Shield className="h-6 w-6 text-lime-400" />
            </div>
            <CardTitle className="text-white">Anonymous & Private</CardTitle>
            <CardDescription className="text-gray-300">
              No email, no personal data. Just you and your mental health journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={createNewAccount} className="w-full bg-lime-400 text-black hover:bg-lime-300">
              <User className="mr-2 h-4 w-4" />
              Get Started Anonymously
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLogin(true)}
              className="w-full border-gray-600 text-gray-300 hover:bg-black/40 hover:text-white"
            >
              I have an ID
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-black/40 border-lime-400/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Enter Your Anonymous ID</CardTitle>
            <CardDescription className="text-gray-300">Enter your ID to continue your journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="e.g., CalmStar-482"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="bg-black/20 border-gray-600 text-white placeholder:text-gray-400"
            />
            <div className="flex gap-2">
              <Button
                onClick={loginWithId}
                disabled={isLoading || !loginId.trim()}
                className="flex-1 bg-lime-400 text-black hover:bg-lime-300"
              >
                {isLoading ? "Checking..." : "Continue"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowLogin(false)}
                className="border-gray-600 text-gray-300 hover:bg-black/40"
              >
                Back
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={createNewAccount}
              className="w-full text-gray-400 hover:text-white hover:bg-black/20"
            >
              Get a new ID instead
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
