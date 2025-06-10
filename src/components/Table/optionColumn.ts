import type { ColumnDef } from "@tanstack/react-table"

/**
 * Определяет структуру объекта опции для маппинга значений.
 */
export type Option<TValue> = {
  value: TValue
  label: string
}

/**
 * Создает конфигурацию колонки для отображения значений, маппируемых на основе предоставленных опций.
 * Это позволяет унифицировать обработку переводимых полей, таких как пол, статус и т.д.
 *
 * @param options Массив объектов { value: TValue, label: string }, используемый для маппинга.
 * @param defaultValue Значение по умолчанию, если оригинальное значение не найдено в опциях. По умолчанию "-".
 */
export function optionColumn<TData, TValue>(
  options: ReadonlyArray<Option<TValue>>,
  defaultValue: string = "-"
): Pick<ColumnDef<TData, TValue>, "cell" | "filterFn"> {
  const valueToLabelMap = new Map<TValue, string>(
    options.map((option) => [option.value, option.label])
  )

  return {
    cell: ({ getValue }) => {
      const value = getValue()
      return valueToLabelMap.get(value) ?? defaultValue
    },

    filterFn: (row, columnId, filterValue: string) => {
      const value = row.getValue<TValue>(columnId)
      const text = valueToLabelMap.get(value) ?? defaultValue

      return text.toLowerCase().includes(filterValue.toLowerCase())
    },
  }
}
