// useDispatch отправляет действия, useSelector читает корзину из store
import { useDispatch, useSelector } from 'react-redux'
// Link ведёт на страницу товара; useSearchParams читает поиск по корзине из адреса
import { Link, useSearchParams } from 'react-router-dom'
// Типы из store
import type { AppDispatch, RootState } from '../app/store'
// Действия корзины: добавить (кнопка +), уменьшить (кнопка −), удалить (крестик)
import { addToCart, decreaseQuantity, removeFromCart } from '../features/cart/cartSlice'

// Страница корзины
export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>()
  // Читаем строки корзины из store
  const items = useSelector((state: RootState) => state.cart.items)
  // Поиск по корзине: параметр q из адреса, например /cart?q=jacket
  const [params] = useSearchParams()
  const query = (params.get('q') ?? '').trim().toLowerCase()

  // Если в корзине ничего нет, показываем сообщение
  if (items.length === 0) return <p>Корзина пуста</p>

  // Строки, которые подходят под поиск по названию; без запроса показываем все
  const visibleItems = query ? items.filter((item) => item.product.title.toLowerCase().includes(query)) : items

  // Общая сумма считается по всей корзине, даже если строки отфильтрованы
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <section className="cart">
      <h1>Your cart</h1>

      <ul className="cart-list">
        {visibleItems.map((item) => (
          // key — уникальный id товара
          <li key={item.product.id} className="cart-item">
            {/* Картинка товара */}
            <img src={item.product.image} alt={item.product.title} className="cart-thumb" />

            {/* Название и категория */}
            <div className="cart-info">
              <Link to={`/?product=${item.product.id}`}>{item.product.title}</Link>
              <span className="cart-category">{item.product.category}</span>
            </div>

            {/* Цена одной штуки */}
            <span className="cart-unit-price">{item.product.price}$</span>

            {/* Количество: кнопки уменьшить, число, увеличить */}
            <div className="quantity">
              <button
                type="button"
                className="qty-button"
                aria-label="Уменьшить"
                onClick={() => dispatch(decreaseQuantity(item.product.id))}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                className="qty-button qty-plus"
                aria-label="Увеличить"
                onClick={() => dispatch(addToCart(item.product))}
              >
                +
              </button>
            </div>

            {/* Сумма по строке: цена умножить на количество */}
            <span className="cart-line-total">
              {(item.product.price * item.quantity).toFixed(2)}$
            </span>

            {/* Крестик удаляет строку целиком */}
            <button
              type="button"
              className="cart-remove"
              aria-label="Удалить"
              onClick={() => dispatch(removeFromCart(item.product.id))}
            >
              ×
            </button>
          </li>
        ))}
        {/* Если поиск ничего не нашёл, говорим об этом */}
        {visibleItems.length === 0 && <li className="cart-empty-search">Ничего не найдено в корзине.</li>}
      </ul>

      {/* Итог и кнопка оформления; оформление пока без логики */}
      <div className="cart-footer">
        <p className="cart-total">
          TOTAL PRICE: <strong>{total.toFixed(2)}$</strong>
        </p>
        <button type="button" className="checkout">
          Proceed to checkout
        </button>
      </div>
    </section>
  )
}
