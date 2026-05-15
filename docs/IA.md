# Information Architecture (IA)

**Project:** project
**Version:** 1.0 (1st Semester MVP)

---

## 1. Site Map

```
project
├── / (Home)
│   ├── Today's skin summary card
│   ├── Recommended products (horizontal scroll)
│   └── Start Analysis CTA
│
├── /analyze (Camera — center tab)
│   ├── Photo upload (drag & drop / file select)
│   ├── Image preview
│   ├── Loading (Face detection → Skin analysis → Generating recommendations)
│   └── → /result
│
├── /result (Analysis Result)
│   ├── Face image with landmark overlay
│   ├── Skin condition radar chart (Redness, Tone, Brightness, Moisture, Trouble)
│   ├── Score cards (4 metrics)
│   ├── Recommended products list
│   ├── Recommendation reason (Claude API)
│   └── Save Results CTA (→ login prompt for guests)
│
├── /history (History)
│   ├── Calendar strip (days with analysis highlighted)
│   ├── Skin trend line chart
│   ├── Recent analysis cards
│   └── Empty state (CTA to first analysis)
│
├── /style (Style — Beta)
│   ├── Beta badge
│   ├── Coming soon hero
│   └── Feature preview cards
│       ├── Face shape analysis
│       ├── Hairstyle recommendations
│       └── Color palette suggestions
│
└── /profile (Profile)
    ├── Login prompt (1st semester shell)
    └── App settings
```

---

## 2. Navigation

### Mobile — Bottom Navigation Bar

| Tab | Icon | Route | Status |
|-----|------|--------|--------|
| Home | Grid | / | Active |
| History | Clock | /history | Active |
| Analyze | Camera (pink floating) | /analyze | Active |
| Style | Sparkle | /style | Beta |
| Profile | Person | /profile | Shell |

### Desktop — Top Header

| Element | Content |
|---------|---------|
| Left | project logo |
| Center | Home / History / Style |
| Right | Start Analysis button + Profile icon |

---

## 3. Key User Flows

### Flow 1: Guest Analysis
```
Home
  └→ Tap camera button
       └→ /analyze — upload photo
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

### Flow 3: Style Consultant (Beta Shell)
```
Home or bottom nav
  └→ /style — view coming soon page
       └→ "Get notified" CTA
```

---

## 4. Page Components

### Home (/)
- `<Header>` — logo + notification bell
- `<SkinSummaryCard>` — today's score, radar chart mini
- `<ProductCarousel>` — horizontal scroll, product cards
- `<AnalysisCTA>` — pink button
- `<BottomNav>`

### Analyze (/analyze)
- `<PageHeader>` — back arrow + title
- `<UploadZone>` — drag & drop, preview
- `<AnalysisButton>` — full width pink
- `<LoadingOverlay>` — step progress

### Result (/result)
- `<PageHeader>`
- `<FaceImageCard>` — image + landmark dots overlay
- `<RadarChart>` — 5-axis skin score (recharts or d3)
- `<ScoreCards>` — 4 metric cards
- `<ProductList>` — recommended product cards
- `<RecommendationReason>` — Claude API text
- `<SaveButton>`
- `<BottomNav>`

### History (/history)
- `<PageHeader>`
- `<CalendarStrip>` — horizontal scroll
- `<TrendChart>` — line chart
- `<AnalysisCardList>`
- `<EmptyState>`
- `<BottomNav>`