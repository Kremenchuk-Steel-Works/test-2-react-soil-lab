import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { Position } from "../../../features/admin/positions/types"
import { positionsService } from "../../../features/admin/positions/services/service"
import type { PositionsFormFields } from "../../../features/admin/positions/forms/schema"
import PositionsForm from "../../../features/admin/positions/forms/form"

export default function AdminPositionsUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<Position, Error>({
    queryKey: ["admiPositionData", id],
    queryFn: () => positionsService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: PositionsFormFields) => {
    // await apiPeopleAdd()
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
        <p className="text-red-600">Помилка: {queryError?.message}</p>
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
