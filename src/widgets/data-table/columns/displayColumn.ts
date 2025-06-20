import type { ReactNode } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

interface DisplayColumnOptions<TValue> {
  placeholder?: ReactNode
  formatter?: (value: TValue) => ReactNode
}

/**
 * Создает универсальную конфигурацию колонки для отображения данных.
 * Если значение отсутствует (null, undefined, пустая строка), отображает плейсхолдер.
 * Позволяет кастомизировать плейсхолдер и форматирование значения.
 *
 * @param options - Опции для кастомизации.
 */
export function displayColumn<TData, TValue>(
  options?: DisplayColumnOptions<TValue>,
): Pick<ColumnDef<TData, TValue>, 'cell'> {
  const { placeholder = '—', formatter } = options ?? {}

  return {
    cell: ({ getValue }) => {
      const value = getValue()

      // Проверяем на самые частые случаи "отсутствия" значения
      if (value === null || value === undefined || value === '') {
        return placeholder
      }

      // Если есть функция-форматтер, используем ее
      if (formatter) {
        return formatter(value)
      }

      // В противном случае, возвращаем само значение.
      return value as ReactNode
    },
  }
}
