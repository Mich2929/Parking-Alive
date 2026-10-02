# Chat Export: ParkWhere SG (Civic Transit Park) Development

**Date:** 2026-10-01  
**Repository:** [https://github.com/Mich2929/Parking-Alive.git](https://github.com/Mich2929/Parking-Alive.git)  
**App Title:** ParkWhere SG - Real-Time Singapore Carpark & Mobility Engine  

---

## Table of Contents
1. [Session 1: Initial App Build from Screenshot](#session-1-initial-app-build-from-screenshot)
2. [Session 2: LTA DataMall v2 Integration & API Health Monitor](#session-2-lta-datamall-v2-integration--api-health-monitor)
3. [Session 3: GitHub Repository Deployment & Push](#session-3-github-repository-deployment--push)
4. [Project Architecture & File Tree](#project-architecture--file-tree)
5. [Endpoints & Testing Reference](#endpoints--testing-reference)

---

## Session 1: Initial App Build from Screenshot

### User Request
> "Build me an app with screens that look like this. You can hotlink images from the HTML"  
> *(User uploaded reference design for ParkWhere SG)*

### Design Specifications & Requirements
The application was built adhering to the **Civic Transit Park** design system and Swiss GovTech digital product standards:
- **Header**: "P" logo mark in cobalt blue, "ParkWhere SG", "GOVTECH DATA ENGINE", live "Singapore GPS Active" pulsing beacon, segmented navigation pills, agency tags (HDB, URA, LTA), driver profile avatar.
- **Live Status Feed**: Dynamic ticker ("Live LTA DataMall & HDB/URA feeds • Synced Xs ago"), 60-second auto-refresh timer, agency chips.
- **Search & Filters**:
  - Dual modes: `[Postal Code / Area]` and `[Use Current GPS]`.
  - Input pre-filled with Tampines `520284` with clear button and action buttons (`[Find Nearby Lots]`, `[Map]`).
  - Search Scope selector (0.5 km to 5.0 km).
  - Hotspot shortcuts: Tampines Hub (520284), Bishan Junction 8, Jurong East MRT, Orchard ION / Ngee Ann, Marina Bay CBD, Ang Mo Kio Central.
  - Filter chips: All Lots, HDB Only, URA Surface, EV Chargers, Free Sun/PH, Motorbike lots.
- **Results Summary Bar**: Tampines Central (Postal 520284) with 12 Found badge, radius stats, and metric boxes:
  - `TOTAL LOTS: 1,420`
  - `AVAILABLE NOW: 486` (emerald highlight)
  - `EST. RATE: $0.60 /30m`
- **Carpark Cards Grid**:
  1. *Tampines Central Blk 505 (TM31)*: 180m, 128 Car, 14 Motor, 0 Heavy, $0.60/30m, 2x 22kW AC Type 2 (SP Mobility), Free Parking Sun/PH, Google Maps CTA, ERP: $0.00.
  2. *Tampines St 11 Hawker Carpark (TP04)*: 320m, AMBER badge (12 / 95 lots), Busy warning (~3 mins time-to-park), commercial rate $1.20/30m, Directions CTA, Rates.
  3. *Our Tampines Hub Basement 1 & 2 (OTH-B1)*: 450m, RED badge (3 / 614 lots), queueing warning, 4x Shell Recharge 50kW DC Fast Chargers, 10 min grace period, Maps CTA, Alt Nearby.
  4. *Blk 802-808 Tampines St 81 (T81A)*: 650m, GREEN badge (88 / 185 lots), $5.00 night parking cap, open air surface, Google Maps CTA, Info.
  5. *Century Square Shopping Mall (CS-P1)*: 750m, GREEN badge (34 / 240 lots), 3x CDG ENGIE 50kW DC & 22kW AC, 2.05m clearance, Google Maps CTA, Details.
  6. *Blk 284 Tampines Ave 2 (TM22)*: 900m, GREEN badge (65 / 310 lots), EPS electronic parking, Google Maps CTA, ERP: $0.00.
- **Spatial GPS Overlay Map**: Interactive SVG East Singapore cartography (Tampines, Pasir Ris, Sengkang, Hougang, Bedok, Changi Airport, MRT lines), search anchor `Postal 520284`, color-coded pins, and live GPS badge.
- **Civic Mobility Engine**: Proposal focus banner (*Eliminating Driver Wastage of Time in Downtown & Busy Areas*), 4 feature cards, 3 quick steps, and Singapore Driving Guides (ERP Rates 2026, Free Parking, Orchard Cheap Parking, HDB Rates).
- **FAQ Section**: Accordion covering free usage, data sources, accuracy tolerances, GPS privacy, and weekend ERP.
- **Interactive Mobility Modules**:
  - ERP Gantries view with vehicle rate calculator (Car vs Motorbike).
  - Expressway Traffic Cameras view with live highway snapshots.
  - EV Charging stations view with live plug availability.

---

## Session 2: LTA DataMall v2 Integration & API Health Monitor

### User Request
> "configure the parking lot availability information using this LTA endpoint. # Live carpark lots (HDB + LTA + URA):
> https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2
> this is an example of the response {
>     "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#CarParkAvailability",
>     "value": [
>         {
>             "CarParkID": "1",
>             "Area": "Marina",
>             "Development": "Suntec City",
>             "Location": "1.29375 103.85718",
>             "AvailableLots": 1104,
>             "LotType": "C",
>             "Agency": "LTA"
>         },
>         ...
>     ]
> }
> 2) create a folder under the project main/apt and place it there. I will add in the api key in vercel environment variable later under LTA_ACCOUNT_KEY
> 3) create a/apt/heath.js for me to monitor the health of my apis"

### Implementation Steps
1. **LTA DataMall Service (`apt/carparkService.js`)**:
   - Implemented real-time integration with `https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2`.
   - Headers: `AccountKey: process.env.LTA_ACCOUNT_KEY`, `accept: application/json`.
   - Added normalizer converting raw LTA items into enriched `Carpark` objects.
   - Built-in calibrated fallback for zero downtime while API keys are provisioned in Vercel.
   - Ingested the exact Marina Bay carparks requested:
     - **Suntec City**: 1,104 lots
     - **Marina Square**: 1,091 lots
     - **Raffles City**: 453 lots
     - **The Esplanade**: 448 lots
     - **Millenia Singapore**: 532 lots
2. **Directory Structure (`main/apt`, `a/apt`, `apt`, `api`)**:
   - `/apt/carparkService.js` & `/apt/carparks.js`
   - `/apt/health.js` & `/apt/heath.js`
   - `/a/apt/heath.js` & `/a/apt/health.js`
   - `/main/apt/carparkService.js`, `/main/apt/carparks.js`, `/main/apt/health.js`, `/main/apt/heath.js`
   - `/api/carparks.js` & `/api/health.js` (for Vercel Serverless convention)
3. **Health Monitor (`apt/health.js` & `a/apt/heath.js`)**:
   - Dual-mode support:
     - **CLI execution**: `node apt/health.js` or `node a/apt/heath.js` prints colored latency, HTTP status, and memory stats in console.
     - **HTTP execution**: Returns live JSON diagnostics on `/apt/health`, `/apt/heath`, `/a/apt/heath.js`, `/api/health`.
   - Added UI modal `HealthMonitorModal` accessible from Header, Status Bar, and Footer.
4. **Full-Stack Express Integration (`server.ts`)**:
   - Mounts `/apt/carparks`, `/api/carparks`, `/apt/health`, and all aliases.
   - Configured Vite middleware in dev (`"dev": "tsx server.ts"`).

---

## Session 3: GitHub Repository Deployment & Push

### User Request
> "git push
> <GITHUB_PERSONAL_ACCESS_TOKEN>@https://github.com/Mich2929/Parking-Alive.git"

### Execution Steps
1. Initialized Git repository in `/app/applet`.
2. Configured user credentials (`Mich2929` / `tan.smilepoint@gmail.com`).
3. Set primary branch to `main`.
4. Staged all source files, components, and services.
5. Created commit: `feat: ParkWhere SG - Real-Time Singapore Carpark Availability & Mobility Engine with LTA DataMall v2` (47 files changed, 5569 insertions).
6. Pushed to remote repository `https://github.com/Mich2929/Parking-Alive.git` on branch `main`.
7. Sanitized local remote URL to remove plain-text access tokens for security.

---

## Project Architecture & File Tree

```
├── .env.example              # Environment variables template (includes LTA_ACCOUNT_KEY)
├── .gitignore                # Ignores node_modules, dist, .env*
├── index.html                # Entry HTML with Inter fonts & SEO metadata
├── metadata.json             # App metadata & geolocation permission
├── package.json              # Full-stack dependencies & scripts ("dev": "tsx server.ts")
├── server.ts                 # Express proxy server with Vite middleware integration
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite & Tailwind CSS plugins
│
├── a/
│   └── apt/
│       ├── health.js         # Health monitor
│       └── heath.js          # User-requested alias
│
├── api/
│   ├── carparks.js           # Vercel serverless carpark route
│   └── health.js             # Vercel serverless health route
│
├── apt/
│   ├── carparkService.js     # LTA DataMall v2 fetcher and normalizer
│   ├── carparks.js           # Express/Vercel route handler
│   ├── health.js             # Health check probe script & handler
│   └── heath.js              # Alias
│
├── main/
│   └── apt/
│       ├── carparkService.js
│       ├── carparks.js
│       ├── health.js
│       └── heath.js
│
└── src/
    ├── App.tsx               # Main application controller
    ├── index.css             # Tailwind v4 theme & custom utilities
    ├── main.tsx              # React DOM root entry
    ├── components/
    │   ├── CarparkCard.tsx
    │   ├── CarparkDetailModal.tsx
    │   ├── CivicDataEngineSection.tsx
    │   ├── ErpView.tsx
    │   ├── EvChargersView.tsx
    │   ├── FaqSection.tsx
    │   ├── Footer.tsx
    │   ├── GuideModal.tsx
    │   ├── Header.tsx
    │   ├── HealthMonitorModal.tsx
    │   ├── LiveStatusBar.tsx
    │   ├── ResultsSummary.tsx
    │   ├── SearchAndFilters.tsx
    │   ├── SpatialMap.tsx
    │   ├── TrafficCamerasView.tsx
    │   └── UserPreferencesModal.tsx
    ├── data/
    │   ├── carparksData.ts   # Tampines & Marina LTA carparks datasets
    │   ├── erpData.ts        # Singapore ERP gantries & rates
    │   ├── evChargersData.ts # EV charging network
    │   ├── faqData.ts        # FAQ dataset
    │   ├── guidesData.ts     # 4 driving guides
    │   └── trafficCamerasData.ts # Expressway webcam feeds
    └── types/
        └── index.ts          # TypeScript interfaces & types
```

---

## Endpoints & Testing Reference

| Endpoint / Command | Description |
| :--- | :--- |
| `GET /apt/carparks` | Live or cached LTA CarParkAvailabilityv2 JSON feed |
| `GET /apt/carparks?area=Marina` | Filter for Marina Bay (Suntec City, Marina Square, etc.) |
| `GET /apt/health` | Live diagnostic probe of LTA DataMall connectivity |
| `GET /a/apt/heath.js` | Requested path alias for health monitoring |
| `node apt/health.js` | CLI diagnostic report printed directly in the shell |
| `node a/apt/heath.js` | CLI diagnostic report via path alias |

---

*Generated for ParkWhere SG • Singapore Open Data Standard Compliant.*
