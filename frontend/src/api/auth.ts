// src/api/auth.ts
import { apiRequest } from './client'
import type { AuthResponse, User } from '../types'

export function register(username: string, email: string, password: string) {
  return apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })
}

export function login(email: string, password: string) {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function getProfile() {
  return apiRequest<User>('/api/users/profile', { auth: true })
}

export function updateProfile(username: string, email: string) {
  return apiRequest<User>('/api/users/profile', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify({ username, email }),
  })
}

export function deleteProfile() {
  return apiRequest<void>('/api/users/profile', {
    method: 'DELETE',
    auth: true,
  })
}