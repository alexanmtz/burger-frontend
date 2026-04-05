# Project Structure

```
burger-frontend/
├── public/                      # Static assets served as-is
├── src/
│   ├── assets/                  # Images bundled with the app
│   ├── components/              # Shared, reusable UI components
│   │   ├── Navigation.tsx       # Sticky glassmorphic header + mobile drawer
│   │   ├── Navigation.module.css
│   │   ├── ProtectedRoute.tsx   # Auth guard — redirects to /login if unauthenticated
│   │   ├── BurgerReviewCard.tsx # Social feed card: image, caption, scores, like/comment
│   │   ├── BurgerReviewCard.module.css
│   │   ├── RestaurantCard.tsx   # Restaurant grid card with open/closed pill + distance
│   │   ├── RestaurantCard.module.css
│   │   ├── StarRating.tsx       # Read-only + interactive 0–10 star rating (5 stars)
│   │   ├── StarRating.module.css
│   │   ├── ScoreBreakdown.tsx   # Animated bars for taste / texture / presentation
│   │   └── ScoreBreakdown.module.css
│   │
│   ├── context/
│   │   └── AuthContext.tsx      # AuthProvider + useAuth() hook; localStorage session restore
│   │
│   ├── data/
│   │   └── mockData.ts          # Typed stub data: 4 restaurants, 5 reviews, 4 users
│   │
│   ├── hooks/
│   │   ├── useApi.ts            # Generic fetch hook (loading/error/data) + useMutation
│   │   └── useGeolocation.ts   # Wraps browser Geolocation API with error handling
│   │
│   ├── pages/
│   │   ├── HomePage.tsx         # Social feed + sort controls + skeleton loaders
│   │   ├── HomePage.module.css
│   │   ├── RestaurantsPage.tsx  # Searchable grid + "Near me" geolocation filter
│   │   ├── RestaurantsPage.module.css
│   │   ├── RestaurantDetailPage.tsx  # Cover photo, hours, map placeholder, reviews
│   │   ├── RestaurantDetailPage.module.css
│   │   ├── SubmitReviewPage.tsx # Review form: restaurant picker, scores, drag-and-drop upload
│   │   ├── SubmitReviewPage.module.css
│   │   ├── LoginPage.tsx        # Sign-in form; redirects back to intended route after login
│   │   ├── LoginPage.module.css
│   │   ├── NotFoundPage.tsx     # On-brand 404
│   │   └── NotFoundPage.module.css
│   │
│   ├── services/
│   │   └── api.ts               # All API calls — mock by default, real via VITE_USE_REAL_API=true
│   │
│   ├── App.tsx                  # Root: BrowserRouter + AuthProvider + all Routes
│   ├── index.css                # Global design system: tokens, typography, utilities
│   └── main.tsx                 # React DOM entry point
│
├── db.json                      # json-server database (mirrors mockData.ts)
├── vite.config.ts               # @/ alias, /api proxy to :4000, vendor chunk split
├── tsconfig.app.json            # TypeScript config with @/ path alias
├── ARCHITECTURE.md              # C4 diagrams, security, scaling, backend reflections
└── STRUCTURE.md                 # This file
```

## Routes

| Path | Component | Auth required |
|---|---|---|
| `/` | `HomePage` | No |
| `/restaurants` | `RestaurantsPage` | No |
| `/restaurants/:id` | `RestaurantDetailPage` | No |
| `/submit` | `SubmitReviewPage` | **Yes** |
| `/login` | `LoginPage` | No |
| `*` | `NotFoundPage` | No |

## Development

```bash
# Install dependencies
npm install

# Start the app (Vite dev server on :5173)
npm run dev

# Start the mock API (json-server on :3000)
npx json-server db.json --port 3000

# Build for production
npm run build
```

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_USE_REAL_API` | `false` | Set to `true` to call the real backend instead of mock data |

## Design system

All design tokens are CSS custom properties defined in `src/index.css`:

- **Palette** — `--color-bg`, `--color-amber`, `--color-surface`, etc.
- **Typography** — Playfair Display (headings), DM Sans (body)
- **Spacing** — `--space-1` (4px) through `--space-8` (64px)
- **Animations** — `fadeInUp`, `shimmer` (skeleton), `growBar` (score bars)
- **Utilities** — `.glass`, `.card`, `.badge`, `.btn`, `.skeleton`, `.stagger`
