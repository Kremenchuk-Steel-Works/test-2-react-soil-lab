import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import Button from "../../../../components/Button/Button"
import { DataTable } from "../../../../components/Table/DataTable"
import { usersService } from "../../../../features/admin/users/services/service"
import { adminUsersColumns } from "./columns"
import type { UserListResponse } from "../../../../features/admin/users/types/response.dto"

export default function AdminUsersList() {
  // Состояние из URL
  const [searchParams, setSearchParams] = useSearchParams()
  const pageFromUrl = Number(searchParams.get("page")) || 1
  const rawPerPageFromUrl = Number(searchParams.get("perPage")) || 10
  const perPageFromUrl = rawPerPageFromUrl > 20 ? 20 : rawPerPageFromUrl

  const navigate = useNavigate()

  // Получение данных
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<UserListResponse, Error>({
    queryKey: ["adminUsersData", pageFromUrl, perPageFromUrl],
    queryFn: () => {
      return usersService.getList({
        page: pageFromUrl,
        perPage: perPageFromUrl,
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
          label: <p />,
        }}
      >
        {({ onSuccess }) => (
          <AdminUsersAdd2 key={formKey} onSuccess={onSuccess} />
        )}
      </BottomSheetButton> */}

      {!isLoading && !isError && data && (
        <DataTable
          data={data?.data ?? []}
          columns={adminUsersColumns}
          setSearchParams={setSearchParams}
          page={pageFromUrl}
          perPage={perPageFromUrl}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
