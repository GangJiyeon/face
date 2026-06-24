# SKAI — AI 기반 맞춤형 뷰티 추천 시스템

얼굴 사진 한 장으로 피부 컨디션을 정량 분석하고, 성분 데이터 기반의 맞춤 화장품 추천부터 AI 스타일 합성(메이크업·헤어)까지 제공하는 올인원 뷰티 어시스턴트입니다.

## 주요 기능

### 1. 피부 분석
- 얼굴 사진 업로드 → **MediaPipe**(468 랜드마크) + **OpenCV** 커스텀 파이프라인으로 피부 컨디션 점수화
- 5대 지표(수분·홍조·톤 균일도·밝기·트러블)를 0~100점으로 정량화하고 종합 점수 산출
- 점수 기반 피부 타입 분류 (건성 / 지성 / 민감성 / 복합성)

### 2. 맞춤 화장품 추천
- 피부 타입별 추천 성분 매칭 + 부적합 성분 자동 필터링
- 성분 일치도 기반 점수화로 상위 제품 추천
- 국내 브랜드만 보기(`korean_only`) 옵션

### 3. AI 스타일 스튜디오
- **연예인 메이크업 트랜스퍼** — 레퍼런스 사진의 메이크업만 추출해 내 얼굴에 합성
- **연예인 헤어 트랜스퍼** — 헤어스타일(컷·색·길이·질감)만 이식
- **얼굴형 맞춤 헤어 스타일링** — 얼굴 비율로 5종 분류 후 형태별 추천 스타일 합성
- **색조 팔레트 추천** — 피부 타입 × 조명 환경별 컬러 팔레트 + 자연어 설명

### 4. 계정 & 히스토리
- **Google OAuth 2.0** 로그인 (JWT 쿠키 기반), 비로그인 게스트 체험 지원
- 분석 히스토리 저장 및 통계(누적 횟수·평균 점수·연속 기록·개선도) 제공
- 피부 변화 추이 시각화 (2학기 예정)

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Recharts |
| Backend | FastAPI, SQLAlchemy, Alembic, PostgreSQL 16 |
| 얼굴 분석 | MediaPipe (Face Landmarker), OpenCV |
| 생성형 AI | Google Gemini (텍스트 + 이미지 생성) |
| 인증 | Google OAuth 2.0, JWT (python-jose) |
| Data | Open Beauty Facts |
| Infra | Docker Compose (backend / frontend / db), AWS EC2·RDS·S3 (예정) |

## 시스템 동작 흐름

```
사진 업로드 → 랜드마크 추출(MediaPipe) → ROI 전처리(OpenCV)
           → 지표 점수화 → 피부 타입 분류 → 추천 / AI 스타일 합성
```

## 주요 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET`  | `/health` | 헬스 체크 |
| `POST` | `/analyze/` | 이미지 분석 → 피부 점수·타입·추천 제품 반환 |
| `GET`  | `/analyze/history` | 로그인 사용자의 분석 히스토리 조회 |
| `POST` | `/recommend/` | 피부 점수 기반 제품 추천 |
| `POST` | `/recommend/hairstyle` | 얼굴형 기반 헤어스타일 추천 |
| `POST` | `/recommend/makeup` | 피부 타입·조명 기반 색조 팔레트 추천 |
| `POST` | `/style/makeup-transfer` | 연예인 메이크업 합성 |
| `POST` | `/style/hair-transfer` | 연예인 헤어 합성 |
| `POST` | `/style/hair-styling` | 얼굴형 맞춤 헤어 스타일링 |
| `GET`  | `/auth/login` · `/auth/me` | Google OAuth 로그인 / 사용자 정보 |

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

## 환경 변수 (`.env`)

```
DATABASE_URL=postgresql://...
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DB=...
JWT_SECRET_KEY=...
GEMINI_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

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
face/
├── backend/
│   ├── core/            # 설정, 인증(JWT)
│   ├── db/              # SQLAlchemy 모델, 세션
│   ├── pipeline/        # face, preprocess, scoring, face_shape,
│   │                    #   gemini, makeup_transfer, hair_transfer
│   ├── routers/         # analyze, recommend, auth, style
│   ├── schemas/         # Pydantic 스키마
│   ├── data/            # beauty.csv, hairstyles.json, makeup_palettes.json, seed
│   ├── models/          # face_landmarker.task
│   ├── alembic/         # DB 마이그레이션
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   └── src/             # app, components, hooks, lib, types
├── docs/                # PRD, IA, ERD, STACK
├── docker-compose.yml
└── .env
```