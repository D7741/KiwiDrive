// src/api/dashboard.ts
import { apiRequest } from './client'
import type { CategoryStat } from '../types'

export function getCategoryStats() {
  return apiRequest<CategoryStat[]>('/api/dashboard/category-stats', { auth: true })
}
