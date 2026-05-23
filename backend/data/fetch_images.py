"""Fetch product image URLs from accessible brand Shopify stores and update DB."""
import warnings
warnings.filterwarnings("ignore")

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import requests
from difflib import SequenceMatcher
from sqlalchemy import update
from db.session import SessionLocal
from db.models import Product

HEADERS = {"User-Agent": "Mozilla/5.0"}

SHOPIFY_STORES = {
    "COSRX":              "https://cosrx.com/products.json?limit=250",
    "Beauty of Joseon":   "https://beautyofjoseon.com/products.json?limit=250",
    "Abib":               "https://en.abib.co.kr/products.json?limit=250",
    "Mediheal":           "https://mediheal.com/products.json?limit=250",
    "Innisfree":          "https://us.innisfree.com/products.json?limit=250",
    "Laneige":            "https://us.laneige.com/products.json?limit=250",
    "TONYMOLY":           "https://tonymoly.us/products.json?limit=250",
    "Skin1004":           "https://skin1004.com/products.json?limit=250",
    "Sulwhasoo":          "https://us.sulwhasoo.com/products.json?limit=250",
    "Dasique":            "https://dasique.com/products.json?limit=250",
    "Torriden":           "https://torriden.us/products.json?limit=250",
    "Ma:nyo":             "https://manyo.us/products.json?limit=250",
    "Missha":             "https://misshaus.com/products.json?limit=250",
    "Nature Republic":    "https://us.naturerepublic.com/products.json?limit=250",
    "Holika Holika":      "https://www.holikaholika.com/products.json?limit=250",
}

def normalize(s):
    return s.lower().replace("-", " ").replace("_", " ").strip()

def similarity(a, b):
    return SequenceMatcher(None, normalize(a), normalize(b)).ratio()

def fetch_shopify(brand, url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=12, verify=False)
        if r.status_code != 200:
            print(f"  [{brand}] HTTP {r.status_code}")
            return {}
        products = r.json().get("products", [])
        result = {}
        for p in products:
            title = p.get("title", "")
            imgs = p.get("images", [])
            if imgs:
                result[title] = imgs[0]["src"]
        print(f"  [{brand}] {len(result)} products fetched")
        return result
    except Exception as e:
        print(f"  [{brand}] ERROR: {e}")
        return {}

def main():
    db = SessionLocal()
    try:
        # Get all Korean products without image
        from routers.recommend import KOREAN_BRANDS
        products = db.query(Product).filter(
            Product.brand.in_(list(KOREAN_BRANDS)),
            Product.image_url.is_(None)
        ).all()
        print(f"\nProducts needing images: {len(products)}")

        # Group by brand
        by_brand = {}
        for p in products:
            by_brand.setdefault(p.brand, []).append(p)

        updated = 0
        for brand, store_url in SHOPIFY_STORES.items():
            if brand not in by_brand:
                continue
            db_products = by_brand[brand]
            print(f"\n{brand} ({len(db_products)} products):")
            shopify = fetch_shopify(brand, store_url)
            if not shopify:
                continue

            for dbp in db_products:
                best_score = 0
                best_url = None
                for title, img_url in shopify.items():
                    score = similarity(dbp.name, title)
                    if score > best_score:
                        best_score = score
                        best_url = img_url

                if best_score >= 0.6 and best_url:
                    dbp.image_url = best_url
                    updated += 1
                    print(f"  ✓ {dbp.name[:50]} ({best_score:.2f})")
                else:
                    print(f"  ✗ {dbp.name[:50]} (best={best_score:.2f})")

        db.commit()
        print(f"\nTotal updated: {updated} / {len(products)}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
