// Link ведёт на страницу товара без перезагрузки; useSearchParams читает текущие фильтры адреса
import { Link, useSearchParams } from 'react-router-dom'
// Кнопка-сердечко на каждой карточке
import FavoriteButton from './FavoriteButton'
// Тип товара
import type { Product } from '../features/products/productsSlice'

interface ProductGridProps {
  items: Product[]
  // Если передана, на каждой карточке появляется кнопка «Удалить» (нужна на странице избранного)
  onRemove?: (productId: number) => void
  // Если true, карточки переносятся на новые строки; иначе они в одной строке, которую листают вбок
  wrap?: boolean
}

// Подборка карточек товаров: картинка, название, категория, цена и сердечко
export default function ProductGrid({ items, onRemove, wrap = false }: ProductGridProps) {
  // Текущие параметры адреса (категория, поиск), чтобы не терять их при открытии карточки
  const [params] = useSearchParams()

  // Ссылка на карточку: копия текущих параметров плюс product с id товара
  function productLink(productId: number) {
    const next = new URLSearchParams(params)
    next.set('product', String(productId))
    return `/?${next.toString()}`
  }

  return (
    // Класс product-list нужен стилям, чтобы разложить карточки сеткой
    <ul className={wrap ? 'product-list is-wrap' : 'product-list'}>
      {items.map((product) => (
        <li key={product.id}>
          <Link to={productLink(product.id)} className="card-link">
            <img src={product.image} alt={product.title} className="card-image" />
            <span className="card-title">{product.title}</span>
            <span className="card-category">{product.category}</span>
            <span className="card-price">{product.price}$</span>
          </Link>
          {/* Сердечко стоит вне ссылки: кнопка внутри ссылки была бы некорректной разметкой */}
          <FavoriteButton productId={product.id} />
          {/* Текстовая кнопка с понятной подписью: видно, что именно произойдёт */}
          {onRemove && (
            <button
              type="button"
              className="remove-button"
              aria-label={`Удалить ${product.title} из избранного`}
              onClick={() => onRemove(product.id)}
            >
              Удалить
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
