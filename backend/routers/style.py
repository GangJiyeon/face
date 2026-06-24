import os
import uuid

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from pipeline.makeup_transfer import transfer_makeup
from pipeline.hair_transfer import transfer_celebrity_hair, apply_recommended_hair
from pipeline.face_shape import classify_face_shape
import json

router = APIRouter()

UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
HAIRSTYLES_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "hairstyles.json")
with open(HAIRSTYLES_PATH, encoding="utf-8") as f:
    HAIRSTYLES_DATA = json.load(f)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}


def _save_upload(upload: UploadFile, content: bytes) -> str:
    ext = upload.filename.rsplit(".", 1)[-1] if upload.filename and "." in upload.filename else "jpg"
    path = os.path.join(UPLOADS_DIR, f"tmp_{uuid.uuid4()}.{ext}")
    with open(path, "wb") as f:
        f.write(content)
    return path


@router.post("/makeup-transfer")
async def makeup_transfer(
    user_image: UploadFile = File(..., description="사용자 얼굴 사진"),
    celebrity_image: UploadFile = File(..., description="연예인 사진 (메이크업 레퍼런스)"),
):
    if user_image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="user_image must be jpeg, png, or webp")
    if celebrity_image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="celebrity_image must be jpeg, png, or webp")

    user_content = await user_image.read()
    celebrity_content = await celebrity_image.read()

    user_path = _save_upload(user_image, user_content)
    celebrity_path = _save_upload(celebrity_image, celebrity_content)

    try:
        result_url = await transfer_makeup(
            user_image_path=user_path,
            celebrity_image_path=celebrity_path,
        )
        return {"result_url": result_url}

    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Makeup transfer failed: {e}")
    finally:
        for path in [user_path, celebrity_path]:
            if os.path.exists(path):
                os.remove(path)


@router.post("/hair-transfer")
async def hair_transfer(
    user_image: UploadFile = File(..., description="사용자 얼굴 사진"),
    celebrity_image: UploadFile = File(..., description="연예인 사진 (헤어스타일 레퍼런스)"),
):
    if user_image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="user_image must be jpeg, png, or webp")
    if celebrity_image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="celebrity_image must be jpeg, png, or webp")

    user_content = await user_image.read()
    celebrity_content = await celebrity_image.read()

    user_path = _save_upload(user_image, user_content)
    celebrity_path = _save_upload(celebrity_image, celebrity_content)

    try:
        result_url = await transfer_celebrity_hair(
            user_image_path=user_path,
            celebrity_image_path=celebrity_path,
        )
        return {"result_url": result_url}
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hair transfer failed: {e}")
    finally:
        for path in [user_path, celebrity_path]:
            if os.path.exists(path):
                os.remove(path)


@router.post("/hair-styling")
async def hair_styling(
    user_image: UploadFile = File(..., description="사용자 얼굴 사진"),
    landmarks: str = Form(..., description="JSON 배열 형태의 랜드마크"),
    style_index: int = Form(0, description="추천 스타일 인덱스 (0~2)"),
):
    if user_image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="user_image must be jpeg, png, or webp")

    try:
        lm = json.loads(landmarks)
    except Exception:
        raise HTTPException(status_code=400, detail="landmarks must be a valid JSON array")

    face_shape = classify_face_shape(lm)
    data = HAIRSTYLES_DATA.get(face_shape, HAIRSTYLES_DATA["oval"])
    styles = data["styles"]
    idx = max(0, min(style_index, len(styles) - 1))
    style = styles[idx]

    user_content = await user_image.read()
    user_path = _save_upload(user_image, user_content)

    try:
        result_url = await apply_recommended_hair(
            user_image_path=user_path,
            face_shape=data["label"],
            style_name=style["name"],
            style_reason=style["reason"],
        )
        return {
            "result_url": result_url,
            "face_shape": face_shape,
            "face_shape_label": data["label"],
            "applied_style": style,
        }
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hair styling failed: {e}")
    finally:
        if os.path.exists(user_path):
            os.remove(user_path)
