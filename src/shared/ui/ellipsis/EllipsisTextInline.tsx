import React, { forwardRef } from 'react'
import { useOverflowTitle } from './useOverflowTitle'

type Props = {
  children: React.ReactNode
  className?: string
  /** Явный текст тултипа (иначе возьмём textContent) */
  title?: string
}

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === 'function') {
        ref(node)
      } else {
        ;(ref as unknown as { current: T | null }).current = node
      }
    }
  }
}

/**
 * Inline-вариант на <span> для использования внутри <button>.
 * Ставит title только при реальном overflow.
 */
export const EllipsisTextInline = forwardRef<HTMLSpanElement, Props>(
  ({ children, className, title }, forwardedRef) => {
    const { ref: localRef, title: computed } = useOverflowTitle<HTMLSpanElement>(title)

    return (
      <span
        ref={composeRefs(localRef, forwardedRef)}
        className={`min-w-0 truncate ${className ?? ''}`}
        title={computed}
      >
        {children}
      </span>
    )
  },
)
EllipsisTextInline.displayName = 'EllipsisTextInline'
