import { AnalyzeResponse, HistoryItem, MakeupTransferResponse } from "@/types/api";

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

export async function getMakeupRecommendation(skin_type: string, lighting_env: string, korean_only = false) {
    const res = await fetch(`${API_BASE_URL}/recommend/makeup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skin_type, lighting_env, korean_only }),
    })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || 'Failed to get makeup recommendation')
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

export async function getProductRecommendations(skinScores: object, koreanOnly = false) {
    const res = await fetch(`${API_BASE_URL}/recommend/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...skinScores, korean_only: koreanOnly }),
    })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || 'Failed to get product recommendations')
    }
    return res.json()
}

export async function transferMakeup(
    userImage: File,
    celebrityImage: File,
): Promise<MakeupTransferResponse> {
    const formData = new FormData()
    formData.append('user_image', userImage)
    formData.append('celebrity_image', celebrityImage)

    const res = await fetch(`${API_BASE_URL}/style/makeup-transfer`, {
        method: 'POST',
        body: formData,
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || 'Makeup transfer failed')
    }

    const data: MakeupTransferResponse = await res.json()
    if (data.result_url.startsWith('/')) {
        data.result_url = `${API_BASE_URL}${data.result_url}`
    }
    return data
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
