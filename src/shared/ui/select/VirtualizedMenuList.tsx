// src/shared/ui/select/VirtualizedMenuList.tsx
import { useEffect, useMemo, useRef, type JSX, type MutableRefObject } from 'react'
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
  ...refs: Array<MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined>
) {
  return (instance: T | null) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === 'function') ref(instance)
      else (ref as MutableRefObject<T | null>).current = instance
    }
  }
}

export function VirtualizedMenuList<
  OptionType extends { label: string; value: unknown },
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>,
>({
  children,
  maxHeight = MENU_MAX_HEIGHT,
  selectProps,
  innerRef, // берём только то, что реально нужно
  innerProps, // aria/role/handlers от react-select
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

  // размеры контента/вьюпорта
  const estimatedTotal = itemCount * DEFAULT_ROW_HEIGHT
  const measuredTotal = rowVirtualizer.getTotalSize()
  const contentHeight = Math.max(measuredTotal || 0, estimatedTotal)
  const viewportHeight = Math.min(maxHeight, contentHeight)
  const needScroll = contentHeight > maxHeight

  // догрузка при скролле к низу
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

  // автодогрузка, если контента меньше окна
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

  if (itemCount === 0) return <>{children}</>

  return (
    <div
      ref={mergeRefs(parentRef, innerRef as any)}
      style={{
        height: viewportHeight,
        maxHeight,
        overflowY: needScroll ? 'auto' : 'hidden',
      }}
      {...(innerProps as React.HTMLAttributes<HTMLDivElement>)} // ТОЛЬКО innerProps!
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
