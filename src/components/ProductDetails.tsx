// useState хранит номер выбранного фото галереи, useRef — ссылка на окно, useId — уникальный id заголовка
import { useId, useRef, useState } from 'react'
// Фокус внутри окна, Esc и возврат фокуса
import { useDialogFocus } from '../utils/useDialogFocus'
// useDispatch отправляет действия, useSelector читает избранное из store
import { useDispatch, useSelector } from 'react-redux'
// Типы из store
import type { AppDispatch, RootState } from '../app/store'
// Действия корзины и избранного
import { addToCart } from '../features/cart/cartSlice'
import { toggleFavorite } from '../features/favorites/favoritesSlice'
// Тип товара
import type { Product } from '../features/products/productsSlice'
// Делает первую букву заглавной
import { capitalize } from '../utils/text'

// Сколько фото в галерее. В API у товара одна картинка, поэтому пока она повторяется;
// когда появятся настоящие фото, достаточно заменить список images
const GALLERY_SIZE = 4

interface ProductDetailsProps {
  product: Product
  onClose: () => void
}

// Карточка товара в окне поверх страницы: фон и остальные блоки не двигаются
export default function ProductDetails({ product, onClose }: ProductDetailsProps) {
  const dispatch = useDispatch<AppDispatch>()
  // Лайкнут ли товар, чтобы показать нужный текст на кнопке
  const isFavorite = useSelector((state: RootState) => state.favorites.ids.includes(product.id))
  // Фото галереи и номер того, которое сейчас открыто крупно
  const images = Array.from({ length: GALLERY_SIZE }, () => product.image)
  const [activeIndex, setActiveIndex] = useState(0)

  // Ссылка на окно и id заголовка для программ чтения экрана
  const dialogRef = useRef<HTMLElement>(null)
  const titleId = useId()
  // Фокус остаётся внутри окна, Esc закрывает, после закрытия фокус возвращается на карточку
  useDialogFocus(dialogRef, true, onClose)

  // Листаем по кругу: после последнего фото снова первое, и наоборот
  const showPrevious = () => setActiveIndex((index) => (index - 1 + images.length) % images.length)
  const showNext = () => setActiveIndex((index) => (index + 1) % images.length)

  return (
    // Затемнённый фон: клик по нему закрывает окно
    <div className="modal-overlay" onClick={onClose}>
      {/* Клик внутри окна не закрывает его */}
      <section
        ref={dialogRef}
        className="product-details panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" aria-label="Закрыть карточку" onClick={onClose}>
          ×
        </button>

        <div className="product-details-body">
          {/* Галерея: миниатюры слева, большое фото и стрелки справа */}
          <div className="gallery">
            <ul className="gallery-thumbs">
              {images.map((src, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className={index === activeIndex ? 'thumb is-active' : 'thumb'}
                    aria-label={`Фото ${index + 1}`}
                    aria-current={index === activeIndex}
                    onClick={() => setActiveIndex(index)}
                  >
                    <img src={src} alt="" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="gallery-main">
              <button type="button" className="gallery-arrow gallery-prev" aria-label="Предыдущее фото" onClick={showPrevious}>
                {/* Значок-стрелка из SVG: в отличие от символа в тексте, точно центрируется в круге */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              {/* Картинка на белом фоне, как в макете */}
              <div className="product-image-wrap">
                <img src={images[activeIndex]} alt={product.title} className="product-image" />
              </div>
              <button type="button" className="gallery-arrow gallery-next" aria-label="Следующее фото" onClick={showNext}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="product-info">
            <p className="card-category">{capitalize(product.category)}</p>
            <h1 id={titleId}>{product.title}</h1>
            <p className="product-price">{product.price}$</p>
            <p className="product-rating">
              Rating: {product.rating.rate} ({product.rating.count} reviews)
            </p>
            <p className="product-description">{product.description}</p>

            <div className="details-actions">
              <button type="button" onClick={() => dispatch(addToCart(product))}>
                Add to cart
              </button>
              <button
                type="button"
                className={isFavorite ? 'secondary is-active' : 'secondary'}
                aria-pressed={isFavorite}
                onClick={() => dispatch(toggleFavorite(product.id))}
              >
                {isFavorite ? 'In favorites' : 'Add to favorites'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
