"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { AnalyzeResponse } from "@/types/api"
import { ChevronLeft, Calendar, Bookmark, LogIn, TrendingUp, Palette, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import { getProductRecommendations } from "@/lib/api"
import { Product } from "@/types/api"
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
  const router = useRouter()
  const { user } = useAuth()
  const [analysisData, setAnalysisData] = useState<AnalyzeResponse | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [koreanOnly, setKoreanOnly] = useState(false)
  const [koreanProducts, setKoreanProducts] = useState<Product[] | null>(null)
  const [koreanLoading, setKoreanLoading] = useState(false)



  
  const handleSave = () => {
    if (user) {
      router.push("/history")
    } else {
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
        const parsed = JSON.parse(data)
        setAnalysisData(parsed)
        if (parsed.image_url) {
          setUploadedImage(parsed.image_url)
          return
        }
      } catch (e) {
        console.error("Failed to parse analysis data")
      }
    }
    const savedImage = sessionStorage.getItem('analysisImage')
    if (savedImage) {
      setUploadedImage(savedImage)
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

  useEffect(() => {
    if (!koreanOnly || !analysisData) { setKoreanProducts(null); return }
    setKoreanLoading(true)
    getProductRecommendations(analysisData.skin_scores, true)
      .then((data) => setKoreanProducts(data.products))
      .catch(() => setKoreanProducts([]))
      .finally(() => setKoreanLoading(false))
  }, [koreanOnly, analysisData])

  // Build recommended products list
  const sourceProducts = koreanOnly ? (koreanProducts ?? analysisData?.products ?? []) : (analysisData?.products ?? [])
  const recommendedProducts = sourceProducts.map(p => ({
    id: p.id,
    name: p.name,
    image: p.image_url || "/placeholder.svg?height=120&width=120",
    reason: p.reason,
  }))

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
              {user ? "View History" : "Save Results"}
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
      
      {/* Uploaded image */}
      {uploadedImage ? (
        <img
          src={uploadedImage}
          alt="Analyzed face"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 100 120" className="h-[80%] w-[60%] opacity-30">
            <ellipse cx="50" cy="55" rx="35" ry="45" fill="#C4B5FD" />
          </svg>
        </div>
      )}

      {/* SVG overlay */}
      {uploadedImage && analysisData?.landmarks && analysisData.landmarks.length > 0 && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${analysisData.image_size.width} ${analysisData.image_size.height}`}
          preserveAspectRatio="xMidYMid slice"
        >
          {/* ROI region semi-transparent overlay */}
          {/* Forehead region */}
          <polygon
            points={analysisData.landmarks ?
              [251,284,332,297,338,10,109,67,54,21,162,127,234,93,132,58,172,136,150,149,176,148,152,377,378,365,397,288,361,323,454,356,389].map(i =>
                analysisData.landmarks[i] ? `${analysisData.landmarks[i][0]},${analysisData.landmarks[i][1]}` : ''
              ).join(' ') : ''}
            fill="#F9A8C9"
            fillOpacity="0.2"
            stroke="#F9A8C9"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          {/* Left cheek */}
          <polygon
            points={analysisData.landmarks ?
              [116,117,118,119,120,121,126,142,203].map(i =>
                `${analysisData.landmarks[i][0]},${analysisData.landmarks[i][1]}`
              ).join(' ') : ''}
            fill="#C4B5FD"
            fillOpacity="0.2"
            stroke="#C4B5FD"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          {/* Right cheek */}
          <polygon
            points={analysisData.landmarks ?
              [345,346,347,348,349,350,355,371,423].map(i =>
                `${analysisData.landmarks[i][0]},${analysisData.landmarks[i][1]}`
              ).join(' ') : ''}
            fill="#C4B5FD"
            fillOpacity="0.2"
            stroke="#C4B5FD"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          {[
            // Nose center
            1, 4, 5, 6, 195, 197, 168, 9, 8,
            // Around eyes
            33, 133, 362, 263, 159, 145, 386, 374,
            // Eyebrows
            55, 285, 52, 282, 65, 295,
            // Around mouth
            61, 291, 17, 18, 200, 13, 14, 78, 308,
            // Nose sides
            48, 278, 219, 439,
            // Forehead
            151, 10, 338,
            // Chin
            152, 175, 176, 177, 178,
          ].map(i =>
            analysisData.landmarks[i] ? (
              <circle
                key={i}
                cx={analysisData.landmarks[i][0]}
                cy={analysisData.landmarks[i][1]}
                r="1.5"
                fill="#F9A8C9"
                fillOpacity="0.9"
              />
            ) : null
          )}
        </svg>
      )}

      <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
        21 points analyzed
      </div>
    </div>
  </CardContent>
</Card>



              {/* Skin type badge - mobile only */}
              {analysisData?.skin_type && (
                <div className="flex items-center gap-2 lg:hidden">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F9A8C9]/15 text-[#F9A8C9] capitalize">
                    {analysisData.skin_type} skin
                  </span>
                  <span className="text-sm text-muted-foreground">Overall: <span className="font-semibold text-foreground">{overallScore}</span>/100</span>
                </div>
              )}

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
                    {analysisData?.skin_type && (
                      <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-white text-[#F9A8C9] shadow-sm capitalize">
                        {analysisData.skin_type} skin
                      </span>
                    )}
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-foreground">
                    Recommended for you
                  </h2>
                  <button
                    onClick={() => setKoreanOnly(v => !v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      koreanOnly
                        ? "bg-[#F9A8C9] text-white"
                        : "bg-muted text-muted-foreground hover:bg-[#F9A8C9]/10"
                    }`}
                  >
                    🇰🇷 K-Beauty only
                  </button>
                </div>
                {koreanLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-7 h-7 rounded-full border-2 border-[#F9A8C9] border-t-transparent animate-spin" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {recommendedProducts.map((product) => (
                      <RecommendedProductCard
                        key={product.id}
                        name={product.name}
                        image={product.image}
                        reason={product.reason}
                      />
                    ))}
                    {recommendedProducts.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-6">No matching products found.</p>
                    )}
                  </div>
                )}
              </section>

              {/* Makeup preview */}
              {analysisData?.skin_type && (
                <Link href="/style/makeup">
                  <Card className="p-4 rounded-2xl border-border/50 shadow-sm bg-linear-to-br from-white to-[#F9A8C9]/5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F9A8C9]/15 flex items-center justify-center shrink-0">
                        <Palette className="w-5 h-5 text-[#F9A8C9]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">Get Makeup Recommendation</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Check the color palette matched to your lighting</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>
                  </Card>
                </Link>
              )}

              {/* Save button - mobile only */}
              <Button
                variant="outline"
                onClick={handleSave}
                className="w-full rounded-full border-[#F9A8C9] py-6 text-[#F9A8C9] hover:bg-[#F9A8C9]/10 hover:text-[#F9A8C9] lg:hidden"
              >
                <Bookmark className="mr-2 h-5 w-5" />
                {user ? "View History" : "Save Results"}
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
