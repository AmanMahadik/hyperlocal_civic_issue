# Hyperlocal Civic Reporter – PCMC Region

## 1. Project Overview

**Project Name:** Hyperlocal Civic Reporter (working title)
**Region Scope:** Pimpri-Chinchwad Municipal Corporation (PCMC) area — ward-level granularity
**Goal:** A citizen-facing platform where residents can report civic issues (garbage, potholes, broken infrastructure, etc.) with photo + geolocation, track resolution status, and allow PCMC/admin staff to view, prioritize, and resolve them ward-wise.

**Tech Stack (MERN):**
- **M**ongoDB – primary datastore (geospatial queries via `2dsphere` index)
- **E**xpress.js – REST API layer
- **R**eact.js (Vite) – citizen web app + admin dashboard
- **N**ode.js – runtime for API server
- Supporting: Cloudinary/S3 (image storage), JWT (auth), Mapbox/Leaflet + OpenStreetMap (maps), Socket.io (optional real-time status updates)

---

## 2. Problem Statement

Citizens in the PCMC region lack a single, simple channel to report localized civic problems and track whether authorities act on them. Existing complaint systems (PCMC's own portal, PMC Sarathi, phone lines) are fragmented, slow, and lack transparency. This app aims to:
- Make reporting as easy as "click a photo, drop a pin, submit"
- Make issue status public and trackable (accountability)
- Cluster/heatmap issues by ward to help PCMC prioritize

---

## 3. Civic Issue Categories (Master List)

Use this as the seed data for the `Category` collection.

| Category Code | Category Name | Examples / Sub-types |
|---|---|---|
| `GARBAGE` | Garbage & Waste | Garbage dumped in public place, overflowing bin, uncollected waste, burning of garbage |
| `ROAD` | Road Damage | Pothole, broken road, uneven road, missing manhole cover, road cave-in |
| `STREETLIGHT` | Streetlight Issues | Non-functional streetlight, flickering light, damaged pole |
| `WATER_SUPPLY` | Water Supply | No water supply, low pressure, contaminated water, pipeline leakage |
| `DRAINAGE` | Drainage & Sewage | Open drain, overflowing sewage, blocked stormwater drain, waterlogging |
| `ENCROACHMENT` | Illegal Encroachment | Footpath encroachment, illegal hawkers, unauthorized construction |
| `TREE` | Tree & Greenery | Fallen tree/branch, tree trimming needed, dead tree posing risk |
| `STRAY_ANIMALS` | Stray Animals | Stray dog menace, cattle on road, animal carcass not removed |
| `TRAFFIC` | Traffic & Signals | Broken traffic signal, missing signage, faded zebra crossing |
| `FOOTPATH` | Footpath/Pedestrian | Broken footpath, missing footpath, obstruction |
| `PUBLIC_TOILET` | Public Toilets | Unhygienic public toilet, non-functional toilet, no water in toilet |
| `POLLUTION` | Pollution | Air pollution (dust/smoke), noise pollution, water body pollution |
| `MOSQUITO` | Public Health Hazard | Mosquito breeding spot, stagnant water, unhygienic public space |
| `ILLEGAL_CONSTRUCTION` | Illegal Construction | Unauthorized building activity, debris on road |
| `PARK` | Public Park/Garden | Damaged park equipment, unmaintained garden |
| `OTHER` | Other | Anything not covered above (free-text + category suggestion) |

Each category should also store: `icon`, `default_priority`, `sla_days` (expected resolution time), `department_tag` (e.g., Solid Waste Mgmt, Road Dept, Water Dept — PCMC has department-wise ownership).

---

## 4. User Roles

| Role | Description |
|---|---|
| `citizen` | Reports issues, upvotes, comments, tracks status |
| `admin` | PCMC staff — views ward-wise dashboard, assigns/updates status |
| `super_admin` | Manages categories, wards, admins, analytics |
| (optional) `field_agent` | Ground staff who mark issues resolved with proof photo |

---

## 5. Core Features

### Citizen App
- Sign up/login (phone OTP or email)
- Report issue: category, description, photo(s), auto/manual geolocation, ward auto-detect
- View nearby issues on map (heatmap + pins)
- Upvote/"me too" on existing issue instead of duplicate reporting
- Comment on issue
- Track status: `Reported → Acknowledged → In Progress → Resolved → Reopened`
- Notifications on status change
- Public leaderboard: most active wards / most resolved issues

### Admin Dashboard
- Ward-wise issue list & map view
- Filter by category, status, date, priority
- Assign to department/field agent
- Update status + add resolution photo/remarks
- Analytics: issues per ward, avg resolution time, category-wise trends
- Export reports (CSV/PDF)

### Shared
- Duplicate detection (geo-radius + category match within N meters)
- SLA breach flagging (auto-escalate if not resolved in X days)

---

## 6. Database Schema (MongoDB Collections)

### `users`
```
{
  _id, name, email, phone, passwordHash,
  role: "citizen" | "admin" | "super_admin" | "field_agent",
  ward: String,
  createdAt
}
```

### `categories`
```
{
  _id, code, name, icon, department_tag, sla_days, default_priority
}
```

### `wards` (PCMC ward master data)
```
{
  _id, wardNumber, wardName, zone, boundaryGeoJSON
}
```

### `issues`
```
{
  _id,
  title, description,
  category: ObjectId -> categories,
  reportedBy: ObjectId -> users,
  location: { type: "Point", coordinates: [lng, lat] },  // 2dsphere index
  address, ward: ObjectId -> wards,
  images: [String],
  status: "reported" | "acknowledged" | "in_progress" | "resolved" | "reopened",
  priority: "low" | "medium" | "high" | "critical",
  upvotes: [ObjectId -> users],
  assignedTo: ObjectId -> users,
  resolutionImage: String,
  resolutionRemark: String,
  statusHistory: [{ status, changedBy, changedAt, note }],
  createdAt, updatedAt
}
```

### `comments`
```
{ _id, issue: ObjectId -> issues, user: ObjectId -> users, text, createdAt }
```

---

## 7. Suggested API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/categories
GET    /api/wards

POST   /api/issues                → create issue
GET    /api/issues                → list (filters: category, ward, status, near[lat,lng,radius])
GET    /api/issues/:id
PATCH  /api/issues/:id/status     → admin only
POST   /api/issues/:id/upvote
POST   /api/issues/:id/comments
GET    /api/issues/:id/comments

GET    /api/admin/analytics/ward-summary
GET    /api/admin/analytics/category-trends
```

---

## 8. Suggested Folder Structure

```
civic-reporter/
├── client/                # React app (citizen + admin, or split into two apps)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/api.js
│   │   └── context/
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/        # auth, error handling, upload
│   ├── config/            # db, cloudinary
│   └── server.js
├── shared/                # constants like category list, ward list
└── master.md
```

---

## 9. MVP Scope (Phase 1)

1. Citizen auth + issue reporting (photo + geotag + category)
2. Map view of all reported issues (Leaflet + OSM, no API cost)
3. Admin login + status update
4. Basic upvote/duplicate check
5. Ward auto-tagging using PCMC ward boundary GeoJSON (point-in-polygon)

## 10. Future Scope

- WhatsApp bot integration for reporting
- Integration with actual PCMC grievance API (if available)
- AI-based auto-categorization from photo
- Gamification (civic points, badges)
- Multi-language support (Marathi/Hindi/English)

---

*This file is meant to be the single source of truth for scope, schema, and categories — update it as the project evolves.*