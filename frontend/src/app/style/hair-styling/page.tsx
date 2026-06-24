"use client"

import { useState, useEffect, useRef } from "react"
import { Sparkles, Upload, ChevronLeft, X, ImageIcon, Camera } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { getHistory, getHairstyleRecommendation, applyRecommendedHair } from "@/lib/api"

const ACCENT = "#C4B5FD"

const FACE_SHAPE_EMOJI: Record<string, string> = {
  oval: "🥚", round: "⭕", square: "⬛", heart: "🫀", long: "📏",
}

const LENGTH_LABEL: Record<string, string> = {
  short: "Short", medium: "Medium", long: "Long",
}

interface Style {
  name: string
  reason: string
  length: string
  tags?: string[]
}

interface HairstyleData {
  face_shape: string
  face_shape_label: string
  styles: Style[]
}

export default function HairStylingPage() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [hairstyleData, setHairstyleData] = useState<HairstyleData | null>(null)
  const [landmarks, setLandmarks] = useState<[number, number][] | null>(null)
  const [historyError, setHistoryError] = useState<"no_history" | "no_login" | null>(null)
  const [historyLoading, setHistoryLoading] = useState(true)

  const [userFile, setUserFile] = useState<File | null>(null)
  const [userPreview, setUserPreview] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState(0)

  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [appliedStyle, setAppliedStyle] = useState<Style | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // sessionStorage 분석 이미지 → File 변환해서 미리 채우기
    const savedImage = sessionStorage.getItem('analysisImage')
    if (savedImage) {
      const arr = savedImage.split(',')
      const mime = arr[0].match(/:(.*?);/)?.[1] ?? 'image/jpeg'
      const bstr = atob(arr[1])
      const u8arr = new Uint8Array(bstr.length)
      for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i)
      const file = new File([u8arr], 'analysis.jpg', { type: mime })
      setUserFile(file)
      setUserPreview(savedImage)
    }

    const loadLandmarks = async () => {
      // 1. sessionStorage에 최근 분석 결과 있으면 바로 사용 (로그인 불필요)
      const cached = sessionStorage.getItem('analysisLandmarks')
      if (cached) {
        try {
          const lm = JSON.parse(cached) as [number, number][]
          if (lm.length) {
            setLandmarks(lm)
            const data = await getHairstyleRecommendation(lm)
            setHairstyleData(data)
            setHistoryLoading(false)
            return
          }
        } catch {
          // 파싱 실패 시 history 폴백
        }
      }

      // 2. sessionStorage 없으면 서버 history에서 가져오기
      try {
        const history = await getHistory()
        if (!history.length || !history[0].landmarks?.length) {
          setHistoryError("no_history")
          return
        }
        const latest = history[0]
        const lm = latest.landmarks as [number, number][]
        setLandmarks(lm)
        const data = await getHairstyleRecommendation(lm)
        setHairstyleData(data)

        // 서버 저장 이미지로 사진 미리 채우기 (sessionStorage 없는 경우)
        if (latest.image_url && !sessionStorage.getItem('analysisImage')) {
          try {
            const res = await fetch(latest.image_url)
            const blob = await res.blob()
            const file = new File([blob], 'analysis.jpg', { type: blob.type })
            setUserFile(file)
            setUserPreview(latest.image_url)
          } catch {
            // 이미지 fetch 실패해도 진행
          }
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : ""
        setHistoryError(msg.includes("Login") ? "no_login" : "no_history")
      } finally {
        setHistoryLoading(false)
      }
    }

    loadLandmarks()
  }, [])

  const selectFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    if (userPreview) URL.revokeObjectURL(userPreview)
    setUserFile(file)
    setUserPreview(URL.createObjectURL(file))
    setResultUrl(null)
    setError(null)
  }

  const clearFile = () => {
    if (userPreview) URL.revokeObjectURL(userPreview)
    setUserFile(null)
    setUserPreview(null)
    setResultUrl(null)
  }

  const canApply = !!userFile && !!landmarks && !loading

  const handleApply = async () => {
    if (!userFile || !landmarks) return
    setLoading(true)
    setError(null)
    setResultUrl(null)
    try {
      const res = await applyRecommendedHair(userFile, landmarks, selectedStyle)
      setResultUrl(res.result_url)
      setAppliedStyle(res.applied_style)
      if (!hairstyleData) {
        setHairstyleData({
          face_shape: res.face_shape,
          face_shape_label: res.face_shape_label,
          styles: [res.applied_style],
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transfer failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (historyLoading) return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C4B5FD] border-t-transparent animate-spin" />
      </div>
    </div>
  )

  if (historyError) return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="px-4 py-4 flex items-center gap-3">
            <Link href="/style"><ChevronLeft className="w-5 h-5 text-muted-foreground" /></Link>
            <h1 className="text-xl font-semibold text-foreground">Personalized Hair Styling</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24">
          <div className="w-24 h-24 rounded-full bg-[#C4B5FD]/10 flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-[#C4B5FD]" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
            {historyError === "no_login" ? "Login required" : "No analysis history"}
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-xs">
            {historyError === "no_login"
              ? "Log in and run a skin analysis first."
              : "Please complete a skin analysis first to detect your face shape."}
          </p>
          <Link href="/upload">
            <Button className="bg-[#C4B5FD] hover:bg-[#C4B5FD]/90 text-white rounded-full px-8 py-6 text-base font-medium">
              <Camera className="w-5 h-5 mr-2" />
              Start Analysis
            </Button>
          </Link>
        </main>
        <BottomNav />
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
            <h1 className="text-xl font-semibold text-foreground">Personalized Hair Styling</h1>
          </div>
        </header>

        <main className="px-4 py-6 lg:max-w-4xl lg:mx-auto">
          <p className="text-sm text-muted-foreground mb-6">
            Get an AI-generated hairstyle matched to your face shape, applied directly to your photo.
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: style selector */}
            <div className="space-y-4">
              {hairstyleData && hairstyleData.styles.length > 0 && (
                <Card className="p-4 rounded-2xl border-border/50 shadow-sm bg-linear-to-br from-white to-[#C4B5FD]/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{FACE_SHAPE_EMOJI[hairstyleData.face_shape] ?? "✨"}</span>
                    <div>
                      <p className="text-xs text-muted-foreground">Face Shape</p>
                      <p className="font-semibold text-foreground">{hairstyleData.face_shape_label}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Select a style to apply</p>
                  <div className="space-y-2">
                    {hairstyleData.styles.map((style, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedStyle(i); setResultUrl(null) }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
                          selectedStyle === i
                            ? "border-[#C4B5FD] bg-[#C4B5FD]/10"
                            : "border-border/50 hover:border-[#C4B5FD]/40 hover:bg-[#C4B5FD]/5"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm text-foreground">{style.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                            {LENGTH_LABEL[style.length] ?? style.length}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{style.reason}</p>
                      </button>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right: photo upload */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">Your Photo</p>
              <p className="text-xs text-muted-foreground -mt-1">Upload a photo of your face to apply the hairstyle to.</p>

              {userPreview ? (
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-border/50 shadow-sm">
                  <img src={userPreview} alt="My photo" className="w-full h-full object-cover" />
                  <button
                    onClick={clearFile}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const file = e.dataTransfer.files[0]
                    if (file) selectFile(file)
                  }}
                  className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-[#C4B5FD]/60 bg-muted/30 hover:bg-[#C4B5FD]/5 transition-all flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-[#C4B5FD]/10 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-[#C4B5FD]" />
                  </div>
                  <span className="text-xs text-muted-foreground">Select or drag a photo</span>
                </button>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) selectFile(file)
                  e.target.value = ""
                }}
              />
            </div>
          </div>

          <div className="mt-6 space-y-6">

          <Button
            onClick={handleApply}
            disabled={!canApply}
            className="w-full rounded-full py-6 text-white font-semibold text-base"
            style={{ backgroundColor: canApply ? ACCENT : undefined }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Applying...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Apply Hairstyle
              </span>
            )}
          </Button>

          {error && (
            <Card className="p-4 rounded-2xl border-red-200 bg-red-50 text-sm text-red-600">
              {error}
            </Card>
          )}

          {resultUrl && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Result
                {appliedStyle && <span className="text-muted-foreground font-normal ml-1">— {appliedStyle.name}</span>}
              </p>
              <Card className="rounded-2xl overflow-hidden border-border/50 shadow-sm">
                <img src={resultUrl} alt="Hair styling result" className="w-full object-cover" />
              </Card>
              <a href={resultUrl} download="hair-styling.png" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="w-full rounded-full py-5 border-[#C4B5FD] text-[#8B7DCF] hover:bg-[#C4B5FD]/10"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Save Image
                </Button>
              </a>
            </div>
          )}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
