import type { ColumnDef } from "@tanstack/react-table"
import { optionColumn } from '@/widgets/data-table/columns/optionColumn'

/**
 * Создает конфигурацию колонки для отображения boolean значений.
 * Эта функция типобезопасна и гарантирует, что она применяется только к полям типа boolean.
 * @param trueLabel - Текст для значения `true`. По умолчанию "Так".
 * @param falseLabel - Текст для значения `false`. По умолчанию "Ні".
 */
export function booleanColumn<TData>(
  trueLabel = "Так",
  falseLabel = "Ні"
): Pick<ColumnDef<TData, boolean>, "cell" | "filterFn"> {
  const booleanOptions = [
    { value: true, label: trueLabel },
    { value: false, label: falseLabel },
  ] as const

  // Переиспользуем optionColumn для обработки булевых значений
  return optionColumn<TData, boolean>(booleanOptions)
}
