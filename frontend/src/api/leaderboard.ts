// src/api/leaderboard.ts
import { apiRequest } from './client'
import type { LeaderboardEntry } from '../types'

export function getLeaderboard() {
  return apiRequest<LeaderboardEntry[]>('/api/leaderboard')
}