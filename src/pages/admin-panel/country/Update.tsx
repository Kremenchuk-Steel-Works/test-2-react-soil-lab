import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import CountryForm from '@/entities/admin/country/forms/form'
import type { CountryFormFields } from '@/entities/admin/country/forms/schema'
import { countryQueryKeys } from '@/entities/admin/country/services/keys'
import { countryService } from '@/entities/admin/country/services/service'
import type { CountryDetailResponse } from '@/entities/admin/country/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

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
    navigate('..')
    return data
  }

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

      {!isLoading && !isError && data && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <CountryForm onSubmit={handleSubmit} defaultValues={data} submitBtnName="Оновити" />
          </div>
        </div>
      )}
    </>
  )
}
