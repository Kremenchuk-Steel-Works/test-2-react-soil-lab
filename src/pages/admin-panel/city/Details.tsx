import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { cityQueryKeys } from '@/entities/admin/city/services/keys'
import { cityService } from '@/entities/admin/city/services/service'
import type { CityDetailResponse } from '@/entities/admin/city/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function AdminCityDetails() {
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

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

      {!isLoading && !isError && data && (
        <div className="bg-white p-6 dark:bg-gray-800">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">ID</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.id}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Країна</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {data.country.name}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Назва</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.name}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Локальна назва
              </dt>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Створено</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {new Date(data.createdAt).toLocaleString()}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Оновлено</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {new Date(data.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </>
  )
}
