// useEffect загружает товары один раз, когда открыт любой раздел сайта
import { useEffect } from 'react'
// Outlet — место, куда React Router выводит текущую страницу
import { Outlet } from 'react-router-dom'
// Типизированные хуки и действие загрузки товаров
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchProducts } from '../features/products/productsSlice'
// Шапка сайта, она одна на все страницы
import Header from './Header'
// Боковая панель с категориями и служебными ссылками внизу
import Sidebar from './Sidebar'
// Подвал сайта, он один на все страницы
import Footer from './Footer'
// Окно входа и регистрации; показывается поверх страницы, когда его открывают
import AuthModal from './AuthModal'

// Общий каркас: шапка сверху, сетка из сайдбара и содержимого, внизу подвал
export default function Layout() {
  const dispatch = useAppDispatch()
  const productsCount = useAppSelector((state) => state.products.products.length)
  const productsStatus = useAppSelector((state) => state.products.loading)

  // Товары загружаются один раз: сайдбар, главная, избранное и корзина берут их из общего store
  useEffect(() => {
    if (productsCount === 0 && !productsStatus) {
      dispatch(fetchProducts())
    }
  }, [dispatch, productsCount, productsStatus])

  return (
    <>
      <Header />
      {/* Сетка: сайдбар идёт первым, страница раскладывается рядом с ним */}
      <div className="shell">
        <Sidebar />
        {/* main «растворён» в сетке, поэтому его блоки становятся частями общей сетки */}
        <main>
          {/* Сюда подставится HomePage, CartPage или FavoritesPage в зависимости от адреса */}
          <Outlet />
        </main>
      </div>
      <Footer />
      <AuthModal />
    </>
  )
}
