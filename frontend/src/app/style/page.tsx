"use client"

import { useState, useEffect } from "react"
import { Scissors, Camera, ChevronRight } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { getHistory, getHairstyleRecommendation } from "@/lib/api"

interface HairstyleResult {
  face_shape: string
  face_shape_ko: string
  description: string
  styles: {
    name_ko: string
    reason: string
    length: string
    tags: string[]
  }[]
}

const FACE_SHAPE_EMOJI: Record<string, string> = {
  oval: "🥚",
  round: "⭕",
  square: "⬛",
  heart: "🫀",
  long: "📏",
}

const LENGTH_KO: Record<string, string> = {
  short: "숏",
  medium: "미디엄",
  long: "롱",
}

export default function StylePage() {
  const [result, setResult] = useState<HairstyleResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<"no_history" | "no_login" | null>(null)

  useEffect(() => {
    getHistory()
      .then((history) => {
        if (history.length === 0) {
          setError("no_history")
          return
        }
        const latest = history[0]
        if (!latest.landmarks || latest.landmarks.length === 0) {
          setError("no_history")
          return
        }
        return getHairstyleRecommendation(latest.landmarks)
      })
      .then((data) => {
        if (data) setResult(data)
      })
      .catch((e: Error) => {
        if (e.message.includes("로그인")) setError("no_login")
        else setError("no_history")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C4B5FD] border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground mt-3">얼굴형 분석 중...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-foreground">Style Consultant</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24">
          <div className="w-24 h-24 rounded-full bg-[#C4B5FD]/10 flex items-center justify-center mb-6">
            <Scissors className="w-12 h-12 text-[#C4B5FD]" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
            {error === "no_login" ? "로그인이 필요합니다" : "분석 기록이 없어요"}
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-xs">
            {error === "no_login"
              ? "로그인 후 피부 분석을 진행하면 얼굴형 기반 헤어스타일을 추천받을 수 있어요."
              : "먼저 피부 분석을 진행해주세요. 분석 결과를 바탕으로 얼굴형을 파악하고 헤어스타일을 추천해드려요."}
          </p>
          <Link href="/upload">
            <Button className="bg-[#C4B5FD] hover:bg-[#C4B5FD]/90 text-white rounded-full px-8 py-6 text-base font-medium">
              <Camera className="w-5 h-5 mr-2" />
              분석 시작하기
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
            <h1 className="text-xl font-semibold text-foreground">Style Consultant</h1>
          </div>
        </header>

        <main className="px-4 py-6 space-y-6">
          {/* 얼굴형 결과 카드 */}
          <Card className="p-5 rounded-2xl border-border/50 shadow-sm bg-linear-to-br from-white to-[#C4B5FD]/5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#C4B5FD]/15 flex items-center justify-center text-3xl shrink-0">
                {FACE_SHAPE_EMOJI[result!.face_shape] ?? "✨"}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">내 얼굴형</p>
                <h2 className="text-2xl font-bold text-foreground">{result!.face_shape_ko}</h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {result!.description}
                </p>
              </div>
            </div>
          </Card>

          {/* 추천 헤어스타일 목록 */}
          <div>
            <h2 className="font-semibold text-foreground mb-3">추천 헤어스타일</h2>
            <div className="space-y-3">
              {result!.styles.map((style, i) => (
                <Card key={i} className="p-4 rounded-2xl border-border/50 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C4B5FD]/15 flex items-center justify-center shrink-0">
                      <Scissors className="w-5 h-5 text-[#C4B5FD]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{style.name_ko}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#C4B5FD]/10 text-[#8B7DCF]">
                          {LENGTH_KO[style.length] ?? style.length}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {style.reason}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {style.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 다시 분석하기 */}
          <Link href="/upload">
            <Button
              variant="outline"
              className="w-full py-6 rounded-full border-[#C4B5FD] text-[#8B7DCF] hover:bg-[#C4B5FD]/10 font-medium text-base"
            >
              <Camera className="w-5 h-5 mr-2" />
              새로 분석하기
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
          </Link>
        </main>

        <BottomNav activeTab="style" />
      </div>
    </div>
  )
}
