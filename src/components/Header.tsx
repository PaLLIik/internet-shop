// useState хранит текст поиска, useEffect синхронизирует его с адресом, FormEvent — тип отправки формы
import { useEffect, useState, type FormEvent } from 'react'
// Link — переход по адресу без перезагрузки страницы; useNavigate — переход из кода; useSearchParams — текущие фильтры
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
// useSelector читает данные из store, useDispatch отправляет действия
import { useDispatch, useSelector } from 'react-redux'
// Типы состояния и функции dispatch
import type { AppDispatch, RootState } from '../app/store'
// Действия входа: открыть окно, выйти
import { logout, openAuthModal } from '../features/auth/authSlice'

// Шапка сайта: логотип, пользователь, поиск и иконки справа
export default function Header() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const location = useLocation()
  // Кто вошёл; null — никто не вошёл
  const user = useSelector((state: RootState) => state.auth.user)
  // Считаем, сколько штук всего в корзине: суммируем quantity по всем строкам
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  )
  // Сколько товаров в избранном
  const favoritesCount = useSelector((state: RootState) => state.favorites.ids.length)
  // Текст, который пользователь ввёл в поиске
  const [query, setQuery] = useState('')
  // Поисковый запрос из адреса: поле показывает то, что реально искали
  const urlQuery = params.get('q') ?? ''
  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  // Запуск поиска. В корзине ищем только по её товарам, в остальных местах — по каталогу
  function runSearch(value: string) {
    const trimmed = value.trim()
    const next = new URLSearchParams()
    if (location.pathname === '/cart') {
      if (trimmed) next.set('q', trimmed)
      const search = next.toString()
      navigate(search ? `/cart?${search}` : '/cart')
      return
    }
    // В каталоге открываем главную с параметром q; категорию сохраняем; пустой запрос снимает поиск
    const category = params.get('category')
    if (category) next.set('category', category)
    if (trimmed) next.set('q', trimmed)
    const search = next.toString()
    navigate(search ? `/?${search}` : '/')
  }

  // Отправка формы: кнопка «Найти» или Enter
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    runSearch(query)
  }

  return (
    <header>
      {/* Логотип: фиолетовый знак доллара и слово TUFF, ведёт на главную */}
      <Link to="/" className="logo">
        <span className="logo-dollar">$</span>TUFF
      </Link>

      {/* Блок пользователя: если вошли — кружок с инициалами и имя, если нет — кнопка входа */}
      <div className="user">
        {user ? (
          <>
            {/* Инициалы: первые две буквы имени пользователя */}
            <span className="avatar">{user.username.slice(0, 2).toUpperCase()}</span>
            <span>{user.username}</span>
            <button type="button" className="text-button" onClick={() => dispatch(logout())}>
              Log out
            </button>
          </>
        ) : (
          <>
            <span className="avatar avatar-empty" aria-hidden="true" />
            <button type="button" className="text-button" onClick={() => dispatch(openAuthModal())}>
              Log in
            </button>
          </>
        )}
      </div>

      {/* Поиск: запускается кнопкой «Найти» или клавишей Enter */}
      <form className="search" role="search" onSubmit={handleSearch}>
        {/* Иконка лупы */}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          placeholder="Search for anything..."
          aria-label="Поиск товаров"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {/* Крестик сбрасывает поиск: поле очищается, открывается полный список */}
        {query && (
          <button type="button" className="search-clear" aria-label="Очистить поиск" onClick={() => runSearch('')}>
            ×
          </button>
        )}
        <button type="submit" className="search-button">
          Найти
        </button>
      </form>

      <div className="header-icons">
        {/* Иконка избранного ведёт на страницу избранного; счётчик показываем, если есть товары */}
        <Link to="/favorites" className="icon-button" aria-label="Избранное">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.5z" />
          </svg>
          {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
        </Link>

        {/* Иконка корзины ведёт на страницу корзины; справа от неё счётчик товаров */}
        <Link to="/cart" className="cart-link" aria-label="Корзина">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {/* Счётчик показываем только если в корзине что-то есть */}
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>
      </div>
    </header>
  )
}
