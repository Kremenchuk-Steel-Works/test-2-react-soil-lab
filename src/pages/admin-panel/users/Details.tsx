import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { userQueryKeys } from '@/entities/admin-old/users/services/keys'
import { userService } from '@/entities/admin-old/users/services/service'
import type { UserDetailResponse } from '@/shared/api/soil-lab/model'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function AdminUsersDetails() {
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<UserDetailResponse, Error>({
    queryKey: userQueryKeys.detail(id!),
    queryFn: () => userService.getById(id!),
    enabled: !!id,
  })

  return (
    <>
      <div>
        {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

        {!isLoading && !isError && data && (
          <div className="bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Деталі
            </h2>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">ID</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.id}</dd>
              </div>

              {data.email && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.email}</dd>
                </div>
              )}

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.isActive ? 'Активний' : 'Неактивний'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Superuser</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.isSuperuser ? 'Так' : 'Ні'}
                </dd>
              </div>

              {data.lastLoginAt && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Останній вхід
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                    {new Date(data.lastLoginAt).toLocaleString()}
                  </dd>
                </div>
              )}

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

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Ролі</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.roles.length > 0 ? data.roles.map((r) => r.name).join(', ') : '—'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Дозволи</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.permissions.length > 0
                    ? data.permissions.map((p) => p.name).join(', ')
                    : '—'}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </>
  )
}
