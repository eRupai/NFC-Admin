# NFC Writer Dashboard — Microarchitecture

## Overview

This project was refactored from a flat component structure into a **feature-based microarchitecture**. Every function and UI element is identical to the original — only the file organisation changed.

---

## Folder Structure

```
src/
├── App.jsx                        ← Root: reads ROUTES map, renders Sidebar + active page
│
├── layout/
│   └── Sidebar.jsx                ← Shell layout (desktop sidebar + mobile rail/drawer)
│
├── routes/
│   └── routes.jsx                 ← Central route map: id → page component
│
├── shared/
│   ├── components/
│   │   └── Topbar.jsx             ← Universal topbar used by every page
│   └── constants/
│       └── navConfig.js           ← NAV tree + MOBILE_RAIL arrays (Sidebar's data)
│
├── features/
│   └── dashboard/
│       ├── index.jsx              ← Dashboard container (assembles sub-components)
│       ├── data/
│       │   └── dashboardData.js   ← All static data: charts, cards, tooltips, stats
│       └── components/
│           ├── StatsBar.jsx       ← 5-stat summary row
│           ├── WriteNFCCard.jsx   ← Type-selector + advanced-options widget
│           ├── TapNFCCard.jsx     ← NFC scan animation + card info panel
│           ├── LiveAnalytics.jsx  ← Scan chart, locations, devices, recent activity
│           └── BottomSection.jsx  ← Recent cards, templates, quick actions, footer
│
└── pages/                         ← All 14 full-page views (unchanged logic)
    ├── Nfccardspage.jsx
    ├── WriteNFCCardPage.jsx
    ├── Rewritenfccardpage.jsx
    ├── Bulkoperationspage.jsx
    ├── Activitylogspage.jsx
    ├── Settingspage.jsx
    ├── Subscriptionpage.jsx
    ├── Leadsuserspage.jsx
    ├── Scananalyticspage.jsx
    ├── Apiintegrationspage.jsx
    ├── Nfctemplatespage.jsx
    ├── Walletcreditspage.jsx
    ├── Helpsupportpage.jsx
    └── Contactuspage.jsx
```

---

## Micro-boundaries

| Layer | What lives here | Rule |
|-------|----------------|------|
| `layout/` | Structural chrome (Sidebar) | No business logic |
| `routes/` | Route id → component map | One place to add/remove pages |
| `shared/components/` | Components used by 2+ features | No feature-specific imports |
| `shared/constants/` | Static config (nav structure) | Pure data, no JSX |
| `features/<name>/` | Self-contained feature slice | Each feature owns its data + components |
| `features/<name>/data/` | Static data and constants for that feature | No React, no imports from other features |
| `pages/` | Full-page views wired to a route | Import from `shared/` only |

---

## What changed vs the original

| Before | After |
|--------|-------|
| `src/components/Dashboard.jsx` (483 lines) | Split into 5 focused components + 1 data file |
| `src/components/Sidebar.jsx` (376 lines) | Moved to `layout/Sidebar.jsx`; nav data → `shared/constants/navConfig.js` |
| `src/components/Topbar.jsx` | Moved to `shared/components/Topbar.jsx` |
| `src/App.jsx` — 40-line switch statement | 15-line App that reads `routes/routes.jsx` map |
| `src/pages/*.jsx` — hardcoded Topbar path | Updated import path to `../shared/components/Topbar` |

---

## Adding a new page

1. Create `src/pages/MyNewPage.jsx`
2. Add one line to `src/routes/routes.jsx`: `"my-page": () => <MyNewPage />`
3. Add a nav entry to `src/shared/constants/navConfig.js`

No changes to `App.jsx` or `Sidebar.jsx` needed.
