import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, BarChart3, Sparkles, Shield } from "lucide-react"

export function Hero() {
  const buttonNew = (
    <Button asChild className="rounded-full bg-lime-400 px-6 text-black hover:bg-lime-300">
      <a href="#chat">Start Your Journey</a>
    </Button>
  )

  return (
    <section className="relative isolate overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-14 sm:py-20">
          <div className="mb-5 flex items-center gap-2">
            <Heart className="h-8 w-8 text-lime-400" />
            <p className="text-sm uppercase tracking-[0.25em] text-lime-300/80">mindbuddy</p>
          </div>
          <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">YOUR AI</span>
            <span className="block text-lime-300 drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">MENTAL HEALTH</span>
            <span className="block">COMPANION</span>
          </h1>
          <p className="mt-6 max-w-2xl text-center text-lg text-gray-300 leading-relaxed">
            Get personalized support, track your mood, and access wellness tools designed to help you thrive. Your
            mental health journey starts here.
          </p>
          <div className="mt-8">{buttonNew}</div>

          {/* Feature cards */}
          <div className="mt-12 grid w-full gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {featureData.map((feature, i) => {
              const visibility = i <= 2 ? "block" : i === 3 ? "hidden md:block" : i === 4 ? "hidden xl:block" : "hidden"

              return (
                <div key={i} className={visibility}>
                  <FeatureCard
                    title={feature.title}
                    sub={feature.sub}
                    icon={feature.icon}
                    gradient={feature.gradient}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  title = "AI Chat",
  sub = "24/7 supportive conversations",
  icon: Icon = MessageCircle,
  gradient = "from-[#0f172a] via-[#14532d] to-[#052e16]",
}: {
  title?: string
  sub?: string
  icon?: any
  gradient?: string
}) {
  return (
    <div className="relative rounded-[28px] glass-border bg-neutral-900 p-2">
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-black">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

        <div className="relative z-10 p-4 h-full flex flex-col justify-between">
          <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />

          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-3 rounded-full bg-lime-400/20 border border-lime-400/30">
              <Icon className="h-8 w-8 text-lime-400" />
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold text-white/90">{title}</div>
              <p className="text-xs text-white/70 leading-relaxed">{sub}</p>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center justify-center rounded-full bg-black/40 px-3 py-1 text-[10px] uppercase tracking-wider text-lime-300">
            mindbuddy
          </div>
        </div>
      </div>
    </div>
  )
}

const featureData = [
  {
    title: "AI Chat",
    sub: "24/7 supportive conversations with your personal AI companion",
    icon: MessageCircle,
    gradient: "from-[#0b0b0b] via-[#0f172a] to-[#020617]",
  },
  {
    title: "Mood Tracking",
    sub: "Track your emotions and discover patterns in your mental health",
    icon: BarChart3,
    gradient: "from-[#0b1a0b] via-[#052e16] to-[#022c22]",
  },
  {
    title: "Wellness Tools",
    sub: "Guided meditation, breathing exercises, and mindfulness practices",
    icon: Heart,
    gradient: "from-[#001028] via-[#0b355e] to-[#052e5e]",
  },
  {
    title: "Personalized",
    sub: "AI learns your patterns and provides tailored mental health support",
    icon: Sparkles,
    gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
  },
  {
    title: "Private & Safe",
    sub: "Your conversations are encrypted and completely confidential",
    icon: Shield,
    gradient: "from-[#0b0b0b] via-[#111827] to-[#052e16]",
  },
]
