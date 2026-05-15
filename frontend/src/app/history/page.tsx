"use client"

import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, Camera } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { getHistory } from "@/lib/api"
import { HistoryItem } from "@/types/api"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

function formatDateShort(iso: string) {
  const d = new Date(iso)
  return `${months[d.getMonth()].slice(0, 3)} ${d.getDate()}`
}

function formatDateLong(iso: string) {
  const d = new Date(iso)
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function getSkinTypeSummary(skin_type: string, overall_score: number): string {
  const typeMap: Record<string, string> = {
    dry: "건조한 피부 상태입니다. 보습 관리에 신경써주세요.",
    oily: "피지 분비가 활발합니다. 유분 조절이 필요합니다.",
    sensitive: "피부 자극에 주의가 필요합니다. 진정 케어를 추천합니다.",
    combination: "복합성 피부입니다. 부위별 맞춤 케어가 효과적입니다.",
  }
  const base = typeMap[skin_type] ?? "피부 분석이 완료되었습니다."
  if (overall_score >= 75) return `컨디션이 좋습니다. ${base}`
  if (overall_score >= 50) return `보통 컨디션입니다. ${base}`
  return `관리가 필요한 상태입니다. ${base}`
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedOut, setIsLoggedOut] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch((e: Error) => {
        if (e.message.includes("로그인")) setIsLoggedOut(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  // 현재 뷰 월의 분석 날짜 목록
  const daysWithAnalysis = history
    .filter(r => {
      const d = new Date(r.analyzed_at)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .map(r => new Date(r.analyzed_at).getDate())

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const today = new Date()

  // 차트용: 최신 10개, 날짜 오름차순
  const chartData = [...history]
    .slice(0, 10)
    .reverse()
    .map(r => ({ date: formatDateShort(r.analyzed_at), score: r.overall_score }))

  const avg = history.length
    ? Math.round(history.reduce((s, r) => s + r.overall_score, 0) / history.length)
    : 0
  const best = history.length ? Math.max(...history.map(r => r.overall_score)) : 0
  const trend = history.length >= 2
    ? ((history[0].overall_score - history[history.length - 1].overall_score) /
        history[history.length - 1].overall_score * 100).toFixed(1)
    : null

  const EmptyOrLogout = (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-foreground">My Skin Journey</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24">
          <div className="w-24 h-24 rounded-full bg-[#F9A8C9]/10 flex items-center justify-center mb-6">
            <Calendar className="w-12 h-12 text-[#F9A8C9]" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
            {isLoggedOut ? "로그인이 필요합니다" : "No History Yet"}
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-xs">
            {isLoggedOut
              ? "히스토리를 보려면 로그인 후 분석을 진행해주세요."
              : "Start your first skin analysis to begin tracking your skin journey over time."}
          </p>
          <Link href="/upload">
            <Button className="bg-[#F9A8C9] hover:bg-[#F9A8C9]/90 text-white rounded-full px-8 py-6 text-base font-medium">
              <Camera className="w-5 h-5 mr-2" />
              {isLoggedOut ? "분석 시작하기" : "Start First Analysis"}
            </Button>
          </Link>
        </main>
        <BottomNav activeTab="history" />
      </div>
    </div>
  )

  if (loading) return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#F9A8C9] border-t-transparent animate-spin" />
      </div>
    </div>
  )

  if (isLoggedOut || history.length === 0) return EmptyOrLogout

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-24">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-foreground">My Skin Journey</h1>
          </div>
        </header>

        <main className="px-4 py-6 space-y-6">
          {/* Monthly Calendar Strip */}
          <Card className="p-4 rounded-2xl border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h2 className="font-semibold text-foreground">
                {months[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
              <div className="flex gap-2 min-w-max pb-2">
                {days.map((day) => {
                  const hasAnalysis = daysWithAnalysis.includes(day)
                  const isToday =
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear()
                  return (
                    <button
                      key={day}
                      className={`
                        flex flex-col items-center justify-center w-11 h-14 rounded-xl transition-all
                        ${hasAnalysis ? "bg-[#F9A8C9]/10" : "bg-transparent"}
                        ${isToday ? "ring-2 ring-[#F9A8C9]" : ""}
                        hover:bg-[#F9A8C9]/5
                      `}
                    >
                      <span className={`text-sm font-medium ${isToday ? "text-[#F9A8C9]" : "text-foreground"}`}>
                        {day}
                      </span>
                      {hasAnalysis && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F9A8C9] mt-1" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Skin Trend Chart */}
          <Card className="p-4 rounded-2xl border-border/50 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#F9A8C9]" />
              <h2 className="font-semibold text-foreground">Skin Score Trend</h2>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F9A8C9" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#F9A8C9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ color: "#374151", fontWeight: 600 }}
                    itemStyle={{ color: "#F9A8C9" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#F9A8C9"
                    strokeWidth={3}
                    dot={{ fill: "#F9A8C9", strokeWidth: 0, r: 4 }}
                    activeDot={{ fill: "#F9A8C9", strokeWidth: 0, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Average:</span>
                <span className="font-semibold text-foreground">{avg}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Best:</span>
                <span className="font-semibold text-green-600">{best}</span>
              </div>
              {trend !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Trend:</span>
                  <span className={`font-semibold ${Number(trend) >= 0 ? "text-[#F9A8C9]" : "text-red-400"}`}>
                    {Number(trend) >= 0 ? "+" : ""}{trend}%
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Analyses */}
          <div>
            <h2 className="font-semibold text-foreground mb-4">Recent Analyses</h2>
            <div className="space-y-3">
              {history.slice(0, 10).map((item) => (
                <Card key={item.id} className="p-4 rounded-2xl border-border/50 shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#F9A8C9]/20 to-[#C4B5FD]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-[#F9A8C9]">{Math.round(item.overall_score)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">{formatDateLong(item.analyzed_at)}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#F9A8C9]/10 text-[#F9A8C9] font-medium">
                          {item.skin_type}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-2">
                        {getSkinTypeSummary(item.skin_type, item.overall_score)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <BottomNav activeTab="history" />
      </div>
    </div>
  )
}
