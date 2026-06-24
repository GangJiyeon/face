"use client"

import { useState, useRef } from "react"
import { Sparkles, Upload, ChevronLeft, X, ImageIcon } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { transferMakeup } from "@/lib/api"

const ACCENT = "#FDA4AF"

interface ImageSlot {
  file: File | null
  preview: string | null
}

function ImageUploadZone({
  label,
  hint,
  slot,
  onSelect,
  onClear,
}: {
  label: string
  hint: string
  slot: ImageSlot
  onSelect: (file: File) => void
  onClear: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    onSelect(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground -mt-1">{hint}</p>

      {slot.preview ? (
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-border/50 shadow-sm">
          <img src={slot.preview} alt={label} className="w-full h-full object-cover" />
          <button
            onClick={onClear}
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
            if (file) handleFile(file)
          }}
          className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-[#FDA4AF]/60 bg-muted/30 hover:bg-[#FDA4AF]/5 transition-all flex flex-col items-center justify-center gap-2"
        >
          <div className="w-12 h-12 rounded-full bg-[#FDA4AF]/10 flex items-center justify-center">
            <Upload className="w-5 h-5 text-[#FDA4AF]" />
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
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />
    </div>
  )
}

export default function MakeupTransferPage() {
  const [celebrity, setCelebrity] = useState<ImageSlot>({ file: null, preview: null })
  const [userFace, setUserFace] = useState<ImageSlot>({ file: null, preview: null })
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectFile = (setter: typeof setCelebrity) => (file: File) => {
    const preview = URL.createObjectURL(file)
    setter({ file, preview })
    setResultUrl(null)
    setError(null)
  }

  const clearFile = (setter: typeof setCelebrity, current: ImageSlot) => () => {
    if (current.preview) URL.revokeObjectURL(current.preview)
    setter({ file: null, preview: null })
    setResultUrl(null)
  }

  const canTransfer = !!celebrity.file && !!userFace.file && !loading

  const handleTransfer = async () => {
    if (!celebrity.file || !userFace.file) return
    setLoading(true)
    setError(null)
    setResultUrl(null)
    try {
      const res = await transferMakeup(userFace.file, celebrity.file)
      setResultUrl(res.result_url)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transfer failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-24">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="px-4 py-4 flex items-center gap-3">
            <Link href="/style"><ChevronLeft className="w-5 h-5 text-muted-foreground" /></Link>
            <h1 className="text-xl font-semibold text-foreground">Celebrity Makeup Transfer</h1>
          </div>
        </header>

        <main className="px-4 py-6 space-y-6 lg:max-w-4xl lg:mx-auto">
          <p className="text-sm text-muted-foreground">
            Transfer a celebrity's makeup style onto your photo using AI.
          </p>

          {/* Upload zones */}
          <Card className="p-4 rounded-2xl border-border/50 shadow-sm">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <ImageUploadZone
                label="Celebrity Photo"
                hint="Upload a celebrity photo to use as the makeup reference."
                slot={celebrity}
                onSelect={selectFile(setCelebrity)}
                onClear={clearFile(setCelebrity, celebrity)}
              />
              <ImageUploadZone
                label="Your Photo"
                hint="Upload a photo of your face to apply the makeup to."
                slot={userFace}
                onSelect={selectFile(setUserFace)}
                onClear={clearFile(setUserFace, userFace)}
              />
            </div>
          </Card>

          {/* Transfer button */}
          <Button
            onClick={handleTransfer}
            disabled={!canTransfer}
            className="w-full rounded-full py-6 text-white font-semibold text-base"
            style={{ backgroundColor: canTransfer ? ACCENT : undefined }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Applying...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Apply Makeup
              </span>
            )}
          </Button>

          {/* Error */}
          {error && (
            <Card className="p-4 rounded-2xl border-red-200 bg-red-50 text-sm text-red-600">
              {error}
            </Card>
          )}

          {/* Result */}
          {resultUrl && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Result</p>
              <Card className="rounded-2xl overflow-hidden border-border/50 shadow-sm">
                <img src={resultUrl} alt="Makeup transfer result" className="w-full object-cover" />
              </Card>
              <a
                href={resultUrl}
                download="makeup-transfer.png"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-full rounded-full py-5 border-[#FDA4AF] text-[#FDA4AF] hover:bg-[#FDA4AF]/10"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Save Image
                </Button>
              </a>
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
