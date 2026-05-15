import logging
from google import genai
from core.config import settings

logger = logging.getLogger(__name__)

_SKIN_TYPE_EN = {"dry": "Dry", "oily": "Oily", "sensitive": "Sensitive", "combination": "Combination"}
_LIGHTING_EN = {"bright": "Bright Indoor", "dark": "Dark Environment", "outdoor": "Outdoor"}


def _get_client():
    return genai.Client(api_key=settings.gemini_api_key)


def generate_recommendation_reason(skin_type: str, scores: dict, products: list) -> str:
    skin_type_en = _SKIN_TYPE_EN.get(skin_type, skin_type)
    redness_label = scores["redness"]["label"]
    moisture_label = scores["moisture"]["label"]
    trouble_label = scores["trouble"]["label"]

    reason = f"Your skin has been analyzed as {skin_type_en} type. "
    reason += f"Redness: '{redness_label}', Moisture: '{moisture_label}', Trouble: '{trouble_label}'. "
    reason += "We recommend products with ingredients suited to your skin condition."
    return reason


def generate_makeup_reason(skin_type: str, lighting_env: str, palette: dict) -> str:
    skin_en = _SKIN_TYPE_EN.get(skin_type, skin_type)
    light_en = _LIGHTING_EN.get(lighting_env, lighting_env)

    prompt = (
        f"Skin type: {skin_en}, Lighting environment: {light_en}\n"
        f"Recommended foundation color: {palette['foundation']}, blush: {palette['blush']}, "
        f"lip color: {palette['lip']}, eye shadow: {palette['eye']}\n\n"
        "Based on the above, explain in 2-3 natural and friendly English sentences why this makeup palette "
        "suits the user well. Do not mention the hex color values."
    )

    try:
        client = _get_client()
        response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
        return response.text.strip()
    except Exception as e:
        logger.warning("Gemini makeup reason fallback: %s", e)
        skin_en = _SKIN_TYPE_EN.get(skin_type, skin_type)
        light_en = _LIGHTING_EN.get(lighting_env, lighting_env)
        tip = palette.get("tip", "")
        return f"This palette is optimized for {skin_en} skin type in a {light_en} environment. {tip}"