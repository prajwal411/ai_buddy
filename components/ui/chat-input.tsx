"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  placeholder?: string
  className?: string
  buttonClassName?: string
  inputClassName?: string
}

export function ChatInput({
  onSendMessage,
  placeholder = "Type your message...",
  className = "",
  buttonClassName = "",
  inputClassName = "",
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={`flex items-center gap-2 w-full ${className}`}>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`flex-1 ${inputClassName}`}
        autoComplete="off"
        style={{ display: "block" }}
      />
      <Button
        onClick={handleSendMessage}
        disabled={!inputValue.trim()}
        className={`flex-shrink-0 ${buttonClassName}`}
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  )
}
