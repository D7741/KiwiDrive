# 🥝🚦 KiwiDrive — Backend

The engine room behind KiwiDrive: a gamified web app that helps New Zealanders study for their learner licence theory test. This half of the repo is the API — it marks your answers, keeps your XP and streak honest, hands out achievements, and remembers how you're doing across every category so the frontend has something real to show you.

Built with **C# / .NET 10**, **Entity Framework Core**, and **SQLite**, secured with **JWT**, and documented with **Scalar** (the assignment brief calls for Scalar specifically, not Swagger UI).

---

## 🌐 Live

| | |
|---|---|
| Frontend | https://happy-dune-06daefb00.7.azurestaticapps.net |
| Backend API | https://kiwidrive-api-cbgrgwbhhcguephf.newzealandnorth-01.azurewebsites.net |
| API docs (Scalar) | https://kiwidrive-api-cbgrgwbhhcguephf.newzealandnorth-01.azurewebsites.net/scalar/v1 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | C# / .NET 10 Web API |
| ORM | Entity Framework Core |
| Database | SQLite |
| Auth | JWT Bearer, role-based (`User` / `Admin`) |
| API Docs | **Scalar** (not Swagger UI) |
| Containerisation | Docker |
| Hosting | Azure App Service |
| CI/CD | GitHub Actions |

---

## 🏗️ Architecture

Straightforward layered architecture, wired up with interface-based dependency injection throughout (`IUserRepository`, `IQuestionRepository`, `IAchievementRepository`, `IUserProgressRepository`, and their `I*Service` counterparts), so every layer depends on an abstraction rather than a concrete class:

```
Controllers    →  HTTP endpoints, [Authorize] guards, request/response DTOs
     │
Services       →  business logic (XP math, streak rules, achievement checks)
     │
Repositories   →  EF Core data access, one per entity
     │
AppDbContext   →  EF Core  →  SQLite
```

### Project structure

```
backend/
├── Controllers/     # Auth, User, Question, Achievement, Leaderboard, Dashboard, Admin
├── Service/          # Interfaces/ + implementations — business logic
├── Repository/        # Interfaces/ + implementations — EF Core data access
├── Models/             # User, Question, Category, UserProgress, Achievement, UserAchievement
├── Dtos/                # Request/response shapes, grouped per feature
├── Data/
│   ├── AppDbContext.cs
│   └── Seeders/         # CategorySeeder & AchievementSeeder (EF HasData), QuestionSeeder (JSON, runtime)
├── Migrations/           # EF Core migrations
├── Middleware/            # ExceptionMiddleware — maps exceptions to HTTP status codes
├── Dockerfile
└── Program.cs
```

---

## 🚦 Core features

- **Auth & authorization** — register/login at `/api/auth/*` issue a JWT; most endpoints require a valid token, `/api/admin/*` additionally requires an `Admin` role claim on top of that. The frontend's Guest mode is client-only and never touches an authenticated endpoint.
- **Question bank** — 60 questions across 6 categories (Road Signs, Speed Limits, Give Way Rules, Parking, Alcohol & Drugs, Night Driving), seeded automatically on first run.
- **XP, levelling & streaks** — `POST /api/questions/answer` scores the answer (case/whitespace-insensitive), awards XP on a correct answer, and advances or resets the daily streak.
- **Achievements** — two unlock paths checked after every correct answer: XP-threshold badges, and a standalone "7 Day Streak" badge that isn't XP-based.
- **Dashboard** — `GET /api/dashboard/category-stats` returns per-category progress (% of questions answered) and accuracy (% answered correctly) for the logged-in user.
- **CORS** — restricted to the deployed frontend origin and the local Vite dev server.

---

## ▶️ Running locally

### Option A — `dotnet run`

```bash
cd backend
dotnet run
```

- Requires the .NET 10 SDK.
- On first run, EF Core migrations are applied and the database is seeded (categories, achievements, questions) automatically — no manual migration step needed.
- Needs JWT settings — `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience`, `Jwt:ExpiryDays` — supplied via `appsettings.Development.json` (kept out of git; a placeholder key lives there for local dev only) or as environment variables in the `Jwt__Key` / `Jwt__Issuer` / … form.
- Defaults to `http://localhost:5165`; Scalar docs open automatically at `/scalar/v1`.

### Option B — Docker

```bash
cp .env.example .env   # then fill in a real JWT_KEY
docker compose up --build
```

- Backend → `http://localhost:8080`
- Frontend → `http://localhost:5173`
- `.env.example` at the repo root lists the one variable you need (`JWT_KEY`); `docker-compose.yml` passes it through to the backend container as `Jwt__Key`.

---

## 📖 API documentation

Scalar is exposed at **`/scalar/v1`** — locally at `http://localhost:5165/scalar/v1`, and on the deployed instance at the link near the top of this file.

---

## 🧪 Testing — WOF check

- **xUnit + Moq**, repository dependencies mocked throughout — no real SQLite touched.
- Lives at the **repo root**, not inside `backend/`: `KiwiDrive.Tests/` (sibling to `backend/` and `frontend/`).
- `DashboardServiceTests.cs` — **11 tests** covering per-category progress/accuracy calculation, rounding, the 100%-progress clamp, and category ordering.
- `QuestionServiceTests.cs` — **22 tests** covering answer scoring, XP awarding, all three streak branches (increment / reset / first-time), and both achievement-unlock paths (XP threshold and the 7-day-streak special case).
- Run with:
  ```bash
  cd KiwiDrive.Tests
  dotnet test
  ```

---

## 🚀 Deployment

- **Backend** — Azure App Service (`kiwidrive-api`), deployed by [`.github/workflows/main_kiwidrive-api.yml`](../.github/workflows/main_kiwidrive-api.yml) on every push to `main`. The workflow publishes the app directly (`dotnet publish` → `azure/webapps-deploy`) — Docker isn't part of this path, it's for local dev/parity only.
- **Frontend** — Azure Static Web Apps, deployed by its own workflow on push to `main`.
- **SQLite persistence** — on Azure, the app detects it's running in App Service and points the SQLite file at Azure's persistent storage directory instead of the ephemeral deployment folder, so data survives redeploys.

---

## 📝 Notes & trade-offs

- **Progress vs. accuracy** — "progress" counts total answer *attempts* against a category's question count (clamped at 100%), not distinct questions seen. Getting an exact "questions actually covered" number would need a per-question attempt log, which wasn't worth the extra table for this assignment's scope.
- **SQLite** — single file, single instance. Fine for an assignment deployment; wouldn't hold up under concurrent writes at real scale.
