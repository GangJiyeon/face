"use client"

import { useState, useCallback, useRef } from "react"
import { ArrowLeft, Camera, Upload, Check, Loader2, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { BottomNav } from "@/components/bottom-nav"

const ANALYSIS_STEPS = [
  { id: "detection", label: "Face detection" },
  { id: "analysis", label: "Skin analysis" },
  { id: "recommendations", label: "Generating recommendations" },
]

const FACE_LANDMARKS = [
  { x: 50, y: 25 },
  { x: 35, y: 35 },
  { x: 65, y: 35 },
  { x: 30, y: 45 },
  { x: 40, y: 45 },
  { x: 60, y: 45 },
  { x: 70, y: 45 },
  { x: 50, y: 50 },
  { x: 50, y: 60 },
  { x: 40, y: 65 },
  { x: 60, y: 65 },
  { x: 35, y: 75 },
  { x: 50, y: 72 },
  { x: 65, y: 75 },
  { x: 50, y: 80 },
  { x: 25, y: 55 },
  { x: 75, y: 55 },
  { x: 20, y: 70 },
  { x: 80, y: 70 },
  { x: 50, y: 90 },
]

const TIPS = [
  "Use natural lighting",
  "Remove makeup if possible",
  "Face the camera directly",
  "Keep a neutral expression",
  "Ensure your full face is visible",
]

export default function UploadPage() {
  const [image, setImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const startAnalysis = useCallback(() => {
    setIsAnalyzing(true)
    setCurrentStep(0)
    setProgress(0)

    let step = 0
    const stepDuration = 2000
    const progressInterval = 50

    const updateProgress = () => {
      setProgress((prev) => {
        const currentMax = ((step + 1) / ANALYSIS_STEPS.length) * 100
        const currentMin = (step / ANALYSIS_STEPS.length) * 100
        return Math.min(prev + (currentMax - currentMin) / (stepDuration / progressInterval), currentMax)
      })
    }

    const progressTimer = setInterval(updateProgress, progressInterval)
    const stepTimer = setInterval(() => {
      step++
      if (step < ANALYSIS_STEPS.length) {
        setCurrentStep(step)
      } else {
        clearInterval(stepTimer)
        clearInterval(progressTimer)
        setProgress(100)
        setTimeout(() => {
          setIsAnalyzing(false)
          setCurrentStep(0)
          setProgress(0)
        }, 500)
      }
    }, stepDuration)
  }, [])

  const clearImage = useCallback(() => {
    setImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-4 py-4 lg:px-8">
            <Link
              href="/"
              className="rounded-full p-2 transition-colors hover:bg-muted lg:hidden"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-foreground lg:text-xl">Skin Analysis</h1>
              <p className="hidden text-sm text-muted-foreground lg:block">
                Upload a clear photo to get your personalized skin report
              </p>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
          <div className="p-4 lg:grid lg:grid-cols-[3fr_2fr] lg:gap-8 lg:p-8">

            {/* ── Left: Upload zone / Photo preview ── */}
            {/* Hidden on mobile during analysis, always visible on desktop */}
            <div className={cn(isAnalyzing && "hidden lg:block")}>
              {!image ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative flex min-h-80 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 transition-all duration-200 lg:min-h-130",
                    isDragging
                      ? "border-[#F9A8C9] bg-[#F9A8C9]/10"
                      : "border-border hover:border-[#F9A8C9]/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F9A8C9]/10">
                    <Camera className="h-8 w-8 text-[#F9A8C9]" />
                  </div>
                  <div className="text-center">
                    <p className="mb-1 text-base font-medium text-foreground">Upload your photo</p>
                    <p className="text-sm text-muted-foreground">JPG, PNG or HEIC (max 10MB)</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    <span>Drag and drop or click to select</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/heic"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-label="Upload photo"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-muted">
                    <img
                      src={image}
                      alt="Uploaded photo preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0">
                      {FACE_LANDMARKS.map((point, index) => (
                        <div
                          key={index}
                          className="absolute h-2 w-2 animate-pulse rounded-full bg-[#F9A8C9] shadow-sm"
                          style={{
                            left: `${point.x}%`,
                            top: `${point.y}%`,
                            transform: "translate(-50%, -50%)",
                            animationDelay: `${index * 50}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={clearImage}
                      className="absolute right-3 top-3 rounded-full bg-foreground/80 p-2 text-background transition-colors hover:bg-foreground"
                      aria-label="Remove photo"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Face landmarks detected. Ready for analysis.
                  </p>
                </div>
              )}
            </div>

            {/* ── Right: Controls + Tips / Analyzing progress ── */}
            <div className={cn("space-y-4 lg:space-y-6", !isAnalyzing && "mt-6 lg:mt-0")}>
              {!isAnalyzing ? (
                <>
                  {/* Tips card */}
                  <Card className="border-border/50 shadow-sm">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-[#F9A8C9]" />
                        <h2 className="text-sm font-semibold text-foreground">Tips for best results</h2>
                      </div>
                      <ul className="space-y-2">
                        {TIPS.map((tip) => (
                          <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F9A8C9]" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Start Analysis Button */}
                  <Button
                    onClick={startAnalysis}
                    disabled={!image}
                    className="h-14 w-full rounded-xl bg-[#F9A8C9] text-base font-medium text-white shadow-lg shadow-[#F9A8C9]/25 transition-all hover:bg-[#F9A8C9]/90 disabled:opacity-50 disabled:shadow-none"
                  >
                    Start Analysis
                  </Button>

                  {/* Upload button shortcut on desktop when no image */}
                  {!image && (
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="hidden h-12 w-full rounded-xl lg:flex"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                    </Button>
                  )}
                </>
              ) : (
                /* Analyzing progress */
                <div className="flex flex-col items-center justify-center py-8 lg:py-0">
                  <div className="w-full max-w-xs space-y-8">
                    {/* Progress circle */}
                    <div className="flex justify-center">
                      <div className="relative h-24 w-24">
                        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                          <circle
                            cx="50" cy="50" r="45"
                            fill="none" stroke="#F9A8C9" strokeWidth="8" strokeLinecap="round"
                            strokeDasharray={`${progress * 2.83} 283`}
                            className="transition-all duration-300"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-semibold text-foreground">{Math.round(progress)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[#F9A8C9] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                      {ANALYSIS_STEPS.map((step, index) => {
                        const isComplete = index < currentStep
                        const isCurrent = index === currentStep
                        return (
                          <div
                            key={step.id}
                            className={cn(
                              "flex items-center gap-3 rounded-xl p-3 transition-all duration-200",
                              isCurrent && "bg-[#F9A8C9]/10",
                              isComplete && "opacity-60"
                            )}
                          >
                            <div className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
                              (isComplete || isCurrent) ? "bg-[#F9A8C9]" : "bg-muted"
                            )}>
                              {isComplete ? (
                                <Check className="h-3.5 w-3.5 text-white" />
                              ) : isCurrent ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                              ) : (
                                <span className="text-xs text-muted-foreground">{index + 1}</span>
                              )}
                            </div>
                            <span className={cn("text-sm", isCurrent ? "font-medium text-foreground" : "text-muted-foreground")}>
                              {step.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                      Please wait while we analyze your skin...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
