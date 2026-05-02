import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np

MODEL_PATH = "models/face_landmarker.task"

# 랜드마크 인덱스 (MediaPipe 468개 중 주요 부위)
ROI_INDICES = {
    "forehead": [10, 67, 69, 104, 108, 151, 299, 337, 338],
    "left_cheek": [116, 117, 118, 119, 120, 121, 126, 142, 203],
    "right_cheek": [345, 346, 347, 348, 349, 350, 355, 371, 423],
    "nose": [1, 2, 3, 4, 5, 6, 168, 197, 195],
    "chin": [152, 175, 176, 177, 178, 194, 199, 200, 201],
}

def load_landmarker():
    base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
    options = vision.FaceLandmarkerOptions(
        base_options=base_options,
        num_faces=1,
    )
    return vision.FaceLandmarker.create_from_options(options)

def extract_landmarks(image_path: str) -> dict:
    landmarker = load_landmarker()

    # 이미지 로드
    mp_image = mp.Image.create_from_file(image_path)
    result = landmarker.detect(mp_image)

    # 얼굴 미감지 처리
    if not result.face_landmarks:
        raise ValueError("얼굴을 감지할 수 없습니다.")

    landmarks = result.face_landmarks[0]
    h, w = mp_image.height, mp_image.width

    # 픽셀 좌표로 변환
    points = [
        (int(lm.x * w), int(lm.y * h))
        for lm in landmarks
    ]

    # 바운딩박스 추출
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    bbox = {
        "x_min": min(xs),
        "x_max": max(xs),
        "y_min": min(ys),
        "y_max": max(ys),
    }

    # ROI 좌표 추출
    roi_points = {
        region: [points[i] for i in indices]
        for region, indices in ROI_INDICES.items()
    }

    return {
        "landmarks": points,
        "bbox": bbox,
        "roi_points": roi_points,
        "image_size": {"width": w, "height": h},
    }