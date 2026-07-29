# Architecture Overview

## System Architecture

```
Browser (React + TypeScript)
        |
        | HTTP / REST API
        |
.NET 10 Web API
        |
        |-- Controllers  (HTTP layer)
        |-- Services     (business logic)
        |-- Repositories (data access)
        |
SQLite Database (via EF Core)
```

---

## Frontend Architecture

```
src/
├── components/      - Reusable UI components
├── pages/           - Page-level components
├── stores/          - Zustand state management
│   ├── authStore    - User auth state and token
│   ├── quizStore    - Active quiz session state
│   └── themeStore   - Dark/light mode preference
├── services/        - Axios API calls
│   ├── authService
│   ├── questionService
│   ├── leaderboardService
│   └── achievementService
├── types/           - TypeScript interfaces
└── router/          - React Router configuration
```

---

## Backend Architecture

```
Controllers/
├── AuthController        - POST /api/auth/register, login
├── UserController        - GET/PUT/DELETE /api/users/profile
├── QuestionController    - GET /api/questions, POST /api/questions/answer
├── LeaderboardController - GET /api/leaderboard
├── AchievementController - GET /api/achievements
└── AdminController       - CRUD /api/admin/questions

Services/
├── UserService           - Auth logic, JWT generation, profile management
├── QuestionService       - Answer checking, XP awarding, streak updates
└── AchievementService    - Achievement checking and unlocking

Repositories/
├── UserRepository        - User CRUD, leaderboard query
├── QuestionRepository    - Question CRUD, random and category queries
└── AchievementRepository - Achievement CRUD, user achievement management

Data/
├── AppDbContext          - EF Core DbContext
└── Seeders/
    ├── CategorySeeder    - Seeds 6 fixed categories
    ├── AchievementSeeder - Seeds 6 achievements
    └── QuestionSeeder    - Seeds questions from questions.json

Models/
├── User
├── Question
├── Category
├── Achievement
├── UserAchievement
└── UserProgress

Middleware/
└── ExceptionMiddleware   - Global error handling
```

---

## Data Flow - Answer Submission

```
1. User selects answer on frontend
2. POST /api/questions/answer { questionId, answer }
3. QuestionController receives request
4. Extracts userId from JWT claims
5. QuestionService.SubmitAnswerAsync()
   a. Fetches question from QuestionRepository
   b. Compares answer to CorrectAnswer
   c. If correct:
      - Adds 10 XP via UserRepository.UpdateUserXPAsync()
      - Updates streak via UpdateStreakOnCorrectAnswerAsync()
      - Checks and unlocks achievements via AchievementRepository
6. Returns AnswerResultDto { isCorrect, correctAnswer, explanation, xpEarned }
7. Frontend shows result + XP animation
```

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| State Management | Zustand |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | C# .NET 10 Web API |
| ORM | Entity Framework Core 10 |
| Database | SQLite |
| Authentication | JWT Bearer Tokens |
| Password Hashing | BCrypt |
| API Documentation | Scalar |
| Containerisation | Docker + docker-compose |
| Deployment | Azure (Static Web Apps + App Service) |
