# Architecture — Burger Social Platform

## C4 Model: Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         System Context                                  │
│                                                                         │
│   ┌──────────┐         ┌─────────────────────┐       ┌───────────────┐ │
│   │  User    │ ──────► │  Burger Social App  │ ────► │  AWS S3       │ │
│   │(browser/ │         │  (React SPA)        │       │  (image store)│ │
│   │ mobile)  │         │                     │       └───────────────┘ │
│   └──────────┘         │  Hosted on AWS      │                         │
│                        │  CloudFront + S3    │       ┌───────────────┐ │
│                        │                     │ ────► │  Burger       │ │
│                        │                     │       │  Backend      │ │
│                        └─────────────────────┘       │  (Microsvcs)  │ │
│                                                       └───────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Actors**
- **User** — a burger enthusiast accessing the platform via browser (desktop or mobile) or a native mobile app in the future.
- **Burger Social App** — the React SPA documented here.
- **Burger Backend** — a set of microservices (see below) providing the REST API.
- **AWS S3** — object storage for user-uploaded burger photos.

---

## C4 Model: Container Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Burger Social Platform                                                     │
│                                                                             │
│  ┌──────────────────────────────┐       ┌───────────────────────────────┐  │
│  │  React SPA                   │       │  API Gateway (AWS API GW)     │  │
│  │  ─────────────────           │       │  ──────────────────────────── │  │
│  │  Vite + React 19             │       │  TLS termination, rate limit, │  │
│  │  React Router (client-side)  │ ────► │  JWT validation, routing to   │  │
│  │  CSS Modules + CSS variables │       │  microservices                │  │
│  │                              │       └──────────────┬────────────────┘  │
│  │  Hosted: CloudFront + S3     │                      │                   │
│  └──────────────────────────────┘           ┌──────────▼──────────┐        │
│                                             │  Microservices       │        │
│  ┌──────────────────────────────┐           │  ─────────────────   │        │
│  │  AWS S3 (image bucket)       │           │  Auth Service        │        │
│  │  ─────────────────────────── │ ◄──────── │  Restaurant Service  │        │
│  │  Pre-signed URL upload flow  │           │  Review Service      │        │
│  │  Public CDN read via         │           │  User Service        │        │
│  │  CloudFront                  │           │                      │        │
│  └──────────────────────────────┘           │  (AWS Lambda/ECS)    │        │
│                                             └──────────┬───────────┘        │
│  ┌──────────────────────────────┐                      │                   │
│  │  Database layer              │ ◄────────────────────┘                   │
│  │  ──────────────────────────  │                                           │
│  │  PostgreSQL (RDS)            │                                           │
│  │  ElastiCache (Redis) —       │                                           │
│  │    feed caching, sessions    │                                           │
│  └──────────────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Tech Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | React 19 | Component model, ecosystem, concurrent features |
| Build tool | Vite 8 | Sub-second HMR, native ESM, fast cold starts |
| Routing | React Router v7 | Declarative, file-route ready, loader pattern |
| Styling | CSS Modules + CSS custom properties | Zero runtime, scoped, themeable without a heavy library |
| Language | TypeScript | Type safety across the API boundary, better DX |
| State | React context + local state | Proportionate — no global store needed at this scale |

### Key patterns

**API Layer (`src/services/api.ts`)**
All API calls are defined in one file. A flag (`VITE_USE_REAL_API`) switches between the mock implementation (stubbed locally) and the real backend. This means the app can be demoed offline and the integration can be turned on with a single env var.

**Auth flow**
JWT is stored in `localStorage`, injected into every request via `authHeaders()`. `AuthContext` restores the session on load. `ProtectedRoute` wraps any route that requires authentication and preserves the original destination for post-login redirect.

**Image upload (S3 pre-signed URL flow)**
```
Browser                     API                       S3
  │                          │                         │
  │── POST /upload-url ──────►│                         │
  │◄─ { uploadUrl, pubUrl } ──│                         │
  │                          │                         │
  │── PUT uploadUrl (file) ──────────────────────────► │
  │◄─ 200 OK ────────────────────────────────────────── │
  │                          │                         │
  │── POST /reviews (pubUrl) ►│                         │
```
The image never passes through the backend API — it goes straight to S3. This keeps the backend stateless and dramatically reduces API server load for media.

---

## Backend Microservices (reflections)

The backend is out of scope but the frontend is designed around this assumed service topology:

| Service | Responsibility | Stack suggestion |
|---|---|---|
| **Auth Service** | Login, JWT issue/refresh, logout | Node.js / AWS Cognito |
| **Restaurant Service** | CRUD for restaurants, search, geospatial queries | Node.js + PostGIS (lat/lng) |
| **Review Service** | Submit/fetch reviews, like toggle, feed aggregation | Node.js + Redis (feed cache) |
| **User Service** | Profiles, avatar upload, review history | Node.js |
| **Media Service** | Pre-signed S3 URL generation, CDN invalidation | Lambda function |

All services sit behind **AWS API Gateway** which handles:
- TLS termination
- JWT validation (shared secret / JWKS)
- Rate limiting per user/IP
- Request routing

---

## Cloud Hosting

```
User → Route 53 (DNS)
     → CloudFront (CDN, edge cache, HTTPS)
     → S3 (SPA static files — index.html + JS/CSS bundles)

User → CloudFront → API Gateway → Lambda/ECS services → RDS PostgreSQL
                                                       → ElastiCache Redis
                              → S3 (burger photos, via pre-signed URLs)
```

**Why CloudFront + S3 for the SPA?**
- Zero server to manage for static assets
- Global edge caching — fast load anywhere
- Cache-bust via content-hashed filenames (Vite handles this)
- `index.html` served with `Cache-Control: no-cache` so deploys propagate immediately

---

## Security Considerations

| Area | Decision |
|---|---|
| **Auth tokens** | JWTs stored in `localStorage`. Trade-off: XSS risk vs. cookie complexity (CSRF). For a higher-security version: `httpOnly` cookies + CSRF tokens. |
| **Image uploads** | Pre-signed S3 URLs expire in 5 minutes. The backend never touches the binary. File type is validated client-side and server-side via content inspection (not just extension). |
| **Geolocation** | Coordinates are used only client-side for sorting. Never sent to analytics or stored server-side without explicit consent. Documented in `useGeolocation.ts`. |
| **API rate limiting** | Applied at API Gateway — prevents review spam and like-farming. |
| **Content moderation** | Out of scope for v1 but S3 supports triggering a Lambda on upload for AWS Rekognition moderation. |
| **HTTPS** | Enforced everywhere — CloudFront redirects HTTP → HTTPS. |
| **No third-party data leakage** | Unsplash images are used in demo only. Production would serve all images via the S3/CloudFront CDN under our own domain. |

---

## Scalability

| Bottleneck | Mitigation |
|---|---|
| **Social feed queries** | Redis cache for the top-N feed. Invalidated on new review submission. |
| **Image reads** | CloudFront CDN — images served from edge, not origin. |
| **Geospatial search** | PostGIS index on `(lat, lng)`. Alternative: Elasticsearch geo-distance query for full-text + geo combined. |
| **Review write throughput** | Review Service behind an SQS queue if write volume spikes — decouple submission from DB write. |
| **Frontend bundle size** | Vite vendor chunk splitting separates React from app code. Route-based code splitting can be added with `React.lazy()` per page. |

---

## Limitations & Trade-offs

- **No real-time updates** — the feed is polled, not pushed. WebSocket or Server-Sent Events would enable live like counts.
- **No offline support** — a Service Worker + cache strategy would enable PWA behaviour.
- **localStorage JWT** — acceptable for a demo; production should evaluate `httpOnly` cookie approach.
- **Mock geolocation distance** — the distance calculation uses a flat-earth approximation; production should use the Haversine formula or PostGIS `ST_DWithin`.
