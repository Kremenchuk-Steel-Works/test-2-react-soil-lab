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
    header: "Full Name",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "gender",
    header: "Gender",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "photoUrl",
    header: "Photo",
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
    header: "User",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    enableSorting: true,
  },
  {
    accessorKey: "isEmployee",
    header: "Employee",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    enableSorting: true,
  },
  {
    accessorKey: "contactsCount",
    header: "Contacts",
    enableSorting: true,
    cell: ({ getValue }) => getValue() ?? 0,
  },
  {
    accessorKey: "addressesCount",
    header: "Addresses",
    enableSorting: true,
    cell: ({ getValue }) => getValue() ?? 0,
  },
  {
    accessorKey: "organizationNames",
    header: "Organizations",
    cell: ({ getValue }) => {
      const value = getValue<string[]>()
      return Array.isArray(value) ? value.join(", ") : ""
    },
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "positionNames",
    header: "Positions",
    cell: ({ getValue }) => {
      const value = getValue<string[]>()
      return Array.isArray(value) ? value.join(", ") : ""
    },
    enableColumnFilter: true,
    filterFn: "includesString",
  },
]
