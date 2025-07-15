import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table'
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ListFilter,
  ListRestart,
} from 'lucide-react'
import type { SetURLSearchParams } from 'react-router-dom'
import type { CSSObjectWithLabel } from 'react-select'
import Button from '@/shared/ui/button/Button'
import InputField from '@/shared/ui/input-field/InputField'
import InputFieldNoLabel from '@/shared/ui/input-field/InputFieldNoLabel'
import ModalTrigger from '@/shared/ui/modal/ModalTrigger'
import CustomMultiSelect from '@/shared/ui/select/ReactSelectCheckbox'
import ReactSelectNoLabel, {
  type ReactSelectNoLabelOption,
} from '@/shared/ui/select/ReactSelectNoLabel'

export type DataTableProps<T> = {
  data: T[]
  columns: ColumnDef<T, any>[]
  page: number
  perPage: number
  setSearchParams: SetURLSearchParams
  enableSortingRemoval?: boolean
  totalPages?: number
  initialSorting?: SortingState
}

export function DataTable<T>({
  data,
  columns,
  page,
  perPage,
  totalPages,
  setSearchParams,
  enableSortingRemoval = false,
  initialSorting,
}: DataTableProps<T>) {
  // Состояния таблицы
  const [sorting, setSorting] = useState<SortingState>(
    initialSorting ?? [{ id: 'id', desc: false }],
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: page - 1,
      pageSize: perPage,
    }),
    [page, perPage],
  )

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    defaultColumn: {
      size: 100,
      minSize: 50,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater(pagination) : updater
      setSearchParams(
        (prev) => {
          prev.set('page', String(newState.pageIndex + 1))
          prev.set('perPage', String(newState.pageSize))
          return prev
        },
        { replace: true },
      )
    },
    pageCount: totalPages ?? 0,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    enableSortingRemoval,
  })

  const reactStyles = {
    control: (base: CSSObjectWithLabel) => ({
      ...base,
      minHeight: '36px',
      height: '36px',
      minWidth: '85px',
      padding: '0 8px',
    }),
    valueContainer: (base: CSSObjectWithLabel) => ({
      ...base,
      padding: '0 8px',
    }),
    input: (base: CSSObjectWithLabel) => ({
      ...base,
      margin: '0',
    }),
    dropdownIndicator: (base: CSSObjectWithLabel) => ({
      ...base,
      paddingTop: '0',
      paddingBottom: '0',
    }),
    clearIndicator: (base: CSSObjectWithLabel) => ({
      ...base,
      paddingTop: '0',
      paddingBottom: '0',
    }),
  }

  const pageSizeOptions = [1, 5, 10, 15, 20].map((size) => ({
    value: size,
    label: String(size),
  }))

  const columnOptions = table.getAllLeafColumns().map((column) => ({
    label: String(column.columnDef.header),
    value: column.id,
    disabled: !column.getCanHide(),
  }))

  return (
    <>
      {/* Навигация по страницам */}
      <div className="mb-1 flex items-center justify-between whitespace-nowrap">
        <div className="flex items-center gap-1">
          {/* Выбор колонок */}
          <CustomMultiSelect
            placeholder="Вибір колонок"
            customClassNames={{
              control: () => 'border-0 bg-gray-200 dark:bg-gray-700',
            }}
            isSearchable={false}
            customStyles={reactStyles}
            options={columnOptions}
            selectedOptions={columnOptions.filter((option) =>
              table.getColumn(option.value)?.getIsVisible(),
            )}
            onChange={(selected: ReactSelectNoLabelOption[]) => {
              const newVisibility: Record<string, boolean> = {}
              columnOptions.forEach((option) => {
                newVisibility[option.value] = selected.some((sel) => sel.value === option.value)
              })
              setColumnVisibility(newVisibility)
            }}
          />

          <ModalTrigger
            trigger={(open) => (
              <Button
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                onClick={open}
              >
                <ListFilter className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              </Button>
            )}
            sheetProps={{
              label: <p className="text-lg font-semibold">Фільтри</p>,
            }}
          >
            <div className="flex flex-wrap justify-center gap-3">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => {
                  if (!header.column.getCanFilter()) return null
                  const filterValue = (header.column.getFilterValue() ?? '') as string
                  return (
                    <div key={header.id} className="w-full">
                      <InputField
                        label={`${String(header.column.columnDef.header)}`}
                        value={filterValue}
                        onChange={(e) => header.column.setFilterValue(e.target.value)}
                      />
                    </div>
                  )
                }),
              )}
            </div>
          </ModalTrigger>

          {/* Кнопка сброса фильтров */}
          {table.getState().columnFilters.some((f) => f.value !== '') && (
            <Button
              className="gap-50. flex items-center justify-center bg-gray-200 py-1.5 whitespace-nowrap text-slate-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-gray-600"
              onClick={() => table.resetColumnFilters()}
            >
              <ListRestart className="h-6 w-5" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Выбор числа строк */}
          <strong className="flex items-center">
            <ReactSelectNoLabel
              placeholder="Кількість"
              customClassNames={{
                control: () => 'border-0 bg-gray-200 dark:bg-gray-700',
              }}
              customStyles={reactStyles}
              isClearable={false}
              isSearchable={false}
              options={pageSizeOptions}
              value={pageSizeOptions.find(
                (opt) => opt.value === table.getState().pagination.pageSize,
              )}
              onChange={(selectedOption) => {
                const newSize = selectedOption?.value
                if (!newSize) return

                setSearchParams(
                  (prev) => {
                    prev.set('perPage', String(newSize))
                    prev.set('page', '1') // Сбрасываем на первую страницу
                    return prev
                  },
                  { replace: true },
                )
              }}
            />
          </strong>
        </div>
      </div>

      {/* ===== Таблица ===== */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-spacing-0 overflow-hidden rounded-lg">
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
                      className="relative overflow-hidden px-4 py-2 whitespace-nowrap select-none hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      {!header.isPlaceholder && (
                        <div
                          className={`flex items-center ${canSort ? 'cursor-pointer' : ''}`}
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        >
                          <div className="flex min-w-0 items-center">
                            <span className="mr-1 min-w-0 truncate text-left">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                            {/* Иконки сортировки */}
                            <ChevronUp
                              className={`shrink-0 origin-center transform transition-all duration-200 ease-in-out ${
                                header.column.getIsSorted() === 'asc'
                                  ? 'h-5 w-5 rotate-0 text-blue-500 opacity-100'
                                  : header.column.getIsSorted() === 'desc'
                                    ? 'h-5 w-5 rotate-180 text-blue-500 opacity-100'
                                    : 'h-0 w-0 opacity-0'
                              }`}
                            />
                            <ChevronsUpDown
                              className={`shrink-0 origin-center transform text-gray-400 transition-all duration-200 ease-in-out ${
                                header.column.getIsSorted()
                                  ? 'h-0 w-0 opacity-0'
                                  : 'h-5 w-5 opacity-100'
                              }`}
                            />
                          </div>
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
                          className="absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none select-none"
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
              <tr key={row.id} className="border-b border-gray-200 dark:border-gray-700">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className="overflow-hidden px-4 py-2 text-ellipsis whitespace-nowrap"
                  >
                    <div className="min-w-0 truncate">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Кнопки назад/вперёд */}
      <div className="flex items-center gap-1">
        <Button
          className="bg-gray-200 text-slate-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-gray-600"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.firstPage()}
        >
          <ChevronFirst className="h-5 w-5" />
        </Button>
        <Button
          className="bg-gray-200 text-slate-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-gray-600"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          <ChevronLeft className="h-5 w-5" />
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
          className="bg-gray-200 text-slate-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-gray-600"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        <Button
          className="bg-gray-200 text-slate-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-gray-600"
          disabled={!table.getCanNextPage()}
          onClick={() => table.lastPage()}
        >
          <ChevronLast className="h-5 w-5" />
        </Button>
      </div>
    </>
  )
}
