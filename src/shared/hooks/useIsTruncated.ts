import { useState, useRef, useLayoutEffect } from "react"

// Опции хука: debounce-задержка в мс (0 — без задержки)
interface UseIsTruncatedOptions {
  debounceDelay?: number
}

export function useIsTruncated<T extends HTMLElement>({
  debounceDelay = 0,
}: UseIsTruncatedOptions = {}) {
  const ref = useRef<T>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    let frameId: number | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const check = () => {
      if (!element) return
      const truncated = element.scrollWidth > element.clientWidth
      setIsTruncated(truncated)
    }

    const trigger = () => {
      // отменяем предыдущие
      if (frameId !== null) cancelAnimationFrame(frameId)
      if (debounceDelay > 0) {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          frameId = requestAnimationFrame(check)
        }, debounceDelay)
      } else {
        frameId = requestAnimationFrame(check)
      }
    }

    // Наблюдаем за размерами и содержимым
    const resizeObserver = new ResizeObserver(trigger)
    resizeObserver.observe(element)

    // Сразу проверяем при монтировании
    trigger()

    return () => {
      resizeObserver.disconnect()
      if (frameId !== null) cancelAnimationFrame(frameId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [debounceDelay])

  return { ref, isTruncated }
}
