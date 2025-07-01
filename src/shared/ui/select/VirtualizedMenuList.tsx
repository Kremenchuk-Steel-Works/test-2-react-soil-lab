import { type JSX } from 'react'
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
>(props: AsyncPaginateMenuListProps<OptionType, IsMulti, Group>): JSX.Element {
  const { children, maxHeight = MENU_MAX_HEIGHT, selectProps } = props
  const { handleScrolledToBottom, isLoading } = selectProps

  // Если дочерних элементов нет (например, при поиске ничего не найдено),
  if (!Array.isArray(children) || children.length === 0) {
    return <>{children}</>
  }

  const listHeight = Math.min(maxHeight, children.length * OPTION_HEIGHT)
  const itemCount = children.length

  // Эта функция будет вызываться при каждом событии скролла в FixedSizeList
  const handleScroll = ({ scrollOffset }: ListOnScrollProps): void => {
    if (!handleScrolledToBottom || isLoading) {
      return
    }

    // Проверяем, достиг ли пользователь конца списка, с небольшим запасом
    if (scrollOffset + listHeight >= itemCount * OPTION_HEIGHT - 20) {
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
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </FixedSizeList>
  )
}
