// createSlice создаёт состояние и действия, createAsyncThunk — запросы к серверу
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
// api — настроенный axios из client.ts
import { api } from '../../api/client'

// Данные о пользователе, которые показываем в шапке
export interface User {
  username: string
  email?: string
}

// Состояние входа
interface AuthState {
  user: User | null // кто вошёл; null — никто
  token: string | null // токен от сервера; нужен для защищённых запросов
  isModalOpen: boolean // открыто ли окно входа
  status: 'idle' | 'loading' | 'failed' // что сейчас происходит с запросом
  error: string | null // текст ошибки для окна
}

// Читаем сохранённый вход из localStorage; если данные повреждены, начинаем без входа
function loadSavedAuth(): Pick<AuthState, 'user' | 'token'> {
  try {
    const raw = localStorage.getItem('shop-auth')
    if (raw) return JSON.parse(raw)
  } catch {
    // Повреждённые данные просто игнорируем
  }
  return { user: null, token: null }
}

const saved = loadSavedAuth()

const initialState: AuthState = {
  user: saved.user,
  token: saved.token,
  isModalOpen: false,
  status: 'idle',
  error: null,
}

// Вход: отправляем логин и пароль, сервер возвращает токен
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { username: string; password: string }) => {
    const response = await api.post<{ token: string }>('/auth/login', credentials)
    return { token: response.data.token, user: { username: credentials.username } }
  },
)

// Регистрация: сервер создаёт пользователя; токена при этом не приходит
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: { email: string; username: string; password: string }) => {
    await api.post('/users', data)
    return { token: null, user: { username: data.username, email: data.email } }
  },
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Открыть окно входа
    openAuthModal: (state) => {
      state.isModalOpen = true
    },
    // Закрыть окно входа
    closeAuthModal: (state) => {
      state.isModalOpen = false
    },
    // Выйти из аккаунта
    logout: (state) => {
      state.user = null
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Запрос начался: включаем статус загрузки и убираем старую ошибку
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      // Вход успешен: записываем пользователя и закрываем окно
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.status = 'idle'
        state.user = action.payload.user
        state.token = action.payload.token
        state.isModalOpen = false
      })
      // Регистрация успешна: считаем пользователя вошедшим и закрываем окно
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'idle'
        state.user = action.payload.user
        state.token = action.payload.token
        state.isModalOpen = false
      })
      // Запрос упал: показываем ошибку в окне
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Не удалось войти'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Не удалось зарегистрироваться'
      })
  },
})

// Экспортируем действия, их вызывают компоненты
export const { openAuthModal, closeAuthModal, logout } = authSlice.actions
// Экспортируем редьюсер, его подключает store
export default authSlice.reducer
