import os
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile

from pipeline.makeup_transfer import transfer_makeup

router = APIRouter()

UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")

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
