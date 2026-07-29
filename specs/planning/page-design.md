# Page Design & Route Planning

## Route Structure

```
/                  - Landing Page (public)
/auth              - Login / Register (public)
/dashboard         - Dashboard (protected)
/quiz              - Quiz (protected)
/leaderboard       - Leaderboard (protected)
/achievements      - Achievements (protected)
/profile           - Profile (protected)
/admin             - Admin (admin only)
```

---

## Pages

### Landing Page /
- KiwiDrive logo and tagline
- "Start Practicing" button -> /auth
- Brief intro to gamification features (XP, badges, leaderboard)
- Call to action for guests to sign up

### Auth Page /auth
- Tab switcher: Login | Register
- Login form: email, password
- Register form: username, email, password
- Guest mode button (limited access)

### Dashboard /dashboard
- Welcome back message with username
- Current XP, Level, Streak display
- Start Quiz button
- Category selector (Road Signs, Speed Limits, etc.)
- Recent achievements preview
- Quick leaderboard preview (top 3)

### Quiz Page /quiz
- Question text display
- 4 answer options (A, B, C, D)
- XP animation on correct answer
- Explanation shown after answering
- Progress indicator
- Next question button
- Night Driving mode (triggered by dark mode)

### Leaderboard Page /leaderboard
- Global leaderboard
- Top 100 users ranked by XP
- Current user highlighted
- Rank, Username, XP, Level, Streak columns

### Achievements Page /achievements
- All achievements displayed as badges
- Locked vs unlocked visual distinction
- Achievement unlock celebration (modal + confetti)
- XP-based and streak-based achievements

### Profile Page /profile
- User avatar and username
- XP, Level, Streak stats
- Edit profile (username, email)
- Change password
- Earned badges display

### Admin Page /admin
- Question management table
- Create new question form
- Edit existing question
- Delete question
- Category filter

---

## Navigation

Navbar visible on all pages except Landing and Auth:
```
Logo | Dashboard | Quiz | Leaderboard | Achievements | Profile | (Admin)
                                                               Theme Toggle
```

---

## Route Guards

| Route | Guard |
|---|---|
| /dashboard, /quiz, /profile | ProtectedRoute - redirect to /auth if not logged in |
| /admin | AdminRoute - redirect to /dashboard if not Admin |
| /leaderboard, /achievements | Accessible to guests (read only) |
