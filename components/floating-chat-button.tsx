"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, X, ChevronDown, ChevronUp, RotateCcw, Maximize2, Minimize2 } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface AnonymousPreference {
  concern: string;
}

const SUGGESTED_REPLIES = [
  { id: "anxiety", text: "I'm feeling anxious" },
  { id: "depression", text: "I'm feeling down" },
  { id: "resources", text: "What resources do you have?" },
  { id: "techniques", text: "Coping techniques" }
];

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [userPreference, setUserPreference] = useState<AnonymousPreference>({
    concern: ""
  })
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! 👋 I'm your anonymous MindBuddy assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [showSuggestedReplies, setShowSuggestedReplies] = useState(false)
  
  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true)
      setIsMinimized(false)
    } else {
      setIsOpen(false)
    }
  }
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }
  
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserPreference(prev => ({
      ...prev,
      [name]: value
    }));
  }
  
  const startChat = () => {
    // Add a message acknowledging the user's preference if one was selected
    if (userPreference.concern) {
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        content: `I understand you're interested in talking about ${userPreference.concern}. How can I help you with that today?`,
        sender: "bot",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse]);
    }
    
    setShowWelcome(false);
    setShowSuggestedReplies(true); // Show suggested replies when starting chat
  }
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    }
    
    // Store the current input value before clearing it
    const currentInput = inputValue;
    
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setShowSuggestedReplies(false) // Hide suggested replies when user sends a message
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        content: getBotResponse(currentInput),
        sender: "bot",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      
      // Re-focus the input after bot response for better UX
      const inputElement = document.querySelector('#chat-footer input') as HTMLInputElement;
      if (inputElement) inputElement.focus();
    }, 1000)
  }
  
  const getBotResponse = (input: string): string => {
    const normalizedInput = input.toLowerCase()
    
    if (normalizedInput.includes("hello") || normalizedInput.includes("hi")) {
      setShowSuggestedReplies(true)
      return "Hello! How can I assist you with MindBuddy today?"
    }
    
    if (normalizedInput.includes("help") || normalizedInput.includes("support")) {
      setShowSuggestedReplies(true)
      return "I'm here to help! You can ask me about mental health resources, breathing exercises, or how to use the chat features."
    }
    
    if (normalizedInput.includes("feature") || normalizedInput.includes("can you do")) {
      setShowSuggestedReplies(true)
      return "I can help with mental health support, mood tracking, breathing exercises, and connecting you to resources. What would you like to explore?"
    }
    
    if (normalizedInput.includes("anxious") || normalizedInput.includes("anxiety")) {
      setShowSuggestedReplies(true)
      return "I understand anxiety can be challenging. Have you tried the breathing exercises in our Wellness Tools section? They can help calm your nervous system."
    }
    
    // Default response - show suggested replies
    setShowSuggestedReplies(true)
    return "Thanks for your message. How else can I support your mental health journey today?"
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const handleSuggestedReply = (text: string) => {
    setInputValue(text)
    // Small delay to show the text in the input before sending
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <Button 
        onClick={toggleChat} 
        size="icon" 
        className={`h-14 w-14 rounded-full bg-lime-400 text-black shadow-lg hover:bg-lime-300 transition-all ${isOpen ? 'scale-0' : 'scale-100'} relative`}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute top-2 right-2 h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
        <span className="sr-only">Open chat</span>
      </Button>
      
      {/* Chat Window */}
      {isOpen && (
        <Card className={`
          absolute bottom-0 right-0 
          w-80 sm:w-96 
          transition-all duration-300 ease-in-out
          bg-gray-900/95 border-gray-800 text-white shadow-xl
          ${isMinimized ? 'h-14' : 'h-[450px]'}
        `}>
          {/* Header */}
          <CardHeader className="p-3 border-b border-gray-800 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-lime-400" />
              <h3 className="font-medium text-sm">MindBuddy Assistant</h3>
            </div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-white"
                onClick={() => {
                  setShowWelcome(true);
                  setShowSuggestedReplies(false);
                  setMessages([{
                    id: "welcome",
                    content: "Hi there! 👋 I'm your anonymous MindBuddy assistant. How can I help you today?",
                    sender: "bot",
                    timestamp: new Date(),
                  }]);
                }}
                title="Reset chat"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={toggleMinimize}>
                {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={toggleChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {/* Body - only shown when not minimized */}
          {!isMinimized && (
            <>
              <ScrollArea className="flex-1 p-4 h-[330px]">
                {showWelcome ? (
                  <div className="space-y-4">
                    {/* Initial bot message */}
                    <div className="flex justify-start">
                      <div className="max-w-[80%] px-3 py-2 rounded-lg bg-gray-800 text-white">
                        <p className="text-sm">{messages[0].content}</p>
                        <p className="text-[10px] mt-1 opacity-70">
                          {messages[0].timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    
                    {/* Optional topic selection */}
                    <div className="bg-gray-800/70 rounded-lg p-4 space-y-3">
                      <div>
                        <label htmlFor="concern" className="block text-xs text-gray-300 mb-1">What would you like to talk about? (optional)</label>
                        <select
                          id="concern"
                          name="concern"
                          value={userPreference.concern}
                          onChange={handlePreferenceChange}
                          className="w-full rounded-md px-3 py-2 bg-gray-700 border-gray-600 text-white text-sm"
                        >
                          <option value="">Choose a topic...</option>
                          <option value="anxiety">Anxiety</option>
                          <option value="depression">Depression</option>
                          <option value="stress">Stress</option>
                          <option value="sleep">Sleep issues</option>
                          <option value="relationships">Relationships</option>
                          <option value="other">Other mental health concerns</option>
                        </select>
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          onClick={startChat}
                          className="w-full bg-lime-400 text-black hover:bg-lime-300"
                        >
                          Start Anonymous Chat
                        </Button>
                        <p className="text-[10px] text-gray-400 mt-2 text-center">
                          Your conversation is completely anonymous.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] px-3 py-2 rounded-lg ${
                            message.sender === 'user' 
                              ? 'bg-lime-500 text-black' 
                              : 'bg-gray-800 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-[10px] mt-1 opacity-70">
                            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              {/* Input Area - only show when welcome screen is dismissed */}
              {!showWelcome && (
                <>
                  {/* Suggested Replies */}
                  {showSuggestedReplies && (
                    <div className="p-2 border-t border-gray-800 bg-gray-800/50">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {SUGGESTED_REPLIES.map((reply) => (
                          <Button
                            key={reply.id}
                            variant="outline"
                            size="sm"
                            className="bg-gray-700/70 border-gray-600 text-white hover:bg-gray-600 text-xs"
                            onClick={() => handleSuggestedReply(reply.text)}
                          >
                            {reply.text}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <CardFooter className="p-2 border-t border-gray-800" id="chat-footer">
                    <div className="flex w-full items-center gap-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                        autoComplete="off"
                        autoFocus
                        style={{ display: 'block' }} /* Force display */
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        size="icon" 
                        className="bg-lime-400 text-black hover:bg-lime-300 flex-shrink-0"
                        disabled={!inputValue.trim()}
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </div>
                  </CardFooter>
                </>
              )}
            </>
          )}
        </Card>
      )}
    </div>
  )
}

export default FloatingChatButton
