import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import CountryForm from '@/entities/admin/country/forms/form'
import type { CountryFormFields } from '@/entities/admin/country/forms/schema'
import { countryQueryKeys } from '@/entities/admin/country/services/keys'
import { countryService } from '@/entities/admin/country/services/service'
import type { CountryDetailResponse } from '@/entities/admin/country/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import Button from '@/shared/ui/button/Button'

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
      <div className="flex items-center justify-between">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate('..')}
        >
          <ArrowLeft className="h-5 w-5" /> <span>Назад</span>
        </Button>
      </div>

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
