import Button from "../../components/Button/Button"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
  ArrowLeft,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ListRestart,
  Plus,
} from "lucide-react"
import type { UserResponse, UsersData } from "../../types/User"
import { apiUsers } from "../../services/user"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table"
import { ChevronUp, ChevronsUpDown } from "lucide-react"
import { useEffect, useState } from "react"
import InputField from "../../components/InputField/InputField"
import Select from "../../components/Select/Select"
import InputFieldNoLabel from "../../components/InputField/InputFieldNoLabel"

const defaultColumns: ColumnDef<UserResponse, string>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
    sortDescFirst: false,
    enableColumnFilter: true,
    filterFn: "includesString",
    cell: (row) => (
      <Link className="text-blue-500" to={row.getValue().toString()}>
        {row.getValue()}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    accessorFn: (row) => `${row.profile.first_name} ${row.profile.last_name}`,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "employee_number",
    header: "Number",
    accessorFn: (row) => `${row.profile.employee_number}`,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    accessorFn: (row) => `${row.roles.map((r) => r.name).join(", ")}`,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
]

export default function AdminUsersList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const pageFromUrl = Number(searchParams.get("page")) || 1
  const rawPerPageFromUrl = Number(searchParams.get("per_page")) || 10
  const perPageFromUrl = rawPerPageFromUrl > 20 ? 20 : rawPerPageFromUrl

  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: false },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: pageFromUrl - 1,
    pageSize: perPageFromUrl,
  })

  // Получение данных, usersData
  const {
    data: usersData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<UsersData, Error>({
    queryKey: ["usersData", pageFromUrl, perPageFromUrl],
    queryFn: () =>
      apiUsers({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
      }),
    placeholderData: keepPreviousData,
  })

  // Синхронизируем URL с изменениями пагинации
  useEffect(() => {
    setSearchParams({
      page: String(pagination.pageIndex + 1),
      per_page: String(pagination.pageSize),
    })
  }, [pagination.pageIndex, pagination.pageSize, setSearchParams])

  // Получение таблицы
  const table = useReactTable({
    data: usersData?.users ?? [],
    columns: defaultColumns,
    state: { sorting, columnFilters, pagination },
    manualPagination: true,
    pageCount: usersData?.total_pages ?? 0,
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate("..")}
        >
          <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
        </Button>
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate("add")}
        >
          <Plus className="w-5 h-5" /> <span>Додати</span>
        </Button>
      </div>

      {isError && (
        <p className="text-red-600">Помилка: {queryError?.message}</p>
      )}

      {!isLoading && !isError && usersData && (
        <div>
          {/* ===== Строка фильтров ===== */}
          <div className="flex flex-wrap gap-2 mb-2">
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => {
                if (!header.column.getCanFilter()) return null
                const filterValue = (header.column.getFilterValue() ??
                  "") as string
                return (
                  <div key={header.id} className="flex flex-col">
                    <InputField
                      label={`Фильтр ${String(header.column.columnDef.header)}`}
                      value={filterValue}
                      onChange={(e) =>
                        header.column.setFilterValue(e.target.value)
                      }
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
                  value={usersData.total_pages}
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
              <Select
                heightClass="h-9"
                options={[1, 5, 10, 15, 20].map((size) => ({
                  value: size,
                  label: String(size),
                }))}
                value={table.getState().pagination.pageSize}
                onChange={(newSize) => {
                  setPagination((old) => ({
                    ...old,
                    pageSize: Number(newSize),
                    pageIndex: 0, // сброс на первую страницу
                  }))
                }}
                placeholder="Номер"
              />
            </strong>
          </div>

          {/* ===== Таблица ===== */}
          <div className="overflow-x-auto">
            <table className="table-fixed w-full border-spacing-0 rounded-lg overflow-hidden">
              <thead className="bg-gray-200 dark:bg-gray-700">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="
                        px-4 py-2 
                        select-none hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer
                        overflow-hidden whitespace-nowrap"
                      >
                        {!header.isPlaceholder && (
                          <div className="flex items-center gap-1">
                            <span className="truncate">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                            <ChevronUp
                              className={`transform transition-all duration-300 ease-in-out origin-center ${
                                header.column.getIsSorted() === "asc"
                                  ? "opacity-100 w-5 h-5 rotate-0 text-blue-500"
                                  : header.column.getIsSorted() === "desc"
                                  ? "opacity-100 w-5 h-5 rotate-180 text-blue-500"
                                  : "opacity-0 w-0 h-0"
                              }`}
                            />
                            <ChevronsUpDown
                              className={`transform transition-all duration-300 ease-in-out origin-center text-gray-400 ${
                                header.column.getIsSorted()
                                  ? "opacity-0 w-0 h-0"
                                  : "opacity-100 w-5 h-5"
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
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
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
        </div>
      )}
    </>
  )
}
