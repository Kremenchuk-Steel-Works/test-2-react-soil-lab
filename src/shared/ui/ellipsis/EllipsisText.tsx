import { forwardRef, type ReactNode } from 'react'
import { useOverflowTitle } from './useOverflowTitle'

type Props = {
  children: ReactNode
  className?: string
  /** Можно передать явный текст тултипа. Иначе возьмём textContent. */
  title?: string
}

/**
 * Контейнер с truncate + умный title по overflow.
 * Без лишних зависимостей.
 */
export const EllipsisText = forwardRef<HTMLDivElement, Props>(
  ({ children, className, title }, forwardedRef) => {
    const { ref, title: computed } = useOverflowTitle<HTMLDivElement>(title)

    // mergeRefs без внешних утилит
    const setRef = (node: HTMLDivElement | null) => {
      ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef)
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node
    }

    return (
      <div ref={setRef} className={`min-w-0 truncate ${className ?? ''}`} title={computed}>
        {children}
      </div>
    )
  },
)
EllipsisText.displayName = 'EllipsisText'
