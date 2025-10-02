import type { ColumnDef } from '@tanstack/react-table'
import { formatUiDate } from '@/shared/lib/datetime/formatUiDate'
import { toLowerSafe } from '@/shared/lib/strings/toLowerSafe'

interface DateColumnOptions {
  placeholder?: string
  formatter?: (date: Date) => string
}

/**
 * Создает конфигурацию колонки для отображения и фильтрации дат.
 * Эта функция безопасна, обрабатывает отсутствующие значения и позволяет
 * кастомизировать формат вывода.
 *
 * @param options - Объект с опциями для кастомизации.
 */
export function dateColumn<TData>(
  options?: DateColumnOptions,
): Pick<ColumnDef<TData, string | undefined | null>, 'cell' | 'filterFn'> {
  // Устанавливаем значения по умолчанию, если они не предоставлены
  const { placeholder = '—', formatter = (date: Date) => formatUiDate(date) } = options ?? {}

  return {
    cell: ({ getValue }) => {
      const dateValue = getValue()
      // Проверяем, что значение существует, прежде чем создавать Date
      return dateValue ? formatter(new Date(dateValue)) : placeholder
    },

    filterFn: (row, columnId, filterValue) => {
      const rawValue = row.getValue<string | undefined | null>(columnId)
      // Получаем отформатированное значение в том же виде, как в `cell`,
      const displayValue = rawValue ? formatter(new Date(rawValue)) : ''
      const haystack = toLowerSafe(displayValue)
      const needle = toLowerSafe(filterValue)

      // Пустой фильтр — не ограничивает выдачу
      if (needle === '') return true
      return haystack.includes(needle)
    },
  }
}
