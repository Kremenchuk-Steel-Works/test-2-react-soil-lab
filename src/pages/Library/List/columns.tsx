// import type { ColumnDef } from "@tanstack/react-table"
// import type { UserResponse } from "../../../types/User"
// import { Link } from "react-router-dom"

// export const adminUsersColumns: ColumnDef<UserResponse, string>[] = [
//   {
//     accessorKey: "id",
//     header: "ID",
//     enableSorting: true,
//     sortDescFirst: false,
//     enableColumnFilter: true,
//     filterFn: "includesString",
//     cell: (row) => (
//       <Link className="text-blue-500" to={row.getValue().toString()}>
//         {row.getValue()}
//       </Link>
//     ),
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//     enableSorting: true,
//     enableColumnFilter: true,
//     filterFn: "includesString",
//   },
//   {
//     accessorKey: "fullName",
//     header: "Full Name",
//     accessorFn: (row) => `${row.profile.first_name} ${row.profile.last_name}`,
//     enableSorting: true,
//     enableColumnFilter: true,
//     filterFn: "includesString",
//   },
//   {
//     accessorKey: "employee_number",
//     header: "Number",
//     accessorFn: (row) => `${row.profile.employee_number}`,
//     enableSorting: true,
//     enableColumnFilter: true,
//     filterFn: "includesString",
//   },
//   {
//     accessorKey: "roles",
//     header: "Roles",
//     accessorFn: (row) => `${row.roles.map((r) => r.name).join(", ")}`,
//     enableSorting: true,
//     enableColumnFilter: true,
//     filterFn: "includesString",
//   },
// ]
