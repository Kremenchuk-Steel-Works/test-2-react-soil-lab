import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Pen } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { Person } from "../../../features/admin/people/types"
import { peopleService } from "../../../features/admin/people/services/service"

export default function AdminPeopleDetails() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<Person, Error>({
    queryKey: ["adminPersonData", id],
    queryFn: () => peopleService.getById(id!),
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

              {data.email && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                    {data.email}
                  </dd>
                </div>
              )}

              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Повне ім'я
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.lastName} {data.firstName} {data.middleName ?? ""}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Стать
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.gender}
                </dd>
              </div>

              {data.birthDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Дата народження
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                    {new Date(data.birthDate).toLocaleDateString()}
                  </dd>
                </div>
              )}

              {data.phoneNumber && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Телефон
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                    {data.phoneNumber}
                  </dd>
                </div>
              )}

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

              {data.photoUrl && (
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Фото
                  </dt>
                  <dd className="mt-1">
                    <img
                      src={data.photoUrl}
                      alt="Фото користувача"
                      className="h-32 w-32 object-cover rounded"
                    />
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
