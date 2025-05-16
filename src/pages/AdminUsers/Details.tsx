import Button from "../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Pen } from "lucide-react"
import type { User } from "../../types/User"
import { apiUsersDetail } from "../../services/user"
import { useQuery } from "@tanstack/react-query"

export default function AdminUsersDetails() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data: user,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<User, Error>({
    queryKey: ["userDetailsData", id],
    queryFn: () => apiUsersDetail(id!),
    enabled: !!id && /^\d+$/.test(id),
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
        {!isLoading && !isError && user && (
          <div className="bg-white dark:bg-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
              Деталі користувача
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  ID
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {user.id}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {user.email}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Повне ім'я
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {user.profile.first_name} {user.profile.last_name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Номер працівника
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {user.profile.employee_number}
                </dd>
              </div>
              {user.roles && user.roles.length > 0 && (
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Ролі
                  </dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {user.roles.map((r) => (
                      <span
                        key={r.id}
                        className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full"
                      >
                        {r.name}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {user.permissions && user.permissions.length > 0 && (
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Права доступу
                  </dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {user.permissions.map((p) => (
                      <span
                        key={p.id}
                        className="inline-block bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full"
                      >
                        {p.name}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Створено
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {new Date(user.created_at).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Оновлено
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {new Date(user.updated_at).toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <Button
                  className="flex items-center justify-center gap-1 whitespace-nowrap bg-orange-500 hover:bg-orange-600"
                  onClick={() => navigate("edit")}
                >
                  <Pen className="w-5 h-5" /> <span>Редагувати</span>
                </Button>
              </div>
            </dl>
          </div>
        )}
      </div>
    </>
  )
}
