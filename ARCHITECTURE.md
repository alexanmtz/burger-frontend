# Architecture — Burger Social Platform

## C4 Model: Context Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              System Context                                  │
│                                                                              │
│   ┌──────────┐       ┌──────────────────────────┐       ┌─────────────────┐ │
│   │  User    │ ────► │   Burger Social App      │ ────► │   Supabase      │ │
│   │(browser) │       │   (React SPA)            │       │   (auth +       │ │
│   └──────────┘       │                          │       │    storage)     │ │
│                      │   Hosted on Vercel        │       └─────────────────┘ │
│                      │   (global edge network)  │                            │
│                      │                          │       ┌─────────────────┐  │
│                      │                          │ ────► │   Burger        │  │
│                      └──────────────────────────┘       │   Backend APIs  │  │
│                                                         │   (microservices│  │
│                                                         │    — see below) │  │
│                                                         └─────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Actors**
- **User** — a burger enthusiast accessing the platform via browser or mobile web.
- **Burger Social App** — the React SPA documented here, deployed as a static site on Vercel.
- **Supabase** — managed backend providing authentication (email/password) and object storage for burger photos.
- **Burger Backend APIs** — set of microservices handling restaurants, reviews, and user data (out of scope; mocked via JSON Server locally).

---

## C4 Model: Container Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  Burger Social Platform                                                          │
│                                                                                  │
│  ┌─────────────────────────────────┐       ┌───────────────────────────────┐    │
│  │  React SPA                      │       │  Supabase (managed)           │    │
│  │  ──────────────────────────     │       │  ──────────────────────────── │    │
│  │  Vite 8 + React 19              │       │  Auth (email/password, JWT,   │    │
│  │  React Router v7                │ ────► │  session auto-refresh)        │    │
│  │  TanStack React Query v5        │       │                               │    │
│  │  CSS Modules + CSS vars         │       │  Storage bucket: burger-images│    │
│  │  TypeScript                     │       │  (direct upload from browser) │    │
│  │  Sonner (toast notifications)   │       └───────────────────────────────┘    │
│  │                                 │                                             │
│  │  Deployed to: Vercel            │       ┌───────────────────────────────┐    │
│  │  ─ static build (vite build)    │ ────► │  Burger Backend APIs          │    │
│  │  ─ served from Vercel edge      │       │  (microservices, future)      │    │
│  │  ─ automatic HTTPS + CDN        │       │  Proxied via json-server (dev)│    │
│  │  ─ preview deploys per PR       │       └───────────────────────────────┘    │
│  └─────────────────────────────────┘                                             │
│                                                                                  │
│  ┌─────────────────────────────────┐                                             │
│  │  JSON Server (dev only)         │                                             │
│  │  ──────────────────────────     │                                             │
│  │  Port 3001, file-based DB       │                                             │
│  │  Proxied via Vite: / →          │                                             │
│  │  localhost:3001                 │                                             │
│  └─────────────────────────────────┘                                             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## Cloud Hosting

The React SPA is deployed as a static site on **Vercel**.

### Why Vercel

| Concern | How Vercel addresses it |
|---|---|
| **Global delivery** | Edge network with 100+ PoPs — static assets served from the closest region |
| **HTTPS** | Automatic TLS certificate provisioning and renewal |
| **CI/CD** | Git-push deploys: every push to `main` triggers a production build; every PR gets a preview URL |
| **Zero-config** | Detects Vite automatically; no bucket policies, distribution configs, or origin access controls to manage |
| **Env vars** | Secrets set in Vercel dashboard, injected at build time as `VITE_*` vars |
| **Redirects / SPA routing** | A single `vercel.json` rewrite rule sends all paths to `index.html` (required for `BrowserRouter`) |

### Deployment flow

```
Developer pushes to GitHub
        │
        ▼
Vercel CI picks up commit
        │
        ├── npm run build   (tsc --noEmit + vite build → dist/)
        │
        └── dist/ uploaded to Vercel edge network
                │
                ▼
        https://burger-frontend-hazel.vercel.app/   (production)
        https://<branch>-burger-frontend.vercel.app  (preview)
```

### `vercel.json` (SPA routing)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Environment variables (production)

**Demo deployment (current)** — fully static, no backend required:
```
VITE_USE_MOCK_API=true
```

**Full deployment** — real auth + storage, backend microservices wired up:
```
VITE_USE_MOCK_API=false
VITE_USE_MOCK_AUTH=false
VITE_SUPABASE_URL=<project-url>      # set in Vercel dashboard
VITE_SUPABASE_ANON_KEY=<anon-key>   # set in Vercel dashboard
VITE_API_URL=<backend-url>           # set in Vercel dashboard
```

> In demo mode (`VITE_USE_MOCK_API=true`) `db.json` is bundled into the JS build at compile time. No JSON Server, no Supabase calls, no backend needed — the app runs entirely from the Vercel edge.

---

## Frontend Architecture

### Tech Stack

| Concern | Choice | Version |
|---|---|---|
| Framework | React | ^19.2.4 |
| Build tool | Vite | ^8.0.1 |
| Routing | React Router DOM | ^7.14.0 |
| Server state | TanStack React Query | ^5.96.2 |
| Auth + Storage | Supabase JS | ^2.101.1 |
| Toast notifications | Sonner | ^2.0.7 |
| Styling | CSS Modules + CSS custom properties | — |
| Language | TypeScript | ~5.9.3 |
| Testing | Vitest + Testing Library | ^4.1.2 / ^16.3.2 |
| Mock backend | JSON Server | ^1.0.0-beta.15 |

### Source Directory Layout

```
src/
├── api/
│   ├── auth/
│   │   ├── index.ts             # Factory — exports mock or Supabase connector
│   │   ├── types.ts             # AuthConnector interface, LoginPayload, SessionUser
│   │   ├── mock.ts              # Mock auth (localStorage JWT)
│   │   └── supabase.ts         # Supabase auth implementation
│   ├── client/
│   │   └── queryClient.ts       # React Query config (staleTime 2 min, 1 retry)
│   ├── connect/
│   │   └── api.ts               # apiFetch<T>() — entry point, delegates to provider
│   └── providers/               # Pluggable connector infrastructure
│       ├── index.ts             # Selects mock/http/supabase based on env vars
│       ├── types.ts             # FetchConnector & StorageConnector interfaces
│       ├── http/
│       │   └── fetchConnector.ts # HTTP fetch with Bearer token injection
│       ├── mock/
│       │   ├── fetchConnector.ts # Resolves queries from bundled db.json
│       │   └── storageConnector.ts # Returns placeholder image URL
│       └── supabase/
│           ├── client.ts         # Supabase client singleton
│           └── storageConnector.ts # Direct browser → Supabase Storage upload
│   └── resources/
│       ├── images.ts            # uploadImage() wrapper over StorageConnector
│       ├── restaurants.ts       # getRestaurants, getRestaurant, search, nearby
│       ├── reviews.ts           # CRUD reviews, feed, stats update
│       └── users.ts             # fetchUser(s)
├── assets/
│   └── hero-burguer.jpg
├── components/
│   ├── cards/
│   │   ├── BurgerReviewCard/    # Review card (image, scores, user + restaurant)
│   │   ├── RestaurantCard/      # Restaurant preview with skeleton loader
│   │   ├── RestaurantInfo/      # Contact / location links
│   │   └── OpeningHours/        # Per-day hours display
│   ├── forms/
│   │   ├── CreateReviewForm/    # Review form (burger name, caption, scores, image)
│   │   └── ImageUpload/         # Drag-drop image picker with preview
│   ├── layout/
│   │   ├── CardGrid/            # Generic grid with loading/empty states
│   │   └── Hero/                # Homepage banner with user greeting
│   ├── navigation/
│   │   ├── Navigation/          # Top nav, auth status, responsive hamburger menu
│   │   └── ProtectedRoute/      # Auth guard — redirects to /login
│   ├── score/
│   │   ├── StarRating/          # Interactive 1–5 star (maps to 0–10 scale)
│   │   └── ScoreBreakdown/      # Taste / texture / presentation scores
│   ├── sections/
│   │   ├── Feed/                # Review list (wraps CardGrid)
│   │   └── FeedControls/        # Sort toggle (recent | top)
│   └── typography/
│       └── Typography/PageTitle/ # Page heading with optional subtitle + controls
├── context/
│   ├── auth.ts                  # AuthContextValue type + AuthContext instance
│   └── AuthContext.tsx          # AuthProvider + session listener
├── hooks/
│   ├── auth/
│   │   └── useAuth.ts           # Reads AuthContextValue from context
│   ├── common/
│   │   ├── useGeolocation.ts    # Browser Geolocation API with permission state
│   │   └── useImageUpload.ts    # React Query mutation wrapping images.ts
│   ├── feed/
│   │   └── useFeed.ts           # Feed query (sort: recent | top)
│   ├── restaurants/
│   │   ├── useNearbyRestaurants.ts
│   │   ├── useRestaurant.ts
│   │   ├── useRestaurants.ts
│   │   └── useSearchRestaurants.ts
│   ├── reviews/
│   │   ├── useReviews.ts
│   │   ├── useSubmitReview.ts   # Mutation + cache invalidation
│   │   └── useUserReviews.ts
│   └── users/
│       ├── useUser.ts
│       └── useUsers.ts
├── pages/
│   ├── HomePage/                # Feed + hero
│   ├── LoginPage/               # Email/password sign-in
│   ├── DashboardPage/           # Profile + review history (protected)
│   ├── RestaurantDetailPage/    # Restaurant + reviews + stats
│   ├── RestaurantsPage/         # Searchable list + geolocation sort
│   ├── ReviewsPage/             # Full review feed
│   ├── SubmitReviewPage/        # Review creation (protected)
│   ├── NotFoundPage/            # 404
│   └── index.ts                 # Re-exports all pages
├── storage/
│   └── redirectAfterLogin.ts   # sessionStorage helper for post-login nav
├── tests/
│   ├── setup.ts                 # Vitest setup — imports jest-dom matchers
│   ├── isOpenNow.test.ts        # Opening hours logic (day ranges, parsing, closed)
│   ├── StarRating.test.tsx      # Component rendering and interaction
│   └── ProtectedRoute.test.tsx  # Auth guard redirect behaviour
├── types/
│   └── types.ts                 # Domain types: User, Restaurant, Review
├── utils/
│   └── time.ts                  # formatDate(), isOpenNow() (parses stored hours)
├── App.tsx                      # Root — wraps tree in QueryClientProvider + Toaster
├── App.css                      # App-level styles
├── Router.tsx                   # BrowserRouter, AuthProvider, all routes
├── index.css                    # Global CSS variables + utility classes
└── main.tsx                     # Entry point
```

### Key Patterns

**API Layer (`src/api/`)**

The API layer uses a **pluggable connector architecture** split into four concerns:

- `providers/` — Defines `FetchConnector` and `StorageConnector` interfaces. `providers/index.ts` selects the active implementation based on env vars and exports a single connector pair used by the rest of the app.
  - `mock/` — Resolves all requests from statically bundled `db.json`; storage returns a placeholder URL.
  - `http/` — Real HTTP fetch with `Authorization: Bearer` header injection from `localStorage`.
  - `supabase/` — Supabase Storage implementation for image uploads.
- `connect/api.ts` — `apiFetch<T>(path, options)` delegates to the active `FetchConnector`.
- `resources/` — Domain functions (`getRestaurants`, `submitReview`, etc.) built on `apiFetch`.
- `auth/` — Factory pattern: `auth/index.ts` exports either `mock.ts` or `supabase.ts` based on `VITE_USE_MOCK_AUTH`.

**Mock vs. real backend**

Three env vars combine to control which data sources are active:

| `VITE_USE_MOCK_API` | `VITE_USE_MOCK_AUTH` | Auth | Image storage | REST data |
|---|---|---|---|---|
| `false` | `false` | Supabase auth (JWT auto-refresh) | Supabase `burger-images` bucket | JSON Server via `/api` proxy |
| `false` | `true` | Mock JWT (localStorage) | Placeholder URL | JSON Server via `/api` proxy |
| **`true`** | any | Mock JWT (localStorage) | Placeholder URL | **`db.json` bundled at build — no network** |

When `VITE_USE_MOCK_API=true`, `apiFetch()` short-circuits to the mock `FetchConnector`, which resolves queries directly from the statically imported `db.json`. No JSON Server process is needed and the app works fully offline. This mode is used for the Vercel production demo.

**Auth flow**

```
Supabase mode                     Mock mode
─────────────────────────────     ──────────────────────────────────
signIn(email, pw)                 POST /api/auth/login
  → supabase.auth.signInWithPassword  → returns { token, user }
  → session auto-persisted            → stored in localStorage
  → onAuthStateChange listener         (burger_token, burger_user)
  → maps Supabase user → User type
```

`AuthProvider` subscribes to `authConnector.onSessionChange` to keep `user` + `token` in sync. `ProtectedRoute` reads `AuthContext`; if unauthenticated it stores the intended path in `sessionStorage` and redirects to `/login`. After sign-in the user is sent back to that path.

**Image upload flow (Supabase Storage)**

```
Browser                         Supabase Storage
  │                                     │
  │── supabase.storage.upload() ───────►│
  │◄─ { data, error } ─────────────────│
  │                                     │
  │── storage.getPublicUrl() ──────────►│
  │◄─ publicUrl ───────────────────────│
  │                                     │
  │── POST /api/reviews (publicUrl) ───► JSON Server / Backend API
```

The file goes directly from the browser to Supabase Storage. The REST API only stores the resulting public URL. In mock mode `StorageConnector` returns a hardcoded placeholder URL.

**Server state (`TanStack React Query`)**

All data fetching and mutations go through React Query hooks (`src/hooks/`). Configuration: 2-minute `staleTime`, refetch-on-window-focus disabled, 1 retry. `useSubmitReview` invalidates the relevant query keys on success so the feed and restaurant stats refresh automatically.

**Routing**

```
BrowserRouter
  AuthProvider
    Navigation (global)
    Toaster (Sonner)
    Routes
      /                          → HomePage
      /reviews                   → ReviewsPage
      /restaurants               → RestaurantsPage
      /restaurants/:id           → RestaurantDetailPage
      /restaurants/:id/review    → SubmitReviewPage (ProtectedRoute)
      /submit                    → SubmitReviewPage (ProtectedRoute)
      /login                     → LoginPage
      /dashboard                 → DashboardPage (ProtectedRoute)
      *                          → NotFoundPage
```

**CSS architecture**

Global design tokens live in `src/index.css` as CSS custom properties:

- **Colour palette:** dark background (`#111110`), amber brand accent (`--color-amber`, `--color-amber-dim`, `--color-amber-glow`), surface/border/text scales, semantic states (`--color-error`, `--color-success`, `--color-open`, `--color-closed`)
- **Typography:** Playfair Display (headings, `--font-display`), DM Sans (body, `--font-body`) — loaded from Google Fonts
- **Spacing scale:** `--space-1` (4px) → `--space-8` (64px)
- **Border radii:** `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`
- **Shadows:** `--shadow-card`, `--shadow-hover`, `--shadow-amber`
- **Transitions:** `--transition-fast` (150ms), `--transition-base` (250ms), `--transition-slow` (400ms)
- **Global utility classes:** `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-danger`, `.form-*`, `.card`, `.badge`, `.badge-open`, `.badge-closed`, `.badge-amber`, `.score-circle`, `.skeleton`, `.glass`, `.empty-state`, `.animate-fade-in-up`, `.animate-fade-in`, `.stagger`, `.text-muted`, `.text-amber`

Each component uses a co-located CSS Module for scoped overrides.

**Path alias**

`@` resolves to `./src` (configured in `vite.config.ts`), enabling clean imports like `import { useAuth } from '@/hooks/auth/useAuth'`.

---

## Development Setup

**Scripts**

| Command | Effect |
|---|---|
| `npm run dev` | Vite dev server (HMR, `/api` proxy to port 3001) |
| `npm run server` | JSON Server on port 3001 (mock REST backend) |
| `npm run build` | `tsc --noEmit` + `vite build` |
| `npm run preview` | Serve production build locally |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` / `format:check` | Prettier |
| `npm run test` | Vitest (jsdom environment) |

**Environment variables**

```
VITE_USE_MOCK_API=false
VITE_USE_MOCK_AUTH=false
VITE_SUPABASE_URL=<your-project-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_API_URL=http://localhost:3001   # unused at runtime, proxy handles routing
```

---

## Testing

**Stack:** Vitest 4.1 + Testing Library React 16 + jsdom

`src/tests/setup.ts` imports `@testing-library/jest-dom` to extend Vitest matchers.

Current test coverage:

| File | Coverage |
|---|---|
| `isOpenNow.test.ts` | `isOpenNow()` utility — day-range parsing, time parsing, closed detection |
| `StarRating.test.tsx` | Component rendering and interactive star selection |
| `ProtectedRoute.test.tsx` | Auth guard redirect behaviour |

---

## Limitations & Trade-offs

| Area | Current state | Better path |
|---|---|---|
| **Mock JWT** | `mock-jwt-token-${email}` string — not a real JWT | Replace with Supabase auth entirely |
| **Image upload** | Stubbed in mock mode — returns a placeholder URL | Wire up Supabase Storage fully or a presigned-URL endpoint on the backend |
| **Distance calc** | Flat-earth approximation | Haversine formula |
| **Real-time** | Feed is request-driven, not pushed | Supabase Realtime or SSE for live like counts |
| **Offline** | No service worker | PWA + cache strategy |
| **localStorage JWT** | XSS risk in mock mode | `httpOnly` cookie once on a real auth server |
