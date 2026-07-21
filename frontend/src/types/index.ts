// src/types/index.ts

export interface User {
  id: number
  username: string
  email: string
  xp: number
  level: number
  streak: number
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Question {
  id: number
  text: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  categoryName: string
}

export interface AnswerResult {
  isCorrect: boolean
  correctAnswer: string
  explanation: string
  xpEarned: number
}

export interface LeaderboardEntry {
  rank: number
  username: string
  xp: number
  level: number
  streak: number
}

export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  isUnlocked: boolean
}

export interface ApiError {
  message: string
}

export interface LeaderboardEntry {
  id: number
  rank: number
  username: string
  xp: number
  level: number
  streak: number
}