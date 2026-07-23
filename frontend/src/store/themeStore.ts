// src/store/themeStore.ts
import { create } from 'zustand'

interface ThemeState {
  isDark: boolean
  toggleDark: () => void
}

function applyTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const savedPreference = localStorage.getItem('kiwidrive_theme') === 'dark'
applyTheme(savedPreference)

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: savedPreference,
  toggleDark: () => {
    const next = !get().isDark
    localStorage.setItem('kiwidrive_theme', next ? 'dark' : 'light')
    applyTheme(next)
    set({ isDark: next })
  },
}))