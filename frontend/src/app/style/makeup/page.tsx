"use client"

import { useState, useEffect } from "react"
import { Palette, Camera, ChevronLeft } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { getHistory, getMakeupRecommendation } from "@/lib/api"

interface MakeupProduct {
  id: string
  name: string
  brand: string
  category: string
  image_url: string | null
}

interface MakeupResult {
  skin_type: string
  lighting_env: string
  palette: { foundation: string; blush: string; lip: string; eye: string }
  tip: string
  products: MakeupProduct[]
}

const LIGHTING_OPTIONS = [
  { key: "bright", label: "Bright Indoor", emoji: "💡" },
  { key: "dark",   label: "Dark Environment", emoji: "🌙" },
  { key: "outdoor", label: "Outdoor", emoji: "☀️" },
]

const PALETTE_LABELS: Record<keyof MakeupResult["palette"], string> = {
  foundation: "Foundation",
  blush: "Blush",
  lip: "Lip",
  eye: "Eye Shadow",
}

export default function MakeupPage() {
  const [skinType, setSkinType] = useState<string | null>(null)
  const [lighting, setLighting] = useState("bright")
  const [result, setResult] = useState<MakeupResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [initError, setInitError] = useState<"no_login" | "no_history" | null>(null)
  const [initLoading, setInitLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then((history) => {
        if (history.length === 0) { setInitError("no_history"); return }
        setSkinType(history[0].skin_type)
      })
      .catch((e: Error) => {
        setInitError(e.message.includes("Login") ? "no_login" : "no_history")
      })
      .finally(() => setInitLoading(false))
  }, [])

  useEffect(() => {
    if (!skinType) return
    setLoading(true)
    getMakeupRecommendation(skinType, lighting)
      .then(setResult)
      .finally(() => setLoading(false))
  }, [skinType, lighting])

  if (initLoading) return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#F9A8C9] border-t-transparent animate-spin" />
      </div>
    </div>
  )

  if (initError) return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="px-4 py-4 flex items-center gap-3">
            <Link href="/style"><ChevronLeft className="w-5 h-5 text-muted-foreground" /></Link>
            <h1 className="text-xl font-semibold text-foreground">Makeup Recommendation</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24">
          <div className="w-24 h-24 rounded-full bg-[#F9A8C9]/10 flex items-center justify-center mb-6">
            <Palette className="w-12 h-12 text-[#F9A8C9]" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {initError === "no_login" ? "Login required" : "No analysis history"}
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-xs">
            After skin analysis, you can get a makeup palette matched to your lighting environment.
          </p>
          <Link href="/upload">
            <Button className="bg-[#F9A8C9] hover:bg-[#F9A8C9]/90 text-white rounded-full px-8 py-6">
              <Camera className="w-5 h-5 mr-2" />Start Analysis
            </Button>
          </Link>
        </main>
        <BottomNav activeTab="style" />
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-24">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="px-4 py-4 flex items-center gap-3">
            <Link href="/style"><ChevronLeft className="w-5 h-5 text-muted-foreground" /></Link>
            <h1 className="text-xl font-semibold text-foreground">Makeup Recommendation</h1>
          </div>
        </header>

        <main className="px-4 py-6 space-y-6">
          {/* Lighting toggle */}
          <Card className="p-4 rounded-2xl border-border/50 shadow-sm">
            <p className="text-sm font-medium text-foreground mb-3">Today's Lighting Environment</p>
            <div className="flex gap-2">
              {LIGHTING_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setLighting(opt.key)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-sm font-medium transition-all
                    ${lighting === opt.key
                      ? "bg-[#F9A8C9] text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-[#F9A8C9]/10"
                    }`}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Palette */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-[#F9A8C9] border-t-transparent animate-spin" />
            </div>
          ) : result && (
            <>
              <Card className="p-4 rounded-2xl border-border/50 shadow-sm">
                <p className="text-sm font-medium text-foreground mb-4">Recommended Color Palette</p>
                <div className="grid grid-cols-4 gap-3">
                  {(Object.entries(result.palette) as [keyof MakeupResult["palette"], string][]).map(([key, hex]) => (
                    <div key={key} className="flex flex-col items-center gap-2">
                      <div
                        className="w-14 h-14 rounded-2xl shadow-sm border border-border/30"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-xs text-muted-foreground text-center">
                        {PALETTE_LABELS[key]}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {result.tip && (
                <Card className="p-4 rounded-2xl border-border/50 shadow-sm bg-linear-to-br from-white to-[#F9A8C9]/5">
                  <p className="text-sm font-medium text-foreground mb-2">Makeup Tip</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.tip}</p>
                </Card>
              )}

              {result.products.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Recommended Products</p>
                  <div className="space-y-3">
                    {result.products.map((product) => (
                      <Card key={product.id} className="p-3 rounded-2xl border-border/50 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                            {product.image_url
                              ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                              : <Palette className="w-6 h-6 text-muted-foreground" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.brand}</p>
                            <p className="text-xs text-[#F9A8C9] mt-0.5">{product.category}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <BottomNav activeTab="style" />
      </div>
    </div>
  )
}
