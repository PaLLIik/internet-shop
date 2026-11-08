// Тест вспомогательной функции: первая буква заглавная
import { describe, expect, it } from 'vitest'
import { capitalize } from './text'

describe('capitalize', () => {
  it('делает первую букву заглавной', () => {
    expect(capitalize("men's clothing")).toBe("Men's clothing")
  })

  it('не падает на пустой строке', () => {
    expect(capitalize('')).toBe('')
  })
})
