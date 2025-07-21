import { useEffect, useState } from 'react'

/**
 * Хук для получения "отложенного" значения. Полезен для дебаунсинга ввода.
 * @param value - Значение для дебаунсинга.
 * @param delay - Задержка в миллисекундах.
 * @returns Отложенное значение.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Устанавливаем таймер, который обновит значение после задержки
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Очищаем таймер при каждом новом значении или при размонтировании компонента
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
