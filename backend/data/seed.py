import csv
import uuid
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

from db.session import SessionLocal
from db.models import Product, SkinType, SkinProfile, Base, Level
from db.session import engine

# Ingredients to avoid
AVOID_INGREDIENTS = [
    "alcohol", "fragrance", "parfum", "sodium lauryl sulfate",
    "sodium laureth sulfate", "paraben", "formaldehyde"
]

# Ingredients to avoid per skin condition
CONDITION_AVOID = {
    "redness":    ["alcohol", "fragrance", "parfum"],
    "trouble":    ["sodium lauryl sulfate", "sodium laureth sulfate", "paraben"],
    "brightness": ["fragrance", "parfum"],
    "moisture":   ["alcohol", "sodium lauryl sulfate"],
    "tone":       ["fragrance", "parfum"],
}

ALLOWED_CATEGORIES = ["skincare", "moisturizer", "serum", "toner", "sunscreen", "foundation", "bb cream"]

# ─── Skin type definitions ───────────────────────────────────────────────────

SKIN_TYPES = [
    {
        "id": "dry",
        "name": "dry",
        "moisture_level": Level.low,
        "oil_level": Level.low,
        "sensitivity": Level.mid,
        "description": "Dry skin with low moisture and a tight feeling.",
    },
    {
        "id": "oily",
        "name": "oily",
        "moisture_level": Level.high,
        "oil_level": Level.high,
        "sensitivity": Level.low,
        "description": "Oily skin with high sebum production and a shiny appearance.",
    },
    {
        "id": "sensitive",
        "name": "sensitive",
        "moisture_level": Level.mid,
        "oil_level": Level.mid,
        "sensitivity": Level.high,
        "description": "Sensitive skin that reacts easily to external stimuli and frequently turns red.",
    },
    {
        "id": "combination",
        "name": "combination",
        "moisture_level": Level.mid,
        "oil_level": Level.mid,
        "sensitivity": Level.low,
        "description": "Combination skin: oily T-zone and dry cheeks.",
    },
]

# SkinProfile rows — higher priority is evaluated first; first match wins.
# NULL (None) means "no constraint on that bound".
# Mirrors the classify_skin_type() logic in routers/recommend.py.
SKIN_PROFILES = [
    # sensitive: redness_score > 60  (priority 10 — checked before dry/oily)
    {
        "skin_type_id": "sensitive",
        "priority": 10,
        "redness_min": 60.0,
    },
    # sensitive: trouble_score > 60
    {
        "skin_type_id": "sensitive",
        "priority": 10,
        "trouble_min": 60.0,
    },
    # dry: moisture_score < 40
    {
        "skin_type_id": "dry",
        "priority": 5,
        "moisture_max": 40.0,
    },
    # oily: moisture_score > 70
    {
        "skin_type_id": "oily",
        "priority": 5,
        "moisture_min": 70.0,
    },
    # combination: 40 <= moisture_score <= 70 (fallback)
    {
        "skin_type_id": "combination",
        "priority": 1,
        "moisture_min": 40.0,
        "moisture_max": 70.0,
    },
]


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


def seed_skin_types(db):
    existing_ids = {st.id for st in db.query(SkinType.id).all()}

    for st_data in SKIN_TYPES:
        if st_data["id"] in existing_ids:
            continue
        db.add(SkinType(**st_data))

    db.flush()

    if db.query(SkinProfile).count() == 0:
        for profile_data in SKIN_PROFILES:
            db.add(SkinProfile(id=str(uuid.uuid4()), **profile_data))

    db.commit()
    print(f"Saved {len(SKIN_TYPES)} skin types and {len(SKIN_PROFILES)} profiles.")


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    seed_skin_types(db)

    count = 0
    with open("data/beauty.csv", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            if count >= 500:  # limit to 500 for now
                break

            name = row.get("product_name", "").strip()
            category = row.get("categories_en", "").strip().lower()
            ingredients_raw = row.get("ingredients_text", "")

            if not name or not ingredients_raw:
                continue

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
                suitable_skin_types=None,
            )
            db.add(product)
            count += 1

    db.commit()
    db.close()
    print(f"Saved {count} products.")

if __name__ == "__main__":
    seed()
