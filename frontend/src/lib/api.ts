import { AnalyzeResponse, HistoryItem } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function analyzeImage(file: File): Promise<AnalyzeResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${API_BASE_URL}/analyze/`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || 'Analysis failed')
    }

    return res.json()
}

export async function getHairstyleRecommendation(landmarks: [number, number][]) {
    const res = await fetch(`${API_BASE_URL}/recommend/hairstyle`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landmarks }),
    })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || 'Failed to get hairstyle recommendation')
    }
    return res.json()
}

export async function getHistory(): Promise<HistoryItem[]> {
    const res = await fetch(`${API_BASE_URL}/analyze/history`, {
        credentials: 'include',
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || 'Failed to fetch history')
    }

    return res.json()
}
