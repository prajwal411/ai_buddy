"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Accessibility, Eye, Type, Contrast, Volume2, Languages, Keyboard } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface AccessibilitySettings {
  highContrast: boolean
  fontSize: number
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  language: string
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
]

export function AccessibilityControls() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 16,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    language: "en",
  })

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("accessibility-settings")
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem("accessibility-settings", JSON.stringify(settings))

    // Apply settings to document
    const root = document.documentElement

    if (settings.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    root.style.fontSize = `${settings.fontSize}px`

    if (settings.reducedMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }

    if (settings.keyboardNavigation) {
      root.classList.add("keyboard-navigation")
    } else {
      root.classList.remove("keyboard-navigation")
    }
  }, [settings])

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings({
      highContrast: false,
      fontSize: 16,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      language: "en",
    })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          aria-label="Accessibility Settings"
        >
          <Accessibility className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-black/90 border-white/20" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-white">Accessibility</h4>
            <Button
              onClick={resetSettings}
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-white"
            >
              Reset
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Contrast className="h-4 w-4 text-gray-400" />
                <Label className="text-sm text-gray-300">High Contrast</Label>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting("highContrast", checked)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-gray-400" />
                <Label className="text-sm text-gray-300">Font Size</Label>
              </div>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting("fontSize", value)}
                max={24}
                min={12}
                step={1}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{settings.fontSize}px</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-400" />
                <Label className="text-sm text-gray-300">Reduce Motion</Label>
              </div>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-gray-400" />
                <Label className="text-sm text-gray-300">Screen Reader</Label>
              </div>
              <Switch
                checked={settings.screenReader}
                onCheckedChange={(checked) => updateSetting("screenReader", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-gray-400" />
                <Label className="text-sm text-gray-300">Keyboard Navigation</Label>
              </div>
              <Switch
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => updateSetting("keyboardNavigation", checked)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-gray-400" />
                <Label className="text-sm text-gray-300">Language</Label>
              </div>
              <select
                value={settings.language}
                onChange={(e) => updateSetting("language", e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-black">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-gray-400">
              These settings improve accessibility for users with visual, auditory, or motor impairments.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
