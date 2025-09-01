import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import CityForm from '@/entities/admin/city/forms/form'
import type { CityFormFields } from '@/entities/admin/city/forms/schema'
import { cityQueryKeys } from '@/entities/admin/city/services/keys'
import { cityService } from '@/entities/admin/city/services/service'
import type { CityDetailResponse } from '@/entities/admin/city/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

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

  const handleSubmit = useCallback(
    async (data: CityFormFields): Promise<void> => {
      await cityService.update(id!, data)
      await navigate('..')
    },
    [navigate, id],
  )

  // Адаптируем данные под форму
  function mapToFormDefaults(obj: CityDetailResponse): Partial<CityFormFields> {
    return {
      ...obj,
      countryId: obj.country?.id,
    }
  }

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

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
