# Project Structure

```
burger-frontend/
├── public/                      # Static assets served as-is
├── src/
│   ├── assets/                  # Images bundled with the app
│   │
│   ├── api/                     # Data-access layer (auth, resources, providers)
│   │   ├── auth/
│   │   │   ├── index.ts         # Auth façade — delegates to mock or supabase
│   │   │   ├── mock.ts          # In-memory auth for local development
│   │   │   ├── supabase.ts      # Supabase auth adapter
│   │   │   └── types.ts         # AuthUser, AuthSession, etc.
│   │   ├── client/
│   │   │   └── queryClient.ts   # TanStack Query client configuration
│   │   ├── connect/
│   │   │   └── api.ts           # Low-level fetch/connector wiring
│   │   ├── providers/
│   │   │   ├── index.ts         # Active provider export (http | mock | supabase)
│   │   │   ├── types.ts         # IFetchConnector, IStorageConnector interfaces
│   │   │   ├── http/
│   │   │   │   └── fetchConnector.ts    # Real HTTP fetch connector
│   │   │   ├── mock/
│   │   │   │   ├── fetchConnector.ts    # In-memory mock fetch connector
│   │   │   │   └── storageConnector.ts  # In-memory mock storage connector
│   │   │   └── supabase/
│   │   │       ├── client.ts            # Supabase JS client instance
│   │   │       └── storageConnector.ts  # Supabase Storage connector
│   │   └── resources/
│   │       ├── images.ts        # Image upload/read API calls
│   │       ├── restaurants.ts   # Restaurant CRUD API calls
│   │       ├── reviews.ts       # Review CRUD API calls
│   │       └── users.ts         # User read API calls
│   │
│   ├── components/              # Shared, reusable UI components (organised by category)
│   │   ├── cards/
│   │   │   ├── BurgerReviewCard/
│   │   │   │   ├── BurgerReviewCard.tsx          # Social feed card: image, caption, scores, like/comment
│   │   │   │   ├── BurgerReviewCard.skeleton.tsx # Skeleton loader for the card
│   │   │   │   └── BurgerReviewCard.module.css
│   │   │   ├── OpeningHours/
│   │   │   │   ├── OpeningHours.tsx              # Weekly hours table with open/closed highlight
│   │   │   │   └── OpeningHours.module.css
│   │   │   ├── RestaurantCard/
│   │   │   │   ├── RestaurantCard.tsx            # Grid card with open/closed pill + distance
│   │   │   │   ├── RestaurantCard.skeleton.tsx   # Skeleton loader for the card
│   │   │   │   └── RestaurantCard.module.css
│   │   │   └── RestaurantInfo/
│   │   │       ├── RestaurantInfo.tsx            # Address, phone, and meta details block
│   │   │       └── RestaurantInfo.module.css
│   │   ├── forms/
│   │   │   ├── CreateReviewForm/
│   │   │   │   ├── CreateReviewForm.tsx          # Review form: scores, caption, image upload
│   │   │   │   └── CreateReviewForm.module.css
│   │   │   └── ImageUpload/
│   │   │       ├── ImageUpload.tsx               # Drag-and-drop / click image uploader
│   │   │       └── ImageUpload.module.css
│   │   ├── layout/
│   │   │   ├── CardGrid/
│   │   │   │   ├── CardGrid.tsx                  # Responsive CSS grid wrapper
│   │   │   │   └── CardGrid.module.css
│   │   │   └── Hero/
│   │   │       ├── Hero.tsx                      # Full-width hero banner with headline
│   │   │       └── Hero.module.css
│   │   ├── navigation/
│   │   │   ├── Navigation/
│   │   │   │   ├── Navigation.tsx                # Sticky glassmorphic header + mobile drawer
│   │   │   │   └── Navigation.module.css
│   │   │   └── ProtectedRoute/
│   │   │       └── ProtectedRoute.tsx            # Auth guard — redirects to /login if unauthenticated
│   │   ├── score/
│   │   │   ├── ScoreBreakdown/
│   │   │   │   ├── ScoreBreakdown.tsx            # Animated bars for taste / texture / presentation
│   │   │   │   └── ScoreBreakdown.module.css
│   │   │   └── StarRating/
│   │   │       ├── StarRating.tsx                # Read-only + interactive 0–10 star rating (5 stars)
│   │   │       └── StarRating.module.css
│   │   ├── sections/
│   │   │   ├── Feed/
│   │   │   │   ├── Feed.tsx                      # Review feed list with infinite/paginated layout
│   │   │   │   └── Feed.module.css
│   │   │   └── FeedControls/
│   │   │       ├── FeedControls.tsx              # Sort / filter toolbar above the feed
│   │   │       └── FeedControls.module.css
│   │   └── typography/
│   │       └── Typography/
│   │           └── PageTitle/
│   │               ├── PageTitle.tsx             # Styled h1 page-title component
│   │               └── PageTitle.module.css
│   │
│   ├── context/
│   │   ├── AuthContext.tsx      # AuthProvider + context definition
│   │   └── auth.ts              # useAuth() hook export
│   │
│   ├── hooks/                   # TanStack Query hooks, organised by domain
│   │   ├── auth/
│   │   │   └── useAuth.ts       # Reads AuthContext; exposes user, login, logout
│   │   ├── common/
│   │   │   ├── useGeolocation.ts   # Wraps browser Geolocation API with error handling
│   │   │   └── useImageUpload.ts   # Handles image file selection + upload flow
│   │   ├── feed/
│   │   │   └── useFeed.ts          # Fetches and sorts the social review feed
│   │   ├── restaurants/
│   │   │   ├── useNearbyRestaurants.ts  # Filters restaurants by distance from user
│   │   │   ├── useRestaurant.ts         # Fetches a single restaurant by id
│   │   │   ├── useRestaurants.ts        # Fetches all restaurants
│   │   │   └── useSearchRestaurants.ts  # Client-side search over restaurant list
│   │   ├── reviews/
│   │   │   ├── useReviews.ts       # Fetches all reviews (optionally by restaurant)
│   │   │   ├── useSubmitReview.ts  # Mutation: create a new review
│   │   │   └── useUserReviews.ts   # Fetches reviews authored by the current user
│   │   └── users/
│   │       ├── useUser.ts          # Fetches a single user by id
│   │       └── useUsers.ts         # Fetches all users
│   │
│   ├── pages/                   # Route-level page components (each in its own folder)
│   │   ├── DashboardPage/
│   │   │   ├── DashboardPage.tsx        # Authenticated user dashboard
│   │   │   ├── DashboardPage.module.css
│   │   │   └── index.ts
│   │   ├── HomePage/
│   │   │   ├── HomePage.tsx             # Social feed + Hero section
│   │   │   └── index.ts
│   │   ├── LoginPage/
│   │   │   ├── LoginPage.tsx            # Sign-in form; redirects back to intended route after login
│   │   │   ├── LoginPage.module.css
│   │   │   └── index.ts
│   │   ├── NotFoundPage/
│   │   │   ├── NotFoundPage.tsx         # On-brand 404
│   │   │   ├── NotFoundPage.module.css
│   │   │   └── index.ts
│   │   ├── RestaurantDetailPage/
│   │   │   ├── RestaurantDetailPage.tsx # Cover photo, hours, map placeholder, reviews
│   │   │   ├── RestaurantDetailPage.module.css
│   │   │   └── index.ts
│   │   ├── RestaurantsPage/
│   │   │   ├── RestaurantsPage.tsx      # Searchable grid + "Near me" geolocation filter
│   │   │   ├── RestaurantsPage.module.css
│   │   │   └── index.ts
│   │   ├── ReviewsPage/
│   │   │   ├── ReviewsPage.tsx          # All-reviews feed page
│   │   │   └── index.ts
│   │   ├── SubmitReviewPage/
│   │   │   ├── SubmitReviewPage.tsx     # Full-page wrapper for CreateReviewForm
│   │   │   ├── SubmitReviewPage.module.css
│   │   │   └── index.ts
│   │   └── index.ts                     # Barrel re-export of all pages
│   │
│   ├── storage/
│   │   └── redirectAfterLogin.ts  # Persists the pre-login URL for post-auth redirect
│   │
│   ├── tests/
│   │   ├── ProtectedRoute.test.tsx  # Unit tests for auth guard behaviour
│   │   ├── StartRating.test.tsx     # Unit tests for StarRating component
│   │   ├── isOpenNow.test.ts        # Unit tests for opening-hours logic
│   │   └── setup.ts                 # Vitest global setup (jsdom, matchers)
│   │
│   ├── types/
│   │   └── types.ts             # Shared domain types: Restaurant, Review, User, etc.
│   │
│   ├── utils/
│   │   └── time.ts              # isOpenNow() and other time/date helpers
│   │
│   ├── App.tsx                  # Root component — mounts Router
│   ├── App.css                  # App-level overrides
│   ├── Router.tsx               # BrowserRouter + AuthProvider + all Routes
│   ├── index.css                # Global design system: tokens, typography, utilities
│   └── main.tsx                 # React DOM entry point
│
├── db.json                      # json-server database (used with mock provider)
├── vercel.json                  # Vercel deployment config (SPA rewrite rules)
├── vite.config.ts               # @/ alias, dev-server proxy to :3001, vendor chunk split
├── tsconfig.json                # Root TypeScript project references
├── tsconfig.app.json            # App TypeScript config with @/ path alias
├── tsconfig.node.json           # Node/tooling TypeScript config
├── tsconfig.test.json           # Vitest TypeScript config
├── eslint.config.js             # Flat ESLint config
├── ARCHITECTURE.md              # C4 diagrams, security, scaling, backend reflections
└── STRUCTURE.md                 # This file
```

## Routes

| Path | Component | Auth required |
|---|---|---|
| `/` | `HomePage` | No |
| `/dashboard` | `DashboardPage` | **Yes** |
| `/reviews` | `ReviewsPage` | No |
| `/restaurants` | `RestaurantsPage` | No |
| `/restaurants/:id` | `RestaurantDetailPage` | No |
| `/restaurants/:id/review` | `SubmitReviewPage` | **Yes** |
| `/submit` | `SubmitReviewPage` | **Yes** |
| `/login` | `LoginPage` | No |
| `*` | `NotFoundPage` | No |

## Development

```bash
# Install dependencies
npm install

# Start the app (Vite dev server on :5173)
npm run dev

# Start the mock API (json-server on :3001)
npm run server

# Run tests
npm test

# Build for production
npm run build
```

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_USE_MOCK_API` | `false` | Set to `true` to use the mock API instead of the real backend |
| `VITE_USE_MOCK_AUTH` | `false` | Set to `true` to use the mock auth provider (auto-login as demo user) |
| `VITE_SUPABASE_URL` | — | Supabase project URL (required when using Supabase provider) |
| `VITE_SUPABASE_ANON_KEY` | — | Supabase anon key (required when using Supabase provider) |

## API provider system

The `src/api/providers/index.ts` module exports the active provider set at build time.
Three providers are available:

| Provider | Fetch connector | Storage connector | When to use |
|---|---|---|---|
| `mock` | In-memory stubs | In-memory stubs | Local dev, CI, tests |
| `http` | Real REST fetch | — | Custom backend |
| `supabase` | Supabase PostgREST | Supabase Storage | Production |

## Design system

All design tokens are CSS custom properties defined in `src/index.css`:

- **Palette** — `--color-bg`, `--color-amber`, `--color-surface`, etc.
- **Typography** — Playfair Display (headings), DM Sans (body)
- **Spacing** — `--space-1` (4px) through `--space-8` (64px)
- **Animations** — `fadeInUp`, `shimmer` (skeleton), `growBar` (score bars)
- **Utilities** — `.glass`, `.card`, `.badge`, `.btn`, `.skeleton`, `.stagger`
