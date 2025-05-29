import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Pen } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { CountryDetailResponse } from "../../../features/admin/country/types/response.dto"
import { countryService } from "../../../features/admin/country/services/service"

export default function AdminCountryDetails() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<CountryDetailResponse, Error>({
    queryKey: ["adminCountryData", id],
    queryFn: () => countryService.getById(id!),
    enabled: !!id,
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
      </div>

      <div>
        {isError && (
          <p className="text-red-600">Помилка: {queryError?.message}</p>
        )}
        {!isLoading && !isError && data && (
          <div className="bg-white dark:bg-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
              Деталі
            </h2>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  ID
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.id}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Код 2
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.code}
                </dd>
              </div>

              {data.code3 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Код 3
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                    {data.code3}
                  </dd>
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
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Назва
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.name}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Локальна назва
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.nameLocal}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Створено
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {new Date(data.createdAt).toLocaleString()}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Оновлено
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {new Date(data.updatedAt).toLocaleString()}
                </dd>
              </div>

              {data.cities && data.cities.length > 0 && (
                <div className="col-span-1 md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Міста
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300 space-y-1">
                    {data.cities.map((city) => (
                      <div key={city.id}>
                        <strong>{city.name}</strong> ({city.nameLocal})
                      </div>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            <div className="flex justify-between items-center py-2">
              <Button
                className="flex items-center justify-center gap-1 whitespace-nowrap bg-orange-500 hover:bg-orange-600"
                onClick={() => navigate("update")}
              >
                <Pen className="w-5 h-5" /> <span>Редагувати</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
