# AI Prompts Used During Development

## Planning & Ideation

This is the Microsoft Student Acceleration Project 2026 phase 2, can you pls read through the instruction file I sent to you and after that ask me a question, while helping both of us understand better with the project and coming up with some ideas.

After all, the first few things pop out are Duolingo and the fitness of Apple. I am considering a web application that records and encourages people to work out, after a amount of kcal reach then they can continue a streak. Such as that.

What about a driving licence application? I have seen the function of The application Driver, which suits our topic, and we can inject the idea of gamification to make a driver type Duolingo.

---

## Architecture & Feature Planning

Base on my idea and low-fi design to the proj, what are the best three feature you are most recommend? I currently prefer Docker, dark/light mode, zustand. Easy fast and vision good.

I have planned this data schema, please review it. I consider it a MVP therefore these are the basic models I need. Let me know if you have a better idea or if there is an unnecessary entity: users, questions, categories, userprogress, studysessions, answerrecord, achievements.

Keep it simple, focus on the core loop: answer questions -> earn score -> leaderboard -> badges. That is enough.

---

## Backend Implementation

I want to implement a streak system for my quiz app. Users should gain streak when they answer questions on consecutive days. If they miss a day, streak resets to 1. I might need a new service to deal that request instead of use the current attribute in user table called last login day, coz i need to track they are answering the question correct of the day.

I want to implement JWT authentication in my .NET 10 Web API. I need register and login endpoints that return a JWT token. The token should contain userId, email, username and role claims. How do I implement this with BCrypt password hashing? And pls give a example of the bcrypt sample also told me how does this work.

I want to automatically unlock achievements when users reach XP milestones. For example: 100 XP unlocks "Road Rookie", 500 XP unlocks "Street Smart". How do I implement this in my QuestionService after a correct answer? Should i add a parameter to catch this then refer to the achievement service? Or should i deal it directly in the question service layer?

My backend has a bug - users streak is not resetting even after 3 days of no activity. The LastStreakDate field is not being updated after each correct answer. How do I fix this?

---

## Frontend Implementation

I am building a quiz page in React with TypeScript. When a user answers a question, I need to show XP animation, update the score, and fetch the next question. How should I structure the component and manage state with Zustand?

I need to implement a protected route in React Router v6 that redirects unauthenticated users to /auth when they force add the /admin in the url. How do I implement this?

Wonder will the guest be able to submit the question, and i am planning to design for a try on button, but that will cause too many change to my backend, coz that wasn't on my plan, can you pls check out what file i will need to change, then i can consider if i want add this feature to my project.

---

## Debugging

Found CORS preflight failing. Root cause found via AI-guided diagnosis: macOS AirPlay Receiver was occupying port 5000, not a real CORS misconfiguration. Fix: moved backend to port 5165, updated frontend .env.

While debugging, I found and fixed the same vulnerability pattern in five separate backend methods (SubmitAnswer, GetUserAchievements, and three methods in UserController): each parsed the user ID from the JWT claims without an [Authorize] attribute guarding the endpoint. After finding this pattern the second time, I proactively checked the rest of the codebase for the same issue.

---

## Scope Decisions (AI-assisted)

I decided to keep existing XP-milestone achievements rather than build UserProgress tracking + quiz-session concept + leaderboard-triggered checks, given time constraints - documented as a deliberate scope decision.
