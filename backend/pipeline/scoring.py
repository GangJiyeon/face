import cv2
import numpy as np

def calculate_scores(preprocessed: dict) -> dict:
    redness_scores = []
    brightness_scores = []
    tone_scores = []
    trouble_scores = []

    for region, data in preprocessed.items():
        lab = data["lab"]
        mask = data["mask"]

        # Extract only masked pixels
        masked_pixels = lab[mask == 255]
        if len(masked_pixels) == 0:
            continue

        l_channel = masked_pixels[:, 0].astype(float)
        a_channel = masked_pixels[:, 1].astype(float)

        # Redness — a-channel mean (baseline 128, higher = more red)
        redness = float(np.mean(a_channel))
        redness_scores.append(redness)

        # Brightness — L-channel mean
        brightness = float(np.mean(l_channel))
        brightness_scores.append(brightness)

        # Tone imbalance — L-channel variance
        tone_var = float(np.var(l_channel))
        tone_scores.append(tone_var)

        # Trouble — proportion of abnormal pixels in a-channel
        trouble_pixels = np.sum(a_channel > 140)
        trouble_ratio = float(trouble_pixels / len(masked_pixels))
        trouble_scores.append(trouble_ratio)

    # Compute averages
    avg_redness = np.mean(redness_scores) if redness_scores else 128
    avg_brightness = np.mean(brightness_scores) if brightness_scores else 128
    avg_tone = np.mean(tone_scores) if tone_scores else 0
    avg_trouble = np.mean(trouble_scores) if trouble_scores else 0

    # Normalize to 0~100
    redness_score = float(np.clip((avg_redness - 128) / 20 * 100, 0, 100))
    brightness_score = float(np.clip(avg_brightness / 255 * 100, 0, 100))
    tone_score = float(np.clip(100 - (avg_tone / 500 * 100), 0, 100))
    trouble_score = float(np.clip(avg_trouble * 100 * 3, 0, 100))
    moisture_score = float(np.clip((brightness_score + (100 - redness_score)) / 2, 0, 100))

    # Chart scores (normalized so higher = better)
    def get_status(score, reverse=False):
        s = 100 - score if reverse else score
        if s >= 60:
            return "good"
        elif s >= 40:
            return "caution"
        else:
            return "bad"

    def get_label(metric, status):
        labels = {
            "redness":    {"good": "Calm", "caution": "Slightly red", "bad": "Red"},
            "tone":       {"good": "Even", "caution": "Slightly uneven", "bad": "Uneven"},
            "brightness": {"good": "Bright", "caution": "Moderate", "bad": "Dull"},
            "trouble":    {"good": "Clear", "caution": "Slight trouble", "bad": "Trouble"},
            "moisture":   {"good": "Hydrated", "caution": "Moderate", "bad": "Dry"},
        }
        return labels[metric][status]

    redness_status = get_status(redness_score, reverse=True)
    tone_status = get_status(tone_score)
    brightness_status = get_status(brightness_score)
    trouble_status = get_status(trouble_score, reverse=True)
    moisture_status = get_status(moisture_score)

    overall = float(np.mean([
        100 - redness_score,
        tone_score,
        brightness_score,
        100 - trouble_score,
        moisture_score,
    ]))

    return {
        "redness": {
            "score": round(redness_score, 1),
            "chart_score": round(100 - redness_score, 1),
            "status": redness_status,
            "label": get_label("redness", redness_status),
        },
        "tone": {
            "score": round(tone_score, 1),
            "chart_score": round(tone_score, 1),
            "status": tone_status,
            "label": get_label("tone", tone_status),
        },
        "brightness": {
            "score": round(brightness_score, 1),
            "chart_score": round(brightness_score, 1),
            "status": brightness_status,
            "label": get_label("brightness", brightness_status),
        },
        "trouble": {
            "score": round(trouble_score, 1),
            "chart_score": round(100 - trouble_score, 1),
            "status": trouble_status,
            "label": get_label("trouble", trouble_status),
        },
        "moisture": {
            "score": round(moisture_score, 1),
            "chart_score": round(moisture_score, 1),
            "status": moisture_status,
            "label": get_label("moisture", moisture_status),
        },
        "overall": round(overall, 1),
    }