import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import Button from "../../../../shared/ui/button/Button"
import { DataTable } from "../../../../widgets/data-table/DataTable"
import { userService } from "../../../../entities/admin/users/services/service"
import { adminUsersColumns } from "./columns"
import type { UserListResponse } from "../../../../entities/admin/users/types/response.dto"
import { usePaginationParams } from "../../../../shared/hooks/usePaginationParams"
import { userQueryKeys } from "../../../../entities/admin/users/services/keys"
import AlertMessage, {
  AlertType,
} from "../../../../shared/ui/alert-message/AlertMessage"

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
    queryKey: userQueryKeys.list(page, perPage),
    queryFn: () => {
      return userService.getList({
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
        <AlertMessage type={AlertType.ERROR} message={queryError?.message} />
      )}

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
