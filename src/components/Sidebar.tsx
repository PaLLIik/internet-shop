// Link — переход по адресу; useSearchParams читает текущую категорию из адреса
import { Link, useSearchParams } from 'react-router-dom'
// Типизированный хук чтения товаров из store
import { useAppSelector } from '../app/hooks'
// Делает первую букву заглавной
import { capitalize } from '../utils/text'

// Боковая панель с категориями; выбранная категория подсвечивается
export default function Sidebar() {
  // Товары загружает Layout, здесь их только читаем, чтобы построить список категорий
  const products = useAppSelector((state) => state.products.products)
  // Текущая категория из адреса, например ?category=electronics
  const [params] = useSearchParams()
  const activeCategory = params.get('category')

  // Уникальные категории из товаров: набор без повторов, затем превращаем обратно в массив
  const categories = [...new Set(products.map((product) => product.category))]

  return (
    <aside>
      <h2>Categories</h2>
      <ul>
        {/* «All» без параметра category: показываем все товары */}
        <li>
          <Link
            to="/"
            className={activeCategory === null ? 'active' : undefined}
            aria-current={activeCategory === null ? 'page' : undefined}
          >
            All
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <Link
              to={`/?category=${encodeURIComponent(category)}`}
              className={activeCategory === category ? 'active' : undefined}
              aria-current={activeCategory === category ? 'page' : undefined}
            >
              {capitalize(category)}
            </Link>
          </li>
        ))}
      </ul>

      {/* Нижний ряд: ссылки на служебные страницы */}
      <div className="sidebar-links">
        <Link to="/help">Help</Link>
        <Link to="/terms" className="underline">
          Terms &amp; Conditions
        </Link>
      </div>
    </aside>
  )
}
