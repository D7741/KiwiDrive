// src/store/authStore.ts
import { create } from 'zustand'
import type { User } from '../types'
import * as authApi from '../api/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isGuest: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  continueAsGuest: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('kiwidrive_token'),
  isAuthenticated: !!localStorage.getItem('kiwidrive_token'),
  isGuest: false,

  login: async (email, password) => {
    const res = await authApi.login(email, password)
    localStorage.setItem('kiwidrive_token', res.token)
    set({ user: res.user, token: res.token, isAuthenticated: true, isGuest: false })
  },

  register: async (username, email, password) => {
    const res = await authApi.register(username, email, password)
    localStorage.setItem('kiwidrive_token', res.token)
    set({ user: res.user, token: res.token, isAuthenticated: true, isGuest: false })
  },

  continueAsGuest: () => {
    set({ isAuthenticated: true, isGuest: true, user: null, token: null })
  },

  logout: () => {
    localStorage.removeItem('kiwidrive_token')
    set({ user: null, token: null, isAuthenticated: false, isGuest: false })
  },
}))