from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Cookie

from core.config import settings

ALGORITHM = "HS256"
TOKEN_EXPIRE_DAYS = 7


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(days=TOKEN_EXPIRE_DAYS)
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.jwt_secret_key, algorithms=[ALGORITHM])


def get_current_user(access_token: str = Cookie(default=None)):
    """Optional auth dependency — returns user dict or None."""
    if not access_token:
        return None
    try:
        payload = decode_token(access_token)
        return {
            "id": payload["sub"],
            "email": payload["email"],
            "name": payload["name"],
            "picture": payload.get("picture"),
        }
    except JWTError:
        return None
