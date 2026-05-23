# face# 이미지 인식 기반 맞춤형 뷰티 추천 시스템

얼굴 이미지 분석을 통해 당일 피부 컨디션을 추정하고, 성분 데이터 기반으로 맞춤형 기초·베이스 화장품을 추천하는 서비스입니다.

## 주요 기능

- 얼굴 사진 업로드 → MediaPipe + OpenCV 커스텀 파이프라인으로 피부 컨디션 점수화
- 성분 DB 기반 부적합 성분 자동 필터링
- Claude API를 활용한 자연어 추천 이유 생성
- 피부 변화 추이 기록 및 시각화 (2학기 예정)

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Next.js, Tailwind CSS |
| Backend | FastAPI, PostgreSQL |
| AI / 분석 | Google Vision API, MediaPipe, OpenCV, Claude API |
| Data | Open Beauty Facts |
| Infra | Docker, AWS EC2 / RDS / S3 |

## 실행 방법

```bash
# 환경변수 설정
cp .env.example .env

# 도커 실행
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 브랜치 전략

```
main
└── develop
    ├── setup
    ├── backend
    │   └── feature/be-*
    └── frontend
        └── feature/fe-*
```

## 프로젝트 구조

```
project/
├── backend/
│   ├── routers/
│   │   ├── analyze.py
│   │   └── recommend.py
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   └── src/
├── docs/
│   ├── PRD.md
│   ├── IA.md
│   └── STACK.md
├── docker-compose.yml
└── .env
```

---

# project — AI-Powered Personalized Beauty Recommendation System

project analyzes facial images to estimate your skin condition and recommends suitable skincare and base makeup products based on ingredient data.

## Features

- Face photo upload → skin condition scoring via MediaPipe + OpenCV pipeline
- Automatic filtering of unsuitable ingredients using beauty ingredient DB
- Natural language recommendation explanations powered by Claude API
- Skin change tracking and visualization (2nd semester)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, Tailwind CSS |
| Backend | FastAPI, PostgreSQL |
| AI / Analysis | Google Vision API, MediaPipe, OpenCV, Claude API |
| Data | Open Beauty Facts |
| Infra | Docker, AWS EC2 / RDS / S3 |

## Getting Started

```bash
# Set up environment variables
cp .env.example .env

# Run with Docker
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Branch Strategy

```
main
└── develop
    ├── setup
    ├── backend
    │   └── feature/be-*
    └── frontend
        └── feature/fe-*
```