"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { SkinSummaryCard } from "@/components/skin-summary-card"
import { StartAnalysisButton } from "@/components/start-analysis-button"
import { RecommendedProducts } from "@/components/recommended-products"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { getHistory, getProductRecommendations } from "@/lib/api"
import { HistoryItem, Product } from "@/types/api"
import Link from "next/link"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good Morning"
  if (h < 18) return "Good Afternoon"
  return "Good Evening"
}

function calcStats(history: HistoryItem[]) {
  if (!history.length) return null
  const scores = history.map((h) => h.overall_score)
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const improvement = history.length >= 2
    ? Math.round(history[0].overall_score - history[history.length - 1].overall_score)
    : null

  // streak: consecutive days from today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daySet = new Set(
    history.map((h) => {
      const d = new Date(h.analyzed_at)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  )
  let streak = 0
  const cursor = new Date(today)
  while (daySet.has(cursor.getTime())) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return { total: history.length, avg, streak, improvement }
}

export default function HomePage() {
  const [history, setHistory] = useState<HistoryItem[] | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then((h) => {
        setHistory(h)
        if (h.length > 0) {
          return getProductRecommendations(h[0].skin_scores)
            .then((data) => setProducts(data.products))
            .catch(() => {})
        }
      })
      .catch((e: Error) => {
        if (e.message.includes("Login")) setIsGuest(true)
        else setHistory([])
      })
      .finally(() => setLoading(false))
  }, [])

  const latest = history?.[0] ?? null
  const stats = history ? calcStats(history) : null

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <main className="min-w-0 flex-1 overflow-hidden">
        <div className="w-full lg:grid lg:grid-cols-2 lg:gap-8 lg:p-8">
          <div className="lg:hidden">
            <Header />
          </div>

          {/* Left column */}
          <div className="lg:space-y-6">
            <div className="hidden lg:mb-6 lg:block">
              <h2 className="text-2xl font-bold text-foreground">
                {loading ? "Loading..." : isGuest ? "안녕하세요 👋" : `${getGreeting()}!`}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {isGuest
                  ? "로그인 없이도 피부 분석 체험해볼 수 있어요. 사진 한 장으로 시작해보세요!"
                  : latest
                  ? "Here's your latest skin analysis summary."
                  : "아직 분석 기록이 없어요. 첫 번째 분석을 시작해보세요!"}
              </p>
            </div>

            {/* Guest banner */}
            {isGuest && (
              <div className="mx-5 mb-4 rounded-2xl bg-linear-to-br from-[#FDF2F8] to-[#F3E8FF] p-5 lg:mx-0">
                <p className="font-semibold text-foreground mb-1">로그인 없이 테스트해보세요 📸</p>
                <p className="text-sm text-muted-foreground mb-4">
                  계정 없이도 사진 한 장으로 피부 분석, 색조 팔레트, 헤어스타일 추천까지 바로 체험할 수 있어요.
                </p>
                <Link href="/upload">
                  <Button className="rounded-full bg-[#F9A8C9] hover:bg-[#F9A8C9]/90 text-white px-6">
                    <Camera className="w-4 h-4 mr-2" />
                    지금 바로 분석하기
                  </Button>
                </Link>
              </div>
            )}

            {!isGuest && <SkinSummaryCard item={latest} />}

            <div className="lg:hidden">
              <StartAnalysisButton />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:space-y-6">
            {/* Weekly stats */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-border/50 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">My Stats</h3>
                {isGuest ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <p className="text-muted-foreground text-sm text-center">
                      로그인하면 분석 히스토리와 통계를 확인할 수 있어요.
                    </p>
                    <Link href="/upload">
                      <Button className="rounded-full bg-[#F9A8C9] hover:bg-[#F9A8C9]/90 text-white px-6">
                        <Camera className="w-4 h-4 mr-2" />
                        분석 시작하기
                      </Button>
                    </Link>
                  </div>
                ) : loading ? (
                  <div className="flex justify-center py-6">
                    <div className="w-6 h-6 rounded-full border-2 border-[#F9A8C9] border-t-transparent animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-linear-to-br from-[#FDF2F8] to-[#F3E8FF] p-4">
                      <p className="text-sm text-muted-foreground">Analyses</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{stats?.total ?? 0}</p>
                    </div>
                    <div className="rounded-xl bg-linear-to-br from-[#FDF2F8] to-[#F3E8FF] p-4">
                      <p className="text-sm text-muted-foreground">Avg Score</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{stats?.avg ?? "-"}</p>
                    </div>
                    <div className="rounded-xl bg-linear-to-br from-[#FDF2F8] to-[#F3E8FF] p-4">
                      <p className="text-sm text-muted-foreground">Streak</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">
                        {stats ? `${stats.streak}d` : "-"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-linear-to-br from-[#FDF2F8] to-[#F3E8FF] p-4">
                      <p className="text-sm text-muted-foreground">Improvement</p>
                      <p className={`mt-1 text-2xl font-bold ${
                        stats?.improvement != null && stats.improvement > 0 ? "text-green-600"
                        : stats?.improvement != null && stats.improvement < 0 ? "text-red-400"
                        : "text-foreground"
                      }`}>
                        {stats?.improvement != null
                          ? `${stats.improvement > 0 ? "+" : ""}${stats.improvement}`
                          : "-"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <RecommendedProducts products={products} />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
