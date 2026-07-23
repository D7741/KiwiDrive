// src/store/authStore.ts
import { create } from 'zustand'
import type { User } from '../types'
import * as authApi from '../api/auth'
import { extractRoleFromToken } from '../utils/jwt'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isGuest: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  continueAsGuest: () => void
  logout: () => void
}

const initialToken = localStorage.getItem('kiwidrive_token')

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: initialToken,
  isAuthenticated: !!initialToken,
  isGuest: false,
  isAdmin: initialToken ? extractRoleFromToken(initialToken) === 'Admin' : false,

  login: async (email, password) => {
    const res = await authApi.login(email, password)
    localStorage.setItem('kiwidrive_token', res.token)
    set({
      user: res.user,
      token: res.token,
      isAuthenticated: true,
      isGuest: false,
      isAdmin: extractRoleFromToken(res.token) === 'Admin',
    })
  },

  register: async (username, email, password) => {
    const res = await authApi.register(username, email, password)
    localStorage.setItem('kiwidrive_token', res.token)
    set({
      user: res.user,
      token: res.token,
      isAuthenticated: true,
      isGuest: false,
      isAdmin: extractRoleFromToken(res.token) === 'Admin',
    })
  },

  continueAsGuest: () => {
    set({ isAuthenticated: true, isGuest: true, user: null, token: null, isAdmin: false })
  },

  logout: () => {
    localStorage.removeItem('kiwidrive_token')
    set({ user: null, token: null, isAuthenticated: false, isGuest: false, isAdmin: false })
  },
}))