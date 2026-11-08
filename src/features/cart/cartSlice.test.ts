// Тесты редьюсера корзины: добавление, уменьшение количества, удаление
import { describe, expect, it } from 'vitest'
import reducer, { addToCart, decreaseQuantity, removeFromCart } from './cartSlice'
import { makeProduct } from '../../test/fixtures'

// Начальное состояние корзины
const empty = reducer(undefined, { type: 'init' })

describe('cartSlice', () => {
  it('добавляет новый товар с количеством 1', () => {
    const state = reducer(empty, addToCart(makeProduct(1)))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(1)
  })

  it('увеличивает количество, если товар уже в корзине', () => {
    let state = reducer(empty, addToCart(makeProduct(1)))
    state = reducer(state, addToCart(makeProduct(1)))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(2)
  })

  it('уменьшает количество, а при одной штуке удаляет строку', () => {
    let state = reducer(empty, addToCart(makeProduct(1)))
    state = reducer(state, addToCart(makeProduct(1)))
    state = reducer(state, decreaseQuantity(1))
    expect(state.items[0].quantity).toBe(1)
    state = reducer(state, decreaseQuantity(1))
    expect(state.items).toHaveLength(0)
  })

  it('удаляет строку целиком по id', () => {
    let state = reducer(empty, addToCart(makeProduct(1)))
    state = reducer(state, addToCart(makeProduct(2)))
    state = reducer(state, removeFromCart(1))
    expect(state.items.map((item) => item.product.id)).toEqual([2])
  })
})
