import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table"
import { useEffect, useState } from "react"
import InputField from "../InputField/InputField"
import Button from "../Button/Button"
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ListRestart,
} from "lucide-react"
import InputFieldNoLabel from "../InputField/InputFieldNoLabel"
import type { SetURLSearchParams } from "react-router-dom"
import ReactSelect, { type Option } from "../Select/ReactSelect"
import type { StylesConfig } from "react-select"

type DataTableProps<T> = {
  data: T[]
  columns: ColumnDef<T, any>[]
  page: number
  perPage: number
  setSearchParams: SetURLSearchParams
  enableSortingRemoval?: boolean
  totalPages?: number
}

export function DataTable<T>({
  data,
  columns,
  page,
  perPage,
  totalPages,
  setSearchParams,
  enableSortingRemoval = false,
}: DataTableProps<T>) {
  // Состояния таблицы
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: perPage,
  })

  // Синхронизируем URL с изменениями пагинации
  useEffect(() => {
    setSearchParams({
      page: String(pagination.pageIndex + 1),
      perPage: String(pagination.pageSize),
    })
  }, [pagination.pageIndex, pagination.pageSize, setSearchParams])

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    defaultColumn: {
      size: 75,
      minSize: 75,
    },
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    pageCount: totalPages ?? 0,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    enableSortingRemoval,
  })

  const pageSizeStyles: StylesConfig<Option, false> = {
    control: (base) => ({
      ...base,
      minHeight: "36px",
      padding: "0 8px",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px",
    }),
    input: (base) => ({
      ...base,
      margin: "0",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingTop: "0",
      paddingBottom: "0",
    }),
    clearIndicator: (base) => ({
      ...base,
      paddingTop: "0",
      paddingBottom: "0",
    }),
  }

  const pageSizeClassName = {
    control: () => "border-0",
  }

  const pageSizeOptions = [1, 5, 10, 15, 20].map((size) => ({
    value: size,
    label: String(size),
  }))

  return (
    <>
      {/* ===== Строка фильтров ===== */}
      <div className="flex flex-wrap gap-2 mb-2">
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => {
            if (!header.column.getCanFilter()) return null
            const filterValue = (header.column.getFilterValue() ?? "") as string
            return (
              <div key={header.id} className="flex flex-col">
                <InputField
                  label={`Фильтр ${String(header.column.columnDef.header)}`}
                  value={filterValue}
                  onChange={(e) => header.column.setFilterValue(e.target.value)}
                />
              </div>
            )
          })
        )}
      </div>

      {/* Навигация по страницам */}
      <div className="flex items-center justify-between mb-1 whitespace-nowrap">
        {/* Кнопки назад/вперёд */}
        <div className="flex gap-1 items-center">
          <Button
            className="text-slate-700 dark:text-slate-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.firstPage()}
          >
            <ChevronFirst className="w-5 h-5" />
          </Button>
          <Button
            className="text-slate-700 dark:text-slate-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <strong className="flex items-center">
            <InputFieldNoLabel
              className="w-13"
              inputClassName="h-9 border-0 focus:ring-0 px-0 text-center dark:bg-gray-800 bg-gray-100"
              type="number"
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                table.setPageIndex(Number(e.target.value) - 1)
              }}
            />
            <span className="select-none">/</span>
            <InputFieldNoLabel
              className="w-13"
              inputClassName="h-9 border-0 focus:ring-0 px-0 text-center dark:bg-gray-800 bg-gray-100"
              type="number"
              readOnly
              value={table.getPageCount()}
            />
          </strong>
          <Button
            className="text-slate-700 dark:text-slate-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button
            className="text-slate-700 dark:text-slate-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            disabled={!table.getCanNextPage()}
            onClick={() => table.lastPage()}
          >
            <ChevronLast className="w-5 h-5" />
          </Button>
          {/* Кнопка сброса фильтров */}
          {table.getState().columnFilters.some((f) => f.value !== "") && (
            <Button
              className="flex items-center justify-center gap-50. py-1.5 whitespace-nowrap text-slate-700 dark:text-slate-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => table.resetColumnFilters()}
            >
              <ListRestart className="w-5 h-5" /> <span>Скинути</span>
            </Button>
          )}
        </div>
        {/* Выбор числа строк */}
        <strong>
          <ReactSelect<Option>
            placeholder="Кількість"
            customClassNames={pageSizeClassName}
            customStyles={pageSizeStyles}
            isClearable={false}
            isSearchable={false}
            options={pageSizeOptions}
            value={pageSizeOptions.find(
              (opt) => opt.value === table.getState().pagination.pageSize
            )}
            onChange={(selectedOption) => {
              const newSize = selectedOption?.value
              setPagination((old) => ({
                ...old,
                pageSize: Number(newSize),
                pageIndex: 0, // сброс на первую  страницу
              }))
            }}
          />
        </strong>
      </div>

      {/* ===== Таблица ===== */}
      <div className="overflow-x-auto">
        <table className="table-fixed w-full border-spacing-0 rounded-lg overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const canResize = header.column.getCanResize()
                  return (
                    <th
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="relative px-4 py-2 select-none hover:bg-gray-300 dark:hover:bg-gray-600 overflow-hidden whitespace-nowrap"
                    >
                      {!header.isPlaceholder && (
                        <div
                          className={`flex items-center gap-1 ${
                            canSort ? "cursor-pointer" : ""
                          }`}
                          onClick={
                            canSort
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          <span className="truncate">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {/* Иконки сортировки */}
                          <ChevronUp
                            className={`shrink-0 transform transition-all duration-300 ease-in-out origin-center ${
                              header.column.getIsSorted() === "asc"
                                ? "opacity-100 w-5 h-5 rotate-0 text-blue-500"
                                : header.column.getIsSorted() === "desc"
                                ? "opacity-100 w-5 h-5 rotate-180 text-blue-500"
                                : "opacity-0 w-0 h-0"
                            }`}
                          />
                          <ChevronsUpDown
                            className={`shrink-0 transform transition-all duration-300 ease-in-out origin-center text-gray-400 ${
                              header.column.getIsSorted()
                                ? "opacity-0 w-0 h-0"
                                : "opacity-100 w-5 h-5"
                            }`}
                          />
                        </div>
                      )}
                      {/* Элемент управления для изменения размера */}
                      {canResize && (
                        <div
                          onMouseDown={(e) => {
                            e.stopPropagation() // Предотвращение конфликта с сортировкой
                            header.getResizeHandler()(e)
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation() // Предотвращение конфликта с сортировкой
                            header.getResizeHandler()(e)
                          }}
                          className="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none"
                        />
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className="
                            px-4 py-2 
                            /* whitespace-nowrap + truncate внутри */
                          "
                  >
                    <div className="truncate min-w-0">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
