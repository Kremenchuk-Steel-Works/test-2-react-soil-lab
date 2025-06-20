import type { ReactNode } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

interface ListColumnOptions<TItem> {
  placeholder?: ReactNode
  separator?: string
  limit?: number
  formatter?: (item: TItem) => string
}

/**
 * Создает конфигурацию колонки для отображения массива в виде строки.
 *
 * @example
 * // Отображение массива строк
 * columnHelper.accessor("tags", {
 * header: "Теги",
 * ...listColumn({ limit: 3 }),
 * })
 */
export function listColumn<TData, TItem>(
  options?: ListColumnOptions<TItem>,
): Pick<ColumnDef<TData, TItem[] | null | undefined>, 'cell' | 'filterFn'> {
  const {
    placeholder = '—',
    separator = ', ',
    limit,
    formatter = (item: TItem) => String(item),
  } = options ?? {}

  const formatList = (list: TItem[] | null | undefined): string => {
    if (!list || list.length === 0) return ''
    return list.map(formatter).join(separator)
  }

  return {
    cell: ({ getValue }) => {
      const list = getValue()
      if (!list || list.length === 0) {
        return placeholder
      }

      const itemsToDisplay = limit ? list.slice(0, limit) : list
      let displayText = formatList(itemsToDisplay)
      const remainingCount = limit ? list.length - limit : 0

      if (remainingCount > 0) {
        displayText += `${separator}... (+${remainingCount})`
      }

      return displayText
    },
    filterFn: (row, columnId, filterValue) => {
      const list = row.getValue<TItem[] | null | undefined>(columnId)
      const fullText = formatList(list)
      return fullText.toLowerCase().includes(filterValue.toLowerCase())
    },
  }
}
