import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { roleQueryKeys } from '@/entities/admin/roles/services/keys'
import { roleService } from '@/entities/admin/roles/services/service'
import type { RoleDetailResponse } from '@/entities/admin/roles/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function AdminRolesDetails() {
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<RoleDetailResponse, Error>({
    queryKey: roleQueryKeys.detail(id!),
    queryFn: () => roleService.getById(id!),
    enabled: !!id,
  })

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

      {!isLoading && !isError && data && (
        <div className="bg-white p-6 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Деталі</h2>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">ID</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.id}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Назва</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.name}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Опис</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.description}</dd>
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

            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Права доступу
              </dt>
              <dd className="mt-1 space-y-1 text-sm text-gray-900 dark:text-slate-300">
                {data.permissions.length > 0 ? (
                  <ul className="list-inside list-disc space-y-1">
                    {data.permissions.map((perm) => (
                      <div key={perm.id}>
                        <span className="font-semibold">{perm.name}</span> —{' '}
                        <span className="text-gray-600 dark:text-slate-400">
                          {perm.departmentName}
                        </span>
                      </div>
                    ))}
                  </ul>
                ) : (
                  <span>Немає прав доступу</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </>
  )
}
