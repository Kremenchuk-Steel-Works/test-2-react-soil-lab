import { useEffect, useId, useMemo, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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
} from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { CSSObjectWithLabel } from 'react-select'
import { APP_ROUTES } from '@/app/routes/routes'
import Button from '@/shared/ui/button/Button'
import { AdaptiveInput } from '@/shared/ui/input-field/AdaptiveInput'
import InputField from '@/shared/ui/input-field/InputField'
import ReactSelectNoLabel, {
  type ReactSelectNoLabelOption,
} from '@/shared/ui/select/ReactSelectNoLabel'
import { findRouteByKey } from '@/utils/routes/routeUtils'

type AnyIcon = React.ComponentType<{ className?: string }>
type RouteLike = {
  key: string
  label: string
  path: string
  icon: AnyIcon
  children?: RouteLike[]
}

type RouteRow = {
  key: string
  label: string
  path: string
  icon: AnyIcon
}

type Props = {
  parentRouteKey: string
  rowClickNavigates?: boolean
}

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

const ch = createColumnHelper<RouteRow>()

export default function RouteTableView({ parentRouteKey, rowClickNavigates = true }: Props) {
  const id = useId()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // === URL state ===
  const pageFromUrl = Number(searchParams.get('page') ?? '1')
  const perPageFromUrl = Number(searchParams.get('perPage') ?? '10')
  const qFromUrl = searchParams.get('q') ?? ''

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: Math.max(0, pageFromUrl - 1),
    pageSize: perPageFromUrl,
  })
  const [sorting, setSorting] = useState<SortingState>([{ id: 'label', desc: true }])
  const [query, setQuery] = useState(qFromUrl)

  // keep URL in sync when pagination/query changes
  useEffect(() => {
    setSearchParams(
      (prev) => {
        prev.set('page', String(pagination.pageIndex + 1))
        prev.set('perPage', String(pagination.pageSize))
        if (query) prev.set('q', query)
        else prev.delete('q')
        return prev
      },
      { replace: true },
    )
  }, [pagination.pageIndex, pagination.pageSize, query, setSearchParams])

  // === Build rows from routes ===
  const allRows: RouteRow[] = useMemo(() => {
    const parent = findRouteByKey(APP_ROUTES, parentRouteKey) as RouteLike | undefined
    if (!parent?.children) return []
    const children = parent.children.filter((c) => c.children && c.children.length > 0)
    return children.map((r) => ({
      key: r.key,
      label: r.label,
      path: r.path,
      icon: r.icon,
    }))
  }, [parentRouteKey])

  // === Search (across all pages) ===
  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allRows
    return allRows.filter((r) => r.label.toLowerCase().includes(q))
  }, [allRows, query])

  // Если текущая страница “выпала” после фильтра — откатим на последнюю доступную
  useEffect(() => {
    const pageCount = Math.max(1, Math.ceil(filteredRows.length / pagination.pageSize))
    if (pagination.pageIndex > pageCount - 1) {
      setPagination((p) => ({ ...p, pageIndex: pageCount - 1 }))
    }
  }, [filteredRows.length, pagination.pageIndex, pagination.pageSize])

  // === Columns (icon + name), with createColumnHelper ===
  const columns = useMemo(
    () => [
      ch.accessor('label', {
        id: 'label',
        header: 'Назва',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
        size: 850,
      }),
    ],
    [],
  )

  // === React Table (клиентская сортировка + пагинация) ===
  const table = useReactTable({
    data: filteredRows, // фильтруем ДО пагинации -> поиск по всем страницам
    columns,
    enableColumnResizing: true,
    enableSortingRemoval: false,
    columnResizeMode: 'onChange',
    defaultColumn: { size: 100, minSize: 50 },

    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const pageSizeOptions: ReactSelectNoLabelOption[] = [5, 10, 15, 20].map((size) => ({
    value: size,
    label: String(size),
  }))

  return (
    <>
      {/* Верхняя панель — стиль как у твоего DataTable */}
      <div className="mb-1 flex items-end justify-between whitespace-nowrap">
        <div className="flex items-center gap-1">
          {/* Единый поиск по названию */}
          <InputField
            label="Пошук"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              // при новом поиске всегда на первую страницу
              setPagination((p) => ({ ...p, pageIndex: 0 }))
            }}
          />
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

      {/* ===== Таблица (идентичный стиль) ===== */}
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
                      {/* Элемент для изменения ширины столбца */}
                      {canResize && (
                        <div
                          onMouseDown={(e) => {
                            e.stopPropagation()
                            header.getResizeHandler()(e)
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation()
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
              <tr
                key={row.id}
                className={`border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 ${
                  rowClickNavigates ? 'cursor-pointer' : ''
                }`}
                onClick={
                  rowClickNavigates
                    ? () => {
                        void navigate(row.original.path)
                      }
                    : undefined
                }
              >
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

      {/* Кнопки навигации по страницам — как в оригинале */}
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

        {/* Страницы */}
        <strong>
          <div className="inline-flex items-center gap-1">
            <AdaptiveInput
              id={`${id}-currentPage`}
              name="currentPage"
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const idx = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(idx)
              }}
            />
            <span className="select-none">/</span>
            <AdaptiveInput
              id={`${id}-totalPages`}
              name="totalPages"
              value={table.getPageCount()}
              readOnly
            />
          </div>
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
