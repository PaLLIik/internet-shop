// createSlice создаёт редьюсер и действия для одного куска состояния
// createAsyncThunk нужен для запроса к серверу, который занимает время
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// api — настроенный axios из client.ts
import { api } from '../../api/client'

// Описываем, как выглядит один товар с сервера
export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: { rate: number; count: number }
}

// Описываем состояние этого slice
interface ProductsState {
  products: Product[]
  loading: boolean
  error: string | null
}

// Начальное состояние: товаров нет, загрузки нет, ошибки нет
const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
}

// Асинхронное действие: делает запрос и возвращает список товаров
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  // Отправляем GET-запрос на /products; полный адрес = baseURL + /products
  const response = await api.get<Product[]>('/products')
  // Возвращаем данные ответа; они попадут в action.payload в fulfilled
  return response.data
})

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  // Обычных действий без запроса пока нет
  reducers: {},
  // Реакции на три состояния запроса fetchProducts
  extraReducers: (builder) => {
    builder
      // Запрос начался: включаем loading и сбрасываем старую ошибку
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      // Запрос успешен: сохраняем товары и выключаем loading
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      // Запрос упал: выключаем loading и сохраняем текст ошибки
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Не удалось загрузить товары'
      })
  },
})

// Экспортируем редьюсер: store.ts подключит его под ключом products
export default productsSlice.reducer
