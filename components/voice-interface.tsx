"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Settings } from "lucide-react"
import { useSpeech, useTextToSpeech } from "@/hooks/use-speech"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface VoiceInterfaceProps {
  onTranscript?: (text: string) => void
  onSpeakMessage?: (text: string) => void
  className?: string
}

export function VoiceInterface({ onTranscript, onSpeakMessage, className = "" }: VoiceInterfaceProps) {
  const [speechSettings, setSpeechSettings] = useState({
    rate: 0.9,
    pitch: 1,
    volume: 0.8,
  })

  const {
    isListening,
    isSupported: speechSupported,
    transcript,
    startListening,
    stopListening,
  } = useSpeech({
    onResult: (text) => {
      if (onTranscript) {
        onTranscript(text)
      }
    },
    onError: (error) => {
      console.error("Speech recognition error:", error)
    },
  })

  const { speak, stop: stopSpeaking, isSpeaking, isSupported: ttsSupported, voices } = useTextToSpeech()

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleSpeakToggle = (text: string) => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      speak(text, speechSettings)
      if (onSpeakMessage) {
        onSpeakMessage(text)
      }
    }
  }

  if (!speechSupported && !ttsSupported) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {speechSupported && (
        <div className="flex items-center gap-2">
          <Button
            onClick={handleVoiceInput}
            variant={isListening ? "default" : "outline"}
            size="sm"
            className={`${
              isListening
                ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                : "bg-white/10 text-white border-white/20 hover:bg-white/20"
            } transition-all`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {isListening && (
            <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-400/30">
              Listening...
            </Badge>
          )}

          {transcript && !isListening && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-400/30 max-w-32 truncate">
              "{transcript}"
            </Badge>
          )}
        </div>
      )}

      {ttsSupported && (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-black/90 border-white/20">
              <div className="space-y-4">
                <h4 className="font-medium text-white">Voice Settings</h4>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-300">Speech Rate</Label>
                  <Slider
                    value={[speechSettings.rate]}
                    onValueChange={([value]) => setSpeechSettings((prev) => ({ ...prev, rate: value }))}
                    max={2}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{speechSettings.rate}x</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-300">Pitch</Label>
                  <Slider
                    value={[speechSettings.pitch]}
                    onValueChange={([value]) => setSpeechSettings((prev) => ({ ...prev, pitch: value }))}
                    max={2}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{speechSettings.pitch}</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-300">Volume</Label>
                  <Slider
                    value={[speechSettings.volume]}
                    onValueChange={([value]) => setSpeechSettings((prev) => ({ ...prev, volume: value }))}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{Math.round(speechSettings.volume * 100)}%</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {isSpeaking && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-400/30">
              Speaking...
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
