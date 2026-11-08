// Тест компонента: кнопка-сердечко переключает избранное и меняет подпись
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer from '../features/favorites/favoritesSlice'
import FavoriteButton from './FavoriteButton'

// Отдельный store только с избранным: компонент не зависит от остального приложения
function renderWithStore() {
  const store = configureStore({ reducer: { favorites: favoritesReducer } })
  render(
    <Provider store={store}>
      <FavoriteButton productId={3} />
    </Provider>,
  )
  return store
}

describe('FavoriteButton', () => {
  it('переключает избранное по клику', async () => {
    const user = userEvent.setup()
    const store = renderWithStore()

    const button = screen.getByRole('button', { name: 'Добавить в избранное' })
    await user.click(button)

    expect(store.getState().favorites.ids).toEqual([3])
    expect(screen.getByRole('button', { name: 'Убрать из избранного' })).toHaveAttribute('aria-pressed', 'true')
  })
})
