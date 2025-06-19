import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import Button from "../../../../shared/ui/button123/Button"
import { DataTable } from "../../../../widgets/data-table/DataTable"
import { adminPositionsColumns } from "./columns"
import { positionService } from "../../../../entities/admin/positions/services/service"
import type { PositionListResponse } from "../../../../entities/admin/positions/types/response.dto"
import { usePaginationParams } from "../../../../shared/hooks/usePaginationParams"
import { positionQueryKeys } from "../../../../entities/admin/positions/services/keys"
import AlertMessage, {
  AlertType,
} from "../../../../shared/ui/alert-message/AlertMessage"

export default function AdminPositionsList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = usePaginationParams()
  const navigate = useNavigate()

  // Получение данных, usersData
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PositionListResponse, Error>({
    queryKey: positionQueryKeys.list(page, perPage),
    queryFn: () => {
      return positionService.getList({
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
          columns={adminPositionsColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
