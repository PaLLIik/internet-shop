// Тесты состояния входа: окно открывается и закрывается, выход очищает пользователя
import { describe, expect, it } from 'vitest'
import reducer, { closeAuthModal, logout, openAuthModal } from './authSlice'

// Состояние со вошедшим пользователем
const loggedIn = {
  user: { username: 'mor_2314' },
  token: 'token',
  isModalOpen: false,
  status: 'idle' as const,
  error: null,
}

describe('authSlice', () => {
  it('открывает и закрывает окно входа', () => {
    let state = reducer(loggedIn, openAuthModal())
    expect(state.isModalOpen).toBe(true)
    state = reducer(state, closeAuthModal())
    expect(state.isModalOpen).toBe(false)
  })

  it('выход очищает пользователя и токен', () => {
    const state = reducer(loggedIn, logout())
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })
})
