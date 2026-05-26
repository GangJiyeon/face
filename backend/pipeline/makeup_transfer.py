import asyncio
import uuid
import logging
from pathlib import Path
from google import genai
from google.genai import types
from core.config import settings

logger = logging.getLogger(__name__)

UPLOADS_DIR = Path(__file__).resolve().parent.parent / "uploads"

_MIME_MAP = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}

TRANSFER_PROMPT = (
    "You are given two face photos. "
    "The first photo is a celebrity. The second photo is a user. "
    "Apply the makeup style from the celebrity photo (foundation tone, blush, eye shadow, eyeliner, lip color) "
    "to the user's face in the second photo. "
    "Preserve the user's facial structure, skin tone base, and identity exactly. "
    "Only change the makeup. Return the edited face photo."
)


def _get_client():
    return genai.Client(api_key=settings.gemini_api_key)


def _mime(path: str) -> str:
    return _MIME_MAP.get(Path(path).suffix.lower(), "image/jpeg")


async def transfer_makeup(user_image_path: str, celebrity_image_path: str) -> str:
    with open(celebrity_image_path, "rb") as f:
        celebrity_bytes = f.read()
    with open(user_image_path, "rb") as f:
        user_bytes = f.read()

    client = _get_client()

    try:
        response = await asyncio.wait_for(
            client.aio.models.generate_content(
                model="gemini-2.5-flash-image",
                contents=[
                    types.Part.from_bytes(data=celebrity_bytes, mime_type=_mime(celebrity_image_path)),
                    types.Part.from_bytes(data=user_bytes, mime_type=_mime(user_image_path)),
                    TRANSFER_PROMPT,
                ],
                config=types.GenerateContentConfig(
                    response_modalities=["image", "text"],
                ),
            ),
            timeout=300.0,
        )
    except asyncio.TimeoutError:
        raise RuntimeError("Makeup transfer timed out after 5 minutes.")

    for part in response.candidates[0].content.parts:
        if getattr(part, "inline_data", None) and part.inline_data.data:
            ext = ".jpg" if "jpeg" in part.inline_data.mime_type else ".png"
            result_filename = f"makeup_transfer_{uuid.uuid4()}{ext}"
            result_path = UPLOADS_DIR / result_filename

            with open(result_path, "wb") as f:
                f.write(part.inline_data.data)

            return f"/uploads/{result_filename}"

    raise RuntimeError("Gemini did not return an image. Check model availability or prompt.")
