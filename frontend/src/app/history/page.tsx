"use client"

import { useState } from "react"
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

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const analysisData = [
  { date: "Apr 1", score: 72 },
  { date: "Apr 5", score: 74 },
  { date: "Apr 10", score: 71 },
  { date: "Apr 15", score: 76 },
  { date: "Apr 18", score: 78 },
  { date: "Apr 22", score: 75 },
  { date: "Apr 27", score: 77 },
]

const recentAnalyses = [
  {
    id: 1,
    date: "April 27, 2026",
    score: 77,
    summary: "Improved brightness detected. Redness slightly reduced compared to last week.",
  },
  {
    id: 2,
    date: "April 22, 2026",
    score: 75,
    summary: "Moisture levels stable. Consider adding hydrating products to your routine.",
  },
  {
    id: 3,
    date: "April 18, 2026",
    score: 78,
    summary: "Best score this month! Skin tone is evening out nicely.",
  },
  {
    id: 4,
    date: "April 15, 2026",
    score: 76,
    summary: "Minor trouble spots detected. Recommend gentle cleansing routine.",
  },
]

const daysWithAnalysis = [1, 5, 10, 15, 18, 22, 27]

export default function HistoryPage() {
  const [currentMonth, setCurrentMonth] = useState(3)
  const [currentYear] = useState(2026)
  const [hasHistory] = useState(true)

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
  }

  const nextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
  }

  if (!hasHistory) {
    return (
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
              No History Yet
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-xs">
              Start your first skin analysis to begin tracking your skin journey over time.
            </p>
            <Link href="/upload">
              <Button className="bg-[#F9A8C9] hover:bg-[#F9A8C9]/90 text-white rounded-full px-8 py-6 text-base font-medium">
                <Camera className="w-5 h-5 mr-2" />
                Start First Analysis
              </Button>
            </Link>
          </main>

          <BottomNav activeTab="history" />
        </div>
      </div>
    )
  }

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
                const isToday = day === 27 && currentMonth === 3
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
              <LineChart data={analysisData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  domain={[60, 100]}
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
              <span className="font-semibold text-foreground">75</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Best:</span>
              <span className="font-semibold text-green-600">78</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Trend:</span>
              <span className="font-semibold text-[#F9A8C9]">+5%</span>
            </div>
          </div>
        </Card>

        {/* Recent Analyses */}
        <div>
          <h2 className="font-semibold text-foreground mb-4">Recent Analyses</h2>
          <div className="space-y-3">
            {recentAnalyses.map((analysis) => (
              <Link key={analysis.id} href="/results">
                <Card className="p-4 rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Thumbnail placeholder */}
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#F9A8C9]/20 to-[#C4B5FD]/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#F9A8C9]/30 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#F9A8C9]/50" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">{analysis.date}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-foreground">{analysis.score}</span>
                          <span className="text-xs text-muted-foreground">/100</span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-2">
                        {analysis.summary}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <BottomNav activeTab="history" />
      </div>
    </div>
  )
}
