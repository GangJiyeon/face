"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { AnalyzeResponse } from "@/types/api"
import { ChevronLeft, Calendar, Bookmark, LogIn, TrendingUp } from "lucide-react"
import Link from "next/link"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"



const faceLandmarks = [
  { x: 30, y: 35 },
  { x: 38, y: 33 },
  { x: 62, y: 33 },
  { x: 70, y: 35 },
  { x: 50, y: 45 },
  { x: 50, y: 55 },
  { x: 42, y: 58 },
  { x: 58, y: 58 },
  { x: 35, y: 70 },
  { x: 50, y: 72 },
  { x: 65, y: 70 },
  { x: 25, y: 50 },
  { x: 75, y: 50 },
  { x: 50, y: 25 },
  { x: 35, y: 28 },
  { x: 65, y: 28 },
  { x: 20, y: 45 },
  { x: 80, y: 45 },
  { x: 30, y: 80 },
  { x: 50, y: 85 },
  { x: 70, y: 80 },
]


function ScoreCard({
  label,
  score,
  color,
}: {
  label: string
  score: number
  color: string
}) {
  return (
    <Card className="border-0 bg-white shadow-sm">
      <CardContent className="p-3 text-center lg:p-4">
        <div
          className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full lg:h-12 lg:w-12"
          style={{ backgroundColor: `${color}20` }}
        >
          <span className="text-sm font-bold lg:text-base" style={{ color }}>
            {score}
          </span>
        </div>
        <p className="text-xs text-muted-foreground lg:text-sm">{label}</p>
        <div className="mt-2 hidden h-1.5 w-full overflow-hidden rounded-full bg-muted lg:block">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${score}%`, backgroundColor: color }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function RecommendedProductCard({
  name,
  image,
  reason,
}: {
  name: string
  image: string
  reason: string
}) {
  return (
    <Card className="border-0 bg-linear-to-br from-[#FDF2F8] to-[#F3E8FF]/50 shadow-sm">
      <CardContent className="flex gap-4 p-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <h4 className="font-medium text-foreground">{name}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{reason}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [analysisData, setAnalysisData] = useState<AnalyzeResponse | null>(null)

  const [isLoggedIn] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const handleSave = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true)
    }
  }

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  useEffect(() => {
  const data = searchParams.get("data")
  if (data) {
      try {
        setAnalysisData(JSON.parse(data))
      } catch (e) {
        console.error("Failed to parse analysis data")
      }
    }
  }, [searchParams])

  const radarData = analysisData ? [
    { metric: "Redness", value: analysisData.skin_scores.redness.chart_score, fullMark: 100 },
    { metric: "Tone", value: analysisData.skin_scores.tone.chart_score, fullMark: 100 },
    { metric: "Brightness", value: analysisData.skin_scores.brightness.chart_score, fullMark: 100 },
    { metric: "Moisture", value: analysisData.skin_scores.moisture.chart_score, fullMark: 100 },
    { metric: "Trouble", value: analysisData.skin_scores.trouble.chart_score, fullMark: 100 },
  ] : []

  const scoreMetrics = analysisData ? [
    { label: "Redness", score: analysisData.skin_scores.redness.score, color: "#F9A8C9" },
    { label: "Tone", score: analysisData.skin_scores.tone.score, color: "#C4B5FD" },
    { label: "Brightness", score: analysisData.skin_scores.brightness.score, color: "#FCD34D" },
    { label: "Moisture", score: analysisData.skin_scores.moisture.score, color: "#93C5FD" },
  ] : []

  // recommendedProducts 부분 교체
  const recommendedProducts = analysisData?.products.map(p => ({
    id: p.id,
    name: p.name,
    image: p.image_url || "/placeholder.svg?height=120&width=120",
    reason: p.reason,
  })) || []

  const overallScore = analysisData ? Math.round(analysisData.skin_scores.overall) : 0



  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border/50 bg-white/80 backdrop-blur-lg">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 transition-colors hover:bg-muted lg:hidden"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
                <span className="sr-only">Back</span>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-foreground lg:text-xl">
                  Analysis Result
                </h1>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{today}</span>
                </div>
              </div>
            </div>
            {/* Save button in header on desktop */}
            <Button
              variant="outline"
              onClick={handleSave}
              className="hidden items-center gap-2 rounded-full border-[#F9A8C9] px-5 text-[#F9A8C9] hover:bg-[#F9A8C9]/10 hover:text-[#F9A8C9] lg:flex"
            >
              <Bookmark className="h-4 w-4" />
              Save Results
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
          <div className="p-4 lg:grid lg:grid-cols-[5fr_7fr] lg:gap-8 lg:p-8">

            {/* ── Left column: face image + score chips ── */}
            <div className="space-y-4 lg:space-y-6">
              {/* Face image */}
              <Card className="overflow-hidden border-0 shadow-md">
                <CardContent className="p-0">
                  <div className="relative aspect-4/5 w-full bg-linear-to-br from-[#FDF2F8] to-[#F3E8FF] lg:aspect-3/4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 120" className="h-[80%] w-[60%] opacity-30">
                        <ellipse cx="50" cy="55" rx="35" ry="45" fill="#C4B5FD" />
                      </svg>
                    </div>
                    {faceLandmarks.map((point, index) => (
                      <div
                        key={index}
                        className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F9A8C9] shadow-sm shadow-[#F9A8C9]/50"
                        style={{ left: `${point.x}%`, top: `${point.y}%` }}
                      >
                        <div className="absolute inset-0 animate-ping rounded-full bg-[#F9A8C9] opacity-30" />
                      </div>
                    ))}
                    <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                      21 points analyzed
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Score cards */}
              <div className="grid grid-cols-4 gap-2 lg:grid-cols-2 lg:gap-3">
                {scoreMetrics.map((metric) => (
                  <ScoreCard
                    key={metric.label}
                    label={metric.label}
                    score={metric.score}
                    color={metric.color}
                  />
                ))}
              </div>
            </div>

            {/* ── Right column: overview + chart + products ── */}
            <div className="mt-6 space-y-4 lg:mt-0 lg:space-y-6">

              {/* Overall score banner - desktop only */}
              <Card className="hidden border-0 bg-linear-to-br from-[#FDF2F8] to-[#F3E8FF] shadow-sm lg:block">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Skin Score</p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-foreground">{overallScore}</span>
                      <span className="text-lg text-muted-foreground">/100</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Good condition — keep up your routine!
                    </p>
                  </div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                    <TrendingUp className="h-9 w-9 text-[#F9A8C9]" />
                  </div>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 lg:p-6">
                  <h2 className="mb-4 text-center text-sm font-medium text-foreground lg:text-left lg:text-base">
                    Skin Condition Overview
                  </h2>
                  <div className="h-64 lg:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} outerRadius="70%">
                        <PolarGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                        <PolarAngleAxis
                          dataKey="metric"
                          tick={{ fill: "#6B7280", fontSize: 11 }}
                          tickLine={false}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={false}
                          axisLine={false}
                        />
                        <Radar
                          name="Score"
                          dataKey="value"
                          stroke="#F9A8C9"
                          strokeWidth={2}
                          fill="#F9A8C9"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Products */}
              <section>
                <h2 className="mb-4 text-base font-semibold text-foreground">
                  Recommended for you
                </h2>
                <div className="flex flex-col gap-3">
                  {recommendedProducts.map((product) => (
                    <RecommendedProductCard
                      key={product.id}
                      name={product.name}
                      image={product.image}
                      reason={product.reason}
                    />
                  ))}
                </div>
              </section>

              {/* Save button - mobile only */}
              <Button
                variant="outline"
                onClick={handleSave}
                className="w-full rounded-full border-[#F9A8C9] py-6 text-[#F9A8C9] hover:bg-[#F9A8C9]/10 hover:text-[#F9A8C9] lg:hidden"
              >
                <Bookmark className="mr-2 h-5 w-5" />
                Save Results
              </Button>
            </div>
          </div>
        </main>

        <BottomNav />
      </div>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-[#F9A8C9]/20 to-[#C4B5FD]/20">
              <LogIn className="h-8 w-8 text-[#F9A8C9]" />
            </div>
            <DialogTitle className="text-xl">Save your results</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Sign in to save your analysis results and track your skin health over time.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-3">
            <Button className="w-full rounded-full bg-[#F9A8C9] py-6 text-white hover:bg-[#F9A8C9]/90">
              Sign In
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowLoginDialog(false)}
              className="w-full rounded-full py-6 text-muted-foreground"
            >
              Maybe later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
