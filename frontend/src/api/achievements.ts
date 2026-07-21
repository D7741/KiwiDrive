// src/api/achievements.ts
import { apiRequest } from './client'
import type { Achievement } from '../types'

export function getUserAchievements() {
  return apiRequest<Achievement[]>('/api/achievements/user', { auth: true })
}