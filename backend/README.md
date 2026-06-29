# 🥝 KiwiDrive - NZ Learner Licence Practice App

A gamified full-stack web application to help New Zealanders prepare for their learner licence theory test.

## 🚀 Deployment

- **Frontend:** Coming soon
- **Backend API:** Coming soon
- **Scalar API Docs:** Coming soon

---

## 📖 Introduction

KiwiDrive is a gamified study platform designed to help users prepare for the New Zealand learner licence theory test. Instead of boring flashcards, KiwiDrive turns studying into an engaging experience — earn XP, level up, unlock badges, and compete on the leaderboard as you master the NZ Road Code.

---

## 🎮 Theme — Gamification

KiwiDrive applies gamification principles to the real-world challenge of studying for the NZ learner licence test. The core game loop is:

**Answer Questions → Earn XP → Climb the Leaderboard → Unlock Achievements**

Key gamification elements include:

- **XP & Levelling** — earn experience points for every correct answer and level up as you improve
- **Streaks** — maintain daily practice streaks to stay motivated
- **Achievements & Badges** — unlock badges for hitting milestones (e.g. "Road Sign Master", "Perfect Round")
- **Leaderboard** — compete against other learners to see who knows the Road Code best
- **Night Driving Mode** — switch to dark mode to unlock a special night driving question set 🌙

---

## ⭐ What Makes KiwiDrive Unique

- **Real-world utility** — directly helps NZ learners pass their theory test
- **Night Driving Mode** — a creative twist where dark mode unlocks night-specific driving questions, combining UX preference with gamification
- **Clean core loop** — focused, polished experience rather than feature overload
- **NZ-specific** — built for Kiwis, with locally relevant questions and Road Code content

---

## ✅ Advanced Features

- [x] **Dark / Light Mode** — theme switching with a creative Night Driving Mode twist
- [x] **Zustand** — global state management for quiz sessions, XP, streaks and theme
- [x] **Docker** — fully containerised frontend and backend for consistent deployment

> Note: Only the above 3 advanced features are submitted for marking.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| State Management | Zustand |
| Styling | Tailwind CSS |
| Routing | React Router |
| Backend | C# + .NET 10 |
| ORM | Entity Framework Core |
| Database | SQLite |
| API Docs | Scalar |
| Containerisation | Docker |
| Deployment | Azure |

---

## 🤖 AI Usage

AI tools including Claude and GitHub Copilot were used throughout this project to support:

- Planning and architecture decisions
- Generating question seed data
- Writing and debugging code
- Writing documentation

All AI-generated outputs were critically reviewed and adapted. See the `/specs` folder for AI prompts and planning documents used during development.

---

## 🔁 Self Reflection

If I were to do this project again, I would:

- Set up the project structure and CI/CD pipeline earlier
- Write unit tests alongside features rather than at the end
- Spend more time on UI/UX design planning before jumping into code
- Start with a smaller question dataset and expand iteratively

---

## 📁 Repository Structure

```
KiwiDrive/
├── backend/                # C# .NET 10 Web API
│   ├── Controllers/        # API route handlers
│   ├── Models/             # Entity models (User, Question, etc.)
│   ├── Data/               # DbContext and database seeding
│   ├── DTOs/               # Data Transfer Objects
│   ├── Services/           # Business logic layer
│   ├── Properties/         # Launch settings
│   ├── KiwiDrive.csproj    # Project configuration
│   └── Program.cs          # App entry point
├── frontend/               # React + TypeScript (see frontend/README.md)
├── specs/                  # AI prompts and planning docs
└── README.md
```

---

## 🔧 Backend Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | C# + .NET 10 Web API |
| ORM | Entity Framework Core 10 |
| Database | SQLite |
| API Documentation | Scalar (replaces Swagger) |
| Containerisation | Docker |

### Project Structure

**`Models/`** — Entity classes that map directly to database tables:
- `User` — stores user account info, XP, level and streak
- `Question` — quiz questions with 4 options, correct answer and explanation
- `Category` — question categories (e.g. Road Signs, Speed Limits, Parking)
- `UserProgress` — tracks how many questions a user has answered per category
- `Achievement` — badge definitions with XP requirements
- `UserAchievement` — junction table linking users to earned achievements

**`Data/`** — Contains `AppDbContext` (EF Core) and seed data for questions and categories

**`Controllers/`** — REST API endpoints following CRUD principles:
- `UsersController` — register, login, get profile
- `QuestionsController` — get questions by category
- `LeaderboardController` — get ranked users by XP
- `AchievementsController` — get achievements and user badges
- `UserProgressController` — update and retrieve user progress

**`DTOs/`** — Data Transfer Objects to control what data is exposed via the API

**`Services/`** — Business logic including XP calculation, streak tracking and achievement unlocking

### API Documentation

Scalar API documentation is available at `/scalar/v1` when running the backend locally.
