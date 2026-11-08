// configureStore создаёт общее хранилище Redux
import { configureStore } from '@reduxjs/toolkit'
// Редьюсеры каждого куска состояния
import productsReducer from '../features/products/productsSlice'
import cartReducer from '../features/cart/cartSlice'
import authReducer from '../features/auth/authSlice'
import favoritesReducer from '../features/favorites/favoritesSlice'

// Собираем хранилище: products — товары, cart — корзина, auth — вход, favorites — избранное
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
    favorites: favoritesReducer,
  },
})

// После каждого изменения сохраняем вход и избранное в localStorage, чтобы они пережили перезагрузку
store.subscribe(() => {
  const { user, token } = store.getState().auth
  const { ids } = store.getState().favorites
  try {
    localStorage.setItem('shop-auth', JSON.stringify({ user, token }))
    localStorage.setItem('shop-favorites', JSON.stringify(ids))
  } catch {
    // Если localStorage недоступен, данные просто не сохранятся
  }
})

// Тип всего состояния приложения; понадобится в useSelector
export type RootState = ReturnType<typeof store.getState>
// Тип функции dispatch; понадобится в компонентах для вызова действий
export type AppDispatch = typeof store.dispatch
