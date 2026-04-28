# Tech Stack

**Project:** SKAI
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
    │  CV Pipeline  │   │   External APIs      │
    │  MediaPipe    │   │   Claude API         │
    │  OpenCV       │   │   Google Vision API  │
    │  Vision API   │   │   OpenWeatherMap     │
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
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
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
| psycopg2 | latest | PostgreSQL driver |
| python-dotenv | latest | Environment variable management |
| boto3 | latest | AWS S3 integration |
| python-multipart | latest | File upload handling |

### API Structure
```
GET  /health               — Health check
POST /analyze/             — Receive image, run CV pipeline, return skin scores
POST /recommend/           — Receive skin scores, return product recommendations + Claude explanation
```

---

## 4. AI / Analysis Pipeline

| Tech | Purpose |
|------|---------|
| MediaPipe Face Landmarker | Extract 468 facial landmarks, ROI separation |
| OpenCV | Image preprocessing, color space conversion (BGR→LAB/HSV), CLAHE, masking |
| Google Vision API | Auxiliary face detection |
| Claude API (claude-sonnet) | Natural language recommendation explanation generation |
| OpenWeatherMap API | Environmental data (temperature, humidity, UV index) |

### Skin Analysis Metrics
| Metric | Method |
|--------|--------|
| Redness | LAB color space a-channel mean value |
| Tone unevenness | Brightness variance across skin ROI regions |
| Brightness | LAB L-channel mean value |
| Trouble area | Ratio of locally abnormal color pixels |

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

## 7. 2nd Semester Additions

| Tech | Purpose |
|------|---------|
| Vertex AI AutoML | Custom skin condition classification model training |
| Vertex AI Pipelines | Preprocessing → training → evaluation → redeployment automation |
| Google Social Login | OAuth 2.0 user authentication |