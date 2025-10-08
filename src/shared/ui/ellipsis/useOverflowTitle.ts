import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Навешивает title только если контент переполнен (scrollWidth > clientWidth).
 * Избегаем лишних tooltip и перерисовок.
 */
export function useOverflowTitle<T extends HTMLElement>(explicit?: string) {
  const ref = useRef<T | null>(null)
  const [title, setTitle] = useState<string | undefined>(undefined)

  const recompute = useCallback(() => {
    const el = ref.current
    if (!el) return
    const overflow = el.scrollWidth > el.clientWidth
    setTitle(overflow ? (explicit ?? el.textContent ?? undefined) : undefined)
  }, [explicit])

  // Первичный расчёт
  useLayoutEffect(() => {
    recompute()
  }, [recompute])

  // Отслеживаем ресайзы элемента/окна
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(recompute)
    ro.observe(el)
    window.addEventListener('resize', recompute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recompute)
    }
  }, [recompute])

  return { ref, title }
}
