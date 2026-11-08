// Тест фокуса в окне: вход фокуса, ловушка Tab, Esc и возврат фокуса на кнопку открытия
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { useDialogFocus } from './useDialogFocus'

// Тестовое окно с двумя кнопками внутри и кнопкой открытия снаружи
function Dialog({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDialogFocus(ref, open, () => {
    onClose()
    setOpen(false)
  })

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Открыть
      </button>
      {open && (
        <div ref={ref} role="dialog" aria-modal="true">
          <button type="button">Первая</button>
          <button type="button">Вторая</button>
        </div>
      )}
    </>
  )
}

describe('useDialogFocus', () => {
  it('переводит фокус в окно и не выпускает его по Tab', async () => {
    const user = userEvent.setup()
    render(<Dialog onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Открыть' }))
    expect(screen.getByRole('button', { name: 'Первая' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Вторая' })).toHaveFocus()

    // Дальше фокус идёт по кругу внутри окна, а не на кнопку «Открыть»
    await user.tab()
    expect(screen.getByRole('button', { name: 'Первая' })).toHaveFocus()
  })

  it('закрывается по Esc и возвращает фокус на кнопку открытия', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Dialog onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Открыть' }))
    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Открыть' })).toHaveFocus()
  })
})
