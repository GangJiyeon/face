# Tech Stack

**Project:** SKAI — AI-Powered Personalized Beauty Recommendation System
**Version:** 1.0 (1st Semester MVP)

---

## 1. Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Frontend                          │
│              Next.js + Tailwind CSS                      │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP / REST
┌─────────────────────▼───────────────────────────────────┐
│                        Backend                           │
│                    FastAPI (Python)                      │
│         ┌────────────┬────────────────┐                  │
│         │  Analysis  │  Recommend     │                  │
│         │  Router    │  Router        │                  │
│         └─────┬──────┴───────┬────────┘                  │
└───────────────┼──────────────┼──────────────────────────┘
                │              │
    ┌───────────▼───┐   ┌──────▼──────────────┐
    │  CV Pipeline  │   │   Generative AI      │
    │  MediaPipe    │   │   Google Gemini      │
    │  OpenCV       │   │   (text + image)     │
    │  (LAB/HSV)    │   │                      │
    └───────────────┘   └──────────────────────┘
                │
    ┌───────────▼───────────────────────────────┐
    │              Data Layer                    │
    │   PostgreSQL    │    AWS S3                │
    │   (records)     │    (images)              │
    │                 │                          │
    │   Open Beauty Facts DB                     │
    └────────────────────────────────────────────┘
```

---

## 2. Frontend

| Tech | Version | Purpose |
|------|---------|---------|
| Next.js | 16.x | Web framework, SSR/CSR |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Recharts | latest | Radar chart, trend line chart |

### Design System
- Base: white background, clean minimal
- Accent: soft pink `#F9A8C9`, lavender `#C4B5FD`
- Mobile-first responsive, bottom navigation bar on mobile
- Desktop: top header navigation

---

## 3. Backend

| Tech | Version | Purpose |
|------|---------|---------|
| FastAPI | latest | REST API server |
| Python | 3.11 | Runtime |
| PostgreSQL | 16 | User records, product data |
| SQLAlchemy | latest | ORM |
| Alembic | latest | DB migrations |
| psycopg2 | latest | PostgreSQL driver |
| python-jose | latest | JWT 인코딩/디코딩 (인증) |
| httpx | latest | Google OAuth 토큰 교환 |
| google-genai | latest | Gemini API 클라이언트 |
| python-dotenv | latest | Environment variable management |
| boto3 | latest | AWS S3 integration |
| python-multipart | latest | File upload handling |

### API Structure
```
GET  /health                  — Health check
POST /analyze/                — 이미지 분석 → 피부 점수·타입·추천 제품 반환
GET  /analyze/history         — 로그인 사용자의 분석 히스토리 조회
POST /recommend/              — 피부 점수 기반 제품 추천
POST /recommend/hairstyle     — 얼굴형 기반 헤어스타일 추천
POST /recommend/makeup        — 피부 타입·조명 기반 색조 팔레트 추천
POST /style/makeup-transfer   — 연예인 메이크업 합성 (Gemini)
POST /style/hair-transfer     — 연예인 헤어 합성 (Gemini)
POST /style/hair-styling      — 얼굴형 맞춤 헤어 스타일링 (Gemini)
GET  /auth/login              — Google OAuth 로그인
GET  /auth/me                 — 현재 사용자 정보
```

---

## 4. AI / Analysis Pipeline

| Tech | Purpose |
|------|---------|
| MediaPipe Face Landmarker | Extract 468 facial landmarks, ROI separation |
| OpenCV | Image preprocessing, color space conversion (BGR→LAB/HSV), CLAHE, masking |
| Google Gemini (text) | 색조 팔레트 추천 이유 자연어 생성 |
| Google Gemini (image) | 메이크업·헤어 스타일 이미지 합성 |

### Skin Analysis Metrics
| Metric | Method |
|--------|--------|
| Redness | LAB color space a-channel mean value |
| Tone unevenness | Brightness variance across skin ROI regions |
| Brightness | LAB L-channel mean value |
| Trouble area | Ratio of locally abnormal color pixels |
| Moisture | Derived from brightness and inverse redness |

All metrics normalized to 0–100 score.

---

## 5. Data

| Source | Usage |
|--------|-------|
| Open Beauty Facts | Open-source cosmetics ingredient DB |
| Custom product DB | Curated product list with ingredient mapping |
| PostgreSQL | User records, skin history, product data |
| AWS S3 | Face image storage (deleted after analysis for guests) |

### Ingredient Filtering
- Exclude list: alcohol, fragrance, sulfates, parabens
- Skin condition → avoid ingredient mapping table
- Skin condition → recommended ingredient mapping table

---

## 6. Infrastructure

| Tech | Purpose |
|------|---------|
| Docker / Docker Compose | Local development environment |
| AWS EC2 | Backend server deployment |
| AWS RDS | PostgreSQL managed DB |
| AWS S3 | Image file storage |

### Docker Compose Services
```yaml
services:
  backend   # FastAPI on port 8000
  frontend  # Next.js on port 3000
  db        # PostgreSQL on port 5432
```

---

## 7. Authentication

| Tech | Purpose |
|------|---------|
| Google OAuth 2.0 | 소셜 로그인 (구현 완료) |
| JWT (python-jose) | HttpOnly 쿠키 기반 세션 토큰 |

---

## 8. 2nd Semester Additions

| Tech | Purpose |
|------|---------|
| Vertex AI AutoML | Custom skin condition classification model training |
| Vertex AI Pipelines | Preprocessing → training → evaluation → redeployment automation |
| 피부 변화 추이 시각화 | 히스토리 기반 시계열 그래프 |
| 실시간 메이크업 오버레이 | 필터 추출 + 라이브 오버레이 (Beta) |