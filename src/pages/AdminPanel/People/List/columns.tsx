import { createColumnHelper } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { PersonListItemResponse } from "../../../../features/admin/people/types/response.dto"
import { booleanColumn } from "../../../../components/Table/booleanColumn"
import { optionColumn } from "../../../../components/Table/optionColumn"
import { genderOptions } from "../../../../features/admin/people/types/gender"

const columnHelper = createColumnHelper<PersonListItemResponse>()

export const adminPeopleColumns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => (
      <Link className="text-blue-500" to={info.getValue()}>
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("fullName", {
    header: "Повне ім'я",
    size: 145,
  }),
  columnHelper.accessor("gender", {
    header: "Стать",
    size: 100,
    ...optionColumn(genderOptions),
  }),
  columnHelper.accessor("photoUrl", {
    header: "Фото",
    size: 100,
    cell: (info) =>
      info.getValue() ? (
        <img
          src={info.getValue()}
          alt="Photo"
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        "—"
      ),
  }),
  columnHelper.accessor("isUser", {
    header: "Користувач?",
    size: 155,
    ...booleanColumn(),
  }),
  columnHelper.accessor("isEmployee", {
    header: "Робітник?",
    size: 135,
    ...booleanColumn(),
  }),
  columnHelper.accessor("contactsCount", {
    header: "К-сть контактів",
    size: 180,
    cell: ({ getValue }) => getValue() ?? 0,
  }),
  columnHelper.accessor("addressesCount", {
    header: "К-сть адрес",
    size: 150,
    cell: ({ getValue }) => getValue() ?? 0,
  }),
  columnHelper.accessor("organizationNames", {
    header: "Організація",
    size: 150,
    cell: (info) => info.getValue().join(", "),
  }),
  columnHelper.accessor("positionNames", {
    header: "Посада",
    size: 115,
    cell: (info) => info.getValue().join(", "),
  }),
]
