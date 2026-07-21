// src/api/questions.ts
import { apiRequest } from './client'
import type { Question, AnswerResult } from '../types'

export function getQuestions() {
  return apiRequest<Question[]>('/api/questions')
}

export function submitAnswer(questionId: number, answer: 'A' | 'B' | 'C' | 'D') {
  return apiRequest<AnswerResult>('/api/questions/answer', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ questionId, answer }),
  })
}