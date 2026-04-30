import { AnalyzeResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PU

export async function analyzeImage(file:File): Promise<AnalyzeResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('${API_BASE_URL}/analyze/',
        {
            method: 'POST',
            body: formData
        }
    )

    if (!res.ok){
        const error = await res.json()
        throw new Error(error.detail || 'Analysis failed')
    }

    return res.json()
}

export async function getHistory() {
    const res = await fetch('${API_BASE_URL}/history/')

    if (!res.ok){
        const error = await res.json()
        throw new Error(error.detail || 'Failed to fetch history')
    }

    return res.json()
}