// useEffect подписывается на клавиатуру; useRef хранит актуальный onClose, не пересоздавая подписку
import { useEffect, useRef, type RefObject } from 'react'

// Элементы, на которые можно перевести фокус с клавиатуры
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

// Фокус внутри модального окна: при открытии фокус переходит в окно, Tab ходит по кругу внутри окна,
// Esc закрывает, а при закрытии фокус возвращается на элемент, который окно открыл
export function useDialogFocus(ref: RefObject<HTMLElement | null>, isOpen: boolean, onClose: () => void) {
  // Храним актуальный onClose, чтобы эффект не перезапускался при каждом рендере родителя
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const dialog = ref.current
    if (!isOpen || !dialog) return

    // Запоминаем элемент, с которого открыли окно, чтобы вернуть на него фокус
    const opener = document.activeElement as HTMLElement | null
    const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))

    // Переводим фокус на первый элемент окна
    getFocusable()[0]?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const items = getFocusable()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      // Фокус у края окна (или вне его) перебрасываем на противоположный край
      if (event.shiftKey && (active === first || !dialog!.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !dialog!.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      opener?.focus()
    }
  }, [ref, isOpen])
}
