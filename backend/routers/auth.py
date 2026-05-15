import uuid
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Cookie, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.orm import Session

from core.auth import create_access_token, decode_token, get_current_user
from core.config import settings
from db.models import User
from db.session import get_db

router = APIRouter()

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"
REDIRECT_URI = "http://localhost:8000/auth/google/callback"


@router.get("/login")
def login():
    params = urlencode({
        "client_id": settings.google_client_id,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
    })
    return RedirectResponse(f"{GOOGLE_AUTH_URL}?{params}")


@router.get("/google/callback")
async def callback(code: str, db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(GOOGLE_TOKEN_URL, data={
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": REDIRECT_URI,
        })
        access = token_resp.json()["access_token"]

        userinfo_resp = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access}"},
        )
        info = userinfo_resp.json()

    user = db.query(User).filter(User.google_id == info["sub"]).first()
    if not user:
        user = User(
            id=str(uuid.uuid4()),
            google_id=info["sub"],
            email=info["email"],
            name=info.get("name", ""),
            profile_image=info.get("picture", ""),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "name": user.name,
        "picture": user.profile_image,
    })

    response = RedirectResponse(url="http://localhost:3000")
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )
    return response


@router.get("/me")
def me(current_user=Depends(get_current_user)):
    return {"user": current_user}


@router.post("/logout")
def logout():
    response = JSONResponse({"ok": True})
    response.delete_cookie("access_token")
    return response
