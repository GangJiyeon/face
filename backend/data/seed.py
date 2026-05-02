import csv
import uuid
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

from db.session import SessionLocal
from db.models import Product, Base
from db.session import engine

# 부적합 성분 리스트
AVOID_INGREDIENTS = [
    "alcohol", "fragrance", "parfum", "sodium lauryl sulfate",
    "sodium laureth sulfate", "paraben", "formaldehyde"
]

# 피부 컨디션별 회피 성분
CONDITION_AVOID = {
    "redness":    ["alcohol", "fragrance", "parfum"],
    "trouble":    ["sodium lauryl sulfate", "sodium laureth sulfate", "paraben"],
    "brightness": ["fragrance", "parfum"],
    "moisture":   ["alcohol", "sodium lauryl sulfate"],
    "tone":       ["fragrance", "parfum"],
}

ALLOWED_CATEGORIES = ["skincare", "moisturizer", "serum", "toner", "sunscreen", "foundation", "bb cream"]

def parse_ingredients(raw: str) -> list:
    if not raw:
        return []
    return [i.strip().lower() for i in raw.split(",") if i.strip()]

def get_avoid_conditions(ingredients: list) -> list:
    conditions = []
    for condition, avoid_list in CONDITION_AVOID.items():
        for ingredient in ingredients:
            if any(a in ingredient for a in avoid_list):
                conditions.append(condition)
                break
    return list(set(conditions))

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    count = 0
    with open("data/beauty.csv", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            if count >= 500:  # 일단 500개만
                break

            name = row.get("product_name", "").strip()
            category = row.get("categories_en", "").strip().lower()
            ingredients_raw = row.get("ingredients_text", "")

            if not name or not ingredients_raw:
                continue

            '''
            if not any(c in category for c in ALLOWED_CATEGORIES):
                continue
            '''
            

            ingredients = parse_ingredients(ingredients_raw)
            avoid_conditions = get_avoid_conditions(ingredients)

            product = Product(
                id=str(uuid.uuid4()),
                name=name,
                brand=row.get("brands", "").strip(),
                category=category,
                ingredients=ingredients,
                avoid_conditions=avoid_conditions,
                image_url=row.get("image_url", "").strip() or None,
            )
            db.add(product)
            count += 1

    db.commit()
    db.close()
    print(f"{count}개 제품 저장 완료!")

if __name__ == "__main__":
    seed()