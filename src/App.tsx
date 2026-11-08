// Routes и Route описывают, какой адрес показывает какую страницу
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import FavoritesPage from './pages/FavoritesPage'
import HelpPage from './pages/HelpPage'
import TermsPage from './pages/TermsPage'
// Общий каркас сайта с шапкой; страницы выводятся внутри него
import Layout from './components/Layout'

export default function App() {
  return (
    <Routes>
      {/* Route без path только оборачивает страницы в Layout */}
      <Route element={<Layout />}>
        {/* Главная: баннер и подборки; ?product=... открывает карточку товара, ?category=... и ?q=... фильтруют */}
        <Route path="/" element={<HomePage />} />
        {/* Корзина */}
        <Route path="/cart" element={<CartPage />} />
        {/* Избранное: товары, которые пользователь лайкнул */}
        <Route path="/favorites" element={<FavoritesPage />} />
        {/* Помощь и условия использования: пока заглушки */}
        <Route path="/help" element={<HelpPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>
    </Routes>
  )
}
