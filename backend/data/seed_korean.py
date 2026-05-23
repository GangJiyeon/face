import uuid
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

from db.session import SessionLocal
from db.models import Product

CONDITION_AVOID = {
    "redness":    ["alcohol", "fragrance", "parfum"],
    "trouble":    ["sodium lauryl sulfate", "sodium laureth sulfate", "paraben"],
    "brightness": ["fragrance", "parfum"],
    "moisture":   ["alcohol", "sodium lauryl sulfate"],
    "tone":       ["fragrance", "parfum"],
}

def get_avoid_conditions(ingredients):
    conditions = []
    for condition, avoid_list in CONDITION_AVOID.items():
        for ing in ingredients:
            if any(a in ing.lower() for a in avoid_list):
                conditions.append(condition)
                break
    return list(set(conditions))

PRODUCTS = [
    # ── COSRX ──────────────────────────────────────────────────────────────
    {"name": "Advanced Snail 96 Mucin Power Essence", "brand": "COSRX", "category": "serum",
     "ingredients": ["snail secretion filtrate", "niacinamide", "panthenol", "allantoin", "glycerin"],
     "suitable_skin_types": ["dry", "combination", "sensitive"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0039/A00000039461_01_430.png"},

    {"name": "Low pH Good Morning Gel Cleanser", "brand": "COSRX", "category": "skincare,cleanser",
     "ingredients": ["tea tree leaf oil", "glycerin", "allantoin", "panthenol", "betaine"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0019/A00000019870_01_430.png"},

    {"name": "AHA/BHA Clarifying Treatment Toner", "brand": "COSRX", "category": "toner",
     "ingredients": ["glycolic acid", "salicylic acid", "niacinamide", "betaine", "glycerin"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Salicylic Acid Daily Gentle Cleanser", "brand": "COSRX", "category": "skincare,cleanser",
     "ingredients": ["salicylic acid", "zinc", "panthenol", "allantoin"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Hyaluronic Acid Intensive Cream", "brand": "COSRX", "category": "moisturizer",
     "ingredients": ["hyaluronic acid", "ceramide", "glycerin", "panthenol", "allantoin"],
     "suitable_skin_types": ["dry", "sensitive", "combination"],
     "image_url": None},

    {"name": "Advanced Snail 92 All in One Cream", "brand": "COSRX", "category": "moisturizer",
     "ingredients": ["snail secretion filtrate", "niacinamide", "panthenol", "allantoin", "glycerin"],
     "suitable_skin_types": ["dry", "combination", "sensitive"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0019/A00000019872_01_430.png"},

    {"name": "BHA Blackhead Power Liquid", "brand": "COSRX", "category": "toner",
     "ingredients": ["salicylic acid", "betaine salicylate", "niacinamide", "glycerin"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Full Fit Propolis Light Ampoule", "brand": "COSRX", "category": "serum",
     "ingredients": ["propolis extract", "niacinamide", "hyaluronic acid", "panthenol"],
     "suitable_skin_types": ["dry", "sensitive", "combination"],
     "image_url": None},

    {"name": "Pure Fit Cica Serum", "brand": "COSRX", "category": "serum",
     "ingredients": ["centella asiatica", "panthenol", "allantoin", "glycerin"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Vitamin C 23 Serum with Vitamin F", "brand": "COSRX", "category": "serum",
     "ingredients": ["ascorbic acid", "niacinamide", "vitamin e", "glycerin", "squalane"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Oil-Free Ultra-Moisturizing Lotion", "brand": "COSRX", "category": "moisturizer",
     "ingredients": ["niacinamide", "zinc", "hyaluronic acid", "green tea extract"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "AC Collection Blemish Spot Drying Lotion", "brand": "COSRX", "category": "serum",
     "ingredients": ["salicylic acid", "zinc oxide", "tea tree leaf oil", "allantoin"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    # ── Innisfree ───────────────────────────────────────────────────────────
    {"name": "Green Tea Seed Serum", "brand": "Innisfree", "category": "serum",
     "ingredients": ["green tea extract", "hyaluronic acid", "glycerin", "panthenol"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0019/A00000019418_01_430.png"},

    {"name": "Green Tea Hyaluronic Acid Serum", "brand": "Innisfree", "category": "serum",
     "ingredients": ["green tea extract", "hyaluronic acid", "glycerin", "ceramide"],
     "suitable_skin_types": ["dry", "sensitive", "combination"],
     "image_url": None},

    {"name": "Pore Clearing Clay Mask", "brand": "Innisfree", "category": "skincare,mask",
     "ingredients": ["kaolin", "bentonite", "salicylic acid", "tea tree leaf oil", "zinc"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Bija Trouble Spot Essence", "brand": "Innisfree", "category": "serum",
     "ingredients": ["torreya nucifera seed oil", "salicylic acid", "niacinamide", "allantoin"],
     "suitable_skin_types": ["oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Jeju Cherry Blossom Jelly Cream", "brand": "Innisfree", "category": "moisturizer",
     "ingredients": ["prunus yedoensis leaf extract", "hyaluronic acid", "glycerin", "panthenol"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "Aloe Revital Soothing Gel 100%", "brand": "Innisfree", "category": "skincare,gel",
     "ingredients": ["aloe vera", "glycerin", "allantoin", "panthenol"],
     "suitable_skin_types": ["sensitive", "dry", "combination"],
     "image_url": None},

    {"name": "True Calm Centella Cream", "brand": "Innisfree", "category": "moisturizer",
     "ingredients": ["centella asiatica", "panthenol", "allantoin", "ceramide"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Volcanic Pore Cleansing Foam", "brand": "Innisfree", "category": "skincare,cleanser",
     "ingredients": ["volcanic ash", "salicylic acid", "kaolin", "glycerin"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Green Tea Seed Eye Cream", "brand": "Innisfree", "category": "skincare,eye cream",
     "ingredients": ["green tea extract", "peptide", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Yuja Niacin Brightening Sleeping Mask", "brand": "Innisfree", "category": "skincare,mask",
     "ingredients": ["yuzu extract", "niacinamide", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    # ── Laneige ─────────────────────────────────────────────────────────────
    {"name": "Water Sleeping Mask", "brand": "Laneige", "category": "skincare,mask",
     "ingredients": ["hyaluronic acid", "squalane", "glycerin", "panthenol", "ceramide"],
     "suitable_skin_types": ["dry", "sensitive", "combination"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0038/A00000038488_01_430.png"},

    {"name": "Cream Skin Toner & Moisturizer", "brand": "Laneige", "category": "toner",
     "ingredients": ["hyaluronic acid", "ceramide", "glycerin", "panthenol"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "Water Bank Blue Hyaluronic Cream", "brand": "Laneige", "category": "moisturizer",
     "ingredients": ["hyaluronic acid", "glycerin", "squalane", "ceramide", "green tea extract"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Bouncy & Firm Sleeping Mask", "brand": "Laneige", "category": "skincare,mask",
     "ingredients": ["peptide", "hyaluronic acid", "squalane", "glycerin"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Water Bank Blue Hyaluronic Serum", "brand": "Laneige", "category": "serum",
     "ingredients": ["hyaluronic acid", "glycerin", "panthenol", "ceramide"],
     "suitable_skin_types": ["dry", "combination", "sensitive"],
     "image_url": None},

    {"name": "Cica Sleeping Mask", "brand": "Laneige", "category": "skincare,mask",
     "ingredients": ["centella asiatica", "hyaluronic acid", "glycerin", "allantoin"],
     "suitable_skin_types": ["sensitive", "dry"],
     "image_url": None},

    {"name": "Water Bank Moisture Toner", "brand": "Laneige", "category": "toner",
     "ingredients": ["hyaluronic acid", "glycerin", "green tea extract", "panthenol"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Perfect Renew 3X Cream", "brand": "Laneige", "category": "moisturizer",
     "ingredients": ["peptide", "hyaluronic acid", "niacinamide", "squalane", "ceramide"],
     "suitable_skin_types": ["dry"],
     "image_url": None},

    # ── Some By Mi ──────────────────────────────────────────────────────────
    {"name": "AHA BHA PHA 30 Days Miracle Toner", "brand": "Some By Mi", "category": "toner",
     "ingredients": ["glycolic acid", "salicylic acid", "niacinamide", "centella asiatica", "tea tree leaf oil"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0036/A00000036569_01_430.png"},

    {"name": "AHA BHA PHA 30 Days Miracle Serum", "brand": "Some By Mi", "category": "serum",
     "ingredients": ["glycolic acid", "salicylic acid", "niacinamide", "centella asiatica", "allantoin"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "AHA BHA PHA 30 Days Miracle Cream", "brand": "Some By Mi", "category": "moisturizer",
     "ingredients": ["niacinamide", "centella asiatica", "allantoin", "glycerin", "panthenol"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Galactomyces Pure Vitamin C Glow Toner", "brand": "Some By Mi", "category": "toner",
     "ingredients": ["galactomyces ferment filtrate", "ascorbic acid", "niacinamide", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Snail Truecica Miracle Repair Cream", "brand": "Some By Mi", "category": "moisturizer",
     "ingredients": ["snail secretion filtrate", "centella asiatica", "panthenol", "allantoin"],
     "suitable_skin_types": ["sensitive", "dry"],
     "image_url": None},

    {"name": "Hyaluron B5 Hydra Sleeping Mask", "brand": "Some By Mi", "category": "skincare,mask",
     "ingredients": ["hyaluronic acid", "vitamin b5", "glycerin", "squalane", "ceramide"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Niacinamide 10 Ampoule", "brand": "Some By Mi", "category": "serum",
     "ingredients": ["niacinamide", "hyaluronic acid", "glycerin", "panthenol"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "CICA Peptide Anti-Aging Eye Cream", "brand": "Some By Mi", "category": "skincare,eye cream",
     "ingredients": ["centella asiatica", "peptide", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    # ── Klairs ──────────────────────────────────────────────────────────────
    {"name": "Supple Preparation Facial Toner", "brand": "Klairs", "category": "toner",
     "ingredients": ["beta-glucan", "hyaluronic acid", "glycerin", "allantoin", "panthenol"],
     "suitable_skin_types": ["dry", "sensitive", "combination"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0035/A00000035738_01_430.png"},

    {"name": "Rich Moist Soothing Serum", "brand": "Klairs", "category": "serum",
     "ingredients": ["beta-glucan", "hyaluronic acid", "allantoin", "panthenol", "centella asiatica"],
     "suitable_skin_types": ["sensitive", "dry"],
     "image_url": None},

    {"name": "Midnight Blue Calming Cream", "brand": "Klairs", "category": "moisturizer",
     "ingredients": ["guaiazulene", "centella asiatica", "allantoin", "panthenol", "ceramide"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Rich Moist Soothing Cream", "brand": "Klairs", "category": "moisturizer",
     "ingredients": ["beta-glucan", "ceramide", "glycerin", "squalane", "allantoin"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "Freshly Juiced Vitamin Drop", "brand": "Klairs", "category": "serum",
     "ingredients": ["ascorbic acid", "niacinamide", "glycerin", "hyaluronic acid"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Rich Moist Foaming Cleanser", "brand": "Klairs", "category": "skincare,cleanser",
     "ingredients": ["glycerin", "panthenol", "allantoin", "ceramide"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "Supple Preparation Unscented Toner", "brand": "Klairs", "category": "toner",
     "ingredients": ["beta-glucan", "hyaluronic acid", "glycerin", "allantoin"],
     "suitable_skin_types": ["sensitive", "dry", "combination"],
     "image_url": None},

    # ── Torriden ─────────────────────────────────────────────────────────────
    {"name": "DIVE-IN Low Molecular Hyaluronic Acid Serum", "brand": "Torriden", "category": "serum",
     "ingredients": ["hyaluronic acid", "glycerin", "panthenol", "allantoin"],
     "suitable_skin_types": ["dry", "combination", "sensitive"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0044/A00000044618_01_430.png"},

    {"name": "DIVE-IN Low Molecule Hyaluronic Acid Toner", "brand": "Torriden", "category": "toner",
     "ingredients": ["hyaluronic acid", "glycerin", "panthenol", "centella asiatica"],
     "suitable_skin_types": ["dry", "combination", "sensitive"],
     "image_url": None},

    {"name": "DIVE-IN Low Molecule Hyaluronic Acid Cream", "brand": "Torriden", "category": "moisturizer",
     "ingredients": ["hyaluronic acid", "ceramide", "glycerin", "squalane"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "SOLID-IN Ceramide Serum", "brand": "Torriden", "category": "serum",
     "ingredients": ["ceramide", "hyaluronic acid", "glycerin", "squalane", "panthenol"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "SOLID-IN Ceramide Cream", "brand": "Torriden", "category": "moisturizer",
     "ingredients": ["ceramide", "squalane", "glycerin", "hyaluronic acid", "panthenol"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "DIVE-IN Light Sun Fluid SPF50+", "brand": "Torriden", "category": "sunscreen",
     "ingredients": ["zinc oxide", "hyaluronic acid", "glycerin", "niacinamide"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "SOLID-IN Ceramide Toner", "brand": "Torriden", "category": "toner",
     "ingredients": ["ceramide", "hyaluronic acid", "glycerin", "panthenol"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    # ── Beauty of Joseon ────────────────────────────────────────────────────
    {"name": "Relief Sun: Rice + Probiotics SPF50+", "brand": "Beauty of Joseon", "category": "sunscreen",
     "ingredients": ["rice extract", "lactobacillus ferment", "niacinamide", "glycerin", "hyaluronic acid"],
     "suitable_skin_types": ["sensitive", "dry", "combination"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0046/A00000046539_01_430.png"},

    {"name": "Glow Serum: Propolis + Niacinamide", "brand": "Beauty of Joseon", "category": "serum",
     "ingredients": ["propolis extract", "niacinamide", "glycerin", "hyaluronic acid"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Revive Serum: Ginseng + Snail Mucin", "brand": "Beauty of Joseon", "category": "serum",
     "ingredients": ["ginseng root extract", "snail secretion filtrate", "niacinamide", "glycerin"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Dynasty Cream", "brand": "Beauty of Joseon", "category": "moisturizer",
     "ingredients": ["ginseng root extract", "rice bran extract", "hyaluronic acid", "squalane", "ceramide"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "Matte Sun Stick: Mugwort + Camomile SPF50+", "brand": "Beauty of Joseon", "category": "sunscreen",
     "ingredients": ["zinc oxide", "artemisia princeps leaf extract", "chamomilla recutita extract", "niacinamide"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Calming Serum: Heartleaf + Panthenol", "brand": "Beauty of Joseon", "category": "serum",
     "ingredients": ["houttuynia cordata extract", "panthenol", "allantoin", "centella asiatica", "glycerin"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Radiance Cleansing Balm", "brand": "Beauty of Joseon", "category": "skincare,cleanser",
     "ingredients": ["rice bran oil", "squalane", "glycerin", "vitamin e"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    # ── Round Lab ───────────────────────────────────────────────────────────
    {"name": "Birch Juice Moisturizing Toner", "brand": "Round Lab", "category": "toner",
     "ingredients": ["betula platyphylla juice", "hyaluronic acid", "glycerin", "panthenol"],
     "suitable_skin_types": ["dry", "combination", "sensitive"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0047/A00000047469_01_430.png"},

    {"name": "Birch Juice Moisturizing Serum", "brand": "Round Lab", "category": "serum",
     "ingredients": ["betula platyphylla juice", "hyaluronic acid", "ceramide", "glycerin"],
     "suitable_skin_types": ["dry", "combination", "sensitive"],
     "image_url": None},

    {"name": "Birch Juice Moisturizing Cream", "brand": "Round Lab", "category": "moisturizer",
     "ingredients": ["betula platyphylla juice", "ceramide", "squalane", "glycerin", "hyaluronic acid"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "1025 Dokdo Toner", "brand": "Round Lab", "category": "toner",
     "ingredients": ["deep sea water", "hyaluronic acid", "glycerin", "panthenol", "allantoin"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "1025 Dokdo Cream", "brand": "Round Lab", "category": "moisturizer",
     "ingredients": ["deep sea water", "ceramide", "hyaluronic acid", "glycerin", "squalane"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "Mugwort Calming Pad", "brand": "Round Lab", "category": "toner",
     "ingredients": ["artemisia princeps leaf extract", "centella asiatica", "allantoin", "panthenol"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Sunscreen Birch Juice Moisturizing SPF50+", "brand": "Round Lab", "category": "sunscreen",
     "ingredients": ["betula platyphylla juice", "zinc oxide", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["dry", "combination", "sensitive"],
     "image_url": None},

    # ── Anua ─────────────────────────────────────────────────────────────────
    {"name": "Heartleaf 77% Soothing Toner", "brand": "Anua", "category": "toner",
     "ingredients": ["houttuynia cordata extract", "centella asiatica", "allantoin", "panthenol", "glycerin"],
     "suitable_skin_types": ["sensitive", "dry", "combination"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0053/A00000053745_01_430.png"},

    {"name": "Heartleaf Soothing Cream", "brand": "Anua", "category": "moisturizer",
     "ingredients": ["houttuynia cordata extract", "centella asiatica", "ceramide", "glycerin", "panthenol"],
     "suitable_skin_types": ["sensitive", "dry"],
     "image_url": None},

    {"name": "Heartleaf Quercetinol Pore Deep Cleansing Foam", "brand": "Anua", "category": "skincare,cleanser",
     "ingredients": ["houttuynia cordata extract", "quercetinol", "salicylic acid", "glycerin"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Niacinamide 10% + TXA 4% Uneven Tone Serum", "brand": "Anua", "category": "serum",
     "ingredients": ["niacinamide", "tranexamic acid", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Heartleaf Quercetinol Calming Ampoule", "brand": "Anua", "category": "serum",
     "ingredients": ["houttuynia cordata extract", "quercetinol", "centella asiatica", "allantoin"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Heartleaf Blemish Pad", "brand": "Anua", "category": "toner",
     "ingredients": ["houttuynia cordata extract", "salicylic acid", "niacinamide", "allantoin"],
     "suitable_skin_types": ["oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Heartleaf 70% Daily Relief Cream", "brand": "Anua", "category": "moisturizer",
     "ingredients": ["houttuynia cordata extract", "ceramide", "glycerin", "panthenol"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    # ── Purito ───────────────────────────────────────────────────────────────
    {"name": "CENTELLA Unscented Serum", "brand": "Purito", "category": "serum",
     "ingredients": ["centella asiatica", "allantoin", "panthenol", "glycerin", "hyaluronic acid"],
     "suitable_skin_types": ["sensitive"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0040/A00000040874_01_430.png"},

    {"name": "Galacto Niacin 97 Power Essence", "brand": "Purito", "category": "serum",
     "ingredients": ["galactomyces ferment filtrate", "niacinamide", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "CENTELLA Green Level Buffet Serum", "brand": "Purito", "category": "serum",
     "ingredients": ["centella asiatica", "panthenol", "allantoin", "niacinamide", "ceramide"],
     "suitable_skin_types": ["sensitive", "dry"],
     "image_url": None},

    {"name": "CENTELLA Unscented Sun SPF50+", "brand": "Purito", "category": "sunscreen",
     "ingredients": ["zinc oxide", "centella asiatica", "allantoin", "panthenol"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Daily Go-To Sunscreen SPF50+", "brand": "Purito", "category": "sunscreen",
     "ingredients": ["zinc oxide", "niacinamide", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "CENTELLA Unscented Toner", "brand": "Purito", "category": "toner",
     "ingredients": ["centella asiatica", "allantoin", "panthenol", "glycerin"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Wonder Releaf Centella Toning Cream", "brand": "Purito", "category": "moisturizer",
     "ingredients": ["centella asiatica", "niacinamide", "ceramide", "glycerin", "squalane"],
     "suitable_skin_types": ["sensitive", "dry"],
     "image_url": None},

    # ── I'm From ─────────────────────────────────────────────────────────────
    {"name": "Mugwort Essence", "brand": "I'm From", "category": "serum",
     "ingredients": ["artemisia princeps leaf extract", "centella asiatica", "allantoin", "glycerin"],
     "suitable_skin_types": ["sensitive", "dry"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0040/A00000040701_01_430.png"},

    {"name": "Rice Toner", "brand": "I'm From", "category": "toner",
     "ingredients": ["rice extract", "niacinamide", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Fig Boosting Serum", "brand": "I'm From", "category": "serum",
     "ingredients": ["fig extract", "peptide", "hyaluronic acid", "glycerin", "squalane"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Honey Mask", "brand": "I'm From", "category": "skincare,mask",
     "ingredients": ["honey extract", "glycerin", "panthenol", "hyaluronic acid"],
     "suitable_skin_types": ["dry"],
     "image_url": None},

    {"name": "Beer Yeast Essence", "brand": "I'm From", "category": "serum",
     "ingredients": ["saccharomyces ferment filtrate", "niacinamide", "glycerin", "hyaluronic acid"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Vitamin Tree Water Pad", "brand": "I'm From", "category": "toner",
     "ingredients": ["sea buckthorn extract", "niacinamide", "ascorbic acid", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    # ── Abib ─────────────────────────────────────────────────────────────────
    {"name": "Mild Acidic pH Sheet Mask Cica Fit", "brand": "Abib", "category": "skincare,mask",
     "ingredients": ["centella asiatica", "allantoin", "panthenol", "glycerin"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Quick Sunstick Comforting SPF50+", "brand": "Abib", "category": "sunscreen",
     "ingredients": ["zinc oxide", "centella asiatica", "allantoin", "glycerin"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Collagen Jelly Cream", "brand": "Abib", "category": "moisturizer",
     "ingredients": ["hydrolyzed collagen", "peptide", "hyaluronic acid", "glycerin", "ceramide"],
     "suitable_skin_types": ["dry"],
     "image_url": None},

    {"name": "Jericho Rose Serum", "brand": "Abib", "category": "serum",
     "ingredients": ["anastatica hierochuntica extract", "hyaluronic acid", "glycerin", "squalane"],
     "suitable_skin_types": ["dry"],
     "image_url": None},

    {"name": "Mild Acidic pH Foam Cleanser Heartleaf Fit", "brand": "Abib", "category": "skincare,cleanser",
     "ingredients": ["houttuynia cordata extract", "allantoin", "panthenol", "glycerin"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Sedum AC Control Essence", "brand": "Abib", "category": "serum",
     "ingredients": ["sedum sarmentosum extract", "salicylic acid", "niacinamide", "zinc"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    # ── Numbuzin ─────────────────────────────────────────────────────────────
    {"name": "No.3 Skin Softening Serum", "brand": "Numbuzin", "category": "serum",
     "ingredients": ["galactomyces ferment filtrate", "niacinamide", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0051/A00000051636_01_430.png"},

    {"name": "No.5 Vitamin Niacinamide 43% Serum", "brand": "Numbuzin", "category": "serum",
     "ingredients": ["niacinamide", "ascorbic acid", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "No.3 Skin Softening Toner", "brand": "Numbuzin", "category": "toner",
     "ingredients": ["galactomyces ferment filtrate", "niacinamide", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Pore Pudding Essence Toner", "brand": "Numbuzin", "category": "toner",
     "ingredients": ["niacinamide", "salicylic acid", "zinc", "hyaluronic acid"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "No.6 Essential Cover Serum", "brand": "Numbuzin", "category": "serum",
     "ingredients": ["niacinamide", "peptide", "hyaluronic acid", "glycerin", "squalane"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    # ── Skin1004 ─────────────────────────────────────────────────────────────
    {"name": "Madagascar Centella Ampoule", "brand": "Skin1004", "category": "serum",
     "ingredients": ["centella asiatica", "allantoin", "panthenol", "glycerin"],
     "suitable_skin_types": ["sensitive"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0046/A00000046092_01_430.png"},

    {"name": "Madagascar Centella Soothing Cream", "brand": "Skin1004", "category": "moisturizer",
     "ingredients": ["centella asiatica", "allantoin", "panthenol", "ceramide", "glycerin"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Madagascar Centella Hyalu-Cica Water-Fit Sun Serum SPF50+", "brand": "Skin1004", "category": "sunscreen",
     "ingredients": ["centella asiatica", "hyaluronic acid", "niacinamide", "zinc oxide"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Madagascar Centella Tone Brightening Capsule Ampoule", "brand": "Skin1004", "category": "serum",
     "ingredients": ["centella asiatica", "niacinamide", "ascorbic acid", "hyaluronic acid"],
     "suitable_skin_types": ["sensitive", "combination"],
     "image_url": None},

    {"name": "Madagascar Centella Toning Toner", "brand": "Skin1004", "category": "toner",
     "ingredients": ["centella asiatica", "niacinamide", "glycerin", "allantoin"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Zombie Beauty Hydra Rebarrier Cream", "brand": "Skin1004", "category": "moisturizer",
     "ingredients": ["hyaluronic acid", "ceramide", "squalane", "glycerin", "panthenol"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    # ── Dr. Jart+ ────────────────────────────────────────────────────────────
    {"name": "Cicapair Tiger Grass Color Correcting Treatment", "brand": "Dr. Jart+", "category": "moisturizer",
     "ingredients": ["centella asiatica", "panthenol", "allantoin", "niacinamide"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Ceramidin Cream", "brand": "Dr. Jart+", "category": "moisturizer",
     "ingredients": ["ceramide", "hyaluronic acid", "glycerin", "squalane", "panthenol"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "Ceramidin Liquid", "brand": "Dr. Jart+", "category": "toner",
     "ingredients": ["ceramide", "hyaluronic acid", "glycerin", "panthenol"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "Vital Hydra Solution Biome Cream", "brand": "Dr. Jart+", "category": "moisturizer",
     "ingredients": ["hyaluronic acid", "ceramide", "glycerin", "squalane", "lactobacillus ferment"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    # ── Sulwhasoo ────────────────────────────────────────────────────────────
    {"name": "First Care Activating Serum VI", "brand": "Sulwhasoo", "category": "serum",
     "ingredients": ["ginseng root extract", "rehmannia root extract", "glycerin", "hyaluronic acid"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Concentrated Ginseng Renewing Cream", "brand": "Sulwhasoo", "category": "moisturizer",
     "ingredients": ["ginseng root extract", "peptide", "hyaluronic acid", "squalane"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Essential Comfort Firming Cream", "brand": "Sulwhasoo", "category": "moisturizer",
     "ingredients": ["ginseng root extract", "ceramide", "peptide", "hyaluronic acid"],
     "suitable_skin_types": ["dry"],
     "image_url": None},

    {"name": "Snowise Brightening Water", "brand": "Sulwhasoo", "category": "toner",
     "ingredients": ["white peony root extract", "niacinamide", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    # ── Missha ───────────────────────────────────────────────────────────────
    {"name": "Time Revolution The First Essence 5X", "brand": "Missha", "category": "serum",
     "ingredients": ["saccharomyces ferment filtrate", "niacinamide", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Super Aqua Cell Renew Snail Cream", "brand": "Missha", "category": "moisturizer",
     "ingredients": ["snail secretion filtrate", "hyaluronic acid", "glycerin", "ceramide"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "All Around Safe Block Essence Sun SPF45", "brand": "Missha", "category": "sunscreen",
     "ingredients": ["niacinamide", "hyaluronic acid", "glycerin", "allantoin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "M Perfect Cover BB Cream SPF42", "brand": "Missha", "category": "bb cream",
     "ingredients": ["niacinamide", "hyaluronic acid", "glycerin", "titanium dioxide"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    # ── Nature Republic ──────────────────────────────────────────────────────
    {"name": "Aloe Vera 92% Soothing Gel", "brand": "Nature Republic", "category": "skincare,gel",
     "ingredients": ["aloe vera", "glycerin", "allantoin", "panthenol"],
     "suitable_skin_types": ["sensitive", "dry", "combination"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0014/A00000014870_01_430.png"},

    {"name": "Super Aqua Max Combination Watery Lotion", "brand": "Nature Republic", "category": "moisturizer",
     "ingredients": ["hyaluronic acid", "niacinamide", "green tea extract", "glycerin"],
     "suitable_skin_types": ["combination", "oily"],
     "image_url": None},

    {"name": "Snail Solution Ampoule", "brand": "Nature Republic", "category": "serum",
     "ingredients": ["snail secretion filtrate", "niacinamide", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Real Natura Aloe Vera Mist", "brand": "Nature Republic", "category": "skincare,mist",
     "ingredients": ["aloe vera", "glycerin", "allantoin", "panthenol"],
     "suitable_skin_types": ["sensitive", "dry", "combination"],
     "image_url": None},

    # ── Ma:nyo ───────────────────────────────────────────────────────────────
    {"name": "Bifida Biome Intensive Toner", "brand": "Ma:nyo", "category": "toner",
     "ingredients": ["bifida ferment lysate", "hyaluronic acid", "glycerin", "ceramide", "panthenol"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "Galac-Niacin 2% Activating Essence", "brand": "Ma:nyo", "category": "serum",
     "ingredients": ["galactomyces ferment filtrate", "niacinamide", "hyaluronic acid", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Bifida Biome Concentrate Ampoule", "brand": "Ma:nyo", "category": "serum",
     "ingredients": ["bifida ferment lysate", "ceramide", "hyaluronic acid", "squalane"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "Pure Cleansing Oil", "brand": "Ma:nyo", "category": "skincare,cleanser",
     "ingredients": ["mineral oil", "squalane", "glycerin", "vitamin e"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    # ── Etude House ──────────────────────────────────────────────────────────
    {"name": "Soon Jung 2x Barrier Intensive Cream", "brand": "Etude House", "category": "moisturizer",
     "ingredients": ["panthenol", "madecassoside", "allantoin", "squalane", "ceramide"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "SoonJung pH 5.5 Relief Toner", "brand": "Etude House", "category": "toner",
     "ingredients": ["panthenol", "madecassoside", "allantoin", "glycerin"],
     "suitable_skin_types": ["sensitive"],
     "image_url": None},

    {"name": "Moistfull Collagen Cream", "brand": "Etude House", "category": "moisturizer",
     "ingredients": ["hydrolyzed collagen", "hyaluronic acid", "glycerin", "squalane"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "AC Clean Up Foggy Cream", "brand": "Etude House", "category": "moisturizer",
     "ingredients": ["salicylic acid", "niacinamide", "zinc", "centella asiatica"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    # ── Mediheal ─────────────────────────────────────────────────────────────
    {"name": "N.M.F Aquaring Ampoule Mask", "brand": "Mediheal", "category": "skincare,mask",
     "ingredients": ["hyaluronic acid", "glycerin", "panthenol", "allantoin"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Tea Tree Care Solution Essential Mask", "brand": "Mediheal", "category": "skincare,mask",
     "ingredients": ["tea tree leaf oil", "salicylic acid", "niacinamide", "allantoin"],
     "suitable_skin_types": ["oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Collagen Impact Essential Mask", "brand": "Mediheal", "category": "skincare,mask",
     "ingredients": ["hydrolyzed collagen", "hyaluronic acid", "glycerin", "peptide"],
     "suitable_skin_types": ["dry"],
     "image_url": None},

    {"name": "H.D.P Pore-Stamping Black Mask", "brand": "Mediheal", "category": "skincare,mask",
     "ingredients": ["charcoal", "salicylic acid", "kaolin", "zinc"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    # ── TONYMOLY ─────────────────────────────────────────────────────────────
    {"name": "Intense Care Snail Hydro Gel Cream", "brand": "TONYMOLY", "category": "moisturizer",
     "ingredients": ["snail secretion filtrate", "hyaluronic acid", "glycerin", "allantoin"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "The Chok Chok Green Tea Watery Cream", "brand": "TONYMOLY", "category": "moisturizer",
     "ingredients": ["green tea extract", "hyaluronic acid", "glycerin", "niacinamide"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Wonder Ceramide Mocchi Toner", "brand": "TONYMOLY", "category": "toner",
     "ingredients": ["ceramide", "hyaluronic acid", "glycerin", "panthenol"],
     "suitable_skin_types": ["dry", "sensitive"],
     "image_url": None},

    {"name": "Master Lab Hyaluronic Acid Mask", "brand": "TONYMOLY", "category": "skincare,mask",
     "ingredients": ["hyaluronic acid", "glycerin", "panthenol", "allantoin"],
     "suitable_skin_types": ["dry"],
     "image_url": None},

    # ══════════════════════════════════════════════════════════════════════════
    # MAKEUP
    # ══════════════════════════════════════════════════════════════════════════

    # ── Romand ───────────────────────────────────────────────────────────────
    {"name": "Zero Velvet Tint 01 After Brown", "brand": "Romand", "category": "lip,makeup",
     "ingredients": ["dimethicone", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0048/A00000048436_01_430.png"},

    {"name": "Zero Velvet Tint 07 Fig Fading", "brand": "Romand", "category": "lip,makeup",
     "ingredients": ["dimethicone", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Juicy Lasting Tint 01 Bare Coral", "brand": "Romand", "category": "lip,makeup",
     "ingredients": ["castor oil", "vitamin e", "glycerin", "hyaluronic acid"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Juicy Lasting Tint 23 Dried Mango", "brand": "Romand", "category": "lip,makeup",
     "ingredients": ["castor oil", "vitamin e", "glycerin", "hyaluronic acid"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Han All Sheer Balm 01 Coral", "brand": "Romand", "category": "lip,makeup",
     "ingredients": ["shea butter", "castor oil", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Blur Fudge Tint 01 Chilling Nude", "brand": "Romand", "category": "lip,makeup",
     "ingredients": ["dimethicone", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Better Than Palette 01 Coral Driving", "brand": "Romand", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "talc", "nylon-12", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Better Than Palette 02 Blossom Landing", "brand": "Romand", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "talc", "nylon-12", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Bare Glam Tint 03 Bare Pink", "brand": "Romand", "category": "lip,makeup",
     "ingredients": ["castor oil", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Nonfiction Lip Butter 02 Clapotis", "brand": "Romand", "category": "lip,makeup",
     "ingredients": ["shea butter", "castor oil", "jojoba oil", "vitamin e"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Zero Gram Cushion SPF50+ N21", "brand": "Romand", "category": "foundation,makeup",
     "ingredients": ["niacinamide", "hyaluronic acid", "glycerin", "titanium dioxide"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Dewy Ful Water Tint 01 Lychee Squeeze", "brand": "Romand", "category": "lip,makeup",
     "ingredients": ["castor oil", "hyaluronic acid", "glycerin", "vitamin e"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    # ── 3CE ──────────────────────────────────────────────────────────────────
    {"name": "Velvet Lip Color Mellow Road", "brand": "3CE", "category": "lip,makeup",
     "ingredients": ["dimethicone", "vitamin e", "glycerin", "shea butter"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0025/A00000025543_01_430.png"},

    {"name": "Velvet Lip Color Pure Red", "brand": "3CE", "category": "lip,makeup",
     "ingredients": ["dimethicone", "vitamin e", "glycerin", "shea butter"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Mood Recipe Matte Lip Color Brick Rose", "brand": "3CE", "category": "lip,makeup",
     "ingredients": ["dimethicone", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Soft Matte Lipstick Ivory Pink", "brand": "3CE", "category": "lip,makeup",
     "ingredients": ["shea butter", "castor oil", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Eye Switch Slow Dive", "brand": "3CE", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "talc", "nylon-12", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Multi Eye Color Palette Face Cut", "brand": "3CE", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "talc", "nylon-12"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Stylenanda Blur Powder", "brand": "3CE", "category": "makeup,face makeup",
     "ingredients": ["talc", "nylon-12", "mica", "silica"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Back To Baby Eye Palette", "brand": "3CE", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "talc", "nylon-12", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Glossy Lip Color Rose Wine", "brand": "3CE", "category": "lip,makeup",
     "ingredients": ["castor oil", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Glow Foundation N21", "brand": "3CE", "category": "foundation,makeup",
     "ingredients": ["niacinamide", "hyaluronic acid", "glycerin", "titanium dioxide"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    # ── Peripera ─────────────────────────────────────────────────────────────
    {"name": "Ink Mood Drop Tint 01 Mauveful", "brand": "Peripera", "category": "lip,makeup",
     "ingredients": ["dimethicone", "glycerin", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0048/A00000048808_01_430.png"},

    {"name": "Ink Mood Drop Tint 11 Elf Pink", "brand": "Peripera", "category": "lip,makeup",
     "ingredients": ["dimethicone", "glycerin", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Ink Velvet 13 Rosy Nude", "brand": "Peripera", "category": "lip,makeup",
     "ingredients": ["dimethicone", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Ink Mood Matte Blur Tint 01 Soda Red", "brand": "Peripera", "category": "lip,makeup",
     "ingredients": ["dimethicone", "vitamin e", "glycerin"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Ink Lasting Foundation Glow N21", "brand": "Peripera", "category": "foundation,makeup",
     "ingredients": ["niacinamide", "hyaluronic acid", "glycerin", "titanium dioxide"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Peri's Ink Velvet 05 Orange Bears", "brand": "Peripera", "category": "lip,makeup",
     "ingredients": ["dimethicone", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Ink Airy Velvet 20 Vintage Brown", "brand": "Peripera", "category": "lip,makeup",
     "ingredients": ["dimethicone", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    # ── Clio ─────────────────────────────────────────────────────────────────
    {"name": "Sharp So Simple Waterproof Pencil Liner Black", "brand": "Clio", "category": "eye,makeup",
     "ingredients": ["hydrogenated polyisobutene", "mica", "iron oxides"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Kill Black Waterproof Liner", "brand": "Clio", "category": "eye,makeup",
     "ingredients": ["acrylates copolymer", "iron oxides", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Pro Eye Palette Air", "brand": "Clio", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "talc", "nylon-12", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Natural Glam Eye Palette", "brand": "Clio", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "talc", "nylon-12"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Nudism Velvet Lipstick 01 Bare Nude", "brand": "Clio", "category": "lip,makeup",
     "ingredients": ["shea butter", "castor oil", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Stay Perfect Foundation SPF30", "brand": "Clio", "category": "foundation,makeup",
     "ingredients": ["niacinamide", "zinc", "hyaluronic acid", "titanium dioxide"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Waterproof Pen Liner Kill Black Long", "brand": "Clio", "category": "eye,makeup",
     "ingredients": ["acrylates copolymer", "iron oxides"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    # ── Espoir ───────────────────────────────────────────────────────────────
    {"name": "Nowear Finish Cushion SPF45 N21", "brand": "Espoir", "category": "foundation,makeup",
     "ingredients": ["niacinamide", "zinc", "hyaluronic acid", "titanium dioxide"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Water Splash Cushion SPF50+", "brand": "Espoir", "category": "foundation,makeup",
     "ingredients": ["hyaluronic acid", "glycerin", "niacinamide", "titanium dioxide"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Real Eye Palette Masquerade", "brand": "Espoir", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "talc", "nylon-12", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Couture Lip Maison Rose", "brand": "Espoir", "category": "lip,makeup",
     "ingredients": ["shea butter", "castor oil", "glycerin", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Pro Tailor Foundation N21", "brand": "Espoir", "category": "foundation,makeup",
     "ingredients": ["niacinamide", "hyaluronic acid", "glycerin", "titanium dioxide"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    # ── Dasique ──────────────────────────────────────────────────────────────
    {"name": "Shadow Palette 01 Cherry Blossom", "brand": "Dasique", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "talc", "nylon-12", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0044/A00000044753_01_430.png"},

    {"name": "Shadow Palette 06 Peach Cinnamon", "brand": "Dasique", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "talc", "nylon-12", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Mood Recipe Lip 02 Sunday Sunset", "brand": "Dasique", "category": "lip,makeup",
     "ingredients": ["castor oil", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Blur Fit Eye Palette 15 Earl Grey", "brand": "Dasique", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "talc", "nylon-12"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Fruity Lip Balm 02 Strawberry", "brand": "Dasique", "category": "lip,makeup",
     "ingredients": ["castor oil", "shea butter", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Glassy Layer Fixing Tint 01 Transparent Coral", "brand": "Dasique", "category": "lip,makeup",
     "ingredients": ["castor oil", "hyaluronic acid", "glycerin", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    # ── Wakemake ─────────────────────────────────────────────────────────────
    {"name": "Soft Blurring Lip Cover 03 Dusty Rose", "brand": "Wakemake", "category": "lip,makeup",
     "ingredients": ["dimethicone", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Blur Cover Foundation SPF30", "brand": "Wakemake", "category": "foundation,makeup",
     "ingredients": ["niacinamide", "hyaluronic acid", "glycerin", "titanium dioxide"],
     "suitable_skin_types": ["combination", "oily"],
     "image_url": None},

    {"name": "Dewy Blush 03 Blushing Peach", "brand": "Wakemake", "category": "blush,cheek,makeup",
     "ingredients": ["mica", "talc", "nylon-12", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Soft Blurring Eye Palette 04 Dusty Coral", "brand": "Wakemake", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "talc", "nylon-12", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Do Good Lip Stick 01 Rosy Beige", "brand": "Wakemake", "category": "lip,makeup",
     "ingredients": ["shea butter", "castor oil", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    # ── Laneige Makeup ───────────────────────────────────────────────────────
    {"name": "Lip Sleeping Mask Berry", "brand": "Laneige", "category": "lip,makeup",
     "ingredients": ["shea butter", "hyaluronic acid", "vitamin c", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0038/A00000038490_01_430.png"},

    {"name": "Neo Cushion Matte N21", "brand": "Laneige", "category": "foundation,makeup",
     "ingredients": ["niacinamide", "zinc", "hyaluronic acid", "titanium dioxide"],
     "suitable_skin_types": ["oily"],
     "image_url": None},

    {"name": "Neo Cushion Glow N21", "brand": "Laneige", "category": "foundation,makeup",
     "ingredients": ["hyaluronic acid", "glycerin", "niacinamide", "titanium dioxide"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Glowy Makeup Serum", "brand": "Laneige", "category": "makeup,face makeup",
     "ingredients": ["hyaluronic acid", "glycerin", "squalane", "niacinamide"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    # ── Holika Holika ────────────────────────────────────────────────────────
    {"name": "Holi Pop Blur Lasting Foundation N21", "brand": "Holika Holika", "category": "foundation,makeup",
     "ingredients": ["niacinamide", "hyaluronic acid", "glycerin", "titanium dioxide"],
     "suitable_skin_types": ["dry", "combination"],
     "image_url": None},

    {"name": "Holi Pop BB Cream Matte", "brand": "Holika Holika", "category": "bb cream,makeup",
     "ingredients": ["niacinamide", "hyaluronic acid", "glycerin", "titanium dioxide"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Wonder Drawing Jolifit Mascara Black", "brand": "Holika Holika", "category": "eye,makeup",
     "ingredients": ["acrylates copolymer", "glycerin", "panthenol"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Eye Metal Glitter 01 Gold", "brand": "Holika Holika", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "glycerin", "polyisobutene"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Holi Pop Velvet Lip Tint 01 Rose Petal", "brand": "Holika Holika", "category": "lip,makeup",
     "ingredients": ["dimethicone", "vitamin e", "glycerin"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    # ── About Tone ───────────────────────────────────────────────────────────
    {"name": "Shut Up & Shine Highlighter 01 Champagne Toast", "brand": "About Tone", "category": "makeup,face makeup",
     "ingredients": ["mica", "nylon-12", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Don't Touch My Blusher 04 Vivid Pink", "brand": "About Tone", "category": "blush,cheek,makeup",
     "ingredients": ["mica", "talc", "nylon-12"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Full Lasting Foundation 23N", "brand": "About Tone", "category": "foundation,makeup",
     "ingredients": ["niacinamide", "hyaluronic acid", "glycerin", "titanium dioxide"],
     "suitable_skin_types": ["oily", "combination"],
     "image_url": None},

    {"name": "Leave On Me Tinted Moisturizer", "brand": "About Tone", "category": "bb cream,makeup",
     "ingredients": ["hyaluronic acid", "niacinamide", "glycerin", "titanium dioxide"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},

    {"name": "Tone-in Eye Shadow Palette 01 Peach", "brand": "About Tone", "category": "eyeshadow,makeup",
     "ingredients": ["mica", "talc", "nylon-12", "vitamin e"],
     "suitable_skin_types": ["dry", "oily", "combination", "sensitive"],
     "image_url": None},
]


def seed():
    db = SessionLocal()
    try:
        existing = {(p.name, p.brand) for p in db.query(Product.name, Product.brand).all()}
        added = 0
        skipped = 0

        for data in PRODUCTS:
            if (data["name"], data["brand"]) in existing:
                skipped += 1
                continue
            avoid = get_avoid_conditions(data["ingredients"])
            db.add(Product(
                id=str(uuid.uuid4()),
                name=data["name"],
                brand=data["brand"],
                category=data["category"],
                ingredients=data["ingredients"],
                avoid_conditions=avoid,
                image_url=data["image_url"],
                suitable_skin_types=data["suitable_skin_types"],
            ))
            added += 1

        db.commit()
        print(f"Done: {added} added, {skipped} skipped (duplicate).")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
