import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AuthResponse, User } from '../types'

vi.mock('../api/auth')
vi.mock('../utils/jwt')

import * as authApi from '../api/auth'
import { extractRoleFromToken } from '../utils/jwt'
import { useAuthStore } from './authStore'

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    username: 'alex',
    email: 'alex@example.com',
    xp: 0,
    level: 1,
    streak: 0,
    ...overrides,
  }
}

function createMockAuthResponse(overrides: Partial<AuthResponse> = {}): AuthResponse {
  return {
    token: 'fake-token',
    user: createMockUser(),
    ...overrides,
  }
}

const DEFAULT_STATE = {
  user: null,
  token: null,
  isAuthenticated: false,
  isGuest: false,
  isAdmin: false,
}

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState(DEFAULT_STATE)
    localStorage.clear()
    vi.restoreAllMocks()
  })

  // 1. Module initialization reads localStorage exactly once, at import time.
  describe('module initialization', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    it('is unauthenticated with no token and not admin when localStorage is empty', async () => {
      localStorage.clear()

      const { useAuthStore: freshStore } = await import('./authStore')
      const state = freshStore.getState()

      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isAdmin).toBe(false)
    })

    it('is authenticated and admin when localStorage holds a token that resolves to the Admin role', async () => {
      localStorage.setItem('kiwidrive_token', 'admin-token')
      vi.mocked(extractRoleFromToken).mockReturnValue('Admin')

      const { useAuthStore: freshStore } = await import('./authStore')
      const state = freshStore.getState()

      expect(state.isAuthenticated).toBe(true)
      expect(state.isAdmin).toBe(true)
    })

    it('is authenticated but not admin when localStorage holds a token that resolves to a non-Admin role', async () => {
      localStorage.setItem('kiwidrive_token', 'user-token')
      vi.mocked(extractRoleFromToken).mockReturnValue('User')

      const { useAuthStore: freshStore } = await import('./authStore')
      const state = freshStore.getState()

      expect(state.isAuthenticated).toBe(true)
      expect(state.isAdmin).toBe(false)
    })
  })

  // 2. login success path.
  it('login success updates user, token and auth flags, and persists the token', async () => {
    const response = createMockAuthResponse({ token: 'user-token' })
    vi.mocked(authApi.login).mockResolvedValue(response)
    vi.mocked(extractRoleFromToken).mockReturnValue('User')

    await useAuthStore.getState().login('alex@example.com', 'password123')

    const state = useAuthStore.getState()
    expect(state.user).toEqual(response.user)
    expect(state.token).toBe('user-token')
    expect(state.isAuthenticated).toBe(true)
    expect(state.isGuest).toBe(false)
    expect(state.isAdmin).toBe(false)
    expect(localStorage.getItem('kiwidrive_token')).toBe('user-token')
  })

  it('login success sets isAdmin to true when the token resolves to the Admin role', async () => {
    const response = createMockAuthResponse({ token: 'admin-token' })
    vi.mocked(authApi.login).mockResolvedValue(response)
    vi.mocked(extractRoleFromToken).mockReturnValue('Admin')

    await useAuthStore.getState().login('admin@example.com', 'password123')

    expect(useAuthStore.getState().isAdmin).toBe(true)
  })

  // 3. login from a guest session must clear the guest flag.
  it('login from guest state clears isGuest', async () => {
    useAuthStore.setState({ isAuthenticated: true, isGuest: true, user: null, token: null, isAdmin: false })

    vi.mocked(authApi.login).mockResolvedValue(createMockAuthResponse())
    vi.mocked(extractRoleFromToken).mockReturnValue('User')

    await useAuthStore.getState().login('alex@example.com', 'password123')

    expect(useAuthStore.getState().isGuest).toBe(false)
  })

  // 4. login failure must not mutate state or persist a token.
  it('login failure leaves state unchanged and rejects', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('Invalid credentials'))

    await expect(useAuthStore.getState().login('alex@example.com', 'wrong')).rejects.toThrow('Invalid credentials')

    expect(useAuthStore.getState()).toMatchObject(DEFAULT_STATE)
    expect(localStorage.getItem('kiwidrive_token')).toBeNull()
  })

  // 5. register success path (mirrors login success; one path is enough per the note).
  it('register success updates user, token and auth flags, and persists the token', async () => {
    const response = createMockAuthResponse({ token: 'new-user-token' })
    vi.mocked(authApi.register).mockResolvedValue(response)
    vi.mocked(extractRoleFromToken).mockReturnValue('User')

    await useAuthStore.getState().register('alex', 'alex@example.com', 'password123')

    const state = useAuthStore.getState()
    expect(state.user).toEqual(response.user)
    expect(state.token).toBe('new-user-token')
    expect(state.isAuthenticated).toBe(true)
    expect(state.isGuest).toBe(false)
    expect(state.isAdmin).toBe(false)
    expect(localStorage.getItem('kiwidrive_token')).toBe('new-user-token')
  })

  // 6. register failure must not mutate state.
  it('register failure leaves state unchanged and rejects', async () => {
    vi.mocked(authApi.register).mockRejectedValue(new Error('Email already exists'))

    await expect(
      useAuthStore.getState().register('alex', 'alex@example.com', 'password123')
    ).rejects.toThrow('Email already exists')

    expect(useAuthStore.getState()).toMatchObject(DEFAULT_STATE)
    expect(localStorage.getItem('kiwidrive_token')).toBeNull()
  })

  // 7. continueAsGuest overrides any previous session and never touches localStorage.
  it('continueAsGuest from a logged-in state overrides it with guest state', () => {
    useAuthStore.setState({
      user: createMockUser(),
      token: 'stale-token',
      isAuthenticated: true,
      isGuest: false,
      isAdmin: true,
    })
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')

    useAuthStore.getState().continueAsGuest()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.isGuest).toBe(true)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAdmin).toBe(false)
    expect(setItemSpy).not.toHaveBeenCalled()
    expect(removeItemSpy).not.toHaveBeenCalled()
  })

  // 8. logout from a logged-in state clears everything and removes the persisted token.
  it('logout from a logged-in state clears all fields and removes the token', () => {
    localStorage.setItem('kiwidrive_token', 'user-token')
    useAuthStore.setState({
      user: createMockUser(),
      token: 'user-token',
      isAuthenticated: true,
      isGuest: false,
      isAdmin: true,
    })

    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isGuest).toBe(false)
    expect(state.isAdmin).toBe(false)
    expect(localStorage.getItem('kiwidrive_token')).toBeNull()
  })

  // 9. logout also has to work when called from a guest session, not just a logged-in one.
  it('logout from a guest state clears isGuest', () => {
    useAuthStore.getState().continueAsGuest()

    useAuthStore.getState().logout()

    expect(useAuthStore.getState()).toMatchObject(DEFAULT_STATE)
  })
})
