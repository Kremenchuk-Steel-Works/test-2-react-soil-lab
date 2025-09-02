import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type JSX,
  type RefObject,
} from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { GroupBase, MenuListProps } from 'react-select'
import { castRef, mergeRefs } from '@/shared/lib/refs'

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

/**
 * JS-фолбэк для блокировки прокрутки страницы,
 * если CSS `overscroll-behavior` не поддерживается.
 */
function useScrollLockFallback(elementRef: RefObject<HTMLElement | null>) {
  const supportsOverscrollContain = useMemo<boolean>(() => {
    return (
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('overscroll-behavior-y', 'contain')
    )
  }, [])

  useEffect(() => {
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

  // Определяем, можно ли виртуализировать (как в старой версии)
  const isArrayChildren = Array.isArray(children)

  // Нормализуем детей ВСЕГДА — но если не массив, получим []
  const safeChildren = useMemo<JSX.Element[]>(
    () => (isArrayChildren ? (children as unknown as JSX.Element[]) : []),
    [children, isArrayChildren],
  )

  const itemCount = safeChildren.length
  const shouldRenderVirtual = isArrayChildren && itemCount > 0

  // Реф и виртуализатор — ВСЕГДА вызываем хуки
  const parentRef = useRef<HTMLDivElement | null>(null)

  const rowVirtualizer = useVirtualizer({
    count: itemCount, // будет 0, если не виртуализируем
    getScrollElement: () => parentRef.current,
    estimateSize: () => DEFAULT_ROW_HEIGHT,
    overscan: 6,
    measureElement: (el) => el?.getBoundingClientRect().height ?? DEFAULT_ROW_HEIGHT,
  })

  // Вычисления высот — безопасны и при count=0
  const estimatedTotal = itemCount * DEFAULT_ROW_HEIGHT
  const measuredTotal = rowVirtualizer.getTotalSize()
  const contentHeight = Math.max(measuredTotal || 0, estimatedTotal)
  const viewportHeight = Math.min(maxHeight, contentHeight)
  const needScroll = contentHeight > maxHeight

  // Эффекты — вызываются всегда, но не сработают без контейнера
  useEffect(() => {
    const el = parentRef.current
    const bottomCb = handleScrolledToBottom
    if (!el || !bottomCb) return

    const onScroll = () => {
      if (isLoading) return
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - BOTTOM_THRESHOLD_PX) {
        bottomCb()
      }
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [handleScrolledToBottom, isLoading])

  const lastTriggeredCountRef = useRef<number>(-1)
  useEffect(() => {
    const bottomCb = handleScrolledToBottom
    if (!bottomCb || isLoading) return
    if (contentHeight < maxHeight && itemCount !== lastTriggeredCountRef.current) {
      lastTriggeredCountRef.current = itemCount
      bottomCb()
    }
  }, [contentHeight, maxHeight, itemCount, isLoading, handleScrolledToBottom])

  useEffect(() => {
    if (itemCount < lastTriggeredCountRef.current) lastTriggeredCountRef.current = -1
  }, [itemCount])

  // Скролл-лок — всегда, но без контейнера просто не активируется
  useScrollLockFallback(parentRef)

  // Стили контейнера для виртуализированного режима
  const htmlInnerProps = innerProps as unknown as HTMLAttributes<HTMLDivElement> | undefined
  const innerStyle: CSSProperties | undefined = htmlInnerProps?.style

  const containerStyle: CSSProperties = {
    ...(innerStyle ?? {}),
    height: viewportHeight,
    maxHeight,
    overflowY: needScroll ? 'auto' : 'hidden',
    overscrollBehaviorY: 'contain',
    WebkitOverflowScrolling: 'touch',
  }

  // Два режима. В НЕ виртуальном — просто отдаём детей
  if (!shouldRenderVirtual) {
    return <>{children}</>
  }

  return (
    <div
      ref={mergeRefs<HTMLDivElement>(parentRef, castRef<HTMLDivElement>(innerRef))}
      {...(htmlInnerProps as HTMLAttributes<HTMLDivElement>)}
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
