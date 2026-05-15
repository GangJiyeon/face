import math


def _dist(a, b) -> float:
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)


def classify_face_shape(landmarks: list) -> str:
    """
    MediaPipe 468개 랜드마크로 얼굴형 분류.
    반환값: "oval" | "round" | "square" | "heart" | "long"
    """
    if len(landmarks) < 468:
        return "oval"

    forehead_top = landmarks[10]
    chin = landmarks[152]
    left_cheek = landmarks[234]
    right_cheek = landmarks[454]
    left_forehead = landmarks[103]
    right_forehead = landmarks[332]
    left_jaw = landmarks[172]
    right_jaw = landmarks[397]

    face_height = _dist(forehead_top, chin)
    cheek_width = _dist(left_cheek, right_cheek)
    forehead_width = _dist(left_forehead, right_forehead)
    jaw_width = _dist(left_jaw, right_jaw)

    if cheek_width == 0:
        return "oval"

    ratio = face_height / cheek_width

    if ratio > 1.75:
        return "long"
    if ratio < 1.05:
        return "round"
    if jaw_width / cheek_width > 0.85:
        return "square"
    if forehead_width / jaw_width > 1.3:
        return "heart"
    return "oval"
