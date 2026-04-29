"use client"

import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

export function StartAnalysisButton() {
  return (
    <div className="px-5 py-6">
      <Button
        size="lg"
        className="w-full rounded-2xl bg-[#F9A8C9] py-6 text-base font-semibold text-white shadow-lg shadow-[#F9A8C9]/30 transition-all hover:bg-[#F490B8] hover:shadow-xl hover:shadow-[#F9A8C9]/40"
      >
        <Camera className="mr-2 h-5 w-5" />
        Start Analysis
      </Button>
    </div>
  )
}
