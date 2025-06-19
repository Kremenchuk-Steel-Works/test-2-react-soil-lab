import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"

/**
 * Создает конфигурацию колонки для отображения ID в виде ссылки.
 * @returns Конфигурация { cell } для колонки таблицы.
 */
export function idColumn<TData>(): Pick<
  ColumnDef<TData, string | number>,
  "cell"
> {
  return {
    cell: ({ getValue }) => {
      const id = getValue()
      if (!id) {
        return "-"
      }

      return (
        <Link className="text-blue-500 hover:underline" to={id.toString()}>
          {id}
        </Link>
      )
    },
  }
}
