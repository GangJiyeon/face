# Product Requirements Document (PRD)

**Project:** project — AI-Powered Personalized Beauty Recommendation System
**Course:** Capstone Design 2026
**Student:** 202330330 강지연

---

## 1. Overview

### Problem Statement
Existing beauty recommendation services rely on fixed skin type surveys and fail to reflect daily changes in skin condition. Users cannot get personalized recommendations based on how their skin looks today.

### Solution
project uses facial image analysis and a custom CV pipeline to estimate the user's current skin condition and recommend suitable products based on ingredient compatibility data.

### Core Direction
- Do not rely solely on generic Vision APIs — build a custom face analysis pipeline
- Provide explainable, personalized recommendations combined with an ingredient DB
- Support both logged-in and guest users

---

## 2. Target Users

| User Type | Need |
|-----------|------|
| General user | Wants fast product recommendations based on today's skin condition |
| Sensitive skin user | Needs to avoid specific ingredients (alcohol, fragrance, sulfates) |
| Indecisive shopper | Spends too much time reading reviews before deciding |
| Tracker | Wants to monitor skin changes over time through saved records |

---

## 3. Core Features

### 1st Semester — MVP

| # | Feature | Description |
|---|---------|-------------|
| 01 | Skin condition estimation | Upload face photo → face detection → landmark extraction → ROI analysis → score per category |
| 02 | Custom face analysis pipeline | Apply custom rules/models per facial region beyond generic API output |
| 03 | Ingredient-based filtering | Auto-exclude unsuitable ingredients; filter products using Open Beauty Facts DB |
| 04 | Product recommendation + explanation | Recommend products based on skin scores; generate natural language explanation via Claude API |
| 05 | Guest mode | Full analysis and recommendation without login |

### 2nd Semester — Advanced

| # | Feature | Description |
|---|---------|-------------|
| 06 | Skin change tracking | Save daily skin records; visualize trends over time |
| 07 | Vertex AI custom model | Train and deploy custom skin condition classification model |
| 08 | Style  (Beta) | Face shape detection → hairstyle and color recommendations |

---

## 4. User Flow

### Guest (No Login)
```
Landing → Upload Photo → Analysis Loading → Result (Skin Score + Recommendations)
```

### Logged-in User
```
Landing → Upload Photo → Analysis Loading → Result → Save Record → History / Trend View
```

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Analysis response within 10 seconds |
| Accuracy | Face detection success rate > 90% under normal lighting |
| Availability | Service uptime > 99% |
| Privacy | Face images deleted from server after analysis; not stored permanently for guests |
| Scalability | Architecture supports model upgrade in 2nd semester without major refactoring |

---

## 6. Milestones

### 1st Semester (6 weeks)

| Period | Milestone | Key Deliverables |
|--------|-----------|-----------------|
| Week 1–2 | MVP Complete | Full UI, photo upload, skin analysis pipeline, product recommendation |
| Week 3–4 | Auth + Enhancement | Google social login, skin record saving, environment data integration |
| Week 5–6 | Polish + Deploy | Style tab shell, E2E testing, AWS deployment |

### 2nd Semester
- Skin change trend visualization
- Vertex AI custom model training and deployment
- Style  feature full implementation

---

## 7. Out of Scope (1st Semester)

- IoT sensor integration (removed)
- Payment or e-commerce functionality
- Social features (sharing, comments)
- Style  logic (UI shell only)