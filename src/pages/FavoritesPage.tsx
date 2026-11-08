// useDispatch отправляет действия, useSelector читает данные из store
import { useDispatch, useSelector } from 'react-redux'
// Типы из store
import type { AppDispatch, RootState } from '../app/store'
// Действие, которое убирает товар из избранного
import { toggleFavorite } from '../features/favorites/favoritesSlice'
// Сетка карточек, та же, что на главной
import ProductGrid from '../components/ProductGrid'

// Страница избранного: показывает только те товары, которые пользователь лайкнул
export default function FavoritesPage() {
  const dispatch = useDispatch<AppDispatch>()
  // Все товары, их id в избранном и состояние загрузки
  const products = useSelector((state: RootState) => state.products.products)
  const favoriteIds = useSelector((state: RootState) => state.favorites.ids)
  const loading = useSelector((state: RootState) => state.products.loading)
  const error = useSelector((state: RootState) => state.products.error)

  // Пока грузим, показываем надпись
  if (loading) return <p>Загрузка...</p>
  // Если запрос упал, показываем ошибку
  if (error) return <p>Ошибка: {error}</p>

  // Оставляем только товары, которые есть в избранном
  const favoriteProducts = products.filter((product) => favoriteIds.includes(product.id))

  return (
    // panel: та же плашка, что у сайдбара и корзины, поэтому колонки одной высоты и справа нет пустоты
    <section className="favorites panel">
      <h1>Избранное</h1>
      {favoriteProducts.length === 0 ? (
        <p>Пока пусто. Нажмите на сердечко у товара, и он появится здесь.</p>
      ) : (
        // Обёртка с прокруткой: много карточек листаются внутри панели, а не растягивают страницу
        <div className="favorites-scroll">
          <ProductGrid items={favoriteProducts} wrap onRemove={(id) => dispatch(toggleFavorite(id))} />
        </div>
      )}
    </section>
  )
}
