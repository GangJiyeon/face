"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { SKIN_TYPE_INFO, getScoreModifiers } from "@/lib/skin-type-info"

interface SkinScores {
  redness: { score: number }
  trouble: { score: number }
  moisture: { score: number }
  brightness: { score: number }
  tone: { score: number }
  overall: number
}

interface SkinTypeDetailProps {
  skinType: string
  scores: SkinScores
}

type Tab = "overview" | "routine" | "ingredients" | "lifestyle"

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "About" },
  { id: "routine", label: "Routine" },
  { id: "ingredients", label: "Ingredients" },
  { id: "lifestyle", label: "Lifestyle" },
]

export function SkinTypeDetail({ skinType, scores }: SkinTypeDetailProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("overview")

  const info = SKIN_TYPE_INFO[skinType]
  if (!info) return null

  const modifiers = getScoreModifiers(scores)

  return (
    <section>
      <h2 className="text-base font-semibold text-foreground mb-3">Skin Type Analysis</h2>

      {/* Score-based modifier alerts */}
      {modifiers.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {modifiers.map((mod) => (
            <div
              key={mod.id}
              className="rounded-xl p-3 flex items-start gap-2.5"
              style={{ backgroundColor: `${mod.color}18`, borderLeft: `3px solid ${mod.color}` }}
            >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: mod.color }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: mod.color }}>{mod.title}</p>
                {expanded && (
                  <>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{mod.body}</p>
                    <ul className="mt-2 space-y-1">
                      {mod.tips.map((tip, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="mt-0.5 shrink-0" style={{ color: mod.color }}>•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main card */}
      <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
        {/* Header — always visible */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-foreground text-base">{info.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 italic">{info.tagline}</p>
            </div>
            <button
              onClick={() => setExpanded(v => !v)}
              className="shrink-0 flex items-center gap-1 text-xs text-[#F9A8C9] font-medium hover:text-[#F9A8C9]/80 transition-colors mt-0.5"
            >
              {expanded ? (
                <><ChevronUp className="h-3.5 w-3.5" /> Less</>
              ) : (
                <><ChevronDown className="h-3.5 w-3.5" /> More</>
              )}
            </button>
          </div>

          {/* Teaser — first sentence of overview */}
          {!expanded && (
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
              {info.overview[0]}
            </p>
          )}
        </div>

        {/* Expanded content */}
        {expanded && (
          <>
            {/* Tab bar */}
            <div className="flex border-b border-border/50 px-4">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-xs font-medium pb-2.5 pt-1 px-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-[#F9A8C9] text-[#F9A8C9]"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <CardContent className="px-4 py-4 space-y-4">

              {/* ── Overview tab ── */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {info.overview.map((para, i) => (
                    <p key={i} className="text-sm text-foreground/80 leading-relaxed">{para}</p>
                  ))}

                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Key Characteristics</p>
                    <ul className="space-y-1.5">
                      {info.characteristics.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-[#F9A8C9] shrink-0 mt-0.5">•</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">What Causes This</p>
                    <ul className="space-y-1.5">
                      {info.causes.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-[#C4B5FD] shrink-0 mt-0.5">•</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* ── Routine tab ── */}
              {activeTab === "routine" && (
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2.5">Morning Routine</p>
                    <ol className="space-y-2">
                      {info.morningRoutine.map((step, i) => (
                        <li key={i} className="flex gap-3 text-xs text-muted-foreground">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FDF2F8] text-[10px] font-semibold text-[#F9A8C9]">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="border-t border-border/50 pt-4">
                    <p className="text-xs font-semibold text-foreground mb-2.5">Evening Routine</p>
                    <ol className="space-y-2">
                      {info.eveningRoutine.map((step, i) => (
                        <li key={i} className="flex gap-3 text-xs text-muted-foreground">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F3E8FF]/60 text-[10px] font-semibold text-[#C4B5FD]">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* ── Ingredients tab ── */}
              {activeTab === "ingredients" && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <p className="text-xs font-semibold text-foreground">Look For</p>
                    </div>
                    <div className="space-y-2.5">
                      {info.keyIngredients.map((ing, i) => (
                        <div key={i} className="rounded-xl bg-emerald-50/50 px-3 py-2.5">
                          <p className="text-xs font-semibold text-emerald-700">{ing.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{ing.benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <XCircle className="h-3.5 w-3.5 text-red-400" />
                      <p className="text-xs font-semibold text-foreground">Avoid</p>
                    </div>
                    <div className="space-y-2.5">
                      {info.avoidIngredients.map((ing, i) => (
                        <div key={i} className="rounded-xl bg-red-50/50 px-3 py-2.5">
                          <p className="text-xs font-semibold text-red-600">{ing.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{ing.benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Lifestyle tab ── */}
              {activeTab === "lifestyle" && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2.5">Daily Habits That Matter</p>
                  <ul className="space-y-3">
                    {info.lifestyleTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed pt-0.5">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </CardContent>
          </>
        )}
      </Card>
    </section>
  )
}
