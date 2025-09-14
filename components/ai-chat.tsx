"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Heart, Ear, Zap, BookOpen, Wind, AlertTriangle, Volume2 } from "lucide-react"
import { VoiceInterface } from "@/components/voice-interface"
import { SafetyMonitor } from "@/components/safety-monitor"
import { EmergencyResources } from "@/components/emergency-resources"
import { useCrisisDetection } from "@/hooks/use-crisis-detection"
import { ErrorBoundary } from "@/components/error-boundary"
import { ChatInput } from "@/components/ui/chat-input"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  mood?: string
}

type ChatMode = "listener" | "motivator" | "journaling" | "breathing"

const CHAT_MODES = {
  listener: {
    name: "Listener",
    icon: Ear,
    description: "I'm here to listen and understand",
    color: "bg-blue-500/20 text-blue-400 border-blue-400/30",
  },
  motivator: {
    name: "Motivator",
    icon: Zap,
    description: "Let's build your confidence and energy",
    color: "bg-orange-500/20 text-orange-400 border-orange-400/30",
  },
  journaling: {
    name: "Journaling Coach",
    icon: BookOpen,
    description: "Explore your thoughts through guided reflection",
    color: "bg-purple-500/20 text-purple-400 border-purple-400/30",
  },
  breathing: {
    name: "Breathing Guide",
    icon: Wind,
    description: "Let's practice calming breathing exercises",
    color: "bg-green-700 text-white border-green-400",
  },
}

const QUICK_RESPONSES = [
  { text: "I feel sad", mood: "sad", emoji: "😢" },
  { text: "I feel anxious", mood: "anxious", emoji: "😰" },
  { text: "I feel angry", mood: "angry", emoji: "😠" },
  { text: "I feel happy", mood: "happy", emoji: "😊" },
]

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI mental health companion. I can adapt to different modes to best support you. Choose a mode above or just start chatting - I'm here to help however you need.",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [isClient, setIsClient] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentMode, setCurrentMode] = useState<ChatMode>("listener")
  const [sessionSummary, setSessionSummary] = useState<string | null>(null)
  const [showQuickResponses, setShowQuickResponses] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { analyzeText, getRecommendedResponse } = useCrisisDetection()
  const [crisisLevel, setCrisisLevel] = useState<"high" | "medium" | "low" | null>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleModeChange = (mode: ChatMode) => {
    setCurrentMode(mode)
    const modeMessage: Message = {
      id: Date.now().toString(),
      content: getModeChangeMessage(mode),
      sender: "ai",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, modeMessage])
    
    // Show quick responses when mode changes
    setShowQuickResponses(true)
  }

  const getModeChangeMessage = (mode: ChatMode): string => {
    const messages = {
      listener:
        "I'm now in Listener mode. I'm here to listen without judgment and help you process your thoughts and feelings. What's on your mind?",
      motivator:
        "I've switched to Motivator mode! I'm here to help boost your confidence, celebrate your strengths, and encourage you forward. What would you like to work on?",
      journaling:
        "I'm now your Journaling Coach. I'll help you explore your thoughts through guided questions and reflection. What would you like to explore today?",
      breathing:
        "I'm now your Breathing Guide. I can walk you through various breathing exercises to help you feel calm and centered. Would you like to start with a simple technique?",
    }
    return messages[mode]
  }

  const handleQuickResponse = (response: (typeof QUICK_RESPONSES)[0]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: response.text,
      sender: "user",
      timestamp: new Date(),
      mood: response.mood,
    }

    setMessages((prev) => [...prev, userMessage])
    setShowQuickResponses(false)
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse = generateMoodResponse(response.mood)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
      
      // Show quick responses again after AI responds
      setShowQuickResponses(true)
      
      // Focus the input after AI response
      const inputElement = document.getElementById('ai-chat-input') as HTMLInputElement;
      if (inputElement) inputElement.focus();
    }, 1500)
  }

  const generateMoodResponse = (mood: string): string => {
    const responses = {
      sad: [
        "I hear that you're feeling sad, and I want you to know that it's completely okay to feel this way. Sadness is a natural human emotion. Can you tell me what's contributing to these feelings?",
        "It sounds like you're going through a difficult time. Your feelings are valid, and I'm here to support you. What would help you feel a little lighter right now?",
      ],
      anxious: [
        "I understand you're feeling anxious. That can be really overwhelming. Let's take this one step at a time. Can you tell me what's making you feel anxious right now?",
        "Anxiety can feel so intense, but you're not alone in this. Would it help to try a quick breathing exercise, or would you prefer to talk through what's worrying you?",
      ],
      angry: [
        "I can sense your anger, and those feelings are completely valid. Sometimes anger is our way of protecting ourselves. What's behind these feelings of anger?",
        "It sounds like something has really upset you. Anger often signals that something important to us has been threatened. Can you help me understand what happened?",
      ],
      happy: [
        "I'm so glad to hear you're feeling happy! It's wonderful when we can recognize and celebrate positive moments. What's bringing you joy today?",
        "That's fantastic! Happiness is such a gift. I'd love to hear more about what's making you feel good right now.",
      ],
    }

    const moodResponses = responses[mood as keyof typeof responses] || responses.sad
    return moodResponses[Math.floor(Math.random() * moodResponses.length)]
  }

  const generateAIResponse = (userInput: string): string => {
    // Use the crisis detection system
    const crisisResult = analyzeText(userInput)

    if (crisisResult.detected && crisisResult.severity) {
      setCrisisLevel(crisisResult.severity)
      return getRecommendedResponse(crisisResult)
    }

    const modeResponses = {
      listener: [
        "I hear you, and I want you to know that your feelings are completely valid. Can you tell me more about what's been on your mind?",
        "Thank you for sharing that with me. It takes courage to open up. What would help you feel more supported right now?",
        "I'm listening without judgment. Your thoughts and feelings matter. How long have you been experiencing this?",
      ],
      motivator: [
        "You've got this! I can hear your strength even in sharing this challenge. What's one small step you could take today that would make you feel proud?",
        "I believe in your ability to handle this. You've overcome challenges before - what helped you then that might work now?",
        "Your awareness and willingness to reach out shows real courage. What would celebrating a small win look like for you today?",
      ],
      journaling: [
        "That's a powerful insight. Let's explore this deeper - when did you first notice this pattern in your life?",
        "Thank you for that reflection. If you could write a letter to yourself about this situation, what would you want to remember?",
        "What you've shared reveals a lot of self-awareness. How do you think this experience might be teaching you something about yourself?",
      ],
      breathing: [
        "Let's pause here and focus on your breath. Try breathing in for 4 counts, holding for 4, then out for 6. How does that feel?",
        "I can sense some tension in what you've shared. Would you like to try a quick grounding exercise? Let's breathe together.",
        "Sometimes our breath can help us find calm in the storm. Try placing one hand on your chest, one on your belly, and just notice your natural rhythm.",
      ],
    }

    const responses = modeResponses[currentMode]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const generateSessionSummary = () => {
    const userMessages = messages.filter((m) => m.sender === "user")
    if (userMessages.length < 3) return

    const summary = `Session Summary: You shared ${userMessages.length} thoughts with me today. I noticed themes around ${currentMode === "listener" ? "processing emotions" : currentMode === "motivator" ? "building confidence" : currentMode === "journaling" ? "self-reflection" : "mindfulness and breathing"}. Remember: You showed courage by reaching out, your feelings are valid, and small steps forward count. Consider continuing this conversation tomorrow or trying a breathing exercise before bed.`

    setSessionSummary(summary)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    setShowQuickResponses(false) // Hide quick responses when user sends a message

    if (messages.filter((m) => m.sender === "user").length >= 4) {
      setTimeout(() => generateSessionSummary(), 3000)
    }

    // Store the current input value before clearing it to use in AI response generation
    const currentInput = inputValue;

    setTimeout(() => {
      const aiResponse = generateAIResponse(currentInput)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
      
      // Show quick responses after AI responds
      setShowQuickResponses(true)
      
      // Focus the input after bot reply for better UX
      const inputElement = document.getElementById('ai-chat-input') as HTMLInputElement;
      if (inputElement) inputElement.focus();
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInputValue(transcript)
  }

  const handleSpeakMessage = (text: string) => {
    // Voice message handling - could add analytics here
    console.log("[v0] Speaking message:", text.substring(0, 50) + "...")
  }

  const handleCrisisDetected = (severity: "high" | "medium" | "low") => {
    setCrisisLevel(severity)
    console.log("[v0] Crisis detected:", severity)
  }

  const handleResourcesRequested = () => {
    console.log("[v0] Emergency resources requested")
  }

  return (
    <ErrorBoundary
      fallback={
        <section id="chat" className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">AI Mental Health Chat</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                There was a problem loading the chat. Please refresh the page to try again.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Chat Temporarily Unavailable</h3>
              <p className="text-gray-300 mb-4">We're experiencing some technical difficulties with our chat feature.</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-lime-400 hover:bg-lime-500 text-black"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </section>
      }
    >
      <section id="chat" className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">AI Mental Health Chat</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Choose your preferred support mode and have a personalized conversation with your AI companion.
            </p>
          </div>

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {Object.entries(CHAT_MODES).map(([key, mode]) => {
            const Icon = mode.icon
            return (
              <Button
                key={key}
                onClick={() => handleModeChange(key as ChatMode)}
                variant={currentMode === key ? "default" : "outline"}
                className={`${currentMode === key ? "bg-lime-400 text-black" : "bg-white/10 text-white border-white/20 hover:bg-white/20"} transition-all`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {mode.name}
              </Button>
            )
          })}
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl">
          {/* Chat messages area */}
          <ScrollArea ref={scrollAreaRef} className="h-96 px-4 py-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-lime-500 text-black"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.sender === "user" ? "You" : CHAT_MODES[currentMode].name}
                      </span>
                      {message.mood && (
                        <Badge variant="outline" className="text-xs">
                          {message.mood}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">{message.content}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs opacity-50">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {message.sender === "ai" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-50 hover:opacity-100"
                          onClick={() => handleSpeakMessage(message.content)}
                        >
                          <Volume2 className="h-3 w-3" />
                          <span className="sr-only">Read aloud</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-3 rounded-lg bg-gray-800 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="h-4 w-4" />
                      <span className="text-xs opacity-70">{CHAT_MODES[currentMode].name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              {sessionSummary && (
                <div className="my-4 p-4 bg-lime-500/10 border border-lime-500/20 rounded-lg">
                  <h4 className="font-medium text-lime-400 text-sm mb-2">Session Summary</h4>
                  <p className="text-sm text-gray-300">{sessionSummary}</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick responses */}
          {showQuickResponses && (
            <div className="p-3 border-t border-gray-700 bg-gray-800/50">
              <div className="flex flex-wrap gap-2 justify-center">
                {QUICK_RESPONSES.map((response) => (
                  <Button
                    key={response.text}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10"
                    onClick={() => handleQuickResponse(response)}
                  >
                    <span className="mr-1">{response.emoji}</span> {response.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="p-3 border-t border-gray-700 bg-gray-800/50" id="ai-chat-input-area">
            <ErrorBoundary
              fallback={
                <ChatInput 
                  onSendMessage={(text) => {
                    const userMessage: Message = {
                      id: Date.now().toString(),
                      content: text,
                      sender: "user",
                      timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, userMessage]);
                    setIsTyping(true);
                    setShowQuickResponses(false);
                    
                    setTimeout(() => {
                      const aiMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        content: "I'm sorry, there seems to be an issue with our chat system. Let me try to help you anyway.",
                        sender: "ai",
                        timestamp: new Date(),
                      };
                      setMessages((prev) => [...prev, aiMessage]);
                      setIsTyping(false);
                      setShowQuickResponses(true);
                    }, 1500);
                  }}
                  inputClassName="bg-gray-700 border-gray-600 text-white focus:ring-lime-400"
                  buttonClassName="bg-lime-400 hover:bg-lime-500 text-black"
                />
              }
            >
              <div className="flex gap-2">
                {/* Wrap VoiceInterface in an error boundary to prevent it from crashing the entire component */}
                <div className="flex-shrink-0">
                  {typeof window !== 'undefined' && <VoiceInterface onTranscript={handleVoiceTranscript} />}
                </div>
                <Input
                  id="ai-chat-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 border-gray-600 text-white focus:ring-lime-400"
                  autoComplete="off"
                  style={{ display: 'block' }} /* Force display */
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-lime-400 hover:bg-lime-500 text-black flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </ErrorBoundary>
          </div>
        </div>

        <SafetyMonitor
          messages={messages}
          onCrisisDetected={handleCrisisDetected}
          onResourcesRequested={handleResourcesRequested}
        />
      </div>
    </section>
    </ErrorBoundary>
  )
}
