// Подключает матчеры для DOM (toBeInTheDocument и другие) и очищает экран после каждого теста
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
