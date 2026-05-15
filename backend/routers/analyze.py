import uuid, os, shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from db.models import Product, AnalysisHistory
from pipeline.face import extract_landmarks
from pipeline.preprocess import preprocess_roi
from pipeline.scoring import calculate_scores
from pipeline.gemini import generate_recommendation_reason
from core.auth import get_current_user
from datetime import datetime

router = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/heic", "image/webp"]
MAX_SIZE = 10 * 1024 * 1024
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")

@router.get("/")
def analyze_health():
    return {"message": "analyze router ok"}

@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    from fastapi import HTTPException
    if not current_user:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")

    from sqlalchemy import desc
    records = (
        db.query(AnalysisHistory)
        .filter(AnalysisHistory.user_id == current_user["id"])
        .order_by(desc(AnalysisHistory.analyzed_at))
        .all()
    )

    base_url = "http://localhost:8000"
    return [
        {
            "id": r.id,
            "skin_type": r.skin_type,
            "overall_score": round((r.skin_scores or {}).get("overall", 0), 1),
            "skin_scores": r.skin_scores,
            "analyzed_at": r.analyzed_at.isoformat(),
            "image_url": f"{base_url}/uploads/{r.image_filename}" if r.image_filename else None,
            "landmarks": r.landmarks or [],
            "image_size": r.image_size or {"width": 1, "height": 1},
        }
        for r in records
    ]

@router.post("/")
async def analyze_skin(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="지원하지 않는 파일 형식입니다.")
    
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="파일 크기는 10MB 이하여야 합니다.")

    record_id = str(uuid.uuid4())
    suffix = os.path.splitext(file.filename)[1]
    tmp_path = f"/tmp/{record_id}{suffix}"
    upload_filename = f"{record_id}{suffix}"
    upload_path = os.path.join(UPLOADS_DIR, upload_filename)

    with open(tmp_path, "wb") as f:
        f.write(contents)

    try:
        # 1. 랜드마크 추출
        landmarks = extract_landmarks(tmp_path)
        
        # 2. ROI 전처리
        preprocessed = preprocess_roi(tmp_path, landmarks["roi_points"])
        
        # 3. 피부 점수화
        scores = calculate_scores(preprocessed)
        
        # 4. 피부 타입 분류
        from routers.recommend import classify_skin_type, RECOMMENDED_INGREDIENTS
        skin_type = classify_skin_type(scores)
        
        # 5. 제품 추천
        avoid_conditions = [
            k for k, v in scores.items()
            if isinstance(v, dict) and v.get("status") == "bad"
        ]
        recommended_ingredients = RECOMMENDED_INGREDIENTS[skin_type]
        
        products = db.query(Product).all()
        scored_products = []
        for product in products:
            # 카테고리 필터 추가
            category = (product.category or "").lower()
            if not any(c in category for c in ["skincare", "moisturizer", "serum", "toner", "sunscreen", "foundation", "bb cream", "face", "skin"]):
                continue

            ingredients = product.ingredients or []
            avoid = product.avoid_conditions or []
            if any(c in avoid for c in avoid_conditions):
                continue
            match_count = sum(
                1 for rec in recommended_ingredients
                if any(rec in ing for ing in ingredients)
            )
            if match_count > 0:
                scored_products.append({
                    "id": product.id,
                    "name": product.name,
                    "brand": product.brand,
                    "category": product.category,
                    "ingredients": ingredients[:5],
                    "match_score": round(match_count / len(recommended_ingredients) * 100, 1),
                    "reason": "",
                    "image_url": product.image_url,
                })
        
        seen_names = set()
        unique_products = []
        for p in scored_products:
            if p["name"] not in seen_names:
                seen_names.add(p["name"])
                unique_products.append(p)

        unique_products.sort(key=lambda x: x["match_score"], reverse=True)
        top_products = unique_products[:5]
        
        # 6. Gemini 추천 이유 생성
        reason = generate_recommendation_reason(skin_type, scores, top_products)
        for p in top_products:
            p["reason"] = reason

        if current_user:
            shutil.copy2(tmp_path, upload_path)
            db.add(AnalysisHistory(
                id=record_id,
                user_id=current_user["id"],
                skin_scores=scores,
                skin_type=skin_type,
                image_filename=upload_filename,
                landmarks=landmarks["landmarks"],
                image_size=landmarks["image_size"],
                analyzed_at=datetime.now(),
            ))
            db.commit()

        return {
            "skin_scores": scores,
            "skin_type": skin_type,
            "products": top_products,
            "analyzed_at": datetime.now().isoformat(),
            "landmarks": landmarks["landmarks"],
            "image_size": landmarks["image_size"],
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@router.post("/test-landmarks")
async def test_landmarks(file: UploadFile = File(...)):
    contents = await file.read()
    
    tmp_path = f"/tmp/{uuid.uuid4()}.jpg"
    with open(tmp_path, "wb") as f:
        f.write(contents)
    
    try:
        result = extract_landmarks(tmp_path)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)



@router.post("/test-preprocess")
async def test_preprocess(file: UploadFile = File(...)):
    contents = await file.read()
    
    tmp_path = f"/tmp/{uuid.uuid4()}.jpg"
    with open(tmp_path, "wb") as f:
        f.write(contents)
    
    try:
        from pipeline.face import extract_landmarks
        landmarks = extract_landmarks(tmp_path)
        roi_result = preprocess_roi(tmp_path, landmarks["roi_points"])
        
        return {
            "regions": list(roi_result.keys()),
            "message": "preprocess ok"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


from pipeline.scoring import calculate_scores

@router.post("/test-scores")
async def test_scores(file: UploadFile = File(...)):
    contents = await file.read()
    tmp_path = f"/tmp/{uuid.uuid4()}.jpg"
    with open(tmp_path, "wb") as f:
        f.write(contents)
    try:
        landmarks = extract_landmarks(tmp_path)
        preprocessed = preprocess_roi(tmp_path, landmarks["roi_points"])
        scores = calculate_scores(preprocessed)
        return scores
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)