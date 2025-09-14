import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { AnonymousAuth } from "@/components/anonymous-auth"
import { AIChat } from "@/components/ai-chat"
import { MoodTracker } from "@/components/mood-tracker"
import { WellnessTools } from "@/components/wellness-tools"
import { UserDashboard } from "@/components/user-dashboard"
import { AppverseFooter } from "@/components/appverse-footer"
import Script from "next/script"

// ✅ Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
  const appStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPageElement",
    "@id": "https://mindbuddy.com/#chat",
    name: "AI Mental Health Chat",
    description: "AI-powered mental health support with personalized conversations and wellness tools",
    url: "https://mindbuddy.com/#chat",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "MindBuddy AI Chat",
      description: "AI mental health companion providing 24/7 supportive conversations",
      applicationCategory: "HealthApplication",
    },
  }

  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://mindbuddy.com/",
    name: "MindBuddy | Your AI Mental Health Companion",
    description:
      "Get personalized mental health support with AI-powered conversations, mood tracking, and wellness tools designed to help you thrive.",
    url: "https://mindbuddy.com/",
    mainEntity: {
      "@type": "Organization",
      name: "MindBuddy",
      url: "https://mindbuddy.com",
    },
    hasPart: [
      {
        "@type": "WebPageElement",
        "@id": "https://mindbuddy.com/#chat",
        name: "AI Chat Section",
        url: "https://mindbuddy.com/#chat",
      },
    ],
  }

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <Hero />

        <section className="py-16 px-4">
          <div className="max-w-md mx-auto">
            <AnonymousAuth />
          </div>
        </section>

        <AIChat />
        <MoodTracker />
        <WellnessTools />
        <UserDashboard />
        <AppverseFooter />
      </main>

      {/* JSON-LD structured data */}
      <Script
        id="app-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(appStructuredData),
        }}
      />

      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />
    </>
  )
}
