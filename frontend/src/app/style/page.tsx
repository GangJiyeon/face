"use client"

import { Scissors, Palette, ChevronRight, Sparkles } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const features = [
  {
    href: "/style/hairstyle",
    icon: Scissors,
    title: "Hairstyle Recommendation",
    description: "Analyze your face shape and find hairstyles that suit you best.",
    color: "#C4B5FD",
    bg: "from-white to-[#C4B5FD]/5",
  },
  {
    href: "/style/makeup",
    icon: Palette,
    title: "Makeup Recommendation",
    description: "Get a color palette matched to your lighting environment and skin type.",
    color: "#F9A8C9",
    bg: "from-white to-[#F9A8C9]/5",
  },
]

export default function StylePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-24">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="px-4 py-4 flex items-center gap-3">
            <h1 className="text-xl font-semibold text-foreground">Style Consultant</h1>
          </div>
        </header>

        <main className="px-4 py-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#C4B5FD]" />
            <p className="text-sm text-muted-foreground">Recommendations based on your latest analysis</p>
          </div>

          {features.map((feature) => (
            <Link key={feature.href} href={feature.href}>
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
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </main>

        <BottomNav activeTab="style" />
      </div>
    </div>
  )
}
