import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { ChevronsUpDown, ChevronUp } from 'lucide-react'
import Button from '@/shared/ui/button/Button'
import InputField from '@/shared/ui/input-field/InputField'

export type SimpleClientTableProps<T> = {
  data: T[]
  columns: ColumnDef<T, any>[]
  initialPageSize?: number
}

export function SimpleClientTable<T>({
  data,
  columns,
  initialPageSize = 20,
}: SimpleClientTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="flex flex-1 flex-col space-y-2">
      <InputField
        label="Пошук"
        value={globalFilter ?? ''}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="max-w-sm"
      />
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-spacing-0 overflow-hidden rounded-lg">
          <thead className="bg-gray-200 dark:bg-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="overflow-hidden px-4 py-2 whitespace-nowrap select-none hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {!header.isPlaceholder && (
                      <div
                        className={`flex items-center ${
                          header.column.getCanSort() ? 'cursor-pointer' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
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
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-200 dark:border-gray-700">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="overflow-hidden px-4 py-2 text-ellipsis">
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
      {/* Пагинация */}
      <div className="flex items-center justify-end gap-2">
        <span className="text-sm">
          Страница {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
        </span>
        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Назад
        </Button>
        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Вперед
        </Button>
      </div>
    </div>
  )
}
