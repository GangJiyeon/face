// 항목별 상태 타입
export type SkinStatus = 'good' | 'caution' | 'bad'

// 항목별 분석 결과
export interface SkinMetric {
  score: number        // 0~100 원본 점수
  chart_score: number  // 레이더 차트용 정규화 점수 (높을수록 좋음)
  status: SkinStatus   // good / caution / bad
  label: string        // 한국어 라벨 (예: "약간 붉음")
}

// 피부 분석 결과
export interface SkinScores {
  redness: SkinMetric
  tone: SkinMetric
  brightness: SkinMetric
  trouble: SkinMetric
  moisture: SkinMetric
  overall: number      // 종합 점수
}

// 추천 제품
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

// 분석 API 응답
export interface AnalyzeResponse {
  skin_scores: SkinScores
  skin_type: string
  products: Product[]
  analyzed_at: string
  landmarks: [number, number][]
  image_size: { width: number, height: number } 
}

// 에러 응답
export interface ApiError {
  detail: string
}