"use client"

import { Wand2, Scissors, Sparkles, FlaskConical, ChevronRight, Lock } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const ACTIVE_FEATURES = [
  {
    href: "/style/makeup-transfer",
    icon: Wand2,
    title: "Celebrity Makeup Transfer",
    description: "Transfer a celebrity's makeup style onto your face using AI.",
    color: "#FDA4AF",
    bg: "from-white to-[#FDA4AF]/5",
  },
  {
    href: "/style/hair-transfer",
    icon: Scissors,
    title: "Celebrity Hairstyle Transfer",
    description: "Apply a celebrity's hairstyle to your photo with AI.",
    color: "#C4B5FD",
    bg: "from-white to-[#C4B5FD]/5",
  },
  {
    href: "/style/hair-styling",
    icon: Sparkles,
    title: "Personalized Hair Styling",
    description: "Get an AI-generated hairstyle matched to your face shape.",
    color: "#C4B5FD",
    bg: "from-white to-[#C4B5FD]/5",
  },
]

const BETA_FEATURES = [
  {
    icon: FlaskConical,
    title: "Makeup Overlay & Filter",
    description: "Try on makeup looks with real-time overlay and filter extraction.",
    color: "#F9A8C9",
  },
]

export default function StylePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-24">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-foreground">AI Style Studio</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Try styles on your photo with AI synthesis</p>
          </div>
        </header>

        <main className="px-4 py-6 space-y-6">
          {/* Active features */}
          <div className="space-y-3">
            {ACTIVE_FEATURES.map((feature) => (
              <Link key={feature.href} href={feature.href} className="block">
                <Card className={`p-5 rounded-2xl border-border/50 shadow-sm bg-linear-to-br ${feature.bg} hover:shadow-md transition-shadow`}>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-foreground mb-1">{feature.title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Beta features */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Coming Soon</p>
            <div className="space-y-3">
              {BETA_FEATURES.map((feature) => (
                <Card key={feature.title} className="p-5 rounded-2xl border-border/50 shadow-sm opacity-60">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-semibold text-foreground">{feature.title}</h2>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />BETA
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
