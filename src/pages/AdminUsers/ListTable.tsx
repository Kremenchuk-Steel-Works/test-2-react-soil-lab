import Button from "../../components/Button/Button"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import type { UserResponse, UsersData } from "../../types/User"
import { apiUsers } from "../../services/user"
import { useQuery } from "@tanstack/react-query"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import { useState } from "react"

const defaultColumns: ColumnDef<UserResponse, string>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
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

  const {
    data: usersData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<UsersData, Error>({
    queryKey: ["usersData"],
    queryFn: apiUsers,
  })

  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: false },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: usersData?.users ?? [],
    columns: defaultColumns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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
          <div className="flex flex-wrap gap-4 mb-4">
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => {
                if (!header.column.getCanFilter()) return null
                const filterValue = (header.column.getFilterValue() ??
                  "") as string
                return (
                  <div
                    key={header.id}
                    className="flex flex-col w-full max-w-xs"
                  >
                    <label
                      htmlFor={`filter-${header.id}`}
                      className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {header.column.columnDef.header as string}
                    </label>
                    <input
                      id={`filter-${header.id}`}
                      type="text"
                      value={filterValue}
                      onChange={(e) =>
                        header.column.setFilterValue(e.target.value)
                      }
                      placeholder={`Фильтр ${String(
                        header.column.columnDef.header
                      )}`}
                      className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                )
              })
            )}
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
                        /* Чтобы заголовок тоже мог обрезаться */
                        overflow-hidden whitespace-nowrap
                      "
                      >
                        {!header.isPlaceholder && (
                          <div className="flex items-center gap-1">
                            <span className="truncate">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                            {(() => {
                              const sortState = header.column.getIsSorted()
                              if (sortState === "asc") {
                                return (
                                  <ArrowUp className="w-4 h-4 text-blue-500" />
                                )
                              }
                              if (sortState === "desc") {
                                return (
                                  <ArrowDown className="w-4 h-4 text-blue-500" />
                                )
                              }
                              return (
                                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                              )
                            })()}
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
