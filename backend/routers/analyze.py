import uuid, os, tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
router = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/heic", "image/webp"]
MAX_SIZE = 10 * 1024 * 1024  # 10MB

@router.get("/")
def analyze_health():
    return {"message:": "analyze router ok"}    

@router.post("/")
async def analyze_skin(file: UploadFile = File(...)):

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="지원하지 않는 파일 형식 입니다.")
    
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="파일 크기는 10MB 이하여야 합니다.")

    suffix = os.path.splitext(file.filename)[1]
    tmp_path = f"/tmp/{uuid.uuid4()}{suffix}"

    with open(tmp_path, "wb") as f:
        f.write(contents)
    
    try:
        # TODO: 분석로직 추가
        return{
            "message": "upload ok",
            "tmp_path": tmp_path,
            "filename": file.filename,
            "size": len(contents)
        }
    finally:
        # 임시파일 삭제
        if os.path.exists(tmp_path):
            os.remove(tmp_path)