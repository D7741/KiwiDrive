// src/api/admin.ts
import { apiRequest } from './client'
import type { Question } from '../types'

export interface QuestionFormData {
  text: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanation: string
  categoryId: number
}

export function createQuestion(data: QuestionFormData) {
  return apiRequest<Question>('/api/admin/questions', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(data),
  })
}

export function updateQuestion(id: number, data: QuestionFormData) {
  return apiRequest<Question>(`/api/admin/questions/${id}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(data),
  })
}

export function deleteQuestion(id: number) {
  return apiRequest<void>(`/api/admin/questions/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}