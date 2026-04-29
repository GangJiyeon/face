"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const skinData = [
  { metric: "Redness", value: 75, fullMark: 100 },
  { metric: "Tone", value: 85, fullMark: 100 },
  { metric: "Brightness", value: 68, fullMark: 100 },
  { metric: "Trouble", value: 82, fullMark: 100 },
]

const overallScore = Math.round(
  skinData.reduce((acc, item) => acc + item.value, 0) / skinData.length
)

export function SkinSummaryCard() {
  return (
    <Card className="mx-5 border-0 bg-gradient-to-br from-[#FDF2F8] to-[#F3E8FF] shadow-sm">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {"Today's Skin Condition"}
            </p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">
                {overallScore}
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="flex h-24 w-24 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skinData}>
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

        <div className="grid grid-cols-4 gap-2">
          {skinData.map((item) => (
            <div
              key={item.metric}
              className="rounded-xl bg-white/60 px-2 py-2 text-center"
            >
              <p className="text-xs text-muted-foreground">{item.metric}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
