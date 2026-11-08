// createSlice создаёт редьюсер корзины и действия для неё
// PayloadAction — тип, который описывает, какие данные приходят вместе с действием
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
// Тип товара из productsSlice: в корзину кладём товар целиком
import type { Product } from '../products/productsSlice'

// Одна строка корзины: товар и сколько штук
export interface CartItem {
  product: Product
  quantity: number
}

// Состояние корзины: список строк
interface CartState {
  items: CartItem[]
}

// В начале корзина пустая
const initialState: CartState = {
  items: [],
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Добавить товар: если он уже в корзине, увеличиваем количество, иначе добавляем новую строку
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((item) => item.product.id === action.payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ product: action.payload, quantity: 1 })
      }
    },
    // Уменьшить количество на 1; если была одна штука, удаляем строку совсем
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const existing = state.items.find((item) => item.product.id === action.payload)
      if (!existing) return
      if (existing.quantity > 1) {
        existing.quantity -= 1
      } else {
        state.items = state.items.filter((item) => item.product.id !== action.payload)
      }
    },
    // Удалить строку корзины по id товара
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload)
    },
  },
})

// Экспортируем действия, их вызывают страницы
export const { addToCart, decreaseQuantity, removeFromCart } = cartSlice.actions
// Экспортируем редьюсер, его подключает store
export default cartSlice.reducer
