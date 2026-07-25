# 🥝🚘 KiwiDrive — Frontend

The dashboard, the quiz screen, the little green streak flame — this is the React app that turns the backend's data into something you'd actually want to open every day. A single-page app for practicing NZ driving theory questions, gamified with XP, streaks, achievements and a leaderboard.

Talks to the [backend API](../backend/README.md) over HTTP; doesn't touch a database directly.

---

## 🛠️ Tech Stack

- **React 19 + TypeScript**
- **Vite** — not Create React App. Matters mainly for one thing: the production build lands in `dist/`, not `build/`.
- **Tailwind CSS v4** — design tokens as CSS variables (`@theme` block in `src/index.css`), with a `.dark` class override for dark mode rather than per-component conditional classes.
- **Zustand** — small, dependency-free global state, used instead of Context/Redux.
- **React Router** — client-side routing, `BrowserRouter`.

---

## 📁 Project structure

```
src/
├── pages/          # One component per route (see Routes below)
├── components/
│   ├── ui/          # Reusable presentational pieces (NavBar, QuestionCard, Card, Button, …)
│   └── *.tsx         # Route guards: ProtectedRoute, RequireRealAuth, RequireAdmin, Layout
├── store/            # Zustand stores — authStore, themeStore
├── api/               # One file per backend resource — thin fetch wrappers over client.ts
├── utils/              # Small pure helpers (jwt.ts, getOptionClass.ts)
└── types/                # Shared TypeScript interfaces (User, Question, AuthResponse, …)
```

`api/client.ts` is the single place that knows how to call the backend (base URL, JSON headers, attaching the JWT); every other `api/*.ts` file just calls into it.

---

## 🧭 Routes

| Route | Page | Access |
|---|---|---|
| `/` | `LandingPage` | Public |
| `/auth` | `AuthPage` | Public — login, register, or continue as Guest |
| `/dashboard` | `DashboardPage` | Logged in (real account **or** Guest) |
| `/leaderboard` | `LeaderboardPage` | Logged in (real account **or** Guest) |
| `/achievements` | `AchievementsPage` | Logged in (real account **or** Guest) |
| `/profile` | `ProfilePage` | Logged in (real account **or** Guest) |
| `/quiz` | `QuizPage` | **Real account only** — Guest is redirected back to `/auth` |
| `/admin` | `AdminPage` | **Admin role only** — question CRUD, redirected to `/dashboard` otherwise |

Three separate guard components enforce this: `ProtectedRoute` (any authenticated session, Guest included), `RequireRealAuth` (blocks Guest specifically — quiz progress isn't persisted for guests, so they're routed to `/auth` instead), and `RequireAdmin` (checks a role claim decoded from the JWT).

---

## ✨ Key features

- **Responsive layout**, mobile through desktop — including a real mobile nav drawer (`NavBar.tsx`): hamburger toggle, slide-in panel rendered via a React portal, backdrop click-to-close, Escape-to-close, and background scroll lock while open.
- **Light/dark theme toggle**, persisted to `localStorage` and re-applied on load — `themeStore.ts`.
- **Guest mode vs. authenticated mode** — Guest gets a client-only session (no token, nothing persisted server-side) with reduced access, distinct from a real logged-in user or an Admin.
- **Live dashboard** — `DashboardPage` pulls real per-category progress and accuracy from `GET /api/dashboard/category-stats`, not hardcoded numbers.
- **Client-side state via Zustand** — `authStore` (user, token, auth/guest/admin flags, login/register/logout) and `themeStore` (dark mode).

---

## ▶️ Running locally

### Option A — Vite directly

```bash
npm install
npm run dev
```

- Dev server defaults to `http://localhost:5173`.
- Needs a `.env` file with `VITE_API_URL` pointing at wherever the backend is running — see [`backend/README.md`](../backend/README.md) for how to start it locally.

### Option B — Docker

```bash
docker compose up --build
```
(run from the repo root — see [`backend/README.md`](../backend/README.md) for the full Docker setup)

- Frontend → `http://localhost:5173`

One thing worth knowing if you're touching the `Dockerfile`: `VITE_API_URL` is baked into the static build **at build time**, via a Docker build arg — Vite inlines `import.meta.env.VITE_API_URL` into the compiled JS, there's no server to read an environment variable from at runtime. So changing it means rebuilding the image (`docker compose up --build`), not just restarting the container.

---

## 🧪 Testing

- **Vitest**, `jsdom` environment. No component rendering tests — that was explicitly out of scope for this project; only pure logic (Zustand stores + one extracted pure function) is covered.
- Test files sit **next to** the source they test (e.g. `authStore.test.ts` beside `authStore.ts`) — standard for this ecosystem, no separate top-level test folder like the backend has.
- **27 tests** across 3 files:
  - `store/authStore.test.ts` — login/register success and failure paths, Guest-mode transitions (both into and out of Guest), logout, and module-initialization behaviour (reading a token from `localStorage` on load and decoding its role).
  - `store/themeStore.test.ts` — dark-mode toggle and persistence, checking `localStorage`, the `<html>` element's `dark` class, and store state stay consistent with each other.
  - `utils/getOptionClass.test.ts` — the four visual states of a quiz answer option (default, selected, correct, wrong), extracted as a pure function from `QuestionCard.tsx` specifically so it could be unit tested without rendering the component.
- Run with:
  ```bash
  npm run test
  ```

---

## 🚀 Deployment

Deployed via **Azure Static Web Apps**, with continuous deployment from GitHub Actions on every push to `main`.

Two non-obvious things worth flagging for anyone else touching this:

- **`staticwebapp.config.json`** exists specifically to make client-side routing work. Without it, navigating straight to (or refreshing) a route like `/auth` hits Azure's static file server, which has no file at that path and returns a 404, instead of falling back to `index.html` and letting React Router handle it.
- **Build output is `dist/`**, the Vite default — not `build/`. Azure's auto-detected "React" preset assumes `build/` and gets this wrong unless the output location is set explicitly in the workflow config.

---

## 📝 Known limitations

- No component-level or visual rendering tests — only store logic and extracted pure functions are unit tested. Anything about how a component actually *renders* is currently verified by hand, not automated.
