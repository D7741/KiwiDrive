# Backend Design Decisions

## Prompts Used

Base on my idea and low-fi design to the proj, what are the best three feature you are most recommend? I currently prefer Docker, dark/light mode, zustand. Easy fast and vision good.

I have planned this data schema, please review it. I consider it a MVP therefore these are the basic models I need. Let me know if you have a better idea or if there is an unnecessary entity: users, questions, categories, userprogress, studysessions, answerrecord, achievements.

I want to implement a streak system for my quiz app. Users should gain streak when they answer questions on consecutive days. If they miss a day, streak resets to 1. I might need a new service to deal that request instead of use the current attribute in user table called last login day, coz i need to track they are answering the question correct of the day.

I want to implement JWT authentication in my .NET 10 Web API. I need register and login endpoints that return a JWT token. The token should contain userId, email, username and role claims. How do I implement this with BCrypt password hashing? And pls give a example of the bcrypt sample also told me how does this work.

I want to automatically unlock achievements when users reach XP milestones. For example: 100 XP unlocks "Road Rookie", 500 XP unlocks "Street Smart". How do I implement this in my QuestionService after a correct answer? Should i add a parameter to catch this then refer to the achievement service? Or should i deal it directly in the question service layer?

---

## 1. Framework - C# .NET 10 Web API
I chose .NET 10 Web API because it is required by the MSA assessment and
provides a robust, high-performance framework for building REST APIs.
The minimal API style in Program.cs keeps the entry point clean.

## 2. Architecture - Repository Pattern + Service Layer
I separated the codebase into four distinct layers:
- Controllers - Handle HTTP requests and responses
- Services - Contain business logic (XP calculation, streak tracking, achievement unlocking)
- Repositories - Handle all database operations
- Models/DTOs - Define data structures

This separation ensures each layer has a single responsibility, making
the code easier to maintain and test.

## 3. Why Repository Pattern over direct DbContext in Services?
Directly injecting DbContext into Services would tightly couple business
logic to the database implementation. The Repository pattern abstracts
data access, meaning if we switch from SQLite to PostgreSQL in the future,
only the Repository layer needs to change.

## 4. Database - SQLite with EF Core
SQLite was chosen for its simplicity - no separate database server is
required, making local development and Docker deployment straightforward.
EF Core handles migrations, relationships, and seeding automatically.

## 5. Authentication - JWT Bearer Tokens
JWT (JSON Web Token) was chosen over session-based authentication because:
- It is stateless - the server doesn't need to store session data
- The token carries claims (userId, email, role) that controllers can
  read without extra database queries
- Works seamlessly with a React frontend

## 6. Password Security - BCrypt
BCrypt was chosen for password hashing because:
- It automatically generates and stores a salt
- It is computationally expensive, making brute force attacks impractical
- Industry standard for password storage

## 7. API Documentation - Scalar over Swagger
Scalar provides a cleaner, more modern API documentation UI compared to
the default Swagger UI. It is also explicitly required by the MSA
assessment specification.

## 8. Data Seeding Strategy
Two different seeding strategies were used:
- CategorySeeder and AchievementSeeder use EF Core's HasData() method,
  seeding data during migrations. This is appropriate for static, fixed
  data that never changes.
- QuestionSeeder reads from a questions.json file at application startup.
  This keeps question data separate from migration history and makes it
  easy to add or update questions without new migrations.

## 9. Streak Logic
The streak system tracks LastStreakDate on the User model:
- Answer correct today, answered yesterday -> Streak + 1
- Answer correct today, missed yesterday -> Streak resets to 1
- Answer correct today, already answered today -> No change

This ensures streaks accurately reflect consecutive daily activity.

## 10. Achievement System
Achievements are checked automatically after every correct answer in
QuestionService.SubmitAnswerAsync(). Two types of achievements exist:
- XP-based - Unlocked when user XP reaches a threshold
- Streak-based - The "7 Day Streak" achievement is checked against
  the current streak count instead of XP

## 11. Role-Based Access Control
A Role field on the User model distinguishes between "User" and "Admin".
The role is embedded in the JWT token as a claim, allowing the frontend
to conditionally show the Admin page and the backend to protect admin
endpoints with authorization checks.

## 12. Error Handling - Global Exception Middleware
Instead of wrapping every controller method in try/catch blocks, a global
ExceptionMiddleware catches all unhandled exceptions and returns a
consistent JSON error response with the appropriate HTTP status code.
This keeps controllers clean and ensures a uniform error format across
the API.

## 13. CORS Configuration
CORS is configured to allow requests from the React frontend origin.
In development this is http://localhost:5173 (Vite default). In
production the frontend deployment URL is added to the allowed origins.

## 14. Docker
Both frontend and backend are containerised using Docker. A
docker-compose.yml at the root level allows the entire stack to be
started with a single command:
```bash
docker-compose up --build
```
This ensures consistent behaviour across different development environments
and simplifies deployment.
