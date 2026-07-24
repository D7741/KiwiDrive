import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useThemeStore } from './themeStore'

describe('themeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ isDark: false })
    document.documentElement.classList.remove('dark')
    localStorage.clear()
  })

  // 1. Module initialization with no / light preference.
  describe('module initialization', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    it('is not dark and applies no dark class when localStorage has no preference', async () => {
      localStorage.clear()

      const { useThemeStore: freshStore } = await import('./themeStore')

      expect(freshStore.getState().isDark).toBe(false)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('is not dark when localStorage preference is "light"', async () => {
      localStorage.setItem('kiwidrive_theme', 'light')

      const { useThemeStore: freshStore } = await import('./themeStore')

      expect(freshStore.getState().isDark).toBe(false)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    // 2. Module initialization with a saved dark preference.
    it('is dark and applies the dark class immediately when localStorage preference is "dark"', async () => {
      localStorage.setItem('kiwidrive_theme', 'dark')

      const { useThemeStore: freshStore } = await import('./themeStore')

      expect(freshStore.getState().isDark).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  // 3. toggleDark: light -> dark.
  it('toggleDark switches from light to dark and keeps state, localStorage and DOM in sync', () => {
    expect(useThemeStore.getState().isDark).toBe(false)

    useThemeStore.getState().toggleDark()

    expect(useThemeStore.getState().isDark).toBe(true)
    expect(localStorage.getItem('kiwidrive_theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  // 4. toggleDark: dark -> light.
  it('toggleDark switches from dark back to light and keeps state, localStorage and DOM in sync', () => {
    useThemeStore.setState({ isDark: true })
    document.documentElement.classList.add('dark')

    useThemeStore.getState().toggleDark()

    expect(useThemeStore.getState().isDark).toBe(false)
    expect(localStorage.getItem('kiwidrive_theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  // 5. Two toggles in a row return to the original state (proves it's a flip, not a fixed assignment).
  it('toggling twice returns to the original state, with DOM matching state throughout', () => {
    const initialIsDark = useThemeStore.getState().isDark

    useThemeStore.getState().toggleDark()
    useThemeStore.getState().toggleDark()

    const finalIsDark = useThemeStore.getState().isDark
    expect(finalIsDark).toBe(initialIsDark)
    expect(document.documentElement.classList.contains('dark')).toBe(finalIsDark)
  })

  // 6. localStorage stays in sync with state across repeated toggles.
  it('keeps localStorage in sync with isDark across repeated toggles', () => {
    for (let i = 0; i < 3; i++) {
      useThemeStore.getState().toggleDark()

      const { isDark } = useThemeStore.getState()
      expect(localStorage.getItem('kiwidrive_theme')).toBe(isDark ? 'dark' : 'light')
      expect(document.documentElement.classList.contains('dark')).toBe(isDark)
    }
  })
})
