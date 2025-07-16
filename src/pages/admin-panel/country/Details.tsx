import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { countryQueryKeys } from '@/entities/admin/country/services/keys'
import { countryService } from '@/entities/admin/country/services/service'
import type { CountryDetailResponse } from '@/entities/admin/country/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function AdminCountryDetails() {
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
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Код 2</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.code}</dd>
            </div>

            {data.code3 && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Код 3</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.code3}</dd>
              </div>
            )}

            {data.numericCode && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Номерний код
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.numericCode}
                </dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Назва</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.name}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Локальна назва
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.nameLocal}</dd>
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

            {data.cities && data.cities.length > 0 && (
              <div className="col-span-1 md:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Міста</dt>
                <dd className="mt-1 space-y-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.cities.map((city) => (
                    <div key={city.id}>
                      <strong>{city.name}</strong> ({city.nameLocal})
                    </div>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </>
  )
}
