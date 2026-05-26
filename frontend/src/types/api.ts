// Per-metric status type
export type SkinStatus = 'good' | 'caution' | 'bad'

// Per-metric analysis result
export interface SkinMetric {
  score: number        // 0~100 raw score
  chart_score: number  // normalized score for radar chart (higher = better)
  status: SkinStatus   // good / caution / bad
  label: string        // English label (e.g. "Slightly red")
}

// Skin analysis scores
export interface SkinScores {
  redness: SkinMetric
  tone: SkinMetric
  brightness: SkinMetric
  trouble: SkinMetric
  moisture: SkinMetric
  overall: number      // overall score
}

// Recommended product
export interface Product {
  id: string
  name: string
  brand: string
  category: string
  ingredients: string[]
  match_score: number
  reason: string
  image_url?: string
}

// Analyze API response
export interface AnalyzeResponse {
  skin_scores: SkinScores
  skin_type: string
  products: Product[]
  analyzed_at: string
  landmarks: [number, number][]
  image_size: { width: number, height: number }
}

// History item
export interface HistoryItem {
  id: string
  skin_type: string
  overall_score: number
  skin_scores: SkinScores
  analyzed_at: string
  image_url: string | null
  landmarks: [number, number][]
  image_size: { width: number; height: number }
}

// Makeup transfer response
export interface MakeupTransferResponse {
  result_url: string
}

// Error response
export interface ApiError {
  detail: string
}