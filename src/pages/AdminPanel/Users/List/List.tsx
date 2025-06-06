import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import Button from "../../../../components/Button/Button"
import { DataTable } from "../../../../components/Table/DataTable"
import { usersService } from "../../../../features/admin/users/services/service"
import { adminUsersColumns } from "./columns"
import type { UserListResponse } from "../../../../features/admin/users/types/response.dto"
import { usePaginationParams } from "../../../../hooks/usePaginationParams"
// import BottomSheetButton from "../../../../components/ui/FilterButton/BottomSheetButton"
// import AdminUsersAdd2 from "../Add copy"

export default function AdminUsersList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = usePaginationParams()
  const navigate = useNavigate()

  // Получение данных
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<UserListResponse, Error>({
    queryKey: ["adminUsersData", page, perPage],
    queryFn: () => {
      return usersService.getList({
        page: page,
        perPage: perPage,
      })
    },
    placeholderData: keepPreviousData,
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

      {/* <BottomSheetButton
        label={<Plus className="w-5 h-5 text-slate-700 dark:text-slate-300" />}
        buttonProps={{
          className:
            "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600",
        }}
        sheetProps={{
          className: "h-full",
          label: <p className="text-lg font-semibold">Користувач</p>,
        }}
      >
        {({ onSuccess }) => <AdminUsersAdd2 onSuccess={onSuccess} />}
      </BottomSheetButton> */}

      {!isLoading && !isError && data && (
        <DataTable
          data={data?.data ?? []}
          columns={adminUsersColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
