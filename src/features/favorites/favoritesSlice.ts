// createSlice создаёт состояние избранного и действия для него
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// Состояние избранного: только id товаров, сами товары берём из списка products
interface FavoritesState {
  ids: number[]
}

// Читаем сохранённый список из localStorage; если данные повреждены, начинаем с пустого
function loadSavedFavorites(): number[] {
  try {
    const raw = localStorage.getItem('shop-favorites')
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        // Оставляем только числа, остальное отбрасываем
        return parsed.filter((id): id is number => typeof id === 'number')
      }
    }
  } catch {
    // Повреждённые данные просто игнорируем
  }
  return []
}

const initialState: FavoritesState = {
  ids: loadSavedFavorites(),
}

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Если товар уже в избранном, убираем его; если нет, добавляем
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload
      state.ids = state.ids.includes(id)
        ? state.ids.filter((existingId) => existingId !== id)
        : [...state.ids, id]
    },
  },
})

// Экспортируем действие, его вызывают кнопки-сердечки
export const { toggleFavorite } = favoritesSlice.actions
// Экспортируем редьюсер, его подключает store
export default favoritesSlice.reducer
