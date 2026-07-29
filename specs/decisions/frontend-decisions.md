# Frontend Design Decisions

## Prompts Used

I am building a quiz page in React with TypeScript. When a user answers a
question, I need to show XP animation, update the score, and fetch the next
question. How should I structure the component and manage state with Zustand?

I need to implement a protected route in React Router v6 that redirects
unauthenticated users to /auth when they force add the /admin in the url. How do I implement this?

Wonder will the guest be able to submit the question, and i am planning to design for a try on button, but that will cause too many change to my backend, coz that wasn't on my plan, can you pls check out what file i will need to change, then i can consider if i want add this feature to my project.

I decided to keep existing XP-milestone achievements rather than build UserProgress tracking + quiz-session concept + leaderboard-triggered checks, given time constraints - documented as a deliberate scope decision.

Found CORS preflight failing. Root cause found via AI-guided diagnosis: macOS AirPlay Receiver was occupying port 5000, not a real CORS misconfiguration. Fix: moved backend to port 5165, updated frontend .env.

---

## Product & Scope Decisions

### Authentication Methods
Chose email+password plus a Guest mode, and deliberately skipped Google
sign-in and RealMe (NZ government ID). RealMe in particular is a real
government identity integration that would have consumed disproportionate
development time for a project on a solo deadline.

### Guest Mode Restrictions
Guests can view the Dashboard, Leaderboard, and Achievements pages, but
are blocked from the Quiz page. Since answering questions writes XP and
streak data to the backend, and Guests have no account to persist that
data against, I chose to clearly block Quiz access for Guests rather than
build a separate local-only scoring experience that would duplicate logic
and diverge from the real feature.

### Leaderboard Scope
Implemented only a Global leaderboard, and skipped Friends/Following,
Regional, and Weekly-reset variants. These would each require additional
relational data or scheduled jobs, add real bug risk, and weren't going
to add marking value beyond a single well-implemented global ranking.

### Achievement System Scope
The original plan included 6 achievements (First Quiz Completed, Perfect
Score, Top 10 Leaderboard, 100 Questions Answered, All Categories
Attempted, 7-Day Streak). During implementation I discovered 5 of these
would require backend work that didn't exist yet (a UserProgress tracking
table that was never wired up, a "quiz session" concept the backend has
no notion of, and a leaderboard-rank-change trigger). Given the time
remaining, I chose to keep the existing XP-milestone achievement system
already in the codebase, and only wired up real unlock logic for
"7-Day Streak" (since the Streak field already existed and just needed
day-based comparison logic). This was a deliberate time-boxed trade-off
rather than an oversight.

---

## Visual & UX Decisions

### Tone of Voice
Chose a "Duolingo-esque, playful and encouraging" copy style over a
"Kiwi-casual with local slang" alternative, since the former is easier
to write consistently and the latter risks sounding forced if not done
natively.

### Responsive Design
Explicitly chose "both mobile and desktop, responsive" rather than
desktop-only, directly satisfying the assessment's basic requirement
that the UI "displays nicely on both computer and mobile."

### Achievement Unlock Celebration
Chose a medium-intensity celebration (modal with confetti) over a subtle
progress-bar-only animation or a full-screen takeover - balancing visual
impact worth showing in the demo video against implementation time.

### Achievements Page Data Honesty
The backend only exposes a boolean isUnlocked flag, with no progress
percentage for locked achievements. Rather than fabricate a fake progress
bar to match the original design mockup, I simplified the UI to accurately
reflect the real data the backend provides.

---

## Technical Architecture Decisions

### Dark Mode Implementation
Implemented theme switching using CSS custom properties (e.g.
--color-cream, --color-ink) that get reassigned under a .dark class
selector, rather than adding dark: variant classes to every individual
component. Since all existing components already referenced these semantic
color tokens instead of hardcoded values, this meant dozens of
already-built components gained dark mode support automatically, with no
per-component changes required.

### Streak Logic Design
Defined explicit, testable rules rather than a vague "add a streak
feature": a day counts as "checked in" only if the user answers at least
one question correctly that day; missing a day resets the streak to 1 on
the next correct answer, rather than to 0. This required adding a
dedicated LastStreakDate field (kept separate from the existing
LastLoginDate to avoid conflating login time with check-in date) and
comparing only the date component, ignoring time-of-day, to avoid
timezone/time-of-answer edge cases.

### Role-Based Access Control (RBAC)
Chose to decode the JWT's role claim directly on the frontend to determine
isAdmin status, rather than adding a separate "am I an admin" API call -
this avoids an extra network round-trip and reuses data already present
in the token issued at login.

---

## Security Fixes

While debugging, I found and fixed the same vulnerability pattern in five
separate backend methods (SubmitAnswer, GetUserAchievements, and three
methods in UserController): each parsed the user ID from the JWT claims
without an [Authorize] attribute guarding the endpoint, so an
unauthenticated request would throw an unhandled NullReferenceException
that got silently converted into an unhelpful 500 error instead of a
proper 401 Unauthorized. After finding this pattern the second time, I
proactively checked the rest of the codebase for the same issue rather
than fixing it one endpoint at a time as it came up.
