// Тесты избранного: добавление и удаление по переключению
import { describe, expect, it } from 'vitest'
import reducer, { toggleFavorite } from './favoritesSlice'

describe('favoritesSlice', () => {
  it('добавляет товар, если его не было', () => {
    const state = reducer({ ids: [] }, toggleFavorite(5))
    expect(state.ids).toEqual([5])
  })

  it('убирает товар, если он уже в избранном', () => {
    const state = reducer({ ids: [5, 7] }, toggleFavorite(5))
    expect(state.ids).toEqual([7])
  })
})
