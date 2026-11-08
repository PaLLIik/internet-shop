// useDispatch отправляет действия, useSelector читает избранное из store
import { useDispatch, useSelector } from 'react-redux'
// Типы из store
import type { AppDispatch, RootState } from '../app/store'
// Действие добавления и удаления из избранного
import { toggleFavorite } from '../features/favorites/favoritesSlice'

interface FavoriteButtonProps {
  productId: number
}

// Кнопка-сердечко: пустое, если товара нет в избранном, и закрашенное, если есть
export default function FavoriteButton({ productId }: FavoriteButtonProps) {
  const dispatch = useDispatch<AppDispatch>()
  // Проверяем, лайкнут ли этот товар
  const isFavorite = useSelector((state: RootState) => state.favorites.ids.includes(productId))

  return (
    <button
      type="button"
      className={isFavorite ? 'favorite-button is-active' : 'favorite-button'}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
      onClick={() => dispatch(toggleFavorite(productId))}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.5z" />
      </svg>
    </button>
  )
}
