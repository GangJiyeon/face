from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def analyze_health():
    return {"message:": "analyze router ok"}