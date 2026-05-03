def generate_recommendation_reason(skin_type: str, scores: dict, products: list) -> str:
    
    skin_type_kr = {
        "dry": "건성",
        "oily": "지성",
        "sensitive": "민감성",
        "combination": "복합성"
    }
    
    redness_label = scores["redness"]["label"]
    moisture_label = scores["moisture"]["label"]
    trouble_label = scores["trouble"]["label"]
    
    reason = f"현재 피부는 {skin_type_kr.get(skin_type, skin_type)} 타입으로 분석되었습니다. "
    reason += f"붉은기는 '{redness_label}', 수분은 '{moisture_label}', 트러블은 '{trouble_label}' 상태입니다. "
    reason += "이에 맞는 성분이 포함된 제품들을 추천해드립니다."
    
    return reason