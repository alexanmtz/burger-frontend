# Architecture — Burger Social Platform

## C4 Model: Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         System Context                                  │
│                                                                         │
│   ┌──────────┐         ┌─────────────────────┐       ┌───────────────┐ │
│   │  User    │ ──────► │  Burger Social App  │ ────► │  Supabase     │ │
│   │(browser) │         │  (React SPA)        │       │  (auth +      │ │
│   └──────────┘         │                     │       │   storage)    │ │
│                        │  Vite dev server /  │       └───────────────┘ │
│                        │  static build       │                         │
│                        │                     │       ┌───────────────┐ │
│                        │                     │ ────► │  JSON Server  │ │
│                        └─────────────────────┘       │  (mock REST   │ │
│                                                       │   backend,    │ │
│                                                       │   dev only)   │ │
│                                                       └───────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Actors**
- **User** — a burger enthusiast accessing the platform via browser.
- **Burger Social App** — the React SPA documented here.
- **Supabase** — managed backend providing authentication (email/password) and object storage for burger photos.
- **JSON Server** — local mock REST API (`localhost:3001`) used during development when `VITE_USE_SUPABASE=false`.

---

## C4 Model: Container Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Burger Social Platform                                                     │
│                                                                             │
│  ┌──────────────────────────────┐       ┌───────────────────────────────┐  │
│  │  React SPA                   │       │  Supabase (managed)           │  │
│  │  ─────────────────           │       │  ──────────────────────────── │  │
│  │  Vite 8 + React 19           │       │  Auth (email/password, JWT,   │  │
│  │  React Router v7             │ ────► │  session auto-refresh)        │  │
│  │  TanStack React Query v5     │       │                               │  │
│  │  CSS Modules + CSS vars      │       │  Storage bucket: burger-images│  │
│  │  TypeScript                  │       │  (direct upload from browser) │  │
│  └──────────────────────────────┘       └───────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────┐                                           │
│  │  JSON Server (dev only)      │                                           │
│  │  ─────────────────────────── │                                           │
│  │  Port 3001, file-based DB    │                                           │
│  │  Proxied via Vite: /api →    │                                           │
│  │  localhost:3001              │                                           │
│  └──────────────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

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
| Styling | CSS Modules + CSS custom properties | — |
| Language | TypeScript | ~5.9.3 |
| Testing | Vitest + Testing Library | ^4.1.2 / ^16.3.2 |
| Mock backend | JSON Server | ^1.0.0-beta.15 |

### Source Directory Layout

```
src/
├── api/
│   ├── auth/
│   │   └── supabase.ts          # Supabase client (session persist, auto-refresh)
│   ├── client/
│   │   └── queryClient.ts       # React Query client config
│   ├── connect/
│   │   ├── api.ts               # Base apiFetch() — reads JWT, adds auth header
│   │   ├── auth.ts              # Mock sign-in/sign-out endpoints
│   │   └── user.ts              # Current user from localStorage / JSON Server
│   └── resources/
│       ├── images.ts            # Image upload (Supabase Storage real, S3 mocked)
│       ├── restaurants.ts       # getRestaurants, getRestaurant, search, nearby
│       ├── reviews.ts           # CRUD reviews, feed, stats update
│       └── users.ts             # fetchUser(s)
├── components/
│   ├── BurgerReviewCard/        # Review card (fetches user + restaurant)
│   ├── CardGrid/                # Generic grid with loading/empty states
│   ├── CreateReviewForm/        # Review form with image upload integration
│   ├── Feed/                    # Review list (wraps CardGrid)
│   ├── FeedControls/            # Sort toggle (recent | top)
│   ├── Hero/                    # Homepage banner
│   ├── ImageUpload/             # Drag-drop image picker with preview
│   ├── Navigation/              # Top nav, auth status, mobile menu
│   ├── OpeningHours/            # Hours display
│   ├── ProtectedRoute/          # Auth guard — redirects to /login
│   ├── RestaurantCard/          # Restaurant preview with distance
│   ├── RestaurantInfo/          # Contact / location links
│   ├── ScoreBreakdown/          # Taste / texture / presentation scores
│   ├── StarRating/              # Interactive 1–5 star (maps to 0–10 scale)
│   └── Typography/PageTitle/    # Page heading with optional subtitle + controls
├── context/
│   ├── AuthContext.tsx          # AuthProvider + useAuth hook
│   └── auth.ts                  # AuthContextValue type
├── hooks/
│   ├── useAuth.ts
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
│   └── NotFoundPage/            # 404
├── storage/
│   └── redirectAfterLogin.ts   # sessionStorage helper for post-login nav
├── tests/
│   ├── setup.ts                 # Vitest setup — imports jest-dom matchers
│   ├── StarRating.test.tsx
│   └── ProtectedRoute.test.tsx
├── types/
│   └── types.ts                 # Domain types: User, Restaurant, Review
├── utils/
│   └── time.ts                  # formatDate(), isOpenNow()
├── App.tsx                      # Root — wraps tree in QueryClientProvider
├── Router.tsx                   # BrowserRouter, AuthProvider, all routes
├── index.css                    # Global CSS variables + utility classes
└── main.tsx                     # Entry point
```

### Key Patterns

**API Layer (`src/api/`)**
The API layer is split into three folders:
- `connect/` — HTTP plumbing. `apiFetch()` reads the JWT from `localStorage` (`burger_token`), injects `Authorization: Bearer` and delegates to `fetch`. The Vite dev proxy rewrites `/api/*` → `http://localhost:3001/*` (JSON Server).
- `resources/` — Domain functions (`getRestaurants`, `submitReview`, etc.) built on `apiFetch`.
- `auth/` — Supabase client singleton (session persistence + token auto-refresh).

**Mock vs. Supabase toggle**
A single env var controls which backend is active:

| `VITE_USE_SUPABASE` | Auth | Image storage | REST data |
|---|---|---|---|
| `true` | Supabase auth | `burger-images` Supabase bucket | JSON Server via `/api` proxy |
| `false` | Mock JWT (localStorage) | Hardcoded placeholder URL | JSON Server via `/api` proxy |

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
`ProtectedRoute` checks `AuthContext`. If unauthenticated, stores the intended path in `sessionStorage` and redirects to `/login`. After sign-in the user is sent back to that path.

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
  │── POST /api/reviews (publicUrl) ───► JSON Server
```
The file goes directly from the browser to Supabase Storage. The REST API only stores the resulting public URL.
An S3 pre-signed URL path exists in `src/api/resources/images.ts` but is currently stubbed — it returns a placeholder Unsplash URL in mock mode.

**Server state (`TanStack React Query`)**
All data fetching and mutations go through React Query hooks (`src/hooks/`). This provides automatic caching, background re-fetching, and loading/error states without manual `useEffect` patterns. `useSubmitReview` invalidates the relevant query keys on success so the feed and restaurant stats refresh automatically.

**Routing**
```
BrowserRouter
  AuthProvider
    Navigation (global)
    Routes
      /                    → HomePage
      /reviews             → ReviewsPage
      /restaurants         → RestaurantsPage
      /restaurants/:id     → RestaurantDetailPage
      /restaurants/:id/review → SubmitReviewPage (ProtectedRoute)
      /submit              → SubmitReviewPage (ProtectedRoute)
      /login               → LoginPage
      /dashboard           → DashboardPage (ProtectedRoute)
      *                    → NotFoundPage
```

**CSS architecture**
Global design tokens live in `src/index.css` as CSS custom properties:
- Colour palette: dark background (`#111110`), amber brand accent, surface/border/text scales, semantic states (error, success, open/closed)
- Typography: Playfair Display (headings), DM Sans (body) — loaded from Google Fonts
- Spacing scale: `--space-1` (4px) → `--space-8` (64px)
- Shadows, border radii, transition speeds
- Global utility classes: `.btn`, `.btn-primary`, `.btn-ghost`, `.form-*`, `.card`, `.badge`, `.glass`, `.text-muted`

Each component uses a co-located CSS Module for scoped overrides.

---

## Development Setup

**Scripts**

| Command | Effect |
|---|---|
| `npm run dev` | Vite dev server (HMR, `/api` proxy to port 3001) |
| `npm run server` | JSON Server on port 3001 (mock REST backend) |
| `npm run build` | `tsc --noEmit` + `vite build` |
| `npm run preview` | Serve production build locally |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (jsdom environment) |

**Environment variables**

```
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=<your-project-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_API_URL=http://localhost:3000   # unused at runtime, proxy handles routing
```

**Vite proxy**
```ts
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

---

## Testing

**Stack:** Vitest 4.1 + Testing Library React 16 + jsdom

`src/tests/setup.ts` imports `@testing-library/jest-dom` to extend Vitest matchers.

Current test coverage:
- `StarRating.test.tsx` — component rendering and interaction
- `ProtectedRoute.test.tsx` — auth guard redirect behaviour

---

## Limitations & Trade-offs

| Area | Current state | Better path |
|---|---|---|
| **Mock JWT** | `mock-jwt-token-${email}` string — not a real JWT | Replace with Supabase auth entirely |
| **S3 upload** | Stubbed — returns a placeholder URL in mock mode | Wire up real presigned URL endpoint |
| **`isOpenNow()`** | Hard-coded 10:00–23:00 heuristic, ignores actual hours field | Parse stored opening hours per day |
| **Distance calc** | Flat-earth approximation | Haversine formula |
| **Real-time** | Feed is request-driven, not pushed | Supabase Realtime or SSE for live like counts |
| **Offline** | No service worker | PWA + cache strategy |
| **localStorage JWT** | XSS risk in mock mode | `httpOnly` cookie once on a real auth server |
