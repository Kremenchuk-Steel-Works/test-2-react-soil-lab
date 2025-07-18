import { useEffect, useRef, type JSX } from 'react'
import { type GroupBase, type MenuListProps } from 'react-select'
import { FixedSizeList, type ListOnScrollProps } from 'react-window'

const OPTION_HEIGHT = 48
const MENU_MAX_HEIGHT = 300

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

export function VirtualizedMenuList<
  OptionType extends { label: string; value: unknown },
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>,
>({
  children,
  maxHeight = MENU_MAX_HEIGHT,
  selectProps,
}: AsyncPaginateMenuListProps<OptionType, IsMulti, Group>): JSX.Element {
  const { handleScrolledToBottom, isLoading } = selectProps

  const outerRef = useRef<HTMLDivElement | null>(null)
  const scrollOffsetRef = useRef(0)

  const safeChildren = Array.isArray(children) ? children : []
  const itemCount = safeChildren.length
  const listHeight = Math.min(maxHeight, itemCount * OPTION_HEIGHT)
  const totalScrollHeight = itemCount * OPTION_HEIGHT

  // Эффект для блокировки скролла страницы
  useEffect(() => {
    const element = outerRef.current
    if (!element) return

    const handleWheel = (e: WheelEvent) => {
      if (totalScrollHeight <= listHeight) {
        return
      }

      const currentScroll = scrollOffsetRef.current
      const isScrollingUp = e.deltaY < 0
      const isScrollingDown = e.deltaY > 0

      if (currentScroll === 0 && isScrollingUp) {
        e.preventDefault()
        return
      }

      const isAtBottom = currentScroll + listHeight >= totalScrollHeight - 1
      if (isAtBottom && isScrollingDown) {
        e.preventDefault()
        return
      }
    }

    element.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      element.removeEventListener('wheel', handleWheel)
    }
  }, [listHeight, totalScrollHeight])

  if (itemCount === 0) {
    return <>{children}</>
  }

  const handleScroll = ({ scrollOffset }: ListOnScrollProps): void => {
    scrollOffsetRef.current = scrollOffset

    if (!handleScrolledToBottom || isLoading) {
      return
    }

    if (scrollOffset + listHeight >= totalScrollHeight - 20) {
      handleScrolledToBottom()
    }
  }

  return (
    <FixedSizeList
      height={listHeight}
      itemCount={itemCount}
      itemSize={OPTION_HEIGHT}
      width="100%"
      onScroll={handleScroll}
      outerRef={outerRef}
    >
      {({ index, style }) => <div style={style}>{safeChildren[index]}</div>}
    </FixedSizeList>
  )
}
