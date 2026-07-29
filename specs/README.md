# Specs

This folder documents the full development process of KiwiDrive - from initial
planning and ideation, through architecture decisions, to AI-assisted development.
It serves as evidence of thoughtful software engineering practice throughout
the MSA 2026 Phase 2 assessment.

---

## What Is This Folder For?

The `/specs` folder exists to show the markers:

1. That the project was **planned before it was built** - not just coded from scratch
2. That **design decisions were deliberate** - with reasoning, not just defaults
3. That **AI was used effectively and responsibly** - with real prompts, not just
   a vague claim that "AI was used"
4. That the developer **understood the code they shipped** - AI assisted, but did
   not replace judgment

---

## Folder Structure

```
specs/
├── planning/
│   ├── project-overview.md      - Project idea, core loop, initial design decisions
│   ├── database-schema.md       - Full database schema with table relationships
│   ├── api-design.md            - All REST API endpoints, request/response formats
│   └── page-design.md           - Page structure, route planning, navigation design
│
├── decisions/
│   ├── backend-decisions.md     - Every major backend technology and architecture decision
│   ├── frontend-decisions.md    - Frontend architecture, UX, scope, and security decisions
│   └── architecture-overview.md - Full system architecture diagram and data flow
│
├── ai-usage/
│   ├── ai-prompts.md            - Real prompts used during development (not just final code)
│   ├── ai-tools.md              - Which AI tools were used and how
│   └── ai-reflection.md         - Honest reflection on what worked, what didn't, lessons learned
│
└── README.md                    - This file
```

---

## Development Timeline

### Phase 1 - Ideation
- Reviewed MSA assessment requirements
- Brainstormed gamification concepts (fitness app, driving licence app)
- Decided on KiwiDrive - a Duolingo-style NZ learner licence practice app
- Defined core game loop: answer questions -> earn XP -> leaderboard -> badges

### Phase 2 - Planning
- Designed database schema (6 tables)
- Planned REST API endpoints
- Chose tech stack and architecture pattern (Repository + Service Layer)
- Selected 3 advanced features: Docker, Dark/Light Mode, Zustand

### Phase 3 - Backend Development
- Set up .NET 10 Web API with Scalar documentation
- Implemented EF Core with SQLite
- Built Repository and Service layers
- Implemented JWT authentication with BCrypt password hashing
- Built streak tracking system with LastStreakDate logic
- Implemented XP-based and streak-based achievement unlocking

### Phase 4 - Frontend Development
- Set up React + TypeScript with Vite
- Configured React Router v6 with protected routes
- Implemented Zustand stores (auth, quiz, theme)
- Built all 7 pages (Landing, Auth, Dashboard, Quiz, Leaderboard, Achievements, Profile, Admin)
- Implemented dark/light mode with Night Driving mode twist
- Connected frontend to backend via Axios

### Phase 5 - Testing & Deployment
- Deployed backend to Azure App Service
- Deployed frontend to Azure Static Web Apps
- Added Docker and docker-compose for containerisation
- Fixed security vulnerabilities (missing [Authorize] attributes)
- Wrote unit tests for key components

---

## AI Tools Used

| Tool | Purpose |
|---|---|
| Claude (Anthropic) | Architecture planning, code generation, debugging, documentation |
| Claude Code | In-editor assistance, real-time code review, security audit |
| GitHub Copilot | Autocomplete, repetitive pattern generation |

---

## Key AI-Assisted Decisions

- **Repository Pattern** - AI explained trade-offs vs direct DbContext, developer chose Repository
- **SQLite over PostgreSQL** - AI confirmed SQLite is appropriate for showcase scale
- **JWT over Session** - AI explained stateless benefits for React + REST API
- **Streak Logic** - AI helped design the LastStreakDate approach and edge cases
- **Achievement System** - Developer decided to keep XP-milestone achievements after AI
  helped evaluate the cost of building full UserProgress tracking within time constraints
- **CORS Bug Fix** - AI diagnosed macOS AirPlay port conflict as root cause

---

## Evidence of Critical AI Evaluation

Not all AI suggestions were accepted. Examples of AI suggestions that were
rejected or modified:

- AI suggested `UpdateUserAsync` use Email as lookup key - changed to Id (more correct)
- AI suggested overly complex achievement system - simplified to match time constraints
- AI suggested package versions that did not exist for .NET 10 - verified on NuGet
- AI initially put seed data in AppDbContext - refactored to separate Seeder files
  for cleaner separation of concerns

---

## How to Read This Folder

If you are a marker reviewing this project, the recommended reading order is:

1. **Start here** - `planning/project-overview.md` to understand what the project is and why
2. **Database design** - `planning/database-schema.md` to see how data was modelled
3. **API design** - `planning/api-design.md` to see the full REST API surface
4. **Page design** - `planning/page-design.md` to see the frontend structure
5. **Architecture** - `decisions/architecture-overview.md` for the full system picture
6. **Backend decisions** - `decisions/backend-decisions.md` for technology choices
7. **Frontend decisions** - `decisions/frontend-decisions.md` for UX and scope choices
8. **AI prompts** - `ai-usage/ai-prompts.md` to see real prompts used during development
9. **AI tools** - `ai-usage/ai-tools.md` to see which tools were used and how
10. **AI reflection** - `ai-usage/ai-reflection.md` for an honest assessment of AI usage

---

## Summary

KiwiDrive was built as a solo project over the MSA 2026 Phase 2 assessment period.
AI tools were central to the development workflow - used for planning, code generation,
debugging, and documentation. Every piece of AI-generated output was reviewed,
understood, and often modified before being committed. The developer maintained full
understanding of the codebase throughout, using AI as a force multiplier rather than
a replacement for engineering judgment.

The result is a full-stack gamified web application with a clean architecture,
real security measures, and a polished user experience built on a focused core loop:
answer questions -> earn XP -> climb the leaderboard -> unlock achievements.

