import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { PersonListItemResponse } from "../../../../features/admin/people/types/response.dto"

export const adminPeopleColumns: ColumnDef<PersonListItemResponse, string>[] = [
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
    accessorKey: "fullName",
    header: "Повне ім'я",
    size: 145,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "gender",
    header: "Стать",
    size: 100,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "photoUrl",
    header: "Фото",
    size: 100,
    cell: ({ getValue }) =>
      getValue() ? (
        <img
          src={getValue()}
          alt="Photo"
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        "—"
      ),
  },
  {
    accessorKey: "isUser",
    header: "Користувач?",
    size: 155,
    cell: ({ getValue }) => (getValue() ? "Так" : "Н"),
    enableSorting: true,
    filterFn: (row, columnId, filterValue) => {
      const displayValue = row.getValue<boolean>(columnId) ? "Так" : "Ні"
      return displayValue.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: "isEmployee",
    header: "Робітник?",
    size: 135,
    cell: ({ getValue }) => (getValue() ? "Так" : "Ні"),
    enableSorting: true,
    filterFn: (row, columnId, filterValue) => {
      const displayValue = row.getValue<boolean>(columnId) ? "Так" : "Ні"
      return displayValue.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: "contactsCount",
    header: "К-сть контактів",
    size: 180,
    enableSorting: true,
    cell: ({ getValue }) => getValue() ?? 0,
  },
  {
    accessorKey: "addressesCount",
    header: "К-сть адрес",
    size: 150,
    enableSorting: true,
    cell: ({ getValue }) => getValue() ?? 0,
  },
  {
    accessorKey: "organizationNames",
    header: "Організація",
    size: 150,
    cell: ({ getValue }) => {
      const value = getValue<string[]>()
      return Array.isArray(value) ? value.join(", ") : ""
    },
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "positionNames",
    header: "Посада",
    size: 115,
    cell: ({ getValue }) => {
      const value = getValue<string[]>()
      return Array.isArray(value) ? value.join(", ") : ""
    },
    enableColumnFilter: true,
    filterFn: "includesString",
  },
]
