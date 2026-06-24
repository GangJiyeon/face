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

CELEBRITY_TRANSFER_PROMPT = (
    "You are a professional photo retouching tool. Your only job is to change the hairstyle in a photo.\n\n"
    "Image 1: hair reference (celebrity). Extract the hairstyle only — "
    "hair color, cut shape, length, layers, bangs, texture, volume, and styling.\n"
    "Image 2: the base photo. This is the OUTPUT image. Treat it as a locked layer.\n\n"
    "YOUR TASK: replace the hair in Image 2 with the hairstyle from Image 1. Nothing else.\n\n"
    "LOCKED (must not change under any circumstances):\n"
    "- Face: every facial feature — eyes, iris color, nose, mouth, jaw, cheekbones — identical to Image 2\n"
    "- Eye color: iris and pupil color must be exactly identical to Image 2. Never alter eye color.\n"
    "- Skin tone and skin texture — identical to Image 2\n"
    "- Facial expression — identical to Image 2\n"
    "- Clothing, background — identical to Image 2\n\n"
    "ONLY CHANGE: the hair region. Replace existing hair with the cut, color, length, and style from Image 1.\n\n"
    "Output: a single realistic photo that looks exactly like Image 2 but with Image 1's hairstyle."
)


def _get_client():
    return genai.Client(api_key=settings.gemini_api_key)


def _mime(path: str) -> str:
    return _MIME_MAP.get(Path(path).suffix.lower(), "image/jpeg")


def _save_result(data: bytes, mime_type: str) -> str:
    ext = ".jpg" if "jpeg" in mime_type else ".png"
    filename = f"hair_transfer_{uuid.uuid4()}{ext}"
    path = UPLOADS_DIR / filename
    with open(path, "wb") as f:
        f.write(data)
    return f"/uploads/{filename}"


async def _generate_image(parts: list) -> str:
    client = _get_client()
    try:
        response = await asyncio.wait_for(
            client.aio.models.generate_content(
                model="gemini-3-pro-image",
                contents=[types.Content(role="user", parts=parts)],
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE", "TEXT"],
                ),
            ),
            timeout=300.0,
        )
    except asyncio.TimeoutError:
        raise RuntimeError("Hair transfer timed out after 5 minutes.")

    for part in response.candidates[0].content.parts:
        if getattr(part, "inline_data", None) and part.inline_data.data:
            return _save_result(part.inline_data.data, part.inline_data.mime_type)

    raise RuntimeError("Gemini did not return an image. Check model availability or prompt.")


async def transfer_celebrity_hair(user_image_path: str, celebrity_image_path: str) -> str:
    with open(celebrity_image_path, "rb") as f:
        celebrity_bytes = f.read()
    with open(user_image_path, "rb") as f:
        user_bytes = f.read()

    parts = [
        types.Part.from_bytes(data=celebrity_bytes, mime_type=_mime(celebrity_image_path)),
        types.Part.from_bytes(data=user_bytes, mime_type=_mime(user_image_path)),
        types.Part(text=CELEBRITY_TRANSFER_PROMPT),
    ]
    return await _generate_image(parts)


async def apply_recommended_hair(user_image_path: str, face_shape: str, style_name: str, style_reason: str) -> str:
    with open(user_image_path, "rb") as f:
        user_bytes = f.read()

    prompt = (
        f"You are a professional photo retouching tool. Your only job is to change the hairstyle in this photo.\n\n"
        f"This is the base photo. Treat it as a locked layer.\n\n"
        f"YOUR TASK: replace the existing hair with the following hairstyle — '{style_name}': {style_reason}\n"
        f"This style is suited for a {face_shape} face shape.\n\n"
        f"LOCKED (must not change under any circumstances):\n"
        f"- Face: every facial feature — eyes, iris color, nose, mouth, jaw, cheekbones — identical to the input\n"
        f"- Eye color: iris and pupil color must be exactly identical to the input. Never alter eye color.\n"
        f"- Skin tone and skin texture — identical to the input\n"
        f"- Facial expression — identical to the input\n"
        f"- Clothing, background — identical to the input\n\n"
        f"ONLY CHANGE: the hair region. Apply the '{style_name}' hairstyle described above.\n\n"
        f"Output: a single realistic photo that looks exactly like the input but with the new hairstyle."
    )

    parts = [
        types.Part.from_bytes(data=user_bytes, mime_type=_mime(user_image_path)),
        types.Part(text=prompt),
    ]
    return await _generate_image(parts)
