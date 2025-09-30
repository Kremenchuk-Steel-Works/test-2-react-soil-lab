import type { ReactNode } from 'react'
import type { CellContext, ColumnDef } from '@tanstack/react-table'

interface DisplayColumnOptions<TData, TValue> {
  placeholder?: ReactNode
  // Можно передавать только value, а можно и value + row + ctx
  formatter?: (value: TValue, row: TData, ctx: CellContext<TData, TValue>) => ReactNode
}

/**
 * Универсальная колонка отображения.
 * Теперь formatter получает value + весь row.original + контекст ячейки.
 */
export function displayColumn<TData, TValue>(
  options?: DisplayColumnOptions<TData, TValue>,
): Pick<ColumnDef<TData, TValue>, 'cell'> {
  const { placeholder = '—', formatter } = options ?? {}

  return {
    cell: (ctx) => {
      const value = ctx.getValue() as TValue
      // частые "пустые" значения
      if (value === null || value === undefined || value === '') {
        return placeholder
      }

      if (formatter) {
        // пробрасываем всю строку (сырой ответ бекенда) и контекст
        return formatter(value, ctx.row.original, ctx)
      }

      return value as ReactNode
    },
  }
}
