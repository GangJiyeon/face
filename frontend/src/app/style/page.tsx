"use client"

import { useState } from "react"
import { Sparkles, Scan, Scissors, Palette, Bell, Check } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const features = [
  {
    icon: Scan,
    title: "Face Shape Analysis",
    description: "AI-powered analysis to determine your unique face shape and proportions.",
  },
  {
    icon: Scissors,
    title: "Hairstyle Recommendations",
    description: "Get personalized hairstyle suggestions that complement your face shape.",
  },
  {
    icon: Palette,
    title: "Color Palette Suggestions",
    description: "Discover makeup and clothing colors that enhance your natural skin tone.",
  },
]

export default function StylePage() {
  const [showNotifyDialog, setShowNotifyDialog] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => {
        setShowNotifyDialog(false)
        setIsSubscribed(false)
        setEmail("")
      }, 2000)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-24">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-4 flex items-center gap-3">
          <h1 className="text-xl font-semibold text-foreground">Style Consultant</h1>
          <span className="px-2.5 py-1 text-xs font-medium bg-[#C4B5FD] text-white rounded-full">
            BETA
          </span>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8">
        {/* Coming Soon Hero */}
        <div className="text-center py-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-linear-to-br from-[#C4B5FD]/20 to-[#C4B5FD]/5 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(196,181,253,0.3),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(196,181,253,0.2),transparent_50%)]" />
            <Sparkles className="w-16 h-16 text-[#C4B5FD] relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3 text-balance">
            Your Personal Style Advisor
          </h2>
          <p className="text-muted-foreground max-w-xs mx-auto text-balance">
            We&apos;re building something special. AI-powered style recommendations tailored just for you.
          </p>
        </div>

        {/* Feature Preview Cards */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">What&apos;s Coming</h3>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-5 rounded-2xl border-border/50 shadow-sm bg-linear-to-br from-white to-[#C4B5FD]/5"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C4B5FD]/15 flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-[#C4B5FD]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{feature.title}</h4>
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-[#C4B5FD]/20 text-[#8B7DCF] rounded-full">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline Preview */}
        <Card className="p-5 rounded-2xl border-border/50 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Development Timeline</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[#C4B5FD]" />
                <div className="w-0.5 h-full bg-[#C4B5FD]/30 mt-1" />
              </div>
              <div className="pb-4">
                <p className="font-medium text-foreground text-sm">Face Shape Analysis</p>
                <p className="text-xs text-muted-foreground">In Development</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[#C4B5FD]/40" />
                <div className="w-0.5 h-full bg-[#C4B5FD]/30 mt-1" />
              </div>
              <div className="pb-4">
                <p className="font-medium text-foreground text-sm">Hairstyle AI</p>
                <p className="text-xs text-muted-foreground">Planned for Q3 2026</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[#C4B5FD]/20" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Color Analysis</p>
                <p className="text-xs text-muted-foreground">Planned for Q4 2026</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Notify Button */}
        <Button
          onClick={() => setShowNotifyDialog(true)}
          variant="outline"
          className="w-full py-6 rounded-full border-[#C4B5FD] text-[#8B7DCF] hover:bg-[#C4B5FD]/10 hover:text-[#8B7DCF] font-medium text-base"
        >
          <Bell className="w-5 h-5 mr-2" />
          Get Notified When Ready
        </Button>
      </main>

      {/* Notification Dialog */}
      <Dialog open={showNotifyDialog} onOpenChange={setShowNotifyDialog}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Get Early Access</DialogTitle>
            <DialogDescription className="text-center">
              Be the first to know when Style Consultant launches. We&apos;ll send you an email notification.
            </DialogDescription>
          </DialogHeader>
          {isSubscribed ? (
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-medium text-foreground">You&apos;re on the list!</p>
              <p className="text-sm text-muted-foreground">We&apos;ll notify you when it&apos;s ready.</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl h-12"
              />
              <Button
                onClick={handleSubscribe}
                className="w-full bg-[#C4B5FD] hover:bg-[#C4B5FD]/90 text-white rounded-full py-6 font-medium"
              >
                Notify Me
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav activeTab="style" />
      </div>
    </div>
  )
}
