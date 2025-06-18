import { useCallback, useEffect, useRef, type JSX } from "react"
import { type GroupBase, type MenuListProps } from "react-select"
import { FixedSizeList } from "react-window"

const OPTION_HEIGHT = 48
const MENU_MAX_HEIGHT = 300

export function VirtualizedMenuList<
  OptionType extends { label: string; value: unknown },
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>
>(props: MenuListProps<OptionType, IsMulti, Group>): JSX.Element {
  const {
    options,
    children,
    maxHeight = MENU_MAX_HEIGHT,
    focusedOption,
  } = props

  const outerRef = useRef<HTMLDivElement | null>(null)
  const initialIndex = focusedOption ? options.indexOf(focusedOption) : -1
  const initialOffset = initialIndex !== -1 ? initialIndex * OPTION_HEIGHT : 0

  const handleWheel = useCallback((event: globalThis.WheelEvent) => {
    const list = outerRef.current
    if (!list) return

    const { scrollTop, scrollHeight, clientHeight } = list
    const { deltaY } = event

    if (deltaY < 0 && scrollTop === 0) {
      event.preventDefault()
      return
    }

    if (deltaY > 0 && scrollHeight - clientHeight - scrollTop <= 1) {
      event.preventDefault()
      return
    }
  }, [])

  useEffect(() => {
    const listElement = outerRef.current
    if (listElement) {
      listElement.addEventListener("wheel", handleWheel)
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener("wheel", handleWheel)
      }
    }
  }, [handleWheel])

  if (!Array.isArray(children) || children.length === 0) {
    return <>{children}</>
  }

  const listHeight = Math.min(maxHeight, children.length * OPTION_HEIGHT)

  return (
    <FixedSizeList
      height={listHeight}
      itemCount={children.length}
      itemSize={OPTION_HEIGHT}
      initialScrollOffset={initialOffset}
      width="100%"
      outerRef={outerRef}
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </FixedSizeList>
  )
}
