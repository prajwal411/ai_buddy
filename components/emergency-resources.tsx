"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageSquare, Globe, Clock, AlertTriangle, Heart, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EmergencyResource {
  id: string
  name: string
  description: string
  phone?: string
  text?: string
  website?: string
  availability: string
  type: "crisis" | "support" | "therapy" | "emergency"
  urgent?: boolean
}

const EMERGENCY_RESOURCES: EmergencyResource[] = [
  {
    id: "suicide-crisis-lifeline",
    name: "988 Suicide & Crisis Lifeline",
    description: "Free, confidential support for people in distress and prevention resources.",
    phone: "988",
    website: "https://988lifeline.org",
    availability: "24/7",
    type: "crisis",
    urgent: true,
  },
  {
    id: "crisis-text-line",
    name: "Crisis Text Line",
    description: "Text-based crisis support with trained counselors.",
    text: "HOME to 741741",
    website: "https://crisistextline.org",
    availability: "24/7",
    type: "crisis",
    urgent: true,
  },
  {
    id: "emergency-services",
    name: "Emergency Services",
    description: "For immediate life-threatening emergencies.",
    phone: "911",
    availability: "24/7",
    type: "emergency",
    urgent: true,
  },
  {
    id: "samhsa-helpline",
    name: "SAMHSA National Helpline",
    description: "Treatment referral and information service for mental health and substance abuse.",
    phone: "1-800-662-4357",
    website: "https://samhsa.gov",
    availability: "24/7",
    type: "support",
  },
  {
    id: "nami-helpline",
    name: "NAMI HelpLine",
    description: "Information, resource referrals and support for mental health questions.",
    phone: "1-800-950-6264",
    text: "NAMI to 741741",
    website: "https://nami.org",
    availability: "Mon-Fri 10am-10pm ET",
    type: "support",
  },
  {
    id: "psychology-today",
    name: "Psychology Today",
    description: "Find therapists, psychiatrists, and mental health professionals near you.",
    website: "https://psychologytoday.com",
    availability: "Online directory",
    type: "therapy",
  },
]

interface EmergencyResourcesProps {
  triggerText?: string
  showUrgentOnly?: boolean
  className?: string
}

export function EmergencyResources({
  triggerText = "Emergency Resources",
  showUrgentOnly = false,
  className = "",
}: EmergencyResourcesProps) {
  const [isOpen, setIsOpen] = useState(false)

  const resources = showUrgentOnly ? EMERGENCY_RESOURCES.filter((r) => r.urgent) : EMERGENCY_RESOURCES

  const getTypeColor = (type: string) => {
    switch (type) {
      case "crisis":
        return "bg-red-500/20 text-red-400 border-red-400/30"
      case "emergency":
        return "bg-red-600/20 text-red-300 border-red-300/30"
      case "support":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30"
      case "therapy":
        return "bg-green-500/20 text-green-400 border-green-400/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-400/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "crisis":
        return AlertTriangle
      case "emergency":
        return Shield
      case "support":
        return Heart
      case "therapy":
        return MessageSquare
      default:
        return Phone
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`bg-red-500/20 text-red-400 border-red-400/30 hover:bg-red-500/30 ${className}`}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black/90 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-400" />
            Emergency Mental Health Resources
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            If you're in crisis or need immediate support, these resources are available to help you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {showUrgentOnly && (
            <div className="p-4 bg-red-500/10 border border-red-400/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">Crisis Support</span>
              </div>
              <p className="text-xs text-gray-300">
                If you're having thoughts of suicide or self-harm, please reach out immediately. You're not alone.
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {resources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type)
              return (
                <Card key={resource.id} className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-gray-400" />
                        <CardTitle className="text-white text-sm">{resource.name}</CardTitle>
                      </div>
                      <Badge className={getTypeColor(resource.type)} variant="outline">
                        {resource.type}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-300 text-xs">{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {resource.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <a
                            href={`tel:${resource.phone}`}
                            className="text-lime-400 hover:text-lime-300 text-sm font-mono"
                          >
                            {resource.phone}
                          </a>
                        </div>
                      )}

                      {resource.text && (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-3 w-3 text-gray-400" />
                          <span className="text-blue-400 text-sm">Text: {resource.text}</span>
                        </div>
                      )}

                      {resource.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3 text-gray-400" />
                          <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-400 text-xs">{resource.availability}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Remember</span>
            </div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• You are not alone in this journey</li>
              <li>• Seeking help is a sign of strength, not weakness</li>
              <li>• These feelings are temporary and can improve with support</li>
              <li>• Professional help is available and effective</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
