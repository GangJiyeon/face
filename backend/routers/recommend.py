from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from db.models import Product
from schemas.skin import SkinScores

router = APIRouter()

# 피부 타입 분류
def classify_skin_type(scores: dict) -> str:
    moisture = scores["moisture"]["score"]
    redness = scores["redness"]["score"]
    trouble = scores["trouble"]["score"]

    if moisture < 40:
        return "dry"
    elif redness > 60 or trouble > 60:
        return "sensitive"
    elif moisture > 70:
        return "oily"
    else:
        return "combination"

# 피부 타입별 추천 성분
RECOMMENDED_INGREDIENTS = {
    "dry":         ["hyaluronic acid", "glycerin", "ceramide", "squalane"],
    "oily":        ["niacinamide", "salicylic acid", "zinc", "tea tree"],
    "sensitive":   ["centella asiatica", "aloe vera", "panthenol", "allantoin"],
    "combination": ["niacinamide", "hyaluronic acid", "green tea", "peptide"],
}

@router.post("/")
def recommend_products(scores: dict, db: Session = Depends(get_db)):
    skin_type = classify_skin_type(scores)
    recommended = RECOMMENDED_INGREDIENTS[skin_type]

    # 부적합 상태 기반 회피 조건
    avoid_conditions = [
        k for k, v in scores.items()
        if isinstance(v, dict) and v.get("status") == "bad"
    ]

    # DB에서 제품 필터링
    products = db.query(Product).all()
    
    scored_products = []
    for product in products:
        ingredients = product.ingredients or []
        avoid = product.avoid_conditions or []

        # 회피 조건 겹치면 제외
        if any(c in avoid for c in avoid_conditions):
            continue

        # 추천 성분 매칭 점수
        match_count = sum(
            1 for rec in recommended
            if any(rec in ing for ing in ingredients)
        )
        
        if match_count > 0:
            scored_products.append({
                "id": product.id,
                "name": product.name,
                "brand": product.brand,
                "category": product.category,
                "ingredients": ingredients[:5],
                "match_score": round(match_count / len(recommended) * 100, 1),
                "reason": f"{skin_type} skin type match",
                "image_url": product.image_url,
            })

    # 매칭 점수 높은 순으로 상위 5개
    scored_products.sort(key=lambda x: x["match_score"], reverse=True)
    
    return {
        "skin_type": skin_type,
        "products": scored_products[:5],
    }