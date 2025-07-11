import { useEffect, type RefObject } from 'react'

/**
 * Блокирует прокрутку родительского элемента, когда скролл внутри
 * указанного элемента достигает предела.
 * @param elementRef Ref на DOM-элемент, для которого нужно заблокировать скролл.
 */
export function useScrollLock<T extends HTMLElement>(elementRef: RefObject<T | null>) {
  useEffect(() => {
    const element = elementRef.current

    if (!element) {
      return
    }

    const handleWheel = (e: WheelEvent) => {
      // Проверяем, есть ли вообще вертикальная прокрутка
      if (element.scrollHeight <= element.clientHeight) {
        return
      }

      const isScrollingUpAtTop = element.scrollTop === 0 && e.deltaY < 0
      const isAtBottom = Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight
      const isScrollingDownAtBottom = isAtBottom && e.deltaY > 0

      if (isScrollingUpAtTop || isScrollingDownAtBottom) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    element.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      element.removeEventListener('wheel', handleWheel)
    }
  }, [elementRef]) // Зависимость от самого ref-объекта
}
