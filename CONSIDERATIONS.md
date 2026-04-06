### Considerations and reflections
- [x] What considerations regarding security and user privacy did you have when designing the system?

  - In production mode, authentication is delegated to Supabase, which manages JWT issuance and session auto-refresh via its JS client (`onAuthStateChange` listener). The frontend never handles raw tokens directly.
  - Image files travel directly from the browser to Supabase Storage via `supabase.storage.upload()`. The REST API only receives the resulting public URL — the file itself never passes through the backend.
  - `ProtectedRoute` gates all write-capable pages and stores the intended destination in `sessionStorage` (not `localStorage`) before redirecting to `/login`, so users are returned to their original path after sign-in.

- [x] How would the system scale with increased workloads and do you have any bottlenecks?

  The frontend scales passively — it's a static Vite build served from Vercel's global edge network with no server to manage. In demo mode, `db.json` is bundled at build time, making the app fully static with zero runtime infrastructure.

  The real scaling seam is the pluggable connector architecture (`src/api/providers/`): the frontend can be re-pointed from mock data to real backend microservices by flipping env vars, without touching any component code. Each microservice can then scale independently based on its own load profile.

  Current bottlenecks and limitations:
  - **Geolocation sorting** uses a flat-earth distance approximation — acceptable for short ranges and this challenge but degrades at scale.
  - **Feed freshness** is request-driven, not pushed — no real-time updates. Supabase Realtime or SSE would be needed for live counts.
  - **No caching layer beyond the client** — TanStack Query provides a 2-minute `staleTime` and stale-while-revalidate semantics, reducing redundant API calls, but there's no server-side cache in front of the backend yet.

**Constraints for the solution:**
- [x] Solution must be written as a React application
- [x] The solution architecture must be designed to run on a cloud hosting-based platform, such as Amazon Web Services or Microsoft Azure
- [x] Presentation must take no more than 15-20 minutes

**Delivery expectations:**
- [x] We would like to see your thoughts and plans documented as Context and Container diagrams as described in the [C4 model](https://c4model.com/)
- [x] All files and code must be uploaded to your public GitHub repository (or similar)
- [x] Oral presentation of the solution, including an explanation about architecture decisions, reflections and possible limitations of the solution
