# Project Overview

## What is KiwiDrive?

KiwiDrive is a gamified web app that helps New Zealanders study for their
learner licence theory test.

Core loop: answer questions -> earn XP -> level up -> maintain streaks -> unlock achievements -> climb the leaderboard.

## Prompts Used

This is the Microsoft Student Acceleration Project 2026 phase 2, can you pls read through the instruction file I sent to you and after that ask me a question, while helping both of us understand better with the project and coming up with some ideas.

After all, the first few things pop out are Duolingo and the fitness of Apple. I am considering a web application that records and encourages people to work out, after a amount of kcal reach then they can continue a streak. Such as that.

What about a driving licence application? I have seen the function of The application Driver, which suits our topic, and we can inject the idea of gamification to make a driver type Duolingo.

## Design Decisions

### 1. Architecture - Repository Pattern + Service Layer
I chose to separate the data access layer (Repository) from the business
logic layer (Service) to keep the code clean and testable. This means
controllers don't touch the database directly.

### 2. Database - SQLite over PostgreSQL
For a showcase project with a small dataset, SQLite is simpler to set up
and deploy. No separate database server needed, which reduces complexity.

### 3. Authentication - JWT over Session
JWT is stateless, which works well for a REST API consumed by a React
frontend. It also allows the token to carry role claims (User/Admin)
without extra database lookups.

### 4. Password Security - BCrypt
BCrypt automatically handles salting and is resistant to brute force
attacks. Industry standard for password hashing.

### 5. API Documentation - Scalar over Swagger
Scalar provides a cleaner, more modern UI compared to Swagger. Also
required by the MSA assessment.

### 6. Streak Logic
Streak is only incremented when a user answers correctly on a new day.
LastStreakDate tracks the last activity date. If more than 1 day passes
without activity, streak resets to 1.

### 7. Achievement System
Achievements are checked automatically after every correct answer.
XP-based achievements use a threshold check. The "7 Day Streak"
achievement uses streak count instead of XP.

### 8. Gamification Theme
Applied HCI gamification principles: points (XP), levels, streaks,
badges (achievements), and leaderboard. Dark mode triggers Night Driving
questions as a creative UX twist.
