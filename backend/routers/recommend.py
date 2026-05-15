import json
import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from db.models import Product
from schemas.skin import SkinScores
from pipeline.face_shape import classify_face_shape
from pipeline.gemini import generate_makeup_reason

HAIRSTYLES_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "hairstyles.json")
with open(HAIRSTYLES_PATH, encoding="utf-8") as f:
    HAIRSTYLES_DATA = json.load(f)

MAKEUP_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "makeup_palettes.json")
with open(MAKEUP_PATH, encoding="utf-8") as f:
    MAKEUP_DATA = json.load(f)

router = APIRouter()

ALLOWED_CATEGORIES = ["skincare", "moisturizer", "serum", "toner", "sunscreen", "foundation", "bb cream", "face", "skin"]


# Skin type classification
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

# Recommended ingredients by skin type
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

    # Avoid conditions based on bad-status metrics
    avoid_conditions = [
        k for k, v in scores.items()
        if isinstance(v, dict) and v.get("status") == "bad"
    ]

    # Filter products from DB
    products = db.query(Product).all()

    scored_products = []
    for product in products:

        # Category filter
        category = (product.category or "").lower()
        if not any(c in category for c in ALLOWED_CATEGORIES):
            continue

        ingredients = product.ingredients or []
        avoid = product.avoid_conditions or []

        # Exclude if avoid conditions overlap
        if any(c in avoid for c in avoid_conditions):
            continue

        # Recommended ingredient match score
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

    # Top 5 by match score, deduplicated by name
    seen_names = set()
    unique_products = []
    for p in scored_products:
        if p["name"] not in seen_names:
            seen_names.add(p["name"])
            unique_products.append(p)

    
    return {
        "skin_type": skin_type,
        "products": unique_products[:5],
    }


@router.post("/hairstyle")
def recommend_hairstyle(body: dict):
    landmarks = body.get("landmarks", [])
    face_shape = classify_face_shape(landmarks)
    data = HAIRSTYLES_DATA.get(face_shape, HAIRSTYLES_DATA["oval"])
    return {
        "face_shape": face_shape,
        "face_shape_label": data["label"],
        "description": data["description"],
        "styles": data["styles"],
    }


MAKEUP_CATEGORIES = ["foundation", "bb cream", "concealer", "blush", "cheek",
                     "lipstick", "lip", "eyeshadow", "eye", "makeup", "colour", "color"]

@router.post("/makeup")
def recommend_makeup(body: dict, db: Session = Depends(get_db)):
    skin_type = body.get("skin_type", "combination")
    lighting_env = body.get("lighting_env", "bright")

    lighting_data = MAKEUP_DATA.get(lighting_env, MAKEUP_DATA["bright"])
    palette = lighting_data.get(skin_type, lighting_data["combination"])

    # Fetch makeup-category products
    products = db.query(Product).all()
    makeup_products = []
    for p in products:
        category = (p.category or "").lower()
        if not any(c in category for c in MAKEUP_CATEGORIES):
            continue
        makeup_products.append({
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "category": p.category,
            "image_url": p.image_url,
        })

    palette_colors = {
        "foundation": palette["foundation"],
        "blush": palette["blush"],
        "lip": palette["lip"],
        "eye": palette["eye"],
    }
    reason = generate_makeup_reason(skin_type, lighting_env, palette)

    return {
        "skin_type": skin_type,
        "lighting_env": lighting_env,
        "palette": palette_colors,
        "tip": reason,
        "products": makeup_products[:6],
    }