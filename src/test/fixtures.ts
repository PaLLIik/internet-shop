// Тестовый товар: набор полей как у ответа сервера, нужные для тестов
import type { Product } from '../features/products/productsSlice'

// Создаёт товар с заданным id и названием; остальные поля заполнены для полноты
export function makeProduct(id: number, title = `Товар ${id}`, price = 10): Product {
  return {
    id,
    title,
    price,
    description: 'Описание',
    category: 'electronics',
    image: 'image.png',
    rating: { rate: 4, count: 10 },
  }
}
