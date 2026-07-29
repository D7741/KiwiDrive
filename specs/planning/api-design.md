# API Design

## Base URL

- Development: `http://localhost:5165`
- Production: see README for deployment URL

## Authentication

Protected endpoints require a JWT Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Auth Endpoints

```
POST /api/auth/register
Request:  { username, email, password }
Response: { token, user: { id, username, email, xp, level, streak, role } }

POST /api/auth/login
Request:  { email, password }
Response: { token, user: { id, username, email, xp, level, streak, role } }
```

---

## User Endpoints

```
GET /api/users/profile
Header:   Authorization: Bearer {token}
Response: { id, username, email, xp, level, streak, role }

PUT /api/users/profile
Header:   Authorization: Bearer {token}
Request:  { username, email }
Response: { id, username, email, xp, level, streak, role }

PUT /api/users/password
Header:   Authorization: Bearer {token}
Request:  { currentPassword, newPassword }
Response: { message: "Password changed successfully." }

DELETE /api/users/profile
Header:   Authorization: Bearer {token}
Response: 204 No Content
```

---

## Question Endpoints

```
GET /api/questions
Response: [{ id, text, optionA, optionB, optionC, optionD, categoryName }]

GET /api/questions/random
Response: { id, text, optionA, optionB, optionC, optionD, categoryName }

GET /api/questions/category/{categoryId}
Response: [{ id, text, optionA, optionB, optionC, optionD, categoryName }]

POST /api/questions/answer
Header:   Authorization: Bearer {token}
Request:  { questionId, answer }
Response: { isCorrect, correctAnswer, explanation, xpEarned }
```

---

## Leaderboard Endpoints

```
GET /api/leaderboard
Response: [{ rank, username, xp, level, streak }]
```

---

## Achievement Endpoints

```
GET /api/achievements
Response: [{ id, name, description, icon, isUnlocked }]

GET /api/achievements/user
Header:   Authorization: Bearer {token}
Response: [{ id, name, description, icon, isUnlocked }]
```

---

## Admin Endpoints

```
POST /api/admin/questions
Header:   Authorization: Bearer {token} (Admin only)
Request:  { text, optionA, optionB, optionC, optionD, correctAnswer, explanation, categoryId }
Response: { id, text, optionA, optionB, optionC, optionD, categoryName }

PUT /api/admin/questions/{id}
Header:   Authorization: Bearer {token} (Admin only)
Request:  { text, optionA, optionB, optionC, optionD, correctAnswer, explanation, categoryId }
Response: { id, text, optionA, optionB, optionC, optionD, categoryName }

DELETE /api/admin/questions/{id}
Header:   Authorization: Bearer {token} (Admin only)
Response: 204 No Content
```

---

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 204 | Success - No Content (DELETE) |
| 400 | Bad Request - invalid input |
| 401 | Unauthorized - invalid or missing token |
| 403 | Forbidden - insufficient permissions |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Category IDs Reference

| ID | Name |
|---|---|
| 1 | Road Signs |
| 2 | Speed Limits |
| 3 | Give Way Rules |
| 4 | Parking |
| 5 | Alcohol & Drugs |
| 6 | Night Driving |
