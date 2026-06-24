# Information Architecture (IA)

**Project:** SKAI
**Version:** 1.0 (1st Semester MVP)

---

## 1. Site Map

```
SKAI
├── / (Home)
│   ├── Today's skin summary card
│   ├── Recommended products (horizontal scroll)
│   └── Start Analysis CTA
│
├── /upload (Camera — center tab)
│   ├── Photo upload (drag & drop / file select)
│   ├── Image preview
│   ├── Loading (Face detection → Skin analysis → Generating recommendations)
│   └── → /result
│
├── /result (Analysis Result)
│   ├── Face image with landmark overlay
│   ├── Skin condition radar chart (Redness, Tone, Brightness, Moisture, Trouble)
│   ├── Score cards (5 metrics)
│   ├── Recommended products list
│   ├── Recommendation reason (Gemini)
│   └── Save Results CTA (→ login prompt for guests)
│
├── /history (History)
│   ├── Calendar strip (days with analysis highlighted)
│   ├── Skin trend line chart
│   ├── Recent analysis cards
│   └── Empty state (CTA to first analysis)
│
├── /style (AI Style Studio)
│   ├── /style/makeup-transfer — celebrity makeup synthesis (Gemini)
│   ├── /style/hair-transfer — celebrity hairstyle synthesis (Gemini)
│   ├── /style/hair-styling — face-shape hair styling (Gemini)
│   ├── /style/makeup — color palette recommendation
│   └── Coming soon: real-time makeup overlay (Beta)
│
├── /profile (Profile)
│   ├── User info (Google account)
│   └── Analysis stats
│
└── /settings (Settings)
    ├── Account management
    └── Delete account
```

---

## 2. Navigation

### Mobile — Bottom Navigation Bar

| Tab | Icon | Route | Status |
|-----|------|--------|--------|
| Home | Grid | / | Active |
| History | Clock | /history | Active |
| Upload | Camera (pink floating) | /upload | Active |
| Style | Sparkle | /style | Active (Beta badge) |
| Profile | Person | /profile | Active |

### Desktop — Sidebar

| Element | Content |
|---------|---------|
| Top | SKAI logo |
| Nav | Home / History / Upload / Style / Profile |
| Bottom | Account / Settings |

---

## 3. Key User Flows

### Flow 1: Guest Analysis
```
Home
  └→ Tap camera button
       └→ /upload — upload photo
            └→ Loading screen (3 steps)
                 └→ /result — view skin score + recommendations
```

### Flow 2: Save Record (Logged-in)
```
/result
  └→ Tap "Save Results"
       └→ Record saved to DB
            └→ /history — view past records + trend
```

### Flow 3: AI Style Studio
```
Home or bottom nav
  └→ /style — choose a feature
       └→ Upload photo (+ reference image)
            └→ Gemini synthesis → view result
```

---

## 4. Page Components

### Home (/)
- `<Header>` — logo + notification bell
- `<SkinSummaryCard>` — today's score, radar chart mini
- `<ProductCarousel>` — horizontal scroll, product cards
- `<AnalysisCTA>` — pink button
- `<BottomNav>`

### Upload (/upload)
- `<PageHeader>` — back arrow + title
- `<UploadZone>` — drag & drop, preview
- `<AnalysisButton>` — full width pink
- `<LoadingOverlay>` — step progress

### Result (/result)
- `<PageHeader>`
- `<FaceImageCard>` — image + landmark dots overlay
- `<RadarChart>` — 5-axis skin score (recharts)
- `<ScoreCards>` — 5 metric cards
- `<ProductList>` — recommended product cards
- `<RecommendationReason>` — Gemini text
- `<SaveButton>`
- `<BottomNav>`

### History (/history)
- `<PageHeader>`
- `<CalendarStrip>` — horizontal scroll
- `<TrendChart>` — line chart
- `<AnalysisCardList>`
- `<EmptyState>`
- `<BottomNav>`