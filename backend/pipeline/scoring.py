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

        # 마스크 적용된 픽셀만 추출
        masked_pixels = lab[mask == 255]
        if len(masked_pixels) == 0:
            continue

        l_channel = masked_pixels[:, 0].astype(float)
        a_channel = masked_pixels[:, 1].astype(float)

        # 붉은기 — a채널 평균 (128 기준, 높을수록 붉음)
        redness = float(np.mean(a_channel))
        redness_scores.append(redness)

        # 밝기 — L채널 평균
        brightness = float(np.mean(l_channel))
        brightness_scores.append(brightness)

        # 톤 불균형 — L채널 분산
        tone_var = float(np.var(l_channel))
        tone_scores.append(tone_var)

        # 트러블 — a채널에서 이상 픽셀 비율
        trouble_pixels = np.sum(a_channel > 140)
        trouble_ratio = float(trouble_pixels / len(masked_pixels))
        trouble_scores.append(trouble_ratio)

    # 평균값 계산
    avg_redness = np.mean(redness_scores) if redness_scores else 128
    avg_brightness = np.mean(brightness_scores) if brightness_scores else 128
    avg_tone = np.mean(tone_scores) if tone_scores else 0
    avg_trouble = np.mean(trouble_scores) if trouble_scores else 0

    # 0~100 정규화
    redness_score = float(np.clip((avg_redness - 128) / 20 * 100, 0, 100))
    brightness_score = float(np.clip(avg_brightness / 255 * 100, 0, 100))
    tone_score = float(np.clip(100 - (avg_tone / 500 * 100), 0, 100))
    trouble_score = float(np.clip(avg_trouble * 100 * 3, 0, 100))
    moisture_score = float(np.clip((brightness_score + (100 - redness_score)) / 2, 0, 100))

    # 차트용 점수 (높을수록 좋음으로 정규화)
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
            "redness":    {"good": "진정됨", "caution": "약간 붉음", "bad": "붉음"},
            "tone":       {"good": "균일", "caution": "약간 불균일", "bad": "불균일"},
            "brightness": {"good": "밝음", "caution": "보통", "bad": "칙칙함"},
            "trouble":    {"good": "깨끗", "caution": "약간 있음", "bad": "트러블"},
            "moisture":   {"good": "촉촉", "caution": "보통", "bad": "건조"},
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