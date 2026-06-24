# 기능별 구현 설명

---

## 목차

1. [피부 분석](#1-피부-분석)
2. [제품 추천](#2-제품-추천)
3. [메이크업 팔레트 추천](#3-메이크업-팔레트-추천)
4. [헤어스타일 추천](#4-헤어스타일-추천)
5. [메이크업 트랜스퍼](#5-메이크업-트랜스퍼)
6. [헤어 트랜스퍼](#6-헤어-트랜스퍼)
7. [헤어 스타일링 (AI 맞춤)](#7-헤어-스타일링-ai-맞춤)
8. [Google 로그인 / 인증](#8-google-로그인--인증)
9. [분석 히스토리](#9-분석-히스토리)
10. [카메라 촬영](#10-카메라-촬영)

---

## 1. 피부 분석

> 사용자 얼굴 사진 한 장으로 피부 상태를 5가지 지표로 수치화하고, 피부 타입을 판정하는 핵심 기능.

### 전체 흐름

```
[프론트] 이미지 선택/촬영
    → analyzeImage(file) → POST /analyze/ (multipart/form-data)
    → 로딩 UI (3단계 진행 표시)
    → 결과 JSON을 URL 파라미터로 직렬화 → /result 페이지로 이동

[백엔드] POST /analyze/
    → 파일 유효성 검사 (MIME, 10MB)
    → /tmp/에 임시 저장
    → [1] 랜드마크 추출
    → [2] ROI 전처리
    → [3] 점수 계산
    → [4] 피부 타입 분류
    → [5] 제품 추천
    → [6] Gemini 추천 이유 생성
    → (로그인 시) DB 저장 + 이미지 uploads/ 복사
    → finally: 임시 파일 삭제
```

### [1] 랜드마크 추출 (`pipeline/face.py`)

Google MediaPipe `FaceLandmarker` 모델(`.task` 파일)로 얼굴에서 **468개의 3D 랜드마크 좌표**를 추출한다.

```python
mp_image = mp.Image.create_from_file(image_path)
result = landmarker.detect(mp_image)
landmarks = result.face_landmarks[0]  # 0~1 정규화 좌표

# 픽셀 좌표로 변환
points = [(int(lm.x * w), int(lm.y * h)) for lm in landmarks]
```

468개 중 5개 부위(이마, 양쪽 볼, 코, 턱)의 인덱스만 ROI로 추출한다. 눈·입처럼 화장이나 점막 조직 특성이 개입되는 부위는 제외했다.

### [2] ROI 전처리 (`pipeline/preprocess.py`)

각 ROI 부위를 마스킹하고 색공간 변환 + 조명 보정을 적용한다.

```python
# 1. 다각형 마스크 생성 (랜드마크 좌표로 윤곽 채우기)
mask = np.zeros(image.shape[:2], dtype=np.uint8)
cv2.fillPoly(mask, [pts], 255)

# 2. 마스크 적용 → ROI만 추출
roi = cv2.bitwise_and(image, image, mask=mask)

# 3. BGR → LAB 변환 (조명 영향 분리)
lab = cv2.cvtColor(roi, cv2.COLOR_BGR2LAB)

# 4. CLAHE 조명 보정 (L 채널에만 적용)
clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
l_corrected = clahe.apply(l)

# 5. 가우시안 블러로 노이즈 제거
denoised = cv2.GaussianBlur(lab_corrected, (5, 5), 0)
```

**BGR→LAB를 쓰는 이유**: LAB는 L(밝기), A(적-녹), B(황-청)가 독립 채널이라 조명이 바뀌어도 색상 정보가 분리된다. RGB는 조명 변화 시 세 채널이 동시에 변해서 피부 색상 측정에 부적합하다.

**CLAHE를 쓰는 이유**: 이미지 전체가 아닌 8×8 타일 단위로 히스토그램 평탄화를 적용해, 실내/실외·형광등/자연광 등 다양한 조명 조건에서도 균일하게 분석할 수 있다. `clipLimit=2.0`으로 특정 밝기 구간의 과도한 증폭을 방지한다.

### [3] 피부 점수 계산 (`pipeline/scoring.py`)

마스크된 픽셀(얼굴 ROI 안)만 추출해서 5가지 지표를 계산한다.

```python
masked_pixels = lab[mask == 255]   # 마스크 바깥(검정) 제외
l_channel = masked_pixels[:, 0].astype(float)
a_channel = masked_pixels[:, 1].astype(float)
```

| 지표 | 계산 원리 | 공식 |
|------|-----------|------|
| **붉음증** | A 채널 평균 (128 = 중립, 높을수록 붉음) | `(mean_a - 128) / 20 * 100` |
| **밝기** | L 채널 평균 | `mean_l / 255 * 100` |
| **톤 균일도** | L 채널 분산의 역수 (분산↑ = 불균일) | `100 - (var_l / 500 * 100)` |
| **트러블** | A 채널 > 140 픽셀 비율 (비정상 붉음) | `ratio * 100 * 3` |
| **수분** | 밝기 + 붉음증 역수의 평균 (간접 추정) | `(brightness + (100 - redness)) / 2` |

모든 값은 `np.clip(..., 0, 100)`으로 0~100 범위로 제한한다.

**수분을 직접 측정할 수 없는 이유**: RGB/LAB 이미지에는 피부 속 수분 함량 정보가 없다. 피부과학적 상관관계를 이용한 간접 추정이다. 수분 부족 → 각질 들떠 빛 난반사 → L 채널↓(칙칙), 피부 장벽 손상 → 염증 → A 채널↑(붉어짐). 즉 밝고 덜 붉으면 수분 충분으로 추정한다.

**공식별 상수 근거**:
- `/ 20`: 정상 피부 A 채널은 보통 128~148, 이 범위를 0~100으로 매핑
- `/ 500`: L 채널 분산 실측 최댓값이 약 500
- `* 3`: 트러블 픽셀 비율은 정상 피부에서 0~10% 수준이라 스케일업 필요

**상태 판정**: 60 이상 → good, 40~60 → caution, 40 미만 → bad (붉음증·트러블은 역방향이라 `reverse=True`로 뒤집어 적용)

**overall score**: `mean([100-redness, tone, brightness, 100-trouble, moisture])` — 모두 "높을수록 좋은" 방향으로 통일 후 평균

### [4] 피부 타입 분류 (`routers/recommend.py`)

```python
def classify_skin_type(scores) -> str:
    moisture = scores["moisture"]["score"]
    redness  = scores["redness"]["score"]
    trouble  = scores["trouble"]["score"]

    if moisture < 40:                    return "dry"
    elif redness > 60 or trouble > 60:   return "sensitive"
    elif moisture > 70:                  return "oily"
    else:                                return "combination"
```

임계값(40, 60, 70)은 의학적 기준이 아닌 경험적 설정값이다. 실제 서비스에서는 더 많은 데이터를 수집해 머신러닝 분류기로 교체하는 방향으로 발전시킬 수 있다.

수분 점수로 지성을 판단하는 근거: 피지가 많으면 번들거림으로 L 채널↑, 붉음↓ → moisture 점수가 올라가는 간접적 상관관계.

### [5] 결과 화면 (`app/result/page.tsx`)

분석 완료 후 결과 JSON을 URL 파라미터로 직렬화해 결과 페이지로 전달한다.

```typescript
params.set("data", JSON.stringify(result))
window.location.href = `/result?${params.toString()}`
```

이미지는 `sessionStorage`에, 분석 결과만 URL로 전달 — 이미지 데이터가 너무 커서 URL로 넘기기 어렵기 때문이다.

**레이더 차트**: `chart_score`를 사용한다. 붉음증·트러블은 낮을수록 좋으므로 `score`가 아닌 `100 - score`인 `chart_score`를 써야 차트에서 "좋은 피부 = 바깥쪽"이 된다.

**랜드마크 SVG 오버레이**:
```typescript
<svg
  viewBox={`0 0 ${image_size.width} ${image_size.height}`}
  preserveAspectRatio="xMidYMid slice"
  className="absolute inset-0 w-full h-full"
>
  <polygon points={ROI_indices.map(i => `${landmarks[i][0]},${landmarks[i][1]}`).join(' ')} />
  {key_indices.map(i => <circle cx={landmarks[i][0]} cy={landmarks[i][1]} r="1.5" />)}
</svg>
```
SVG viewBox를 원본 이미지 크기로 설정하고 실제 픽셀 좌표를 그대로 사용. CSS `absolute` 포지셔닝으로 이미지 위에 겹쳐서 어떤 화면 크기에서도 정확하게 얼굴 위에 표시된다.

---

## 2. 제품 추천

> 피부 분석 점수와 피부 타입을 기반으로 성분이 맞는 제품을 DB에서 필터링해 상위 5개를 추천하는 기능.

### 전체 흐름

```
피부 타입 결정 (analyze에서 이어짐)
    → 피부 타입별 추천 성분 목록 조회
    → DB 전체 제품 순회 → 카테고리 필터 → avoid 필터 → 성분 매칭 점수 계산
    → 이름 기준 중복 제거 → 상위 5개
    → Gemini로 추천 이유 문장 생성
```

### 추천 성분 정의

```python
RECOMMENDED_INGREDIENTS = {
    "dry":         ["hyaluronic acid", "glycerin", "ceramide", "squalane"],
    "oily":        ["niacinamide", "salicylic acid", "zinc", "tea tree"],
    "sensitive":   ["centella asiatica", "aloe vera", "panthenol", "allantoin"],
    "combination": ["niacinamide", "hyaluronic acid", "green tea", "peptide"],
}
```

성분별 피부과학적 근거:
- **hyaluronic acid**: humectant, 수분 흡착 (건성)
- **ceramide**: 피부 장벽 지질 구성 성분 (건성/민감성)
- **niacinamide**: 피지 조절 + 모공 수축 + 항염 (지성/복합성)
- **salicylic acid**: BHA, 지용성으로 모공 속 피지 용해 (지성)
- **centella asiatica**: 마데카소사이드 성분으로 진정·항염 (민감성)
- **panthenol**: 프로비타민 B5, 피부 장벽 회복 + 보습 (민감성)

### 제품 필터링 로직 (`routers/recommend.py`)

```python
for product in db.query(Product).all():
    # 1. 카테고리 필터
    if not any(c in category for c in ALLOWED_CATEGORIES):
        continue

    # 2. avoid_conditions 필터 (나쁜 상태 지표와 겹치면 제외)
    avoid_conditions = [k for k, v in scores.items() if v.get("status") == "bad"]
    if any(c in product.avoid_conditions for c in avoid_conditions):
        continue

    # 3. 성분 매칭 점수
    match_count = sum(1 for rec in recommended if any(rec in ing for ing in product.ingredients))
    match_score = match_count / len(recommended) * 100
```

### avoid_conditions 자동 생성 원리 (`data/seed_korean.py`)

제품을 DB에 삽입할 때(seeding), 각 제품의 성분 목록을 검사해서 자동으로 `avoid_conditions`를 부여한다.

```python
CONDITION_AVOID = {
    "redness":  ["alcohol", "fragrance", "parfum"],           # 알코올·향료 → 붉음 악화
    "trouble":  ["sodium lauryl sulfate", "paraben"],          # SLS·파라벤 → 트러블 악화
    "moisture": ["alcohol", "sodium lauryl sulfate"],          # 알코올·SLS → 수분 방해
}
```

예) 알코올 함유 제품은 seeding 시 `avoid_conditions=["redness", "moisture"]`로 저장 → 붉음/수분이 bad인 사용자에게 추천되지 않음

### K-Beauty 필터 (프론트)

```typescript
const [koreanOnly, setKoreanOnly] = useState(false)
useEffect(() => {
    if (!koreanOnly) { setKoreanProducts(null); return }
    getProductRecommendations(skinScores, koreanOnly=true)
}, [koreanOnly])
```

백엔드에서 `KOREAN_BRANDS` set으로 브랜드명 필터링. `koreanOnly` state가 변경될 때 `useEffect`가 재실행되어 즉시 새 목록을 가져온다.

---

## 3. 메이크업 팔레트 추천

> 피부 타입 + 조명 환경 조합으로 최적의 메이크업 색상 팔레트를 추천하고, Gemini로 이유를 생성하는 기능.

### 전체 흐름

```
[프론트] 피부 타입 + 조명(bright/dark/outdoor) 선택
    → getMakeupRecommendation(skin_type, lighting_env)
    → POST /recommend/makeup

[백엔드]
    → makeup_palettes.json에서 [lighting][skin_type] 팔레트 조회
    → DB에서 makeup 카테고리 제품 카테고리별 2개씩 수집
    → Gemini로 팔레트 추천 이유 생성
    → palette(hex 4개) + tip + products 반환
```

### 팔레트 데이터 구조 (`data/makeup_palettes.json`)

**3가지 조명 × 4가지 피부 타입 = 12가지 조합**

```json
{
  "bright": {
    "dry": {
      "foundation": "#F5DEB3", "blush": "#FFB6C1",
      "lip": "#FF6B8A", "eye": "#D4A5A5",
      "tip": "Use a dewy glow foundation for a radiant look..."
    }
  }
}
```

조명별 전략:
- **bright**: 자연스러운 중간 채도 (색이 선명하게 보이므로)
- **dark**: 채도 높고 진한 색상 — 버건디 립, 스모키 아이 (어두우면 색이 가라앉아 보임)
- **outdoor**: 코랄/오렌지 톤 + SPF 제품 강조 (강한 햇빛 대비)

피부 타입별 파운데이션 전략:
- **dry**: 데이 글로우 파운데이션 → 광채 표현
- **oily**: 매트 파운데이션 → 피지 컨트롤
- **sensitive**: 무향 미네랄 파운데이션 → 자극 최소화
- **combination**: T존 매트 + 볼 글로우 → 존별 적용

### Gemini 추천 이유 생성 (`pipeline/gemini.py`)

```python
prompt = (
    f"Skin type: {skin_en}, Lighting environment: {light_en}\n"
    f"Recommended foundation: {palette['foundation']}, blush: {palette['blush']}, ..."
    "Explain in 2-3 natural sentences why this palette suits the user. "
    "Do not mention the hex color values."
)
response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
```

실패 시 `except`에서 `palette["tip"]` 필드의 사전 정의된 텍스트로 fallback.

### 조명 토글 (프론트)

```typescript
const [lighting, setLighting] = useState("bright")
useEffect(() => {
    getMakeupRecommendation(skin_type, lighting)
}, [analysisData, lighting])  // lighting 변경 시 자동 재요청
```

💡/🌙/☀️ 버튼을 누르면 `lighting` state가 바뀌고, `useEffect` 의존성 배열에 `lighting`이 있어서 자동으로 API를 재호출한다.

---

## 4. 헤어스타일 추천

> 피부 분석에서 추출한 468개 랜드마크로 얼굴형을 분류하고, 얼굴형에 맞는 헤어스타일 3개를 추천하는 기능.

### 전체 흐름

```
[프론트] 분석 결과의 landmarks 배열 사용
    → getHairstyleRecommendation(landmarks)
    → POST /recommend/hairstyle

[백엔드]
    → classify_face_shape(landmarks) → 얼굴형 판정
    → hairstyles.json에서 해당 얼굴형 데이터 조회
    → face_shape + styles(3개) 반환
```

### 얼굴형 분류 알고리즘 (`pipeline/face_shape.py`)

468개 랜드마크 중 8개 기준점의 거리 비율로 분류한다.

```python
face_height    = dist(landmarks[10],  landmarks[152])   # 이마 꼭대기 ~ 턱끝
cheek_width    = dist(landmarks[234], landmarks[454])   # 양쪽 광대
forehead_width = dist(landmarks[103], landmarks[332])   # 이마 너비
jaw_width      = dist(landmarks[172], landmarks[397])   # 턱선 너비

ratio = face_height / cheek_width

if ratio > 1.75:                          → long   (긴형)
elif ratio < 1.05:                        → round  (둥근형)
elif jaw_width / cheek_width > 0.85:      → square (각진형)
elif forehead_width / jaw_width > 1.3:    → heart  (하트형)
else:                                     → oval   (타원형)
```

비율을 쓰는 이유: 이미지 해상도나 얼굴 크기에 무관하게 동작한다.

### 헤어스타일 데이터 구조 (`data/hairstyles.json`)

```json
{
  "oval": {
    "label": "Oval",
    "description": "An ideally proportioned face shape...",
    "styles": [
      { "name": "Layered Cut", "reason": "...", "length": "medium", "tags": ["volume"] },
      { "name": "Wavy Long", ... },
      { "name": "Short Pixie Cut", ... }
    ]
  }
}
```

얼굴형별 추천 전략:

| 얼굴형 | 전략 | 대표 스타일 |
|--------|------|-------------|
| oval | 대부분 어울림 → 다양하게 | Layered Cut, Wavy Long |
| round | 세로 길이감 강조, 가로 볼륨 억제 | High-Layered Long, Side-Part |
| square | 곡선으로 각진 턱선 완화 | Soft Wave, C-Curl Bob |
| heart | 아래 볼륨 추가, 넓은 이마 커버 | Chin-Length Bob |
| long | 가로 볼륨 추가, 이마 커버 | Volume Bob, Bang Medium |

---

## 5. 메이크업 트랜스퍼

> 연예인 사진의 메이크업 스타일을 사용자 사진에 적용하는 AI 이미지 생성 기능.

### 전체 흐름

```
[프론트] 연예인 사진 + 사용자 사진 업로드
    → URL.createObjectURL()로 미리보기 생성
    → transferMakeup(userFile, celebFile)
    → POST /style/makeup-transfer (multipart)

[백엔드]
    → 두 이미지를 tmp 파일로 저장
    → Gemini 멀티모달 API 호출 (연예인 이미지 + 사용자 이미지 + 프롬프트)
    → 응답에서 이미지 바이트 추출 → uploads/ 저장
    → /uploads/{uuid}.jpg URL 반환

[프론트]
    → 결과 이미지 표시 + 저장 버튼
    → URL.revokeObjectURL()로 미리보기 메모리 해제
```

### Gemini 멀티모달 호출 (`pipeline/makeup_transfer.py`)

```python
response = await asyncio.wait_for(
    client.aio.models.generate_content(
        model="gemini-3.1-flash-image",
        contents=[
            types.Content(role="user", parts=[
                types.Part.from_bytes(data=celebrity_bytes, mime_type=...),
                types.Part.from_bytes(data=user_bytes, mime_type=...),
                types.Part(text=TRANSFER_PROMPT),
            ])
        ],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    ),
    timeout=300.0,
)
```

`response_modalities=["IMAGE", "TEXT"]`로 이미지 응답을 요청한다. 응답 parts 중 `inline_data`가 있는 파트에서 이미지 바이트를 추출해 저장한다.

### 프롬프트 설계 전략

```
"Apply the makeup style from the celebrity photo (foundation tone, blush, eye shadow, eyeliner, lip color)
to the user's face.
Preserve the user's facial structure, face shape, skin tone base, hair, and identity exactly.
Do not change the user's eye color, hair, clothing, or background.
Only change the makeup."
```

"바꾸지 말 것"을 명시하는 게 핵심이다. 지시가 없으면 LLM 기반 이미지 모델이 얼굴 자체를 연예인처럼 바꾸려는 경향이 있어서 아이덴티티 유지 제약 조건을 명시적으로 넣었다.

### 타임아웃 처리

```python
asyncio.wait_for(..., timeout=300.0)  # 5분
```

이미지 생성은 수십 초~수 분이 소요될 수 있어서 5분 타임아웃을 설정했다. 초과 시 `TimeoutError` → `RuntimeError` → HTTP 502 반환.

### 미리보기 메모리 관리 (프론트)

```typescript
// 파일 선택 시
const preview = URL.createObjectURL(file)
setter({ file, preview })

// 파일 제거 시
if (current.preview) URL.revokeObjectURL(current.preview)
```

`createObjectURL`은 브라우저 메모리에 Blob URL을 생성한다. 사용 후 `revokeObjectURL`을 호출하지 않으면 메모리 누수가 발생하므로 파일 제거 시 반드시 해제한다.

---

## 6. 헤어 트랜스퍼

> 연예인 사진의 헤어스타일을 사용자 사진에 적용하는 AI 이미지 생성 기능.

### 메이크업 트랜스퍼와 차이점

UI와 API 호출 구조는 메이크업 트랜스퍼와 동일하지만, 백엔드 프롬프트가 다르다.

```python
CELEBRITY_TRANSFER_PROMPT = (
    "Image 1: hair reference (celebrity). Extract the hairstyle only — "
    "hair color, cut shape, length, layers, bangs, texture, volume, and styling.\n"
    "Image 2: the base photo. This is the OUTPUT image. Treat it as a locked layer.\n\n"
    "LOCKED (must not change under any circumstances):\n"
    "- Face: every facial feature — eyes, iris color, nose, mouth, jaw, cheekbones\n"
    "- Eye color: iris and pupil color must be exactly identical\n"
    "- Skin tone and skin texture\n"
    "- Clothing, background\n\n"
    "ONLY CHANGE: the hair region."
)
```

메이크업보다 더 강한 어조("must not change under any circumstances")를 쓴다. 헤어는 얼굴 경계에 붙어 있어서 모델이 얼굴 특징까지 변형하려는 경향이 더 강하기 때문이다.

사용 모델도 다르다:
- 메이크업 트랜스퍼: `gemini-3.1-flash-image`
- 헤어 트랜스퍼: `gemini-3-pro-image` (더 정밀한 헤어 처리를 위해 Pro 모델 사용)

---

## 7. 헤어 스타일링 (AI 맞춤)

> 별도의 연예인 사진 없이, 피부 분석에서 얻은 얼굴형에 맞는 추천 스타일을 텍스트 설명만으로 AI가 이미지에 적용하는 기능.

### 헤어 트랜스퍼와 핵심 차이

| | 헤어 트랜스퍼 | 헤어 스타일링 |
|---|---|---|
| 입력 | 사용자 사진 + 연예인 사진 | 사용자 사진만 |
| 스타일 지정 방식 | 연예인 이미지로 시각적 전달 | 텍스트 설명으로 언어적 전달 |
| 얼굴형 고려 | 없음 | 얼굴형에 최적화된 추천 스타일 사용 |

### 전체 흐름

```
[프론트] 페이지 진입 시 랜드마크 자동 로드
    1순위: sessionStorage의 analysisLandmarks (로그인 불필요)
    2순위: 서버 history API (로그인 필요)
    → getHairstyleRecommendation(landmarks) → 얼굴형 + 스타일 3개 표시
    → 사용자가 스타일 선택 + 사진 업로드
    → applyRecommendedHair(userFile, landmarks, selectedStyle)
    → POST /style/hair-styling (multipart: image + landmarks JSON + style_index)

[백엔드]
    → classify_face_shape(landmarks) → 얼굴형 확인
    → hairstyles.json에서 style_index번째 스타일 이름·이유 추출
    → 텍스트 프롬프트 동적 생성 → Gemini 호출
    → 결과 이미지 반환
```

### 동적 프롬프트 생성 (`pipeline/hair_transfer.py`)

```python
prompt = (
    f"YOUR TASK: replace the existing hair with the following hairstyle — "
    f"'{style_name}': {style_reason}\n"
    f"This style is suited for a {face_shape} face shape.\n\n"
    f"LOCKED: face, eye color, skin tone, clothing, background\n"
    f"ONLY CHANGE: the hair region."
)
```

연예인 사진이 없으므로 스타일 이름과 설명 텍스트를 프롬프트에 직접 넣어 Gemini가 그 스타일을 이미지로 구현하도록 한다.

### sessionStorage 기반 랜드마크 캐싱 (프론트)

```typescript
// 분석 결과 페이지에서 저장
sessionStorage.setItem('analysisLandmarks', JSON.stringify(landmarks))

// 헤어 스타일링 페이지에서 읽기
const cached = sessionStorage.getItem('analysisLandmarks')
if (cached) {
    const lm = JSON.parse(cached)
    // 서버 요청 없이 바로 사용
}
```

로그인 없이도 최근 분석 결과의 랜드마크를 사용할 수 있게 했다. sessionStorage는 브라우저 탭이 닫히면 사라지므로 임시 캐시로 적합하다.

### base64 → File 변환 (프론트)

```typescript
// sessionStorage의 base64 이미지를 File 객체로 변환
const arr = savedImage.split(',')
const mime = arr[0].match(/:(.*?);/)?.[1] ?? 'image/jpeg'
const bstr = atob(arr[1])
const u8arr = new Uint8Array(bstr.length)
for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i)
const file = new File([u8arr], 'analysis.jpg', { type: mime })
```

sessionStorage에 저장된 base64 이미지 문자열을 `File` 객체로 변환해 업로드 폼에 미리 채워준다. 사용자가 따로 사진을 다시 업로드하지 않아도 된다.

---

## 8. Google 로그인 / 인증

> Google OAuth 2.0으로 소셜 로그인을 구현하고, JWT를 HttpOnly 쿠키에 저장해 인증 상태를 유지하는 기능.

### OAuth 2.0 흐름

```
[1] GET /auth/login
    → scope="openid email profile", response_type="code"
    → RedirectResponse → 브라우저를 Google 로그인 페이지로 보냄

[2] 사용자가 Google에서 로그인 승인
    → Google이 /auth/google/callback?code=... 으로 리다이렉트

[3] GET /auth/google/callback?code=...
    → code + client_secret으로 Google에 access_token POST 요청
    → access_token으로 Google userinfo API 호출
      → email, name, picture, sub(고유 ID) 수신
    → DB에서 google_id(=sub) 조회
      → 없으면 신규 User 생성 (소셜 로그인 = 회원가입 자동)
    → JWT 생성 → HttpOnly 쿠키에 저장
    → 프론트엔드로 리다이렉트

[4] 이후 API 요청
    → 브라우저가 쿠키 자동 포함 전송
    → get_current_user() 의존성이 쿠키에서 JWT 파싱 → 유저 정보 반환
    → 미로그인 시 None 반환 (에러 아님 — 로그인 선택적)
```

### JWT 구조 및 보안 설정

```python
payload = { "sub": user.id, "email": user.email, "name": user.name, "exp": now + 7일 }
token = jwt.encode(payload, settings.jwt_secret_key, algorithm="HS256")

response.set_cookie(
    key="access_token",
    value=token,
    httponly=True,   # JS document.cookie 접근 불가 → XSS 방어
    samesite="lax",  # 타 도메인 요청 시 쿠키 전송 제한 → CSRF 기본 방어
    max_age=60 * 60 * 24 * 7,
)
```

### FastAPI 의존성 주입 패턴

```python
def get_current_user(access_token: str = Cookie(default=None)):
    if not access_token:
        return None
    try:
        payload = jwt.decode(access_token, settings.jwt_secret_key, algorithms=["HS256"])
        return {"id": payload["sub"], "email": payload["email"], ...}
    except JWTError:
        return None

# 라우터에서 사용
@router.post("/")
async def analyze_skin(current_user=Depends(get_current_user)):
    if current_user:
        # 로그인한 경우만 저장
```

`default=None`이라 로그인 안 해도 API 호출 가능. `current_user` 값으로 로그인 여부를 분기한다.

### CORS 설정 이유 (`main.py`)

```python
CORSMiddleware(
    allow_origins=[settings.frontend_url],  # 특정 출처만 허용 (*)는 안 됨
    allow_credentials=True,                 # 쿠키 포함 요청 허용 (필수!)
)
```

`allow_credentials=True` 없으면 브라우저가 쿠키를 포함한 cross-origin 요청을 차단한다. 단, `credentials=True`일 때는 `allow_origins=["*"]`를 쓸 수 없어서 프론트엔드 URL을 명시해야 한다.

### 프론트엔드 인증 상태 관리 (`hooks/useAuth.ts`)

```typescript
// 로그인 버튼
window.location.href = `${API_URL}/auth/login`  // 백엔드 OAuth 시작점으로 이동

// 로그아웃
await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
// 백엔드에서 쿠키 삭제 → router.replace("/")

// 인증 필요한 fetch
fetch(url, { credentials: 'include' })  // 쿠키 자동 포함
```

---

## 9. 분석 히스토리

> 로그인한 사용자의 피부 분석 기록을 시간순으로 조회하고, 캘린더와 트렌드 차트로 시각화하는 기능.

### 전체 흐름

```
[분석 완료 시 저장]
    → 로그인 상태이면 AnalysisHistory DB 저장
      → image_filename, skin_scores(JSON), landmarks(JSON), image_size 포함

[히스토리 조회]
[프론트] GET /analyze/history (credentials: 'include')
[백엔드]
    → JWT에서 user_id 추출
    → AnalysisHistory 테이블에서 user_id 기준 조회 → 최신순 정렬
    → image_url = backend_url + /uploads/ + image_filename

[프론트] 히스토리 카드 클릭
    → skin_scores + landmarks + image_url을 JSON 직렬화
    → /result?data=... 로 이동 → 결과 페이지에서 재현
```

### DB 저장 시 landmarks를 포함하는 이유

```python
db.add(AnalysisHistory(
    skin_scores=scores,
    landmarks=landmarks["landmarks"],   # 468개 좌표 전체
    image_size=landmarks["image_size"],
    ...
))
```

히스토리에서 과거 분석 결과를 클릭하면 결과 페이지가 그대로 재현된다. 이때 이미지 위에 랜드마크 오버레이를 다시 그리려면 좌표 데이터가 필요하다. 재분석 없이 보여주려면 저장해둬야 한다.

### 트렌드 차트 계산 (프론트)

```typescript
const chartData = [...history].slice(0, 10).reverse()
    .map(r => ({ date: formatDateShort(r.analyzed_at), score: r.overall_score }))

const avg = Math.round(history.reduce((s, r) => s + r.overall_score, 0) / history.length)
const best = Math.max(...history.map(r => r.overall_score))
const trend = ((history[0].score - history[history.length-1].score)
               / history[history.length-1].score * 100).toFixed(1)
```

최근 10개를 날짜 오름차순으로 정렬해 선 차트로 그린다. trend는 첫 기록 대비 최근 기록의 변화율(%).

### 캘린더 스트립 구현 (프론트)

```typescript
const daysWithAnalysis = history
    .filter(r => new Date(r.analyzed_at).getMonth() === currentMonth)
    .map(r => new Date(r.analyzed_at).getDate())

// 해당 날짜에 분홍 점 표시
{hasAnalysis && <div className="w-1.5 h-1.5 rounded-full bg-[#F9A8C9]" />}
```

히스토리의 날짜를 파싱해서 현재 보고 있는 월에 분석한 날에 표시한다.

---

## 10. 카메라 촬영

> 별도 앱 없이 브라우저에서 직접 카메라를 열어 사진을 찍고 분석에 사용하는 기능.

### 전체 흐름

```
openCamera()
    → navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
    → 스트림을 <video> 태그에 연결 → 실시간 미리보기

flipCamera()
    → facingMode 전환 (user ↔ environment)
    → 기존 스트림 stop() → 새 스트림으로 재연결

capturePhoto()
    → <canvas>에 video 현재 프레임 그리기
    → 전면 카메라면 ctx.scale(-1, 1) 좌우 반전 적용
    → canvas.toBlob() → File 객체 생성
    → closeCamera() → handleFile(file)

closeCamera()
    → stream.getTracks().forEach(t => t.stop())  # 카메라 LED 끔
    → cameraOpen = false
```

### 전면 카메라 좌우 반전 처리

```typescript
if (facingMode === "user") {
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)     // 좌우 반전
}
ctx.drawImage(video, 0, 0)
```

전면 카메라 미리보기는 CSS로 `-scale-x-100`(거울 효과)을 줘서 자연스럽게 보이게 한다. 실제 캡처 시에는 Canvas에서 다시 정방향으로 그려서 저장한다. 미리보기는 거울처럼, 저장은 정방향으로.

### 메모리 정리

```typescript
// 컴포넌트 unmount 시 자동 정리
useEffect(() => () => stopStream(), [stopStream])

const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
}
```

`useEffect`의 cleanup 함수(`() => stopStream()`)는 컴포넌트가 언마운트될 때 실행된다. 페이지를 벗어나도 카메라가 계속 켜져 있는 문제를 방지한다.

### 분석 전 이미지 미리보기

```typescript
reader.onload = (e) => setImage(e.target?.result as string)
reader.readAsDataURL(file)  // base64로 읽어서 <img src>에 바로 사용
```

파일을 base64 Data URL로 읽어서 `<img>` 태그에 바로 렌더링한다. 업로드 전에 사용자가 사진을 확인할 수 있다. 이 base64 문자열이 나중에 `sessionStorage`에 저장되어 헤어 스타일링 페이지에서 재사용된다.

---

## 부록: 전체 기술 스택

| 영역 | 기술 | 선택 이유 |
|------|------|-----------|
| 백엔드 프레임워크 | FastAPI | 비동기 지원, 자동 API 문서, Pydantic 통합 |
| DB ORM | SQLAlchemy + Alembic | 마이그레이션 버전 관리 |
| DB | PostgreSQL | JSON 컬럼 지원, 안정성 |
| 얼굴 인식 | MediaPipe FaceLandmarker | Google 사전학습 모델, 468개 랜드마크 |
| 이미지 처리 | OpenCV | LAB/HSV 변환, CLAHE, 마스킹 |
| 이미지 생성 | Gemini API | 멀티모달 이미지 입력+출력 |
| 인증 | Google OAuth 2.0 + JWT | 소셜 로그인, HttpOnly 쿠키 보안 |
| 프론트엔드 | Next.js 14 App Router | 파일 기반 라우팅, CSR/SSR 혼합 |
| UI | shadcn/ui + Tailwind CSS | Radix UI 기반 접근성, 빠른 스타일링 |
| 차트 | Recharts | React 전용, 레이더·라인 차트 지원 |
| 카메라 | MediaDevices API | 브라우저 네이티브, 별도 앱 불필요 |
| 컨테이너 | Docker + docker-compose | 백엔드/DB 환경 일관성 |
