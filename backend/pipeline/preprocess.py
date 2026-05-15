import cv2
import numpy as np

def preprocess_roi(image_path: str, roi_points: dict) -> dict:
    # 1. Load image
    image = cv2.imread(image_path)
    
    result = {}

    for region, points in roi_points.items():
        # 2. Create mask (black background)
        mask = np.zeros(image.shape[:2], dtype=np.uint8)

        # 3. Fill ROI region with white
        pts = np.array(points, dtype=np.int32)
        cv2.fillPoly(mask, [pts], 255)

        # 4. Apply mask — keep only the region of interest
        roi = cv2.bitwise_and(image, image, mask=mask)

        # 5. BGR → LAB conversion
        lab = cv2.cvtColor(roi, cv2.COLOR_BGR2LAB)

        # 6. BGR → HSV conversion
        hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)

        # 7. CLAHE lighting correction (applied to L channel of LAB)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l, a, b = cv2.split(lab)
        l_corrected = clahe.apply(l)
        lab_corrected = cv2.merge([l_corrected, a, b])

        # 8. Noise reduction
        denoised = cv2.GaussianBlur(lab_corrected, (5, 5), 0)
        
        result[region] = {
            "lab": lab_corrected,
            "hsv": hsv,
            "denoised": denoised,
            "mask": mask,
        }
    
    return result