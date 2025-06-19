import Button from "../../../shared/ui/button123/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { CityFormFields } from "../../../entities/admin/city/forms/schema"
import type { CityDetailResponse } from "../../../entities/admin/city/types/response.dto"
import { cityService } from "../../../entities/admin/city/services/service"
import CityForm from "../../../entities/admin/city/forms/form"
import { cityQueryKeys } from "../../../entities/admin/city/services/keys"
import AlertMessage, {
  AlertType,
} from "../../../shared/ui/alert-message/AlertMessage"

export default function AdminCityUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<CityDetailResponse, Error>({
    queryKey: cityQueryKeys.detail(id!),
    queryFn: () => cityService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: CityFormFields) => {
    await cityService.update(id!, data)
    navigate("..")
    return data
  }

  // Адаптируем данные под форму
  function mapToFormDefaults(obj: CityDetailResponse): Partial<CityFormFields> {
    return {
      ...obj,
      countryId: obj.country?.id,
    }
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
            <CityForm
              onSubmit={handleSubmit}
              defaultValues={mapToFormDefaults(data)}
              submitBtnName="Оновити"
            />
          </div>
        </div>
      )}
    </>
  )
}
