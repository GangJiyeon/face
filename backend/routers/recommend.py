from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def recommend_health():
    return {"message:": "recommend ok"}