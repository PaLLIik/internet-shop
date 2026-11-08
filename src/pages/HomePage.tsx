// useState хранит, раскрыта ли подборка; ReactNode — текст или разметка для строки под заголовком
import { useState, type ReactNode } from 'react'
// useSelector читает данные из store
import { useSelector } from 'react-redux'
// useSearchParams читает фильтры из адреса, Link ведёт назад к полному списку, useNavigate открывает категорию
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
// Тип состояния всего приложения
import type { RootState } from '../app/store'
// Тип товара; загрузку товаров делает Layout
import type { Product } from '../features/products/productsSlice'
// Сетка карточек с сердечками и карточка открытого товара
import ProductGrid from '../components/ProductGrid'
import ProductDetails from '../components/ProductDetails'
// Делает первую букву заглавной
import { capitalize } from '../utils/text'
// Картинка ноутбука и системного блока для баннера (PNG с прозрачным фоном)
import heroDevices from '../assets/hero-devices.png'

// Сколько карточек показываем в свёрнутой подборке: один ряд
const ROW_SIZE = 5

// Подборка: заголовок, строка под ним, один ряд карточек и кнопка, которая раскрывает весь список
function ProductSection({ title, items, subtitle }: { title: string; items: Product[]; subtitle?: ReactNode }) {
  // По умолчанию подборка свёрнута
  const [expanded, setExpanded] = useState(false)
  // Свёрнутая подборка показывает только первый ряд
  const visible = expanded ? items : items.slice(0, ROW_SIZE)

  return (
    <section className="full-row panel">
      <h2 className="section-title">{title}</h2>
      {/* aria-live: программа чтения экрана сообщает о новом количестве найденных товаров */}
      {subtitle && (
        <p className="results-count" aria-live="polite">
          {subtitle}
        </p>
      )}
      {items.length === 0 ? (
        <p>Ничего не найдено. Попробуйте другой запрос или категорию.</p>
      ) : (
        <ProductGrid items={visible} wrap={expanded} />
      )}
      {/* Место под кнопку резервируем всегда, чтобы высота подборки не менялась между категориями */}
      <div className="section-more">
        {/* Кнопку показываем только если карточек больше, чем помещается в ряд */}
        {items.length > ROW_SIZE && (
          <button type="button" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show less' : 'See more'}
          </button>
        )}
      </div>
    </section>
  )
}

// Главная страница: баннер и подборки. Открытый товар показываем окном поверх страницы
export default function HomePage() {
  const navigate = useNavigate()
  // Читаем из store список товаров, флаг загрузки и ошибку
  const products = useSelector((state: RootState) => state.products.products)
  const loading = useSelector((state: RootState) => state.products.loading)
  const error = useSelector((state: RootState) => state.products.error)
  // Фильтры из адреса: ?product=... (открытый товар), ?category=... и ?q=...
  const [params, setParams] = useSearchParams()
  const productParam = params.get('product')
  const category = params.get('category')
  const query = (params.get('q') ?? '').trim()

  // Пока товары грузятся, показываем надпись вместо списков
  if (loading) return <p>Загрузка...</p>
  // Если запрос упал, показываем текст ошибки
  if (error) return <p>Ошибка: {error}</p>

  // Открытый товар: ищем его по id из адреса; Number превращает строку в число
  const openedProduct = productParam !== null ? products.find((item) => item.id === Number(productParam)) : undefined
  // Закрытие окна: убираем только параметр product, категория и поиск остаются
  function closeProduct() {
    const next = new URLSearchParams(params)
    next.delete('product')
    setParams(next)
  }
  // Окно товара поверх страницы; если товара нет, окна не показываем
  const productBlock = openedProduct ? (
    <ProductDetails key={openedProduct.id} product={openedProduct} onClose={closeProduct} />
  ) : null

  // Есть ли фильтр: категория или поисковый запрос
  const isFiltering = category !== null || query !== ''

  // Без фильтра: баннер и две подборки
  if (!isFiltering) {
    // Less than 100$: только товары дешевле 100 долларов
    const cheap = products.filter((product) => product.price < 100)

    return (
      <>
        <section className="hero">
          {/* Слой с надписью: он обрезает её по краям баннера и не перехватывает клики */}
          <div className="hero-bg" aria-hidden="true">
            <span className="hero-bg-text">Big Sale 20%</span>
          </div>
          <p className="hero-kicker">The bestseller of 2022</p>
          <h1>
            LENNON R2D2
            <br />
            WITH NVIDIA 5090 TI
          </h1>
          {/* Открывает категорию Electronics: баннер рекламирует ноутбук и системный блок */}
          <button type="button" onClick={() => navigate('/?category=electronics')}>
            Shop Now
          </button>
          {/* Картинка техники справа; текст для неё не нужен */}
          <img src={heroDevices} alt="" className="hero-image" />
        </section>

        <ProductSection title="Trending" items={products} />
        <ProductSection title="Less than 100$" items={cheap} />
        {productBlock}
      </>
    )
  }

  // С фильтром: результаты в такой же подборке, как на главной, — один ряд и кнопка «See more»
  // Применяем фильтры: сначала категория, затем поиск по названию без учёта регистра
  const results = products.filter((product) => {
    const matchesCategory = category === null || product.category === category
    const matchesQuery = query === '' || product.title.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  })

  // Заголовок подборки: что именно искали или какую категорию выбрали
  const title = query !== '' ? `Results for “${query}”` : capitalize(category ?? '')

  return (
    <>
      {/* key сбрасывает раскрытие, когда меняется категория или запрос */}
      <ProductSection
        key={`${category ?? ''}|${query}`}
        title={title}
        items={results}
        subtitle={
          <>
            Найдено товаров: {results.length} ·{' '}
            {/* Ссылка снимает поиск, категория остаётся */}
            <Link to={category ? `/?category=${encodeURIComponent(category)}` : '/'}>Показать все товары</Link>
          </>
        }
      />
      {productBlock}
    </>
  )
}
