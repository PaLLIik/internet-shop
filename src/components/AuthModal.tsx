// useState хранит поля формы и выбранный режим (вход или регистрация)
import { useId, useRef, useState, type FormEvent } from 'react'
// Фокус внутри окна, Esc и возврат фокуса
import { useDialogFocus } from '../utils/useDialogFocus'
// useDispatch отправляет действия, useSelector читает состояние входа
import { useDispatch, useSelector } from 'react-redux'
// Типы из store
import type { AppDispatch, RootState } from '../app/store'
// Действия входа
import { closeAuthModal, loginUser, registerUser } from '../features/auth/authSlice'

// Окно входа и регистрации; показывается только когда isModalOpen = true
export default function AuthModal() {
  const dispatch = useDispatch<AppDispatch>()
  const isOpen = useSelector((state: RootState) => state.auth.isModalOpen)
  const status = useSelector((state: RootState) => state.auth.status)
  const error = useSelector((state: RootState) => state.auth.error)

  // Режим формы: по умолчанию регистрация, как в макете
  const [mode, setMode] = useState<'login' | 'register'>('register')
  // Значения полей формы
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // Ссылка на окно и id заголовка; фокус держится внутри окна, Esc закрывает его
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useDialogFocus(dialogRef, isOpen, () => dispatch(closeAuthModal()))

  // Если окно закрыто, ничего не выводим
  if (!isOpen) return null

  // Отправка формы: в зависимости от режима вызываем вход или регистрацию
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Не даём браузеру перезагрузить страницу при отправке формы
    event.preventDefault()
    if (mode === 'login') {
      dispatch(loginUser({ username, password }))
    } else {
      dispatch(registerUser({ email, username, password }))
    }
  }

  return (
    // Затемнённый фон; клик по нему закрывает окно
    <div className="modal-overlay" onClick={() => dispatch(closeAuthModal())}>
      {/* Клик внутри окна не должен закрывать его, поэтому останавливаем всплытие */}
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" aria-label="Закрыть" onClick={() => dispatch(closeAuthModal())}>
          ×
        </button>

        <h2 id={titleId} className="modal-title">{mode === 'login' ? 'Log in' : 'Register'}</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Email нужен только при регистрации */}
          {mode === 'register' && (
            <input type="email" placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          )}
          <input placeholder="Username" aria-label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input
            type="password"
            placeholder="Password" aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Текст ошибки, если запрос не прошёл */}
          {error && <p className="modal-error">{error}</p>}

          {/* Во время запроса кнопка недоступна, чтобы не отправить форму дважды */}
          <button type="submit" disabled={status === 'loading'}>
            {mode === 'login' ? 'Log in' : 'Create an account'}
          </button>
        </form>

        {/* Переключение между входом и регистрацией */}
        <button
          type="button"
          className="modal-switch"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'No account? Register' : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  )
}
