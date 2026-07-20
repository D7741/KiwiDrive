// src/types/index.ts

export interface User {
  id: string
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
  id: string
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
  id: string
  name: string
  description: string
  icon: string
  isUnlocked: boolean
}

export interface ApiError {
  message: string
}