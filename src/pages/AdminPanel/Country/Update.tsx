import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { countryService } from "../../../features/admin/country/services/service"
import type { CountryDetailResponse } from "../../../features/admin/country/types/response.dto"
import type { CountryFormFields } from "../../../features/admin/country/forms/schema"
import CountryForm from "../../../features/admin/country/forms/form"
import { countryQueryKeys } from "../../../features/admin/country/services/keys"
import AlertMessage, { AlertType } from "../../../components/AlertMessage"

export default function AdminCountryUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<CountryDetailResponse, Error>({
    queryKey: countryQueryKeys.detail(id!),
    queryFn: () => countryService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: CountryFormFields) => {
    await countryService.update(id!, data)
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
            <CountryForm
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
