import cv2
import numpy as np

def preprocess_roi(image_path: str, roi_points: dict) -> dict:
    # 1. 이미지 로드
    image = cv2.imread(image_path)
    
    result = {}
    
    for region, points in roi_points.items():
        # 2. 마스크 생성 (검정 배경)
        mask = np.zeros(image.shape[:2], dtype=np.uint8)
        
        # 3. ROI 영역 흰색으로 채우기
        pts = np.array(points, dtype=np.int32)
        cv2.fillPoly(mask, [pts], 255)
        
        # 4. 마스크 적용 → 해당 부위만 남김
        roi = cv2.bitwise_and(image, image, mask=mask)
        
        # 5. BGR → LAB 변환
        lab = cv2.cvtColor(roi, cv2.COLOR_BGR2LAB)
        
        # 6. BGR → HSV 변환
        hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
        
        # 7. CLAHE 조명 보정 (LAB의 L채널에 적용)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l, a, b = cv2.split(lab)
        l_corrected = clahe.apply(l)
        lab_corrected = cv2.merge([l_corrected, a, b])
        
        # 8. 노이즈 제거
        denoised = cv2.GaussianBlur(lab_corrected, (5, 5), 0)
        
        result[region] = {
            "lab": lab_corrected,
            "hsv": hsv,
            "denoised": denoised,
            "mask": mask,
        }
    
    return result