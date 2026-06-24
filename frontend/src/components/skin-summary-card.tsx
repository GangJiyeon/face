"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { HistoryItem } from "@/types/api"

interface SkinSummaryCardProps {
  item: HistoryItem | null
}

export function SkinSummaryCard({ item }: SkinSummaryCardProps) {
  const radarData = item ? [
    { metric: "Redness",    value: item.skin_scores.redness.chart_score,    fullMark: 100 },
    { metric: "Tone",       value: item.skin_scores.tone.chart_score,       fullMark: 100 },
    { metric: "Brightness", value: item.skin_scores.brightness.chart_score, fullMark: 100 },
    { metric: "Trouble",    value: item.skin_scores.trouble.chart_score,    fullMark: 100 },
  ] : []

  const scores = item ? [
    { label: "Redness",    value: item.skin_scores.redness.score },
    { label: "Tone",       value: item.skin_scores.tone.score },
    { label: "Brightness", value: item.skin_scores.brightness.score },
    { label: "Trouble",    value: item.skin_scores.trouble.score },
  ] : []

  return (
    <Card className="mx-5 border-0 bg-linear-to-br from-[#FDF2F8] to-[#F3E8FF] shadow-sm">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Latest Skin Condition
            </p>
            {item ? (
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {Math.round(item.overall_score)}
                </span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No analysis yet</p>
            )}
          </div>
          <div className="flex h-24 w-24 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#E9D5FF" strokeOpacity={0.6} />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "#9CA3AF", fontSize: 9 }}
                />
                <Radar
                  name="Skin"
                  dataKey="value"
                  stroke="#F9A8C9"
                  fill="#F9A8C9"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {scores.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {scores.map((s) => (
              <div key={s.label} className="rounded-xl bg-white/60 px-2 py-2 text-center">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
