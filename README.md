# 🥝🚦 KiwiDrive

### Gamified learner licence theory practice for New Zealand drivers

![.NET](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![EF Core](https://img.shields.io/badge/EF_Core-SQLite-003B57?logo=sqlite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Tests](https://img.shields.io/badge/tests-60_passing-brightgreen)

[![Backend CI/CD](https://github.com/D7741/KiwiDrive/actions/workflows/main_kiwidrive-api.yml/badge.svg)](https://github.com/D7741/KiwiDrive/actions/workflows/main_kiwidrive-api.yml)
[![Frontend CI/CD](https://github.com/D7741/KiwiDrive/actions/workflows/azure-static-web-apps-happy-dune-06daefb00.yml/badge.svg)](https://github.com/D7741/KiwiDrive/actions/workflows/azure-static-web-apps-happy-dune-06daefb00.yml)

Microsoft Student Accelerator (MSA) 2026 - Phase 2 Software Stream assessment submission.

---

## Live Deployment

| | Link |
|---|---|
| **Frontend** | [happy-dune-06daefb00.7.azurestaticapps.net](https://happy-dune-06daefb00.7.azurestaticapps.net/) |
| **Backend API / Scalar Docs** | [kiwidrive-api-cbgrgwbhhcguephf.newzealandnorth-01.azurewebsites.net/scalar](https://kiwidrive-api-cbgrgwbhhcguephf.newzealandnorth-01.azurewebsites.net/scalar) |

Both are deployed continuously from `main` via GitHub Actions - the badges above reflect the current build status of each.

---

## Video

| | Link |
|---|---|
| **Demo Video** | [Google Drive](https://drive.google.com/drive/folders/1hltOuQPF_N-BmCpsbyaisUsQ6xdnA4v1?usp=sharing) |

---

## Introduction

KiwiDrive is a full-stack, gamified web application that helps New Zealanders study for their learner licence theory test. Instead of a static list of practice questions, KiwiDrive wraps the NZ Road Code in a game loop that gives you a reason to come back tomorrow:

**Answer Questions -> Earn XP -> Level Up -> Maintain a Streak -> Unlock Achievements -> Climb the Leaderboard**

Under the hood, it is a proper client-server application: a React single-page app talking to a C# Web API over a REST interface secured with JWT, backed by a relational database, containerised for local development, and deployed to Azure with continuous delivery on every push to `main`.

---

## How This Relates to the Gamification Theme

KiwiDrive's assigned theme is **Gamification**, and the design deliberately leans on a handful of well-established HCI and behavioural-design principles rather than just bolting a points counter onto a quiz app:

- **Immediate feedback (Skinner's operant conditioning)** - every answer is scored instantly, with the correct option highlighted in green and an incorrect selection highlighted in red, alongside a short explanation. The feedback loop between action and consequence is kept as short as possible, which is what makes the "one more question" pull work.
- **Progress visibility (Goal-Gradient Effect)** - the XP bar, level badge, and streak flame are visible in the navigation bar on every page, not just on a dedicated stats screen. People push harder the closer they perceive themselves to be to a goal, so progress needs to be ambient, not buried.
- **Variable, milestone-based rewards** - achievements unlock on two different triggers (XP thresholds and a 7-day streak), so the reward schedule is not perfectly predictable, which keeps it more engaging than a single linear progress bar.
- **Habit formation via streaks** - the daily streak (correct answer once per calendar day) is a direct application of the same loss-aversion mechanic used by Duolingo and similar habit-forming apps: it is not the reward of streaking that motivates continued use, it is the fear of losing a streak already built.
- **Social comparison (leaderboard)** - ranking by total XP taps into competence and relatedness, two of the three pillars of Self-Determination Theory (competence, autonomy, relatedness). Seeing where you sit against other learners is a stronger motivator for many people than an absolute score in isolation.
- **Autonomy** - Guest mode lets someone try the full quiz experience with zero commitment (no account, no email) before deciding whether to invest in an account that actually keeps their progress. Removing friction from the first five minutes of use is itself an HCI decision, not just a technical convenience.

---

## What Makes KiwiDrive Unique

- **It is actually useful, not a toy demo.** The question bank reflects real NZ Road Code content (speed limits, give-way rules, alcohol limits, road signs) across six categories, not generic filler trivia written to pad out a database.
- **Night Driving Mode is a genuine gamification twist, not a cosmetic skin.** Switching to dark mode is themed as "Night Driving Mode" and lines up with a real "Night Driving" question category in the database - the visual theme and the content theme reinforce each other instead of being two unrelated features bolted together.
- **Role-based access is real, not decorative.** There are three distinct access levels enforced end to end (route guards on the frontend, `[Authorize]` and role claims on the backend): Guest (try-before-you-commit, no persistence), a registered User, and an Admin role that unlocks question management. This was tightened up over the course of development after an audit surfaced several endpoints missing `[Authorize]` entirely - see the Self Reflection section.
- **The dashboard shows real per-category analytics, not a static badge wall.** Progress and accuracy per category are calculated from actual answer history stored per user, not hardcoded placeholder numbers.
- **It has real automated test coverage on both sides of the stack** - 60 passing tests total (33 backend, 27 frontend) covering the actual business logic that matters most: answer scoring, XP awarding, the three streak branches (increment, reset, first-time), both achievement-unlock paths, dashboard aggregation and rounding behaviour, and the auth/theme state stores.
- **The engineering process is documented, not just the code.** The `/specs` folder contains the actual planning documents, architecture decisions, and AI usage records written during development - see [AI Usage](#ai-usage) below.

---

## Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite (build output in `dist/`, not `build/`) |
| Styling | Tailwind CSS v4 - design tokens as CSS custom properties, with dark mode via a `.dark` class override |
| State management | Zustand |
| Routing | React Router v7 |
| API layer | A hand-rolled `fetch` wrapper (`src/api/client.ts`) that attaches the JWT and handles JSON - no external HTTP library |
| Testing | Vitest + jsdom |

### Backend

| Layer | Technology |
|---|---|
| Framework | C# / .NET 10 Web API |
| ORM | Entity Framework Core |
| Database | SQLite |
| Auth | JWT Bearer, role-based (`User` / `Admin`) |
| Password hashing | BCrypt.Net |
| API documentation | Scalar (not Swagger UI) |
| Testing | xUnit + Moq |

### DevOps

| Layer | Technology |
|---|---|
| Containerisation | Docker + Docker Compose |
| Frontend hosting | Azure Static Web Apps |
| Backend hosting | Azure App Service |
| CI/CD | GitHub Actions, deploys on every push to `main` |

---

## Repository Structure

```
KiwiDrive/
├── backend/                  # C# .NET 10 Web API - Controllers, Services, Repositories, EF Core
│                              # see backend/README.md for backend-specific setup and architecture
├── frontend/                  # React + TypeScript SPA - pages, components, Zustand stores
│                              # see frontend/README.md for frontend-specific setup and testing
├── KiwiDrive.Tests/             # xUnit + Moq backend test suite, sibling to backend/ and frontend/
├── specs/                        # Planning docs, architecture decisions, AI usage evidence
│   ├── planning/                  # Project overview, database schema, API design, page design
│   ├── decisions/                  # Backend/frontend technology and architecture decisions
│   └── ai-usage/                    # AI tools used, real prompts, honest reflection
├── .github/workflows/                # One GitHub Actions workflow per deployment target
├── docker-compose.yml                  # Runs backend + frontend together for local dev
├── .env.example                          # Documents the one environment variable Docker needs
└── README.md                              # This file
```

Both `backend/` and `frontend/` have their own README with implementation-level detail (project structure, API reference, running instructions, testing specifics) that is not repeated here.

---

## Advanced Features

Exactly three advanced features were selected and implemented, in line with the assessment's advanced feature allowance:

- [x] **Dark / Light Mode** - implemented with Tailwind CSS custom properties rather than duplicated per-component classes, persisted to `localStorage`, and re-applied on load. Includes a creative twist: toggling dark mode is themed as "Night Driving Mode" and pairs with a real Night Driving question category, so the visual theme and the content theme reinforce each other.
- [x] **Zustand** - global client state for authentication (user, token, guest/admin flags, login/register/logout), and theme (dark mode). Chosen over Context or Redux for its minimal boilerplate and colocated store logic.
- [x] **Docker** - both `backend/` and `frontend/` have their own `Dockerfile`, orchestrated together with a root-level `docker-compose.yml`. Run the whole stack locally with a single command: `docker compose up --build`.

---

## Getting Started Locally

There are two ways to run KiwiDrive locally: natively, or with Docker. Both are documented in full in the respective sub-READMEs; the short version is below.

### Backend

```bash
cd backend
dotnet run
```

Requires the .NET 10 SDK. On first run, EF Core migrations are applied and the database is seeded (categories, achievements, questions) automatically - no manual migration step needed. Needs JWT settings (`Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience`, `Jwt:ExpiryDays`) supplied via `appsettings.Development.json` or environment variables - see [`backend/README.md`](backend/README.md) for details. Defaults to `http://localhost:5165`, with Scalar docs at `/scalar/v1`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Requires a `.env` file with `VITE_API_URL` pointing at wherever the backend is running. Defaults to `http://localhost:5173`. See [`frontend/README.md`](frontend/README.md) for the full breakdown of routes, features, and test coverage.

### Docker (both at once)

```bash
cp .env.example .env   # then fill in a real JWT_KEY
docker compose up --build
```

Run from the repo root. Backend becomes available at `http://localhost:8080`, frontend at `http://localhost:5173`. Note that the frontend's `VITE_API_URL` is baked into the static build at build time via a Docker build arg, so changing it requires a rebuild, not just a container restart.

### Running the tests

```bash
# Backend - xUnit + Moq, 33 tests
cd KiwiDrive.Tests
dotnet test

# Frontend - Vitest + jsdom, 27 tests
cd frontend
npm run test
```

---

## AI Usage

AI tools - primarily Claude (Anthropic) and Claude Code, with GitHub Copilot for inline autocomplete - were used throughout this project's development, for architecture planning, code generation, debugging, and documentation.

This was not a "generate once and ship it" workflow. Concrete examples of AI output being evaluated, and in some cases rejected or corrected, rather than accepted blindly:

- An AI suggestion to look users up by email in `UpdateUserAsync` was rejected in favour of the more correct approach of looking up by Id.
- An initially over-engineered achievement system was deliberately simplified to fit the project's time constraints.
- AI-suggested NuGet package versions that did not actually exist for .NET 10 were caught and corrected against the real package registry.
- A missing `[Authorize]` attribute pattern - discovered across several controllers during a later security-focused review - was fixed methodically, endpoint by endpoint, rather than papered over.

Full detail, including the real prompts used and an honest reflection on what worked and what did not, lives in [`/specs/ai-usage`](specs/ai-usage) - see [`specs/README.md`](specs/README.md) for a guided reading order through the entire planning and decision-making process, not just the AI angle.

---

## Self Reflection

If this project were started over, here is what would change:

**Process**

- Set up the project structure and CI/CD pipeline earlier, instead of adding deployment automation only once the application was mostly feature-complete.
- Write unit tests alongside each feature rather than backfilling them afterward - the backend and frontend test suites both ended up written well after the code they cover, which worked out fine here but is a habit worth breaking.
- Spend more time on UI/UX design planning before writing code, rather than iterating on layout after components already existed.
- Start with a smaller question dataset and expand iteratively, instead of front-loading a large seed file before the core loop was even fully working.

**Technical**

- Establish a proper `.env` convention earlier. CORS origins and API URLs ended up hardcoded in a few places before environment variables were introduced properly, which took extra cleanup later.
- Version the API from day one with an `/api/v1/` style prefix, so future changes to request or response shapes would not risk breaking existing clients.
- Introduce a unified error-handling middleware earlier. `ExceptionMiddleware` was added partway through, after several controllers had already grown their own repetitive try/catch blocks that then needed refactoring.

**Architecture**

- Containerise from day one instead of adding Docker near the end - keeping local development and production environments consistent from the start would have surfaced a few environment-specific bugs much earlier.
- Plan the database schema more conservatively upfront. Fields like `LastStreakDate` and `Role` were added mid-project, which meant several incremental EF Core migrations that more careful early schema design could have consolidated into fewer, cleaner ones.

**Project management**

- Prioritise core functionality more strictly before investing in nice-to-haves. Guest mode and the Admin question-management page are both genuinely useful, but they took time that arguably should have gone into polishing the core quiz loop first.
- Deploy to Azure much earlier in the timeline rather than near the end, so that differences between local and production environments would surface while there was still time left to fix them comfortably.
