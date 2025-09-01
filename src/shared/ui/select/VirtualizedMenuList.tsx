import { useEffect, useMemo, useRef, type CSSProperties, type JSX, type RefObject } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { GroupBase, MenuListProps } from 'react-select'

const DEFAULT_ROW_HEIGHT = 48
const MENU_MAX_HEIGHT = 300
const BOTTOM_THRESHOLD_PX = 20

type AsyncPaginateMenuListProps<
  OptionType,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType>,
> = MenuListProps<OptionType, IsMulti, Group> & {
  selectProps: {
    isLoading: boolean
    handleScrolledToBottom?: () => void
  }
}

function mergeRefs<T>(
  ...refs: Array<RefObject<T | null> | ((instance: T | null) => void) | null | undefined>
) {
  return (instance: T | null) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === 'function') ref(instance)
      else (ref).current = instance
    }
  }
}

// ХУК ДЛЯ ФОЛБЭКА ---
/**
 * Применяет JS-фолбэк для блокировки прокрутки страницы,
 * если CSS `overscroll-behavior` не поддерживается.
 */
function useScrollLockFallback(elementRef: RefObject<HTMLElement | null>) {
  // Проверяем поддержку фичи один раз при инициализации
  const supportsOverscrollContain = useMemo(
    () => typeof CSS !== 'undefined' && (CSS as any).supports?.('overscroll-behavior-y', 'contain'),
    [],
  )

  useEffect(() => {
    // Если CSS поддерживается, ничего не делаем. Это современный путь.
    if (supportsOverscrollContain) return

    const el = elementRef.current
    if (!el) return

    const atTop = () => el.scrollTop <= 0
    const atBottom = () => el.scrollTop + el.clientHeight >= el.scrollHeight - 1

    const onWheel = (e: WheelEvent) => {
      if ((e.deltaY < 0 && atTop()) || (e.deltaY > 0 && atBottom())) {
        e.preventDefault()
      }
    }

    let lastTouchY = 0
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches?.[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches?.[0]?.clientY ?? 0
      const deltaY = lastTouchY - currentY
      lastTouchY = currentY

      if ((deltaY < 0 && atTop()) || (deltaY > 0 && atBottom())) {
        e.preventDefault()
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
    }
  }, [supportsOverscrollContain, elementRef])
}

export function VirtualizedMenuList<
  OptionType extends { label: string; value: unknown },
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>,
>({
  children,
  maxHeight = MENU_MAX_HEIGHT,
  selectProps,
  innerRef,
  innerProps,
}: AsyncPaginateMenuListProps<OptionType, IsMulti, Group>): JSX.Element {
  const { handleScrolledToBottom, isLoading } = selectProps

  const safeChildren = useMemo(() => (Array.isArray(children) ? children : []), [children])
  const itemCount = safeChildren.length

  const parentRef = useRef<HTMLDivElement | null>(null)

  const rowVirtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => DEFAULT_ROW_HEIGHT,
    overscan: 6,
    measureElement: (el) => el?.getBoundingClientRect().height ?? DEFAULT_ROW_HEIGHT,
  })

  const estimatedTotal = itemCount * DEFAULT_ROW_HEIGHT
  const measuredTotal = rowVirtualizer.getTotalSize()
  const contentHeight = Math.max(measuredTotal || 0, estimatedTotal)
  const viewportHeight = Math.min(maxHeight, contentHeight)
  const needScroll = contentHeight > maxHeight

  // Догрузка при прокрутке к низу
  useEffect(() => {
    const el = parentRef.current
    if (!el || !handleScrolledToBottom) return
    const onScroll = () => {
      if (isLoading) return
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - BOTTOM_THRESHOLD_PX) {
        handleScrolledToBottom()
      }
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [handleScrolledToBottom, isLoading])

  // Автодогрузка, если контента меньше окна
  const lastTriggeredCountRef = useRef<number>(-1)
  useEffect(() => {
    if (!handleScrolledToBottom || isLoading) return
    if (contentHeight < maxHeight && itemCount !== lastTriggeredCountRef.current) {
      lastTriggeredCountRef.current = itemCount
      handleScrolledToBottom()
    }
  }, [contentHeight, maxHeight, itemCount, isLoading, handleScrolledToBottom])

  useEffect(() => {
    if (itemCount < lastTriggeredCountRef.current) lastTriggeredCountRef.current = -1
  }, [itemCount])

  // Блокировка прокрутки основной формы
  useScrollLockFallback(parentRef)

  if (itemCount === 0) return <>{children}</>

  // Аккуратно объединяем стили: добавляем overscroll-behavior
  const innerStyle = (innerProps as any)?.style as CSSProperties | undefined
  const containerStyle: CSSProperties = {
    ...(innerStyle || {}),
    height: viewportHeight,
    maxHeight,
    overflowY: needScroll ? 'auto' : 'hidden',
    overscrollBehaviorY: 'contain',
    WebkitOverflowScrolling: 'touch',
  }

  return (
    <div
      ref={mergeRefs(parentRef, innerRef as any)}
      {...(innerProps as React.HTMLAttributes<HTMLDivElement>)}
      style={containerStyle}
    >
      <div
        style={{
          height: measuredTotal,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            ref={rowVirtualizer.measureElement}
            data-index={row.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${row.start}px)`,
            }}
          >
            {safeChildren[row.index]}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VirtualizedMenuList
