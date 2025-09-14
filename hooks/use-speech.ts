"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface UseSpeechProps {
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
  continuous?: boolean
  interimResults?: boolean
}

export function useSpeech({ onResult, onError, continuous = false, interimResults = true }: UseSpeechProps = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<any | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for browser support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        const recognition = recognitionRef.current

        recognition.continuous = continuous
        recognition.interimResults = interimResults
        recognition.lang = "en-US"

        recognition.onresult = (event) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          const fullTranscript = finalTranscript || interimTranscript
          setTranscript(fullTranscript)

          if (finalTranscript && onResult) {
            onResult(finalTranscript)
          }
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          if (onError) {
            onError(event.error)
          }
        }

        recognition.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [continuous, interimResults, onResult, onError])

  const startListening = useCallback(() => {
    if (recognitionRef.current && isSupported) {
      setTranscript("")
      setIsListening(true)
      recognitionRef.current.start()
    }
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
  }
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [voices, setVoices] = useState<any[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSupported("speechSynthesis" in window)

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
      }

      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const speak = useCallback(
    (text: string, options: { rate?: number; pitch?: number; volume?: number; voice?: string } = {}) => {
      if (!isSupported || !text) return

      window.speechSynthesis.cancel()

      const utterance = new window.SpeechSynthesisUtterance(text)
      utterance.rate = options.rate || 0.9
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 0.8

      if (options.voice) {
        const selectedVoice = voices.find((voice) => voice.name === options.voice)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    },
    [isSupported, voices],
  )

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
  }
}
