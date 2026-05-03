from pydantic import BaseModel
from typing import Literal

SkinStatus = Literal["good", "caution", "bad"]

class SkinMetric(BaseModel):
    score: float
    chart_score: float
    status: SkinStatus
    label: str

class SkinScores(BaseModel):
    redness: SkinMetric
    tone: SkinMetric
    brightness: SkinMetric
    trouble: SkinMetric
    moisture: SkinMetric
    overall: float

class Product(BaseModel):
    id: str
    name: str
    brand: str
    category: str
    ingredients: list[str]
    match_score: float
    reason: str
    image_url: str | None = None

class AnalyzeResponse(BaseModel):
    skin_scores: SkinScores
    skin_type: str
    products: list[Product]
    analyzed_at: str