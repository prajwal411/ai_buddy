"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Instagram, Twitter, Youtube, MessageCircle } from "lucide-react"
import LazyVideo from "./lazy-video"
import Image from "next/image"

interface FooterContent {
  tagline: string
  copyright: string
}

const defaultContent: FooterContent = {
  tagline: "Your AI mental health companion. Anonymous. No signup. No tracking. Always here for you.",
  copyright: "© 2025 — MindBuddy. All rights reserved.",
}

export function AppverseFooter() {
  const [content, setContent] = useState<FooterContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("skitbit-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.footer) {
          setContent(parsed.footer)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section className="text-white">

      {/* Crisis/Emergency Banner */}
      <div className="container mx-auto px-4 pt-12 sm:pt-16">
        <div className="flex flex-col items-center gap-2">
          <Button
            asChild
            className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:bg-red-400"
          >
            <a href="https://www.opencounseling.com/suicide-hotlines" target="_blank" rel="noopener noreferrer">
              🚨 Crisis? Click for Emergency Hotlines
            </a>
          </Button>
          <span className="text-xs text-neutral-400 mt-1">If you or someone you know is in crisis, help is available 24/7.</span>
        </div>
      </div>

      {/* Footer spacing */}
      <div className="container mx-auto px-4 py-6"></div>

      {/* Footer */}
      <footer className="border-t border-white/10 pb-20 md:pb-10">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Image src="/placeholder-logo.svg" alt="MindBuddy logo" width={28} height={28} className="h-7 w-7" />
                <span className="text-xl font-semibold text-lime-300">MindBuddy</span>
              </div>
              <p className="max-w-sm text-sm text-neutral-400">{content.tagline}</p>
              <div className="mt-2">
                <span className="inline-block rounded bg-lime-900/30 text-lime-300 px-2 py-1 text-xs font-medium">Anonymous. No signup. No tracking.</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-2">
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Navigation</h5>
                <ul className="space-y-2 text-sm text-neutral-300">
                  <li><Link href="#chat" className="hover:text-lime-300">Chat</Link></li>
                  <li><Link href="#mood-tracker" className="hover:text-lime-300">Mood Tracker</Link></li>
                  <li><Link href="#wellness-tools" className="hover:text-lime-300">Wellness Tools</Link></li>
                  <li><Link href="#faq" className="hover:text-lime-300">FAQ</Link></li>
                  <li><Link href="#about" className="hover:text-lime-300">About</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Social media</h5>
                <ul className="space-y-2 text-sm text-neutral-300">
                  <li className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://twitter.com/mindbuddyai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-lime-300"
                      aria-label="Follow MindBuddy on Twitter"
                    >
                      X/Twitter
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://www.youtube.com/@mindbuddyai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-lime-300"
                      aria-label="Subscribe to MindBuddy on YouTube"
                    >
                      YouTube
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://instagram.com/mindbuddyai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-lime-300"
                      aria-label="Follow MindBuddy on Instagram"
                    >
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row">
            <p>{content.copyright}</p>
            <span className="text-xs text-neutral-400">This site does not collect personal data. For informational and support purposes only.</span>
            <div className="flex items-center gap-6">
              <Link href="/revisions" className="hover:text-lime-300">
                Revision Policy
              </Link>
              <Link href="/t&c" className="hover:text-lime-300">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
