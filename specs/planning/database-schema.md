# Database Schema

## Overview

KiwiDrive uses SQLite with Entity Framework Core. The schema is designed
around the core game loop: answer questions -> earn XP -> unlock achievements
-> climb the leaderboard.

## Tables

### Users
| Column | Type | Description |
|---|---|---|
| Id | int (PK) | Auto-increment primary key |
| Username | string | Unique display name |
| Email | string | Unique email address |
| PasswordHash | string | BCrypt hashed password |
| XP | int | Total experience points earned |
| Level | int | Current level (derived from XP) |
| Streak | int | Current consecutive day streak |
| Role | string | "User" or "Admin" |
| LastStreakDate | DateTime? | Last date user answered correctly |
| LastLoginDate | DateTime | Last login timestamp |
| CreatedAt | DateTime | Account creation timestamp |

### Questions
| Column | Type | Description |
|---|---|---|
| Id | int (PK) | Auto-increment primary key |
| Text | string | Question text |
| OptionA | string | Answer option A |
| OptionB | string | Answer option B |
| OptionC | string | Answer option C |
| OptionD | string | Answer option D |
| CorrectAnswer | string | Correct answer ("A", "B", "C", or "D") |
| Explanation | string | Explanation shown after answering |
| CategoryId | int (FK) | Foreign key to Categories |

### Categories
| Column | Type | Description |
|---|---|---|
| Id | int (PK) | Auto-increment primary key |
| Name | string | Category name |
| Icon | string | Emoji icon |

**Seeded categories:**
```
1 - Road Signs         - Traffic light emoji
2 - Speed Limits       - Lightning emoji
3 - Give Way Rules     - No entry emoji
4 - Parking            - Parking emoji
5 - Alcohol & Drugs    - Beer emoji
6 - Night Driving      - Moon emoji
```

### Achievements
| Column | Type | Description |
|---|---|---|
| Id | int (PK) | Auto-increment primary key |
| Name | string | Achievement name |
| Description | string | How to unlock |
| Icon | string | Emoji icon |
| XPRequired | int | XP threshold (0 = not XP-based) |

**Seeded achievements:**
```
1 - First Steps    - 10 XP required
2 - Road Rookie    - 100 XP required
3 - Street Smart   - 500 XP required
4 - Road Master    - 1000 XP required
5 - 7 Day Streak   - Streak-based (XPRequired = 0)
6 - Night Owl      - Complete a night driving quiz
```

### UserAchievements
| Column | Type | Description |
|---|---|---|
| Id | int (PK) | Auto-increment primary key |
| UserId | int (FK) | Foreign key to Users |
| AchievementId | int (FK) | Foreign key to Achievements |
| EarnedAt | DateTime | When the achievement was unlocked |

### UserProgress
| Column | Type | Description |
|---|---|---|
| Id | int (PK) | Auto-increment primary key |
| UserId | int (FK) | Foreign key to Users |
| CategoryId | int (FK) | Foreign key to Categories |
| TotalAnswered | int | Total questions answered in category |
| TotalCorrect | int | Total correct answers in category |

---

## Relationships

```
Users ─────────────── UserAchievements ─────────────── Achievements
  |                                                          
  └─────────────── UserProgress ─────────────── Categories
                                                      |
                                                  Questions
```

- User has many UserAchievements
- User has many UserProgresses
- Achievement has many UserAchievements
- Category has many Questions
- Category has many UserProgresses

---

## Seeding Strategy

| Table | Strategy | When |
|---|---|---|
| Categories | EF Core HasData() | During migration |
| Achievements | EF Core HasData() | During migration |
| Questions | JSON file seeder | On app startup |
| Users | Not seeded | Created via register endpoint |
