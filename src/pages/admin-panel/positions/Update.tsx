import Button from "../../../shared/ui/button123/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { positionService } from "../../../entities/admin/positions/services/service"
import type { PositionsFormFields } from "../../../entities/admin/positions/forms/schema"
import PositionsForm from "../../../entities/admin/positions/forms/form"
import type { PositionDetailResponse } from "../../../entities/admin/positions/types/response.dto"
import { positionQueryKeys } from "../../../entities/admin/positions/services/keys"
import AlertMessage, {
  AlertType,
} from "../../../shared/ui/alert-message/AlertMessage"

export default function AdminPositionsUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PositionDetailResponse, Error>({
    queryKey: positionQueryKeys.detail(id!),
    queryFn: () => positionService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: PositionsFormFields) => {
    await positionService.update(id!, data)
    navigate("..")
    return data
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate("..")}
        >
          <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
        </Button>
      </div>

      {isError && (
        <AlertMessage type={AlertType.ERROR} message={queryError?.message} />
      )}

      {!isLoading && !isError && data && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <PositionsForm
              onSubmit={handleSubmit}
              defaultValues={data}
              submitBtnName="Оновити"
            />
          </div>
        </div>
      )}
    </>
  )
}
